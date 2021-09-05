// ==UserScript==
// @name         Omnipong Open Scanner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.omnipong.com/T-tourney.asp?t=*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    var tournamentName = getOrPrompt("tournamentName");
    var eventName = getOrPrompt("eventName"); // Open Singles RR | Over 50 RR
    var enterLink = getOrPrompt("enterLink");

    localStorage.setItem("eventName", eventName);
    localStorage.setItem("enterLink", enterLink);

    var refreshRate = 10; // seconds
    var isDebug = false;

     if (document.documentElement.innerHTML.indexOf(tournamentName) !== -1) {
         var canRegister = false;

         $("center").find("tbody").each(function(i, tbodyObj) {
             if (tbodyObj.innerHTML.indexOf(eventName) !== -1) {
                 $(this).find("th").each(function(i, thObj) {
                     if (thObj.innerHTML.indexOf("Remaining slots:") !== -1 && thObj.innerHTML.indexOf("Remaining slots: 0") === -1) {
                         canRegister = true;
                     }
                 });
             }
         });

         // Debug to stop action
         if (!isDebug) {
             if (!canRegister) {
                 console.log(eventName + " is full, try again in " + refreshRate + " seconds");
                 window.setTimeout(function () {
                     window.location.reload();
                 }, refreshRate * 1000);
             } else {
                 console.log(eventName + " is open, attempt to auto register.");
                 window.location.href = enterLink;
             }
         } else {
             console.log("Debug, stop redirect or refresh");
         }
     }

    /** private functions **/
    GM_registerMenuCommand ("Change Tournament Name", changeTournamentName);
    GM_registerMenuCommand ("Change Event Name", changeEventName);
    GM_registerMenuCommand ("Change Enter Link", changeEnterLink);

    function getOrPrompt (varName) {
        var targetVar = GM_getValue (varName, "");
        if (!targetVar) {
            promptAndChangeStoredValue(targetVar, varName);
        }
        return targetVar;
    }

    function changeTournamentName () {
        promptAndChangeStoredValue (tournamentName, "tournamentName");
    }

    function changeEventName () {
        promptAndChangeStoredValue (eventName, "eventName");
    }

    function changeEnterLink () {
        promptAndChangeStoredValue (enterLink, "enterLink");
    }

    function promptAndChangeStoredValue (targetVar, varName) {
        targetVar = prompt('Please enter ' + varName, targetVar);
        GM_setValue (varName, targetVar);
    }
})();
