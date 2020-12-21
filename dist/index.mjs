function noop() { }
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

const subscriber_queue = [];
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

const getMutations = (obj, state) => {
  let _obj_;
  for (let item in obj) {
    _obj_ = { ..._obj_, [item]: (arg) => obj[item](state, arg) };
  }
  return _obj_;
};


const getActions = (obj, actionObj) => {
  let _obj_;
  for (let item in obj) {
    _obj_ = { ..._obj_, [item]: (arg) => obj[item](actionObj, arg) };
  }
  return _obj_;
};


const getGetters = (obj, state) => {
  let _obj_;
  for (let item in obj) {
    _obj_ = { ..._obj_, [item]: () => obj[item](state) };
  }
  return _obj_;
};




var index = (mystores) => {
  const stores = (value) =>
    mystores.reduce((st, store) => {
      return { ...st, ...store[value] };
    }, {});

  let storeState = stores("state");
  for (let item in storeState) storeState[item] = writable(storeState[item]);
  
  const store = writable(storeState);
  let _store_;
  store.subscribe((value) => {
    _store_ = value;
  })();

  const mutations = getMutations(stores("mutations"), _store_),
    actions = getActions(stores("actions"), {
      dispatch(action) {
        (actions[action] || mutations[action])();
      },
      commit(mutation, val) {
        mutations[mutation](val);
      },
    });
    
  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    mutations,
    actions,
    getters: getGetters(stores("getters"), _store_),
  };
};

export default index;
