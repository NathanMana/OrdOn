const Pharmacist = require('../models/Pharmacist');
const pool = require('./DatabaseConnection')


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
            const result_pro = await connection.query('INSERT INTO professionnal (city, address, zipcode) VALUES (?, ?, ?)', 
                [pharmacist.getCity(), pharmacist.getAddress(), pharmacist.getZipcode()])
            if (!result_pro) throw 'Une erreur est survenue'
            pharmacist.setProfessionnalId(result_pro[0].insertId)
            const pharma_insert = {
                name: pharmacist.getName(),
                firstname: pharmacist.getFirstname(),
                email: pharmacist.getEmail(),
                password: pharmacist.getPassword(),
                isAccountValidated: pharmacist.getIsAccountValidated(),
                isEmailVerified: pharmacist.getIsEmailVerified(),
                gender: pharmacist.getGender(),
                id_professionnal: pharmacist.getProfessionnalId()
            }
            const result = await connection.query('INSERT INTO pharmacist SET ? ', pharma_insert)
            if (!result) throw 'Une erreur est survenue'
            pharmacist.setPharmacistId(result[0].insertId)
            pharmacist.setEncryptedId(pharmacist.encryptId(pharmacist.getPharmacistId()))
            await connection.query('UPDATE pharmacist SET encryptedId = ? WHERE id_pharmacist = ? ', [pharmacist.getEncryptedId(), pharmacist.getPharmacistId()])
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
                   pharmacist.getName(), pharmacist.getFirstname(), pharmacist.getEmail(),
                    pharmacist.getPassword(), pharmacist.getIsAccountValidated(), pharmacist.getPharmacistId()
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
            if (!pharmacist || pharmacist.getPharmacistId() <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            if (pharmacist.getPharmacistId() != pharmacist.getEncryptedId().substring(29, 2)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM pharmacist WHERE id_pharmacist = ? AND encryptedId = ?', 
                [pharmacist.getPharmacistId(), pharmacist.getEncryptedId()]
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
            const pharmacistData = result[0][0]
            let pharmacist = new Pharmacist(
                pharmacistData.name,
                pharmacistData.firstname,
                pharmacistData.email,
                pharmacistData.password, 
                pharmacistData.city,
                pharmacistData.address,
                pharmacistData.zipcode
            )
            pharmacist.setPharmacistId(pharmacistData.id_pharmacist)
            pharmacist.setEncryptedId(pharmacistData.encryptedId)
            pharmacist.setProfessionnalId(pharmacistData.id_professionnal)
            return pharmacist
        }
        catch (e) { console.log(e)}
    }


    /**
     * Récupère un pharmacien a partir d'un email et d'un mdp
     * @param {string} email
     * @returns {Pharmacist} le pharmacien
     */
     static async getPharmacistByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM pharmacist WHERE email = ?',
                [email]
            )
            connection.release()
            const pharmacistData = result[0][0]
            if (!pharmacistData) return null
            const pharmacist = new Pharmacist(
                pharmacistData.name,
                pharmacistData.firstname,
                pharmacistData.email,
                pharmacistData.password,
            )
            pharmacist.setPharmacistId(pharmacistData.id_pharmacist)
            pharmacist.setProfessionnalId(pharmacistData.id_professionnal)
            return pharmacist
        }
        catch (e) {
            console.log(e)
        }
    }

    /**
     * Récupère une liste de pharmaciens qui n'ont pas été validés
     * et qui ont fait une demande de validation
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
                    data.zipcode
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

    static async changeEmailPharmacist(pharmacist){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE pharmacist SET email = ? WHERE encryptedId= ?'
                [pharmacist.getEmail(), pharmacist.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
    }

    static async changePasswordPharmacist(pharmacist){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE pharmacist SET password = ? WHERE encryptedId= ?'
                [pharmacist.getPassword(), pharmacist.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
    }

}

module.exports = PharmacistServices

