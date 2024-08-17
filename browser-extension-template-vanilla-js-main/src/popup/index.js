import { sendMessage, onMessage } from "webext-bridge/popup";
global.browser = require('webextension-polyfill');

/******************************************
 * Short Lived Connection to Background
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
document.getElementById('send-message-to-background-short-lived').addEventListener('click', async () => {
    const response = await sendMessage("ANNOUNCE_ACTION", {
        from: 'Popup'
    }, "background");

    document.getElementById('responses').innerHTML = response.message;
});
/* Native Browser API: Uncomment to use the native browser messaging API
document.getElementById('send-message-to-background-short-lived').addEventListener('click', async () => {
    const response = await browser.runtime.sendMessage({
        target: 'BACKGROUND',
        action: 'ANNOUNCE_ACTION',
        data: {
            from: 'Popup'
        }
    });

    document.getElementById('responses').innerHTML = response.message;
});
*/

/******************************************
 * Long Lived Connection to Background
 ******************************************/
/* 
    WebExt-Bridge: Comment out to disable web ext bridge 
    NOTE: According to WebExt-Bridge docs, long lived connections
    are no different than any other message since the library
    handles everything as efficiently as possible.

    https://github.com/zikaari/webext-bridge#example
*/
document.getElementById('send-message-to-background-long-lived').addEventListener('click', async () => {
    const response = await sendMessage("GENERATE_COLOR", {}, "background");

    document.getElementById('responses').innerHTML = response.data.color;
});

/* Native Browser API: Uncomment to use the native browser messaging API
const longLivedPopupPort = browser.runtime.connect({
    name: "LONG_LIVED_FROM_POPUP"
});

longLivedPopupPort.onMessage.addListener(function(message) {
    switch( message.action ){
        case 'COLOR_GENERATED':
            document.getElementById('responses').innerHTML = message.data.color;
        break;
    }
});

document.getElementById('send-message-to-background-long-lived').addEventListener('click', async () => {
    longLivedPopupPort.postMessage({
        action: 'GENERATE_COLOR'
    });
});
*/

/******************************************
 * Short Lived Connection to Content
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
document.getElementById('send-message-to-content-short-lived').addEventListener('click', async () => {
    let tabs = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
    });

    const response = await sendMessage("ANNOUNCE_ACTION", {
        from: 'Popup'
    }, "content-script@"+tabs[0].id);

    document.getElementById('responses').innerHTML = response.message;
});

/* Native Browser API: Uncomment to use native browser API
document.getElementById('send-message-to-content-short-lived').addEventListener('click', async () => {
    let tabs = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
    });

    let response = await browser.tabs.sendMessage( tabs[0].id, { 
        target: 'CONTENT_SCRIPT',
        action: 'ANNOUNCE_ACTION',
        data: {
            from: 'Popup'
        }
    } );

    document.getElementById('responses').innerHTML = response.message;
});
*/

/******************************************
 * Short Lived Incoming Connection to Popup
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
onMessage( "DISPLAY_MESSAGE", displayMessage );

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
    if( request.target == 'POPUP' ){
        switch( request.action ){
            case 'DISPLAY_MESSAGE':
                displayMessage( request.data ).then( sendResponse );
                return true;
            break;
        }
    }
});
*/

async function displayMessage( {data} ){
    document.getElementById('responses').innerHTML = data.message;

    return { 
        message: 'Message displayed!' 
    };
}

/******************************************
 * Short Lived Connection to Webpage
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
document.getElementById('send-message-to-webpage-short-lived').addEventListener('click', async () => {
    let tabs = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
    });

    const response = await sendMessage("ANNOUNCE_ACTION", {
        from: 'Extension Popup',
        target: 'CONTENT_SCRIPT_SYNC'
    }, "content-script@"+tabs[0].id);

    document.getElementById('responses').innerHTML = response.message;
});

/* Native Browser API: Uncomment to use the native browser messaging API
document.getElementById('send-message-to-webpage-short-lived').addEventListener('click', async () => {
    let tabs = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
    });

    await browser.tabs.sendMessage( tabs[0].id, { 
        target: 'CONTENT_SCRIPT_SYNC',
        action: 'ANNOUNCE_ACTION',
        data: {
            from: 'Extension Popup'
        }
    } );
});
*/