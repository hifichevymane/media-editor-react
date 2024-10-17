import styles from './MediaControlPanel.module.css';

import { useContext, useEffect, useRef, useState } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying } from '../../redux/editor/editorSlice.js';

import AudioTimeSlider from '../AudioTimeSlider/AudioTimeSlider.jsx';
import ZoomSlider from '../ZoomSlider/ZoomSlider.jsx';
import AudioTimeControlButtons from '../AudioTimeControlButtons/AudioTimeControlButtons.jsx';
import VolumeSlider from '../VolumeSlider/VolumeSlider.jsx';

export default function MediaControlPanel() {
  const dispatch = useDispatch();

  const { wavesurfer, regionsPlugin, audioFile } = useContext(WaveSurferContext);

  const audioFileName = useSelector(state => state.editor.fileName);
  const [currentTime, setCurrentTime] = useState(0);
  const worker = useRef(null);

  useEffect(() => {
    worker.current = new Worker(
      new URL('../../workers/convertToMp3.js', import.meta.url),
      { type: 'module' }
    );
    worker.current.onmessage = onConvertToMp3WorkerMessage;

    const unsubscribeTimeupdateEvent = wavesurfer.current.on('timeupdate', (time) => {
      setCurrentTime(time);
    });
    const unsubscribeFinishEvent = wavesurfer.current.on('finish', () => {
      dispatch(setIsPlaying(false));
    });

    return () => {
      unsubscribeTimeupdateEvent();
      unsubscribeFinishEvent();
      worker.current.onmessage = null;
      worker.current.terminate();
    }
  }, []);

  const onConvertToMp3WorkerMessage = ({ data }) => {
    const blob = new Blob(data, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cropped_${audioFileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const cutAudio = async () => {
    try {
      const regions = regionsPlugin.current.getRegions();
      if (!regions.length) return;

      const { start: startTime, end: endTime } = regions[regions.length - 1];
      const body = new FormData();
      body.append('file', audioFile);
      body.append('start_time', startTime);
      body.append('end_time', endTime);

      const response = await fetch('http://localhost:8000/audio/crop-audio', {
        method: 'POST',
        body
      });
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.click();
      a.remove();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error('Failure on cropping audio');
      console.error(err);
    }
  };

  return (
    <div className={styles.controls}>
      <AudioTimeSlider currentTime={currentTime} />
      <div className={styles.controlButtons}>
        <div className={styles.controlGroup}>
          <ZoomSlider />
        </div>
        <AudioTimeControlButtons />
        <button onClick={cutAudio}>Download</button>
        <div className={styles.controlGroup}>
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
