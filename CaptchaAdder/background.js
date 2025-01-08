// Example code from chrome(?) that calls a function in content.js when the 
// user changes tabs

// adds a listener to tab change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.url.substring(24, 29) === "watch") {
        send({
            changedTabs:true
        });
        
    }
});

async function send()
{
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {message: "changedTabs"});
    // do something with response here, not outside the function
    console.log(response);
}