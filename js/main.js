async function main() {
    const wishListUrl = "https://www.amazon.co.jp/hz/wishlist/ls/";
    const detailUrl = "https://www.amazon.co.jp/dp";

    const config = await Config.load();
    const url = window.location.href;

    if (isTarget(url, wishListUrl) && config.enableWishList) {
        insertUsedPriceToWishList(config);
    } else if (isTarget(url, detailUrl) && config.enableSearchLink) {
        insertOtherSiteUrls();
    }
}

function isTarget(url, target) {
    if (url.indexOf(target) >= 0) {
        return true;
    }
    return false;
}

main();