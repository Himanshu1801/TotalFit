import React, { useState } from "react";
import * as tmPose from "@teachablemachine/pose";
import "@tensorflow/tfjs";
import "../index.css";

const SquatPosture = () => {
  const URL = "https://teachablemachine.withgoogle.com/models/i9SdvGiC4/";
  let model, webcam, ctx, labelContainer, maxPredictions;

  webcam = new tmPose.Webcam(500, 500, true);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    setIsLoading(true);

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 500;
    // const flip = true;
    // webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    setIsLoading(false);
  };

  const loop = async () => {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  };

  const predict = async () => {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);
    const updatedPredictions = prediction.map((p) => ({
      className: p.className,
      probability: p.probability.toFixed(2),
    }));
    setPredictions(updatedPredictions);
    drawPose(pose);
  };

  const drawPose = (pose) => {
    if (webcam.canvas) {
      ctx.drawImage(webcam.canvas, 0, 0);
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      }
    }
  };

  const getColor = (probability) => {
    if (probability > 0.8) {
      return "#E67701";
    } else if (probability > 0.5) {
      return "#D84C6F";
    } else {
      return "#794AEF";
    }
  };

  const getBarWidth = (probability) => {
    return `${parseFloat(probability) * 100}%`;
  };

  const getBarBackground = (probability) => {
    const color = getColor(probability);
    return `linear-gradient(to right, ${color} 0%, ${color} 100%)`;
  };

  return (
    <div className="posture-container">
      <div className="posture-header">Squat</div>
      <div className="camera-and-predictions-container">
        <div className="camera-container">
          {isLoading && <div className="loader"></div>}
          <canvas id="canvas"></canvas>
        </div>
        <div className="predictions-container" id="label-container">
          {predictions.map((prediction, index) => (
            <div key={index} className="bar-graph-holder">
              <div
                className="bar-graph-label"
                style={{
                  color: getColor(prediction.probability),
                  fontWeight: prediction.probability > 0.8 ? 900 : "normal",
                }}
              >
                {prediction.className}
              </div>
              <div className="tm-bar-graph-holder">
                <div
                  className="tm-bar-graph"
                  style={{
                    width: getBarWidth(prediction.probability),
                    background: getBarBackground(prediction.probability),
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="start-stop-button-container">
        <button type="button" onClick={init} className="start-button">
          Start
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="stop-button"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default SquatPosture;
