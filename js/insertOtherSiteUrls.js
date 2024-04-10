function insertOtherSiteUrls() {
    const base = document.querySelector("span#productTitle");
    const title = base.innerHTML.trim();

    // siteConfigsはグローバル変数
    siteConfigs.forEach((config) => {
        insertLinkUrl(config, title);
    });

    function insertLinkUrl(config, keyword) {
        const targetDiv = document.querySelector("div#averageCustomerReviews_feature_div");
        const linkDivId = "customLinkId";
        const caption = config.caption;
        const searchUrl = config.getSearchUrl(keyword, "");
        let node = document.querySelector("div#" + linkDivId);

        if (node == null) {
            node = document.createElement("div");
            node.setAttribute("id", linkDivId);
            node.style.marginTop = "10px";
            targetDiv.appendChild(node);
        }

        const span = document.createElement("span");
        span.innerHTML = '<a href="' + searchUrl + '" target="_blank">' + caption + '</a>';
        span.style.display = "inline-block";
        span.style.paddingRight = "10px";
        node.appendChild(span);
    }
}
