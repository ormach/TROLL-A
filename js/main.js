class Game {
    constructor(args){
        this.life = config.life
        this.coins = config.coins
        this.maxFloor = config.maxFloor

        this.dice = []
        this.cardsRef
    }


    //Dice
        clearDice(){
            g.dice = []
            el("dice").innerHTML = ``
        }
        mergeDice(arg){
            let newRollValue = arg[0].value + arg[1].value
            if (newRollValue > 6){newRollValue = 6}
            
            //Delete initial ones
            arg.forEach(die =>{
                die.delete()
            })

            //Generate a new one with combined roll value
            new Die({value:newRollValue})
        }
        addMultipleDice(quant, args){
            for(let i = 0; i < quant; i++){
                new Die(args)
            }
        }
        deleteRandomDie(){
            rarr(g.dice).delete()
        }
        rerollMultiple(n){

            if(n === 0){
                g.dice.forEach(die => {
                    die.reroll()  
                })
            } else {
                let rolls = []

                if(n > g.dice.length){
                    n = g.dice.length
                }

                for (let i = 0; i < n; i++) {
                    let die = rarr(g.dice)
                    die.reroll()
                    rolls.push(die.value);
                }
                console.log(rolls);
                
            }
        }


    //Game
    startGame(){
        this.maxFloor = this.cardsRef.length
        this.newCard()
        
        //Starting dice
        for (let i = 0; i < config.startingDice; i++) {
            new Die()
        }
    }
    updateUI(){
        el('lifeUi').innerHTML = g.life
        el('coinsUi').innerHTML = g.coins
        el('floorUi').innerHTML = `${g.maxFloor - g.cardsRef.length}/${g.maxFloor}`
    }


    //Cards
    newCard(){
        //Show no cards
        if(g.cardsRef.length < 1){
            el('card-content').innerHTML = `
                <h1>No more cards</h1>
            `
        }
        //Reveal a card
        else{
            let card = rarr(this.cardsRef)
            // console.log(card);

            el('cardImg').innerHTML = `
                <div class="imgContainer" style="background-image: url('../img/id=${card.imgid}.jpg');"></div>
            `
    
            //Only add actions with content
            let actions = ""
            let keys = ["ac1","ac2","ac3"]
            keys.forEach(key => {                
                if(card[key] !== ""){
                    actions += `
                        <button class="action" onclick="g.newCard(), new Die()">
                            <img src="./img/ico/diamond.png">
                            <h2>${card[key + "title"]}</h2>
                            <p>${card[key]}</p>
                        </button>
                    `
                }
            })
            
            //CARD HTML
            el('cardContent').innerHTML = `
                <div class="hContainer">
                    <h1>${card.title}</h1>
                </div>
                <p class="cardBody">${card.description}</p>
    
                ${actions}
            `
    
            //Remove card from array after reveal
            removeFromArr(g.cardsRef, card)

            this.updateUI()
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
            () => g.startGame() //Starts game after CSV
        )
        .catch(error => console.error('Error:', error))