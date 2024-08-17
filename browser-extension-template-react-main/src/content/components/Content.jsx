import { useState } from 'react';
import { sendMessage, onMessage } from "webext-bridge/content-script";

export default function Content(){
    const [messageResponse, setMessageResponse] = useState('');

    /******************************************
     * Short Lived Connection to Background
     ******************************************/
    /* WebExt-Bridge: Comment out to disable web ext bridge */
    const sendShortLivedMessageToBackground = async () => {
        const response = await sendMessage("ANNOUNCE_ACTION", {
            from: 'Content Script'
        }, "background");

        setMessageResponse( response.message );
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const sendShortLivedMessageToBackground = async () => {
        let response = await browser.runtime.sendMessage({
            target: 'BACKGROUND',
            action: 'ANNOUNCE_ACTION',
            data: {
                from: 'Content Script'
            }
        });

        setMessageResponse( response.message );
    }
    */

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
        setMessageResponse( data.message );

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
    const sendLongLivedMessageToBackground = async () => {
        const response = await sendMessage("GENERATE_COLOR", null, "background");

        setMessageResponse( response.data.color );
    }

    /* Native Browser API: Uncomment to use the native browser messaging API
    const longLivedContentPort = browser.runtime.connect({
        name: 'LONG_LIVED_FROM_CONTENT'
    });

    longLivedContentPort.onMessage.addListener(function(message) {
        switch( message.action ){
            case 'COLOR_GENERATED':
                setMessageResponse( message.data.color );
            break;
        }
    });

    const sendLongLivedMessageToBackground = async () => {
        longLivedContentPort.postMessage({
            action: 'GENERATE_COLOR'
        });
    };
    */

    return (
        <div className="be-p-4 be-fixed be-right-4 be-bottom-4 be-w-96 be-h-96 be-rounded-lg be-bg-white be-shadow-md">
            <h1 className="text-2xl font-bold mb-5">Popup Content</h1>
            <div className="be-grid be-grid-cols-3 be-gap-4">
                <button
                    type="button"
                    className="be-rounded-md be-bg-indigo-600 be-px-2.5 be-py-1.5 be-text-sm be-font-semibold be-text-white be-shadow-sm hover:be-bg-indigo-500 focus-visible:be-outline focus-visible:be-outline-2 focus-visible:be-outline-offset-2 focus-visible:be-outline-indigo-600"
                    onClick={ sendShortLivedMessageToBackground }
                >
                    Send Message to Background (Short Lived Connection)
                </button>
                <button
                    type="button"
                    className="be-rounded-md be-bg-indigo-600 be-px-2.5 be-py-1.5 be-text-sm be-font-semibold be-text-white be-shadow-sm hover:be-bg-indigo-500 focus-visible:be-outline focus-visible:be-outline-2 focus-visible:be-outline-offset-2 focus-visible:be-outline-indigo-600"
                    onClick={ sendLongLivedMessageToBackground }
                >
                    Send Message to Background (Long Lived Connection)
                </button>
            </div>
            <div 
                className="be-mt-5 be-rounded-sm be-bg-gray-100 be-p-5 be-h-24"
            >
                { messageResponse }
            </div>
        </div>
    );
}