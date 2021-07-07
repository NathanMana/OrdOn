function validerAttribution(){
    givenAttributionList = new Array();
    givenAttributionList = getAllGivenAttributions()
    callPostAttributionRout(givenAttributionList)
} 

function getAllGivenAttributions(){
    const matched = $('#selector_quantity').val()
    const date_attribution = document.getElementById('madeWhereWhen').textContent
    const id = $('#id_attribution').val()
    givenAttributionList = {
        quantity: matched,
        date_attribution: date_attribution,
        id: id
    }
    return givenAttributionList
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
                window.location = ""
            }

            if (res && res.status === false) {
                $('#errorMessage').text(res.message)
            }
        }
    })

}