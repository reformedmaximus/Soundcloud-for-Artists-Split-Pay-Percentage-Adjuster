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

            if (targetInput40 && targetInput60 && targetInput40.value === '40' && targetInput60.value === '60') {
                console.log('No value adjustment needed. Closing menu and moving to the next button.');
                closeCurrentMenu();
                setTimeout(clickFirstButtons.bind(null, buttonIndex + 1), 500);
            } else {
                simulateInput(targetInput60, '60');
                simulateInput(targetInput40, '40');
                console.log('values adjust to 60 and 40 percent');
                setTimeout(clickNextSubmitButton.bind(null, buttonIndex), 500);
            }

        }

        function simulateInput(element, value) {
            if (!element) {
                console.error('Element not found cannot simulate input');
                return;
            }

            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`input simulated for element with new value : ${value}`);
        }

        initialCheck()

    }

    function closeCurrentMenu() {
        var closeButton = document.evaluate('/html/body/div[3]/div/div/div/div/div[2]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (closeButton) {
            closeButton.click();
            console.log("Menu closed");
        } else {
            console.error('close button not found, could not close menu');
        }
    }

    function clickNextSubmitButton(buttonIndex) {
        var NextSubmitButton = document.evaluate('/html/body/div[3]/div/div/div/div/div[2]/div/div[3]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (NextSubmitButton && NextSubmitButton.offsetWidth > 0 && NextSubmitButton.offsetHeight > 0) { //making sure the button is rendered due to random delays
            NextSubmitButton.click();
            console.log('Next submit button for button ' + (buttonIndex + 1) + ' clicked successfully');
            setTimeout(clickDisclaimerElement.bind(null, buttonIndex), 1000);
        } else {
            console.error('next submit button for button ' + (buttonIndex + 1) + 'not found, retrying now');
            setTimeout(clickNextSubmitButton.bind(null, buttonIndex), 1000);
            window.location.reload();
        }
    }

    function clickDisclaimerElement(buttonIndex) {
        var DisclaimerElement = document.evaluate('/html/body/div[3]/div/div/div/div/div[2]/div/div[2]/label/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (DisclaimerElement) {
            DisclaimerElement.click();
            console.log("Disclaimer element clicked successfully");
            setTimeout(clickFinalSubmitButton.bind(null, buttonIndex), 1000);
        } else {
            console.error('Disclaimer element not found');
            window.location.reload();
        }


    }

    function clickFinalSubmitButton(buttonIndex) {
        var finalSubmitButton = document.evaluate('/html/body/div[3]/div/div/div/div/div[2]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (finalSubmitButton && finalSubmitButton.offsetHeight > 0 && finalSubmitButton.offsetWidth > 0) { // button is visible and interactable
            finalSubmitButton.click();
            console.log('Final submit button for button ' + (buttonIndex + 1) + ' clicked successfully')

            // increment the button index for the next iteration 
            buttonIndex++;

            //recursive call to process next button after a delay 
            setTimeout(clickFirstButtons.bind(null, buttonIndex), 1000);

        } else {
            console.error('Final submit button for button ' + (buttonIndex + 1) + ' not found or not clickable, retrying...');
            setTimeout(clickFinalSubmitButton.bind(null, buttonIndex), 1000);
        }

    }

    function startScript() {
        var delay = 3000;
        var buttonIndex = parseInt(localStorage.getItem('currentButtonIndex'), 10) || 0;
        setTimeout(clickFirstButtons, delay, buttonIndex);
    }

    startScript();

})();
