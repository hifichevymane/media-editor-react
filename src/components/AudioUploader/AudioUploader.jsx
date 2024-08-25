import styles from './AudioUploader.module.css';

import WaveSurfer from "wavesurfer.js";
import { useState, useRef, useEffect, useId } from "react";

import MediaControlPanel from '../MediaControlPanel/MediaControlPanel.jsx';

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
      barWidth: 3,
      mediaControls: false,
      autoplay: true,
      dragToSeek: true
    });

    return () => wavesurfer.current.destroy();
  }, []);

  useEffect(() => {
    if (audioFile) {
      const objectURL = URL.createObjectURL(audioFile);
      wavesurfer.current.stop();
      wavesurfer.current.load(objectURL);
      wavesurfer.current.setVolume(0.8);
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
    setIsPlaying(wavesurfer.current.isPlaying());
  };

  const onSkipBackBtnClick = () => {
    wavesurfer.current.skip(-SKIP_TIME_SECONDS)
  };

  const onSkipForwardBtnClick = () => {
    wavesurfer.current.skip(SKIP_TIME_SECONDS)
  };

  const onVolumeSliderChange = (e) => {
    const volume = e.target.valueAsNumber / 100;
    wavesurfer.current.setVolume(volume);
  };

  const onZoomSliderChange = (e) => {
    wavesurfer.current.zoom(e.target.valueAsNumber);
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
      {
        audioFileName && (
          <span className={styles.audioFileName}>{audioFileName}</span>
        )
      }
      <div ref={waveformElRef} className={styles.waveForm}></div>
      {
        audioFile && (
          <MediaControlPanel
            isPlaying={isPlaying}
            onPlayStopBtnClick={onPlayStopBtnClick}
            onSkipBackBtnClick={onSkipBackBtnClick}
            onSkipForwardBtnClick={onSkipForwardBtnClick}
            onVolumeSliderChange={onVolumeSliderChange}
            onZoomSliderChange={onZoomSliderChange}
          />
        )
      }
    </div>
  )
}
