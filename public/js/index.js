function createPlayer(playerName, marker) {
    const name = playerName;
    const mark = marker

    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
}

function createSquare() {
    let squareValue = "." // "." represents an empty/unfilled cell

    const getSquareValue = () => squareValue;
    const updateSquareValue = (newValue) => squareValue = newValue;

    return { getSquareValue, updateSquareValue };
}

const GameBoardModule = (function () {
    const rows = 3;
    const cols = 3;
    const board = [];

    const setupBoard = () => {
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let col = 0; col < cols; col++) {
                board[row].push(createSquare())
            }
        }
    };
    setupBoard();

    const getBoard = () => board;

    const boardWithSquareValues = () => {
        return board.map(row => row.map(square => square.getSquareValue()));
    }

    const displayBoard = () => console.log(boardWithSquareValues());

    const cloneBoard = (board) => {
        return board.map(row => [...row])
    }


    const resetBoard = () => {
        board.forEach((row) =>
            row.forEach((square) =>
                square.updateSquareValue(".")));
    }

    const placeSquare = (row, col, mark) => {

        if (GameConstraintsModule.outOfBounds(board, row, col)) {
            return { message: "Board limit Exceeded", success: false };
        }

        const square = board[row][col]

        if (GameConstraintsModule.isSquareNotEmpty(square.getSquareValue())) {
            return { message: "Square already filled with mark", success: false };
        }

        square.updateSquareValue(mark)

        return { message: "Value placed", success: true }
    }

    return { 
        placeSquare, 
        displayBoard, 
        boardWithSquareValues, 
        resetBoard, 
        cloneBoard,
    }

})();

const GameConstraintsModule = (function () {

    const isSquareNotEmpty = (square) => square !== "."

    const outOfBounds = (board, row, col) => {
        return board[row] === undefined || board[row][col] === undefined
    }

    const isBoardFull = (board) => {
        return board.every((row) => row.every((square) => square !== "."))
    }

    return { isSquareNotEmpty, outOfBounds, isBoardFull }

})();

const WinDetectionModule = (function () {
    const horizontalChecks = (board, mark) => {
        const rowNum = board.length;

        for (let row = 0; row < rowNum; row++) {
            const [squareOne, squareTwo, squareThree] = board[row];
            if (squareOne === mark && squareTwo === mark && squareThree === mark) {
                return true;
            }
        }
        return false;
    }

    const verticalChecks = (board, mark) => {
        const colNum = board[0].length;

        for (let col = 0; col < colNum; col++) {
            const colOne = board[0][col];
            const colTwo = board[1][col];
            const colThree = board[2][col];
            if (colOne === mark && colTwo === mark && colThree === mark) {
                return true;
            }
        }
        return false;
    }

    const diagonalChecks = (board, mark) => {
        const topRightDiagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
        const topLeftDiagonal = board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;

        return topRightDiagonal || topLeftDiagonal;
    }

    const isWinnerFound = (mark) => {
        const board = GameBoardModule.boardWithSquareValues();
        const checkHorizontal = horizontalChecks(board, mark);
        const checkVertical = verticalChecks(board, mark);
        const checkDiagonal = diagonalChecks(board, mark);

        if (checkHorizontal || checkVertical || checkDiagonal) {
            return true;
        }
        return false;
    }

    return { isWinnerFound }
})();

const AIModelModule = (function () {
    const winningScore = 20000;
    const topScore = 100;
    const greatScore = 75;
    const lowScore = 25;
    const worstScore = 0;

    const getWinningScore = () => winningScore;
    const getTopScore = () => topScore;
    const getGreatScore = () => greatScore;
    const getLowScore = () => lowScore;
    const getWorstScore = () => worstScore;

})();

const GameMasterModule = (function () {
    const playerOne = createPlayer("Rachel", "X")
    const playerTwo = createPlayer("Computer", "O")
    let activePlayer = playerOne;
    let gameOver = false;

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const applyMove = (row, col) => {
        const result = GameBoardModule.placeSquare(row, col, getActivePlayer().getMark());
        const board = GameBoardModule.boardWithSquareValues();

        if (!result.success) {
            console.log(result.message)
        } else if (WinDetectionModule.isWinnerFound(getActivePlayer().getMark())) {
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