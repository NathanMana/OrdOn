function addLine(){
    var prescriptionDiv = document.getElementById("prescriptionLines");

    var newLine = document.createElement("div")
    newLine.className = "prescriptionLine"

    var newInputName = document.createElement("input");
    newInputName.type = "text";
    newInputName.name = "medicName";
    newInputName.required = true;
    newInputName.id = "nameInput"

    var newInputDescription = document.createElement("input");
    newInputDescription.type = "text";
    newInputDescription.name = "medicDescription";
    newInputDescription.required = true;
    newInputDescription.id = "descriptionInput"

    var newInputMention = document.createElement("input");
    newInputMention.type = "text";
    newInputMention.name = "medicMention";
    newInputMention.required = true;
    newInputMention.id = "mentionInput"

    newLine.appendChild(newInputName);
    newLine.appendChild(newInputDescription);
    newLine.appendChild(newInputMention);    

    prescriptionDiv.appendChild(newLine);
}