
let medicRowCounter = 0;
let rowMedicIdEditing = "";
let tipRowCounter = 0;
let rowTipIdEditing = "";
//Show the pop up window 
function showMedicWindow(){
    var medicWindow = document.getElementById("newMedicWindow");
    medicWindow.style.display = "block";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "block"
}

//Add a mention to the mentions of the prescription and show it
function addMention(){
    var input = document.getElementById("mentionInput").value;
    if (input != ""){
        var p = document.createElement("p");
        p.textContent = input;
        p.className = "mention"
        document.getElementById("mentions").appendChild(p);
    }
    
    document.getElementById("mentionInput").value =  "";
    
}

//Get back the mentions when editing
function restoreMention(mention){
    var p = document.createElement("p");
    p.textContent = mention;
    p.className = "mention"
    document.getElementById("mentions").appendChild(p);
    document.getElementById("mentionInput").value =  "";
    
}

//Returns the mentions by getting all the p values into a string array
function getMentions(){
    var mentions = new Array();
    const matches = document.querySelectorAll("p.mention");
    matches.forEach(function(userItem){
        var mention = userItem.textContent;
        mentions.push(mention);
    });
    return mentions;
}

//Validate the medic prescription, dismiss the pop up, and show on table
function validMedic(){
    closeMedicWindow();

    var medicName = document.getElementById("nameInput").value;
    var medicQuantity = document.getElementById("quantityInput").value;
    var medicDescription = document.getElementById("descriptionInput").value;
    var medicMentions = getMentions();

    medicMentions.forEach(function(entry) {
      });


    if(medicName.trim() != "" && medicQuantity.trim() != "" && medicDescription.trim() != ""){
        if (rowMedicIdEditing != ""){
            updateMedicRow(medicName, medicQuantity, medicDescription, medicMentions)
        }
        else{
            addMedicRow(medicName, medicQuantity, medicDescription, medicMentions);
        }
    }

    clearAllForm();

}

