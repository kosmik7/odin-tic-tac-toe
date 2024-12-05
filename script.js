const gameBoard = (() => {
    const board = Array(9).fill(null);
    const boardElement = document.getElementById("game__board");
    const boardSquaresElements = boardElement.querySelectorAll(
        ".game__board>div[data-index]"
    );
    let winAnimationTimeout;

    boardElement.addEventListener("click", (event) => {
        if (gameController.isGameOver()) {
            gameController.resetGame();
            return;
        }
        const square = event.target.closest("[data-index]");
        if (square) gameController.playTurn(Number(square.dataset.index));
    });

    const placeMark = (playerIndex, position) => {
        if (board[position]) return false;
        board[position] = playerIndex;
        render([position]);
        return true;
    };
    const resetBoard = () => {
        clearTimeout(winAnimationTimeout);
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
                    boardSquaresElements[value].appendChild(img);
                    break;
                case 2:
                    img.src = "ico-circle.svg";
                    img.alt = "Circle icon";
                    boardSquaresElements[value].appendChild(img);
                    break;
                default:
                    boardSquaresElements[index].style.background = "none";
                    boardSquaresElements[index].innerHTML = "";
            }
        });
    };
    const renderWinCondition = (array, id) => {
        const color =
            id === 1
                ? "var(--color-playerone--light)"
                : "var(--color-playertwo--light)";
        array.forEach((value, index) => {
            winAnimationTimeout = setTimeout(() => {
                boardSquaresElements[value].style.background = color;
            }, index * 200);
        });
    };
    return { placeMark, resetBoard, isTie, renderWinCondition };
})();

const players = ((
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) => {
    const list = [
        { name: playerOneName, id: 1, score: 0, board: [] },
        { name: playerTwoName, id: 2, score: 0, board: [] },
    ];
    let currentIndex = 0;

    const getCurrentPlayer = () => list[currentIndex];
    const setPosition = (position) => list[currentIndex].board.push(position);
    const nextTurn = () => (currentIndex = 1 - currentIndex);
    const incrementScore = (object) => ++object.score;
    const resetBoard = () =>
        list.forEach((player) => {
            player.board = [];
        });

    return {
        getCurrentPlayer,
        setPosition,
        nextTurn,
        resetBoard,
        incrementScore,
    };
})();

const gameController = (function () {
    let gameOver = false;
    let tie = 0;
    const messageElement = document.getElementById("game__message");
    const gameStatusElement = document.getElementById("game__status");
    const game_playerOneScore = gameStatusElement.querySelector(
        "#game_playerOneScore"
    );
    const game_playerTwoScore = gameStatusElement.querySelector(
        "#game_playerTwoScore"
    );
    const game_tieScore = gameStatusElement.querySelector("#game_tieScore");

    const resetBtn = document.getElementById("game__replay");
    resetBtn.addEventListener("click", () => resetGame());

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
        const hasWinCondition = winConditions.find((condition) =>
            condition.every((position) =>
                currentPlayer.board.includes(position)
            )
        );
        if (hasWinCondition) {
            gameBoard.renderWinCondition(hasWinCondition, currentPlayer.id);
            renderMessage(`${currentPlayer.name} has won!`);
            renderScore(
                currentPlayer.id,
                players.incrementScore(currentPlayer)
            );
            gameOver = true;
        } else if (gameBoard.isTie()) {
            renderMessage("Tie!");
            renderScore(0, ++tie);
            gameOver = true;
        }
    };

    const renderMessage = (string) => (messageElement.innerText = string);

    const isGameOver = () => gameOver;
    const resetGame = () => {
        gameOver = false;
        gameBoard.resetBoard();
        players.resetBoard();
        renderTurnOrder();
    };
    const playTurn = (position) => {
        const currentPlayer = players.getCurrentPlayer();
        const play = gameBoard.placeMark(currentPlayer.id, position);
        if (play) {
            players.setPosition(position);
            players.nextTurn();
            renderTurnOrder(currentPlayer.id);
            checkGameOver(currentPlayer);
        }
    };
    const renderTurnOrder = () =>
        renderMessage(`${players.getCurrentPlayer().name} turn`);
    const renderScore = (id, score) => {
        if (id === 0) game_tieScore.innerHTML = score;
        else if (id === 1) game_playerOneScore.innerHTML = score;
        else if (id === 2) game_playerTwoScore.innerHTML = score;
    };
    resetGame();
    return { playTurn, isGameOver, resetGame };
})();
