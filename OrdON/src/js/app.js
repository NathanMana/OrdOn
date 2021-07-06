window.addEventListener('resize', resizing, false)

/**
 * Gere l'ouverture du menu responsive
 */
function openResponsiveMenu() {
    document.querySelector('aside').style.left = "0"
    showBackground()
}

/**
 * Gere la fermeture du menu responsive
 */
function closeResponsiveMenu() {
    document.querySelector('aside').style.left = "-100%"
    const background = document.querySelector('.background-black')
    background.style.opacity = "0"
    background.style.visibility = "hidden"
}

/**
 * Gère la rescaling de la page et l'affichage des éléments responsives en fonction
 * de la largeur de l'écran
 */
function resizing(){
    if ("matchMedia" in window)
    {
        if (window.matchMedia("(min-width:850px)").matches) {
            document.querySelector("aside").style.left = "-100%"
            const background = document.querySelector('.background-black')
            background.style.opacity = "0"
            background.style.visibility = "hidden"
        }
    }
}

function showBackground() {
    const background = document.querySelector('.background-black')
    background.style.visibility = "visible"
    background.style.opacity = "1"
}

function checkPassword(url) {
    if (!url) return
    showBackground()
    const div = document.querySelector('.pop-up__password')
    div.style.display = "block"
    document.getElementById('js-pathDesired').value = url
}