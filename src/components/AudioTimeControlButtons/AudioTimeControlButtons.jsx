/* eslint-disable react/prop-types */
import styles from './AudioTimeControlButtons.module.css';

import { useContext } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader';

import PlayBtnIcon from "../../icons/PlayBtnIcon/PlayBtnIcon.jsx";
import StopBtnIcon from "../../icons/StopBtnIcon/StopBtnIcon.jsx";
import SkipBtnIcon from "../../icons/SkipBtnIcon/SkipBtnIcon.jsx";

const SKIP_TIME_SECONDS = 10;

export default function AudioTimeControlButtons({ isPlaying, changeIsPlaying }) {
  const wavesurfer = useContext(WaveSurferContext);

  const onPlayStopBtnClick = async () => {
    await wavesurfer.current.playPause();
    changeIsPlaying(wavesurfer.current.isPlaying());
  };

  const onSkipBackBtnClick = () => {
    wavesurfer.current.skip(-SKIP_TIME_SECONDS)
  };

  const onSkipForwardBtnClick = () => {
    wavesurfer.current.skip(SKIP_TIME_SECONDS)
  };

  return (
    <>
      <button
        className={[styles.controlButton, styles.skipButton].join(' ')}
        onClick={onSkipBackBtnClick}
      >
        <SkipBtnIcon skipType='back' />
      </button>
      <button className={styles.controlButton} onClick={onPlayStopBtnClick}>
        {isPlaying ? <StopBtnIcon /> : <PlayBtnIcon />}
      </button>
      <button
        className={[styles.controlButton, styles.skipButton].join(' ')}
        onClick={onSkipForwardBtnClick}
      >
        <SkipBtnIcon skipType='forward' />
      </button>
    </>
  );
}
