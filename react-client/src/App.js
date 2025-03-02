import React, { Component } from "react";
import './App.css';
import Messager from "./Messager.js";

class App extends Component {
  constructor () {
    super();
  }

 render() {
  return (
    <div className="App">
        <Messager webSocket={this.webSocketConnector} />
    </div>
  );
 }
}

export default App;
