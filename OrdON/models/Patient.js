const Patient = {
    id_patient:{
        type: long,
    },
    birthday:{
        type: Date,
        required: true
    },
    isQrCodeVisible:{
        type: Boolean,
        default: true
    }
}





module.exports = Patient