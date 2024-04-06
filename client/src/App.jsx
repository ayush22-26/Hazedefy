import './App.css'
import Navbar from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Upload from './pages/Upload';
import LocationData from './pages/Alert';
import DynamicGoogleMap from './components/Map';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/upload" element={<Upload/>} />
    <Route path='/alert' element={<LocationData/>}/>
    <Route path='/map' element={<DynamicGoogleMap/>}/>
  
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
