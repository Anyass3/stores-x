import { writable } from 'svelte/store';
import {
  Getters,
  Mutations,
  Actions,
  getGetters,
  getMutations,
  getActions,
  Dispatcher,
} from './utils';

export default (mystores, prefix = {}) => {
  const stores = (value) =>
    mystores.reduce((st, store) => {
      return { ...st, ...store[value] };
    }, {});
  const noStore = mystores.reduce((st, store) => {
    return [...st, ...(store['noStore'] ? store['noStore'] : [])];
  }, []);
  let storeState = stores('state');
  for (let item in storeState) {
    storeState[item] = noStore.includes(item) ? storeState[item] : writable(storeState[item]);
  }

  const store = writable(storeState);
  let _store_;
  store.subscribe((value) => {
    _store_ = value;
  })();

  const mutations = {
    ...Mutations(_store_, prefix.mutation, mystores),
    ...getMutations(stores('mutations'), _store_),
  };

  const getters = {
    ...Getters(_store_, prefix.getter, mystores),
    ...getGetters(stores('getters'), _store_),
  };
  const g = (getter, ...args) => getters[getter](...args); //gets Getters

  const { actions, commit, dispatch } = getActions(
    { ...Actions(mutations, prefix.action), ...stores('actions') },
    {
      dispatch: (action, ...args) => Dispatcher(actions, action, ...args),
      commit: (mutation, ...args) => mutations[mutation](...args),
      state: _store_,
      g,
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
    g,
  };
};
