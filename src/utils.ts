const getName = <P extends string, S extends string>(prefix: P, str: S) =>
  prefix ? prefix + str.slice(0, 1).toUpperCase() + str.slice(1) : str;

export const createDefaultGetters = (state, prefix = '', stores) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'getters')) obj[getName(prefix, item)] = () => state[item];
  return obj;
};

export const createDefaultMutations = (state, prefix = '', stores, noStore) => {
  let obj = {};
  for (let item in state)
    if (checkDefault(stores, item, 'mutations'))
      obj[getName(prefix, item)] = (val) =>
        noStore.includes(item) ? (state[item] = val) : state[item]['set'](val);
  return obj;
};

export const createDefaultActions = (state, prefix, stores) => {
  let obj = {};
  for (let item in state) {
    if (checkDefault(stores, item, 'mutations'))
      obj[getName(prefix.actions || '', item)] = ({ commit }, val) =>
        commit(getName(prefix.mutations || '', item), val);
  }
  return obj;
};

export const getMutations = <A, S>(
  _mutations: Record<string, (state: S, ...args: A[]) => void>,
  state
) => {
  let mutations: Record<string, (...args: A[]) => void>;
  for (let item in _mutations)
    mutations = { ...mutations, [item]: (...args) => _mutations[item](state, ...args) };
  return mutations;
};

export const getActions = <A, S, B extends Record<string, (actionObj: S, ...args: A[]) => any>>(
  _actions: B,
  actionObj: S
) => {
  let actions = {} as Record<keyof B, InlineMethod<ValueOf<B>>>;
  let action: keyof B;
  for (action in _actions) {
    const _action = (...args: A[]): ReturnType<ValueOf<B>> => _actions[action](actionObj, ...args);
    actions = { ...actions, [action]: _action };
  }
  return actions;
};

export const getGetters = (_getters, state) => {
  let getters;
  for (let item in _getters)
    getters = { ...getters, [item]: (...args) => _getters[item](state, ...args) };
  return getters;
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

export const Dispatcher = (actions, action, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      let result = typeof action === 'function' ? action(...args) : actions[action](...args);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

// export const DispatcherArgs = ({ state, mutations, actions, g }) => ({
//   dispatch(action, ...args) {
//     return new Promise((resolve, reject) => {
//       try {
//         console.log('dispatch-args',)
//         let result =
//           typeof action === 'function' ? action(this, ...args) : actions[action](this, ...args);
//         resolve(result);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   },
//   commit: (mutation, ...args) => mutations[mutation](...args),
//   state,
//   g,
// });
