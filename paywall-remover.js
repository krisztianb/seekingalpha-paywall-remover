let matchingPayWallSelector = "";

/**
 * The structure of the HTML (and the pay wall) is not always the same.
 * So we need to check different possible pay wall locations on the page.
 * The matching selector is stored in the variable "matchingPayWallSelector".
 */
const payWallSelectors = [
    "main + div > div + div", // user is logged in
    "main article div.contents + div", // user is not logged in
];

const overlaySelector = "div.bg-black\\/30"; // this is the element creating the gray semi-transparent overlay effect
const contentWrapperSelector = ".contents";
const articleSelector = "main article section";

// Store the original non-pay-walled content
const content = document.querySelector(articleSelector).innerHTML;

// Code executed once the paywall is shown
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        payWallSelectors.forEach((selector) => {
            if (mutation.target.matches(selector)) {
                matchingPayWallSelector = selector;
            }
        });

        if (matchingPayWallSelector) {
            removeBodyScrollLock();
            hidePayWall();
            restoreContent();
            this.disconnect();
        }
    }
}).observe(document, { subtree: true, childList: true });

// Code that removes the interactivity lock if it gets added by some script
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches(contentWrapperSelector)) {
            removeInteractivityLock();
            this.disconnect();
        }
    }
}).observe(document, { subtree: true, attributes: true });

function hidePayWall() {
    const payWallDialog = document.querySelector(matchingPayWallSelector);
    if (payWallDialog) {
        payWallDialog.setAttribute("style", "display:none");
    }

    const overlay = document.querySelector(overlaySelector);
    if (overlay) {
        overlay.remove();
    }
}

function removeBodyScrollLock() {
    const body = document.body;
    body.classList.remove("scrollLock");
    body.removeAttribute("style"); // there is an additional "overflow:hidden" to remove
}

function removeInteractivityLock() {
    const deactivatedElements = document.querySelectorAll("*[inert]");
    deactivatedElements.forEach((element) => {
        element.removeAttribute("inert");
    });
}

function restoreContent() {
    document.querySelector(articleSelector).innerHTML = content;
}
