function insertOtherSiteUrls() {
    const base = document.querySelector("span#productTitle");
    const title = base.innerHTML.trim();

    const baseMercari = "https://jp.mercari.com/search?keyword=";
    const captionMercari = "メルカリ";

    const baseYahoo = "https://auctions.yahoo.co.jp/search/search?p=";
    const captionYahoo = "ヤフオク";

    const baseCalil = "https://calil.jp/search?q=";
    const captionCalil = "カリール";

    insertLinkUrl(baseMercari, captionMercari, title);
    insertLinkUrl(baseYahoo, captionYahoo, title);
    insertLinkUrl(baseCalil, captionCalil, title)

    function insertLinkUrl(baseUrl, caption, title) {
        const targetDiv = document.querySelector("div#averageCustomerReviews_feature_div");
        const linkDivId = "customLinkId";
        let node = document.querySelector("div#" + linkDivId);

        if (node == null) {
            node = document.createElement("div");
            node.setAttribute("id", linkDivId);
            node.style.marginTop = "10px";
            targetDiv.appendChild(node);
        }

        const span = document.createElement("span");
        span.innerHTML = '<a href="' + baseUrl + title + '" target="_blank">' + caption + '</a>';
        span.style.display = "inline-block";
        span.style.paddingRight = "10px";
        node.appendChild(span);
    }
}
