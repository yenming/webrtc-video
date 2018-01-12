import React, { Component } from "react";

const videoType = "video/webm";

export class VideoCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
      videoStream: null,
      device: null,
      cameraStatus: null
    };
  }

  async componentDidMount() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      const streamDetails = stream.getVideoTracks()[0];
      this.setState({
        videoStream: window.URL.createObjectURL(stream),
        device: streamDetails.label,
        cameraStatus: streamDetails.readyState
      });
      this.video.play();
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: videoType
      });
      this.videoChunks = [];
      this.mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          this.videoChunks.push(e.data);
        }
      };
    } catch (e) {
      console.log(e);
    }
  }

  startRecording(e) {
    e.preventDefault();
    if (this.state.recording) {
      return;
    }
    this.videoChunks = [];
    // start recorder with 5ms buffer
    this.mediaRecorder.start(5);
    this.setState({ recording: true });
    console.log(this.videoChunks);
  }
  stopRecording(e) {
    if (!this.state.recording) return;
    e.preventDefault();
    this.mediaRecorder.stop();
    this.setState({ recording: false });
    // save the video to memory with our saveVideo fn
    this.saveVideo();
  }

  saveVideo() {
    // convert saved video chunks to blob
    const blob = new Blob(this.videoChunks, { type: videoType });
    // generate video URL from blob
    const videoUrl = window.URL.createObjectURL(blob);
    // append videoURL to list of saved videos for rendering
    this.setState(prevState => {
      return {
        videos: [...prevState.videos, videoUrl]
      };
    });
  }

  render() {
    console.log(this.state);
    const { videoStream, device, cameraStatus, recording } = this.state;
    return (
      <div className="camera" style={{ textAlign: "center" }}>
        {recording ? (
          <h2
            style={{
              backgroundColor: "lightcoral",
              color: "#fff",
              fontWeight: "lighter"
            }}
          >
            VIDEO RECORDING
          </h2>
        ) : (
          <h2>You're ready to record!</h2>
        )}
        <div className="details">
          <p>Device: {device ? device : "No device detected"}</p>
          <p>
            Camera status: &nbsp;{cameraStatus
              ? cameraStatus
              : "Video stream not available"}
          </p>
        </div>

        <div>
          {!this.state.recording && (
            <button
              className="record-button"
              onClick={e => this.startRecording(e)}
            />
          )}
          {this.state.recording && (
            <button
              className="stop-button"
              onClick={e => this.stopRecording(e)}
            />
          )}
        </div>
        <br />
        <video
          style={{ borderRadius: "5px", width: 400 }}
          ref={v => {
            this.video = v;
          }}
          src={videoStream && videoStream}
        >
          Video stream not available
        </video>
        {this.state.videos.length > 0 &&
          this.state.videos.map((videoUrl, i) => (
            <div className="past-video-container" key={i}>
              <video
                className="past-videos"
                loop
                onClick={e => {
                  let onOff = e.target.autoplay;
                  e.target.autoplay = !onOff;
                  e.target.load();
                }}
                src={videoUrl}
                style={{ borderRadius: "5px", width: 250 }}
              />
              <button
                onClick={e =>
                  this.setState(prevState => {
                    return {
                      videos: prevState.videos.filter(url => url !== videoUrl)
                    };
                  })
                }
                className="delete-btn"
              >
                Delete this video
              </button>
            </div>
          ))}
        <footer>
          This was created by{" "}
          <a href="https://www.linkedin.com/in/samuel-kendrick/">
            Sam Kendrick
          </a>. Visit my github for{" "}
          <a href="https://github.com/adnauseum/webrtc-video">source code</a>
        </footer>
      </div>
    );
  }
}

export default VideoCapture;
