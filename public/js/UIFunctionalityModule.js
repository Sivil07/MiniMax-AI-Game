const UIFunctionalityModule = (function () {

    const toggleActionHighlight = (element, isHighlight) => {
        element.classList.toggle("highlight-container", isHighlight);
    }

    const toggleDifficultyDisabled = (element, isDisable) => {
        element.classList.toggle("disabled", isDisable);
    }

    const disablePlayerCardTwo = (isDisabled) => {
        const playerCardTwo = document.querySelector("#player-two-card");
        playerCardTwo.classList.toggle("disabled", isDisabled)
    }

    const toggleDifficultyGroupVisibility = (isHidden) => {
        const difficultyGroup = document.querySelector(".difficulty-group");
        difficultyGroup.classList.toggle("hidden", isHidden);
    }

    const updateDifficultyActionState = (isDisabled, isHighlighted) => {
        const difficultyAction = document.querySelector(".difficulty-action");
        toggleActionHighlight(difficultyAction, isHighlighted);
        toggleDifficultyDisabled(difficultyAction, isDisabled);
    }

    const getLandingPageFormData = (form) => {
        const rawData = new FormData(form);
        const data = Object.fromEntries(rawData.entries());
        const cleanedData = clearDifficultyForHumanMode(data);
        return cleanedData;
    }

    const setRequiredFields = (requiredDifficulty, requirePlayerTwoInput) => {
        const playerTwoInput = document.querySelector("#player-two");
        const difficultyEasy = document.querySelector("#difficulty-easy");
        difficultyEasy.required = requiredDifficulty;
        playerTwoInput.required = requirePlayerTwoInput;
        return;
    }

    const clearDifficultyForHumanMode = (data) => {
        for (const key in data) {
            if (data[key] === "human-opponent") {
                data["difficultyOption"] = "N/A";
                break;
            }
        }
        return data;
    }

    const setPlayerTwoBotMode = (isBot) => {
        const playerTwoInput = document.querySelector("#player-two")
        const playerTwoLabel = playerTwoInput.previousElementSibling;
        const oMark = document.querySelector("#player-two-mark-o");

        playerTwoInput.value = isBot ? "Bot" : "";
        playerTwoLabel.textContent = isBot ? "Bot" : "Player Two"

        handleMarkSelections(oMark);
        return;
    }

    const initializeDefaultFormState = () => {
        const modeBot = document.querySelector("#mode-bot");
        const playerOneXMark = document.querySelector("#player-one-mark-x");
        const difficultyEasy = document.querySelector("#difficulty-easy")

        modeBot.checked = true;
        handleModeChange(modeBot)

        playerOneXMark.checked = true;
        handleMarkSelections(playerOneXMark);

        difficultyEasy.checked = true;
        return;
    }

    const handleModeChange = (element) => {

        if (element.matches("#mode-bot") && element.checked) {
            updateDifficultyActionState(false, true)
            disablePlayerCardTwo(true)
            setPlayerTwoBotMode(true)
            toggleDifficultyGroupVisibility(false);
            setRequiredFields(true, false)
        } else if (element.matches("#mode-pvp") && element.checked) {
            updateDifficultyActionState(true, false)
            disablePlayerCardTwo(false)
            setPlayerTwoBotMode(false)
            toggleDifficultyGroupVisibility(true);
            setRequiredFields(false, true);
        }
        return;

    }

    const handleMarkSelections = (element) => {
        const playerOneXMark = document.querySelector("#player-one-mark-x");
        const playerOneOMark = document.querySelector("#player-one-mark-o");
        const playerTwoXMark = document.querySelector("#player-two-mark-x");
        const playerTwoOMark = document.querySelector("#player-two-mark-o");

        if (element.matches("#player-one-mark-x") && element.checked) {
            playerTwoOMark.checked = true
        } else if (element.matches("#player-one-mark-o") && element.checked) {
            playerTwoXMark.checked = true;
        } else if (element.matches("#player-two-mark-x") && element.checked) {
            playerOneOMark.checked = true;
        } else if (element.matches("#player-two-mark-o") && element.checked) {
            playerOneXMark.checked = true;
        }
        return;
    }

    const attachEventListeners = () => {
        const form = document.querySelector("#landing-page");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const cleanData = getLandingPageFormData(form);
            console.log(cleanData);

            form.remove();
        })

        document.body.addEventListener("change", (e) => {
            const element = e.target;

            if (element.matches("#mode-bot, #mode-pvp")) {
                handleModeChange(element);
                return;
            }

            if (element.matches("#player-one-mark-x, #player-one-mark-o, #player-two-mark-x, #player-two-mark-o")) {
                handleMarkSelections(element)
                return;
            }
        })
    }

    initializeDefaultFormState();
    attachEventListeners();

})();
