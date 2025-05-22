import React, { useState } from 'react';
import axios from 'axios';
import dehaze from '../assets/dehazed.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dehazedImagePath, setDehazedImagePath] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };

  const uploadFile = async () => {
  const formData = new FormData();
  formData.append('upload_file', file);

  try {
    const response = await axios.post('http://127.0.0.1:8000/dehaze/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("Response data:", response.data);  // <-- check what backend sends

    const imageUrl = response.data.dehazed_image_url;  // Adjust key if needed
    if (!imageUrl) {
      toast.error("No image URL returned from backend");
      return;
    }
    setDehazedImagePath(imageUrl);
    setShowModal(true);
    toast.success("Dehaze Done!!");
    setUploadHistory(prev => [
      ...prev,
      { original_url: uploadedImage, dehazed_url: imageUrl }
    ]);
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error("Upload failed!");
  }
};


  const downloadImage = async () => {
  if (!dehazedImagePath) {
    toast.error("Download Failed");
    return;
  }

  try {
    const response = await axios.get(dehazedImagePath, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dehazed_image.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download Done!!");
  } catch (error) {
    console.error("Image download failed:", error);
    toast.error("Download Failed!!");
  } finally {
    setShowModal(false);
  }
};


  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8 font-serif">
        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
          <div className="text-left">
            <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-800 ">
              Dehaze <span className="font-bold text-primary">Images</span>
            </h2>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Our state-of-the-art dehazing technology ensures unparalleled clarity in both images and videos.
            </p>
            <div className="mt-5 sm:flex md:mt-8">
              <div className="rounded-md shadow">
                <label htmlFor="image-upload" className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md cursor-pointer">
                  Choose file
                  <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              {file && (
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-primary bg-secondary border border-transparent rounded-md"
                    onClick={uploadFile}
                  >
                    Upload Image
                  </button>
                </div>
              )}
              {showModal && (
                <div className='fixed z-50 inset-0 bg-white w-full h-full'>
                  <button className="fixed right-1 top-1 px-4 py-2 bg-primary text-white rounded-md" onClick={handleClose}>Close</button>
                  <div className='flex flex-col w-full h-full justify-center items-center'>
                    <div className='flex gap-1 '>
                      <div className='text-center'>
                        <p className='text-primary text-3xl font-bold'>Before</p>
                        <img src={uploadedImage} className='w-[500px] h-[400px]' alt="Before" />
                      </div>
                      <div className='text-center'>
                        <p className='text-primary text-3xl font-bold'>After</p>
                        <img src={dehazedImagePath} className='w-[500px] h-[400px]' alt="After" />
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

      {/* Upload History */}
      <div className="max-w-4xl mx-auto p-4">
        <h3 className="text-2xl font-bold mb-4">Upload History</h3>
        <ul className="space-y-3">
          {uploadHistory.map((upload, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded">
              <div><strong>Original:</strong> <a href={upload.original_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View</a></div>
              <div><strong>Dehazed:</strong> <a href={upload.dehazed_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View</a></div>
            </li>
          ))}
        </ul>
      </div>

      {/* <ToastContainer autoClose={500} /> */}
    </div>
  );
}

export default ImageUpload;
