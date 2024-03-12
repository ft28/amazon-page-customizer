function insertOtherSiteUrls() {
    const base = document.querySelector("span#productTitle");
    const title = base.innerHTML.trim();

    const targets = [
        ["https://jp.mercari.com/search?keyword=", "メルカリ"],
        ["https://auctions.yahoo.co.jp/search/search?p=", "ヤフオク"],
        ["https://shopping.bookoff.co.jp/search/keyword/", "BookOff"],
        ["https://www.suruga-ya.jp/search?category=&search_word=", "駿河屋"],
        ["https://calil.jp/search?q=", "カリール"],
    ];

    targets.forEach((target) => {
        const [baseUrl, caption] = target;
        insertLinkUrl(baseUrl, caption, title);
    });

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
