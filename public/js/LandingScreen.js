const LandingScreenFunctionalityModule = (function () {
    // Adds/removes selected node from layout
    const toggleRemoveNode = (element) => {
        element.classList.toggle("remove-node")
    }

    const toggleShrinkFade = (element) => {
        element.classList.toggle("shrink-fade");
    }

    // Adds/removes the highlight style on an element
    const toggleActionHighlight = (element, isHighlight) => {
        element.classList.toggle("highlight-container", isHighlight);
    }

    // Adds/Removes the "faded" look on an element (greyed out)
    const toggleDifficultyFaded = (element, isFaded) => {
        element.classList.toggle("is-faded", isFaded);
    }

    // Set a player card's highlight color to match its player's chosen mark (red)
    const toggleHighlightRed = (element) => {
        element.classList.remove("highlight-card-blue")
        element.classList.add("highlight-card-red")
    }

    // Set a player card's highlight color to match its player's chosen mark (blue)
    const toggleHighlightBlue = (element) => {
        element.classList.remove("highlight-card-red")
        element.classList.add("highlight-card-blue")
    }

    // Greys out Player 2 card when "Player vs Bot" option is selected
    const fadePlayerCardTwo = (isFaded) => {
        const playerCardTwo = document.querySelector("#player-two-card");
        playerCardTwo.classList.toggle("is-faded", isFaded)
    }

    // Shows/hide the difficulty group ("Easy", "Expert") when (Player vs Player) is selected
    const toggleDifficultyGroupVisibility = (isInvisible) => {
        const difficultyGroup = document.querySelector(".difficulty-group");
        difficultyGroup.classList.toggle("is-invisible", isInvisible);
    }

    // Combines the faded highlight state changes for the
    // difficulty action so they can be used in one function call
    const updateDifficultyActionState = (isFaded, isHighlighted) => {
        const difficultyAction = document.querySelector(".difficulty-action");
        toggleActionHighlight(difficultyAction, isHighlighted);
        toggleDifficultyFaded(difficultyAction, isFaded);
    }

    // Converts the form into an object and normalizes the 
    // difficulty value before using it to setup the game
    const getLandingPageFormData = (form) => {
        const rawData = new FormData(form);
        const data = Object.fromEntries(rawData.entries());
        const cleanedData = clearDifficultyForHumanMode(data);
        return cleanedData;
    }

    // Marks the difficulty group fields (Easy, Expert) and player two card fields
    // as required or not. Based on the mode (bot) or (pvp) mode
    const setRequiredFields = (requiredDifficulty, requirePlayerTwoInput) => {
        const playerTwoInput = document.querySelector("#player-two");
        const difficultyEasy = document.querySelector("#difficulty-easy");
        difficultyEasy.required = requiredDifficulty;
        playerTwoInput.required = requirePlayerTwoInput;
        return;
    }

    // Difficulty only applies in bot mode. When the opponent is human,
    // force difficultyOption to "N/A" so no irrelevant value is carried forward
    const clearDifficultyForHumanMode = (data) => {
        for (const key in data) {
            if (data[key] === "human-opponent") {
                data["difficultyOption"] = "N/A";
                break;
            }
        }
        return data;
    }

    // Fills in "Bot" as player two's name/label when bot mode is enabled.
    // and reverts back to the blank "Player Two" input otherwise. Also,
    // the mark selection will be re-synced to reflect the changes.
    const setPlayerTwoBotMode = (isBot) => {
        const playerTwoInput = document.querySelector("#player-two")
        const playerTwoLabel = playerTwoInput.previousElementSibling;
        const oMark = document.querySelector("#player-two-mark-o");

        playerTwoInput.value = isBot ? "Bot" : "";
        playerTwoLabel.textContent = isBot ? "Bot" : "Player Two"

        handleMarkSelections(oMark);
        return;
    }

    // Sets up the form's starting state when the page first loads.
    // Starting state: bot mode one, player one as X, difficulty set to easy
    const initializeDefaultFormState = () => {
        const modeBot = document.querySelector("#mode-bot");
        const playerOneInput = document.querySelector("#player-one-input");
        const playerOneXMark = document.querySelector("#player-one-mark-x");
        const playerTwoInput = document.querySelector("#player-two");
        const difficultyEasy = document.querySelector("#difficulty-easy");

        modeBot.checked = true;
        handleModeChange(modeBot)

        difficultyEasy.checked = true;

        playerOneInput.value = "";
        playerOneXMark.checked = true;
        handleMarkSelections(playerOneXMark);

        playerTwoInput.value = "Bot";
        return;
    }

    // Runs whenever the user switches between bot mode and PvP mode
    // Parts of the form will be updated based on the choice.
    const handleModeChange = (element) => {

        if (element.matches("#mode-bot") && element.checked) {
            // Bot mode: difficulty options (Easy, Expert) becomes usable, player two is
            // locked in as "Bot" and greyed.
            updateDifficultyActionState(false, true)
            fadePlayerCardTwo(true)
            setPlayerTwoBotMode(true)
            toggleDifficultyGroupVisibility(false);
            setRequiredFields(true, false)

        } else if (element.matches("#mode-pvp") && element.checked) {
            // Pvp mode: difficulty options (Easy, Expert) disappears (becomes
            // unusable) and the player two card can now be edited (now longer greyed out).
            updateDifficultyActionState(true, false)
            fadePlayerCardTwo(false)
            setPlayerTwoBotMode(false)
            toggleDifficultyGroupVisibility(true);
            setRequiredFields(false, true);
        }
        return;

    }

    // Keeps player one and player two's marks mutually exclusive.
    // So whenever mark one player picks, the other player automatically
    // gets the opposite mark.
    // Also updates each player's card highlight to match their newly assigned
    // marks.
    const handleMarkSelections = (element) => {
        const playerOneCard = document.querySelector("#player-one-card");
        const playerTwoCard = document.querySelector("#player-two-card");
        const playerOneXMark = document.querySelector("#player-one-mark-x");
        const playerOneOMark = document.querySelector("#player-one-mark-o");
        const playerTwoXMark = document.querySelector("#player-two-mark-x");
        const playerTwoOMark = document.querySelector("#player-two-mark-o");

        if (element.matches("#player-one-mark-x") && element.checked) {
            playerTwoOMark.checked = true
            toggleHighlightRed(playerOneCard)
            toggleHighlightBlue(playerTwoCard)
        } else if (element.matches("#player-one-mark-o") && element.checked) {
            playerTwoXMark.checked = true;
            toggleHighlightBlue(playerOneCard);
            toggleHighlightRed(playerTwoCard)
        } else if (element.matches("#player-two-mark-x") && element.checked) {
            playerOneOMark.checked = true;
            toggleHighlightRed(playerTwoCard);
            toggleHighlightBlue(playerOneCard)
        } else if (element.matches("#player-two-mark-o") && element.checked) {
            playerOneXMark.checked = true;
            toggleHighlightBlue(playerTwoCard);
            toggleHighlightRed(playerOneCard)
        }
        return;
    }

    // Sets up all the event listeners
    const attachLandingListeners = () => {
        const form = document.querySelector(".landing-page");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const cleanData = getLandingPageFormData(form);
            GameMasterModule.setupGame(cleanData);
            GameScreenFunctionalityModule.initializeGameScreen();

            toggleShrinkFade(form);
        });

        form.addEventListener("animationend", () => {
            const loadingScreen = document.querySelector(".loading-screen");
            initializeDefaultFormState();
            toggleRemoveNode(form)
            toggleShrinkFade(form)
            toggleRemoveNode(loadingScreen);
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
    attachLandingListeners();

    return { toggleRemoveNode, toggleShrinkFade }
})();
