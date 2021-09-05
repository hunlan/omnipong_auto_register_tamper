// ==UserScript==
// @name         Omnipong Jump To Events
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.omnipong.com/Members.asp?ae=*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://crypto.stanford.edu/sjcl/sjcl.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    /** Login Workflow **/
    var encKey = GM_getValue ("encKey", "");
    var usr = GM_getValue ("lognUsr", "");
    var pword = GM_getValue ("lognPwd", "");

    if ( ! encKey) {
        encKey = prompt (
            'Script key not set for ' + location.hostname + '. Please enter a random string:',
            ''
        );
        GM_setValue ("encKey", encKey);

        usr = pword = ""; // New key makes prev stored values (if any) unable to decode.
    }
    usr = decodeOrPrompt (usr, "U-name", "lognUsr");
    pword = decodeOrPrompt (pword, "P-word", "lognPwd");
    /** Login Workflow End **/

    var enterLink = localStorage.getItem('enterLink');
    if (window.location.href === enterLink) {
        if (document.documentElement.innerHTML.indexOf("Member Login") !== -1) {
            // Need to relogin
            console.log("Need to relogin");
            $("input[name*='Login_Id']").val(usr);
            $("input[name*='Password']").val(pword);

            // Comment out this line if login is failing
            $("input[value*='Log In']").click();
        } else {
            console.log("Already Logged in");

            // Click on Events
            $("input[value*='Events']").click();
        }
    } else {
        console.log("Script skipped from mismatch enterLink: " + enterLink);
    }

    /** Private Functions **/

    function decodeOrPrompt (targVar, userPrompt, setValVarName) {
        if (targVar) {
            targVar = unStoreAndDecrypt (targVar);
        }
        else {
            targVar = prompt (
                userPrompt + ' not set for ' + location.hostname + '. Please enter it now:',
                ''
            );
            GM_setValue (setValVarName, encryptAndStore (targVar) );
        }
        return targVar;
    }

    function encryptAndStore (clearText) {
        return JSON.stringify (sjcl.encrypt (encKey, clearText) );
    }

    function unStoreAndDecrypt (jsonObj) {
        return sjcl.decrypt (encKey, JSON.parse (jsonObj) );
    }

    //-- Add menu commands that will allow U and P to be changed.
    GM_registerMenuCommand ("Change Username", changeUsername);
    GM_registerMenuCommand ("Change Password", changePassword);

    function changeUsername () {
        promptAndChangeStoredValue (usr,   "U-name", "lognUsr");
    }

    function changePassword () {
        promptAndChangeStoredValue (pword, "P-word", "lognPwd");
    }

    function promptAndChangeStoredValue (targVar, userPrompt, setValVarName) {
        targVar = prompt (
            'Change ' + userPrompt + ' for ' + location.hostname + ':',
            targVar
        );
        GM_setValue (setValVarName, encryptAndStore (targVar) );
    }
})();
