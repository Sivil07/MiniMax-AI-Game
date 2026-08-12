const LoadingScreenFunctionalityModule = (function () {

    const attachLoadingListeners = () => {
        const loadingScreen = document.querySelector(".loading-screen");
        const progressFill = document.querySelector(".progress-fill");

        progressFill.addEventListener("animationend", () => {
            loadingScreen.classList.add("shrink-fade")
        })

        loadingScreen.addEventListener(("animationend"), (e) => {
            if (e.animationName === "shrinkFade") {
                const gameContainer = document.querySelector(".game-container")
                LandingScreenFunctionalityModule.toggleRemoveNode(loadingScreen);
                LandingScreenFunctionalityModule.toggleRemoveNode(gameContainer);
            }
        });
    }

    attachLoadingListeners();
})();
