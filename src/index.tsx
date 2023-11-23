import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./redux";
import {BrowserRouter} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_ACCESS_KEY as string}>
            <BrowserRouter>
                <Provider store={store}>
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"/>
                    <App />
                </Provider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
