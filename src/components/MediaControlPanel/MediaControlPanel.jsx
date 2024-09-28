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

  const { wavesurfer, regionsPlugin } = useContext(WaveSurferContext);

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

  const cutAudio = () => {
    const regions = regionsPlugin.current.getRegions();
    if (!regions.length) return;

    const selectedArea = regions[regions.length - 1];
    const originalAudioBuffer = wavesurfer.current.getDecodedData();
    const numberOfChannels = originalAudioBuffer.numberOfChannels;
    const sampleRate = originalAudioBuffer.sampleRate;
    const length = Math.floor((selectedArea.end - selectedArea.start) * sampleRate);
    const newAudioBuffer = new AudioBuffer({ numberOfChannels, length, sampleRate });

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const data = new Float32Array(length);
      originalAudioBuffer.copyFromChannel(data, channel, selectedArea.start * sampleRate);
      newAudioBuffer.copyToChannel(data, channel);
    }

    const leftChannel = newAudioBuffer.getChannelData(0);
    const rightChannel = newAudioBuffer.getChannelData(1);
    worker.current.postMessage({ leftChannel, rightChannel, sampleRate });
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
