/* eslint-disable react/prop-types */
import styles from './MediaControlPanel.module.css';

import PlayBtnIcon from "../../icons/PlayBtnIcon/PlayBtnIcon.jsx";
import StopBtnIcon from "../../icons/StopBtnIcon/StopBtnIcon.jsx";
import SkipBtnIcon from "../../icons/SkipBtnIcon/SkipBtnIcon.jsx";

const DEFAULT_VOLUME = 80;
const MIN_VOLUME_LEVEL = 0;
const MAX_VOLUME_LEVEL = 100;
const VOLUME_RANGE_STEP = 5;

export default function MediaControlPanel(props) {
  const formatTime = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.controls}>
      <div className={styles.controlTime}>
        <span>{formatTime(props.currentTime)}</span>
        <input
          type='range'
          value={props.currentTime}
          max={props.audioDuration}
          onChange={props.onTimeSliderChange}
          className={styles.timeSlider}
        />
        <span>{formatTime(props.audioDuration)}</span>
      </div>
      <div className={styles.controlButtons}>
        <div className={styles.controlGroup}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14m-1-1.5v-2h-2v-2h2v-2h2v2h2v2h-2v2z"></path></svg>
          <input
            type='range'
            min={0}
            max={100}
            defaultValue={0}
            onChange={props.onZoomSliderChange}
          />
        </div>
        <button
          className={[styles.controlButton, styles.skipButton].join(' ')}
          onClick={props.onSkipBackBtnClick}
        >
          <SkipBtnIcon skipType='back' />
        </button>
        <button className={styles.controlButton} onClick={props.onPlayStopBtnClick}>
          {props.isPlaying ? <StopBtnIcon /> : <PlayBtnIcon />}
        </button>
        <button
          className={[styles.controlButton, styles.skipButton].join(' ')}
          onClick={props.onSkipForwardBtnClick}
        >
          <SkipBtnIcon skipType='forward' />
        </button>
        <div className={styles.controlGroup}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><g fill="currentColor"><path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"></path><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"></path><path d="M10.025 8a4.5 4.5 0 0 1-1.318 3.182L8 10.475A3.5 3.5 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.5 4.5 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12zM4.312 6.39L6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11"></path></g></svg>
          <input
            type='range'
            min={MIN_VOLUME_LEVEL}
            max={MAX_VOLUME_LEVEL}
            step={VOLUME_RANGE_STEP}
            defaultValue={DEFAULT_VOLUME}
            onChange={props.onVolumeSliderChange}
          />
        </div>
      </div>
    </div>
  );
}
