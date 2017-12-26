export const Flash = {
  errors: null,
  renderErrors() {
    let errors = this.errors
    this.errors = null
  	if (errors !== null){
      return(
        Object.entries(errors.errorMessage).map(entry => entry[1])
        );
  	}else{
      return null;
    }
  }
}