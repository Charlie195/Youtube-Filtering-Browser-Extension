// Setup function to be called when page is loaded
const favTeamsLocalStorageKey = "favTeamsData";

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
    console.log("popup script running");

    if (url.includes("youtube.com")) {
        var favTeamBtn = document.getElementById("favTeamBtn");
        favTeamBtn.onclick = receiveTeam//displayMainMenu;
    }
    else {
        document.getElementById("center").innerHTML =
        "<h1>ERROR</h1><h4>This extension only works when youtube.com is open</h4>";
    }
}

function displayMainMenu(){
    let favTeams = getFavTeams();
}

function getFavTeams(){
    
    return favTeams;
}

// ******************** OLDER CODE ********************
// Receive favourite team from text field and add to favourite teams list
function receiveTeam() {
    var favTeam = document.getElementById("favTeamTxt").value;
    if (favTeam.trim().includes(" ") || favTeam == ""){
        alert("Please enter a word (one word)")
    }
    else{
        favTeams.push(favTeam);
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
    anotherTeamDenyBtn.onclick = sendFavTeams;
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

    teamsCompleteBtn.onclick = sendFavTeams;
}


function sendFavTeams(){
    // Sending favourite teams list to content.js
    localStorage.clear()
    let data = {"subject": "favTeams", "data": favTeams};
    chrome.tabs.sendMessage(tabID, data); // Sending the message to context.js via the tabID
    console.log(data)
}

// Favourite teams list
var favTeams = [];

// Tab Details
var url = "does it get changed";
var tabID;

// Load the setup function once window is loaded
window.onload = init;