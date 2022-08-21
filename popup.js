// Setup function to be called when page is loaded for tab details
function init() {
    center = document.getElementById("center");

    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        url = tabs[0].url; // current tab
        tabID = tabs[0].id;

        processPage(); // Process the page
    });
}

// Setup function
function processPage() {
    console.log(url);

    if (url.includes("youtube.com")) {
        var favTeamBtn = document.getElementById("favTeamBtn");
        favTeamBtn.onclick = receiveTeam;
    }
    else {
        document.getElementById("favTeamPrompt").innerHTML = "You must be on YouTube for this extension";

        document.getElementById("favTeamTxt").remove();
        document.getElementById("favTeamBtn").remove();
    }
}

// Receive favourite team from text field and add to favourite teams list
function receiveTeam() {
    var favTeam = document.getElementById("favTeamTxt").value;
    if (favTeam.trim().includes(" ") || favTeam == ""){
        alert("Please enter a word (one word)")
    }
    else{
        favTeams.push(favTeam);
        console.log(favTeams);
        anotherTeam();
    }
}

// Option to accept add another team to favourite teams list
function anotherTeam() {
    document.getElementById("favTeamPrompt").innerHTML = "Do you have another favourite team?";

    document.getElementById("favTeamTxt").remove();
    document.getElementById("favTeamBtn").remove();

    const anotherTeamRequestBtn = document.createElement("button");
    const anotherTeamDenyBtn = document.createElement("button");
    
    anotherTeamRequestBtn.setAttribute("id", "anotherTeamReqBtn");
    anotherTeamDenyBtn.setAttribute("id", "anotherTeamDenyBtn");

    anotherTeamRequestBtn.innerHTML = "Yes";
    anotherTeamDenyBtn.innerHTML = "No";

    document.body.appendChild(anotherTeamRequestBtn);
    document.body.appendChild(anotherTeamDenyBtn);

    anotherTeamRequestBtn.onclick = resetTeamInput;
    anotherTeamDenyBtn.onclick = displayTeams;
}

// Reseting popup to receive a new team
function resetTeamInput() {
    document.getElementById("favTeamPrompt").innerHTML = "What's one of your favourite teams?";
    
    document.getElementById("anotherTeamReqBtn").remove();
    document.getElementById("anotherTeamDenyBtn").remove();

    const favTeamTxt = document.createElement("input");
    const favTeamBtn = document.createElement("button");

    favTeamTxt.setAttribute("type", "text");
    favTeamTxt.setAttribute("id", "favTeamTxt");
    favTeamBtn.setAttribute("id", "favTeamBtn");

    favTeamBtn.innerHTML = "Enter";

    center.appendChild(favTeamTxt);
    center.appendChild(favTeamBtn);

    favTeamBtn.onclick = receiveTeam;
}

// Display favourite teams list
function displayTeams() {
    document.getElementById("favTeamPrompt").innerHTML = "Here are your favourite teams:";
    
    document.getElementById("anotherTeamReqBtn").remove();
    document.getElementById("anotherTeamDenyBtn").remove();

    const favTeamsDisplay = document.createElement("ul"); // List of favourite teams
    favTeamsDisplay.setAttribute("id", "favTeamsDisplayList");
    center.appendChild(favTeamsDisplay);

    // Appending each item of the favTeams array as a seperate list element
    for (var i = 0; i < favTeams.length; i++) {
        var favTeamListElement = document.createElement("li");
        var favTeamElement = document.createElement("h4");
        favTeamElement.innerHTML = favTeams[i];
        favTeamListElement.appendChild(favTeamElement);

        // Appending an edit button with each team
        var editTeamBtn = document.createElement("button");
        editTeamBtn.innerHTML = "EDIT";
        editTeamBtn.setAttribute("id", "editTeamBtn" + (i + 1)); // Setting ids to recall later
        favTeamListElement.appendChild(editTeamBtn);

        // Appending a delete button with each team
        var deleteTeamBtn = document.createElement("button");
        deleteTeamBtn.innerHTML = "DELETE";
        deleteTeamBtn.setAttribute("id", "deleteTeamBtn" + (i + 1));
        favTeamListElement.appendChild(deleteTeamBtn);

        // Adding event handlers to the buttons
        editTeamBtn.onclick = editTeam;
        deleteTeamBtn.onclick = deleteTeam;

        document.getElementById("favTeamsDisplayList").appendChild(favTeamListElement);
    }

    const teamsCompleteBtn = document.createElement("button");

    teamsCompleteBtn.setAttribute("id", "teamsCompleteBtn");
    teamsCompleteBtn.innerHTML = "Done";

    center.appendChild(teamsCompleteBtn);

    teamsCompleteBtn.onclick = sendTeams;
}

