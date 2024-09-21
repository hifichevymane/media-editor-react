import styles from './MediaControlPanel.module.css';

import { useContext, useEffect, useState } from 'react';
import { WaveSurferContext } from '../AudioUploader/AudioUploader.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying } from '../../redux/editor/editorSlice.js';

import AudioTimeSlider from '../AudioTimeSlider/AudioTimeSlider.jsx';
import ZoomSlider from '../ZoomSlider/ZoomSlider.jsx';
import AudioTimeControlButtons from '../AudioTimeControlButtons/AudioTimeControlButtons.jsx';
import VolumeSlider from '../VolumeSlider/VolumeSlider.jsx';

import * as lame from '@breezystack/lamejs';

export default function MediaControlPanel() {
  const dispatch = useDispatch();

  const { wavesurfer, regionsPlugin } = useContext(WaveSurferContext);

  const audioFileName = useSelector(state => state.editor.fileName);
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
  });

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

    const float32ToInt16 = (float32Array) => {
      const int16Array = new Int16Array(float32Array.length);

      for (let i = 0; i < float32Array.length; i++) {
        // Scale the float to the range of Int16
        int16Array[i] = Math.max(-32768, Math.min(32767, float32Array[i] * 32767));
      }

      return int16Array;
    }

    const mp3Encoder = new lame.Mp3Encoder(2, sampleRate, 320);
    const mp3Data = [];
    const leftChannel = float32ToInt16(newAudioBuffer.getChannelData(0));
    const rightChannel = float32ToInt16(newAudioBuffer.getChannelData(1));
    const samplesPerFrame = 1152;
    const samplesLength = leftChannel.length;

    for (let i = 0; i < samplesLength; i += samplesPerFrame) {
      const leftChunk = leftChannel.subarray(i, i + samplesPerFrame);
      const rightChunk = rightChannel.subarray(i, i + samplesPerFrame);
      const mp3Buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3Buf.length) mp3Data.push(mp3Buf);
    }

    const mp3End = mp3Encoder.flush();
    if (mp3End.length) mp3Data.push(mp3End);

    const blob = new Blob(mp3Data, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cropped_${audioFileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
