const mysql = require('mysql2/promise');
const Pharmacist = require('../models/Pharmacist');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Pharmacist
 */
 class PharmacistServices {
    /**
     * Ajoute un pharmacien et le modifie pour lui attribuer un id encrypté unique
     * @param {Pharmacist} pharmacist 
     */
    static async addPharmacist(pharmacist) {
        try {
            const object = pharmacist.toObject();
            const connection = await pool.getConnection();
            const result = await connection.query('INSERT INTO pharmacist SET ? ', object)
            if (!result) throw 'Une erreur est survenue'
            pharmacist.setId(result[0].insertId)
            pharmacist.setEncryptedId(pharmacist.encryptId(pharmacist.getId()))
            await connection.query('UPDATE pharmacist SET encryptedId = ? WHERE id_pharmacist = ? ', [pharmacist.getEncryptedId(), pharmacist.getId()])
            console.log("Pharmacien inséré")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

     /**
     * Modifie un pharmacien
     * @param {Pharmacist} pharmacist 
     */
      static async updatePharmacist(pharmacist){
        try {
            if (!pharmacist.getPharmacistId() || pharmacist.getPharmacistId() <= 0) throw 'Le pharmacien n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE pharmacist SET name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ? WHERE id_pharmacist = ?`, 
                [
                    pharmacist.getName(), pharmacist.getFirstname(), pharmacist.getEmail(),pharmacist.getPassword(), 
                    pharmacist.getIsAccountValidated(), pharmacist.getPharmacistId()
                ]
            )
            await connection.query(
                `UPDATE professionnal SET city = ?, zipcode = ?, address = ?, proofpath = ? WHERE id_professionnal = ?`, 
                [
                    pharmacist.getCity(), pharmacist.getZipcode(), pharmacist.getAddress(), pharmacist.getProofPath(), 
                    pharmacist.getProfessionnalId()
                ]
            )
            connection.release()
            console.log("Pharmacien modifié")
        }
        catch(e) {
            console.log(e)
        }
    }

    /**
     * Supprime un pharmacien
     * @param {Pharmacist} pharmacist 
     */
     static async deletePharmacistWithId(pharmacist) {
        try {
            if (!pharmacist || pharmacist.getId() <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            if (pharmacist.getId() != pharmacist.getEncryptedId().substring(29, 2)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM pharmacist WHERE id_pharmacist = ? AND encryptedId = ?', 
                [pharmacist.getId(), pharmacist.getEncryptedId()]
            )
            connection.release()
            console.log('pharmacien supprimé')
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un pharmacien spécifique via son id clair
     * @param {long} idPharmacist 
     * @returns {Pharmacist} le pharmacien cherché
     */
     static async getPharmacistById(idPharmacist) {
        try {
            if (!idPharmacist || idPharmacist <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM pharmacist NATURAL JOIN professionnal WHERE id_pharmacist = ?', 
                [idPharmacist]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Pharmacien récupéré')
            if (!result[0][0]) return

            const dataPharmacist = result[0][0]
            let pharmacist = new Pharmacist(
                dataPharmacist.name,
                dataPharmacist.firstname,
                dataPharmacist.email,
                dataPharmacist.password, 
                dataPharmacist.city,
                dataPharmacist.address,
                dataPharmacist.zipcode,
                dataPharmacist.proofpath
            )
            pharmacist.setPharmacistId(dataPharmacist.id_pharmacist)
            pharmacist.setEncryptedId(dataPharmacist.encryptedId)
            pharmacist.setProfessionnalId(dataPharmacist.id_professionnal)

            return pharmacist
        }
        catch (e) { console.log(e)}
    }

     /**
     * Récupère une liste de pharmaciens qui n'ont pas été validés
     * et qui ont fait une demande de validation
     * @returns {Array(Pharmacist)}
     */
      static async getListUnvalidatedPharmacists() {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM pharmacist NATURAL JOIN professionnal WHERE isAccountValidated = false AND proofpath IS NOT NULL'
            )
            connection.release()
            if (!result[0]) return

            let listPharmacists = []
            result[0].forEach(data => {
                let pharmacist = new Pharmacist(
                    data.name,
                    data.firstname,
                    data.email,
                    data.password, 
                    data.city,
                    data.address,
                    data.zipcode,
                    data.proofpath
                )
                pharmacist.setPharmacistId(data.id_pharmacist)
                pharmacist.setEncryptedId(data.encryptedId)
                pharmacist.setProfessionnalId(data.id_professionnal)
                listPharmacists.push(pharmacist)
            })
            return listPharmacists
        }
        catch(e) {console.log(e)}
    }
}

module.exports = PharmacistServices

