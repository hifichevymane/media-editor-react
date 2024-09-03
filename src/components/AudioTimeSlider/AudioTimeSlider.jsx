/* eslint-disable react/prop-types */
import styles from './AudioTimeSlider.module.css';

import { useContext } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader';

export default function AudioTimeSlider({ currentTime, audioDuration }) {
  const wavesurfer = useContext(WaveSurferContext);

  const formatTime = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onTimeSliderChange = (e) => {
    wavesurfer.current.setTime(e.target.valueAsNumber);
  };

  const muteAudio = () => {
    wavesurfer.current.setMuted(true);
  };

  const unmuteAudio = () => {
    wavesurfer.current.setMuted(false);
  };

  return (
    <div className={styles.controlTime}>
      <span>{formatTime(currentTime)}</span>
      <input
        type='range'
        value={currentTime}
        max={audioDuration}
        onChange={onTimeSliderChange}
        onMouseDown={muteAudio}
        onMouseUp={unmuteAudio}
        className={styles.timeSlider}
      />
      <span>{formatTime(audioDuration)}</span>
    </div>
  );
}
