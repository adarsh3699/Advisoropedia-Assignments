import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { apiCall, extractEncryptedToken } from '../utils';
import Loader from '../components/Loader';
import GoogleLoginBtn from '../components/googleLoginBtn/GoogleLoginBtn';

// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import { amber } from '@mui/material/colors';
import { useGoogleLogin } from '@react-oauth/google';

// import '../styles/loginPage.css';
import logo from '../img/newLogo.webp';

function LoginPage() {
	const [msg, setMsg] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [ispasswordVisible, setIspasswordVisible] = useState(false);

	useEffect(() => {
		if (
			localStorage.getItem('JWT_token') &&
			localStorage.getItem('user_details') &&
			localStorage.getItem('login_info')
		) {
			document.location.href = '/home';
		} else {
			setIsLoading(false);
			localStorage.clear();
		}
	}, []);

	const handlePasswordVisibility = useCallback(() => {
		setIspasswordVisible(!ispasswordVisible);
	}, [ispasswordVisible]);

	const handleUserLogin = useCallback(async (e) => {
		e.preventDefault();
		setMsg('');
		const email = e.target.email.value;
		const password = e.target.password.value;

		if (email !== '' && password !== '') {
			setIsApiLoading(true);
			const apiResp = await apiCall('auth/signin', 'post', { email, password });

			if (apiResp.statusCode === 200) {
				const extractedToken = extractEncryptedToken(apiResp.jwt);
				const userDetails = {
					...apiResp.details,
					email: extractedToken?.email,
				};

				localStorage.setItem('user_details', JSON.stringify(userDetails));
				localStorage.setItem('JWT_token', apiResp.jwt);
				localStorage.setItem('login_info', apiResp.loginInfo);
				document.location.href = '/home';
			} else {
				setMsg(apiResp.msg);
			}
			setIsApiLoading(false);
		} else {
			setMsg('Please Enter Your Email and Password');
		}
	}, []);

	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			const accessToken = tokenResponse.access_token;
			setIsApiLoading(true);
			const apiResp = await apiCall('auth/signin/google', 'post', {
				googleAccessToken: accessToken,
			});
			if (apiResp.statusCode === 200) {
				const extractedToken = extractEncryptedToken(apiResp.jwt);

				const userDetails = {
					...apiResp.details,
					email: extractedToken?.email,
				};

				localStorage.setItem('user_details', JSON.stringify(userDetails));
				localStorage.setItem('JWT_token', apiResp.jwt);
				localStorage.setItem('login_info', apiResp.loginInfo);
				document.location.href = '/home';
			} else {
				setMsg(apiResp.msg);
			}
			setIsApiLoading(false);
		},
	});

	return (
		<>
			{!isLoading && (
				<div className="flex items-center bg-[#242526] justify-center min-h-screen">
					<div className="bg-[#2a2b2d] md:w-4/5 w-11/12 shadow-xl rounded-md text-center md:pb-20 md:pt-5 pb-10">
						<img src={logo} alt="" className="m-auto" />
						<div className="text-slate-200 text-3xl font-bold mb-5">Advisoropedia Assignment</div>
						<form className="flex flex-col items-center justify-center" onSubmit={handleUserLogin}>
							<input
								type="email"
								name="email"
								placeholder="Email"
								disabled={isApiLoading}
								className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
							/>
							<input
								type={ispasswordVisible ? 'text' : 'password'}
								name="password"
								placeholder="Password"
								disabled={isApiLoading}
								className="md:text-lg text-black border-slate-950 rounded-md border-2 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
							/>
							<div className="flex m-5">
								<input type="checkbox" id="showPass" onChange={handlePasswordVisibility} />
								<label htmlFor="showPass" className="select-none ml-2">
									Show password
								</label>
							</div>
							<button
								id="login"
								disabled={isApiLoading}
								className={'bg-sky-500 hover:bg-sky-700 rounded-lg md:w-80 w-10/12 mb-5 py-1.5'}
							>
								Login
							</button>
						</form>
						<GoogleLoginBtn onClickFunction={googleLogin} />
						{msg && <div className="text-orange-500 mb-5">{msg}</div>}
						<Loader isLoading={isApiLoading} />
						<NavLink to="/forget-password" className="hover:underline-offset-1 hover:underline">
							Forgotten Password
						</NavLink>
						<hr className="mx-20 my-5" />
						<NavLink
							to="/register"
							className="bg-violet-500 hover:bg-violet-600 rounded-lg md:px-20 px-10 mb-5 py-2"
						>
							Create New Account
						</NavLink>
					</div>
				</div>
			)}
		</>
	);
}

export default LoginPage;
