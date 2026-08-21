# Tick-Tac-Toe

A Tic Tac Toe game built using JavaScript, HTML, and CSS as part of The Odin Project curriculum.

## About the Project 

This is a single page tic tac toe game split into three screens. The first is a form where the player sets up the game settings for the match (opponent type, difficulty, names, and marks). The second is a brief loading screen that transitions into the third screen which is the game board itself where the match is actually played.

### Features

- **AI Opponent** -- Uses the minimax algorithm with alpha-beta pruning, with adjustable difficulty
- **Difficulty Selection** -- Players can set the AI's difficulty from Easy to Expert when playing against the bot. ( *game is solvable with normal minmax so may not make a difference* )
- **Mode Selection** -- Players can choose (**Player vs Player**) or **Player vs AI** mode.
- **Rounds** -- Matches are played over 3 rounds, with running win/loss/streak tracking for both players.
- **Screen Transitions** -- Animated transitions between the landing page, loading screen, and game board. Other animations include round end sequences that highlight the winning line or a draw before moving into the next round.
- **Audio** -- Sound effects for placing marks on the board and for notifying the player when a round has ended.

### Live Previews 

### Built With 

### Closing Remarks 

This project was a lot for me. Originally, I was going to implement a normal two player game. However, I wanted to challenge myself so I decided to add an AI component. It took a while to understand the algorithm behind it and actually implement it into the project.

When it came to the UI, it required tracking all the moving parts and understanding how they fit together since I incorporated animated transitions between screens and used the data from the landing page's form to setup the game.

Also, it required keeping the internal game state and the UI in sync. This was became
tricky animations and audio were involved since a few things could visually lag behind what had already happened internally. 

It took a while to work through, but I got there.

## Getting Started 

If you want to set this project up locally on your machine, please follow the directions below.

### Instructions

1. Clone the repo

```
git clone https:
```

2. Enter the directory

```
cd M
```

3. Open in VS Code

```
code .
```

4. Open with Live Preview

- Right click - `index.html`
- Click _Show Preview_

## Acknowledgements

The two pieces of audio are used from Pixabay 