import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import Video from './Video';
import RealTimeDehaze from './RealTimeDehaze';

function Upload() {
  const [activeComponent, setActiveComponent] = useState('image');

  return (
    <div>
      <div className='flex justify-evenly font-serif'>
        <button 
          className={`w-[33%] py-2 border-black ${activeComponent === 'image' ? 'bg-secondary ' : 'bg-primary text-white'}`} 
          onClick={() => setActiveComponent('image')}
        >
          Image-Upload
        </button>
        <button 
          className={`w-[33%] py-2 border-black ${activeComponent === 'video' ? 'bg-secondary' : 'bg-primary text-white'}`} 
          onClick={() => setActiveComponent('video')}
        >
          Video-Upload
        </button>
        <button 
          className={`w-[33%] py-2 border-black ${activeComponent === 'realtime' ? 'bg-secondary' : 'bg-primary text-white'}`} 
          onClick={() => setActiveComponent('realtime')}
        >
          Real-Time-dehaze 
        </button>
      </div>

      {activeComponent === 'image' && <ImageUpload />}
      {activeComponent === 'video' && <Video />}
      {activeComponent === 'realtime' && <RealTimeDehaze />}
    </div>
  );
}

export default Upload;


      

