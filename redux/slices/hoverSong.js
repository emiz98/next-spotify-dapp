import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hover_song: '#065120',
}

export const hoverSong = createSlice({
  name: 'hover_song',
  initialState,
  reducers: {
    setHoverSong: (state, action) => {
      state.hover_song = action.payload
    },
  },
})

export const { setHoverSong } = hoverSong.actions
export const select_hoverSong = (state) => state.hoverSong.hover_song
export default hoverSong.reducer
