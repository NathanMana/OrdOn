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
     * Id encrypté de la personne
     */
    #encryptedId = null

    /**
     * Sexe de la personne
     */
    #gender

    /**
     * Indique si l'email a bien été vérifié
     */
    #isEmailVerified = false

    /**
     * Token pour le reset de mdp
     */
    #tokenResetPassword

    /**
     * Token pour le reset d'email (vérification)
     */
    #tokenEmail

    /**
     * Constructeur de la classe Personne
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     */
    constructor(name, firstname, email, password, gender){
        this.#name = name;
        this.#firstname = firstname;
        this.#email = email;
        this.#password = password;
        this.#gender = gender;
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

    getIsAccountValidated() { return this.#isAccountValidated}
    setIsAccountValidated(isAccountValidated){
        this.#isAccountValidated = isAccountValidated;
    }

    // Permet de récupérer l'id encrypté
    getEncryptedId() { return this.#encryptedId }
    // Permet de modifier l'id encrypté (a ne jamais utiliser autrement qu'à l'ajout en BDD)
    setEncryptedId(encryptedId) { this.#encryptedId = encryptedId}

    getGender(){return this.#gender}
    setGender(gender){this.#gender = gender}

    getIsEmailVerified(){return this.#isEmailVerified}
    setIsEmailVerified(isEmailVerified){this.#isEmailVerified = isEmailVerified}

    getTokenEmail(){return this.#tokenEmail}
    setTokenEmail(tokenEmail){this.#tokenEmail = tokenEmail}

    getTokenResetPassword(){return this.#tokenResetPassword}
    setTokenResetPassword(tokenResetPassword){this.#tokenResetPassword = tokenResetPassword}

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