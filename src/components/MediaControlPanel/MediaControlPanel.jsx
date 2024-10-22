import styles from './MediaControlPanel.module.css';

import { useContext, useEffect, useState } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader.jsx';

import { useDispatch } from 'react-redux';
import { setIsPlaying } from '../../redux/editor/editorSlice.js';

import AudioTimeSlider from '../AudioTimeSlider/AudioTimeSlider.jsx';
import ZoomSlider from '../ZoomSlider/ZoomSlider.jsx';
import AudioTimeControlButtons from '../AudioTimeControlButtons/AudioTimeControlButtons.jsx';
import VolumeSlider from '../VolumeSlider/VolumeSlider.jsx';

export default function MediaControlPanel() {
  const dispatch = useDispatch();

  const { wavesurfer } = useContext(WaveSurferContext);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const unsubscribeTimeupdateEvent = wavesurfer.current.on('timeupdate', (time) => {
      setCurrentTime(time);
    });
    const unsubscribeFinishEvent = wavesurfer.current.on('finish', () => {
      dispatch(setIsPlaying(false));
    });

    return () => {
      unsubscribeTimeupdateEvent();
      unsubscribeFinishEvent();
    }
  }, []);

  return (
    <>
      <div className={styles.controls}>
        <AudioTimeSlider currentTime={currentTime} />
        <div className={styles.controlButtons}>
          <div className={styles.controlGroup}>
            <ZoomSlider />
          </div>
          <AudioTimeControlButtons />
          <div className={styles.controlGroup}>
            <VolumeSlider />
          </div>
        </div>
      </div>
    </>
  );
}
