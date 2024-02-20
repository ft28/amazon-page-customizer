const defaultConfig = {
    "wishlist": {
        "enable": true,
    },
    "detail": {
        "enable": true,
        "interval_sec": 1,
        "cache_period_minute": 60,
        "num_parallels": 1,
    },
}

const limits = {
    "interval_sec_min": 1,
    "interval_sec_max": 5,
    "cache_period_minute_min": 10,
    "cache_period_minute_max": 60 * 6,
    "num_parallels_min": 1,
    "num_parallels_max": 5,
}

class Config {
    static key = "config";
    constructor(_config) {
        // リセットを考えてデフォルト値を変えないようにdeep copyしておく
        this._config = Config.copy(_config);
        this._limits = limits;
    }

    get enableWishList() {
        return this._config["wishlist"]["enable"];
    }

    get enableSearchLink() {
        return this._config["detail"]["enable"];
    }

    // interval
    get interval() {
        return this._config["detail"]["interval_sec"];
    }

    get limitIntervalMin() {
        return this._limits["interval_sec_min"];
    }

    get limitIntervalMax() {
        return this._limits["interval_sec_max"];
    }

    // period
    get period() {
        return this._config["detail"]["cache_period_minute"]
    }

    get limitPeriodMin() {
        return this._limits["cache_period_minute_min"];
    }

    get limitPeriodMax() {
        return this._limits["cache_period_minute_max"];
    }

    // num parallels
    get numParallels() {
        return this._config["detail"]["num_parallels"];
    }
    get limitNumParallelsMin() {
        return this._limits["num_parallels_min"];
    }

    get limitNumParallelsMax() {
        return this._limits["num_parallels_max"];
    }

    checkErrors(_interval, _period, _numParallels) {
        const errorMsgs = [];
        if (_numParallels < this._limitNumParallelsMin) {
            errorMsgs.push("同時アクセス数は " + this._limitNumParallelsMin + " 以上を指定してください");
        }
        if (_numParallels > this._limitNumParallelsMax) {
            errorMsgs.push("同時アクセス数は " + this._limitNumParallelsMax + " 以下を指定してください");
        }

        if (_interval < this._limitIntervalMin) {
            errorMsgs.push("取得間隔は " + this._limitIntervalMin + " 秒以上を指定してください");
        }
        if (_interval > this._limitIntervalMax) {
            errorMsgs.push("取得間隔は " + this._limitIntervalMax + " 秒以下を指定してください");
        }

        if (_period < this._limitPeriodMin) {
            errorMsgs.push("保存期間は " + this._limitPeriodMin + " 分以上を指定してください");
        }
        if (_period > this._limitPeriodMax) {
            errorMsgs.push("取得間隔は " + this._limitPeriodMax + " 分以下を指定してください");
        }


        return errorMsgs;
    }

    update(_enableWishList, _enableSearchLink, _interval, _period, _numParallels) {
        const _newConfig = {
            "wishlist": {
                "enable": _enableWishList,
            },
            "detail": {
                "enable": _enableSearchLink,
                "interval_sec": _interval,
                "cache_period_minute": _period,
                "num_parallels": _numParallels,
            },
        }
        this._config = _newConfig;
    }
    async save() {
        const data = {};
        data[Config.key] = this._config;
        await chrome.storage.local.set(data, () => {
            console.log("update local storage config");
        });
    }

    reset() {
        this._config = Config.copy(Config.defaultConfig);
        this.save();
    }

    static copy(_config) {
        return JSON.parse(JSON.stringify(_config));
    }

    static async load() {
        // 後で変更するのでコピーを保存
        let _config = defaultConfig;
        const storageConfig = await chrome.storage.local.get(Config.key);

        if (Config.key in storageConfig) {
            _config = storageConfig[Config.key];
        }
        return new Config(_config);
    }
}
