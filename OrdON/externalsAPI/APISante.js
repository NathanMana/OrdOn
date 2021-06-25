class APISante {

    static isProfessionnalValid(params) {
        // 
        

        // Récupération du token de connexion
        
        const raw = JSON.encode({
            "username": "nathan.manaranche@efrei.net",
            "password": ""
        });

        const requestOptions = {
            method: 'POST',
            headers: {Accept: 'Application/json'},
            body: raw,
            redirect: 'follow'
        };

        let token = '';
        fetch("https://production.api-annuaire-sante.fr/login_check", requestOptions)
        .then(response => response.json())
        .then(result => {
            token = result.token;
        })
        .catch(error => console.log('error', error));

        // fetch("https://production.api-annuaire-sante.fr/professionnel_de_santes?nom=Levitchi&libelleCommune=Sainte-suzanne&libelleProfession[]=Médecin")
        // .then(response => response.json())
        // .then(result => )
    }
        
}

module.exports = APISante