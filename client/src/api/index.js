import App from "../cable";

function endSubscription(subscription) {
	App.cable.subscriptions.remove(subscription);
}

function subscribe(args, cb) {
	return(
		App.cable.subscriptions.create(args ,{
			connected: function() { console.log("cable: connected") },
			disconnected: function() { console.log("cable: disconnected") },
			received: cb
		}
		)
	);
}

function imWatching(gameId, cb){
	return fetch("/games/im_watching",{
		method: "POST",
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(gameId)
	})
	.then(checkStatus)
}

function gameTypes() {
	return fetch("/games/get_game_types",{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then(checkStatus)
	.then(parseJSON)
}

function getCurrentUser() {
	return fetch("/users/get_current_user",{
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then(checkStatus)
	.then(parseJSON)
}

function signup(signup_params, cb) {
	return fetch("/users", {
		credentials: 'include',
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(signup_params)
	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function login(login_params) {
	return fetch("/users/sign_in", {
		credentials: 'include',
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(login_params)
	})
	.then(checkStatus)
	.then(parseJSON)
}

function signout(){
	return fetch("/users/sign_out", {
		credentials: 'include',
		method: "DELETE",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then(checkStatus)
}

function otherUsers(cb) {
	return fetch("/api/users", {
		credentials: 'include'
	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function challenge(challenged_id, game_type, cb, errorHandler) {
	return fetch("/api/challenge", {
		credentials: 'include',
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({challenged_id: challenged_id, game_type: game_type})
	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb)
	.catch(errorHandler);
}

function games(cb) {
	return fetch("/api/games", {
		credentials: 'include',
	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function loadGame(game_id, cb) {
	return fetch("/api/game/" + game_id, {
		credentials: 'include'
	})
	.then(checkStatus)
	.then(parseJSON)
	.then(cb);
}

function updateBoard(game_id, location) {
	return fetch("/api/move", {
		credentials: 'include',
		method: "PUT",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({game_id, location})
	})
}

function nudge(user_id, game_id) {
	return fetch("games/nudge", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({user_id, game_id})
	})
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	const error = new Error(`HTTP Error ${response.statusText}`);
	error.status = response.statusText;
	error.response = response;
	console.log(error);
	throw error;
}

function parseJSON(response) {
	return response.json();
}

const Client = { login, otherUsers, challenge, games, loadGame, updateBoard, signup, getCurrentUser, gameTypes, subscribe, endSubscription, signout, imWatching, nudge };
export default Client;