function clearAllForm(){
    document.getElementById("nameInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("mentionInput").value = "";

    document.getElementById("mentions").querySelectorAll('*').forEach(n => n.remove());
}

function closeMedicWindow(){
    var medicWindow = document.getElementById("newMedicWindow");
    medicWindow.style.display = "none";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "none"
}

//Add the medic to the table
function addMedicRow(name, quantity, description, mentions){
    medicRowCounter++;

    var tableBody = document.getElementById("prescriptionBody");
    var row = document.createElement("tr");
    row.id = "medicRow" + medicRowCounter;
    row.className = "medicRow";

    var nameColumn = document.createElement("td");
    nameColumn.textContent = name;
    nameColumn.className = "nameColumn";
    var descriptionColumn = document.createElement("td");
    descriptionColumn.textContent =description;
    descriptionColumn.className = "descriptionColumn";
    var quantityColumn = document.createElement("td");
    quantityColumn.textContent = quantity;
    quantityColumn.className = "quantityColumn";
    row.appendChild(nameColumn);
    row.appendChild(descriptionColumn);
    row.appendChild(quantityColumn);

    var mentionsColumn = document.createElement("td");
    mentionsColumn.className = "mentionsColumn";
    var mentionsDiv = document.createElement("div");
    mentionsDiv.id = "mentionsRow";
    mentions.forEach(function(mention){
        var p = document.createElement("p");
        p.textContent = mention;
        p.className = "mentionInRow";
        mentionsDiv.appendChild(p);
    });
    mentionsColumn.appendChild(mentionsDiv);
    row.appendChild(mentionsColumn);

    var editColumn = document.createElement("td");
    editColumn.className = "editColumn"

    var editDiv = document.createElement("div");
    var editIcon = document.createElement("i");
    editIcon.className = "fas fa-pen";
    editIcon.style.color = "#31E093";
    editIcon.style.marginRight = "5px"

    var mentionsArray = genereateMentionsArray(mentions);

    editDiv.setAttribute("onclick", "updateMedic('"+row.id+"', '" + name + "', '" + quantity + "', '" + description + "', [" + mentionsArray +"])");
    editDiv.appendChild(editIcon);

    var deleteDiv = document.createElement("div");
    var deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt";
    deleteIcon.style.color = "red";
    deleteIcon.style.marginLeft = "5px"
    deleteDiv.setAttribute("onclick", "deleteMedic('"+row.id+"')");
    deleteDiv.appendChild(deleteIcon);

    editColumn.appendChild(editDiv);
    editColumn.appendChild(deleteDiv);
    editColumn.style.display = "flex";
    editColumn.style.justifyContent = "center";

    row.appendChild(editColumn);    
    tableBody.appendChild(row);
}

function updateMedicRow(name, quantity, description, mentions){
    var row = document.getElementById(rowMedicIdEditing);
    
    for(let i = 0; i < row.children.length; i++){
        if(row.children[i].className == "nameColumn"){
            row.children[i].textContent = name;
        }
        else if(row.children[i].className == "descriptionColumn"){
            row.children[i].textContent = description;
        }
        else if(row.children[i].className == "quantityColumn"){
            row.children[i].textContent = quantity;
        }
        else if(row.children[i].className == "mentionsColumn"){
            row.children[i].children[0].innerHTML = "";
            mentions.forEach(function(mention){
                var p = document.createElement("p");
                p.textContent = mention;
                p.className = "mentionInRow";
                row.children[i].children[0].appendChild(p);
            });
        }
        else if(row.children[i].className == "editColumn"){
            var mentionsArray = genereateMentionsArray(mentions);
            row.children[i].children[0].setAttribute("onclick", "updateMedic('"+row.id+"', '" + name + "', '" + quantity + "', '" + description + "', [" + mentionsArray +"])")
            row.children[i].children[1].setAttribute("onclick", "deleteMedic('"+row.id+"')")
        }
    }
    
}

function genereateMentionsArray(mentions){
    var mentionsArray = new Array;
    for (let i = 0; i < mentions.length; i++) {
        mentionsArray[i] = "'" + mentions[i] + "'";
    }
    return mentionsArray;
}

//Update the medic choosen
function updateMedic(id, name, quantity, description, mentions){
    const matches = document.querySelectorAll('tr');
    matches.forEach(function(row){
        if (row.id == id){
            //Pré remplir le formulaire
            document.getElementById("nameInput").value = name;
            document.getElementById("quantityInput").value = quantity;
            document.getElementById("descriptionInput").value = description;
            for (let i = 0; i < mentions.length; i++) {
                restoreMention(mentions[i])
            }
            showMedicWindow(row.id);
            rowMedicIdEditing = row.id;
        
        }
    })
}

//Delete the medic choosen
function deleteMedic(id){
    const matches = document.querySelectorAll('tr');
    matches.forEach(function(row){
        if (row.id == id){
            //Supprimer cette ligne
            row.parentNode.removeChild(row);
        }
    })
}

function showTipWindow(){
    var tipWindow = document.getElementById("newTipWindow");
    tipWindow.style.display = "block";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "block"
}

function validTip(){
    closeTipWindow();

    var tip = document.getElementById("tipInput").value;

    if(tip.trim() != ""){
        if (rowTipIdEditing != ""){
            updateTipRow(tip);
        }
        else{
            addTipRow(tip);

        }
    }

    document.getElementById("tipInput").value = "";
}

function addTipRow(tip){
    tipRowCounter++;

    var tableBody = document.getElementById("tipsBody");
    var row = document.createElement("tr");
    row.id = "tipRow" + tipRowCounter
    row.className = "tipRow";

    var tipColumn = document.createElement("th");
    tipColumn.className = "tipColumn";
    tipColumn.textContent = tip;
    row.appendChild(tipColumn);

    var editColumn = document.createElement("th");
    editColumn.className = "editColumn";

    var editDiv = document.createElement("div");
    var editIcon = document.createElement("i");
    editIcon.className = "fas fa-pen";
    editIcon.style.color = "#31E093";
    editIcon.style.marginRight = "5px"
    editDiv.appendChild(editIcon);
    editDiv.setAttribute("onclick", "updateTip('"+row.id+"', '"+tip+"')");

    var deleteDiv = document.createElement("div");
    var deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt";
    deleteIcon.style.color = "red";
    deleteIcon.style.marginLeft = "5px"
    deleteDiv.appendChild(deleteIcon);
    deleteDiv.setAttribute("onclick", "deleteTip('"+row.id+"')");

    editColumn.appendChild(editDiv);
    editColumn.appendChild(deleteDiv);
    editColumn.style.display = "flex";
    editColumn.style.justifyContent = "center";

    row.appendChild(editColumn);
    tableBody.appendChild(row);
}

function updateTipRow(tip){
    var row = document.getElementById(rowTipIdEditing);

    row.children[0].textContent = tip;
    row.children[1].children[0].setAttribute("onclick", "updateTip('"+row.id+"', '"+tip+"')");
    row.children[1].children[1].setAttribute("onclick", "deleteTip('"+row.id+"')");
}

function updateTip(id, tip){
    const matches = document.querySelectorAll('tr');
    matches.forEach(function(row){
        if (row.id == id){
            //Pré remplir le formulaire
            document.getElementById("tipInput").value = tip;
            
            showTipWindow(row.id);
            rowTipIdEditing = row.id;
        
        }
    })
}

function deleteTip(id){
    const matches = document.querySelectorAll('tr');
    matches.forEach(function(row){
        if (row.id == id){
            //Supprimer cette ligne
            row.parentNode.removeChild(row);
        }
    })
}


function closeTipWindow(){
    var tipWindow = document.getElementById("newTipWindow");
    tipWindow.style.display = "none";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "none"
}

function rowToAttributtion(row){
    const drug_name = row.children[0].textContent;
    const attribution_desc = row.children[1].textContent;
    const attribution_quantity = row.children[2].textContent;

    var mentionList = new Array();
    const mentions = row.children[3].querySelectorAll('p');
    mentions.forEach(function(mention){
        mentionList.push(mention.textContent);
    })
    const attribution_mentions = mentionList;

    const attribution = [drug_name, attribution_desc, attribution_quantity, attribution_mentions];
    return attribution;
}

function getAllAttributionsInArray(){
    const matches = document.querySelectorAll('tr.medicRow');
    var attributionList = new Array();
    var i = 0;
    matches.forEach(function(row){
        attributionList[i] = rowToAttributtion(row);
        i++;
    })
    console.log(attributionList);
    return attributionList;
}

function getAllTipsInArray(){
    const matches = document.querySelectorAll('tr.tipRow');
    var tipList = new Array();
    var i = 0;
    matches.forEach(function(row){
        tipList[i] = row.children[0].textContent;
        i++;
    })
    console.log(tipList);
    return tipList;
}

function createOrdonnance(){

    //1 - Get the attributions and the tips in an array of their classes
    attributionList = getAllAttributionsInArray();
    tipList = getAllTipsInArray();

    //2 - Call the post route
    
}