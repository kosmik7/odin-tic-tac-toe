const gameBoard = (() => {
    const board = Array(9).fill(null);
    const boardElement = document.querySelectorAll(
        ".game__board>div[data-index]"
    );

    const placeMark = (playerIndex, position) => {
        if (board[position]) return false;
        board[position] = playerIndex;
        console.log(
            `Player ${playerIndex} placed a mark in position ${position}`
        );
        render([position]);
        return true;
    };
    const resetBoard = () => {
        board.fill(null);
        render(board);
    };
    const isTie = () => !board.includes(null);
    const render = (array) => {
        const img = document.createElement("img");
        array.forEach((value, index) => {
            switch (board[value]) {
                case 1:
                    img.src = "ico-cross.svg";
                    img.alt = "Cross icon";
                    boardElement[value].appendChild(img);
                    break;
                case 2:
                    img.src = "ico-circle.svg";
                    img.alt = "Circle icon";
                    boardElement[value].appendChild(img);
                    break;
                default:
                    boardElement[index].innerHTML = "";
            }
        });
    };

    return { placeMark, resetBoard, isTie };
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
    const setPosition = (position) => list[currentIndex].board.push(position);
    const nextTurn = () => (currentIndex = 1 - currentIndex);
    const resetBoard = () =>
        list.forEach((player) => {
            player.board = [];
        });

    return { getCurrentPlayer, setPosition, nextTurn, resetBoard };
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

    const checkGameOver = (currentPlayer) => {
        const hasWinConditions = winConditions.some((condition) =>
            condition.every((position) =>
                currentPlayer.board.includes(position)
            )
        );

        if (hasWinConditions) {
            console.log("Game Over: " + currentPlayer.name + " has won");
            resetGame();
        } else if (gameBoard.isTie()) {
            console.log("Game Over: Tie");
            resetGame();
        }
    };
    const resetGame = () => {
        gameBoard.resetBoard();
        players.resetBoard();
    };
    const playTurn = (position) => {
        const currentPlayer = players.getCurrentPlayer();
        const play = gameBoard.placeMark(currentPlayer.id, position);
        if (play) {
            players.setPosition(position);
            checkGameOver(currentPlayer);
            players.nextTurn();
        }
    };

    return { playTurn };
})();
