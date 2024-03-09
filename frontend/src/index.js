import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './styles/index.css';

const apiBaseUrl = process.env.REACT_APP_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<GoogleOAuthProvider clientId={apiBaseUrl}>
				<Routes />
			</GoogleOAuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import Routes from './routes';
// import './css/index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <Routes />
//     </React.StrictMode>
// );
