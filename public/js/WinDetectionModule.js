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