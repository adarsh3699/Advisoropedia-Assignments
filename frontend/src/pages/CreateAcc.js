import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { apiCall } from '../utils';
import Loader from '../components/Loader';

// import '../styles/loginPage.css';

document.title = 'Bhemu Notes | Create Your Account';

function CreateAcc() {
	const [msg, setMsg] = useState('');
	const [isApiLoading, setIsApiLoading] = useState(false);

	async function handleFormSubmit(e) {
		e.preventDefault();
		const { fName, lName, email, password, confPassword } = e.target;

		const userData = {
			firstName: fName.value?.trim(),
			lastName: lName.value?.trim(),
			email: email.value?.trim(),
			password: password.value?.trim(),
			confPassword: confPassword.value?.trim(),
		};

		if (userData.email !== '' && userData.password !== '' && userData.confPassword !== '') {
			if (userData.password === userData.confPassword) {
				setIsApiLoading(true);

				const apiResp = await apiCall('auth/signup', 'post', userData);
				if (apiResp.statusCode === 200) {
					setMsg(apiResp.msg);
					document.location.href = '/';
				} else {
					setMsg(apiResp.msg);
				}
				setIsApiLoading(false);
			} else {
				setMsg("Passwords didn't match.");
			}
		} else {
			setMsg('Please enter all data.');
		}
	}

	return (
		<div className="flex items-center bg-[#242526] justify-center min-h-screen">
			<div className="bg-[#2a2b2d] md:w-4/5 w-11/12 shadow-xl rounded-md text-center md:pb-20 pt-5 pb-10 ">
				<div className="text-slate-200 md:text-3xl text-2xl font-bold mb-5">Create Your Account</div>

				<form className="flex flex-col items-center justify-center" onSubmit={handleFormSubmit}>
					<input
						type="tet"
						name="fName"
						placeholder="First Name"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="tet"
						name="lName"
						placeholder="Last Name"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="email"
						name="email"
						placeholder="Email"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="Password"
						name="password"
						placeholder="Password (8 digit)"
						pattern="().{8,}"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<input
						type="Password"
						name="confPassword"
						placeholder="Confirm Password (8 digit)"
						pattern="().{8,}"
						className="md:text-lg text-black border-slate-950 rounded-md border-2 mb-5 px-2 h-9 md:w-1/2 outline-none hover:border-amber-400 focus:border-amber-400 w-10/12"
					/>

					<button
						disabled={isApiLoading}
						className={'bg-sky-500 hover:bg-sky-700 rounded-lg md:w-80 w-10/12 mb-5 py-1.5'}
					>
						Sign Up
					</button>
					{msg && <div className="text-orange-500 mb-5">{msg}</div>}
				</form>

				<Loader isLoading={isApiLoading} />
				<hr className="mx-20 my-5" />

				<NavLink to="/" className=" hover:underline-offset-1 hover:underline">
					Already have an Account
				</NavLink>
			</div>
		</div>
	);
}

export default CreateAcc;
