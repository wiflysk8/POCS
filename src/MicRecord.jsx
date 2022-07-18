import React, { useState } from "react";
import { ReactMic } from "react-mic";
import "./MicRecord.scss";

const MicTest = () => {
  const [record, setRecord] = useState(false);
  const [audioURL, setAudioURL] = useState();

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  let onStop = (recordedBlob) => {
    console.log("recordedBlob is: ", recordedBlob);
    setAudioURL(recordedBlob.blobURL);
  };

  return (
    <>
      <div>
        <ReactMic record={record} onStop={onStop} mimeType="audio/wav" />

        {!record ? <button className="start" onClick={startRecording} type="button" /> : <button className="stop" onClick={stopRecording} type="button" />}
      </div>
      <div>
        <audio src={audioURL} controls="controls" />
      </div>
    </>
  );
};

export default MicTest;
