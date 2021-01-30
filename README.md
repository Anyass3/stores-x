# stores-x

This is inspired by [Vuex](https://github.com/vuejs/vuex)

It's for now a minimal implementation of the vuex

It uses the svelte store

It makes working with svelte stores somewhat clean and organised

Also the compiled version should be able to work in any other js web app(not tested yet)

# installation

`npm install stores-x`

# Also you can try cdn

```html
<script src="https://cdn.jsdelivr.net/npm/stores-x/dist/index.min.js"><script>
```

for old browsers

```html
<script src="https://cdn.jsdelivr.net/npm/stores-x/dist/old.index.min.js"><script>
```

module

```html
<script src="https://cdn.jsdelivr.net/npm/stores-x/dist/index.min.mjs"><script>
```

# Usage

> [check out the svelte relp demo](https://svelte.dev/repl/3916c946d06e4289b28992ea625c5092?version=3.31.0)

> it should be similar in other js frameworks(not tested yet)

# API

##### store.state => each individual state defaults as a **writable svelte store** but with an additional `get` property to get the current state value.

example: `store.get()` // gets current value by making a temporal store subscription

##### store.mutations => They mutate the state values. Simply put they change or set state values. The are funtions.

declared like This :

```javascript
mutationName(state,...args){}
```

run as

```javascript
commit('mutationName', val);
or;
mutationName(val);
```

##### store.actions => The do tasks like any other function. They can **commit** 'store.mutations' also can **dispatch** store.actions.

declared like This :

```javascript
actionName({state, commit, dispatch, g },...args){}
```

run as

```javascript
dispatch('actionName', ...args);
or;
actionName(...args);
```

##### store.getters => They are used to get state values or any other custom one

declared like This :

```javascript
getterName(state,...args:Optional){}
```

run as

```javascript
g('getterName');
or;
getterName();
```

##### store.noStore => this an array of state you don't wish to be a **writable svelte store**. **It's just a config**

##### store.defaults => This controls the default settings (ie. whether to disable the default getter or mutation for a particular state). **It's just a config**

        if the default mutation for a particular state is disabled the corresponding default action will also be disabled.

##### commit => executes/runs a mutation and might return anything

like:

```javascript
commit('mutationName', val);
```

##### dispatch => executes/runs an action and returns Promise

like:

```javascript
dispatch('mutationName', ...args);
```

# Example

```javascript
store = {
  state: {
    isLogedIn: false,
  },
  getters: {
    getIslogedIn(state) {
      // this will be created be default unless disabled
      return state.isLogedIn;
    },
  },
  mutations: {
    setIsLogedIn(state, val) {
      // this will be created be default unless disabled
      state.isLogedIn.set(val);
    },
  },
  actions: {
    setIsLogedIn({ state, commit, dispatch, g }, val) {
      // this will be created be default unless disabled
      commit('setIsLogedIn', val);
    },
  },
};
```
