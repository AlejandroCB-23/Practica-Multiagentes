import React, { useEffect } from 'react';
import './akino-cuestionario.css';
import loadingGif from '../assets/loading.gif';
 
function LoadingGif() {
    return (
        <img
            className='loading-gif'
            src={loadingGif}
            title="Loading GIF"
        ></img>
    );
}

export default LoadingGif;
