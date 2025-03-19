import './App.css';
import Messager from "./Messager.js";
import { WebSocketConnector } from "./WebSocketConnector.js";

function App() {
  return (
    <div className="App">
        <Messager webSocket={ WebSocketConnector } />
    </div>
  );
}

export default App;
