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




})();
