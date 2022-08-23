// note that favTeams means filtered keywords (keywords that have to be filtered)

const favTeamsLocalStorageKey = "favTeamsData";
var url;
var tabID;

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
    let btnDivNode = document.getElementById("top-buttons-div");
    btnDivNode.innerHTML = `                    
    <button id="add-fav-team" type="button">Add a Keyword</button>
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
        let scrollable = document.getElementById("scrollable");
        scrollableInnerHtml = ""
        favTeamsArr.forEach(elem => {
            scrollableInnerHtml+=`
            <dl class="container" id="favTeam-container-${favTeamsArr.indexOf(elem)}">
                <dt id="favTeam-${favTeamsArr.indexOf(elem)}" class="favTeam">${elem}</dt>
                <dd class="icon-btn-div" id="icon-btn-div-${favTeamsArr.indexOf(elem)}">
                    <button type="button" class="icon-btn edit-btn" id="edit-btn-${favTeamsArr.indexOf(elem)}"><i class="fa fa-pencil"></i></button>
                    <button type="button" class="icon-btn delete-btn" id="delete-btn-${favTeamsArr.indexOf(elem)}"><i class="fa fa-close"></i></button>
                </dd>
            </dl>`
        });
        scrollable.innerHTML = scrollableInnerHtml;

        //map edit and delete btns to functions
        Array.prototype.slice.call(document.getElementsByClassName("delete-btn")).forEach(elem =>{
            elem.onclick = deleteBtnPressed;
        });
        Array.prototype.slice.call(document.getElementsByClassName("edit-btn")).forEach(elem =>{
            elem.onclick = editBtnPressed;
        });
            }
}

function deleteBtnPressed(){
    let id_number = this.id.split("-")[this.id.split("-").length - 1];
    let favTeam = document.getElementById(`favTeam-${id_number}`).innerText;
    let proceed = confirm(`Are you sure you want to delete "${favTeam}"`);
    if (proceed){
        document.getElementById(`favTeam-container-${id_number}`).remove();
        let localFavTeams = localStorage.getItem(favTeamsLocalStorageKey).split(",");
        localFavTeams.splice(localFavTeams.indexOf(favTeam), 1);
        if (localFavTeams.length == 0) {localStorage.removeItem(favTeamsLocalStorageKey)}
        else{localStorage.setItem(favTeamsLocalStorageKey, localFavTeams)};
        displayMainMenu();
        sendFavTeams();
    }
}
//todo hint when hover over btn
//todo fix multiple "enter" presses error
function editBtnPressed(){
    //change to input feild 
    let id_number = this.id.split("-")[this.id.split("-").length - 1];
    let favTeamElem = document.getElementById(`favTeam-${id_number}`)
    let favTeam = favTeamElem.innerText;
    favTeamElem.innerHTML = `<input value="${favTeam}" type="text" id="favTeam-edit-input"></input>`;
    let edit_input = document.getElementById("favTeam-edit-input");
    edit_input.focus();

    //change edit and delete btns 
    let btn_container = document.getElementById(`icon-btn-div-${id_number}`);
    btn_container.innerHTML = `
    <button type="button" class="icon-btn" id="save-edit-btn"><i class="fa fa-floppy-o"></i></button>
    <button type="button" class="icon-btn" id="delete-edit-btn"><i class="fa fa-close"></i></button>`

    //disable delete and edit btns
    let icon_btns = document.getElementsByClassName("icon-btn");
    Array.prototype.slice.call(icon_btns).forEach(elem=>{
        console.log(elem.id);
        if (elem.id!="save-edit-btn" && elem.id!="delete-edit-btn"){
            elem.disabled = true;
        }
    })

    document.getElementById("save-edit-btn").onclick = ()=>{saveNewFavTeamValue(favTeam)};
    document.getElementById("delete-edit-btn").onclick = displayMainMenu;

    edit_input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          saveNewFavTeamValue(favTeam);
        }
    });
}

function saveNewFavTeamValue(favTeam){
    let localFavTeams = localStorage.getItem(favTeamsLocalStorageKey).split(",");
    localFavTeams[localFavTeams.indexOf(favTeam)] = document.getElementById("favTeam-edit-input").value;
    localStorage.setItem(favTeamsLocalStorageKey, localFavTeams);
    displayMainMenu();
    sendFavTeams();
}

function addFavTeam(){
    console.log("addFavTeam");

    //disable delete and edit btns
    let icon_btns = document.getElementsByClassName("icon-btn");
    Array.prototype.slice.call(icon_btns).forEach(elem=>{
        elem.disabled = true;
    })

    // change top buttons
    let btnDivNode = document.getElementById("top-buttons-div");
    btnDivNode.innerHTML = `                    
    <button id="save-data" type="button">Save</button>
    <button id="delete-all-favTeams" type="button">Delete All</button>`

    //btn functions
    let saveBtn = document.getElementById("save-data");
    let delAllBtn = document.getElementById("delete-all-favTeams");
    saveBtn.onclick = saveFavTeam;
    delAllBtn.onclick = deleteFavTeamsData;

    // add text input to scrollable
    let newTeamInput = document.getElementById("new-team-input-div");
    newTeamInput.innerHTML = `<input type="text" id="new-team-input"></input>`
    newTeamInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          saveFavTeam();
        }
    });
    document.getElementById("new-team-input").focus();

}

function deleteFavTeamsData(){
    console.log("deleteFavTeamsData");
    let proceed = confirm("Are you sure you want to delete all the saved keywords?")
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

// Load the setup function once window is loaded
window.onload = init;