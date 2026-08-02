function createPlayer(playerName, marker) {
    const name = playerName;
    const mark = marker

    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
}