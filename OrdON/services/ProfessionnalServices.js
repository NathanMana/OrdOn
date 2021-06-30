const mysql = require('mysql2/promise');
const Profesionnal = require('../models/Profesionnal');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "R1610q1207$",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Pro
 */
class ProfessionnalServices {

    /**
     * Récupère un pro
     * @param {long} idPro 
     * @returns {Prescription} l'ordonnance cherchée
     */
    static async getProfessionnalById(idPro) {
        try {
            if (!idPro || idPro <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM professionnal WHERE id_professionnal = ?', 
                [idPro]
            )
            if (!result) throw 'Une erreur est survenue'
            let pro = new Profesionnal()
            Object.assign(pro, result[0][0])
            connection.release()
            return pro
        }
        catch (e) { console.log(e)}
    }

}

module.exports = ProfessionnalServices