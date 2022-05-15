import { configureStore } from '@reduxjs/toolkit'
import currentSongReducer from './slices/currentSong'
import hoverSongReducer from './slices/hoverSong'
import uploadSongReducer from './slices/ModelSlices'
import relistSongReducer from './slices/RelistSlice'

export const store = configureStore({
  reducer: {
    currentSong: currentSongReducer,
    hoverSong: hoverSongReducer,
    uploadSong: uploadSongReducer,
    relistSong: relistSongReducer,
  },
})

// store.subscribe(saveState)

// function saveState() {
//     try {
//         const serializedState = JSON.stringify(store.getState())
//     } catch (error) {
//         console.log(error);
//     }
// }

export default store
