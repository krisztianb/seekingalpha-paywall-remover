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
let fullArticleLoadedCheck = setInterval(() => {
    // Here we assume that the page contains at least one paragraph
    const hasFullArticleLoaded = document.querySelector("p.paywall-full-content") != null;

    if (hasFullArticleLoaded) {
        removePayWallFlags();
        storeContent();
        preparePayWallRemover();
        clearInterval(fullArticleLoadedCheck);
    }
}, 10);

// Code checking if the paywall has been displayed
function preparePayWallRemover() {
    let payWallLoadedCheck = setInterval(() => {
        payWallSelectors.forEach((selector) => {
            const payWall = document.querySelector(selector);

            if (payWall && payWall.innerHTML != "") {
                matchingPayWallSelector = selector;
            }
        });

        if (matchingPayWallSelector) {
            removeBodyScrollLock();
            hidePayWall();
            restoreContent();
            clearInterval(payWallLoadedCheck);
        }
    }, 10);
}

// Code that keeps removing interactivity locks from the page
setInterval(() => {
    removeInteractivityLock();
}, 1000);

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
    body.classList.remove("lockScroll");
    body.removeAttribute("style"); // there is an additional "overflow:hidden" to remove
}

function removeInteractivityLock() {
    const deactivatedElements = document.querySelectorAll("*[inert]");
    deactivatedElements.forEach((element) => {
        element.removeAttribute("inert");
    });
}

function removePayWallFlags() {
    document.querySelectorAll(".paywall-full-content").forEach((item) => {
        item.classList.remove("paywall-full-content");
    });
}

function storeContent() {
    content = document.querySelector(articleSelector).innerHTML;
}

function restoreContent() {
    document.querySelector(articleSelector).innerHTML = content;
}
