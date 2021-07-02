const Drug = require('../models/Drug');
const pool = require('./DatabaseConnection')

/**
 * Gère toutes les opérations sur la table Docteur
 */
 class DrugServices {
     /**
     * Récupère un médicament spécifique via son id clair
     * @param {long} idDrug 
     * @returns {Drug} le medicament cherché
     */
    static async getDrugById(idDrug) {
        try {
            if (!idDrug || idDrug <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM drug WHERE id_drug = ?', 
                [idDrug]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Drug récupérée')
            const drugData = result[0][0]
            let drug = new Drug(
                drugData.name
            )
            drug.setDrugId(drugData.id_drug)
           
            return drug
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un médicament spécifique via son nom
     * @param {string} name 
     * @returns {Drug} le medicament cherché
     */
     static async getDrugIdByName(name) {
        try {
            if (!name) throw 'Le nom indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT id_drug FROM drug WHERE name = ?', 
                [name]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Drug récupérée')
            return result[0][0].id_drug
        }
        catch (e) { console.log(e)}
    }

    static async getAllDrugs(){
        try{
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM drug'
            )
            if (!result) throw 'Une erreur est survenue'
            var drugs = new Array()
            result[0].forEach(function(row){
                drugs.push(row.name)
            })
            return drugs;
        }
        catch (e) {console.log(e)}
    }
}

module.exports = DrugServices