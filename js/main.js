class Game {
    constructor(args){
        this.life = config.life
        this.coins = config.coins
        this.maxFloor = config.maxFloor
        this.floor = 0

        this.board = []
        this.dice = []
        this.items = []

        this.cardsRef
        this.itemsRef
    }

    //Game handler
        startGame(){

            this.maxFloor = Object.keys(this.cardsRef).length

            this.genSelectionScreen()
            
            //Starting dice
            for (let i = 0; i < config.startingDice; i++) {
                new Die()
            }
            //Starting items
            for(let i = 0; i < config.startingItems; i ++){
                new Item()
            }
        }
        updateUI(){
            el('lifeUi').innerHTML = g.life
            el('coinsUi').innerHTML = g.coins
            g.floor = g.maxFloor - Object.keys(this.cardsRef).length
            el('floorUi').innerHTML = `${g.floor}/${g.maxFloor}`

            // console.log("UI updated.");
            
        }

    //Screens
        proceed(){
            this.genSelectionScreen()
        }
        genSelectionScreen(){
            el('cardContainer').innerHTML = ""
            g.board = []

            let selectedCards = Object.keys(this.cardsRef)
            shuffle(selectedCards)

            for(let i = 0; i < config.eventSelectionCards; i++){
                new Card({
                    cardId: selectedCards[i],
                    mode: "selection"
                })
            }
        }
        genEventScreen(arg){
            el('cardContainer').innerHTML = ""
            g.board = []

            if(arg === undefined){
                new Card({}) 
            }
            else{
                new Card({cardId: arg.cardId})
            }

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
        addDice(quant, args){
            for(let i = 0; i < quant; i++){
                new Die(args)
            }
        }
        
        rerollMultiple(n){

            if(n === 0){
                g.dice.forEach(die => {
                    die.reroll()  
                })
            } else {
                
                //Limit rerolls to number of dice on board
                if(n > g.dice.length){
                    n = g.dice.length
                }
                
                let rolls = []
                shuffle(g.dice)

                for (let i = 0; i < n; i++) {
                    g.dice[i].reroll()
                    rolls.push(g.dice[i].value);
                }

                console.log(rolls);
                return rolls
            }

            this.updateUI()
        }
        rollValues(){
            let rolls = []
            g.dice.forEach(die => {
                rolls.push(die.value)
            })

            return rolls
        }
        totalRollValue(){
            let rolls = 0
            g.dice.forEach(die => {
                rolls += die.value
            })

            return rolls
        }

        //Remove
        deleteRandomDie(){
            rarr(g.dice).delete()
        }
        deleteDice(arg){
            if(arg.mode === "even"){
                this.dice.slice().forEach(die => {
                    if(die.value % 2 === 0){
                        die.delete()
                    }
                })
            }
            else if(arg.mode === "odd"){
                this.dice.slice().forEach(die => {
                    if(die.value % 2 !== 0){
                        die.delete()
                    }
                })
            }
            else if(arg.mode ==="n"){
                const count = Math.max(0, Math.min(arg.val, this.dice.length));
                const diceToDelete = shuffle(this.dice.slice()).slice(0, count);
                diceToDelete.forEach(die => die.delete());
            }
            else if(arg.mode === "duplicate"){
                console.log(1);
                
                let diceValues = []

                this.dice.slice().forEach(die => {
                    if(diceValues.includes(die.value)){
                        die.delete()
                    }
                    else{
                        diceValues.push(die.value)
                    }
                })
            }
        }


    //Game logic
        loseLife(n){
            this.life -= n

            //Life change animation
            if(n > 0){
                runAnim( el('lifeUi') , "statChange" )
            }

            console.log(`Life lost: ${n}`);
            
        }
        gainLife(n){
            this.life += n

            //Life change animation
            if(n > 0){
                runAnim( el('lifeUi') , "statChange" )
                g.updateUI()
            }

            console.log(`Life gained: ${n}`);
        }
    
    //Coins
        gainCoins(n){
            this.coins += n
            console.log(`Coins added: ${n}`)
            runAnim(el('coinsUi') , "statChange" )
            this.updateUI()

        }
        loseCoins(n){
            this.coins = Math.max(this.coins - n, 0)
            runAnim(el('coinsUi') , "statChange" )
            this.updateUI()

        }
        pay(n){
            if(this.coins >= n){
                this.loseCoins(n)
                this.updateUI()
                return true
            }
            else{
                console.log('Not enough coins.')
                return false
            }
        }

    //Items
        addItem(quant, arg){
            for(let i = 0; i < quant; i++){
                new Item(arg)
            }
        }

}



let g = new Game



//Fetch csv file, parse to JSON, assign it to ref obj
    Promise.all([
        fetch('../data/cards.csv').then(response => response.text()),
        fetch('../data/items.csv').then(response => response.text())
    ])
    .then(([cardsCsv, itemsCsv]) => {
        const cards = JSON.parse(csvJSON(cardsCsv));
        const items = JSON.parse(csvJSON(itemsCsv));

        //Converts array of obj to obj
        g.cardsRef = Object.fromEntries( 
            cards
            .filter(card => card.hide !== "y") //removes hide=y
            .map(item => [item.cardId, item]) //converts array to object
        )

        //Converts array of obj to obj
        g.itemsRef = Object.fromEntries( 
            items
            .filter(item => item.hide !== "y") //removes hide=y
            .map(item => [item.itemId, item]) //converts array to object
        )

        g.startGame()
    })
    .catch(error => console.error('Error:', error))