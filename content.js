let vid_titles = [];
let prev_vid_title_count = 0;
let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g; // to remove punctuation from vid titles
let keywords = ["chrome", "the", "can"]; //array of keywords of videos to blur
//keywords must be in lowercase

chrome.runtime.onMessage.addListener(receiver); // Receiving the popup.js message with favourite teams

function getTitles(){
    let title;
    let vids = document.getElementsByTagName("ytd-rich-grid-media"); //yt videos
    let shorts = document.getElementsByTagName("ytd-rich-grid-slim-media"); // yt shorts
    let recs = document.getElementsByTagName("ytd-compact-video-renderer") // yt recomended videos (those that come under the video ur watching)
    let all = Array.prototype.slice.call(vids).concat(Array.prototype.slice.call(shorts)).concat(Array.prototype.slice.call(recs));
    for (let i=0; i<all.length; i++){
        title = all[i].querySelector("#video-title");
        if (!vid_titles.includes(title) && (title.innerText.replace(regex, "").toLowerCase().split(" ").filter(elem => keywords.includes(elem))).length > 0){
            // if the vid title contains a word from the keywords
            vid_titles.push(title);
        }
        else{
            all.splice(i, 1)
        }
    }
}

function blurUnwantedVids(){
    for (let i=0; i<vid_titles.length; i++){
        console.log(vid_titles[i].innerText);
        vid_titles[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.hidden = true;
        // the above parentElement attributes could have been substituted with parentComponent
        // but that didnt work for some reason
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
        console.log(vid_titles);
        blurUnwantedVids();
    }
}

// Receiving the message as an event object
function receiver(request) {
    // Setting keywords as favTeams from popup.js
    keywords.concat(request.map(wrd => wrd.toLowerCase()));
    console.log(keywords);
    getTitles();
    blurUnwantedVids();
}