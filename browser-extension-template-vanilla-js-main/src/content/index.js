import { sendMessage, onMessage } from "webext-bridge/content-script";

global.browser = require('webextension-polyfill');

fetch(browser.runtime.getURL('/content/index.html'))
    .then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initializeContentScript();
});

function initializeContentScript(){
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    document.getElementById('be-send-message-to-background-short-lived').addEventListener('click', async () => {
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Content Script'
        }, "background");

        document.getElementById('be-responses').innerHTML = response.message;
    });

    /* Native Browser API: Uncomment to use native browser API
    document.getElementById('be-send-message-to-background-short-lived').addEventListener('click', async () => {
        const response = await browser.runtime.sendMessage({
            target: 'BACKGROUND',
            action: 'ANNOUNCE_ACTION',
            data: {
                from: 'Content Script'
            }
        });

        document.getElementById('be-responses').innerHTML = response.message;
    });

    document.getElementById('be-send-message-to-background-long-lived').addEventListener('click', async () => {
        longLivedContentPort.postMessage({
            action: 'GENERATE_COLOR'
        });
    });
    */
}

/******************************************
 * Short Lived Incoming Connection to Content Script
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
onMessage( "ANNOUNCE_ACTION", announceAction );
onMessage( "DISPLAY_MESSAGE", displayMessage );

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
    if( request.target == 'CONTENT_SCRIPT' ){
        switch( request.action ){
            case 'ANNOUNCE_ACTION':
                announceAction( request.data ).then( sendResponse );
                return true;
            break;
            case 'DISPLAY_MESSAGE':
                displayMessage( request.data ).then( sendResponse );
                return true;
            break;
        }
    }
});
*/

async function announceAction( {data} ){
    return { 
        message: 'Hi '+data.from+', this is the content script!'
    };
}

async function displayMessage( {data} ){
    document.getElementById('be-responses').innerHTML = data.message;

    return { 
        message: 'Message displayed!' 
    };
}

/******************************************
 * Long Lived Connection to Content Script
 ******************************************/
/* 
    WebExt-Bridge: Comment out to disable web ext bridge 
    NOTE: According to WebExt-Bridge docs, long lived connections
    are no different than any other message since the library
    handles everything as efficiently as possible.

    https://github.com/zikaari/webext-bridge#example
*/
document.getElementById('be-send-message-to-background-long-lived').addEventListener('click', async () => {
    const response = await sendMessage("GENERATE_COLOR", {}, "background");

    document.getElementById('be-responses').innerHTML = response.data.color;
});

/* Native Browser API: Uncomment to use the native browser messaging API
const longLivedContentPort = browser.runtime.connect({
    name: 'LONG_LIVED_FROM_CONTENT'
});

longLivedContentPort.onMessage.addListener(function(message) {
    switch( message.action ){
        case 'COLOR_GENERATED':
            document.getElementById('be-responses').innerHTML = message.data.color;
        break;
    }
});
*/