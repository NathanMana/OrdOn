const pool = require('./DatabaseConnection')('ordon');
const GivenAttribution = require('./../models/AssociationClass/GivenAttribution');

class GivenAttributionServices {

    /**
     * Recherche une attribution deja en cours 
     * @param {Integer} attributionId 
     */
    static async getListGivenAttributionById(attributionId){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM given_attribution WHERE id_attribution = ?',
                [attributionId]
            )
            if (!result) throw 'Une erreur est survenue'
            connection.release()
            const tab = []
            result[0].forEach((GivenAttributionData) =>{
                const given_attribution = new GivenAttribution(
                    GivenAttributionData.quantity,
                    GivenAttributionData.date,
                    GivenAttributionData.isAlert
                )
                given_attribution.setIdAttribution(attributionId)
                tab.push(given_attribution)
            })         
            
            return tab
            
        } catch (e) {
            console.log(e)            
        }
    }

    /**
     * ajoute une given attribution
     * @param {GivenAttribution} given_attribution
     */
    static async addGivenAttribution(given_attribution){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'insert into given_attribution (id_attribution, quantity, date, isAlert) values(?, ?, ?, ?)',
                [given_attribution.getIdAttribution(), given_attribution.getQuantity(), given_attribution.getDate(),false]
            )
            if (!result) throw 'Une erreur est sur'
            connection.release()
            console.log('given_attribution insert')
            
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = GivenAttributionServices;