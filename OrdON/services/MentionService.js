const mysql = require('mysql2/promise');
const MentionAttribution = require('../models/AssociationClass/MentionAttribution');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "R1610q1207$",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table MentionAttribution
 */
class MentionAttributionService {
    /**
     * Ajoute une mention à une prescription
     * @param {MentionAttribution} mentionAttribution 
     */
    static async addMentionAttribution(mentionAttribution) {
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
     * Récupère une prescription spécifique via son id
     * @param {long} idAttribution 
     * @returns {Array(Mention)} les mentions cherchées
     */
    static async getListMentionsByAttributionId(idAttribution) {
        try {
            if (!idAttribution || idAttribution <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM mention NATURAL JOIN mention_attribution WHERE mention_attribution.id_attribution = ?', 
                [idAttribution]
            )
            if (!result) throw 'Une erreur est survenue'
            // On convertit le résultat en objet js
            let listMentions = []
            result[0].forEach((mentionData) => {
                const mention = new Mention()
                Object.assign(mention, mentionData)
                listMentions.push(mention)
            })

            connection.release()
            console.log("Mention récupérées !")
            return listMentions
        }
        catch (e) { console.log(e)}
    }
}

module.exports = MentionAttributionService