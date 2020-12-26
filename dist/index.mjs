function noop() { }
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const getName = (prefix, str) => prefix + str.slice(0, 1).toUpperCase() + str.slice(1);

const Getters = (state, prefix = 'get', stores) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'getters')) obj[getName(prefix, item)] = () => state[item];
  return obj;
};

const Mutations = (state, prefix = 'set', stores) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'mutations'))
      obj[getName(prefix, item)] = (val) => state[item]['set'](val);
  return obj;
};

const Actions = (mutations, prefix) => {
  let obj = {};
  for (let item in mutations) {
    obj[prefix ? getName(prefix, item) : item] = ({ commit }, val) => commit(item, val);
  }
  return obj;
};

const getMutations = (obj, state) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: (...args) => obj[item](state, ...args) };
  return _obj_;
};

const getActions = (obj, actionObj) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: (...args) => obj[item](actionObj, ...args) };
  return { actions: _obj_, dispatch: actionObj['dispatch'], commit: actionObj['commit'] };
};

const getGetters = (obj, state) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: (...args) => obj[item](state, ...args) };
  return _obj_;
};

const checkDefault = (stores, state, type) => {
  const item = stores.find((item) => Object.keys(item.state).includes(state));
  const config = item ? (item.defaults !== undefined ? item.defaults : true) : true;
  return typeof config === 'boolean'
    ? config
    : typeof config === 'object'
    ? typeof config[state] === 'object'
      ? config[state][type] !== undefined
        ? config[state][type]
        : true
      : config[state] !== undefined
      ? config[state]
      : true
    : true;
};

const Dispatcher = (actions, action, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      let result = typeof action === 'function' ? action(...args) : actions[action](...args);
      resolve(result ? result : 'OK');
    } catch (err) {
      reject(err);
    }
  });
};

var index = (mystores, prefix = {}) => {
  const stores = (value) =>
    mystores.reduce((st, store) => {
      return { ...st, ...store[value] };
    }, {});

  let storeState = stores('state');
  for (let item in storeState) storeState[item] = writable(storeState[item]);

  const store = readable(storeState);
  let _store_;
  store.subscribe((value) => {
    _store_ = value;
  })();

  const getters = {
    ...Getters(_store_, prefix.getter, mystores),
    ...getGetters(stores('getters'), _store_),
  };

  const mutations = {
    ...Mutations(_store_, prefix.mutation, mystores),
    ...getMutations(stores('mutations'), _store_),
  };

  const { actions, commit, dispatch } = getActions(
    { ...Actions(mutations, prefix.action), ...stores('actions') },
    {
      dispatch: (action, ...args) => Dispatcher(actions, action, ...args),
      commit: (mutation, ...args) => mutations[mutation](...args),
      state: _store_,
      g: (getter, ...args) => getters[getter](...args),
    }
  );

  return {
    state: _store_,
    subscribe: store.subscribe,
    mutations,
    actions,
    getters,
    dispatch,
    commit,
  };
};

export default index;
