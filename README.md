# svelte-storeX
This is inspired by Vuex

It's for now a minimal implementation of the vuex

It uses the svelte store

It makes working with svelte stores somewhat clean and organised

# Usage
example:

store1.js
```js
export default {
	state: { // each state value is going to a writable svelte store
		camera: 'off',
		audio: 'off'
	},
	getters: { //
		getCameraState(state){
			return state.camera
		},
		getAudioState(state){
			return state.audio
		},
	},
	mutations: {
		setCameraState(state, val){
			state.camera.set(val)
		},
		setAudioState(state, val){
			state.audio.set(val)
		},
	},
	actions: {
		cameraState({commit}, val){
			commit('setCameraState', val)
		},
		AudioState(state, val){
			state.audio.set(val)
		}
	}
}
```
store2.js
```js
export default {
	state: {
		startedVideoStream: false,
		startedAudioStream: false
	},
	getters: {
		videoIsStreaming(state){
			return state.startedVideoStream
		},
		audioIsStreaming(state){
			return state.startedAudioStream
		}
	},
	mutations: {
		setStreamingVideo(state, val){
			state.startedVideoStream.set(val)
		},
		setStreamingAudio(state, val){
			state.startedAudioStream.set(val)
		},
	},
	actions: {
		streamingVideo({commit}, val){
			commit('setStreamingVideo', val)
		},
		streamingAudio({commit}, val){
			commit('setStreamingAudio', val)
		},
	}
}
```
now in the main-store-flie

stores.js
```js
import svelteX from 'svelteX';

import store1 from './store1';
import store2 from './store2';

export default sveltex([store1,store2])
```

now in your svelte components
com1.svelte
```svelte
<script>
	import stores from './stores.js'
  const {getCameraState, getAudioState, videoIsStreaming, audioIsStreaming} = stores.getters
  const {streamingVideo, AudioState, streamingAudio,cameraState} = stores.actions
  
  
	$: cameraState=getCameraState()
	$: audioState=getAudioState()
</script>
```
