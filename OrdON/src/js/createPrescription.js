//Show the pop up window 
function addMedic(){
    var medicWindow = document.getElementById("newMedicWindow");
    medicWindow.style.display = "block";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "block"
}

//Add a mention to the mentions of the prescription and show it
function addMention(){
    var input = document.getElementById("mentionInput").value;

    var p = document.createElement("p");
    p.textContent = input;
    p.className = "mention"
    document.getElementById("mentions").appendChild(p);
    
}

//Returns the mentions by getting all the p values into a string array
function getMentions(){
    var mentions = new Array();
    const matches = document.querySelectorAll("p.mention");
    matches.forEach(function(userItem){
        var mention = userItem.textContent;
        mentions.push(mention);
    });
    console.log("Length : "  + mentions.length)
    return mentions;
}

//Validate the medic prescription, dismiss the pop up, and show on table
function validMedic(){
    var medicWindow = document.getElementById("newMedicWindow");
    medicWindow.style.display = "none";

    var basePage = document.getElementById("coverPage");
    basePage.style.display = "none"

    var medicName = document.getElementById("nameInput").value;
    var medicQuantity = document.getElementById("quantityInput").value;
    var medicDescription = document.getElementById("descriptionInput").value;
    var medicMentions = getMentions();

    console.log("Name : " + medicName + " ,Quantité : " + medicQuantity + " ,Description : " + medicDescription);
    medicMentions.forEach(function(entry) {
        console.log("Mention : " + entry);
      });

    addRow(medicName, medicQuantity, medicDescription, medicMentions);
    clearAllForm();
}

function clearAllForm(){
    document.getElementById("nameInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("mentionInput").value = "";

    document.getElementById("mentions").querySelectorAll('*').forEach(n => n.remove());
}


//Add the medic to the table
function addRow(name, quantity, description, mentions){
    var tableBody = document.getElementById("tableBody");
    var row = document.createElement("tr");

    var nameColumn = document.createElement("th");
    nameColumn.textContent = name;
    var descriptionColumn = document.createElement("th");
    descriptionColumn.textContent =description;
    var quantityColumn = document.createElement("th");
    quantityColumn.textContent = quantity;
    row.appendChild(nameColumn);
    row.appendChild(descriptionColumn);
    row.appendChild(quantityColumn);

    var mentionsColumn = document.createElement("th");
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

    tableBody.appendChild(row);
}
