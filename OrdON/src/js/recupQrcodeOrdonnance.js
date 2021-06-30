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
            var h3 = document.createElement('h3');
            h3.id="qrPatientText"
            h3.textContent = "Votre QR Code patient"
            var img = document.createElement('img');
            img.src = res;
            img.id = "qrcode"
            var p = document.createElement('p')
            p.className = "textCenter";
            p.onClick = "closeQR()";
            var qrcode = document.getElementById('QRCodeDiv').appendChild(h3)
            qrcode.appendChild(img)
            qrcode.appendChild(p)
            document.querySelector('body').appendChild(qrcode)

        }
    });
}


function showQR(){
    getQRcode()

    var qrDiv = document.getElementById("QRCodeDiv");
    qrDiv.style.display = "block";

    /*var basePage = document.getElementById("coverPage");
    basePage.style.display = "block"*/
}

function closeQR(){
    var qrDiv = document.getElementById("QRCodeDiv");
    qrDiv.style.display = "none";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "none"
}
