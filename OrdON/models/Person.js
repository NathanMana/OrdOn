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

    setName(name){
        this.name = name
    }

    setFirstName(firstName){
        this.firstName = firstName
    }

    setEmail(email){
        this.email = email
    }

    setPassword(password){
        this.password = password
    }

    getName(){
        return this.name;
    }

    getFirstName(){
        return this.firstName;
    }

    getEmail(){
        return this.email;
    }

    getPassword(){
        return this.password;
    }
    
}

module.exports = Person