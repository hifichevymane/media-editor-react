import styles from './AudioUploader.module.css';

import WaveSurfer from "wavesurfer.js";
import { useState, useRef, useEffect, useId } from "react";

import PlayBtnIcon from "../../icons/PlayBtnIcon/PlayBtnIcon.jsx";
import StopBtnIcon from "../../icons/StopBtnIcon/StopBtnIcon.jsx";
import SkipBtnIcon from "../../icons/SkipBtnIcon/SkipBtnIcon.jsx";

const SKIP_TIME_SECONDS = 10;

export default function AudioUploader() {
  const wavesurfer = useRef(null);
  const waveformElRef = useRef(null);
  const audioInputId = useId();
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: waveformElRef.current,
      waveColor: '#ddd',
      progressColor: '#383351',
      responsive: true,
      barWidth: 3
    });

    return () => wavesurfer.current.destroy();
  }, []);

  useEffect(() => {
    if (audioFile) {
      const objectURL = URL.createObjectURL(audioFile);
      wavesurfer.current.stop();
      wavesurfer.current.load(objectURL);
      wavesurfer.current.play();
      setIsPlaying(true);
      return () => URL.revokeObjectURL(objectURL);
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

  const onPlayStopBtnClick = async () => {
    await wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  }

  const onSkipBackBtnClick = () => {
    wavesurfer.current.skip(-SKIP_TIME_SECONDS)
  }

  const onSkipForwardBtnClick = () => {
    wavesurfer.current.skip(SKIP_TIME_SECONDS)
  }

  return (
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
      {audioFile && (
        <div className={styles.controls}>
          <button
            className={[styles.controlButton, styles.skipButton].join(' ')}
            onClick={onSkipBackBtnClick}
          ><SkipBtnIcon skipType='back'/></button>
          <button className={styles.controlButton} onClick={onPlayStopBtnClick}>
            {isPlaying ? <StopBtnIcon/> : <PlayBtnIcon/>}
          </button>
          <button
            className={[styles.controlButton, styles.skipButton].join(' ')}
            onClick={onSkipForwardBtnClick}
          ><SkipBtnIcon skipType='forward'/></button>
        </div>
      )}
    </div>
  )
}
