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

    const findBestMove = (board, difficulty, aiMarker, humanMarker) => {
        let bestScore = -Infinity
        let bestMove;

        const availableMoves = GameBoardModule.getAvailableMoves(board)
        availableMoves.forEach(([row, col]) => {
            const simulatedAIMove = simulateMove(board, row, col, aiMarker);
            const score = minMax(simulatedAIMove, difficulty, -Infinity, Infinity, false, aiMarker, humanMarker);

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col]
            }
        })

        return bestMove;
    }

    return { findBestMove }


})();