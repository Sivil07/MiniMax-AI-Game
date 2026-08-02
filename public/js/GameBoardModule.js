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