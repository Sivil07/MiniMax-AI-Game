# Notable Issues and How They Were Solved

A list of notable problems I ran into and how they were solved

## State Drift Between Internal Game State and UI Rendering

**Issue**

In bot mode, the on screen player turn indicator sometimes showed the wrong player flashing the bot's name when it should've shown the human's, or vice versa.

When it came to the turn indicator in the bot mode, the on-screen "Player's Turn" indicator was showing the wrong player at the wrong moment. Sometimes it flashed the bot's name at a point where it should've said the human's, or vice versa. 

**Why it happened**

`GameMasterModule.playAI()`updates the game state immediately: it applies the bot's move, checks for a winner, and calls `switchPlayers()` right away. However, I intentionally delayed the rendering of the bot’s move by one second `setTimeout(..., 1000)` to simulate thinking time.

This created a mismatch between internal state and visual state.

My turn indicator logic ran on each mark’s `animationend` event. By the time the human’s mark finished animating, the bot’s move had already been applied internally even though it hadn’t rendered yet. So calling `GameMasterModule.getActivePlayer()` at that moment returned the future active player, not the one the UI was currently showing.

Here's a sequence of events:

1. Human clicks -> `applyMove()`runs -> `switchPlayers()` fires once -> activePlayer = bot player.
2. Because it's now the bot's turn, `playAI()`runs immediately. its own `applyMove()` runs -> `switchPlayers()`fires again -> activePlayer = human player
3. Once the human's mark animation finishes, it requests the the new active player and gets the human player since the bot's turn completed in the internal game. But visually, the bot hasn't moved yet. This leads the wrong answer for the rendering.

**The fix**

 Instead of always access the immediate active player with `GameMaster.Module.getActivePlayer()`during render time, I got ahold of the player that will be active after the in the next turn inside `applyMove()`, immediately after `switchPlayers()` runs. That snapshot (`nextPlayerName`, `nextPlayerMark`) is returned with the move result and used by the UI to signal the next player's turn. Using the `GameMasterModule.getActivePlayer()`became unusable when needing to acquire the future player.

**General Idea**

When artificial delays were introduced, any function that read live game state like `getActivePlayer()`became unreliable because the internal state could already have advanced past what the UI was currently showing

So whenever a change in the internal state occurred, snapshots of those changes were required to be passed to the UI so those changes can be recorded. 

## Blind Toggles vs Explicit State Control

**Issue**

In Player vs Player mode, the board locked and unlocked correctly.  Clicking a square disabled further clicks until that mark finished animating then clicking was enabled again. 

However, I could click a second square before the bot's move had rendered in the Player vs Bot mode. Sometimes this ended up with what looked like duplicate or out of order marks appearing on the board.

**Why it happened**

The `togglePreventClick()`did not use a boolean flag and simply add and removed the class responsible for preventing board interaction. This approach only works when a single code path ever touches this function because in that situation "flip whatever the current value is" reliably produces the intended opposite state

However, it was not enough with the AI's turn. Multiple points within the flow needed to set the class explicit. Some include the human's click (which should lock the board), the human's mark finishing its animation (which should unlock only if no bot move is pending), and the bot's mark finishing its animation later (which should definitely unlock).

A blind toggle can't tell which of those situations it's responding to. It just flips the class regardless of the situation which led to incorrect lock/unlock behavior.


**The fix:** 

Three parts.
- Change `togglePreventClick()` to accept a boolean, so whenever it's called the state can be explicitly controlled instead of relying on whatever the class happens to be at that moment.

```js
// UtilityHandler.js
const togglePreventClick = (element, shouldPrevent) => {
    element.classList.toggle("prevent-click", shouldPrevent)
}
```

- Introduce a `waitingForAIRender`flag, set to `true` right when the bot's move is triggered and set back to `false` only once the bot's move has actually rendered. The unlock logic checks this flag before unlocking. So even though the human's mark animation finishes first and tries to unlock, it correctly stays locked because it knows a bot render is still pending.

```js
// GameScreen.js

// Extra Code...

let waitingForAIRender = false;

// Extra Code...

board.addEventListener("click", (e) => {
    const element = e.target;

    const humanResult = GameMasterModule.playMove(element.dataset.row, element.dataset.col);
    const isAiTurn = processMove(humanResult);

    if (isAiTurn) {
        waitingForAIRender = true;
        const aiResult = GameMasterModule.playAI();
        setTimeout(() => {
            processMove(aiResult);
            waitingForAIRender = false;
        }, 1000)
    }
});
```

