import styles from './DownloadButton.module.css';

import { useState, useContext } from "react";
import { WaveSurferContext } from "../AudioUploader/AudioUploader";

import Modal from "../Modal/Modal";

const MODAL_HEADER_MESSAGE = 'Please wait';
const MODAL_BODY_MESSAGE = "We're editing your file...";

export default function DownloadButton() {
  const { regionsPlugin, audioFile } = useContext(WaveSurferContext);
  const [openModal, setOpenModal] = useState(false);

  const cutAudio = async () => {
    try {
      const regions = regionsPlugin.current.getRegions();
      if (!regions.length) return;

      setOpenModal(true);
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
      download(blob);
    } catch (err) {
      console.error('Failure on cropping audio');
      console.error(err);
    }
  };

  const download = (blob) => {
    const fileURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = fileURL;
    a.download = 'cropped-audio.mp3';
    document.body.appendChild(a);

    a.click();
    a.remove();
    setOpenModal(false);
  };

  return (
    <>
      <button onClick={cutAudio} className={styles.downloadBtn}>Download</button>
      <Modal
        isOpened={openModal}
        headerMessage={MODAL_HEADER_MESSAGE}
        bodyMessage={MODAL_BODY_MESSAGE}
      />
    </>
  );
}