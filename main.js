
const myEventListeners = () => {
    const modal = document.querySelector("#myModal");

    document.querySelector("#closeModalCPU").addEventListener("click", () => {
        newBoard.getUserName();
        document.querySelector("#friendName").innerHTML = "CPU";
        document.querySelector("#friendEmoji").innerHTML = "&#128187";
        modal.style.display = "none";
        newBoard.playGame("CPU");
    });

    document.querySelector("#closeModalFriend").addEventListener("click", () => {
        newBoard.getUserName();
        document.querySelector("#friendName").innerHTML = "Friend";
        document.querySelector("#friendEmoji").innerHTML = "&#128100";
        modal.style.display = "none";
        newBoard.playGame("friend");
    });

    document.getElementById("exitButton").addEventListener("click", () => {
        newBoard.exitGame("exit");
    });
    
    document.getElementById("modalButtonExit").addEventListener("click", () => {
        document.querySelector(".modal-end").style.display = "none";
    });
    
    document.getElementById("restartButton").addEventListener("click", () => {
        location.reload();
    });
    
    document.getElementById("modalButtonRestart").addEventListener("click", () => {
        location.reload();
    });
}

myEventListeners();



class GameBoard {
    board = [];
    turns = 0;
    userName;

    constructor () {
        for (let i = 0; i<7; i++){
            this.board.push([]);
            for (let j = 0; j<6; j++){
                this.board[i].push("");
            }
        }
        document.getElementById("userEmoji").classList.add("red-player-turn");
    }

    getUserName () {
        this.userName = document.querySelector("#userNameInput").value;
        if (this.userName === ""){
            this.userName = "Red";
        }
        document.querySelector("#userName").innerHTML = this.userName;

    }

    playGame (typeGame) {
        for (let i = 0; i<7; i++){
            const button = document.getElementById(String(i+1));
            button.addEventListener("click", () => {
                let rowIndex = this.checkLastEmptyRow(i);
                if (rowIndex === false){
                    return;
                } 
                if (this.turns % 2 === 1 && typeGame === "friend" ){
                    this.printPieceOnBoard(i,rowIndex,"playerRed");
                    this.printTurns("red");
                } else if (this.turns % 2 !== 1 && typeGame === "friend"){
                    this.printPieceOnBoard(i,rowIndex,"playerBlue");
                    this.printTurns("blue");
                }else if (this.turns % 2 === 1 && typeGame === "CPU"){
                    this.printPieceOnBoard(i,rowIndex,"playerRed");
                    this.printTurns("red");
                    setTimeout(this.playCPU.bind(this), 400);
                } 
            })
        }
    }

    playCPU () {
        let randomNumber = Math.floor(Math.random() * 7);
        let rowIndex = this.checkLastEmptyRow(randomNumber);
            if (rowIndex === false){
                return;
            } else {
                this.printPieceOnBoard(randomNumber,rowIndex,"playerBlue");
                this.printTurns("blue");
            }
    }


    checkLastEmptyRow (column) {
        let rowIndex = this.board[column].indexOf("",0);
        if (rowIndex !== -1){
            this.turns += 1;
            return rowIndex;
        } else {
            return false;
        }
    }

    printPieceOnBoard(column, row, player) {
        let columnPosition = column + 1;
        let rowPosition = row + 1;
        let id = columnPosition + "-" + rowPosition;
        id = id.toString();

        if (player === "playerRed"){
            document.getElementById("userEmoji").classList.remove("red-player-turn");
            this.board[column][row] = "R";
            document.getElementById(id).classList.add ("red-player");
            document.getElementById("friendEmoji").classList.add("blue-player-turn");
        } else if (player === "playerBlue"){
            document.getElementById("friendEmoji").classList.remove("blue-player-turn");
            this.board[column][row] = "B";
            document.getElementById(id).classList.add ("blue-player");
            document.getElementById("userEmoji").classList.add("red-player-turn");
        }

        this.checkIfWin(column, row, player);
    }

