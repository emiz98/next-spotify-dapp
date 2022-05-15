import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  relist_song: {},
  relist_state: false,
}

export const relistSong = createSlice({
  name: 'relist_song',
  initialState,
  reducers: {
    setRelistSong: (state, action) => {
      state.relist_song = action.payload.song
      state.relist_state = action.payload.state
    },
  },
})

export const { setRelistSong } = relistSong.actions
export const select_relistSong = (state) => state.relistSong.relist_song
export const select_relistState = (state) => state.relistSong.relist_state
export default relistSong.reducer
