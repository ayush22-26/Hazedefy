import React, { useState, useEffect } from 'react';
import './Carousal.css'; // Import CSS file for styling

import Carousal1 from '../assets/banner-1.jpeg';
import Carousal2 from '../assets/banner-2.jpg';
import Carousal3 from '../assets/banner-3.jpg';

const images = [
  Carousal1,
  Carousal2,
  Carousal3,
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='carousel-container font-serif text-white'>
      <div className='carousel-track'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentSlide ? 'active' : ''
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className='carousel-image w-[99.9vw] h-[85vh] md:h-[100vh]'
            />
          </div>
        ))}
      </div>
      <div className= 'absolute top-20 sm:left-40 left-4 md:w-[55vw] sm:w-[60vw] w-full'>
            <div >
              <p className='xl:text-[70px] lg:text-[50px] text-[30px] font-bold ' style={{lineHeight:1.1}}>Revive clarity, transform haze. Clear vision awaits. Dehaze now!</p>
              <p className='mt-8 text-lg'>Banish foggy images with our advanced dehazing technology. Restore clarity and bring vibrancy back to your photos effortlessly.</p>
              </div>
            <button className='px-12 py-6 bg-primary mt-8'>
              DISCOVER MORE
            </button>
          </div>
    </div>
  );
};

export default Carousel;
