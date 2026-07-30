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

    const getAvailableMoves = (board) => {
        const availableMoves = [];
        const rowNum = board.length;
        const colNum = board[0].length;

        for (let row = 0; row < rowNum; row++) {
            for (let col = 0; col < colNum; col++) {
                if (board[row][col] === ".") {
                    availableMoves.push([row, col]);
                }
            }
        }
        return availableMoves;
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
        getAvailableMoves,
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

    const isWinnerFound = (mark, board) => {
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

    const getGroupCount = (group) => {
        const markerCount = {};
        for (const squareValue of group) {
            markerCount[squareValue] = (markerCount[squareValue] || 0) + 1
        }
        return markerCount;
    }

    const evaluateGroup = (group, aiMarker, humanMarker) => {
        const groupCount = getGroupCount(group);
        const aiCount = groupCount[aiMarker];
        const humanCount = groupCount[humanMarker]
        const emptyCount = groupCount["."]

        if (aiCount > 0 && humanCount > 0) return getWorstScore(); // blocked move

        // Tracks AI advantage
        if (aiCount === 2 && emptyCount === 1) return getGreatScore(); // Strong AI Advantage
        if (aiCount === 1 && emptyCount === 2) return getLowScore(); // Weak AI Advantage

        // Tracks human advantage
        if (humanCount === 2 && emptyCount === 1) return -getGreatScore(); // Strong Human Advantage
        if (humanCount === 1 && emptyCount === 2) return -getLowScore(); // Weak Human Advantage

        return getWorstScore(); // necessary for missed cases
    }

    const evaluateHorizontals = (board, aiMarker, humanMarker) => {
        let score = 0;
        const rowNum = board.length;
        for (let row = 0; row < rowNum; row++) {
            const group = board[row];
            score += evaluateGroup(group, aiMarker, humanMarker)
        }
        return score
    }

    const evaluateVerticals = (board, aiMarker, humanMarker) => {
        let score = 0;
        const colNum = board[0].length;

        for (let col = 0; col < colNum; col++) {
            const group = [board[0][col], board[1][col], board[2][col]];
            score += evaluateGroup(group, aiMarker, humanMarker)
        }
        return score;
    }

    const evaluateDiagonals = (board, aiMarker, humanMarker) => {
        const diagonalGroupOne = [board[0][0], board[1][1], board[2][2]];
        const diagonalGroupTwo = [board[0][2], board[1][1], board[2][0]];
        const groupOneScore = evaluateGroup(diagonalGroupOne, aiMarker, humanMarker);
        const groupTwoScore = evaluateGroup(diagonalGroupTwo, aiMarker, humanMarker);

        return groupOneScore + groupTwoScore;
    }

    const evaluateBoard = (board, aiMarker, humanMarker) => {
        let boardScore = 0;

        const horizontalScore = evaluateHorizontals(board, aiMarker, humanMarker);
        const verticalScore = evaluateVerticals(board, aiMarker, humanMarker);
        const diagonalScore = evaluateDiagonals(board, aiMarker, humanMarker);

        boardScore = horizontalScore + verticalScore + diagonalScore;
        return boardScore;
    }

    const simulateMove = (board, row, col, mark) => {
        const simulatedBoard = GameBoardModule.cloneBoard(board);
        simulatedBoard[row][col] = mark;
        return simulatedBoard;
    }

    const minMax = (board, level, alpha, beta, maximizingAIPlayer, aiMarker, humanMarker) => {
        // Terminal Checks (Game Over Conditions)
        if (WinDetectionModule.isWinnerFound(aiMarker, board)) return getWinningScore();
        if (WinDetectionModule.isWinnerFound(humanMarker, board)) return -getWinningScore();
        if (GameConstraintsModule.isBoardFull(board)) return getWorstScore();

        if (level === 0) {
            return evaluateBoard(board, aiMarker, humanMarker);
        }

        const availableMoves = GameBoardModule.getAvailableMoves(board)

        if (maximizingAIPlayer) {
            let highestScore = -Infinity;
            for (const [row, col] of availableMoves) {
                const aiSimulatedMove = simulateMove(board, row, col, aiMarker);
                let currentAIScore = minMax(aiSimulatedMove, level - 1, alpha, beta, false, aiMarker, humanMarker);
                highestScore = Math.max(highestScore, currentAIScore)
                alpha = Math.max(alpha, currentAIScore);
                if (alpha >= beta) {
                    break;
                }
            }
            return highestScore

        } else {
            let lowestScore = Infinity;
            for (const [row, col] of availableMoves) {
                const humanSimulatedMove = simulateMove(board, row, col, humanMarker);
                let currentHumanScore = minMax(humanSimulatedMove, level - 1, alpha, beta, true, aiMarker, humanMarker);
                lowestScore = Math.min(lowestScore, currentHumanScore);
                beta = Math.min(beta, currentHumanScore);
                if (alpha >= beta) {
                    break;
                }
            }
            return lowestScore;
        }
    }

    const findBestMove = (board, aiMarker, humanMarker) => {
        let bestScore = -Infinity
        let bestMove;

        const availableMoves = GameBoardModule.getAvailableMoves(board)
        availableMoves.forEach(([row, col]) => {
            const simulatedAIMove = simulateMove(board, row, col, aiMarker);
            const score = minMax(simulatedAIMove, 4, -Infinity, Infinity, false, aiMarker, humanMarker);

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col]
            }
        })

        return bestMove;
    }

    return { findBestMove }


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