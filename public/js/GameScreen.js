const GameScreenFunctionalityModule = (function () {
    const playerInfos = document.querySelectorAll(".player-info");
    const playerStreakInfos = document.querySelectorAll(".player-streak-info");
    const playerWinLosses = document.querySelectorAll(".win-loss");
    const roundInfoContainer = document.querySelector(".round-info-container");
    const gameMode = document.querySelector("#static-mode-label");
    const boardSection = document.querySelector("#board-section");
    const board = document.querySelector(".board");
    const p1Mark = document.querySelector("#static-player-one-mark");
    const p1Name = document.querySelector("#static-player-one-name");
    const p2Mark = document.querySelector("#static-player-two-mark");
    const p2Name = document.querySelector("#static-player-two-name");

    const initializeGameScreen = () => {
        setupStaticUI(GameMasterModule.getGameData());
        setupDynamicUI(GameMasterModule.getGameData());
    }

    const updateActivePlayer = () => {
        const activePlayerNode = document.querySelector("#player-turn");
        activePlayerNode.remove();
        loadIntoBoardSection(GameMasterModule.getActivePlayer().getName());
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

    const loadIntoRoundInfoContainer = (roundCount) => {
        const roundNumNode = createRoundNumber(roundCount);
        roundInfoContainer.prepend(roundNumNode);
    }

    const loadIntoBoardSection = (activePlayerName) => {
        const activePName = createActivePlayer(activePlayerName);
        boardSection.prepend(activePName);
    }

    const loadIntoPlayerInfos = (playerOneWins, playerTwoWins) => {
        const [p1Info, p2Info] = playerInfos;

        const p1Score = createWinScore(playerOneWins, "score");
        const p2Score = createWinScore(playerTwoWins, "score");

        p1Info.appendChild(p1Score);
        p2Info.appendChild(p2Score);
    }

    const loadIntoPlayerStreakInfos = (playerOneStreak, playerTwoStreak) => {
        const [p1StreakInfo, p2StreakInfo] = playerStreakInfos;

        const p1Streak = createPlayerStatistic("Streak", playerOneStreak, "streak");
        const p2Streak = createPlayerStatistic("Streak", playerTwoStreak, "streak");

        p1StreakInfo.prepend(p1Streak);
        p2StreakInfo.prepend(p2Streak);
    }

    const loadIntoPlayerWinLosses = (playerOneWins, playerOneLosses, playerTwoWins, playerTwoLosses) => {
        const [p1WinLoss, p2WinLoss] = playerWinLosses;
        const p1Wins = createPlayerStatistic("W", playerOneWins, "wins");
        const p1Losses = createPlayerStatistic("L", playerOneLosses, "losses");
        const p2Wins = createPlayerStatistic("W", playerTwoWins, "wins");
        const p2Losses = createPlayerStatistic("L", playerTwoLosses, "losses");

        p1WinLoss.append(p1Wins, p1Losses);
        p2WinLoss.append(p2Wins, p2Losses);
    }

    const setupStaticUI = ({ mode, playerOneName, playerOneMark, playerTwoName, playerTwoMark }) => {
        gameMode.textContent = mode;
        p1Name.textContent = playerOneName;
        p2Name.textContent = playerTwoName;
        p1Mark.textContent = playerOneMark;
        p2Mark.textContent = playerTwoMark;
    }

    const setupDynamicUI = ({ roundCount, playerOneWins, playerTwoWins, playerOneStreak, playerTwoStreak, playerOneLosses, playerTwoLosses }) => {
        loadIntoRoundInfoContainer(roundCount);
        loadIntoPlayerInfos(playerOneWins, playerTwoWins)
        loadIntoPlayerStreakInfos(playerOneStreak, playerTwoStreak);
        loadIntoPlayerWinLosses(playerOneWins, playerOneLosses, playerTwoWins, playerTwoLosses);
        loadIntoBoardSection(GameMasterModule.getActivePlayer().getName());
    }

    const gameBoardListeners = () => {
        board.addEventListener("click", (e) => {
            const element = e.target;
            const { turnFailed, gameEnded, roundEnded, isWinnerFound, isBoardFull, currentActivePlayerMark } = GameMasterModule.playMove(element.dataset.row, element.dataset.col);

            if (gameEnded) {
                console.log("Game already Ended")
                return;
            } else if (roundEnded) {
                console.log("Round already ended")
                return;
            } else if (turnFailed) {
                console.log("The turn failed")
                return;
            }

            element.textContent = currentActivePlayerMark;

            if (isWinnerFound) {
                console.log("winnerFound")
            } else if (isBoardFull) {
                console.log("Board Full")
            } else {
                updateActivePlayer();
            }
        })
    }

    gameBoardListeners()

    return { initializeGameScreen }

})();
