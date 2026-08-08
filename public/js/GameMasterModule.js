const GameMasterModule = (function () {
    const maxRounds = 3;
    let roundCount = 0;
    let gameOver = false;
    let isAIOn = false;
    let playerOne;
    let playerTwo;
    let activePlayer;
    let inactivePlayer;
    let difficulty;

    const getActivePlayer = () => activePlayer;
    const getInactivePlayer = () => inactivePlayer;
    const hasReachedMaxRounds = () => roundCount === maxRounds;
    const incrementCount = (num) => roundCount += num;

    const switchPlayers = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        inactivePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const resetPlayerActiveStates = () => {
        activePlayer = playerOne;
        inactivePlayer = playerTwo;
    }

    const recordWinLoss = () => {
        getActivePlayer().incrementPlayerWins(1);
        getInactivePlayer().incrementPlayerLosses(1);
    }

    const isAIActive = (opponentType, difficulty) => {
        if (opponentType === "bot-opponent") {
            isAIOn = true;
            setDifficulty(difficulty)
        }
    }

    const playAI = (board) => {
        const humanMarker = playerOne.getMark();
        const aiMarker = playerTwo.getMark();
        const [row, col] = AIModelModule.findBestMove(board, difficulty, aiMarker, humanMarker)
        applyMove(row, col);
    }

    const setupGame = ({ difficultyOption, opponentType, playerOneMark, playerOneName, playerTwoMark, playerTwoName }) => {
        playerOne = createPlayer(playerOneName, playerOneMark);
        playerTwo = createPlayer(playerTwoName, playerTwoMark);
        activePlayer = playerOne;
        inactivePlayer = playerTwo;
        isAIActive(opponentType, difficultyOption);
    }

    const setDifficulty = (difficultyOption) => {
        switch (difficultyOption) {
            case "Easy":
                difficulty = 1;
                break;
            case "Expert":
                difficulty = 9;
                break;
            default:
                break;
        }
    }

    const restartGame = () => {
        GameBoardModule.resetBoard();
        activePlayer.resetPlayer();
        inactivePlayer.resetPlayer();
        resetPlayerActiveStates();
        roundCount = 0;
        gameOver = false;

        console.log(`${getActivePlayer().getName()}'s turn`)
        GameBoardModule.displayBoard()
    }

    const newRound = () => {
        GameBoardModule.resetBoard();
        console.log(`${playerOne.getName()} (Wins: ${playerOne.getPlayerWins()} Losses: ${playerOne.getPlayerLosses()} Streak: ${playerOne.getPlayerStreak()})`)
        console.log(`${playerTwo.getName()} (Wins: ${playerTwo.getPlayerWins()} Losses: ${playerTwo.getPlayerLosses()} Streak: ${playerTwo.getPlayerStreak()})`)
        resetPlayerActiveStates();
        gameOver = false;
        console.log(`${getActivePlayer().getName()}'s turn`)
        GameBoardModule.displayBoard()
    }

    const playMove = (row, col) => {
        if (gameOver && hasReachedMaxRounds()) {
            console.log("The game has ended. No More Rounds")
            return;
        }

        if (gameOver && !hasReachedMaxRounds()) {
            console.log("Start new round");
            return;

        }
        applyMove(row, col)
    }

    const applyMove = (row, col) => {
        const result = GameBoardModule.placeSquare(row, col, getActivePlayer().getMark());
        const board = GameBoardModule.boardWithSquareValues();

        if (!result.success) {
            console.log(result.message)
        } else if (WinDetectionModule.isWinnerFound(getActivePlayer().getMark(), board)) {
            gameOver = true;
            recordWinLoss();
            getActivePlayer().updateStreak("win")
            getInactivePlayer().updateStreak("loss");
            incrementCount(1)
            console.log(`${getActivePlayer().getName()} won!`)
        } else if (GameConstraintsModule.isBoardFull(board)) {
            gameOver = true;
            getActivePlayer().updateStreak("draw");
            getInactivePlayer().updateStreak("draw")
            incrementCount(1);
            console.log("It's a tie.")
        } else {
            switchPlayers();
            console.log(`${getActivePlayer().getName()}'s turn.`)
        }
        GameBoardModule.displayBoard();

        if (!gameOver && isAIOn && getActivePlayer() === playerTwo) {
            playAI(board)
        }
    }

    GameBoardModule.displayBoard()
    return { playMove, restartGame, newRound, setupGame }

})();