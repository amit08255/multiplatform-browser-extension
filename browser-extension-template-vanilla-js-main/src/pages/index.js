import { sendMessage, onMessage } from "webext-bridge/options";
global.browser = require('webextension-polyfill');

/******************************************
 * Short Lived Connection to Background
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
document.getElementById('send-message-to-background-short-lived').addEventListener('click', async () => {
    const response = await sendMessage("ANNOUNCE_ACTION", {
        from: 'Extension Page'
    }, "background");

    document.getElementById('responses').innerHTML = response.message;
});

/* Native Browser API: Uncomment to use the native browser messaging API
document.getElementById('send-message-to-background-short-lived').addEventListener('click', async () => {
    const response = await browser.runtime.sendMessage({
        target: 'BACKGROUND',
        action: 'ANNOUNCE_ACTION',
        data: {
            from: 'Extension Page'
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
const longLivedExtensionPagePort = browser.runtime.connect({
    name: "LONG_LIVED_FROM_EXTENSION_PAGE"
});

longLivedExtensionPagePort.onMessage.addListener(function(message) {
    switch( message.action ){
        case 'COLOR_GENERATED':
            document.getElementById('responses').innerHTML = message.data.color;
        break;
    }
});

document.getElementById('send-message-to-background-long-lived').addEventListener('click', async () => {
    longLivedExtensionPagePort.postMessage({
        action: 'GENERATE_COLOR'
    });
});
*/

/******************************************
 * Short Lived Incoming Connection to Extension Page
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
onMessage( "ANNOUNCE_ACTION", announceAction );
onMessage( "DISPLAY_MESSAGE", displayMessage );

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
    if( request.target == 'EXTENSION_PAGE' ){
        switch( request.action ){
            case "ANNOUNCE_ACTION":
                announceAction( request.data ).then( sendResponse );
                return true;
            break;
            case "DISPLAY_MESSAGE":
                displayMessage( request.data ).then( sendResponse );
                return true;
            break;
        }
    }
} );
*/

async function announceAction( {data} ){
    return { 
        message: 'Hi '+data.from+', this is the extension page!'
    };
}

async function displayMessage( {data} ){
    document.getElementById('responses').innerHTML = data.message;

    return { 
        message: 'Message displayed!' 
    };
}