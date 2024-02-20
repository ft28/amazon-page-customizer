async function run() {
    const config = await Config.load();

    const inputEnableWishList = document.getElementById("wishlist");
    const inputEnableSearchLink = document.getElementById("searchlink");

    const inputInterval = document.getElementById("interval");
    const inputPeriod = document.getElementById("period");
    const inputNumParallels = document.getElementById("num_parallels");

    const buttonSave = document.getElementById("button_save");
    const buttonCancel = document.getElementById("button_cancel");
    
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