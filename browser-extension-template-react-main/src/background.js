import { onMessage, sendMessage } from "webext-bridge/background";

let browser = require("webextension-polyfill");

/******************************************
 * Installation and Set Up
 ******************************************/
browser.runtime.onInstalled.addListener( async( details ) => {
    createContextMenu();
});

/******************************************
 * Short Lived Connection to Background
 ******************************************/
/* WebExt-Bridge: Comment out to disable web ext bridge */
onMessage( "ANNOUNCE_ACTION", announceAction );
onMessage( "WEB_PAGE_MESSAGE", handleWebPageMessage );

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onMessage.addListener( ( request, sender, sendResponse ) => {
    if( request.target == 'BACKGROUND' ){
        switch( request.action ){
            case "ANNOUNCE_ACTION":
                announceAction( request.data ).then( sendResponse );
                return true;
            break;
            case 'WEB_PAGE_MESSAGE':
                handleWebPageMessage( request.data ).then( sendResponse );
                return true;
            break;
        }
    }
} );
*/

async function announceAction( {data} ){
    return { 
        message: 'Hi '+data.from+', this is the background script!'
    };
}

async function handleWebPageMessage( data ){
    console.log( 'Data Received from WebPage', data );
}

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
onMessage( "GENERATE_COLOR", generateColor);

async function generateColor( data ){
    return {
        action: 'COLOR_GENERATED',
        data: {
            color: '#'+Math.floor(Math.random()*16777215).toString(16)
        }
    }
}

/* Native Browser API: Uncomment to use native browser API
browser.runtime.onConnect.addListener(function(port) {
    switch( port.name ){
        case 'LONG_LIVED_FROM_POPUP':
            handleLongLivedPopupPort(port);
        break;
        case 'LONG_LIVED_FROM_CONTENT':
            handleLongLivedContentPort(port);
        break;
        case 'LONG_LIVED_FROM_EXTENSION_PAGE':
            handleLongLivedExtensionPagePort(port);
        break;
    }
});

function handleLongLivedPopupPort( port ){
    port.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'GENERATE_COLOR':
                generateColor( port );
            break;
        }
    });
}

function handleLongLivedContentPort( port ){
    port.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'GENERATE_COLOR':
                generateColor( port );
            break;
        }
    });
}

function handleLongLivedExtensionPagePort( port ){
    port.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'GENERATE_COLOR':
                generateColor( port );
            break;
        }
    });
}

const generateColor = ( port ) => {
    port.postMessage({
        action: 'COLOR_GENERATED',
        data: {
            color: '#'+Math.floor(Math.random()*16777215).toString(16)
        }
    });
}
*/

/******************************************
 * External Messages (Not Available In Firefox)
 ******************************************/
/* Un-comment to enable external messages
browser.runtime.onMessageExternal.addListener( (request, sender, sendResponse) => {
    switch (request.action) {
        case 'EXTENSION_ACTION':
            // Perform action
            return true;
        break;
} } );
*/

/******************************************
 * Handles Authentication Token
 ******************************************/
async function setAuthenticationToken( token ){
    await browser.storage.local.set({ 
        extension_auth_token: token 
    });
}

async function loadAuthenticationToken(){
    const { extension_auth_token } = await browser.storage.local.get('extension_auth_token');
    return extension_auth_token ? extension_auth_token.token : null;
}

/******************************************
 * Context Menu
 ******************************************/
function createContextMenu(){
    browser.contextMenus.create({
        title: 'Interact with Browser Extension (Ctrl+Shift+I)',
        id: "BROWSER_EXTENSION_CONTEXT_MENU",
        enabled: true
    });
    
    browser.contextMenus.onClicked.addListener( handleContextMenuClick );
}

function handleContextMenuClick( menu, tab ){
    browser.tabs.create({
        url: browser.runtime.getURL( "pages/index.html" )
    })
}

function activateContextMenu(){
    browser.contextMenus.update(
        'BROWSER_EXTENSION_CONTEXT_MENU',
        {
            enabled: true,
            visible: true
        }
    )
}

function deactivateContextMenu(){
    browser.contextMenus.update(
        'BROWSER_EXTENSION_CONTEXT_MENU',
        {
            enabled: false,
            visible: false
        }
    )
}

/******************************************
 * Keyboard Shortcut (Ctrl+Shift+I)
 ******************************************/
browser.commands.onCommand.addListener( handleCommand );

function handleCommand( command ){
    browser.tabs.create({
        url: browser.runtime.getURL( "pages/index.html" )
    })
}

/******************************************
 * Alarms (Timed Tasks)
 ******************************************/
browser.alarms.create('EXTENSION_COMMAND_NAME', {
    periodInMinutes: 30
});

browser.alarms.onAlarm.addListener(async (alarmInfo) => {
    if( alarmInfo.name == 'EXTENSION_COMMAND_NAME' ){
        console.log( 'Alarm Fired' );
    }
});

/******************************************
 * Set New Icon
 ******************************************/
function setNewIcon(){
    browser.action.setIcon({
        path: {
            "16": '/images/logos/new-icon-16x16.png',
            "32": '/images/logos/new-icon-32x32.png',
            "48": '/images/logos/new-icon-48x48.png',
            "128": '/images/logos/new-icon-128x128.png',
        } 
    });
}

/******************************************
 * Tab Listeners
 ******************************************/
browser.tabs.onActivated.addListener(( activeTab ) => {
    // activeTab is an object that contains: {tabId: {NUMBER}, windowId: {NUMBER}
});

browser.tabs.onUpdated.addListener( ( updatedTabId, changeInfo, updatedTab ) => {

});

/******************************************
 * Local Storage
 ******************************************/
async function setItemInLocalStorage( key, value ){
    await browser.storage.local.set( {
        key: value
    } );
}

async function loadUser(){
    let { user } = await browser.storage.local.get('user');
    return user;
}

async function loadUserAndProjects(){
    let { user, projects } = await browser.storage.local.get(['user', 'projects']);
}

async function removeItem( key ){
    await browser.storage.local.remove( key );
}

async function clearLocalStorage(){
    await browser.storage.local.clear();
}

/******************************************
 * Inject Scripts and Styles
 ******************************************/
function injectContentScript( tabId ){
    browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content/index.js"]
    });

    browser.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["content/css/styles.css"]
    });
}