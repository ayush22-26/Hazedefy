import React, { useEffect } from 'react';
import { API_BASE_URL, API_KEY } from '../../config'

const RealTimeDehaze = () => {
    useEffect(() => {
        const accessCamera = async () => {
            try {
                const video = document.getElementById('original-video');
                const dehazedImage = document.getElementById('dehazed-image');

                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;

                video.addEventListener('play', () => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = 640;
                    canvas.height = 480;

                    setInterval(() => {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = canvas.toDataURL('image/jpeg');

                        // Send the frame to the server for dehazing
                        fetch(`${API_BASE_URL}/process_frame/`, {
                            method: 'POST',
                            body: JSON.stringify({ image_data: imageData }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            // Display dehazed frame
                            dehazedImage.src = 'data:image/jpeg;base64,' + data.dehazed_image;
                        });
                    }, 1000 / 30);
                });
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        accessCamera();
    }, []);

    return (
        <div className='mb-10'>
            <div className='w-full text-center mt-10 mb-10 font-serif'>
            <p className='sm:text-[45px] text-[28px] font-bold mt-2 text-primary'>Real Time Dehaze</p>
            </div>
            <div id="video-container" className='flex w-full h-[80%] justify-evenly items-center text-center'>
                <div id="original-frame ">
                    <h3 className='text-2xl font-bold pb-4'>Original Frame</h3>
                    <video id="original-video" autoPlay playsInline width="500" height="480" className='rounded-xl'></video>
                </div>
                <div id="dehazed-frame">
                    <h3 className='text-2xl font-bold pb-4'>Dehazed Frame</h3>
                    <img id="dehazed-image" src="" alt="Dehazed Image" width="500" height="480" className='rounded-xl'/>
                </div>
            </div>
        </div>
    );
};

export default RealTimeDehaze;