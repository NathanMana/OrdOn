const Mention = require('../models/Mention');
const pool = require('./DatabaseConnection')('ordon')

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
            if (!result[0][0]) throw 'Une erreur est survenue'
            return result[0][0].id_mention
        } catch (e) {console.log(e)}
    }

    static async getAllMentions(){
        try{
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM mention'
            )
            if (!result) throw 'Une erreur est survenue'
            var mentions = new Array()
            result[0].forEach(function(row){
                mentions.push(row.name)
            })
            return mentions;
        }
        catch (e) {console.log(e)}
    }
}

module.exports = MentionServices