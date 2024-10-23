import styles from './AudioUploader.module.css';

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import {
  useState,
  useRef,
  useEffect,
  useId,
  createContext
} from "react";

import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying, setAudioDurationInSeconds, setFileName } from '../../redux/editor/editorSlice.js';

import MediaControlPanel from '../MediaControlPanel/MediaControlPanel.jsx';
import DownloadButton from '../DownloadButton/DownloadButton.jsx';

export const WaveSurferContext = createContext()

export default function AudioUploader() {
  const dispatch = useDispatch();
  const audioFileName = useSelector(state => state.editor.fileName);

  const wavesurfer = useRef(null);
  const regionsPlugin = useRef(null);
  const waveformElRef = useRef(null);
  const audioInputId = useId();

  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    regionsPlugin.current = RegionsPlugin.create();
    wavesurfer.current = WaveSurfer.create({
      container: waveformElRef.current,
      waveColor: '#ddd',
      progressColor: '#383351',
      responsive: true,
      barWidth: 3,
      mediaControls: false,
      autoplay: true,
      dragToSeek: true,
      backend: 'WebAudio',
      sampleRate: 44100,
      plugins: [regionsPlugin.current]
    });
    wavesurfer.current.on('ready', () => {
      dispatch(setAudioDurationInSeconds(wavesurfer.current.getDuration()));
      const audioBuffer = wavesurfer.current.getDecodedData();
      // Add a selectable region by default
      regionsPlugin.current.addRegion({
        start: 0,
        end: audioBuffer.duration
      });
    });

    regionsPlugin.current.enableDragSelection();
    regionsPlugin.current.on('region-created', () => {
      const regions = regionsPlugin.current.getRegions();
      if (regions.length === 1) return;
      regions[0].remove();
    });

    return () => {
      regionsPlugin.current.unAll();
      wavesurfer.current.unAll();
      wavesurfer.current.destroy();
      regionsPlugin.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (audioFile) {
      const objectURL = URL.createObjectURL(audioFile);
      wavesurfer.current.stop();
      wavesurfer.current.load(objectURL);
      wavesurfer.current.setVolume(0.8);
      dispatch(setIsPlaying(true));
      URL.revokeObjectURL(objectURL);
    }
  }, [audioFile, dispatch]);

  const onFileUpload = (e) => {
    const audioFile = e.target.files[0];
    if (!audioFile) return;

    setAudioFile(audioFile);
    const audioFileName = audioFile.name;
    dispatch(setFileName(audioFileName));
  };

  return (
    <WaveSurferContext.Provider value={{ regionsPlugin, wavesurfer, audioFile }}>
      <div className={styles.audioUploader}>
        <input
          className={styles.audioInput}
          type="file"
          accept="audio/*"
          onChange={onFileUpload}
          id={audioInputId}
        ></input>
        <div className={styles.uploadDownload}>
          <label htmlFor={audioInputId} className={styles.audioInputLabel}>Upload the file</label>
          {audioFile && <DownloadButton />}
        </div>
        {audioFileName && <span className={styles.audioFileName}>{audioFileName}</span>}
        <div ref={waveformElRef} className={styles.waveForm}></div>
        {audioFile && <MediaControlPanel />}
      </div>
    </WaveSurferContext.Provider>
  )
}
