// Flags to track the current player's turn and computer's move timeout
let playerTurn = true;
let computerMoveTimeout = 0;

// Constants to represent the game's status
const gameStatus = {
    MORE_MOVES_LEFT: 1,
    HUMAN_WINS: 2,
    COMPUTER_WINS: 3,
    DRAW_GAME: 4
};

// Initialize game once the DOM content is fully loaded
window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    // Setup the "New Game" button
    const newBtn = document.getElementById("newGameButton");
    newBtn.addEventListener("click", newGame);

    // Add click event listeners to each button on the game board
    const buttons = getGameBoardButtons();
    for (let button of buttons) {
        button.addEventListener("click", () => boardButtonClicked(button));
    }

    // Start a new game
    newGame();
}

// Helper function to retrieve all game board buttons
function getGameBoardButtons() {
    return document.querySelectorAll("#gameBoard > button");
}

// Function to check the current status of the game
function checkForWinner() {
    const buttons = getGameBoardButtons();
    // All possible winning combinations
    const possibilities = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Check for a winning combination
    for (let indices of possibilities) {
        if (buttons[indices[0]].innerHTML !== "" &&
            buttons[indices[0]].innerHTML === buttons[indices[1]].innerHTML &&
            buttons[indices[1]].innerHTML === buttons[indices[2]].innerHTML) {
            return buttons[indices[0]].innerHTML === "X" ? gameStatus.HUMAN_WINS : gameStatus.COMPUTER_WINS;
        }
    }

    // Check if there are any moves left
    for (let button of buttons) {
        if (button.innerHTML === "") {
            return gameStatus.MORE_MOVES_LEFT;
        }
    }

    // If no moves left and no winner, it's a draw
    return gameStatus.DRAW_GAME;
}

// Function to start a new game
function newGame() {
    clearTimeout(computerMoveTimeout); // Clear any scheduled computer move
    computerMoveTimeout = 0;

    // Reset the game board
    const buttons = getGameBoardButtons();
    for (let button of buttons) {
        button.innerHTML = "";
        button.className = "";
        button.disabled = false;
    }

    // Allow the human player to start
    playerTurn = true;
    document.getElementById("turnInfo").textContent = "Your turn";
}

// Function to handle player's move
function boardButtonClicked(button) {
    if (playerTurn) {
        button.innerHTML = "X"; // Mark the player's move with X
        button.classList.add("x"); // Add a class for styling
        button.disabled = true; // Disable the button after the move
        switchTurn(); // Switch turns after the move
    }
}

// Function to switch the turn between the player and the computer
function switchTurn() {
    const status = checkForWinner(); // Check if the game has a winner
    if (status === gameStatus.MORE_MOVES_LEFT) {
        playerTurn = !playerTurn; // Toggle the turn
        document.getElementById("turnInfo").textContent = playerTurn ? "Your turn" : "Computer's turn";
        if (!playerTurn) {
            // Schedule the computer's move after a delay
            computerMoveTimeout = setTimeout(makeComputerMove, 1000);
        }
    } else {
        playerTurn = false; // End the game if there's a winner or a draw
        const turnInfo = document.getElementById("turnInfo");
        if (status === gameStatus.HUMAN_WINS) {
            turnInfo.textContent = "You win!";
        } else if (status === gameStatus.COMPUTER_WINS) {
            turnInfo.textContent = "Computer wins!";
        } else {
            turnInfo.textContent = "Draw game";
        }
    }
}

// Function for the computer to make a move
function makeComputerMove() {
    const buttons = getGameBoardButtons();
    const availableButtons = Array.from(buttons).filter(button => button.innerHTML === "");

    // Choose a random button for the computer's move
    if (availableButtons.length > 0) {
        const randomButton = availableButtons[Math.floor(Math.random() * availableButtons.length)];
        randomButton.innerHTML = "O"; // Mark the move with O
        randomButton.classList.add("o");
        randomButton.disabled = true;
    }

    switchTurn();
}
