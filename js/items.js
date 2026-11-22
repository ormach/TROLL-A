class Item {
    constructor(arg){
        this.refObj = cloneArr(g.itemsRef[rarr(Object.keys(g.itemsRef))])
        this.itemId = this.refObj.itemId
        this.fx = itemEffectRef["fx" + this.itemId]

        g.items.push(this)
        this.genHtml()        
    }

    genHtml(){
        let item = document.createElement('div')
        item.classList = "item"
        item.dataset.tooltip = this.refObj.effect;
        item.innerHTML = `
            <img src="./img/item/item.png" alt="">
        `
        el('items').append(item)
        this.htmlElem = item

        //EVENT LISTENER ACTIONS: Adds on click
        item.addEventListener("click", () => { //click => onclick event, not listener id
            
            console.log('Listener triggered: FX' + this.itemId);

            //Remove item from array after reveal
            // delete g.itemsRef[this.itemId];

            this.fx()
            this.delete()
        })
    }

    delete(){
        this.htmlElem.remove()
        removeFromArr(g.items, this)
    }
}

let itemEffectRef = {
    //Bandages
    fx1(){
        g.gainLife(4)     
    },
    //Aspirin
    fx2(){
        g.gainLife(g.dice.length)     
    },
    //Antiseptic
    fx3(){
        g.gainLife(g.floor)     
    },
    //Adrenaline pen
    fx4(){
        g.addDice(1)
        g.gainLife(6)     
    },
    //Booze
    fx5(){
        g.deleteDice({mode:'duplicate'})   
    },
    //Coffee
    fx6(){
        let diff = g.dice.length - 5

        if(diff > 0){
            g.deleteDice({mode:"n", val:diff})
        }  
        else{
            g.addDice(diff * -1)
        }
    },
    //Glue
    fx7(){
        g.rerollMultiple(1)   
    },
    //Tape
    fx8(){
        g.rerollMultiple(0)    
    },
    //Knife
    fx9(){
        g.deleteRandomDie()
    }
}