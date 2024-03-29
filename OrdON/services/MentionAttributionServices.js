const MentionAttribution = require('../models/AssociationClass/MentionAttribution');
const pool = require('./DatabaseConnection')('ordon')
const Mention = require('../models/Mention')

/**
 * Gère toutes les opérations sur la table MentionAttribution
 */
class MentionAttributionServices {
    /**
     * Ajoute une mention à une prescription
     * @param {MentionAttribution} mentionAttribution 
     */
    static async addMentionAttribution(mentionAttribution) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO mention_attribution(id_attribution, id_mention) VALUES (?, ?) ', 
                [mentionAttribution.getAttributionId(), mentionAttribution.getMentionId()]
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
                const mention = new Mention(
                    mentionData.name,
                    mentionData.id_mention
                )
                listMentions.push(mention)
            })

            connection.release()
            console.log("Mentions récupérées !")
            return listMentions
        }
        catch (e) { console.log(e)}
    }
}

module.exports = MentionAttributionServices