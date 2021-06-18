function addLine(){
    var prescriptionDiv = document.getElementById("prescription");

    var newLine = document.createElement("div")
    newLine.className = "prescriptionLine"

    var newInputName = document.createElement("input");
    newInputName.type = "text";
    newInputName.name = "medicName";
    newInputName.required = true;

    var newInputDescription = document.createElement("input");
    newInputDescription.type = "text";
    newInputDescription.name = "medicDescription";
    newInputDescription.required = true;

    var newInputMention = document.createElement("input");
    newInputMention.type = "text";
    newInputMention.name = "medicMention";
    newInputMention.required = true;

    newLine.appendChild(newInputName);
    newLine.appendChild(newInputDescription);
    newLine.appendChild(newInputMention);    

    prescriptionDiv.appendChild(newLine);
}