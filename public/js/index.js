function createPlayer(playerName, marker) {
    const name = playerName;
    const token = tokenValue

    const getName = () => name;
    const getMark = () => token;
    
    return { getName, getMark };
}

function createSquare() {
    let cellValue = "." // "." represents an empty/unfilled cell

    const getCellValue = () => cellValue;
    const updateCellValue = (newValue) => cellValue = newValue;

    return { getCellValue, updateCellValue };
}

const GameBoardModule = (function () {

})();

const GameConstraintsModule = (function () {

})();

const WinDetectionModule = (function () {

})();

const GameMasterModule = (function () {

})();