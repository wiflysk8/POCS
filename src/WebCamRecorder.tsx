import { useEffect, useRef, useState } from "react";
import ".//WebCamRecorder.scss";

function WebCamRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const streamRef = useRef<null | MediaStream>(null);
  const [downloadLink, setDownloadLink] = useState("");
  const streamRecorderRef = useRef<null | MediaRecorder>(null);
  const [audioSource, setAudioSource] = useState<string>("");
  const [videoSource, setVideoSource] = useState<string>("");
  const [audioSourceOptions, setAudioSourceOptions] = useState<
    Record<string, string>[]
  >([]);
  const [videoSourceOptions, setVideoSourceOptions] = useState<
    Record<string, string>[]
  >([]);

  const [frontCamera, setFrontCamera] = useState();
  const [backCamera, setBackCamera] = useState();

  const chunks = useRef<any[]>([]);

  function startRecording() {
    if (isRecording) {
      return;
    }
    if (!streamRef.current) {
      return;
    }
    streamRecorderRef.current = new MediaRecorder(streamRef.current);
    streamRecorderRef.current.start();
    streamRecorderRef.current.ondataavailable = function (event: BlobEvent) {
      if (chunks.current) {
        chunks.current.push(event.data);
      }
    };
    setIsRecording(true);
  }

  useEffect(
    function () {
      if (isRecording) {
        return;
      }
      if (chunks.current.length === 0) {
        return;
      }
      const blob = new Blob(chunks.current, {
        type: "video/x-matroska;codecs=avc1,opus",
      });
      setDownloadLink(URL.createObjectURL(blob));
      chunks.current = [];
      console.log("blob", blob);
    },
    [isRecording]
  );

  function stopRecording() {
    if (!streamRecorderRef.current) {
      return;
    }
    streamRecorderRef.current.stop();
    setIsRecording(false);
  }

  useEffect(
    function () {
      async function prepareStream() {
        function gotStream(stream:any) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }

        async function getStream() {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
              track.stop();
            });
          }
          const constraints = {
            audio: {
              deviceId: audioSource !== "" ? { exact: audioSource } : undefined,
            },
            video: {
              deviceId: videoSource !== "" ? { exact: videoSource } : undefined,
              width: { ideal: 1280 },
            },
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          gotStream(stream);
        }

        function getDevices() {
          return navigator.mediaDevices.enumerateDevices();
        }

        function gotDevices(deviceInfos:any) {
          const audioSourceOptions = [];
          const videoSourceOptions = [];
          for (const deviceInfo of deviceInfos) {
            if (deviceInfo.kind === "audioinput") {
              audioSourceOptions.push({
                value: deviceInfo.deviceId,
                label: deviceInfo.label || `Microphone ${deviceInfo.deviceId}`,
              });
            } else if (deviceInfo.kind === "videoinput") {
              videoSourceOptions.push({
                value: deviceInfo.deviceId,
                label: deviceInfo.label || `Camera ${deviceInfo.deviceId}`,
              });
            }
          }
          setAudioSourceOptions(audioSourceOptions);
          setVideoSourceOptions(videoSourceOptions);
          setFrontCamera(videoSourceOptions[0].value);
          setBackCamera(videoSourceOptions[1].value);    
             
        }

        await getStream();
        const mediaDevices = await getDevices();
        gotDevices(mediaDevices);
      }
      prepareStream();
    },
    [audioSource, videoSource, streamRef, videoRef, frontCamera, backCamera]
  );

  const handleVideoChange = (event:any) => {
    setVideoSource(event?.target.value);
  };

  const handleAudioChange = (event:any) => {
    setAudioSource(event?.target.value);
  };

   const handleToggleCamera = () => {
     
      if (videoSource === frontCamera && backCamera !== undefined) {
      setVideoSource(backCamera);

    } else if(videoSource === backCamera && frontCamera !== undefined) {
      setVideoSource(frontCamera);
    }  
    
  }  

  const handleReset = () => {
    setDownloadLink("");
  }

  return (
    <div>
      <div className="video">
        <video  ref={videoRef} autoPlay muted playsInline />
      </div>
      <div>
      <div className="btns">
        <select onChange={handleVideoChange} id="videoSource" name="videoSource" value={videoSource}>
          {videoSourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select onChange={handleAudioChange} id="audioSource" name="audioSource" value={audioSource}>
          {audioSourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        {downloadLink && <video className="video2" src={downloadLink} controls  loop autoPlay></video>}
        {downloadLink && (
          <a href={downloadLink} download="file.mp4">
            Descargar
          </a>
        )}
      </div>
     
        <button onClick={startRecording} disabled={isRecording}>
          Grabar
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Parar
        </button>
      
      <button onClick={handleToggleCamera}>Toggle camera</button>
      <button onClick={handleReset}>reset</button>
      </div>
    </div>
  );
}

export default WebCamRecorder;
