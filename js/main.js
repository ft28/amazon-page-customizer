async function main() {
    const wishListUrlRe = "https://www\\.amazon\\.co\\.jp/hz/wishlist/ls/";
    const detailUrlRe = "https://www\\.amazon\\.co\\.jp/(.*/)*dp/";

    const regWishList = new RegExp(wishListUrlRe);
    const regDetailUrl = new RegExp(detailUrlRe);

    const config = await Config.load();
    const url = window.location.href;

    if (isTarget(url, regWishList) && config.enableWishList) {
        insertUsedPriceToWishList(config);
    } else if (isTarget(url, regDetailUrl) && config.enableSearchLink) {
        insertOtherSiteUrls();
    } else {
        console.log("not match");
    }
}

function isTarget(url, regExp) {
    if (regExp.test(url)) {
        return true;
    }
    return false;
}

main();