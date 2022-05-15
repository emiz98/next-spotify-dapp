import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current_song: null,
  queue: null,
}

export const currentSong = createSlice({
  name: 'current_song',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.current_song = action.payload
    },
    setQueue: (state, action) => {
      state.queue = action.payload
    },
  },
})

export const { setCurrentSong, setQueue } = currentSong.actions
export const select_currentSong = (state) => state.currentSong.current_song
export const select_queue = (state) => state.currentSong.queue
export default currentSong.reducer
