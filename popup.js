function init() {
    console.log("popup script running");
    var favTeamBtn = document.getElementById("favTeamBtn");
    favTeamBtn.onclick = receiveTeam;
}

function receiveTeam() {
    var favTeam = document.getElementById("favTeamTxt").value;
    favTeams.push(favTeam);
    console.log(favTeams);

    anotherTeam();
}

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

    document.body.appendChild(favTeamTxt);
    document.body.appendChild(favTeamBtn);

    favTeamBtn.onclick = receiveTeam;
}

function displayTeams() {
    document.getElementById("favTeamPrompt").innerHTML = "Here are your favourite teams:";
    
    document.getElementById("anotherTeamReqBtn").remove();
    document.getElementById("anotherTeamDenyBtn").remove();

    const favTeamsDisplay = document.createElement("h4");

    console.log("Here's the favTeams: " + favTeams);
    favTeamsDisplay.innerHTML = favTeams;
    document.body.appendChild(favTeamsDisplay);
}

var favTeams = [];

window.onload = init;