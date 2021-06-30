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