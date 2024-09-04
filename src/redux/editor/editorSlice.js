import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPlaying: false,
  audioDurationInSeconds: 0,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setIsPlaying: (state, { payload }) => {
      state.isPlaying = payload;
    },
    setAudioDurationInSeconds: (state, { payload }) => {
      state.audioDurationInSeconds = payload;
    },
  },
});

export const { setIsPlaying, setAudioDurationInSeconds } = editorSlice.actions;

export default editorSlice.reducer;