- Unlocking the board happens through `allowBoardInteraction()`, which checks the flag before unlocking. Even if the human's animation finishes first and tries to unlock the board, it stays locked until the AI's render is complete.

```js
// GameScreen.js
const allowBoardInteraction = () => {
    if (!waitingForAIRender) {
        UtilityHandlerModule.togglePreventClick(board, false)
    }
}
```

- And ultimately, this logic is used inside the `animationend` event for both the human and AI turn

```js
board.addEventListener("animationend", (e) => {
    if (e.animationName === "animateMark") {
        renderMoveResult()
        setActivePlayerColor(moveResult.nextPlayerMark)
        allowBoardInteraction(); // Used Here
        return;
    }

    // Extra Code...
});
```

**General Idea**

A toggle that doesn't take an explicit boolean is only safe when exactly one code path ever calls it. Once multiple independently timed parts of the system need to update the same class, flipping the current value is no longer viable. You must pass the intended state explicitly.

## Keeping Return Shapes Consistent Across Shared Function Calls

**Issue**

When I modified `WinDetectionModule.isWinnerFound()`, the AI's decision making broke and it stopped playing to win.

**Why it happened**

When I added the yellow highlight effect for winning squares, I had to change the return value from a simple boolean to a full result object so I could access the exact coordinates that formed the winning line.

Here's the function that determines whether a player has won and returns the result

```js
// WinDetectionModule.js

const isWinnerFound = (mark, board) => {
    const horizontalResult = horizontalChecks(board, mark);
    const verticalResult = verticalChecks(board, mark);
    const diagonalResult = diagonalChecks(board, mark);

    if (horizontalResult.isWinner) return horizontalResult;
    if (verticalResult.isWinner) return verticalResult;
    if (diagonalResult.isWinner) return diagonalResult;

    return { 
        isWinner: false, 
        coordinates: null 
    };
};
```

The `WinDetectionModule.isWinnerFound()`used to return a plain boolean value but I updated it to return an object instead so I could know which squares to highlight gold when someone won. `GameMasterModule` was updated to match the change. But `AIModelModule.minMax()` also calls `isWinnerFound` never got updated. It was still doing:

```js
//AIModelModule.js  

if (WinDetectionModule.isWinnerFound(aiMarker, board)) return getWinningScore();
```

This condition was always evaluating to true because `isWinnerFound()`returns an object and the check for the object always returned true.

As a result, the AI treated every hypothetical board as an immediate win, even when no winning line existed.

Because of that, `minMax` kept returning something like "AI Wins" with the winningScore 20000 on the very first evaluation for every possible move. With every simulatedMove producing the same score, `findBestMove` never saw a reason to update `bestScore` beyond the first move it checked.

So the AI simply chose the first available square every turn and completely ignored the game tree and any strategy.

**The fix**

Updating the check to read the actual boolean off the object and match what`GameMasterModule` already did.

```js
// AiModelModule.js

if (WinDetectionModule.isWinnerFound(aiMarker, board).isWinner) return getWinningScore();

if (WinDetectionModule.isWinnerFound(humanMarker, board).isWinner) return -getWinningScore();
```

**General Idea** 

When two files independently call the same shared function, changing the function's shape in one place doesn't automatically break the other. But it can interpret the new returned value incorrectly unless it's own checks are updated as well.

 Any time a shared function's return value changes shape, it's worth checking every file that calls it. 

# Cascading Square Highlights with Delayed Execution

**Issue**

When implementing the square highlights using a for loop, all of the squares would glow at the same time instead of one after another.

The intended behavior was for the squares to highlight one after another. Essentially, creating a smooth cascading effect across the board.

**Why it happened**

 A normal for loop does not pause between iterations and runs from start to finished. As a result, all of the squares would be highlighted at the same time. 
 
 Since the CSS animations begin after the class is applied, and all classes were applied instantly, every square's animation started simultaneously.

**The fix**

