import storesX from '../dist/index.mjs';
import tape from 'tape';
import { writable } from 'svelte/store';

// TODO: need to write more test to cover all possible cases

const store1 = {
  noStore: ['apiKey'],
  state: {
    apiKey: '12345',
  },
  actions: {
    login({ dispatch, state }, { apiKey, username }) {
      //doing it
      dispatch('isLoggedIn', state.apiKey === apiKey, username);
      //state.apiKey.get() will be error since apiKey is not a store
    },
  },
};

const store2 = {
  storeType: 'writable',
  state: {
    isLoggedIn: false,
    username: 'guess', //no need to set any getters,mutations,actions we only want the defaults
  },
  getters: {
    isLoggedIn(state) {
      // this will be created be default(overighting it) unless disabled
      return state.isLoggedIn;
    },
  },
  mutations: {
    isLoggedIn(state, val) {
      // this will be created be default(overighting it) unless disabled
      state.isLoggedIn.set(val);
    },
  },
  actions: {
    //overighting it the default
    isLoggedIn({ state, commit, dispatch, g }, val = false, username = 'guess') {
      commit('username', username);
      commit('isLoggedIn', val);
    },
  },
};
tape('making sure things are intact', async (t) => {
  const { state, mutations, actions, getters } = storesX([store1, store2]);
  const {
    mutations: mutations2,
    actions: actions2,
    getters: getters2,
  } = storesX([
    { defaults: false, ...store1 },
    { defaults: false, ...store2 },
  ]);
  t.equal(Object.keys(state).length, 3, 'state items are intact');

  t.equal(Object.keys(mutations).length, 3, 'mutations are intact including defaults');
  t.equal(Object.keys(mutations2).length, 1, 'mutations are intact excluding defaults');

  t.equal(Object.keys(actions).length, 4, 'actions are intact including defaults');
  t.equal(Object.keys(actions2).length, 2, 'actions are intact excluding defaults');

  t.equal(Object.keys(getters).length, 3, 'getters are intact including defaults');
  t.equal(Object.keys(getters2).length, 1, 'getters are intact excluding defaults');
});
tape('getting state with g', async (t) => {
  const { g } = storesX([store1, store2]);
  t.equal(g('apiKey'), '12345');
  t.same(typeof g('isLoggedIn'), typeof writable(), 'type of store is a writable svelte store');
  t.true(typeof g('username').get() === 'string', 'got to store value with the custom get method');
  t.end();
});

tape('mutating state with commit', async (t) => {
  const { commit, g } = storesX([store1, store2]);

  t.notEqual('apiKey', 'abcde', 'before mutating to new static value');
  commit('apiKey', 'abcde');
  t.equal(g('apiKey'), 'abcde', 'mutated a new static value');

  t.notEqual(g('username').get(), 'userX', 'before mutating to new value');
  commit('username', 'userX');
  t.equal(g('username').get(), 'userX', 'mutated to new value');
});

tape('changing state by dispatching actions', async (t) => {
  {
    const { g } = storesX([store1, store2]);
    t.test('before logging in', async (t) => {
      t.equal(g('username').get(), 'guess', "username is 'guess'");
      t.equal(g('isLoggedIn').get(), false, "isLoggedIn is 'false'");
    });
  }
  {
    const { dispatch, g } = storesX([store1, store2]);
    dispatch('login', { apiKey: g('apiKey'), username: 'userZ' }).then(() =>
      t.test('after logging in', async (t) => {
        t.equal(g('username').get(), 'userZ', "username is NOT 'guess'");
        t.equal(g('isLoggedIn').get(), true, "isLoggedIn is 'True'");
      })
    );
  }
});
