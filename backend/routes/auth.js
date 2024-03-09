const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { md5Hash, sendMail, encryptText, decryptText, createTokens } = require('../utils');
const User = require('../models/user');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello Auth');
});

// normal-auth
app.post('/signin', async (req, res) => {
	const email = req.body.email?.trim();
	const password = req.body.password?.trim();

	if (!email || !password) return res.status(400).json({ statusCode: 400, msg: 'Invalid field!' });
	try {
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ statusCode: 404, msg: "User don't exist!" });
		}

		if (existingUser?.linkWithPassword) {
			const encryptedPassword = md5Hash(password);

			if (encryptedPassword !== existingUser.password) {
				return res.status(400).json({ statusCode: 400, msg: 'Invalid credintials!' });
			}

			const details = {
				firstName: existingUser.firstName,
				lastName: existingUser.lastName,
			};

			const token = createTokens({ userId: existingUser._id, email: existingUser.email });
			const loginInfo = createTokens({
				verified: existingUser?.verified,
				linkWithGoogle: existingUser?.linkWithGoogle,
				linkWithPassword: existingUser?.linkWithPassword,
			});

			res.status(200).json({ statusCode: 200, details, jwt: token, loginInfo, msg: 'Login Successfully' });
		} else {
			return res.status(400).json({
				statusCode: 400,
				msg: 'You have an account using Google Login. So,Please login through the Google button or forget password to create a password.',
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: 'Something went wrong!' });
	}
});

// google-auth
app.post('/signin/google', async (req, res) => {
	const googleAccessToken = req.body?.googleAccessToken;
	const createdOn = new Date(Date.now());

	try {
		if (googleAccessToken) {
			axios
				.get('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${req.body.googleAccessToken}`,
					},
				})
				.then(async (response) => {
					const firstName = response.data.given_name;
					const lastName = response.data.family_name ? response.data.family_name : '_';
					const email = response.data.email;
					const picture = response.data.picture;

					const existingUser = await User.findOne({ email });

					if (!existingUser) {
						const result = await User.create({
							firstName,
							lastName,
							profilePicture: picture,
							email,
							verified: true,
							linkWithGoogle: true,
							linkWithPassword: false,
							createdOn,
						});

						const token = createTokens({ userId: result?._id, email: result?.email });
						const loginInfo = createTokens({
							verified: result?.verified,
							linkWithGoogle: result?.linkWithGoogle,
							linkWithPassword: result?.linkWithPassword,
						});

						const details = {
							firstName: result?.firstName,
							lastName: result?.lastName,
							profilePicture: result?.profilePicture,
						};
						res.status(200).json({
							statusCode: 200,
							details,
							jwt: token,
							loginInfo,
							msg: 'Login Successfully',
						});
					} else if (existingUser.linkWithGoogle === true) {
						const token = createTokens({ userId: existingUser._id, email: existingUser.email });
						const loginInfo = createTokens({
							verified: existingUser?.verified,
							linkWithGoogle: existingUser?.linkWithGoogle,
							linkWithPassword: existingUser?.linkWithPassword,
						});

						const details = {
							firstName: existingUser.firstName,
							lastName: existingUser.lastName,
							profilePicture: existingUser.profilePicture,
						};

						res.status(200).json({
							statusCode: 200,
							details,
							jwt: token,
							loginInfo,
							msg: 'Login Successfully',
						});
					} else {
						return res
							.status(404)
							.json({ statusCode: 404, msg: 'Please login through your email password.' });
					}
				})
				.catch((err) => {
					// console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);
					res.status(400).json({ statusCode: 400, msg: 'Invalid access token!' });
				});
		} else {
			res.status(400).json({ statusCode: 400, msg: 'Please provide Token' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: 'Something went wrong!' });
	}
});

// create new User
app.post('/signup', async (req, res) => {
	// normal form signup
	const email = req.body.email?.trim();
	const password = req.body.password?.trim();
	const confPassword = req.body.confPassword?.trim();
	const firstName = req.body.firstName?.trim();
	const lastName = req.body.lastName?.trim();
	const createdOn = new Date(Date.now());

	try {
		if (!email || !password || !confPassword || !firstName || !lastName)
			return res
				.status(400)
				.json({ statusCode: 400, msg: 'Please Provide all Details or Check password Pattern' });

		if (password !== confPassword) return res.status(400).json({ statusCode: 400, msg: 'Password does not match' });
		if (password.length < 8)
			return res.status(400).json({ statusCode: 400, msg: 'Password must be at least 8 characters' });

		const existingUser = await User.findOne({ email });

		if (existingUser) return res.status(400).json({ statusCode: 400, msg: 'User already exist!' });

		const hashedPassword = md5Hash(password);

		const result = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			verified: true,
			linkWithGoogle: false,
			linkWithPassword: true,
			createdOn,
		});

		res.status(200).json({ statusCode: 200, msg: 'Successfully Created' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: 'Something went wrong!' });
	}
});

app.post('/forget_password', async function (req, res) {
	const email = req.body.email?.trim();
	try {
		if (!email) res.status(400).json({ statusCode: 400, msg: 'Please Enter Your Email' });
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ statusCode: 404, msg: "User don't exist!" });
		}
		let toSend = {};
		const otp = Math.floor(1000 + Math.random() * 9000);

		sendMail(email, 'Forgot Password', 'Your OTP is', otp);

		toSend.statusCode = 200;
		toSend.msg = 'OTP sent successfully';
		toSend.otp = encryptText(otp + '');

		res.status(toSend.statusCode);
		res.send(toSend);
	} catch (err) {
		console.log(err);
		res.status(500).json({ statusCode: 500, msg: 'Something went wrong!' });
	}
});

app.post('/change_password', async function (req, res) {
	const email = req.body.email?.trim();
	const password = req.body.password?.trim();
	const otp = req.body.otp?.trim();
	const encryptedOtp = decryptText(req.body.encryptedOtp);

	try {
		if (email && req.body.password && otp && req.body.encryptedOtp) {
			if (otp !== encryptedOtp) res.status(400).json({ statusCode: 400, msg: 'OTP do not match' });

			const encryptedPassword = md5Hash(password);

			const queryResp = await User.updateOne(
				{ email },
				{ $set: { password: encryptedPassword, linkWithPassword: true } }
			);

			let toSend = {};
			toSend.statusCode = 200;
			toSend.msg = 'Password updated successfully';
			res.status(toSend.statusCode);
			res.send(toSend);
		} else {
			res.status(400);
			res.send({ statusCode: 400, msg: 'Please provide all details' });
		}
	} catch (e) {
		res.status(500);
		res.send({ statusCode: 500, msg: 'Something went wrong', error: e.message });
	}
});

module.exports = app;
