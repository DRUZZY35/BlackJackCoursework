let historyPlayer = {win: 0, lose: 0};
let historyDealer = {win: 0, lose: 0};
//This for recording the history of the wins and losses for the Player and Dealer This updates every time the round has finished So the let is necessary

let BackOfCard;

let BalOfPlayer = 0;
// The balance of the player will have to constantly change

const bet = 100;




class TheGame {
    constructor() {
        this.player = new User();
        this.dealer = new User();
        this.deck = [
            {k: "AC", v: 11}, {k: "2C", v: 2}, {k: "3C", v: 3}, {k: "4C", v: 4}, {k: "5C", v: 5}, {k: "6C", v: 6},{k: "7C", v: 7}, {k: "8C", v: 8}, {k: "9C", v: 9}, {k: "10C", v: 10}, {k: "JC", v: 10}, {k: "QC",v: 10}, {k: "KC", v: 10},
            {k: "AH", v: 11}, {k: "2H", v: 2}, {k: "3H", v: 3}, {k: "4H", v: 4}, {k: "5H", v: 5}, {k: "6H", v: 6},{k: "7H", v: 7}, {k: "8H", v: 8}, {k: "9H", v: 9}, {k: "10H", v: 10}, {k: "JH", v: 10}, { k: "QH", v: 10 }, {k: "KH", v: 10},
            {k: "AS", v: 11}, {k: "2S", v: 2}, {k: "3S", v: 3}, {k: "4S", v: 4}, {k: "5S", v: 5}, {k: "6S", v: 6},{k: "7S", v: 7}, {k: "8S", v: 8}, {k: "9S", v: 9}, {k: "10S", v: 10}, {k: "JS", v: 10}, {k: "QS", v: 10}, {k: "KS", v: 10},
            {k: "AD", v: 11}, {k: "2D", v: 2}, {k: "3D", v: 3}, {k: "4D", v: 4}, {k: "5D", v: 5}, {k: "6D", v: 6},{k: "7D", v: 7}, {k: "8D", v: 8}, {k: "9D", v: 9}, {k: "10D", v: 10}, {k: "JD", v: 10}, { k: "QD", v: 10 }, {k: "KD", v: 10}
        ];
    }

    shuffle(value) {
        let i;
        for (i = 0; i < value; i++) {
            this.deck.sort(() => Math.random() - 0.5);
        }
    }

    DealCards() {
        for (let i = 0; i < 2; i++) {
            this.player.hand = this.deck.pop();
            if (this.dealer.hand.length === 0) {
                this.dealer.hand = this.deck.pop();
            } else {
                this.dealer.BackOfCard = this.deck.pop();
            }

        }
    }

}
class User {


    constructor() {
        this._hand = [];
        this._BackOfCard = [];
        this._active = true;
    }

    get hand() {
        return this._hand;
    }

    set hand(card) {
        this._hand.push(card);
    }

    get score() {
        let score = 0;
        let aceCounter = []

        this.hand.forEach(card => {

            score += card.v;
            if (card.v === 11) {
                aceCounter.push(true)
            }

            return score;
        });

        if (score > 21) {
            switch (aceCounter.length) {
                case 1:
                    score -= 10
                    break;
                case 2:
                    score -= 10
                    if (score > 21) {
                        score -= 10;
                    }
                    break;
                case 3:
                    score -= 20
                    if (score > 21) {
                        score -= 10;
                    }
                    break;
                case 4:
                    score -= 30
                    if (score > 21) {
                        score -= 10;
                    }
                    break;
            }
        }
        return score;
    }

    get BackOfCard() {
        return this._BackOfCard;
    }

    set BackOfCard(card) {
        this._BackOfCard.push(card);
    }

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }
}


