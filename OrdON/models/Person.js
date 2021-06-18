class Person  {
    isAccountValidated = false;
    constructor(name, firstname, email, password){
        this.name = name;
        this.firstname = firstname;
        this.email = email;
        this.password = password;
    }

    setIsAccountValidated(isAccountValidated){
        this.isAccountValidated =isAccountValidated;
    }
    
}

module.exports = Person