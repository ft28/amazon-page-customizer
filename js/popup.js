async function run() {
    const config = await ConfigAmazon.load();

    const inputEnableWishList = document.getElementById("wishlist");
    const inputEnableSearchLink = document.getElementById("searchlink");

    const inputInterval = document.getElementById("interval");
    const inputPeriod = document.getElementById("period");
    const inputNumParallels = document.getElementById("num_parallels");

    const inputSearch = document.getElementById("search");

    const buttonSave = document.getElementById("button_save");
    const buttonCancel = document.getElementById("button_cancel");
    
    const buttonSearch = document.getElementById("button_search");
    const buttonSetting = document.getElementById("button_setting");

    initDisplay();
    updateDisplay();

    function updateDisplay() {
        inputEnableWishList.checked = config.enableWishList;  
        inputEnableSearchLink.checked = config.enableSearchLink;
        
        inputInterval.value = config.interval;
        inputInterval.min = config.limitIntervalMin;
        inputInterval.max = config.limitIntervalMax;

        inputPeriod.value = config.period;
        inputPeriod.min = config.limitPeriodMin;
        inputPeriod.max = config.limitPeriodMax;
        
        inputNumParallels.value = config.numParallels;
        inputNumParallels.min = config.limitNumParallelsMin;
        inputNumParallels.max = config.limitNumParallelsMax;
    }

    buttonSave.addEventListener("click", async function(event) {
        if (updateConfig()) {
            await config.save();
            window.close();
        }
    });

    /*
    buttonReset.addEventListener("click", (event) => {
        console.log("reset");
        config.reset()
    });
    */

    buttonCancel.addEventListener("click", (event) => {
        window.close();
    });
     
    inputSearch.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            runSearch(event);
        }  
        return false;
    });    
    buttonSearch.addEventListener("click", runSearch);


    buttonSetting.addEventListener("click", (event) => {
        const settingView = document.getElementById("setting_view");
        const currentDisplayStyle = settingView.style.display;
        if (currentDisplayStyle == "block") {
            settingView.style.display = "none";
        } else {
            settingView.style.display = "block";
        }
    });

    function getGenre() {
        const genres = document.getElementsByName("genre");
        const numGenres = genres.length;
        let genreValue = '';
        for (let i=0; i<numGenres; i++) {
            const genre = genres.item(i);
            if (genre.checked) {
                genreValue = genre.value;
            }
        }
            return genreValue;
    }
    
    function getTargetSites() {
        const sites = document.getElementsByName("site");
        const numSites = sites.length;
        const targetSites = [];
        for (let i=0; i<numSites; i++) {
            const site = sites.item(i);
            if (site.checked) {
                targetSites.push(site.value);
            }
        }
        return targetSites;
    }

    function runSearch(event) {
        chrome.runtime.sendMessage(
            {
                "keyword": inputSearch.value,
                "genre": getGenre(),
                "sites": getTargetSites(),
            },
            function(response) {
                console.log(response);
            }
        );
    }

    function initDisplay() { 
        initGenreSelector();
        initSiteSelector();
    }

    function initGenreSelector() {
        /*
            <label for="genre_name">ジャンル名</label>
            <input name="genre" type="radio" value="genre_value" checked />
        */
        const genreSelector = document.getElementById("genre_selector");
        for (let i=0; i<ConfigSearch.Genres.length; i++) {
            const genre = ConfigSearch.Genres[i];
            let [name, caption] = [genre.name, genre.caption];

            const label = document.createElement("label");
            label.setAttribute("for", "genre_" + name);
            label.innerHTML = caption;

            const input = document.createElement("input");
            input.name = "genre";
            input.setAttribute("type", "radio");
            input.setAttribute("value", name)
            if (i == 0) {
                input.setAttribute("checked", true);
            }
            genreSelector.appendChild(label);
            genreSelector.appendChild(input);
        }
    }

    function initSiteSelector() {
        /*
            <label for="site_name">サイト名</label>
            <input name="site" type="checkbox" value="site_value" checked />
        */
        const siteSelector = document.getElementById("site_selector");
        for (let i=0; i < siteConfigs.length; i++) {
            const siteConfig = siteConfigs[i];

            const label = document.createElement("label");
            label.setAttribute("for", "site_" + siteConfig.id);
            label.innerHTML = siteConfig.caption;

            const input = document.createElement("input");
            input.name = "site";
            input.setAttribute("type", "checkbox");
            input.setAttribute("value", siteConfig.id);
            input.setAttribute("checked", true);
            
            siteSelector.appendChild(label);
            siteSelector.appendChild(input);
        }
    }

    function updateConfig() {
        // config.js のdefaultConfigと同じ形になるように注意
        const enableSearchLink = inputEnableSearchLink.checked;
        const enableWishList = inputEnableWishList.checked;

        const interval = parseInt(inputInterval.value);
        const period = parseInt(inputPeriod.value);
        const numPallels = parseInt(inputNumParallels.value);

        const errorMsgs = config.checkErrors(interval, period, numPallels);
        if (errorMsgs.length > 0) {
            alert(errorMsgs.join("\n"));
            return false;
        }

        config.update(enableWishList, enableSearchLink, interval, period, numPallels);
        return true;
    }
};

run();