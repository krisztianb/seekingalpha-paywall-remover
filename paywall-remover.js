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
const articleSelector = "main article section";

let matchingPayWallSelector = "";
let content = ""; // Stores the original full non-pay-walled content

// Code checking if the page has finished loading the full content
new window.MutationObserver(() => {
    // Here we assume that the page contains at least one paragraph or list item
    const hasFullArticleLoaded = document.querySelector(".paywall-full-content:is(p,li)") != null;

    if (hasFullArticleLoaded) {
        storeContent();
        initPayWallRemover();
        this.disconnect();
    }
}).observe(document, { subtree: true, childList: true, attributes: true });

function initPayWallRemover() {
    // Code checking if the paywall has been displayed
    new window.MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            // If we haven't found the paywall yet, check if it has been added
            if (!matchingPayWallSelector) {
                payWallSelectors.forEach((selector) => {
                    if (mutation.target.matches(selector)) {
                        matchingPayWallSelector = selector;
                    }
                });
            }

            if (matchingPayWallSelector) {
                hidePayWall();
                restoreContent();
                this.disconnect();
            }
        }
    }).observe(document, { subtree: true, childList: true });
}

// Code that keeps removing interactivity locks from the page
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches("*[inert]")) {
            mutation.target.removeAttribute("inert");
        }
    }
}).observe(document, { subtree: true, attributes: true });

// Code that keeps removing the scroll lock from the page
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches("body")) {
            removeBodyScrollLock();
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
    document.body.removeAttribute("class"); // has a class that blocks scrolling
    document.body.removeAttribute("style"); // there is an additional "overflow:hidden" to remove
}

function removePayWallMarkersFromPage() {
    // This is necessary because otherwise a script on the page will keep removing the marked content once we restore it
    ["paywall-full-content", "invisible"].forEach((className) => {
        document.querySelectorAll("." + className).forEach((item) => {
            item.classList.remove(className);
        });
    });
}

function storeContent() {
    removePayWallMarkersFromPage();
    content = document.querySelector(articleSelector).innerHTML;
}

function restoreContent() {
    document.querySelector(articleSelector).innerHTML = content;
}
