console.log("content script loaded");
var captchaSolved = false;
var completeCaptchaText;
var playerElement;
var alreadyCreatedElements = false;

function observePlayButton(playButton)
{
    const observer = new MutationObserver(function () {
        pauseVideo();
    });

    const config = {
        subtree: true,
        childList: true,
    };

    // Start observing
    observer.observe(playButton, config);
}

function pauseVideo()
{
    // Check whether the page is a youtube video or not by checking
    // if the url has /watch in it
    let url = window.location.toString();
    let position = url.search("youtube.com/") + 12;
    
    // If the user has not solved the captcha and the webpage is a youtube video, 
    // pause the video, hide the video player, and display the text prompting the
    // user to complete the captcha
    if(!captchaSolved && url.substring(position, position + 5) === "watch")
    {
        document.getElementsByTagName('video')[0].pause();
        playerElement.style.display = "none";
        completeCaptchaText.style.display = "block";
    }
}

// Check for message passing from the chrome extension or background listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        if(request.message === "allowVideo")
        {
            allowVideo();
        }
        if(request.message === "changedTabs")
        {
            changeTabs();
        }
    }
);

// When the user completes the captcha, display the video, remove the
// text prompting the captcha, and play the video
function allowVideo()
{
    captchaSolved = true;
    playerElement.style.display = "block";
    completeCaptchaText.style.display = "none";
    document.getElementsByTagName('video')[0].play();
}

// When the user changes tabs, reset the captcha
function changeTabs()
{
    console.log("changed tabs");
    captchaSolved = false;

    if(!alreadyCreatedElements)
    {
        setTimeout(function() {
            const playButton = document.getElementById("movie_player") || document.body;
            playerElement = document.getElementById("ytd-player");

            // Set up the text prompting the user to do the captcha
            completeCaptchaText = document.createElement("p");
            completeCaptchaText.textContent = "Complete the captcha in the extention to watch this video! :)";
            completeCaptchaText.style.color = 'white';
            completeCaptchaText.style.fontSize = "25px";;
            playerElement.parentNode.appendChild(completeCaptchaText);

            // Begin observing for changes on the page
            observePlayButton(playButton);
        }, 500);
        alreadyCreatedElements = true;
    }
}
