const getName = (prefix, str) => prefix + str.slice(0, 1).toUpperCase() + str.slice(1);

export const Getters = (state, prefix = 'get', stores) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'getters')) obj[getName(prefix, item)] = () => state[item];
  return obj;
};

export const Mutations = (state, prefix = 'set', stores) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'mutations'))
      obj[getName(prefix, item)] = (val) => state[item]['set'](val);
  return obj;
};

export const Actions = (mutations, prefix) => {
  let obj = {};
  for (let item in mutations) {
    obj[prefix ? getName(prefix, item) : item] = ({ commit }, val) => commit(item, val);
  }
  return obj;
};

export const getMutations = (obj, state) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: (...args) => obj[item](state, ...args) };
  return _obj_;
};

export const getActions = (obj, actionObj) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: (...args) => obj[item](actionObj, ...args) };
  return { actions: _obj_, dispatch: actionObj['dispatch'], commit: actionObj['commit'] };
};

export const getGetters = (obj, state) => {
  let _obj_;
  for (let item in obj) _obj_ = { ..._obj_, [item]: () => obj[item](state) };
  return _obj_;
};

const checkDefault = (stores, state, type) => {
  const item = stores.find((item) => Object.keys(item.state).includes(state));
  const config = item ? (item.defaults !== undefined ? item.defaults : true) : true;
  // 	console.log(state, item.defaults, config)
  const hmm =
    typeof config === 'boolean'
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
  console.log(state, type, hmm);
  return hmm;
};

export const Dispatcher = (actions, action, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      typeof action === 'function' ? action(...args) : actions[action](...args);
      resolve('OK');
    } catch (err) {
      reject(err);
    }
  });
};