```js
// GameScreen.js

const applyRoundEndSquareStyles = (coordinates, winnerFound, boardFull) => {
	// Extra code...
	animationSpeed = coordinates.length === 3 ? 300 : 100;
	// Extra code...
    for (let index = 0; index < coordinates.length; index++) {
        const [row, col] = coordinates[index];
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const squareContainer = square.parentNode;
        setTimeout(() => {
        // Extra code...
        }, index * animationSpeed);
    }
};
```

Use `setTimeout()` when applying the highlight classes so each square animates at a different time instead of all at once.

The crucial part is the delay:  `index * animationSpeed`

Multiplying the delay by the loop index gives every square a unique start time. Without this, all squares would receive their highlight class at the same moment, and cause all the animations to start immediately

**General Idea**

A for loop executes all of its iterations immediately. it doesn't pause or wait between steps. Even though the loop processes multiple squares, it does so in a single instant. To create the delayed effect, you need a way to schedule when each highlight should happen. 

`setTimout()`provides the scheduling and using`index * animationSpeed` gives each square a different delay.


# Tracking Move and Round State Through Asynchronous UI Updates

**Issue**

The UI depends on animations, delayed effects, and asynchronous updates. Because these actions run asynchronously, the game logic cannot execute in a continuous linear flow.

Without a way to preserve the state between these asynchronous operations, important information about a move or round would be lost before the UI has a chance to react.

**Why it Happened**

When an animation begins, the logic that needs to run afterward must wait until the animation finishes. This creates gaps in execution where the game state is temporarily unavailable. 

If the state isn’t stored somewhere, the UI cannot correctly determine whether the move resulted in a win, a draw or neither.

**The fix**

State changes made inside the internal game get released as a returned result object. This object is passed into variables defined in`GameScreen`. Later, these variables will be used during the asynchronous operations

Here's the process:

Step 1 - The internal game records what exactly happen during a round as a returned value

The internal game determines what happened during the move (win, draw, next player, coordinates, etc). It returns that information as a single result object.

Both the human turn and AI turn produce the same result object structure.

```js
// GameMasterModule.js

// Extra code...

const applyMove = (row, col) => {
    const result = GameBoardModule.placeSquare(row, col, getActivePlayer().getMark());
    const board = GameBoardModule.boardWithSquareValues();

    let turnFailed = false;
    let isWinnerFound = false;
    let isBoardFull = false;
    let currentActivePlayerMark = activePlayer.getMark();
    let currentActivePlayerName = activePlayer.getName();
    let coordinates;
    let nextPlayerName;
    let nextPlayerMark;

    const winResult = WinDetectionModule.isWinnerFound(getActivePlayer().getMark(), board);

    if (!result.success) {
        turnFailed = true;
    } else if (winResult.isWinner) {
        coordinates = winResult.coordinates;
        gameOver = true;
        isWinnerFound = true;
        recordWinLoss();
        getActivePlayer().updateStreak("win")
        getInactivePlayer().updateStreak("loss");
        console.log(`${getActivePlayer().getName()} won!`)
    } else if (GameConstraintsModule.isBoardFull(board)) {
        gameOver = true;
        isBoardFull = true;
        getActivePlayer().updateStreak("draw");
        getInactivePlayer().updateStreak("draw")
    } else {
        switchPlayers();
        nextPlayerName = getActivePlayer().getName();
        nextPlayerMark = getActivePlayer().getMark();
        console.log(`${getActivePlayer().getName()}'s turn.`)
    }

    GameBoardModule.displayBoard();

    const isAITurn = !gameOver && isAIOn && getActivePlayer() === playerTwo;

    return { turnFailed, isWinnerFound, isBoardFull, currentActivePlayerMark, isAITurn, row, col, coordinates, currentActivePlayerName, nextPlayerName, nextPlayerMark };
}

// Extra code..

const playMove = (row, col) => {
	if (gameOver && hasMoreRoundsAvailable()) {
		return { turnFailed: true }
	}

	if (gameOver && !hasMoreRoundsAvailable()) {
		return { turnFailed: true }
	}
	return applyMove(row, col)
}

// Extra code...

const playAI = () => {
	const board = GameBoardModule.boardWithSquareValues();
	const humanMarker = playerOne.getMark();
	const aiMarker = playerTwo.getMark();
	const [row, col] = AIModelModule.findBestMove(board, difficulty, aiMarker, humanMarker)
	return applyMove(row, col);
}
```

Step 2 - The UI stores the parts it will need later

The relevant pieces of the result are saved into `moveResult` and `roundOutcome`. These variables act as state snapshots that asynchronous UI functions can read later.

```js
// GameScreen.js

