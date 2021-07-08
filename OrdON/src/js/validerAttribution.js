function validerAttribution(){
    const givenAttributionList = getAllGivenAttributions()
    callPostAttributionRout(givenAttributionList)
} 

function getAllGivenAttributions(){
    const table = document.querySelector('#prescriptionBody').children
    let listGivenAttributions = []
    for (let i = 0; i < table.length; i++) {
        const children = table[i].children
        const tdQuantity = children[6]
        const quantity = tdQuantity.children[0].value
        const givenAttribution = {
            quantity: quantity,
            date_attribution: new Date(),
            id: children[0].value,
            isAlert: children[8].value
        }
        listGivenAttributions.push(givenAttribution)
    }

    return listGivenAttributions
}

function callPostAttributionRout(given_attribution_list){
    $.ajax({
        url: '/pharmacien/givenAttribution',
        type: 'POST',
        dataType: 'json',
        data: {'data': JSON.stringify({given_attribution_list: given_attribution_list})},
        success: function(res){
            if (!res) {
                return
            } 

            if (res && res.status){
                window.location = "/pharmacien/"
            }

            if (res && res.status === false) {
                $('#errorMessage').text(res.message)
            }
        }
    })

}

function showAlert(line) {
    if (confirm('Voulez-vous signaler cette prescription ?')) {
        const index = parseInt(line);
        document.querySelector('#prescriptionBody').children[index].children[8].value = true
    }
}