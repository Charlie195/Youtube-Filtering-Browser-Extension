let vid_titles = [];
let prev_vid_title_count = 0;
let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g; // to remove punctuation from vid titles
let keywords = [];
chrome.runtime.onMessage.addListener(receiver); // Receiving the popup.js message with favourite teams

function getTitles(){
    let title;
    let yt_content_tags = [
        "ytd-rich-grid-media", "ytd-rich-grid-slim-media", "ytd-grid-video-renderer",
        "ytd-grid-playlist-renderer", "ytd-compact-video-renderer", "ytd-video-renderer", 
        "ytd-compact-radio-renderer", "ytd-radio-renderer", "ytd-reel-item-renderer"]
    let all = []
    yt_content_tags.forEach(elem => {
        all = all.concat(Array.prototype.slice.call(document.getElementsByTagName(elem)))
    });
    //let all = [Array.prototype.slice.call(vids).concat(Array.prototype.slice.call(shorts)).concat(Array.prototype.slice.call(recs)).concat(Array.prototype.slice.call(playlist_recs));]
    for (let i=0; i<all.length; i++){
        title = all[i].querySelector("#video-title");
        if (!vid_titles.includes(title) && (title.innerText.replace(regex, "").toLowerCase().split(" ").filter(elem => keywords.includes(elem))).length > 0){
            // if the vid title contains a word from the keywords
            vid_titles.push(title);
        }
    }
}

function blurUnwantedVids(){
    for (let i=0; i<vid_titles.length; i++){
        vid_titles[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.background = "red";
    }
}

getTitles(); // get the titles before the user starts scrolling
blurUnwantedVids();

let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
window.onscroll = function (e) { // get the titles that load after the user scrolls
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop){
        prev_vid_title_count = vid_titles.length;
        getTitles();
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
    if (vid_titles.length > prev_vid_title_count){ // if more vid titles added to the vid title arr
        blurUnwantedVids();
    }
}

// Receiving the message as an event object
function receiver(request) {
    // Setting keywords as favTeams from popup.js
    keywords = keywords.concat(request.map(wrd => wrd.toLowerCase().trim()));
    console.log(keywords);
    getTitles();
    blurUnwantedVids();
}

// chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     console.log(tabs[0].url); // current tab
// });