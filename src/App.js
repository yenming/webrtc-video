import React, { Component } from "react";
import "./App.css";
import VideoCapture from "./components/VideoCapture";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="title-container">
          <h1>Super video fun time</h1>
        </div>
        <VideoCapture />
      </div>
    );
  }
}

export default App;
