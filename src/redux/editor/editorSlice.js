import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPlaying: false,
  audioDurationInSeconds: 0,
  fileName: "",
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
    setFileName: (state, { payload }) => {
      state.fileName = payload;
    },
  },
});

export const { setIsPlaying, setAudioDurationInSeconds, setFileName } =
  editorSlice.actions;

export default editorSlice.reducer;
