import Client from "./api";

export const Authentication = {
  currentUser: null,
  getCurrentUser(cb) {
  	Client.getCurrentUser()
  	.then((currentUser) => this.currentUser = currentUser)
  	.then(cb)
  },
  login(login_params, cb, handleError) {
  	Client.login(login_params)
  	.then((currentUser)=> this.currentUser = currentUser)
  	.then(cb)
    .catch(handleError)
  },
  signup(user_params, cb, handleError){
  	Client.signup(user_params)
  	.then((currentUser) => this.currentUser = currentUser)
	  .then(cb)
    .catch(handleError)
  },
  signout(cb) {
  	Client.signout()
    .then(() => this.currentUser = null)
    .then(cb)
  }
}