    printTurns(user){
        const redTurns = Math.round(this.turns/2);
        const blueTurns = Math.round(this.turns/2);
        if (user === "red"){
            document.getElementById("redTurns").innerHTML = redTurns;
        } else if (user === "blue"){
            document.getElementById("blueTurns").innerHTML = blueTurns;
        }
    }

    checkIfWin (column, row, player) {
        let playerColor;
        if (player === "playerRed"){
            playerColor = "R";
        } else {
            playerColor = "B";
        }
        this.checkRow(row,playerColor);
        this.checkColumn(column,playerColor);
        this.checkDiagonals(column,row,playerColor);

        this.checkIfBoardIsFull();
    }

    checkRow(row,playerColor){
        let count = 1;
        let rowArray = [];
        for (let i=0; i<this.board.length; i++){
            rowArray.push (this.board[i][row])
        }
        for (let i=0; i<rowArray.length; i++){
            if (rowArray[i]===playerColor && rowArray[i+1]===playerColor){
                count += 1;
            }
        }
        if (count === 4){
            this.exitGame(playerColor);
        }
    }

    checkColumn(column,playerColor){
        let count = 1;
        let columnArray = this.board[column];
        for (let i=0; i<columnArray.length; i++){
            if (columnArray[i]===playerColor && columnArray[i+1]===playerColor){
                count += 1;
            }
        }
        if (count === 4){
            this.exitGame(playerColor);
        }
    }

    checkDiagonals(column,row,playerColor){
        //DIAGONAL 1 - DOWN UP
        let countUpD1 = 0;
        let countDownD1 = 0;

        for(let i = 0; i < this.board.length; i++){
            if (column+i >=0 && row+i >=0 && column+i <=6 && row+i <= 5 && this.board[column+i][row+i] === playerColor){
                countUpD1 += 1;
            } 
            if (column-i >= 0 && row-i >= 0 && column-i <=6 && row-1 <=5 && this.board[column-i][row-i] === playerColor){
                countDownD1 += 1;
            }
        }
        //DIAGONAL 2 - UP DOWN
        let countUpD2 = 0;
        let countDownD2 = 0;

        for(let i = 0; i < this.board.length; i++){
            if (column+i >=0 && row-i >=0 && column+i <=6 && row-i <= 5 && this.board[column+i][row-i] === playerColor){
                countUpD2 += 1;
            } 
            if (column+i >= 0 && row-i >= 0 && column+i <=6 && row-1 <=5 && this.board[column+i][row-i] === playerColor){
                countDownD2 += 1;
            }
        }
        if (countUpD1 === 4 || countDownD1 === 4 || countUpD2 === 4 || countDownD2 === 4){
            this.exitGame(playerColor);
        }
    }

    checkIfBoardIsFull () {
        const checkIfEmpty = this.board.every(column => column.every(piece => piece !== ""));
        if (checkIfEmpty === true){
            this.exitGame("even");
        }
    }
   
    exitGame (winner) {
        this.disableClicks();
        document.querySelector(".modal-end").style.display = "flex";
        let printWinner = document.querySelector(".winner");
        if (winner === "even"){
            printWinner.outerHTML = `<h3 class="winner" id="winnerAnnouncement"> The game has finished without a winner!</h3>`
        }else if (winner === "R"){
            printWinner.outerHTML = `<h3 class="winner" id="winnerAnnouncement"> ${this.userName} is the winner with ${Math.floor(this.turns/2+1)} turns!</h3>`
        } else if (winner === "B"){
            printWinner.outerHTML = `<h3 class="winner" id="winnerAnnouncement"> Blue is the winner with ${Math.floor(this.turns/2)} turns!</h3>`
        } else if (winner === "exit"){
            printWinner.outerHTML = `<h3 class="winner" id="winnerAnnouncement"> The game has been cancelled!</h3>`
        }
    }

    disableClicks () {
        const buttonOff = document.querySelector(".main-game");
        buttonOff.style.pointerEvents = "none";
    }
}

let newBoard = new GameBoard();

