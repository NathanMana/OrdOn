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

    isAccountValidated() { return this.isAccountValidated}

    /* Permet de transformer l'id de la personne en un id plus secret */
    // Algorithme inspiré par https://www.codegrepper.com/code-examples/javascript/javascript+generate+unique+key
    encryptId(id) {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxx'+id+'xxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
}

module.exports = Person