import * as lame from "@breezystack/lamejs";

onmessage = ({ data }) => {
  const { leftChannel, rightChannel, sampleRate } = data;
  const float32ToInt16 = (float32Array) => {
    const int16Array = new Int16Array(float32Array.length);

    for (let i = 0; i < float32Array.length; i++) {
      // Scale the float to the range of Int16
      int16Array[i] = Math.max(
        -32768,
        Math.min(32767, float32Array[i] * 32767)
      );
    }

    return int16Array;
  };

  const mp3Encoder = new lame.Mp3Encoder(2, sampleRate, 320);
  const mp3Data = [];
  const leftChannelInt16 = float32ToInt16(leftChannel);
  const rightChannelInt16 = float32ToInt16(rightChannel);
  const samplesPerFrame = 1152;
  const samplesLength = leftChannelInt16.length;

  for (let i = 0; i < samplesLength; i += samplesPerFrame) {
    const leftChunk = leftChannelInt16.subarray(i, i + samplesPerFrame);
    const rightChunk = rightChannelInt16.subarray(i, i + samplesPerFrame);
    const mp3Buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3Buf.length) mp3Data.push(mp3Buf);
  }

  const mp3End = mp3Encoder.flush();
  if (mp3End.length) mp3Data.push(mp3End);

  postMessage(mp3Data);
};
