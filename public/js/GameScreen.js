const GameScreenFunctionalityModule = (function () {
    const playerInfos = document.querySelectorAll(".player-info");
    const playerStreakInfos = document.querySelectorAll(".player-streak-info");
    const playerWinLosses = document.querySelectorAll(".win-loss");
    const gameContainer = document.querySelector(".game-container");
    const roundInfoContainer = document.querySelector(".round-info-container");
    const gameMode = document.querySelector("#static-mode-label");
    const boardSection = document.querySelector("#board-section");
    const board = document.querySelector(".board");
    const p1Side = document.querySelector("#player-one-side")
    const p1Mark = document.querySelector("#static-player-one-mark");
    const p1Name = document.querySelector("#static-player-one-name");
    const p2Side = document.querySelector("#player-two-side")
    const p2Mark = document.querySelector("#static-player-two-mark");
    const p2Name = document.querySelector("#static-player-two-name");
    const nextRound = document.querySelector("#next-round");
    const endGame = document.querySelector("#end-game");
    let dynamicColoring = new Map();
    let dynamicNodes = []

    const initializeGameScreen = () => {
        setupDynamicUI(GameMasterModule.getGameData());
        setupStaticUI(GameMasterModule.getGameData());
    }

    const updateActivePlayer = () => {
        const activePlayerNode = document.querySelector("#player-turn");
        activePlayerNode.remove();
        loadIntoBoardSection(GameMasterModule.getActivePlayer().getName());
    }

    const removeDynamicNodes = () => {
        for (const node of dynamicNodes) {
            node.remove();
        }
    }

    const resetColoring = () => {
        p1Side.classList.remove("highlight-card-red", "highlight-card-blue");
        p2Side.classList.remove("highlight-card-red", "highlight-card-blue")
        p1Mark.classList.remove("x-badge-coloring", "o-badge-coloring");
        p2Mark.classList.remove("x-badge-coloring", "o-badge-coloring");
    }

    const resetStaticNodes = () => {
        gameMode.textContent = "";
        p1Name.textContent = "";
        p2Name.textContent = "";
        p1Mark.textContent = "";
        p2Mark.textContent = "";
        resetColoring();
    }

    const createActivePlayer = (activePlayerName) => {
        const activePlayer = document.createElement("p");
        activePlayer.id = "player-turn"
        activePlayer.textContent = `${activePlayerName}'s Turn!`
        return activePlayer;
    }

    const createWinScore = (textContent, className) => {
        const winScore = document.createElement("p");
        winScore.classList.add(className);
        winScore.textContent = textContent;
        return winScore;
    }

    const createRoundNumber = (roundCount) => {
        const roundNumNode = document.createElement("p");
        roundNumNode.classList.add("round-info");
        roundNumNode.textContent = `Round ${roundCount}`;
        return roundNumNode;
    }

    const createPlayerStatistic = (defaultText, textContent, className) => {
        const statistic = document.createElement("p");
        statistic.classList.add(className);
        statistic.textContent = `${defaultText} ${textContent}`;
        return statistic;
    }

    const createSquare = (row, col) => {
        const square = document.createElement("button");
        square.classList.add("square")
        square.type = "button";
        square.dataset.row = row;
        square.dataset.col = col;
        return square;
    }

    const setupSquares = () => {
        const squareNodes = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const square = createSquare(row, col);
                dynamicNodes.push(square);
                squareNodes.push(square);
            }
        }
        return squareNodes;
    }

    const loadIntoBoard = () => {
        board.append(...setupSquares())
    }


    const loadIntoRoundInfoContainer = (roundCount) => {
        const roundNumNode = createRoundNumber(roundCount);
        dynamicNodes.push(roundNumNode);
        roundInfoContainer.prepend(roundNumNode);
    }

    const loadIntoBoardSection = (activePlayerName) => {
        const activePName = createActivePlayer(activePlayerName);
        dynamicNodes.push(activePName);
        boardSection.prepend(activePName);
    }

    const loadIntoPlayerInfos = (playerOneWins, playerTwoWins) => {
        const [p1Info, p2Info] = playerInfos;

        const p1Score = createWinScore(playerOneWins, "score");
        const p2Score = createWinScore(playerTwoWins, "score");
        console.log(dynamicColoring.size)
        if (dynamicColoring.size > 0) {
            p1Score.classList.add(`${dynamicColoring.get("player-1")}`);
            p2Score.classList.add(`${dynamicColoring.get("player-2")}`);
        }

        console.log(dynamicColoring);

        dynamicNodes.push(p1Score, p2Score);
        p1Info.appendChild(p1Score);
        p2Info.appendChild(p2Score);
    }

    const loadIntoPlayerStreakInfos = (playerOneStreak, playerTwoStreak) => {
        const [p1StreakInfo, p2StreakInfo] = playerStreakInfos;

        const p1Streak = createPlayerStatistic("Streak", playerOneStreak, "streak");
        const p2Streak = createPlayerStatistic("Streak", playerTwoStreak, "streak");

        dynamicNodes.push(p1Streak, p2Streak);
        p1StreakInfo.prepend(p1Streak);
        p2StreakInfo.prepend(p2Streak);
    }

    const loadIntoPlayerWinLosses = (playerOneWins, playerOneLosses, playerTwoWins, playerTwoLosses) => {
        const [p1WinLoss, p2WinLoss] = playerWinLosses;
        const p1Wins = createPlayerStatistic("W", playerOneWins, "wins");
        const p1Losses = createPlayerStatistic("L", playerOneLosses, "losses");
        const p2Wins = createPlayerStatistic("W", playerTwoWins, "wins");
        const p2Losses = createPlayerStatistic("L", playerTwoLosses, "losses");

        dynamicNodes.push(p1Wins, p1Losses, p2Wins, p2Losses);
        p1WinLoss.append(p1Wins, p1Losses);
        p2WinLoss.append(p2Wins, p2Losses);
    }

    const setupCardColoring = (player1Mark) => {
        if (player1Mark === "X") {
            p1Side.classList.add("highlight-card-red")
            p1Mark.classList.add("x-badge-coloring");
            p2Side.classList.add("highlight-card-blue")
            p2Mark.classList.add("o-badge-coloring")
        } else {
            p1Side.classList.add("highlight-card-blue")
            p1Mark.classList.add("o-badge-coloring");
            p2Side.classList.add("highlight-card-red")
            p2Mark.classList.add("x-badge-coloring")
        }
    }

    const setDynamicColoring = (playerOneMark) => {
        const [p1Score, p2Score] = document.querySelectorAll(".score");
        if (playerOneMark === "X") {
            p1Score.classList.add("x-mark-coloring")
            p2Score.classList.add("o-mark-coloring")
            dynamicColoring.set("player-1", "x-mark-coloring");
            dynamicColoring.set("player-2", "o-mark-coloring");
        } else {
            p1Score.classList.add("o-mark-coloring")
            p2Score.classList.add("x-mark-coloring")
            dynamicColoring.set("player-1", "o-mark-coloring");
            dynamicColoring.set("player-2", "x-mark-coloring");
        }
    }

    const setupStaticUI = ({ mode, playerOneName, playerOneMark, playerTwoName, playerTwoMark }) => {
        gameMode.textContent = mode;
        p1Name.textContent = playerOneName;
        p2Name.textContent = playerTwoName;
        p1Mark.textContent = playerOneMark;
        p2Mark.textContent = playerTwoMark;
        endGame.disabled = false;
        board.classList.remove("prevent-click");
        setupCardColoring(playerOneMark);
        setDynamicColoring(playerOneMark);
    }

    const setupDynamicUI = ({ roundCount, playerOneWins, playerTwoWins, playerOneStreak, playerTwoStreak, playerOneLosses, playerTwoLosses }) => {
        loadIntoRoundInfoContainer(roundCount);
        loadIntoPlayerInfos(playerOneWins, playerTwoWins)
        loadIntoPlayerStreakInfos(playerOneStreak, playerTwoStreak);
        loadIntoPlayerWinLosses(playerOneWins, playerOneLosses, playerTwoWins, playerTwoLosses);
        loadIntoBoardSection(GameMasterModule.getActivePlayer().getName());
        loadIntoBoard();
    }

    const renderMoveResult = (result) => {
        const { turnFailed, isWinnerFound, isBoardFull, currentActivePlayerMark, isAITurn, row, col } = result

        if (turnFailed) {
            console.log("The turn failed")
            return;
        }
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.textContent = currentActivePlayerMark;

        if (isWinnerFound) {
            console.log("winnerFound")
            nextRound.disabled = GameMasterModule.hasMoreRoundsAvailable();
        } else if (isBoardFull) {
            console.log("Board Full")
            nextRound.disabled = GameMasterModule.hasMoreRoundsAvailable();
        } else {
            updateActivePlayer();
        }

        return isAITurn;
    }

    const gameBoardListeners = () => {
        board.addEventListener("click", (e) => {
            const element = e.target;

            const humanResult = GameMasterModule.playMove(element.dataset.row, element.dataset.col);
            const isAiTurn = renderMoveResult(humanResult);

            if (isAiTurn) {
                const aiResult = GameMasterModule.playAI();
                setTimeout(() => {
                    renderMoveResult(aiResult);
                }, 1000)
            }
        })

        nextRound.addEventListener("click", () => {
            if (!GameMasterModule.hasMoreRoundsAvailable()) {
                removeDynamicNodes();
                dynamicNodes = [];
                GameMasterModule.newRound();
                setupDynamicUI(GameMasterModule.getGameData());
                nextRound.disabled = true;
            }
        })

        endGame.addEventListener("click", () => {
            GameMasterModule.resetGame();
            LandingScreenFunctionalityModule.toggleShrinkFade(gameContainer)
            endGame.disabled = true;
            LandingScreenFunctionalityModule.togglePointerEvents(board);
        })

        gameContainer.addEventListener("animationend", () => {
            const landingScreen = document.querySelector(".landing-page");
            resetStaticNodes();
            removeDynamicNodes();
            dynamicColoring.clear();
            LandingScreenFunctionalityModule.toggleRemoveNode(gameContainer);
            LandingScreenFunctionalityModule.toggleShrinkFade(gameContainer);
            LandingScreenFunctionalityModule.toggleRemoveNode(landingScreen);
        })
    }

    gameBoardListeners()

    return { initializeGameScreen }

})();
