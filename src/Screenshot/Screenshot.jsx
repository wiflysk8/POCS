import React, { useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import uploadBlobAxios from '../../services/uploadBlobAxios';
import './Screenshot.scss';

const videoConstraints = {
  width: 800,
  height: 400,
  facingMode: 'user',
};

const Screenshot = () => {
  const webcamRef = React.useRef(null);
  const [results, setResults] = useState([]);
  const [boxes, setBoxes] = useState([]);

  const handlePhoto = useCallback(() => {
    const webcamCanvas = webcamRef.current.getCanvas();
    webcamCanvas.toBlob((blob) => {
      const inferenceResults = uploadBlobAxios(blob);
      inferenceResults.then((data) => setResults(data.data.inference));
      inferenceResults.then((data) => setBoxes(data.data.bboxes));
    });
    handleBox(boxes);
  }, [webcamRef, boxes, handleBox]);

  const handleBox = useCallback(() => {
    const webcamCanvas = document.getElementById('canvas');
    const ctx = webcamCanvas.getContext('2d');
    ctx.clearRect(0, 0, 800, 400);

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const [x, y, width, height] = box;
      ctx.lineWidth = '1';
      ctx.strokeStyle = 'red';
      ctx.font = '16px Arial';
      ctx.fillText(results[i], x + 4, y + 20);
      ctx.fillStyle = 'red';
      ctx.strokeRect(x, y, width, height);
    }
  }, [boxes, results]);

  return (
    <div className="c-webcam">
      <div className="c-webcam__webcamContainer">
        <Webcam
          audio={false}
          width={800}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <canvas id="canvas" className="canvas" width={'800px'} height={'400px'} />
      </div>

      <button className="c-webcam__btn" onClick={handlePhoto} />

      <ul className="c-webcam__ul">
        {results.map((result, index) => (
          <li className="c-webcam__li" key={index}>
            <strong className="c-webcam__li">{result}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Screenshot;
