import React,{ Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css'
import 'font-awesome/css/font-awesome.min.css';
import 'antd/dist/antd.css';
import './assets/styles/index.less';

import Router from "./Router";
import './assets/styles/App.less';


function App() {
  return (
    <div className="App">
      <div className="content">
      <Router/>
      <ToastContainer className={'toast-position'} />
      </div>
    </div>
  );
}

export default App;
