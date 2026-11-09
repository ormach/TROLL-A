# Game logic
- Deck size: 10 cards?
- Player life: 30

# Fatigue
- Player takes 1 damage if during draw phase there are no cards to draw.
- Fatigue damage is increased by 1 each time fatigue is triggered.

# Game phases
1. Draw phase: Draw 4 cards, if turn is greater than 1, draw 1.
2. Action phase: Choose 1 card based on priority and play it.
3. Combat phase: Summoned units trade damage.
4. End phase.

# Activation speed 
- If two cards are activated at the same time, card with lower <stat> activates first.
- Same speed resolution: If two cards of the same speed are activated at the same time, loosing player activates first.
- If both players have the same life, activation order is chosen randomly.