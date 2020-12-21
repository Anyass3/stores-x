# stores-x
This is inspired by Vuex

It's for now a minimal implementation of the vuex

It uses the svelte store

It makes working with svelte stores somewhat clean and organised

Also the compiled version can be used in any other js library

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
example in svelte
> it will be similar in other js frameworks

store1.js
```js
export default {
	state: { // each state value is going to a writable svelte store
		camera: 'off',
	},
	getters: { //
		getCameraState(state){
			return state.camera
		},
	},
	mutations: {
		setCameraState(state, val){
			state.camera.set(val)
		},
	},
	actions: {
		cameraState({commit}, val){
			commit('setCameraState', val)
		},
	}
}
```
you may can add other state values, getters etc


store2.js
```js
export default {
	state: {
		startedVideoStream: false,
		other: value
	},
	getters: {
		videoIsStreaming(state){
			return state.startedVideoStream
		},
	},
	mutations: {
		setStreamingVideo(state, val){
			state.startedVideoStream.set(val)
		},
	},
	actions: {
		streamingVideo({commit}, val){
			commit('setStreamingVideo', val)
		},
	}
}
```
you may can add other state values, getters etc


now in the main-store-flie

stores.js
```js
import svelteX from 'stores-x';

import store1 from './store1';
import store2 from './store2';

export default svelteX([store1,store2])
```

now in your svelte components

com1.svelte
```svelte
<script>
	import stores from './stores.js'
	const {getCameraState, videoIsStreaming} = stores.getters
	const { streamingVideo, cameraState} = stores.actions
  
	$: camera=getCameraState()
	$: streaming=videoIsStreaming()
</script>

<p>camera is {$camera}</p>
<p>video is {$streaming?'':'NOT'} streaming</p>

<div>
<button on:click={()=>cameraState('on')}>on camera</button>
<button on:click={()=>cameraState('off')}>off camera</button>
</div>

<div>
<button on:click={()=>streamingVideo(true)}>start streaming</button>
<button on:click={()=>streamingVideo(false)}>stop streaming</button>
</div>
```


[check out demo](https://svelte.dev/repl/3916c946d06e4289b28992ea625c5092?version=3.31.0)