// Extra Code...
let roundOutcome;
let moveResult;   
// Extra Code...

const applyRoundEndSquareStyles = (coordinates, winnerFound, boardFull) => {
	// Extra Code...
    roundOutcome = { isWinner: winnerFound, isBoardFull: boardFull };
    // Extra Code...
};

// Extra Code...

const processMove = (result) => {
    const { turnFailed, isWinnerFound, isBoardFull, currentActivePlayerMark, isAITurn, row, col, coordinates, currentActivePlayerName, nextPlayerName, nextPlayerMark } = result
	// Extra Code...
	
    moveResult = { isWinnerFound, coordinates, isBoardFull, currentActivePlayerName, nextPlayerName, nextPlayerMark }

    // Extra Code...
}
```

Step 3 - The UI begins using the saved state inside different functions

Once the state has been stored, various UI functions start reading `moveResult` and `roundOutcome`to update the interface.

These functions rely entirely on the previously saved state to determine what to display, which buttons to highlight, and which player should act next.

```js
// GameScreen.js

// Extra Code...

const applyRoundEndButtonStyles = () => {
    const checkForEndGame =
        GameMasterModule.getGameOver() &&
        GameMasterModule.hasMoreRoundsAvailable();

    if (checkForEndGame) {
        UtilityHandlerModule.toggleEndGameButtonHighlight(endGame);
        UtilityHandlerModule.togglePulseEndGameButton(endGame);
        loadIntoGameControls();
    } else if (roundOutcome.isWinner) {
        UtilityHandlerModule.toggleWinButtonsHighlights(endGame);
        UtilityHandlerModule.toggleWinButtonsHighlights(nextRound);
        UtilityHandlerModule.togglePulseWinButtons(endGame);
        UtilityHandlerModule.togglePulseWinButtons(nextRound);
    } else if (roundOutcome.isBoardFull) {
        UtilityHandlerModule.toggleDrawButtonHighlights(endGame);
        UtilityHandlerModule.toggleDrawButtonHighlights(nextRound);
        UtilityHandlerModule.togglePulseDrawButtons(endGame);
        UtilityHandlerModule.togglePulseDrawButtons(nextRound);
    }
};

// Extra code...

const updateActivePlayer = () => {
    const activePlayerNode = document.querySelector("#player-turn");
    activePlayerNode.remove();
    loadIntoBoardSection(moveResult.nextPlayerName);
};

```

Step 4 - The stored state inside these function are used during the asynchronous events.

When the mark animation finishes,

The asynchronous event fires and the UI reads the previously stored state `moveResult` and `roundOutcome`to determine what should happen next.

This allows the UI to react correctly after the animations are complete.

```js
// GameScreen.js

// Extra Code...

board.addEventListener("animationend", (e) => {
    if (e.animationName === "animateMark") {
        renderMoveResult(); // moveResult used inside
        setActivePlayerColor(moveResult.nextPlayerMark); // moveResult used
        allowBoardInteraction();
        return;
    }

    roundEndAnimationCount++;

    const shouldTriggerRoundEnd =
        roundEndAnimationCount === expectedAnimationCount &&
        (e.animationName === "highlightWin" || e.animationName === "highlightDraw");

    if (shouldTriggerRoundEnd) {
        UtilityHandlerModule.toggleNotShowBackdrop(backdrop);
        UtilityHandlerModule.toggleShowBackdrop(backdrop);
        UtilityHandlerModule.toggleHideRoundEndMessage(roundEndMessage);
        UtilityHandlerModule.toggleScaleWinnerName(roundEndMessage);
        applyRoundEndButtonStyles(); // roundOutcome used inside
        AudioModule.playRoundCompleteAudio();
    }
});
```

**General Idea**

The game logic runs immediately but the UI reacts later through animations and asynchronous events. Because of this, the game can't rely on a straight step by step flow.

To keep everything in sync, the internal game returns a result object describing what happened during a move. The UI stores the important parts of that result. 

Later when the animations finishes, the UI reads those saved values to update the screen correctly and finish the round.

1. The game evaluates the state once
2. The UI stores the state 
3. The asynchronous events use it later


