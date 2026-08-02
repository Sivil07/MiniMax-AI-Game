function createSquare() {
    let squareValue = "." // "." represents an empty/unfilled cell

    const getSquareValue = () => squareValue;
    const updateSquareValue = (newValue) => squareValue = newValue;

    return { getSquareValue, updateSquareValue };
}