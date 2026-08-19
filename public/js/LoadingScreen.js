const LoadingScreenFunctionalityModule = (function () {

    const attachLoadingListeners = () => {
        const loadingScreen = document.querySelector(".loading-screen");
        const progressFill = document.querySelector(".progress-fill");

        progressFill.addEventListener("animationend", () => {
            UtilityHandlerModule.toggleShrinkFade(loadingScreen)
            // LandingScreenFunctionalityModule.toggleShrinkFade(loadingScreen);
        })

        loadingScreen.addEventListener(("animationend"), (e) => {
            if (e.animationName === "shrinkFade") {
                const gameContainer = document.querySelector(".game-container")
                UtilityHandlerModule.toggleRemoveNodeFromLayout(loadingScreen);
                UtilityHandlerModule.toggleShrinkFade(loadingScreen)
                UtilityHandlerModule.toggleRemoveNodeFromLayout(gameContainer)
                UtilityHandlerModule.togglePointerEvents(gameContainer)
                const playerTurn = document.querySelector("#player-turn");
                playerTurn.classList.add("scale-turn")
            }
        });
    }

    attachLoadingListeners();
})();
