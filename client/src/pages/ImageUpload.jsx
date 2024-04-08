import React, { useState } from 'react';
import axios from 'axios';
import dehaze from '../assets/dehazed.png';
import { toast } from 'react-toastify';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dehazedImagePath, setDehazedImagePath] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0])); // Store the uploaded image
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('upload_file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/dehaze/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(response.data);
      setDehazedImagePath(url);
      setShowModal(true);
      toast.success("Dehaze Done!!");
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const downloadImage = async () => {
    if (dehazedImagePath) {
      try {
        const response = await axios.get(dehazedImagePath, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'dehazed_image.jpg');
        document.body.appendChild(link);
        link.click();
        setShowModal(false); // Close the modal after downloading
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  }

  return (
    <div>
      <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8 font-serif">
        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
          <div className="text-left">
            <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 ">
              Dehaze
              <span className="font-bold text-primary"> Images</span>
            </h2>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Our state-of-the-art dehazing technology ensures unparalleled clarity in both images and videos.
            </p>
            <div className="mt-5 sm:flex md:mt-8">
              <div className="rounded-md shadow">
                <label htmlFor="image-upload" className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-primary border border-transparent rounded-md cursor-pointer focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10">
                  Choose file
                  <input id="image-upload" name="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <button className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-primary transition duration-150 ease-in-out bg-secondary border border-transparent rounded-md cursor-pointer  focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10" onClick={uploadFile}>
                  Upload Image
                </button>
              </div>
              {showModal && (
                // <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto bg-gray-700 bg-opacity-50">
                //   <div className="bg-white p-8 max-w-md mx-auto rounded-lg flex">
                //     <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                //     <img src={dehazedImagePath} alt="Dehazed" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                //   </div>
                //     <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md" onClick={downloadImage}>Download Dehazed Image</button>
                // </div>
                <div className='fixed z-50 inset-0 bg-white w-full h-full '>
                  <button className="fixed right-1 top-1  px-4 py-2 bg-primary text-white rounded-md" onClick={handleClose}>Close</button>
                  <div className='flex flex-col w-full h-full justify-center items-center'>
                  <div className='flex gap-1 '>
                    <div className='text-center'>
                    <p className='text-primary text-3xl font-bold'>Before</p>
                    <img src={uploadedImage} className='w-[500px] h-[400px]'/>
                    </div>
                    <div className='text-center'>
                    <p  className='text-primary text-3xl font-bold'>After</p>
                    <img src={dehazedImagePath}  className='w-[500px] h-[400px]' />
                    </div>
                  </div>
                  <div>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md" onClick={downloadImage}>Download Dehazed Image</button>
                  </div>
                  </div>
                  
                  </div>
               
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
          <div className="relative w-full p-3 rounded md:p-8">
            <div className="rounded-lg bg-white text-black w-full">
              <img src={dehaze} alt="Dehaze" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
