function createPlayer(playerName, marker) {
    const name = playerName;
    const token = tokenValue

    const getName = () => name;
    const getMark = () => token;

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

        const placeSquare = (row, col, mark) => {

        if (GameConstraintsModule.outOfBounds(board, row, col)) {
            return { message: "Board limit Exceeded", success: false};
        }

        const square = board[row][col]

        if (GameConstraintsModule.isSquareNotEmpty(square.getSquareValue())) {
            return { message: "Square already filled with mark", success: false};
        }

        square.updateSquareValue(mark)
        
        return { message: "Value placed", success: true }
    }

    return { placeSquare }

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

})();

const GameMasterModule = (function () {

})();