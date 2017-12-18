import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/app";
import "./index.css";
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render((
  <BrowserRouter basename="/#/">
    <App />
  </BrowserRouter>
), document.getElementById('root'))