function start() {
    let gameModel;

    initial(false);


    let restart = document.getElementById("restartButton");
    restart.addEventListener("click", (() => {
        if (!gameModel.player.active) {
            initial();
        }
    }));


    let hit = document.getElementById("hitButton");
    hit.addEventListener("click", (() => {
        if (!gameModel.player.active) {
            return
        }

        let card = gameModel.deck.pop();
        gameModel.player.hand.push(card);

        cardVisualizer(gameModel.player);
        checkResult();
        TheScore();

    }));


    let stand = document.getElementById("standButton");
    stand.addEventListener("click", (() => {

        if (!gameModel.player.active) {
            return
        }

        gameModel.player.active = false;

        BackOfCard = gameModel.dealer.BackOfCard.pop();
        gameModel.dealer.hand.push(BackOfCard);


        for (let i = 0; i < gameModel.deck.length; i++) {
            if (gameModel.dealer.score <= 16 || gameModel.dealer.score < gameModel.player.score) {
                let card = gameModel.deck.pop()
                gameModel.dealer.hand.push(card);
            } else {
                break;
            }
        }

        cardVisualizer(gameModel.dealer);
        checkResult();
        TheScore();

    }));


    function initial(reset = true) {

        gameModel = new TheGame();
        gameModel.shuffle(4);
        gameModel.DealCards();

        if (!reset) {
            do {
                BalOfPlayer = prompt("Please Enter the balance you wish to bet,  each bet will be £100.");
                if (isNaN(Number(BalOfPlayer)) || BalOfPlayer < 100) {
                    BalOfPlayer = 0;
                    alert(" Error . The balance must be greater than or equal to 100, please re-enter the balance.");
                }
            } while (BalOfPlayer < 100)
        }

        if (BalOfPlayer >= 100) {
            BalOfPlayer -= bet;
        } else {
            initial(false);
        }

        setText("result", "Playing...");
        cardVisualizer(gameModel.player, false, true);
        cardVisualizer(gameModel.dealer);
        cardVisualizer(gameModel.dealer, true);

        if (gameModel.player.score === 21) {
            checkResult(true);
        }

        TheScore();
    }
    function cardVisualizer(entity, hidden = false, reset = false) {


        let dealerSelector = document.querySelector('.cards-list-dealer');
        let playerSelector = document.querySelector('.cards-list-player');


        if (reset) {
            dealerSelector.innerHTML = '';
            playerSelector.innerHTML = '';
        }



        let entityElement = document.createElement('img');
        entityElement.src = `static/BACK.png`


        if (!(hidden)) {

            if (entity === gameModel.player) {
                playerSelector.innerHTML = '';
            }
            if (entity === gameModel.dealer) {
                dealerSelector.innerHTML = '';
            }
            entity.hand.forEach(card => {
                let entityElement = document.createElement('img');
                entityElement.src = `static/cards/${card.k}.png`
                entityElement.width = 200;
                entityElement.height = 250;

                if (entity === gameModel.player) {
                    playerSelector.appendChild(entityElement)
                } else {

                    dealerSelector.appendChild(entityElement)
                }
            });

        } else {
            dealerSelector.appendChild(entityElement)
        }
    }



    function checkResult(blackjack = false) {
        let dealerWin = false;

        if (blackjack) {
            gameModel.player.active = false;
            BackOfCard = gameModel.dealer.BackOfCard.pop()
            gameModel.dealer.hand.push(BackOfCard)
            cardVisualizer(gameModel.dealer)
            historyPlayer.win += 1;
            historyDealer.lose += 1;
            winBet(false, true);
            TheScore()
            return
        }



        if (gameModel.dealer.score >= gameModel.player.score && gameModel.dealer.score <= 21) {
            dealerWin = true;
        }

        if (gameModel.player.score > 21) {
            dealerWin = true;
            gameModel.player.active = false;
            BackOfCard = gameModel.dealer.BackOfCard.pop();
            gameModel.dealer.hand.push(BackOfCard);
            cardVisualizer(gameModel.dealer);

        }



        if (!(gameModel.player.active)) {
            if (dealerWin) {
                setText("result", "The Dealer has won this round!")    // If the dealer the wins add to their total wins
                historyDealer.win += 1;                             //Also add a loss to the user
                historyPlayer.lose += 1;
                winBet(true, false);            //
                TheScore();
            } else {
                setText("result", "The User has won this round!")
                historyPlayer.win += 1;
                historyDealer.lose += 1;
                winBet(false, false);
                TheScore();
            }

        }
    }




    function winBet(dealerWin = false, blackjack = false) {
        if (blackjack) {
            BalOfPlayer += bet * 2.5;
        } else {
            if (!dealerWin) {
                BalOfPlayer += bet * 2;
            }

        }
    }

    function TheScore() {
        setText("PlayerScore", gameModel.player.score)
        setText("DealerScore", gameModel.dealer.score)
        setText("winDealer", `Win: ${historyDealer.win}`);
        setText("loseDealer", `Lose: ${historyDealer.lose}`);
        setText("winPlayer", `Win: ${historyPlayer.win}`);
        setText("losePlayer", `Lose: ${historyPlayer.lose}`);
        setText("BalOfDealer", `Balance: 999999 £`);
        setText("BalOfPlayer", `Balance: ${BalOfPlayer} £`);
    }
}

function setText(id, text) {
    document.getElementById(id).innerHTML = text;
}
