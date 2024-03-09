import React, { useCallback } from 'react';

function NavBar() {
	const handleLogoutBtn = useCallback(() => {
		localStorage.clear();
		document.location.href = '/';
	}, []);
	return (
		<nav className="bg-[#191919] sticky h-14 flex items-center justify-between px-5 drop-shadow-lg">
			<div className="text-3xl cursor-pointer">Advisoropedia</div>
			<div className="text-2xl cursor-pointer hover:underline" onClick={handleLogoutBtn}>
				Logout
			</div>
		</nav>
	);
}

export default NavBar;
