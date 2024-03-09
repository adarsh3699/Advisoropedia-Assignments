import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils';

import Loader from '../components/Loader';
import NavBar from '../components/NavBar';
import PostContainer from '../components/PostContainer';

function HomePage() {
	const [allData, setAllData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [msg, setMsg] = useState('');

	useEffect(() => {
		if (
			localStorage.getItem('JWT_token') &&
			localStorage.getItem('user_details') &&
			localStorage.getItem('login_info')
		) {
		} else {
			localStorage.clear();
			document.location.href = '/';
		}
	}, []);

	useEffect(() => {
		(async function () {
			setIsLoading(true);
			const apiResp = await apiCall('home');
			if (apiResp.statusCode === 200) {
				setAllData(apiResp.data);
			} else if (apiResp.statusCode === 401) {
				localStorage.clear();
				document.location.href = '/';
			} else {
				setMsg(apiResp.msg);
			}
			setIsLoading(false);
		})();
	}, []);

	return (
		<div>
			<NavBar />
			<Loader isLoading={isLoading} />

			{!isLoading && (
				<div>
					{msg && <div>{msg}</div>}
					{allData.data.length > 0 && (
						<div>
							{allData.data?.map((item, index) => (
								<PostContainer key={index} index={index} item={item} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default HomePage;
