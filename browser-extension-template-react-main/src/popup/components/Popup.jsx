import { useState } from 'react';
import { sendMessage, onMessage } from "webext-bridge/popup";

export default function Popup(){
    const [messageResponse, setMessageResponse] = useState('');

    /******************************************
     * Short Lived Connection to Background
     ******************************************/
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    const sendShortLivedMessageToBackground = async () => {
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Popup'
        }, "background");
    
        setMessageResponse( response.message );
    };

    /* Native Browser API: Uncomment to use the native browser messaging API
    const sendShortLivedMessageToBackground = async () => {
        let response = await browser.runtime.sendMessage({
            target: 'BACKGROUND',
            action: 'ANNOUNCE_ACTION',
            data: {
                from: 'Popup'
            }
        });

        setMessageResponse( response.message );
    };
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
    const sendLongLivedMessageToBackground = async () => {
        const response = await sendMessage("GENERATE_COLOR", {}, "background");
    
        setMessageResponse( response.data.color );
    };

    /* Native Browser API: Uncomment to use the native browser messaging API
    const longLivedPopupPort = browser.runtime.connect({
        name: "LONG_LIVED_FROM_POPUP"
    });

    longLivedPopupPort.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'COLOR_GENERATED':
                setMessageResponse( message.data.color );
            break;
        }
    });

    const sendLongLivedMessageToBackground = async () => {
        longLivedPopupPort.postMessage({
            action: 'GENERATE_COLOR'
        });
    };
    */

    /******************************************
     * Short Lived Connection to Content
     ******************************************/
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    const sendShortLivedMessageToContent = async () => {
        let tabs = await browser.tabs.query({ 
            active: true, 
            currentWindow: true 
        });
    
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Popup'
        }, "content-script@"+tabs[0].id);
    
        setMessageResponse( response.message );
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const sendShortLivedMessageToContent = async () => {
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

        setMessageResponse( response.message );
    }
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
        setMessageResponse( data.message );

        return { 
            message: 'Message displayed!' 
        };
    }

    /******************************************
     * Short Lived Connection to Webpage
     ******************************************/
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    const sendMessageToWebPage = async () => {
        let tabs = await browser.tabs.query({ 
            active: true, 
            currentWindow: true 
        });
    
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Extension Popup',
            target: 'CONTENT_SCRIPT_SYNC'
        }, "content-script@"+tabs[0].id);
    
        messageResponse.value = response.message;
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const sendMessageToWebPage = async () => {
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
    }
    */
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-5">Popup Content</h1>

            <div className="w-[600px] grid grid-cols-3 gap-4">
                <button 
                    type="button"  
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={ sendShortLivedMessageToBackground }
                >
                    Send Message to Background (Short Lived Connection)
                </button>
                <button 
                    type="button" 
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={ sendLongLivedMessageToBackground }
                >
                    Send Message to Background (Long Lived Connection)
                </button>
                <button 
                    type="button"
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={ sendShortLivedMessageToContent }
                >
                        Send Message to Content (Short Lived Connection)
                </button>
                <button 
                    type="button" 
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={ sendMessageToWebPage }
                >
                        Send Message to Webpage
                </button>
                <a 
                    href="/pages/index.html" 
                    target="_blank" 
                    className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                        Link to Extension Page
                </a>
            </div>
            <div 
                className="mt-5 rounded-sm bg-gray-100 p-5 h-24"
            >
                { messageResponse }    
            </div>        
        </div>
    );
}