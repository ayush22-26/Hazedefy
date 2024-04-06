import React from 'react'
import about from '../assets/about-1.webp'
function About() {
  return (
    <div id='about' className='flex xl:h-[110vh] h-auto w-full font-serif xl:flex-row flex-col justify-center items-center gap-28 xl:gap-0 xl:mt-0 mt-32'>
      <div className='h-full xl:w-[50%] sm:w-[90%] w-[100%] flex justify-center items-center'>
          <div className='h-full items-center justify-center flex w-[90%] xl:bg-secondary'>
            <img src={about} alt="" className='relative w-[83%] h-[90vh] md:left-20 left-16'/>
            <div className='relative xl:right-[35vw] lg:right-[45vw] md:right-[55vw] right-[75vw] sm:top-[45vh] top-[29vh] text-white bg-primary sm:h-[200px] h-[160px] w-[180px] flex flex-col justify-center items-center text-center '>
                <p className='text-[35px]'>5+</p>
                <p className='text-2xl'>Use cases</p>
            </div>
          </div> 
      </div>
      <div className='h-full w-[50%]  flex justify-center items-start text-gray-700'>
        <div className='flex flex-col xl:w-[80%] text-start gap-8'>
        <div >
          <p className='sm:text-2xl text-xl text-gray-700 text-center'>About our HazeDefy</p>
          <hr className='border-primary mt-2' />
        </div>
        <p className='sm:text-[40px] text-[28px] font-bold mt-2 text-black text-center'>Premier Dehaze System Services</p>
        <p>Experience the transformative power of our cutting-edge dehazing model. Whether it's images, videos, or real-time applications, we clear away haze, unveiling vivid details with unparalleled precision. Embrace clarity in every frame, enriching your visual experience like never before. Discover the magic of clear vision today.</p>
        <ul class="list-disc">
            <li>
            Our state-of-the-art dehazing technology ensures unparalleled clarity in both images and videos.  
            </li>
            <li>Instantly remove haze from your visuals with our real-time dehazing capabilities.</li>
            <li>Elevate your content with enhanced visibility, contrast, and detail using our advanced model.</li>
        </ul>
        <button className='px-12 py-6 w-[300px] bg-primary mt-8 text-white'>
              DISCOVER MORE
            </button>
        </div>
      
      </div>
    </div>
  )
}

export default About
