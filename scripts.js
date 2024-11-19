const gameBoard = (() => {
    const board = Array(9).fill(null);

    const placeMark = (playerIndex, pos) => {
        if (board[pos]) return false
        board[pos] = playerIndex
        console.log(`Player ${playerIndex} placed a mark in position ${pos}`, board)
        return true
    }

    return { placeMark }
})();


const players = ((
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) => {
    const list = [
        { name: playerOneName, id: 1 },
        { name: playerTwoName, id: 2 }
    ]
    let currentIndex = 0;

    const getCurrentPlayer = () => list[currentIndex];
    const nextTurn = () => currentIndex = 1 - currentIndex;

    return { getCurrentPlayer, nextTurn }
})();


const gameController = (function () {
    const playTurn = (position) => {
        const play = gameBoard.placeMark(players.getCurrentPlayer().id, position)
        if (play) players.nextTurn();
    }

    return { playTurn }
})();