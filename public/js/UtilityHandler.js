const UtilityHandlerModule = (function () {
    const toggleRemoveNodeFromLayout = (element) => {
        element.classList.toggle("remove-node")
    }
    const toggleHideRoundEndMessage = (element) => {
        element.classList.toggle("round-end-msg-hidden");
    }

    const toggleNotShowBackdrop = (element) => {
        element.classList.toggle("backdrop-not-shown")
    }

    const toggleShowBackdrop = (element) => {
        element.classList.toggle("backdrop-shown")
    }

    const togglePreventClick = (element) => {
        element.classList.toggle("prevent-click")
    }

    const togglePointerEvents = (element) => {
        element.classList.toggle("prevent-click");
    }

    const toggleWinButtonsHighlights = (element) => {
        element.classList.toggle("highlight-win-buttons")
    }

    const toggleDrawButtonHighlights = (element) => {
        element.classList.toggle("highlight-draw-buttons")
    }

    // Animations toggles

    const togglePulseWinButtons = (element) => {
        element.classList.toggle("pulse-win-buttons")
    }

    const togglePulseDrawButtons = (element) => {
        element.classList.toggle("pulse-draw-buttons");
    }

    const toggleShrinkFade = (element) => {
        element.classList.toggle("shrink-fade");
    }

    const toggleScaleWinnerName = (element) => {
        element.classList.toggle("scale-winner")
    }

    return {
        toggleRemoveNodeFromLayout,
        toggleHideRoundEndMessage,
        toggleScaleWinnerName,
        toggleNotShowBackdrop,
        toggleShowBackdrop,
        toggleShrinkFade,
        togglePreventClick,
        togglePointerEvents,
        toggleWinButtonsHighlights,
        togglePulseWinButtons,
        togglePulseDrawButtons,
    }
})();