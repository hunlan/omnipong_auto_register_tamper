// ==UserScript==
// @name         Omnipong Redirect After Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.omnipong.com/Members.asp?m=1
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    var enterLink = localStorage.getItem('enterLink');
    var refreshRate = 3; // seconds

    if (document.documentElement.innerHTML.indexOf("Log Out") !== -1) {
        console.log("Tamper Monkey is enabled, redirecting in " + refreshRate + " seconds");
        window.setTimeout(function () {
            window.location.href = enterLink;
        }, refreshRate * 1000);
    } else {
        console.log("Failed to login");
    }
})();
