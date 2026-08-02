const GameMasterModule = (function () {
    const playerOne = createPlayer("Rachel", "X")
    const playerTwo = createPlayer("Computer", "O")
    let activePlayer = playerOne;
    let gameOver = false;

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const playAI = (board) => {
        const humanMarker = playerOne.getMark();
        const aiMarker = playerTwo.getMark();
        const [row, col] = AIModelModule.findBestMove(board, aiMarker, humanMarker)
        applyMove(row, col);
    }

    const applyMove = (row, col) => {
        const result = GameBoardModule.placeSquare(row, col, getActivePlayer().getMark());
        const board = GameBoardModule.boardWithSquareValues();

        if (!result.success) {
            console.log(result.message)
        } else if (WinDetectionModule.isWinnerFound(getActivePlayer().getMark(), board)) {
            gameOver = true;
            console.log(`${getActivePlayer().getName()} won!`)
        } else if (GameConstraintsModule.isBoardFull(board)) {
            gameOver = true;
            console.log("It's a tie.")
        } else {
            switchPlayers();
            console.log(`${getActivePlayer().getName()}'s turn.`)
        }
        GameBoardModule.displayBoard();

        if (!gameOver && getActivePlayer() === playerTwo) {
            playAI(board)
        }
    }

    const restartGame = () => {
        GameBoardModule.resetBoard();
        activePlayer = playerOne;
        gameOver = false;

        console.log(`${getActivePlayer().getName()}'s turn`)
        GameBoardModule.displayBoard()
    }

    const playMove = (row, col) => {
        if (gameOver) {
            console.log("The game has ended.")
            return;
        }
        applyMove(row, col)
    }

    GameBoardModule.displayBoard()
    return { playMove, restartGame }

})();