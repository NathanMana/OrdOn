const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


function getQRcode() {
    $.ajax({
        url : '/getordonnance',
        type : 'GET',
        success : function(res){
            var h3 = document.createElement('h3');
            h3.id="qrPatientText"
            h3.textContent = "Votre QR Code patient"
            var img = document.createElement('img');
            img.src = res;
            img.id = "qrcode"
            var p = document.createElement('p')
            p.className = "textCenter";
            p.onClick = "closeQR()";
            var qrcode = document.createElement('div').appendChild(h3)
            qrcode.appendChild(img)
            qrcode.appendChild(p)
            document.querySelector('body').appendChild(qrcode)

        }
    });
}