const passwordInput = document.getElementById('js-password')
passwordInput.addEventListener('keyup', function() {
    let value = passwordInput.value
    checkMiniLetter(value)
    checkCapLetter(value)
    checkLength(value)
    checkDigit(value)
    checkSpecialChars(value) 
})

function checkMiniLetter(value) {
    if (value.match(/^(?=.*[a-z])/g)) {
        return document.getElementById('js-password__mini').style.color = "var(--green)"
    }
    return document.getElementById('js-password__mini').style.color = "var(--dark)"
}

function checkCapLetter(value) {
    if (value.match(/^(?=.*[A-Z])/g)) {
        return document.getElementById('js-password__cap').style.color = "var(--green)"
    }
    return document.getElementById('js-password__cap').style.color = "var(--dark)"
}

function checkLength(value) {
    if (value.length >= 8) {
        return document.getElementById('js-password__length').style.color = "var(--green)"
    }
    return document.getElementById('js-password__length').style.color = "var(--dark)"
}

function checkDigit(value) {
    if (value.match(/^(?=.*[0-9])/g)) {
        return document.getElementById('js-password__digit').style.color = "var(--green)"
    }
    return document.getElementById('js-password__digit').style.color = "var(--dark)"
}

function checkSpecialChars(value) {
    if (value.match(/^(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)) {
        return document.getElementById('js-password__special-char').style.color = "var(--green)"
    }
    return document.getElementById('js-password__special-char').style.color = "var(--dark)"
}