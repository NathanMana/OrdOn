/**
 * Classe que tous les différents utilisateurs utilisent
 */
class Person  {
    /**
     * Nom de la personne
     */
    #name

    /**
     * Prénom de la personne
     */
    #firstname

    /**
     * Email de la personne
     */
    #email

    /**
     * Mot de passe de la personne
     */
    #password

    /**
     * Indique si le compte de la personne a été validé
     */
    #isAccountValidated = false;

    /**
     * Constructeur de la classe Personne
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     */
    constructor(name, firstname, email, password){
        this.#name = name;
        this.#firstname = firstname;
        this.#email = email;
        this.#password = password;
    }

    getName(){
        return this.#name;
    }
    setName(name){
        this
        .#name = name
    }
    
    getFirstname(){
        return this.#firstname;
    }
    setFirstname(firstname){
        this.#firstname = firstname
    }

    getEmail(){
        return this.#email;
    }
    setEmail(email){
        this.#email = email
    }

    getPassword(){
        return this.#password;
    }
    setPassword(password){
        this.#password = password
    }

    isAccountValidated() { return this.#isAccountValidated}
    setIsAccountValidated(isAccountValidated){
        this.#isAccountValidated =isAccountValidated;
    }

    /**
     * Permet de transformer l'id de la personne en un id plus secret
     * Algorithme inspiré par https://www.codegrepper.com/code-examples/javascript/javascript+generate+unique+key
     * @param {long} id 
     * @returns {string} l'id encrypté
     */
    encryptId(id) {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxx'+id+'xxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
}

module.exports = Person