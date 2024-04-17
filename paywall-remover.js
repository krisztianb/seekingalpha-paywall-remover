const payWallSelector = 'div:has(> div[role="dialog"])';
const articleContentSelector = 'div[data-test-id="article-content"]';

// Store the original non-pay-walled article content
const articleContent = document.querySelector(articleContentSelector).innerHTML;

// Code executed once the paywall is shown
new window.MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        if (mutation.target.matches(payWallSelector)) {
            removeBodyScrollLock();
            hidePayWall();
            restoreArticleContent();
            removeFadeOutStyle();
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

function restoreArticleContent() {
    const article = document.querySelector(articleContentSelector);
    article.innerHTML = articleContent;
}

// This removes the DIV which creates a fade out style at the bottom of the article content
function removeFadeOutStyle() {
    const div = document.querySelector(".piano-paywall-container");
    if (div) {
        if (div.previousSibling) {
            div.previousSibling.remove();
        }
        div.remove();
    }
}
