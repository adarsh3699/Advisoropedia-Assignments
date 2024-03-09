import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { apiCall } from '../utils';
import Loader from '../components/Loader';

// import '../styles/loginPage.css';

function ForgetPasswordPage() {
	const [emailVal, setEmailValsg] = useState('');
	const [encryptedOtp, setEncryptedOtp] = useState('');

	const [otpMsg, setOtpMsg] = useState('');
	const [passMsg, setPassMsg] = useState('');

	const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);
	const [isPassApiLoading, setIsPassApiLoading] = useState(false);
	const [showChangePassForm, setShowChangePassForm] = useState(false);

	const handleEmailValue = useCallback((e) => {
		setEmailValsg(e.target.value);
	}, []);

	const handleSendOtpBtnClick = useCallback(
		async (e) => {
			e.preventDefault();

			if (emailVal) {
				setIsOTPApiLoading(true);
				const apiResp = await apiCall('auth/forget_password', 'post', {
					email: emailVal,
				});
				if (apiResp.statusCode === 200) {
					setShowChangePassForm(true);
					setOtpMsg(apiResp.msg);
					setEncryptedOtp(apiResp.otp);
				} else {
					setOtpMsg(apiResp.msg);
				}
				setIsOTPApiLoading(false);
			} else {
				setOtpMsg('Please Enter Your Email');
			}
		},
		[emailVal]
	);

	const handleConfirmPasswordClick = useCallback(
		async (e) => {
			e.preventDefault();

			setIsPassApiLoading(true);
			const otp = e.target.otp.value;
			const password = e.target.password.value;
			const confPassword = e.target.confPassword.value;

			if (password === confPassword) {
				const apiResp = await apiCall('auth/change_password', 'POST', {
					email: emailVal,
					password,
					encryptedOtp,
					otp,
				});
				if (apiResp.statusCode === 200) {
					setPassMsg(apiResp.msg);
					document.location.href = '/';
				} else {
					setPassMsg(apiResp.msg);
				}
			} else {
				setPassMsg('Password does not match');
			}
			setIsPassApiLoading(false);
		},
		[emailVal, encryptedOtp]
	);

	return (
		<div className="flex items-center bg-[#242526] justify-center min-h-screen">
			<div className="bg-[#2a2b2d] md:w-4/5 w-11/12 shadow-xl rounded-md text-center md:pb-20 pt-5 pb-10 ">
				<div className="text-slate-200 md:text-3xl text-2xl font-bold mb-5">Forget Password</div>
				<form
					className="flex flex-col items-center justify-center"
					onSubmit={handleSendOtpBtnClick}
					style={showChangePassForm ? { display: 'none' } : null}
				>
					<input
						type="email"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
						onChange={handleEmailValue}
						value={emailVal}
						placeholder="Email"
					/>

					<button className={'bg-sky-500 hover:bg-sky-700 rounded-lg md:w-80 w-10/12 mb-5 py-1.5'}>
						Send OTP
					</button>

					{otpMsg && <div className="text-orange-500 mb-5">{otpMsg}</div>}
					<Loader isLoading={isOTPApiLoading} />
					<br />
				</form>

				<form
					className="flex flex-col items-center justify-center"
					style={showChangePassForm ? null : { display: 'none' }}
					onSubmit={handleConfirmPasswordClick}
				>
					<input
						type="number"
						name="otp"
						required
						placeholder="Enter OTP"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="password"
						name="password"
						required
						pattern="().{8,}"
						placeholder="New Password (Min 8 digit)"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="password"
						name="confPassword"
						required
						pattern="().{8,}"
						placeholder="Confirm Password (Min 8 digit)"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<button
						id="login"
						disabled={isPassApiLoading}
						className={'bg-sky-500 hover:bg-sky-700 rounded-lg md:w-80 w-10/12 mb-5 py-1.5'}
					>
						Confirm Password
					</button>
					<div className="red" style={isPassApiLoading ? { marginBottom: 'unset' } : {}}>
						{passMsg}
					</div>
					<Loader isLoading={isPassApiLoading} />
				</form>

				<NavLink to="/" className="hover:underline-offset-1 hover:underline">
					Back to Login Page
				</NavLink>
			</div>
		</div>
	);
}

export default ForgetPasswordPage;
