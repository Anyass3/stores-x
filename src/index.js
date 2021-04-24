import { Writable } from './custom-store';

import {
  createDefaultGetters,
  createDefaultMutations,
  createDefaultActions,
  getGetters,
  getMutations,
  getActions,
  Dispatcher,
} from './utils';

export default (mystores, prefix = {}) => {
  const stores = (value) =>
    mystores.reduce((arr, store) => {
      return { ...arr, ...store[value] };
    }, {});
  const noStore = mystores.reduce((arr, store) => {
    return [...arr, ...(store['noStore'] ? store['noStore'] : [])];
  }, []);
  let storeState = stores('state');
  for (let item in storeState) {
    storeState[item] = noStore.includes(item) ? storeState[item] : Writable(storeState[item]);
  }

  const mutations = {
    ...createDefaultMutations(storeState, prefix.mutation, mystores, noStore),
    ...getMutations(stores('mutations'), storeState),
  };

  const getters = {
    ...createDefaultGetters(storeState, prefix.getter, mystores),
    ...getGetters(stores('getters'), storeState),
  };
  const g = (getter, ...args) => getters[getter](...args); //gets getters

  const { actions, commit, dispatch } = getActions(
    { ...createDefaultActions(mutations, prefix.action), ...stores('actions') },
    {
      dispatch: (action, ...args) => Dispatcher(actions, action, ...args),
      commit: (mutation, ...args) => mutations[mutation](...args),
      state: storeState,
      g,
    }
  );

  return {
    state: storeState,
    mutations,
    actions,
    getters,
    dispatch,
    commit,
    g,
  };
};
