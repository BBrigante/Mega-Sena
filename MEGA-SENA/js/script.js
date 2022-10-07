var state = {board: [], currentGame: [], savedGames: []};

function start() {
    readLocalstorage ();
    createBoard ();
    newGame();
    render();    
}

function readLocalstorage () {
    if (!window.localStorage) {
        return;
    }

    var savedGamesFromLocalStorage =window.localStorage.getItem('save-games');

    if (savedGamesFromLocalStorage) {
        state.savedGames = JSON.parse(savedGamesFromLocalStorage);
    }
}

function writeToLocalStorage () {
    window.localStorage.setItem('save-games', JSON.stringify(state.savedGames));
}
 
function createBoard() {
    state.board = [];

    for (var i = 1; i <= 60; i++) {
        state.board.push(i);    }
}

function newGame() {
    resetGame();
    render();
}

    

function render() {
    renderBoard();
    renderButtons();
    renderSavedGames();
}

function renderBoard () {
    var divBoard = document.querySelector('#megasena-board');
    divBoard.innerHTML = '';

    var ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');

    for (var i = 0; i < state.board.length; i++) {
        var currentNumber = state.board[i];

        var liNumber = document.createElement('li');
        liNumber.textContent = currentNumber;
        liNumber.classList.add('number');

        liNumber.addEventListener('click', handleNumberClick);

        if(isNumberInGame(currentNumber)) {
            liNumber.classList.add('selected-number');
        }

        ulNumbers.appendChild(liNumber);
    }

divBoard.appendChild(ulNumbers);

}

function handleNumberClick (event) {
    var value = Number (event.currentTarget.textContent);
    
    if (isNumberInGame(value)) {
        removeNumberFromGame(value);
    } else {
        addNumberToGame(value);
    }

    render();
}

function renderButtons () {
    var divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';
    
    var ButtonNewGame = creatNewGameButton();
    var buttonRandonGame = createRandonGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(ButtonNewGame);
    divButtons.appendChild(buttonRandonGame);
    divButtons.appendChild(buttonSaveGame);
}

function createRandonGameButton () {
    var button = document.createElement('button');
    button.textContent = 'Jogo Aleatório';

    button.addEventListener('click', randonGame);

    return button;
}

function creatNewGameButton () {
    var button = document.createElement('button');
    button.textContent = 'Novo Jogo';

    button.addEventListener('click', newGame);

    return button;
}

function createSaveGameButton () {
    var button = document.createElement('button');
    button.textContent = 'Salvar jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame);

    return button;
}

function renderSavedGames () {
    var divSaveGames = document.querySelector('#megasena-saved-games');
    divSaveGames.innerHTML = '';

    if (state.savedGames.length === 0) {
        divSaveGames.innerHTML = '<p>Nenhum jogo salvo</p>';
    
    } else {
        var ulSavedGames = document.createElement('ul')

        for (var i =0; i < state.savedGames.length; i++) {
            var currentGame = state.savedGames[i];
            
            var liGame = document.createElement('li');
            liGame.textContent = currentGame.join(' ,  ');
          
            ulSavedGames.appendChild(liGame);
        }

        divSaveGames.appendChild(ulSavedGames);
    }
}

function addNumberToGame(numberToAdd) {
    if (numberToAdd < 1 || numberToAdd > 60) {
        console.error('Numero Invalido', numberToAdd);
        return;
    }
    
    if (state.currentGame.length >= 6 ) {
        console.error('Erro: - O jogo já esta completo -');
        return;
    }

    if (isNumberInGame(numberToAdd)) {
        console.error('Erro: - Numero ja existente -', numberToAdd);
        return;
    }    
    
    state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
    if (numberToRemove < 1 || numberToRemove > 60) {
        console.error('Numero Invalido:', numberToRemove);
        return;
    }

    var newGame =[]
    
    for (var i = 0; i < state.currentGame.length; i++) {
        var currentNumber = state.currentGame[i]
        
        if (currentNumber === numberToRemove) {
            continue;
        }
        newGame.push (currentNumber);        
    }
    state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
    return state.currentGame.includes(numberToCheck);
}

function saveGame() {
    if (!isGameComplete()) {
        console.error('Erro: - O jogo não esta completo -');
        return;
    }

    state.savedGames.push(state.currentGame);
    writeToLocalStorage();
    newGame();
}

function isGameComplete() {
    return state.currentGame.length === 6;
}

function resetGame () {
    state.currentGame = [];
}

function randonGame() {
   resetGame();

   while(!isGameComplete()) {       
       var randonNumber = Math.ceil(Math.random() * 60);
       addNumberToGame(randonNumber);        
    }    
    render();
}

start();
