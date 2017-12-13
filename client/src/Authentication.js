import Client from "./client";

export const Authentication = {
  currentUser: null,
  getCurrentUser(cb) {
  	Client.getCurrentUser()
  	.then((currentUser) => this.currentUser = currentUser)
  	.then(cb)
  },
  login(login_params, cb) {
  	Client.login(login_params)
  	.then((currentUser)=> this.currentUser = currentUser)
  	.then(cb)
  },
  signup(user_params, cb){
  	Client.signup(user_params)
  	.then((currentUser) => this.currentUser = currentUser)
	.then(cb)
  },
  signout(cb) {
  	Client.signout()
    .then(() => this.currentUser = null)
    .then(cb)
  }
}