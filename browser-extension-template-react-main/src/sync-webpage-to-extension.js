// EMBED IN WEB PAGE
window.removeEventListener("message", listenForMessageFromExtension);
window.addEventListener("message", listenForMessageFromExtension);

/**
 * Listens for events from the extension.
 * @param {*} event 
 */
async function listenForMessageFromExtension( event ){
    // Ensure the message is from the browser
    if( event.source !== window ){
        return;
    }

    let message = event.data;

    if( typeof message !== "object" 
        || message === null
        || message.source !== 'BROWSER_EXTENSION'
        || message.target !== 'WEB_PAGE' ){
            return;
    }

    switch( message.action ){
        case 'ANNOUNCE_ACTION':
            announceAction( message.data );
        break;
    }
}

async function announceAction( data ){
    alert( 'You received a message from: '+data.from )
}

/**
 * Send a message up to the extension. The payload
 * will be the data we need to navigate where the
 * message is sent.
 * @param {*} action
 * @param {*} data
 */
function sendMessageToExtension( action, data = {} ){        
    window.postMessage({
        source: "WEB_PAGE",
        target: "BROWSER_EXTENSION",
        action: action,
        data: data
    }, "*");
}