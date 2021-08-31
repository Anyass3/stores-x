# stores-x

This is inspired by [Vuex](https://github.com/vuejs/vuex)

It has a similar api as vuex and uses the svelte store( or your own custom svelte store like) and makes working with svelte stores somewhat clean and organised

> The compiled version should be able to work in any other js web app(not tested yet)

# installation

`npm install stores-x`

# or try cdn

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

# Usage demo

> [check out the svelte relp demo](https://svelte.dev/repl/3916c946d06e4289b28992ea625c5092?version=3.31.0)

# API

### store.state

each individual state defaults as a **writable svelte store** but with an additional `get` property to get the current state value.

example: `storeItem.get()` // gets current value by making a temporal store subscription

### store.mutations

They mutate the state values. Simply put they change or set state values. The are funtions.

declared like This :

```javascript
mutations{
  ...
  mutationName(state,...args){}
  ...
 }
```

run as

```javascript
commit('mutationName', val);
or;
mutations.mutationName(val);
```

### store.actions

The do tasks like any other function. They can **commit** 'store.mutations' also can **dispatch** store.actions.

declared like This :

```javascript
actions{
  actionName({state, commit, dispatch, g },...args){}
 }
```

run as

```javascript
dispatch('actionName', ...args);

// or

actions.actionName(...args);
```

### store.getters

They are used to get state values or any other custom one

declared like This :

```javascript
getters{
  ...
  getterName(state,...args:Optional){}
  ...
 }
```

run as

```javascript
g('getterName');
or;
getters.getterName();
```

### store.noStore

this an array of state items which you don't wish to be a **any store**. That is the item will be reactive. **It's a config**

### store.defaults

This controls the default settings (ie. whether to disable the default getter or mutation for a particular state). **It's a config**

> If the default mutation for a particular state item is disabled the corresponding default action will also be disabled.

`default: true`
All item's getters, mutations, actions will be created automatically. This is the default`

or

```javascript
default: {
  item1: true, //getters, mutations, actions will be created automatically
  item2: {getters: false}, //mutations, actions will be created automatically
  item3: false //no default getters, mutations, actions will be created
 }
```

### store.storeType

**It's a config**
this declares the type of store you want for an storeitem

`storeType: 'writable' // all items will be writable. This is the default` 
or
```javascript
storeType: {
  item1: 'writable',
  item2: 'sessionPersistantStore',
  item3: customStore
 } 
  //each item defaults to 'writable'`
```

options:

- 'writable' => svelteWritable store with a get method
- 'sessionPersistantStore' => uses sessionStorage but still reactive like any other svelte store
- 'localPersistantStore' => uses localStorage but still reactive like any other svelte store
- a custom store function

### commit

is a function that executes/runs a mutation

like:

```javascript
commit('mutationName', val);
```

### dispatch

is a function that executes/runs an action and returns Promise

like:

```javascript
dispatch('mutationName', ...args);
```

# Example

```javascript
import storesX from 'stores-x';

store1 = {
  noStore: ['apiKey'],
  state: {
    apiKey: 'string',
  },
  actions: {
    doThatThing({ dispatch, state }) {
      //doing it
      dispatch('isLoggedIn', state.apiKey);
      //state.apiKey.get() will be error since apiKey is not a store
    },
  },
};

store2 = {
  storeType: 'writable',
  state: {
    isLoggedIn: false,
  },
  getters: {
    islogedIn(state) {
      // this will be created be default unless disabled
      return state.isLoggedIn;
    },
  },
  mutations: {
    isLoggedIn(state, val) {
      // this will be created be default unless disabled
      state.isLoggedIn.set(val);
    },
  },
  actions: {
    isLoggedIn({ state, commit, dispatch, g }, val) {
      // this will be created be default unless disabled
      // logging in
      commit('isLoggedIn', val);
    },
  },
};

const store = storesX([store1, store2]);

const apiKey = store.g('apiKey'); // apiKey is getter is created automatically by default
const isLoggedIn = store.g('isLoggedIn');

console.log(apiKey); // logs => 'string'

console.log(isLoggedIn.get()); // logs => true|false
// or if in *.svelte
console.log($isLoggedIn); // logs => true|false
```

if you want you can give the defaults a prefix

```javascript
store = storesX([store1, store2], { getters: 'get', mutations: 'set', actions: 'set' });
// so now
apiKey = store.g('getApiKey');
store.commit('setIsLoggedIn', val);
```
