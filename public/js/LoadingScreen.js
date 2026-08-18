const LoadingScreenFunctionalityModule = (function () {

    const attachLoadingListeners = () => {
        const loadingScreen = document.querySelector(".loading-screen");
        const progressFill = document.querySelector(".progress-fill");

        progressFill.addEventListener("animationend", () => {
            LandingScreenFunctionalityModule.toggleShrinkFade(loadingScreen);
        })

        loadingScreen.addEventListener(("animationend"), (e) => {
            if (e.animationName === "shrinkFade") {
                const gameContainer = document.querySelector(".game-container")
                LandingScreenFunctionalityModule.toggleRemoveNode(loadingScreen);
                LandingScreenFunctionalityModule.toggleShrinkFade(loadingScreen);
                LandingScreenFunctionalityModule.toggleRemoveNode(gameContainer);
                LandingScreenFunctionalityModule.togglePointerEvents(gameContainer)
                const playerTurn = document.querySelector("#player-turn");
                playerTurn.classList.add("scale-turn")
            }
        });
    }

    attachLoadingListeners();
})();
