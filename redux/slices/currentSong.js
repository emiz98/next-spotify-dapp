import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current_song: null,
}

export const currentSong = createSlice({
  name: 'current_song',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.current_song = action.payload
    },
  },
})

export const { setCurrentSong } = currentSong.actions
export const select_currentSong = (state) => state.currentSong.current_song
export default currentSong.reducer
