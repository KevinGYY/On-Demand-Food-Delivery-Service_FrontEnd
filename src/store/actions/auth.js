import axios from 'axios'
import * as actionTypes from './actionTypes';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccess = token => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		token: token
	}
}

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	}
}

export const logout = () => {
	window.localStorage.removeItem('user');
	window.localStorage.removeItem('expDate');
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

export const checkAuthTimeout = expTime => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		}, expTime * 1000 )
	}
} 

export const authLogin = (email, password, userType) => {
	return dispatch => {
		dispatch(authStart())
		axios.post('http://127.0.0.1:8000/api/'+ userType +'/r/login/', {
			email: email,
			password: password
		})
		.then(res => {
			const token = res.data.key;
			console.log('Logged in!!', res)
			const expDate = new Date(new Date().getTime() + 3600 * 1000)
			window.localStorage.setItem('token', token);
			window.localStorage.setItem('expDate', expDate);
			dispatch(authSuccess(token))
			dispatch(checkAuthTimeout(3600));
		})
		.catch(error => {
			dispatch(authFail(error));
		})
	}
} 

export const authSignupRest = (email, password1, restaurant_name, lat, lng) => {
	return dispatch => {
		dispatch(authStart())
		axios.post('http://127.0.0.1:8000/api/restaurant/', {
			"email": email,
			"password": password1,
			"restaurant_name": restaurant_name,
			//"address": address,
			"rest_lat": lat,
			"rest_long": lng
		})
		.then(res => {
			const token = res.data.key;
			const expDate = new Date(new Date().getTime() + 3600 * 1000)
			window.localStorage.setItem('token', token);
			window.localStorage.setItem('expDate', expDate);
			dispatch(authSuccess(token))
			dispatch(checkAuthTimeout(3600));
		})
		.catch(error => {
			dispatch(authFail(error));
			console.log(error)
		})
	}
} 

export const authSignupDriver = (email, password1, first_name, last_name, lat, lng) => {
	return dispatch => {
		dispatch(authStart())
		axios.post('http://127.0.0.1:8000/api/driver/', {
			"email": email,
			"password": password1,
			"first_name": first_name,
			"last_name": last_name,
			"driver_lat": lat,
			"driver_long": lng
		})
		.then(res => {
			const token = res.data.key;
			const expDate = new Date(new Date().getTime() + 3600 * 1000)
			window.localStorage.setItem('token', token);
			window.localStorage.setItem('expDate', expDate);
			dispatch(authSuccess(token))
			dispatch(checkAuthTimeout(3600));
		})
		.catch(error => {
			dispatch(authFail(error));
			console.log(error)
		})
	}
} 

export const authCheckState = () => {
	return dispatch => {
		const token = window.localStorage.getItem('token');
		console.log(token)
		if (token === undefined) {
			dispatch(logout());
		} else {
			const expDate = new Date(window.localStorage.getItem('expDate'));
			if (expDate <= new Date()) {
				dispatch(logout());
			} else {
				dispatch(authSuccess(token));
				dispatch(checkAuthTimeout( (expDate.getTime() - new Date().getTime()) / 1000))
			}
		}

	}
}


