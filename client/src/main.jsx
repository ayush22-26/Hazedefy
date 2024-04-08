import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import './index.css'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-gq6f2tyllrg5ffpm.us.auth0.com"
    clientId="aDDXDVaDLIRYWSJgJhTADmOr6Y9jm79h"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
    <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
bodyClassName="toastBody"
/>
  </Auth0Provider>
  </React.StrictMode>,
)