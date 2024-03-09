import React, { Suspense, lazy } from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
import Loader from './components/Loader';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'));
const CreateAcc = lazy(() => import('./pages/CreateAcc'));
const HomePage = lazy(() => import('./pages/HomePage'));

function Routes() {
	return (
		<Suspense
			fallback={
				<div id="loadingScreen">
					Loading <Loader isLoading={true} />
				</div>
			}
		>
			<Switch>
				<Route exact path="/" element={<LoginPage />} />
				<Route exact path="/register" element={<CreateAcc />} />
				<Route exact path="/forget-password" element={<ForgetPasswordPage />} />
				<Route exact path="/home" element={<HomePage />} />

				<Route
					path="*"
					element={
						<center>
							<h1>Page not Found</h1>
						</center>
					}
				/>
			</Switch>
		</Suspense>
	);
}

export default Routes;
