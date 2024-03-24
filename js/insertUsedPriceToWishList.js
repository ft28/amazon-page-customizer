function insertUsedPriceToWishList(config) {
  const interval = config.interval * 1000; // ミリ秒
  const reFetchInterval = config.period * 60 * 1000;
  const numParallel = config.numParallels;

  const localCacheKey = "items";
  const checked = {};
  const targets = {};

  let flagUpdating = false;
  let cachedItems = {};

  init();

  function init() {
    chrome.storage.local.get(localCacheKey, obj => {
      if (localCacheKey in obj) {
        cachedItems = obj[localCacheKey];
      }
      updateQueue();
      fetchQueue();
    });
  }

  window.addEventListener("scrollend", (event) => {
    if (flagUpdating) {
      return;
    }
    flagUpdating = true;
    updateQueue();
    flagUpdating = false;
  });

  function fetchQueue() {
    const targetIds = Object.keys(checked);
    let numFetching = 0;
    targetIds.forEach(targetId => {
      const cachedPrice = getCachePrice(targetId);
      if (cachedPrice) {
        updateUsedPriceDiv(targets[targetId], cachedPrice);
        checked[targetId] = "done";
        return;
      }

      if (numFetching >= numParallel) {
        return;
      }

      const status = checked[targetId];
      if (status !== "waiting") {
        return;
      }

      numFetching += 1;
      checked[targetId] = "fetching";
      fetchUsedPrice(targets[targetId]);
    });

    // Queueが空でない限り実行
    if (isEmptyQueue()) {
      return;
    }
    setTimeout(fetchQueue, interval);
  }

  function isEmptyQueue() {
    const targetIds = Object.keys(checked);
    let numChecked = 0;
    targetIds.forEach(targetId => {
      if (checked[targetId] != "waiting") {
        numChecked += 1;
      }
    });
    return numChecked == targetIds.length;
  }

  function updateQueue() {
    const details = document.querySelectorAll("div.g-item-details");
    for (let i = 0; i < details.length; i++) {
      const t = details[i];

      if (t.id in targets) {
        continue;
      }
      targets[t.id] = t;
      checked[t.id] = "waiting";
    }
    fetchQueue();
  }

  function getCachePrice(targetId) {
    if (!(targetId in cachedItems)) {
      console.log(targetId + " does not exist.");
      return null;
    }

    const cache = cachedItems[targetId];
    const previousTime = cache["updated_at"];
    const currentTime = (new Date()).getTime();
    if ((currentTime - previousTime) > reFetchInterval) {
      console.log(targetId + " is timeout.");
      return null;
    } else {
      const previousDateTime = new Date(previousTime);
      const strPreviousDateTime = previousDateTime.toLocaleString('ja-JP');
      console.log(targetId + " is the price at " + strPreviousDateTime);
      console.log("currentTime is " + new Date(currentTime).toLocaleString('ja-JP'));
    }
    return cache["price"];
  }

  function fetchUsedPrice(target) {
    const link = target.querySelector("a.a-link-normal");
    fetch(link.href)
      .then(res => res.text())
      .then((text) => {
        const dom = new DOMParser().parseFromString(text, "text/html")
        const price = getPrice(dom);
        checked[target.id] = "done";
        updateUsedPriceDiv(target, price);
        updateCachedItems(target, price);
      })
      .catch(error => {
        console.error('faild to fetch', error);
      });
  }

  function updateUsedPriceDiv(target, price) {
    const priceNodeId = target.id + "_used_price";
    let node = document.getElementById(priceNodeId);
    if (node == null) {
      node = document.createElement("span");
      node.id = priceNodeId;
      target.appendChild(node);
    }
    node.innerHTML = price;
  }

  function updateCachedItems(item, price) {
    const date = new Date();
    cachedItems[item.id] = { "price": price, "updated_at": date.getTime() };

    const cacheData = {};
    cacheData[localCacheKey] = cachedItems;
    chrome.storage.local.set(cacheData, () => {
      console.log("update local storage chacedItems");
    });
  }

  function getPrice(dom) {
    const base = dom.querySelector("div.olp-text-box");

    const usedPrice = getUsedPrice(base);
    console.log("usedPrice:" + usedPrice);
    if (usedPrice === undefined) {
      return "----";
    }

    const postagePrice = getPostagePrice(base);
    console.log("postagePrice:" + postagePrice);

    const total = usedPrice + postagePrice;
    return "中古価格(送料込み) ￥" + total.toLocaleString();
  }

  function getUsedPrice(base) {
    if (base === null) {
      return undefined;
    }

    // const strPrice = base.querySelector("span.a-size-base").innerHTML;
    const strPrice = base.querySelector("span.a-price-whole").innerHTML;
    if (strPrice === null) {
      return undefined;
    }
    return parseInt(strPrice.replace(/[^0-9]/g, ''));
  }

  function getPostagePrice(base) {
    const spans = base.querySelectorAll("span");
    const strPrice = spans[8].innerHTML;
    if (strPrice.indexOf("無料") >= 0) {
      return 0;
    } else if (strPrice.indexOf("配送料") >= 0) {
      return parseInt(strPrice.replace(/[^0-9]/g, ''));
    } else {
      return 0;
    }
  }
}
