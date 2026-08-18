const WinDetectionModule = (function () {
    const horizontalChecks = (board, mark) => {
        const rowNum = board.length;

        for (let row = 0; row < rowNum; row++) {
            const [squareOne, squareTwo, squareThree] = board[row];
            if (squareOne === mark && squareTwo === mark && squareThree === mark) {
                return { isWinner: true, coordinates: [[row, 0], [row, 1], [row, 2]] };
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
                return { isWinner: true, coordinates: [[0, col], [1, col], [2, col]] };
            }
        }
        return false;
    }

    const diagonalChecks = (board, mark) => {
        const topRightDiagonal = board[0][0] === mark && board[1][1] === mark && board[2][2] === mark;
        const topLeftDiagonal = board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;

        let winningMatch;
        if (topRightDiagonal) {
            winningMatch = [[0, 0], [1, 1], [2, 2]]
        } else if (topLeftDiagonal) {
            winningMatch = [[0, 2], [1, 1], [2, 0]]
        }

        const result = topRightDiagonal || topLeftDiagonal;

        return { isWinner: result, coordinates: winningMatch }
    }

    const isWinnerFound = (mark, board) => {
        const horizontalResult = horizontalChecks(board, mark);
        const verticalResult = verticalChecks(board, mark);
        const diagonalResult = diagonalChecks(board, mark);

        if (horizontalResult.isWinner) return horizontalResult;
        if (verticalResult.isWinner) return verticalResult;
        if (diagonalResult.isWinner) return diagonalResult;

        return { isWinner: false, coordinates: null }

    }

    return { isWinnerFound }
})();