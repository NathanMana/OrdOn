const nodemailer = require('nodemailer');

/**
 * Envoi l'email
 * @param {string} email 
 * @param {string} subject 
 * @param {string} text 
 * @param {string} html 
 */
const sendEmail = async function(email, subject, text, html = null) {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sincere.pollich@ethereal.email',
            pass: 'bxrBTrQcJd2Zd3SA3F'
        }
    });

    await transporter.sendMail({
        from: 'support@ordon.com', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });
}

module.exports = sendEmail