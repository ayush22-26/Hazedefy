import React, { useState } from 'react';
import logo from '../assets/logo.png';
import About from '../sections/About';
import Services from '../sections/Services';
import { toast } from 'react-toastify';

function Navbar() {
  // Remove Auth0 usage
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDropdownOpen, setLogoutDropdownOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    picture: logo, // fallback to logo if not authenticated
  });

  const handleClick = (component) => {
    setCurrentComponent(component);
    setMenuOpen(false);

    // Scroll to the selected component
    const element = document.getElementById(component);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simulate login/logout
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser({
      picture: logo,
    });
    toast.success("User Logged In!!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({
      picture: logo,
    });
    toast.success("User Logged Out!!");
    setLogoutDropdownOpen(false);
  };

  return (
    <>
      <div className='h-[15vh] flex justify-between md:px-8 px-2 items-center font-serif'>
        <div>
          <img src={logo} alt="" className='h-[10vh]' />
        </div>
        <div>
          <div className='flex gap-8 items-center'>
            <div className='md:flex gap-8 items-center hidden'>
              <a href="/">Home</a>
              <a href="#" onClick={() => handleClick('about')}>About Us</a>
              <a href="#" onClick={() => handleClick('services')}>Services</a>
              {isAuthenticated ? (
                <>
                  <a href="/upload">Upload</a>
                  <button onClick={() => setLogoutDropdownOpen(!logoutDropdownOpen)}>
                    <img src={user.picture} alt="" className='w-[40px] rounded-[50%]' />
                  </button>
                </>
              ) : (
                <button onClick={handleLogin}>Login</button>
              )}
            </div>
            <button className='bg-primary px-2 py-1 md:hidden' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>
      </div>
      {logoutDropdownOpen && isAuthenticated &&
        <div className="absolute top-[15.2vh] right-4 bg-white rounded-lg shadow-md z-10">
          <button onClick={handleLogout} className='px-4 py-2'>Logout</button>
        </div>
      }
      <div className={`w-full h-[100vh] flex ${menuOpen ? 'fixed inset-0 z-10' : 'hidden'}`}>
        <div className='w-[20%] bg-primary h-full'></div>
        <div className='w-[80%] bg-black h-[100vh] flex flex-col items-center gap-24'>
          <div className='flex w-full justify-between items-center px-4 h-[15vh]'>
            <img src={logo} alt="" className='h-[10vh]' />
            <button className='text-white' onClick={() => setMenuOpen(false)}>🗙</button>
            {currentComponent === 'about' && <About />}
            {currentComponent === 'services' && <Services />}
          </div>
          <div className='flex flex-col text-white items-start gap-4'>
            <div>
              <a href="/">Home</a>
              <hr className="absolute left-[21vw] right-[1vw] border-white my-2" />
            </div>
            <div>
              <a href="">About Us</a>
              <hr className="absolute left-[21vw] right-[1vw] border-white my-2" />
            </div>
            <div>
              <a href="">Services</a>
              <hr className="absolute left-[21vw] right-[1vw] border-white my-2" />
            </div>
            <div>
              <a href="/upload">Upload</a>
              <hr className="absolute left-[21vw] right-[1vw] border-white my-2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
