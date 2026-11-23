class Card{
    constructor(arg){

        // console.log(arg);
        this.arg = arg

        //Pick random card
        if(arg.cardId === undefined){
            console.log("Unknown card id");
            return 
        }
        else {
            this.referenceObj = g.cardsRef[arg.cardId]
        }

         
        this.cardId = this.referenceObj.cardId
        // console.log(this.referenceObj);
        
        //Assign actions from action reference object
        let keys = ["ac1","ac2","ac3"]
        keys.forEach(key => {this[key] = cardEffectRef[key + this.cardId]})
        
        g.board.push(this)
        this.genHtml()
    }

    genHtml(){
        
        if(this.arg.mode === "selection"){
            
            //Get 2 image cards
            let imgCard = document.createElement('div')
            imgCard.classList.add('card')   
            imgCard.classList.add('card', 'cardImg', 'selectionCard')
            
            //Append
            cardContainer.append(imgCard)

            // console.log(g.cardsRef[cardRef.cardId]);
            
            //Adjust image card for wide images
            if(this.referenceObj.wide === "y"){
                imgCard.innerHTML = `
                    <div class="imgContainer wide" style="background-image: url('./img/card/id=${this.cardId}.jpg');"></div>
                `
            }
            else{
                imgCard.innerHTML = `
                    <div class="imgContainer" style="background-image: url('./img/card/id=${this.cardId}.jpg');"></div>
                `
            }

            //ACTIONS: Adds on click
            imgCard.addEventListener("click", () => { //click => onclick event, not listener id
    
                console.log('Listener triggered: card selected.');
                
                //Reroll all dice
                g.rerollMultiple()

                //Show next card
                g.genEventScreen({cardId: this.cardId})
            })
        }
        else{
            let cardRef = this.referenceObj
            // console.log(card);



        //IMG CARD
            let imgCard = document.createElement('div')
            imgCard.classList.add('card', 'cardImg')
            
            //Append
            cardContainer.append(imgCard)
            
            if(g.cardsRef[cardRef.cardId].wide === "y"){
                imgCard.innerHTML = `
                    <div class="imgContainer wide" style="background-image: url('./img/card/id=${cardRef.cardId}.jpg');"></div>
                `
                //Shift animation
                runAnim(imgCard.childNodes[1], "imgShift")
            }
            else{
                imgCard.innerHTML = `
                    <div class="imgContainer" style="background-image: url('./img/card/id=${cardRef.cardId}.jpg');"></div>
                `
            }



        //TEXT CARD
            let textCard = document.createElement('div')
            textCard.classList.add('card', 'cardText')

            //CARD HTML
            textCard.innerHTML = `
                <div class="hContainer">
                    <h1>${cardRef.title.toUpperCase()}</h1>
                </div>
                <p class="cardBody">${cardRef.description}</p>

            `
            //Append
            el('cardContainer').append(textCard)
            


            //Only add actions with content
            let keys = ["ac1","ac2","ac3"]
            keys.forEach(key => {   
    
                //Set icons for repeatable actions
                let ico = "arrow"     
                if(cardRef.repeatable !== "" && cardRef.repeatable[key[2] - 1] === "y"){                
                    ico = "repeatable"
                }
    
                if(cardRef[key] !== ""){
                    textCard.insertAdjacentHTML("beforeend", `
                        <button id="${key}" class="action">
                            <img src="./img/ico/${ico}.png">
                            <h2>${cardRef[key + "title"]}</h2>
                            <p>${cardRef[key]}</p>
                        </button>
                    `)

                    //EVENT LISTENER ACTIONS: Adds on click
                    el(key).addEventListener("click", () => { //click => onclick event, not listener id
                        
                        console.log('Listener triggered: selection: ' + key);
    
                        //Remove card from array after reveal
                        delete g.cardsRef[this.cardId];
                        
                        this[key]()
                    })
                }
            })
  
        }

        g.updateUI()
    }

}

function generic(){
    console.log('Action: Return');
    new Die
    g.proceed() //Proceed
}

