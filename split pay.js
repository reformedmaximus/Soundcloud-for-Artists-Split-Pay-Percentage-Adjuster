// ==UserScript==
// @name         Split Pay Script
// @namespace    http://your.domain.com
// @version      0.1
// @description  Automate split payments on SoundCloud
// @match        https://artists.soundcloud.com/earnings/splitpay/owned
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function clickFirstButtons(buttonIndex) {
        localStorage.setItem('currentButtonIndex', buttonIndex.toString()); //.setItem(key,value) both are stored as strings

        var firstButtons = document.evaluate('//table/tbody/tr/td[6]/div/button', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (buttonIndex >= firstButtons.snapshotLength) {
            console.log("All first buttons processed")
            localStorage.removeItem('currentButtonIndex');
            return;
        }

        var firstButton = firstButtons.snapshotItem(buttonIndex);
        firstButton.click();
        console.log('First button ' + (buttonIndex + 1) + ' clicked sucessfully');
        setTimeout(clickEditSplitMenuItem.bind(null, buttonIndex), 800);
    }

    function clickEditSplitMenuItem(buttonIndex) {
        var menuItems = document.evaluate('//div[@role="menuitem]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        var editSplitMenuItem;
        for (var i = 0; i < menuItems.snapshotLength; i++) {
            var menuitem = menuItems.snapshotItem(i);
            if (menuitem.textContent.trim() === 'Edit Split') {
                editSplitMenuItem = menuitem;
                break;
            }
        }

        if (editSplitMenuItem) {
            editSplitMenuItem.click();
            console.log('"Edit Split" menu item for button ' + (buttonIndex + 1) + ' clicked successfully');
            setTimeout(adjustValues.bind(null, buttonIndex), 500);
        } else {
            console.error('"Edit Split" menu item for button ' + (buttonIndex + 1) + ' not found');
            window.location.reload();
        }
    }

    function adjustValues(buttonIndex) {
        function initialCheck() {
            var allInputs = document.evaluate('//div[contains(@class, "flex justify-end")]/div/input', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var targetInput60, targetInput40;

            for (var i = 0; i < allInputs.snapshotLength; i++) {
                var input = allInputs.snapshotItem(i);
                var parentAnchor = input.closest('div.flex.justify-between.items-center').querySelector('a'); //parent anchor is the row I'm targeting and the a is for href links
                if (parentAnchor && parentAnchor.href === 'https://soundcloud.com/userlink') { //replace the link here with the profile link of the split payee that you want to adjust % on
                    targetInput60 = input;
                    console.log("input linked to user found", targetInput60);
                } else {
                    targetInput40 = input;
                    console.log('other input found: ', targetInput40);
                }
            }

            if (targetInput40 && targetInput60 && targetInput40.value === '40' && targetInput60.value === '60' ){
                console.log('No value adjustment needed. Closing menu and moving to the next button.');
                closeCurrentMenu();
                setTimeout(clickFirstButtons.bind(null,buttonIndex+1), 500);
            } else {
                simulateInput(targetInput60, '60');
                simulateInput(targetInput60, '60');
                console.log('values adjust to 60 and 40 percent');
                setTimeout(clickNextSubmitButton.bind(null,buttonIndex), 500);
            }
            function simulateInput(element, value) {}






        }
        initialCheck()









    }


















})();
