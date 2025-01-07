var submitButton;

// Check when the user clicks the submit button
window.onload = () => {
    submitButton = document.getElementById("submitBtn");

    submitButton.addEventListener('click', () => {
        console.log("click");
        send({
            allowVideo:true
        });
        window.close();
    });
};

// Send content.js the message that the captcha has been completed (client side only)
// (I did not check server side because I did not find it relevant for this lol)
async function send()
{
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {message: "allowVideo"});
    // do something with response here, not outside the function
    console.log(response);
}

// Example code for receiving messages

// Event listener
function handleMessages(message, sender, sendResponse) {
    fetch(message.url)
        .then((response) => sendResponse({statusCode: response.status}))

    // Since `fetch` is asynchronous, must send an explicit `true`
    return true;
}
  
// Show the submit button when the user completes the captcha
function recaptchaCallback() 
{
    submitButton.style.visibility = 'visible';
};
