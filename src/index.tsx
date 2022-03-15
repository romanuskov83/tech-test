
import React from 'react';
import ReactDOM from 'react-dom';
import AutoComplete from './component/index';
import data from './mock';
import './index.css'

const later = (delay:number, value:string[]) : Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, delay);
    });
}


ReactDOM.render(
    <div  className="container">
        <h1 className="spacer">&darr;&darr;&darr;&darr;&darr;</h1>
        <AutoComplete fetch={(query) => later(
            200+Math.random()*200,
            data.filter(
                item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0
            )
        )}/>
        <h1 className="spacer">&uarr;&uarr;&uarr;&uarr;&uarr;</h1>
    </div>,
    document.getElementById('root')
);
