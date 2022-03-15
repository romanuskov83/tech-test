import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AutoComplete from "./component";


ReactDOM.render(
  <React.StrictMode>
      <div className="container">
        <AutoComplete />
      </div>
  </React.StrictMode>,
  document.getElementById('root')
);