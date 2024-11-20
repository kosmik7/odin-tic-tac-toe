const gameBoard = (() => {
    const board = Array(9).fill(null);

    const placeMark = (playerIndex, pos) => {
        if (board[pos]) return false;
        board[pos] = playerIndex;
        console.log(
            `Player ${playerIndex} placed a mark in position ${pos}`,
            board
        );
        return true;
    };
    const resetBoard = () => board.fill(null);

    return { placeMark, resetBoard };
})();

const players = ((
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) => {
    const list = [
        { name: playerOneName, id: 1, board: [] },
        { name: playerTwoName, id: 2, board: [] },
    ];
    let currentIndex = 0;

    const getCurrentPlayer = () => list[currentIndex];
    const setPositions = (pos) => list[currentIndex].board.push(pos);
    const getPositions = () => playerBoard;
    const nextTurn = () => (currentIndex = 1 - currentIndex);

    return { getCurrentPlayer, nextTurn, setPositions, getPositions };
})();

const gameController = (function () {
    let winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinConditions = (currentPlayer) => {
        const hasWinConditions = winConditions.some((condition) =>
            condition.every((pos) => currentPlayer.board.includes(pos))
        );
        if (hasWinConditions) {
            console.log(currentPlayer.name + " has won");
            gameBoard.resetBoard();
        }
    };

    const playTurn = (position) => {
        const currentPlayer = players.getCurrentPlayer();
        const play = gameBoard.placeMark(currentPlayer.id, position);
        if (play) {
            players.setPositions(position);
            checkWinConditions(currentPlayer);
            players.nextTurn();
        }
    };

    return { playTurn };
})();