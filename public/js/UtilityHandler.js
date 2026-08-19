const UtilityHandlerModule = (function () {
    const toggleRemoveNodeFromLayout = (element) => {
        element.classList.toggle("remove-node")
    }
    const toggleHideWinningPlayerName = (element) => {
        element.classList.toggle("hide-winning-player");
    }

    const toggleScaleWinnerName = (element) => {
        element.classList.toggle("scale-winner")
    }

    const toggleNotShowBackdrop = (element) => {
        element.classList.toggle("backdrop-not-shown")
    }

    const toggleShowBackdrop = (element) => {
        element.classList.toggle("backdrop-shown")
    }

    const toggleShrinkFade = (element) => {
        element.classList.toggle("shrink-fade");
    }

    const togglePreventClick = (element) => {
        element.classList.toggle("prevent-click")
    }

    const togglePointerEvents = (element) => {
        element.classList.toggle("prevent-click");
    }

    const toggleButtonHighlights = (element) => {
        element.classList.toggle("highlight-buttons")
    }

    return {
        toggleRemoveNodeFromLayout,
        toggleHideWinningPlayerName,
        toggleScaleWinnerName,
        toggleNotShowBackdrop,
        toggleShowBackdrop,
        toggleShrinkFade,
        togglePreventClick,
        togglePointerEvents,
        toggleButtonHighlights,
    }
})();