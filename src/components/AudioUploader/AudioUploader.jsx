import styles from './AudioUploader.module.css';

import { useState, useRef, useEffect, useId } from "react";

const AUDIO_DATA_POINTS_COUNT = 128;

export default function AudioUploader() {
  const [audioFileURL, setAudioFileURL] = useState(null);
  const [audioFileName, setAudioFileName] = useState(null);
  const canvasCtx = useRef(null);
  const audioCtx = useRef(null);
  const x = useRef(0);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const analyser = useRef(null);
  const bufferSize = useRef(null);
  const dataArray = useRef(null);
  const barWidth = useRef(null);
  const audioSource = useRef(null);
  const audioInputId = useId();

  useEffect(() => {
    canvasCtx.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const ctx = new AudioContext();

    audioRef.current.volume = 0.3;
    audioRef.current.play();
    createAudioSource(ctx);

    initBufferSizeDataArrayAndBarWidth();
    audioCtx.current = ctx;

    animationRef.current = requestAnimationFrame(animate);

    // animate(analyser, bufferSize, dataArray, barWidth);
    return () => cancelAnimationFrame(animationRef.current);
  }, [audioFileURL]);

  const createAudioSource = (audioCtx) => {
    if (!audioSource.current) {
      analyser.current = audioCtx.createAnalyser();
      audioSource.current = audioCtx.createMediaElementSource(audioRef.current);
      audioSource.current.connect(analyser.current);
      analyser.current.connect(audioCtx.destination);
    }
  };

  const initBufferSizeDataArrayAndBarWidth = () => {
    analyser.current.fftSize = AUDIO_DATA_POINTS_COUNT;
    bufferSize.current = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferSize.current);
    barWidth.current = canvasRef.current.width / bufferSize.current;
  };

  const animate = () => {
    x.current = 0;
    canvasCtx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    analyser.current.getByteFrequencyData(dataArray.current);
    for (let i = 0; i < bufferSize.current; i++) {
      const barHeight = dataArray.current[i];
      canvasCtx.current.fillStyle = "white";
      canvasCtx.current.fillRect(
        x.current,
        canvasRef.current.height - barHeight,
        barWidth.current, barHeight
      );
      x.current = x.current + barWidth.current;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const onFileUpload = (e) => {
    const audioFile = e.target.files[0];
    if (!audioFile) return;

    const audioFileURL = URL.createObjectURL(audioFile);
    setAudioFileURL(audioFileURL);

    const audioFileName = audioFile.name;
    const fileNameWithoutExtension = audioFileName.substring(0, audioFileName.length - 4);
    setAudioFileName(fileNameWithoutExtension);
  };

  return (
    <div className={styles.audioUploader}>
      <input
        className={styles.audioInput}
        type="file"
        accept="audio/*"
        onChange={onFileUpload}
        id={audioInputId}
      ></input>
      <label
        htmlFor={audioInputId}
        className={styles.audioInputLabel}
      >Upload the file</label>
      {audioFileName && <span className={styles.audioFileName}>{audioFileName}</span>}
      <canvas ref={canvasRef} style={{ display: audioFileURL ? 'block' : 'none' }}></canvas>
      {audioFileURL && <audio controls ref={audioRef} src={audioFileURL} />}
    </div>
  )
}
