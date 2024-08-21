import './App.module.css';

import AudioUploader from "./components/AudioUploader/AudioUploader.jsx";

export default function App() {
  return (
    <>
      <h1>Welcome to media editor app</h1>
      <h3>Upload your audio file below</h3>
      <AudioUploader />
    </>
  )
}
