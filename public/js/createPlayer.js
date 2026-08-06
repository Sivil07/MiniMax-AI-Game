function createPlayer(playerName, marker) {
    const name = playerName;
    const mark = marker;
    let playerWins = 0;
    let playerLosses = 0;
    let playerStreak = 0;

    const getName = () => name;
    const getMark = () => mark;
    const getPlayerWins = () => playerWins;
    const getPlayerLosses = () => playerLosses;
    const getPlayerStreak = () => playerStreak;

    const incrementPlayerWins = (winIncrement) => playerWins += winIncrement;
    const incrementPlayerLosses = (lossIncrement) => playerLosses += lossIncrement;
    const incrementPlayerStreak = (streakIncrement) => playerStreak += streakIncrement;

    const updateStreak = (value) => {
        if (value === "draw" || value == "loss") {
            playerStreak = 0;
            return;
        }
        incrementPlayerStreak(1);
    }

    const resetPlayer = () => {
        playerWins = 0;
        playerLosses = 0;
        playerStreak = 0;
    }

    return {
        getName,
        getMark,
        getPlayerWins,
        getPlayerLosses,
        getPlayerStreak,
        incrementPlayerWins,
        incrementPlayerLosses,
        updateStreak,
        resetPlayer,
    };
}