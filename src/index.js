import * as customStores from './custom-stores';

import {
  createDefaultGetters,
  createDefaultMutations,
  createDefaultActions,
  getGetters,
  getMutations,
  getActions,
  Dispatcher,
  // DispatcherArgs,
} from './utils';

export default (mystores, prefix = {}) => {
  const stores = (value) =>
    mystores.reduce((arr, store) => {
      return { ...arr, ...store[value] };
    }, {});
  let storeState = stores('state');
  const getStoreType = (_storeType, item) => {
    // gets state items store type
    if (typeof _storeType === 'string') {
      if (_storeType.includes('Persistant')) _storeType = customStores[_storeType](item);
      else _storeType = customStores[_storeType];
    }
    _storeType = _storeType || customStores.writable;
    return _storeType;
  };
  const storeTypes = mystores.reduce((typesObj, store) => {
    // gets and sets state items store type
    let _storeType = store['storeType'] || customStores.writable;
    let _storeTypes = {};
    if (typeof _storeType === 'function' || typeof _storeType === 'string') {
      for (let item in store.state) {
        _storeTypes[item] = getStoreType(_storeType, item);
      }
      return { ...typesObj, ..._storeTypes };
    } else {
      for (let item in store.state) {
        _storeTypes[item] = getStoreType(_storeType[item], item);
      }
      return { ...typesObj, ..._storeTypes };
    }
  }, []);
  const noStore = mystores.reduce((arr, store) => {
    // gets all state items which should be static
    if (store['noStore'] === true) {
      store['noStore'] = Object.keys(store.state);
    }
    return [...arr, ...(store['noStore'] ? store['noStore'] : [])];
  }, []);

  // setting state items
  for (let item in storeState) {
    storeState[item] = noStore.includes(item)
      ? storeState[item]
      : storeTypes[item](storeState[item]);
  }

  const mutations = {
    ...createDefaultMutations(storeState, prefix.mutations, mystores, noStore),
    ...getMutations(stores('mutations'), storeState),
  };

  const getters = {
    ...createDefaultGetters(storeState, prefix.getters, mystores),
    ...getGetters(stores('getters'), storeState),
  };

  const _actions = {
    ...createDefaultActions(storeState, prefix, mystores),
    ...stores('actions'),
  };

  const g = (getter, ...args) => getters[getter](...args); //gets getters
  const commit = (mutation, ...args) => mutations[mutation](...args);

  function dispatch(action, ...args) {
    return new Promise((resolve, reject) => {
      try {
        // console.log('dispatch-args', args);
        let result =
          typeof action === 'function'
            ? action(dispatcherArgs, ...args)
            : _actions[action](dispatcherArgs, ...args);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
  const dispatcherArgs = { state: storeState, g, commit, dispatch };
  const { actions } = getActions(_actions, dispatcherArgs);

  return {
    mutations,
    actions,
    getters,
    ...dispatcherArgs,
  };
};
