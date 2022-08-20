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
        displayMainMenu();
    }
    else {
        document.getElementById("center").innerHTML =
        "<h1>ERROR</h1><h4>This extension only works when youtube.com is open</h4>";
    }
}

function displayMainMenu(){
    console.log("displayMainMenu")
    //change top btns
    let btnFormNode = document.getElementById("top-buttons-form");
    btnFormNode.innerHTML = `                    
    <button id="add-fav-team" type="button">Add a Team</button>
    <button id="close-popup" type="button">Done</button>`

    //btn functions
    let addTeamBtn = document.getElementById("add-fav-team");
    let closeBtn = document.getElementById("close-popup");
    addTeamBtn.onclick = addFavTeam;
    closeBtn.onclick = ()=>{window.close();}

    //remove new input form
    document.getElementById("new-team-input-div").innerHTML = "";

    //add favTeams to scrollable
    let scrollable = document.getElementById("scrollable");
    let favTeamsArr = localStorage.getItem(favTeamsLocalStorageKey);
    scrollable.innerHTML = "";
    if (favTeamsArr != null){
        favTeamsArr = favTeamsArr.split(',');
        console.log(favTeamsArr);
        favTeamsArr.forEach(elem => {
            let node = document.createElement("div");
            let textNode = document.createTextNode(elem)
            node.appendChild(textNode);
            node.setAttribute("class", " favTeam");
            scrollable.appendChild(node)
        });
    }
}

function addFavTeam(){
    console.log("addFavTeam");
    // change top buttons
    let btnFormNode = document.getElementById("top-buttons-form");
    btnFormNode.innerHTML = `                    
    <button id="save-data" type="button">Save</button>
    <button id="delete-all-favTeams" type="button">Delete All</button>`

    //btn functions
    let saveBtn = document.getElementById("save-data");
    let delAllBtn = document.getElementById("delete-all-favTeams");
    saveBtn.onclick = saveFavTeam;
    delAllBtn.onclick = deleteFavTeamsData;

    // add text input to scrollable
    let newTeamInput = document.getElementById("new-team-input-div");
    newTeamInput.innerHTML = `
    <form>
        <input type="text" id="new-team-input"></input>
    </form>`
    newTeamInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          saveBtn.click();
        }
    });
    document.getElementById("new-team-input").focus();

}

function deleteFavTeamsData(){//test this function
    console.log("deleteFavTeamsData");
    let proceed = confirm("Are you sure you want to delete all the fav teams you have saved in localStorage?")
    if (proceed){
        localStorage.removeItem(favTeamsLocalStorageKey);
        displayMainMenu();
        sendFavTeams();
    }
}

function saveFavTeam(){
    console.log("saveFavTeam");
    let favTeam = document.getElementById("new-team-input").value;
    if (favTeam.trim().includes(" ")){
        alert("please enter one word with no spaces");
        addFavTeam();
    }
    else if (favTeam != ""){
        let localFavTeams = localStorage.getItem(favTeamsLocalStorageKey);
        if (localFavTeams != null)
        {localFavTeams = favTeam.toLowerCase().trim()+","+localFavTeams;}
        else
        {localFavTeams = favTeam.toLowerCase().trim();}
        localStorage.setItem(favTeamsLocalStorageKey, localFavTeams);
        displayMainMenu();
        sendFavTeams();
    }
    else{
        displayMainMenu();
    }
}

function sendFavTeams(){
    // Send favourite teams list to content.js
    let data = {"subject": "favTeams", "data": localStorage.getItem(favTeamsLocalStorageKey)};
    chrome.tabs.sendMessage(tabID, data);
    console.log(data)
    favTeams = [];
}

// Tab Details
var url = "does it get changed";
var tabID;

// Load the setup function once window is loaded
window.onload = init;