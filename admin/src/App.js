import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/mainstyle.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import Router from "./Router";


function App() {
  return (
    <div className="App" >
      <div className="content">
      <Router/>
      <ToastContainer autoClose={1000}/>
      </div>
    </div>
  );
}

export default App;
