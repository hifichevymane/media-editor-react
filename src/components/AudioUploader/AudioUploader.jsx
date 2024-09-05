import styles from './AudioUploader.module.css';

import WaveSurfer from "wavesurfer.js";
import {
  useState,
  useRef,
  useEffect,
  useId,
  createContext
} from "react";

import { useDispatch } from 'react-redux';
import { setIsPlaying, setAudioDurationInSeconds } from '../../redux/editor/editorSlice.js';

import MediaControlPanel from '../MediaControlPanel/MediaControlPanel.jsx';

export const WaveSurferContext = createContext()

export default function AudioUploader() {
  const dispatch = useDispatch();

  const wavesurfer = useRef(null);
  const waveformElRef = useRef(null);
  const audioInputId = useId();

  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState(null);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformElRef.current,
      waveColor: '#ddd',
      progressColor: '#383351',
      responsive: true,
      barWidth: 3,
      mediaControls: false,
      autoplay: true,
      dragToSeek: true
    });

    const unsubscribeReadyEvent = wavesurfer.current.on('ready', () => {
      dispatch(setAudioDurationInSeconds(wavesurfer.current.getDuration()));
    });

    return () => {
      unsubscribeReadyEvent();
      wavesurfer.current.destroy();
    };
  });

  useEffect(() => {
    if (audioFile) {
      const objectURL = URL.createObjectURL(audioFile);
      wavesurfer.current.stop();
      wavesurfer.current.load(objectURL);
      wavesurfer.current.setVolume(0.8);
      dispatch(setIsPlaying(true));
      URL.revokeObjectURL(objectURL);
    }
  }, [audioFile]);

  const onFileUpload = (e) => {
    const audioFile = e.target.files[0];
    if (!audioFile) return;

    setAudioFile(audioFile);
    const audioFileName = audioFile.name;
    const fileNameWithoutExtension = audioFileName.substring(0, audioFileName.length - 4);
    setAudioFileName(fileNameWithoutExtension);
  };

  return (
    <WaveSurferContext.Provider value={wavesurfer}>
      <div className={styles.audioUploader}>
        <input
          className={styles.audioInput}
          type="file"
          accept="audio/*"
          onChange={onFileUpload}
          id={audioInputId}
        ></input>
        <label htmlFor={audioInputId} className={styles.audioInputLabel}>Upload the file</label>
        {audioFileName && <span className={styles.audioFileName}>{audioFileName}</span>}
        <div ref={waveformElRef} className={styles.waveForm}></div>
        {audioFile && <MediaControlPanel />}
      </div>
    </WaveSurferContext.Provider>
  )
}
