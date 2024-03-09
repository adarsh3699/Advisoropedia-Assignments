const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

async function apiCall(endpoint, method, body) {
	const apiUrl = apiBaseUrl + endpoint;
	try {
		let apiCallResp;
		const authorization = localStorage.getItem('JWT_token');

		if (method === 'GET' || method === undefined) {
			apiCallResp = await fetch(apiUrl, {
				headers: { Authorization: 'Bearer ' + authorization },
			});
		} else {
			apiCallResp = await fetch(apiUrl, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + authorization,
				},
				body: JSON.stringify(body),
			});
		}

		const apiJsonResp = await apiCallResp.json();
		return apiJsonResp;
	} catch (error) {
		return { msg: 'Something went wrong', statusCode: 500 };
	}
}

function extractEncryptedToken(token) {
	try {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (err) {
		console.log(err);
	}
}

export { apiCall, extractEncryptedToken };
