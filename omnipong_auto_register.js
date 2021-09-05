// ==UserScript==
// @name         Auto Register on event page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.omnipong.com/Members.asp?M=*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    var eventName = localStorage.getItem('eventName');

    $("table.omnipong").find("tr").each(function(i, trObj) {
        if (trObj.innerHTML.indexOf(eventName) !== -1) {
            console.log("Registering for: " + eventName + " if possible");
            $(this).find("input[value*='Enter']").click();
        }
    });
})();
