# RPS - Multiplayer

![rps](/rps.png?raw=true)

#### [Github page](https://jason-michael.github.io/RPS-Multiplayer/)

Rock/paper/scissors multiplayer game using Firebase's real-time database.

#

### Instructions
- Enter your name and click join. You will be assigned player1 or player2. If there are already two players you will have to wait until one leaves to join.
- Select rock, paper, or scissors. Once **both** players make their pick the game will show the results and move to the next round. *The green border around a player indicates the previous round winner.*

- **Multiplayer can be tested by opening multiple tabs of the Github page and using each tab as if it were a different player/spectator.**
  
#

### Features
- Players and spectators can chat.
- **If a player leaves mid-game**, that player will be removed and the game will wait for another player to join. The remaining player will stay in the game but their stats will reset. Queueing has not been added yet.
- **If both players leave**, the game will reset (even for spectators).

#

### Reset Game
- If the game gets out of sync or messes up in any way players or spectators can click **Reset Game** to do a hard reset. 
- (This shouldn't be needed in a production version of the game, but there are still a few bugs.)
  
#

### Known Issues

1.  While the game is responsive, when a mobile player leaves the game they are not removed correctly. The **Reset Game** button is a temporary way to fix this.
2.  Sometimes the players can run through the game faster than Firebase can update, this throws everything off. Again, **Reset Game** is a temporary fix.
   
---