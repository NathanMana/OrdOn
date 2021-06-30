const mysql = require('mysql2/promise');
const Pharmacist = require('../models/Pharmacist');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "R1610q1207$",
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
            if (!pharmacist.getId() || pharmacist.getId() <= 0) throw 'Le pharmacien n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE pharmacist SET birthdate = ?, isQRCodeVisible = ?, name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ? WHERE id_pharmacist = ?`, 
                [
                    pharmacist.getBirthdate(), pharmacist.isQRCodeVisible(), pharmacist.getName(), pharmacist.getFirstname(), pharmacist.getEmail(),
                    pharmacist.getPassword(), pharmacist.isAccountValidated(), pharmacist.getId()
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
     static async getPatientById(idPharmacist) {
        try {
            if (!idPharmacist || idPharmacist <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM pharmacist WHERE id_patient = ?', 
                [idPharmacist]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Pharmacien récupéré')
            const pharmacist = new Pharmacist()
            return Object.assign(pharmacist, result[0][0])
        }
        catch (e) { console.log(e)}
    }
}

module.exports = PharmacistServices

