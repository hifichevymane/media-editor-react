/* eslint-disable react/prop-types */
import styles from './MediaControlPanel.module.css';

import { useContext, useEffect, useState } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader.jsx';

import AudioTimeSlider from '../AudioTimeSlider/AudioTimeSlider.jsx';
import ZoomSlider from '../ZoomSlider/ZoomSlider.jsx';
import AudioTimeControlButtons from '../AudioTimeControlButtons/AudioTimeControlButtons.jsx';
import VolumeSlider from '../VolumeSlider/VolumeSlider.jsx';

export default function MediaControlPanel({ audioDuration, isPlaying, changeIsPlaying }) {
  const wavesurfer = useContext(WaveSurferContext);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const unsubscribeTimeupdateEvent = wavesurfer.current.on('timeupdate', (time) => {
      setCurrentTime(time);
    });
    const unsubscribeFinishEvent = wavesurfer.current.on('finish', () => {
      changeIsPlaying(false);
    });

    return () => {
      unsubscribeTimeupdateEvent();
      unsubscribeFinishEvent();
    }
  });

  return (
    <div className={styles.controls}>
      <AudioTimeSlider currentTime={currentTime} audioDuration={audioDuration} />
      <div className={styles.controlButtons}>
        <div className={styles.controlGroup}>
          <ZoomSlider />
        </div>
        <AudioTimeControlButtons isPlaying={isPlaying} changeIsPlaying={changeIsPlaying} />
        <div className={styles.controlGroup}>
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
