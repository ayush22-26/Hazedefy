import './App.css'
import Navbar from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Upload from './pages/Upload';
import ImageUpload from './pages/ImageUpload';
import RealTimeDehaze from './pages/RealTimeDehaze';
import Video from './pages/Video';
import LocationData from './pages/Alert';
import DynamicGoogleMap from './components/Map';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/upload" element={<Upload/>} />
    <Route path="/image-upload" element={<ImageUpload/>} />
    <Route path='/real-time' element={<RealTimeDehaze/>}/>
    <Route path='/video-upload' element={<Video/>}/>
    <Route path='/alert' element={<LocationData/>}/>
    <Route path='/map' element={<DynamicGoogleMap/>}/>
  
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
