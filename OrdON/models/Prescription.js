class Prescriptions {
    isQrCodeVisible = true
    date_archived = Date
    constructor(id_prescription, date_creation, councils){
        this.id_prescription = id_prescription
        this.date_creation = date_creation
        this.councils = councils
    }

    setIsQrCodeVisible(isQrCodeVisible){
        this.isQrCodeVisible = isQrCodeVisible
    }

    setDateArrived(date){
        this.date_arrived = date
    }

}

module.exports = Prescriptions