const GameScreenFunctionalityModule = (function () {
    const playerInfos = document.querySelectorAll(".player-info");
    const playerStreakInfos = document.querySelectorAll(".player-streak-info");
    const playerWinLosses = document.querySelectorAll(".win-loss");
    const roundInfoContainer = document.querySelector(".round-info-container");
    const gameMode = document.querySelector("#static-mode-label");
    const p1Mark = document.querySelector("#static-player-one-mark");
    const p1Name = document.querySelector("#static-player-one-name");
    const p2Mark = document.querySelector("#static-player-two-mark");
    const p2Name = document.querySelector("#static-player-two-name");

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




})();
