import { sendMessage, onMessage } from "webext-bridge/content-script";

global.browser = require('webextension-polyfill');

/******************************************
 * LISTEN TO EXTENSION EVENTS
 * Listen for messages from the extension so
 * we can pass them off to the browser.
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
onMessage('ANNOUNCE_ACTION', async ( {data} ) => {
    if( data.target == 'CONTENT_SCRIPT_SYNC' ){
        window.postMessage({
            source: "BROWSER_EXTENSION",
            target: "WEB_PAGE",
            action: 'ANNOUNCE_ACTION',
            data: data
        });

        return true;
    }
});

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
    if( request.target == 'CONTENT_SCRIPT_SYNC' ){
        window.postMessage({
            source: "BROWSER_EXTENSION",
            target: "WEB_PAGE",
            action: request.action,
            data: request.data
        });

        sendResponse(true);
    }   
});
*/

/******************************************
 * LISTEN TO WINDOW EVENTS
 * Listen for messages from the browser so
 * we can sync them up to the extension.
 ******************************************/
window.removeEventListener("message", listenForMessageFromWebPage);
window.addEventListener("message", listenForMessageFromWebPage);

async function listenForMessageFromWebPage( event ){
    // Ensure the message is from the browser
    if( event.source !== window ){
        return;
    }

    // Grab the data from the message, we need
    // to make sure the source is WEB_PAGE and the target
    // is BROWSER_EXTENSION so we don't act on messages 
    // from other sources or to other destinations
    let message = event.data;

    if (typeof message !== "object" 
        || message === null 
        || message.source !== "WEB_PAGE"
        || message.target !== "BROWSER_EXTENSION") { 
            return; 
    }

    // Send a message to the browser extension that originated
    // from the web page.

    // WebExt-Bridge: Comment out to disable web ext bridge
    await sendMessage( message.action, message.data, 'background' );

    // Native Browser API: Uncomment to use native browser API
    // await browser.runtime.sendMessage({
    //     target: 'BACKGROUND',
    //     action: message.action,
    //     data: message.data
    // });
}