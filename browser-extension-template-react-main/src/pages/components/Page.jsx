import { useState } from 'react';
import { sendMessage, onMessage } from "webext-bridge/options";

export default function Page(){
    const [messageResponse, setMessageResponse] = useState('');

    /******************************************
     * Short Lived Connection to Background
     ******************************************/
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    const sendShortLivedMessageToBackground = async () => {
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Extension Page'
        }, "background");

        setMessageResponse( response.message );
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const sendShortLivedMessageToBackground = async () => {
        let response = await browser.runtime.sendMessage({
            target: 'BACKGROUND',
            action: 'ANNOUNCE_ACTION',
            data: {
                from: 'Extension Page'
            }
        });

        setMessageResponse( response.message );
    }
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
        setMessageResponse( data.message );

        return { 
            message: 'Message displayed!' 
        };
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
    const sendLongLivedMessageToBackground = async () => {
        const response = await sendMessage("GENERATE_COLOR", {}, "background");

        setMessageResponse( response.data.color );
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const longLivedExtensionPagePort = browser.runtime.connect({
        name: "LONG_LIVED_FROM_EXTENSION_PAGE"
    });

    longLivedExtensionPagePort.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'COLOR_GENERATED':
                setMessageResponse( message.data.color );
            break;
        }
    });

    const sendLongLivedMessageToBackground = async () => {
        longLivedExtensionPagePort.postMessage({
            action: 'GENERATE_COLOR'
        });
    };
    */

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-5">Extension Page Content</h1>

            <div className="max-w-3xl grid grid-cols-3 gap-4">
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
            </div>

            <div 
                className="mt-5 rounded-sm bg-gray-100 p-5 max-w-2xl h-24"
            >
                { messageResponse }
            </div>
        </div>
    );
}