let cardEffectRef = {
    //Kali
        // ac1anubis(){
            
        // },
        // ac2anubis(){
        //     generic()
        // },
        // ac3anubis(){
        //     g.rerollMultiple(3)
        // },

    //bouncer
        ac1bouncer(){
            g.rerollMultiple()
            
            g.checkDmg()
            g.checkDmg()
            
            g.proceed()
        },
        ac2bouncer(){
            g.rerollMultiple(1)

            if(
                g.rollValues().some(value => value === 1)
                && 
                g.rollValues().some(value => value === 2)
                && 
                g.rollValues().some(value => value === 3)
            ){
                g.loseDice({val: 2})
            }
            else{
                g.gainDice(2)
            }
            
            g.proceed()
        },
        ac3bouncer(){
            let roll = g.rerollMultiple(1)

            g.gainCoins(roll)

            if(g.coins > 9){
                g.gainDice()
            }
        },

    //tunnel
        ac1tunnel(){
            const rolls = g.rollValues();

            if(
                [1, 2, 3].some(value => !rolls.includes(value)))
            {
                let val = Math.round(g.life/2)
                g.loseLife(val)
            }
            
            g.proceed()
        },
        ac2tunnel(){
            g.gainDice(2)
            g.proceed()
        },
        ac3tunnel(){
            g.rerollMultiple(2)
        },

    //casino
        ac1casino(){
            let rolls = g.rerollMultiple()
            console.log(rolls);
            

            g.dice.forEach(die => {
                if(die.value === 2){
                    g.gainCoins(1)
                    console.log('coin');
                    
                }
                else if(die.value === 3){
                    g.gainLife(1)
                }
                else if(die.value === 4){
                    g.gainDice()
                    console.log('+die');
                }
                else if(die.value === 5){
                    g.loseDice({mode:"n", val:1})
                    console.log('-die');
                    
                }
            })
            g.proceed()
            
        },
        ac2casino(){
            generic()
        },
    
    //loot
        ac1loot(){
            if(
                g.rollValues().some(value => value === 2)
                && 
                g.rollValues().some(value => value === 4)
            ){
                g.addItem()
                g.proceed()
            }
        },
        ac2loot(){
            g.gainDice(2)
            g.addItem()
            g.proceed()
        },
        ac3loot(){
            g.rerollMultiple(2)
        },

    //rest
        ac1rest(){
            g.addItem()
            g.proceed()
        },
        ac2rest(){
            g.loseDice()
            g.proceed()
        },
        ac3rest(){
            g.gainLife(4)
            g.proceed()
        },

    //shop
        ac1shop(){
            if(g.pay(8)){
                g.addItem(2)
                g.proceed()
            }
        },
        ac2shop(){
            g.gainDice(1)
            g.addItem(1)
            g.proceed()
        },
        ac3shop(){
            g.rerollMultiple()
            g.gainCoins(g.dice.length)
        },
  
    //raijin
        ac1raijin(){
            let roll = g.rerollMultiple(1)

            if(roll.some(value => [1,2].includes(value))){
                g.gainDice(3)
            }

            g.proceed() //Proceed
        },
        ac2raijin(){generic()},

    //medusa
        ac1medusa(){
            let roll = g.rerollMultiple(1)

            if(roll.some(value => [2,3].includes(value))){
                g.gainDice(1)
            }
            else if(roll.some(value => [4,5].includes(value))){
                g.proceed() //Proceed
            }
        },
        ac2medusa(){generic()},

    //kali
        ac1kali(){
            let dmg1 = true
            let dmg2 = true
            g.dice.forEach(die => {
                if(die.value === 3){
                    dmg1 = false
                }
                else if (die.value === 5){
                    dmg2 = false
                }
            })

            if(dmg1){g.loseLife(3)}
            if(dmg2){g.loseLife(5)}

            g.proceed() //Proceed
        },
        ac2kali(){
            generic()
        },
        ac3kali(){
            g.rerollMultiple(3)
        },

    //anubis
        ac1anubis(){
            let sum = 0
            g.dice.forEach(die => {
                if((die.value * 1) % 2 !== 0){
                    sum += die.value
                }
            })

            if(sum > 5){sum = 5}

            g.loseLife(sum)
            g.proceed() //proceed
        },
        ac2anubis(){
            generic()
        },
        ac3anubis(){
            g.rerollMultiple(3)
        },

    //door
        ac1door(){
            if(
                g.rollValues().some(value => value === 2)
                && 
                g.rollValues().some(value => value === 4)
            ){
                g.proceed()
            }
        },
        ac2door(){
            g.gainDice(2)
            g.proceed()
        },
        ac3door(){
            g.rerollMultiple(3)
        },

    //elevator
        ac1elevator(){
            if(g.rollValues().some(value => value === 2)){
                
                g.dice.forEach(die => {
                    if(die.value === 2){
                        die.delete()
                        return
                    }
                })


                g.proceed()
            }
        },
        ac2elevator(){
            generic()
        },

    //vent
        ac1vent(){
            g.rerollMultiple()

            g.checkDmg()
            g.checkDmg()

            g.loseDice({mode:"odd"})

            g.proceed()
        },
        ac2vent(){
            generic()
        },

    //explosive
        ac1explosive(){
            let roll = g.rerollMultiple(1)

            if(isOdd(roll)){
                g.gainDice(roll)
            }
            else{
                g.loseDice({mode:"n", val: roll})
            }

            g.proceed()
        },
        ac2explosive(){
            generic()
        },

    //monster
        ac1monster(){
            if(g.totalRollValue() < 15){
                g.loseLife(5)
            }

            g.proceed()
        },
        ac2monster(){
            g.rerollMultiple()
        },
        ac3monster(){
            g.gainDice()
        },
}