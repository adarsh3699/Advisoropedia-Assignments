const express = require('express');
const { verifyAccessToken } = require('../utils');
const axios = require('axios');

const app = express();

//get all notes
app.get('/', async function (req, res) {
	try {
		const isAccessTokenValid = verifyAccessToken(req);

		if (isAccessTokenValid?.authorization === false) {
			return res.status(401).json({ statusCode: 401, msg: isAccessTokenValid?.message });
		}

		const userId = isAccessTokenValid?.payload?.userId;
		if (!userId) return res.status(400).json({ statusCode: 400, msg: 'Bad Request' });

		const response = await axios.get(
			'https://pricee.com/api/v1/search.php?q=iphone+15&size=50&lang=en&page=1&vuid=0&platform=1'
		);
		res.status(200);
		res.send({ statusCode: 200, msg: 'success', data: response.data });
	} catch (err) {
		console.log(err);
		res.status(500);
		res.send({ statusCode: 500, msg: 'Internal server error' });
	}
});

//exporting this file so that it can be used at other places
module.exports = app;
