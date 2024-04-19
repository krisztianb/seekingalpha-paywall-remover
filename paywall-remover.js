const payWallSelector = 'div:has(> div[role="dialog"])';
const contentSelector = "main article section";

// Store the original non-pay-walled content
const content = document.querySelector(contentSelector).innerHTML;

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

// Code that restores the content if it gets hidden by some additional script
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches(contentSelector)) {
            restoreContent();
            this.disconnect();
        }
    }
}).observe(document, { subtree: true, childList: true });

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

function restoreContent() {
    document.querySelector(contentSelector).innerHTML = content;
}
