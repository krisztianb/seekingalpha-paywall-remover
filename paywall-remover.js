const payWallSelector = 'div:has(> div[role="dialog"])';
const contentWrapperSelector = "#content";
const articleSelector = "main article section";

// Store the original non-pay-walled content
const content = document.querySelector(articleSelector).innerHTML;

// Code executed once the paywall is shown
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches(payWallSelector)) {
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
    const payWallOverlay = document.querySelector(payWallSelector);
    if (payWallOverlay) {
        payWallOverlay.setAttribute("style", "display:none");
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
