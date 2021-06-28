const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'ordonadmin',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Attribution
 */
class AdminServices {

    /**
     * Ajoute un admin
     * @param {*} admin 
     */
     static async addAdmin(email, password) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO admin(email, password) VALUES(?, ?)', 
                [email, password]
            )
            if (!result) throw 'Une erreur est survenue'
            connection.release()
        } catch(e){
            console.log(e)
        }
    }
    /**
     * récupère un modo via l'email
     * @param {*} admin 
     */
    static async getAdminByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM admin WHERE email = ?', 
                [email]
            )
            if (!result) throw 'Une erreur est survenue'
            connection.release()
            return result[0][0]
        } catch(e){
            console.log(e)
        }
    }

}

module.exports = AdminServices