import { writable } from "svelte/store";

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
export default (mystores) => {
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
