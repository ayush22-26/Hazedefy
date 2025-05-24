import React, { useState } from 'react';
import axios from 'axios';
import vdehaze from '../assets/vdehaze.jpg';
import load from '../assets/loading-icon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashLoader } from 'react-spinners';
import { API_BASE_URL, API_KEY } from '../../config'


function Video() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = () => {
    if (!selectedFile) {
      toast.warn("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post(`${API_BASE_URL}/uploadvideo/`, formData)
      .then((response) => {
        const videoUrl = response.data.processed_video_url;
        setProcessedVideoUrl(videoUrl);
        toast.success("Dehaze Done!!");
      })
      .catch((error) => {
        console.error('Upload failed:', error.message);
        toast.error("Dehaze failed!!");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const downloadProcessedVideo = async () => {
    if (!processedVideoUrl) {
      toast.error("Download Failed")
      return;
    }

    setDownloading(true);

    try {
      const response = await axios.get(processedVideoUrl, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_video.mp4');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download Done!!");
    } catch (error) {
      console.error('Download failed:', error.message);
      toast.error("Download failed!!");
    } finally {
      setDownloading(false);
      setSelectedFile(null);
      setProcessedVideoUrl(null);
    }
  };


  return (
    <div>
      <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8 font-serif">
        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
          <div className="text-left">
            <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-gray-800">
              Dehaze <span className="font-bold text-primary">Videos</span>
            </h2>
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Our state-of-the-art dehazing technology ensures unparalleled clarity in both images and videos.
            </p>

            <div className="mt-5 sm:flex md:mt-8">
              {!uploading && !processedVideoUrl && (
                <div className="rounded-md shadow">
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-primary border border-transparent rounded-md cursor-pointer focus:outline-none md:py-4 md:text-lg md:px-8"
                  >
                    Choose file
                    <input
                      id="video-upload"
                      name="file"
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={fileSelectedHandler}
                    />
                  </label>
                </div>
              )}

              {!uploading && selectedFile && !processedVideoUrl && (
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <button
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-primary transition duration-150 ease-in-out bg-secondary border border-transparent rounded-md cursor-pointer md:py-4 md:text-lg md:px-8"
                    onClick={fileUploadHandler}
                  >
                    Upload
                  </button>
                </div>
              )}

              {uploading && (
                <div>
                  <p className="text-gray-600 mt-2 items-center flex font-bold font-serif">Processing your video...
                    <HashLoader className='ml-5' color="#cc5e28" size={40} />
                  </p>
                </div>
              )}

              {processedVideoUrl && (
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  {downloading ? (
                    <div className="flex items-center text-gray-600 font-bold font-serif">
                      Downloading your video...
                      <HashLoader className="ml-4" color="#cc5e28" size={40} />
                    </div>
                  ) : (
                    <button
                      onClick={downloadProcessedVideo}
                      className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-primary transition duration-150 ease-in-out bg-secondary border border-transparent rounded-md cursor-pointer md:py-4 md:text-lg md:px-8"
                    >
                      Download Video
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
          <div className="relative w-full p-3 rounded md:p-8">
            <div className="rounded-lg bg-white text-black w-full">
              <img src={vdehaze} alt="Dehaze" />
            </div>
          </div>
        </div>
      </div>

      {/* <ToastContainer autoClose={1000} /> */}
    </div>
  );
}

export default Video;
