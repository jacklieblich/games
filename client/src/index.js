import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/app";
import "./index.css";
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './RouterHelpers/ScrollToTop'

ReactDOM.render((
  <BrowserRouter basename="/#/">
  	<ScrollToTop>
    	<App />
    </ScrollToTop>
  </BrowserRouter>
), document.getElementById('root'))