// Sending favourite teams list to content.js
function sendTeams() {
    console.log("sent message")

    chrome.tabs.sendMessage(tabID, favTeams); // Sending the message to context.js via the tabID
    window.close();
}

// Editing team
function editTeam(eventObj) {
    var editBtnSelected = eventObj.target;

    var editingContent = editBtnSelected.parentElement.getElementsByTagName("h4")[0].innerHTML;

    document.getElementById("favTeamPrompt").innerHTML = "You are editing: " + editingContent;

    // Hide other edit and delete buttons
    for (var i = 0; i < favTeams.length; i++) {
        var editBtn = document.getElementById("editTeamBtn" + (i + 1));
        var deleteBtn = document.getElementById("deleteTeamBtn" + (i + 1));
        // if (editBtn != editBtnSelected) {
        // }

        editBtn.hidden = true;
        deleteBtn.hidden = true;
    }

    // Hide done button
    document.getElementById("teamsCompleteBtn").hidden = true;
    
    editBtnSelected.parentElement.getElementsByTagName("h4")[0].hidden = true;

    // Editing form
    var editingForm = document.createElement("form");
    editBtnSelected.parentElement.appendChild(editingForm);

    // Editing prompt
    var editingPrompt = document.createElement("h4");
    editingPrompt.innerHTML = "What would you like to change it to: ";
    editingForm.appendChild(editingPrompt);

    // Editing textfield
    var editingTxt = document.createElement("input");
    editingForm.appendChild(editingTxt);

    // Done editing button
    var doneEditingBtn = document.createElement("button")
    doneEditingBtn.innerHTML = "Done Editing";
    editingForm.appendChild(doneEditingBtn);

    // Done Editing Team function
    doneEditingBtn.onclick = function() {
        editBtnSelected.parentElement.getElementsByTagName("h4")[0].innerHTML = editingTxt.value; // Updating popup list
        editBtnSelected.parentElement.getElementsByTagName("h4")[0].hidden = false;
        editingForm.remove(); // Removing form

        document.getElementById("favTeamPrompt").innerHTML = "Here are your favourite teams:";

        // Revealing all edit and delete buttons
        for (var i = 0; i < favTeams.length; i++) {
            var editBtn = document.getElementById("editTeamBtn" + (i + 1));
            var deleteBtn = document.getElementById("deleteTeamBtn" + (i + 1));
    
            editBtn.hidden = false;
            deleteBtn.hidden = false;
        }

        // Revealing done button
        document.getElementById("teamsCompleteBtn").hidden = false;

        // Editing the team from the array
        const index = favTeams.indexOf(editingContent);
        favTeams[index] = editBtnSelected.parentElement.getElementsByTagName("h4")[0].innerHTML;

        console.log("New Edited List: " + favTeams);
    };
}

// Deleting team
function deleteTeam(eventObj) {
    var deleteBtnSelected = eventObj.target; // Getting button that was selected
    
    // Deleting the parent element of that button with the team on the popup
    deleteBtnSelected.parentElement.remove();

    // Deleting the team from the array
    var selectedTeam = deleteBtnSelected.parentElement.getElementsByTagName("h4")[0].innerHTML;
    const index = favTeams.indexOf(selectedTeam);
    favTeams.splice(index, 1);
}

// Favourite teams list
var favTeams = [];

// Tab Details
var url = "does it get changed";
var tabID;

// Center tag
var center;

// Load the setup function once window is loaded
window.onload = init;