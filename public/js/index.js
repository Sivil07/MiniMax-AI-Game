function createPlayer(playerName, marker) {
    const name = playerName;
    const token = tokenValue

    const getName = () => name;
    const getMark = () => token;

    return { getName, getMark };
}

function createSquare() {
    let cellValue = "." // "." represents an empty/unfilled cell

    const getSquareValue = () => cellValue;
    const updateSquareValue = (newValue) => cellValue = newValue;

    return { getSquareValue, updateSquareValue };
}

const GameBoardModule = (function () {
    const rows = 3 
    const cols = 3;
    const board = []

    const setupBoard = () => {
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let col = 0; col < cols; col++) {
                board[row].push(createSquare())
            }
        }
    };
    setupBoard()

    const getBoard = () => board; 

    const boardWithSquareValues = () => {
        return board.map(row => row.map( square => square.getSquareValue()))
    }

    const displayBoard = () => console.log(boardWithSquareValues())
    
})();

const GameConstraintsModule = (function () {


})();

const WinDetectionModule = (function () {

})();

const GameMasterModule = (function () {

})();