import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  upload_song: false,
}

export const uploadSong = createSlice({
  name: 'upload_song',
  initialState,
  reducers: {
    setUploadSong: (state, action) => {
      state.upload_song = action.payload
    },
  },
})

export const { setUploadSong } = uploadSong.actions
export const select_uploadSong = (state) => state.uploadSong.upload_song
export default uploadSong.reducer
