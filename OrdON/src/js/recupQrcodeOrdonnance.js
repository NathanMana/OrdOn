// const { JSDOM } = require( "jsdom");
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );


function getQRcode() {
    console.log("Appel de get QR");

    $.ajax({
        url : '/patient/getordonnance',
        type : 'GET',
        success : function(res){
            console.log(res)
            var h3 = document.getElementById('qrPatientText');
            h3.textContent = "Votre QR Code patient"
            var img = document.getElementById('qrcode');
            img.src = res;
            var p = document.getElementById('pd');
            p.className = "textCenter";
            p.setAttribute("onClick", "closeQR()");
            p.textContent = "Fermer";
        

        },
        error: function(e) {
            console.log(e)
        }
    });
}


function showQR(){
    getQRcode()

    var qrDiv = document.getElementById("QRCodeDiv");
    qrDiv.style.display = "block";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "block"
}

function closeQR(){
    var qrDiv = document.getElementById("QRCodeDiv");
    qrDiv.style.display = "none";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "none"
}