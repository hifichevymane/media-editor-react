import { useContext } from "react";
import { WaveSurferContext } from "../AudioUploader/AudioUploader";

export default function ZoomSlider() {
  const wavesurfer = useContext(WaveSurferContext);

  const onZoomSliderChange = (e) => {
    wavesurfer.current.zoom(e.target.valueAsNumber);
  };

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14m-1-1.5v-2h-2v-2h2v-2h2v2h2v2h-2v2z"></path></svg>
      <input
        type='range'
        min={0}
        max={100}
        defaultValue={0}
        onChange={onZoomSliderChange}
      />
    </>
  );
}
