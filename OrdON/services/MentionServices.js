const Mention = require('../models/Mention');
const pool = require('./DatabaseConnection')

/**
 * Gère toutes les opérations sur la table MentionAttribution
 */
class MentionServices {
    /**
     * Ajoute une mention
     * @param {Mention} mention 
     */
    static async addMention(mention) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO attribution(id_attribution, id_mention) VALUES (?, ?) ', 
                [mentionAttribution.getIdAttribution(), mentionAttribution.getIdMention()]
            )
            if (!result) throw 'Une erreur est survenue'
            console.log("Mention ajoutée à la prescription")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Récupère l'id d'une mention via son nom
     * @param {string} name 
     * @return {long} l'id de la mention
     */
    static async getMentionIdByName(name){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT id_mention FROM mention WHERE name = ?', 
                [name]
            )
            if (!result) throw 'Une erreur est survenue'
            return result[0][0].id_mention
        } catch (e) {console.log(e)}
    }
}

module.exports = MentionServices