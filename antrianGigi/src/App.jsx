import Register from "./Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Qrcode from "./Qrcode";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />}></Route>
          <Route path="qrcode" element={<Qrcode />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
