const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getMongoDb } = require('./utils');

const auth = require('./routes/auth');
const home = require('./routes/home');

const app = express();

const allowlist = [
	'https://comparison.bhemu.me/',
	'http://localhost:3000/',
	'http://localhost:3001/',
	'https://price-comparison-web.vercel.app/',
];

app.use(cors(allowlist));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/home', home);

const PORT = process.env.PORT || 4000;

app.get('/', function (req, res) {
	res.send('Hello World');
});

mongoose.set('strictQuery', false);
mongoose
	.connect(getMongoDb(), { useNewUrlParser: true })
	.then(() =>
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT}`);
		})
	)
	.catch((err) => {
		console.log(err);
	});
