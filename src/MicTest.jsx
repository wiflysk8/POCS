import React, { useState } from "react";
import { ReactMic } from "react-mic";
import "./MicRecord.scss";

const MicTest = () => {
  const [record, setRecord] = useState(false);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onData = (recordedBlob) => {
    /* console.log("chunk of real-time data is: ", recordedBlob); */
  };

  let onStop = (recordedBlob) => {
    console.log("recordedBlob is: ", recordedBlob);
  };

  return (
    <div>
      <ReactMic record={record} className="sound-wave" onStop={onStop} onData={onData} strokeColor="#000000" backgroundColor="#FF4081" mimeType="audio/wav" />
      <button className="start" onClick={startRecording} type="button">
        Start
      </button>
      <button className="stop" onClick={stopRecording} type="button">
        Stop
      </button>
    </div>
  );
};

export default MicTest;
