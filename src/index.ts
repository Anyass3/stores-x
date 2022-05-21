import * as customStores from './custom-stores';

import {
  createDefaultGetters,
  createDefaultMutations,
  createDefaultActions,
  getGetters,
  getMutations,
  getActions,
} from './utils';

const spread = (a = '', b = 0, c = 'list') => {
  return b;
};
const test: InlineMethod<typeof spread> = (b, c) => {
  return b;
};
test(1, '');

declare type dispatcherArgs<
  S,
  G extends Record<keyof any, (...args) => any>,
  M extends Record<keyof any, (...args) => any>,
  A extends Record<keyof any, (...args) => any>
> = {
  state: S;
  g: (getter: keyof G, ...args: ExcludeFirstParameter<ValueOf<M>>) => any;
  commit: (mutation: keyof M, ...args: ExcludeFirstParameter<ValueOf<M>>) => any;
  dispatch: (
    action: keyof A,
    ...args: ExcludeFirstParameter<ValueOf<A>>
  ) => Promise<ReturnType<ValueOf<A>>>;
};

const StoreX = <
  Default extends Defaults,
  NoStore extends boolean | string[],
  State extends Record<string, any>,
  Getters extends Record<string, (state: State, ...args) => any>,
  Mutations extends Record<string, (state: State, ...args) => any>,
  Actions extends Record<
    string,
    (opts: dispatcherArgs<State, Getters, Mutations, Actions>, ...args) => any
  >,
  P extends string
>(
  mystores: {
    defaults?: Default;
    noStore?: NoStore;
    state?: State;
    getters?: Getters;
    mutations?: Mutations;
    actions?: Actions;
  }[],
  prefix?: Prefix<P>
) => {
  const storeState = mystores.reduce((arr, store) => {
    return { ...arr, ...store['state'] };
  }, {} as State);
  const storeGetters = mystores.reduce((arr, store) => {
    return { ...arr, ...store['getters'] };
  }, {} as Getters);
  const storeMutations = mystores.reduce((arr, store) => {
    return { ...arr, ...store['mutations'] };
  }, {} as Mutations);
  const storeActions = mystores.reduce((arr, store) => {
    return { ...arr, ...store['actions'] };
  }, {} as Actions);

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
    ...getMutations(storeMutations, storeState),
  };

  const getters = {
    ...createDefaultGetters(storeState, prefix.getters, mystores),
    ...getGetters(storeGetters, storeState),
  };

  const _actions = {
    ...createDefaultActions(storeState, prefix, mystores),
    ...storeActions,
  };

  const g = (getter, ...args) => getters[getter](...args); //gets getters
  const commit = (mutation, ...args) => mutations[mutation](...args);

  const dispatch = (action: keyof typeof _actions | ValueOf<typeof _actions>, ...args) => {
    return new Promise((resolve: (value: ReturnType<ValueOf<typeof _actions>>) => void, reject) => {
      try {
        let result =
          typeof action === 'function'
            ? action(dispatcherArgs, ...args)
            : _actions[action](dispatcherArgs, ...args);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };
  const dispatcherArgs = { state: storeState, g, commit, dispatch };
  const actions = getActions(_actions, dispatcherArgs);

  return {
    mutations,
    actions,
    getters,
    ...dispatcherArgs,
  };
};

const store = StoreX([
  {
    state: {
      hi: 2,
    },
    mutations: {
      mu({}) {
        return 2;
      },
    },
    actions: {
      fn({ state }, a: string) {
        return state.hi;
      },
      x({}, hi) {
        return 5;
      },
    },
  },
]);

store.actions.fn;
let p = store.dispatch('fn', 2);
store.dispatch('fn', '');
