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