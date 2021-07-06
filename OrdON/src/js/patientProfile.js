function showQR(){
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


function getQRCodeProfile() {
    $.ajax({
        url : '/patient/profil/qrcode',
        type : 'GET',
        success : function(res){
            document.getElementById('qrcode').setAttribute("src", res);
            showQR()
        },
        error: function(e) {
            console.log(e)
        }
    });
}