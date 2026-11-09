//Generate card objects
//Gen decks
//PVP 2 decks


class Game {
    constructor(args){
        this.cardsRef
        
        this.playerDeck 
        this.enemyDeck 

        this.playerHand
        this.enemyHand

        this.playerGold
    }

    startGame(){
        console.log(g.cardsRef); 
        removeFromArr(g.cardsRef, g.cardsRef[0])
        this.newCard()

    }

    newCard(){
        if(g.cardsRef.length < 1){
            el('card-content').innerHTML = `
                <h1>No more cards</h1>
            `
        }
        else{
            let card = rarr(this.cardsRef)
            console.log(card);

            el('card-img').innerHTML = `
                <img src="./img/id=${card.imgid}.jpg">
            `
    
            el('card-content').innerHTML = `
                <h1>${card.name}</h1>
                <p class="cardBody">${card.body}</p>
    
                <p class="action">${card.action1}.</p>
                <p class="action">${card.action2}.</p>
                <p class="action">${card.action3}.</p>
            `
    
            removeFromArr(g.cardsRef, card)
        }
    }
}


let g = new Game

//Fetch csv file, parse to JSON, assign it to ref obj
    fetch('../data/cards.csv')
        .then(response => response.text())
        .then(
            csvText  => {
                g.cardsRef = JSON.parse(csvJSON(csvText))
                return g.cardsRef
            }
        )
        .then(
            () => g.startGame()
        )
        .catch(error => console.error('Error:', error))