# ❌⭕ Tick-Tac-Toe

A Tic Tac Toe game built using JavaScript, HTML, and CSS as part of <a href="https://www.theodinproject.com/" alt="The Odin Project">The Odin Project</a> curriculum.

## 📚 About the Project 

This is a single page tic tac toe game split into *three screens*. The *first* is a form where the player sets up the game settings for the match (opponent type, difficulty, names, and marks). The *second* is a brief loading screen that transitions into the *third* screen which is the game board itself where the match is actually played.

### ✨ Features

- **AI Opponent** -- Uses the minimax algorithm with alpha-beta pruning, with adjustable difficulty
- **Difficulty Selection** -- Players can set the AI's difficulty from Easy to Expert when playing against the bot. ( *game is solvable with normal minmax so may not make a difference* )
- **Mode Selection** -- Players can choose **Player vs Player** or **Player vs AI** mode.
- **Rounds** -- Matches are played over 4 rounds, with running win/loss/streak tracking for both players.
- **Screen Transitions** -- Animated transitions between the landing page, loading screen, and game board. Other animations include the round end scenarios, which highlights the winning line or draw before moving to the next round, as well as the animation used when placing a mark on a square.
- **Audio** -- Sound effects for placing marks on the board and for notifying the player when a round has ended.

### 🎥 Live Previews 

#### 🤖 Player Vs Bot
https://github.com/user-attachments/assets/9208b4d6-84bc-4e6e-9709-fa54a5138317

#### 👥 Player Vs Player
https://github.com/user-attachments/assets/5c0a831d-630a-431a-bcd9-823b673665ef

### 🧱 Built With 

- <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
- <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
- <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript">

### 💭 Closing Remarks 

This project was a lot for me. Originally, I was going to implement a normal two player game. However, I wanted to challenge myself so I decided to add an AI component. It took a while to understand the algorithm behind it and actually implement it into the project.

When it came to the UI, it required tracking all the moving parts and understanding how they fit together since I incorporated animated transitions between screens and used the data from the landing page's form to setup the game.

Also, it required keeping the internal game state and the UI in sync. This was became tricky animations and audio were involved since a few things could visually lag behind what had already happened internally. 

It took a while to work through, but I managed.

> [!NOTE]
> `minmaxNotes.md`is a personal reference file I put together while researching the minimax algorithm for the AI. I didn't want to forget the concepts, and I can potentially reuse them in future projects if needed. It walks through the process step by step from understanding basic minmax to alpha beta pruning to the evaluation logic. It isn't meant to serve as any kind of documentation but feel free to look through it. 


## 📦 Getting Started 

If you want to set this project up locally on your machine, please follow the directions below.

### 📋 Instructions

1. Clone the repo

```
git https://github.com/Sivil07/Tick-Tac-Toe.git
```

2. Enter the directory

```
cd Tick-Tac-Toe
```

3. Open in VS Code

```
code .
```

4. Open with Live Preview

- Right click - `index.html`
- Click _Show Preview_

## 🙏 Acknowledgements

The two pieces of audio are used from <a href="https://pixabay.com/" alt="Pixabay">Pixbay</a>
- <a href="https://pixabay.com/sound-effects/film-special-effects-level-complete-394515/" alt="RoundCompleteAudio">RoundCompleteAudio</a>
- <a href="https://pixabay.com/sound-effects/film-special-effects-button-394464/" alt="placeMarkAudio">placeMarkAudio</a>
