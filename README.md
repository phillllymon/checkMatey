# README

# [CheckMatey](https://checkmatey.herokuapp.com/#/)

------

### Tech Stack

* Ruby on Rails
* React / Redux
* PostgreSQL

------

### [Live Link](https://checkmatey.herokuapp.com/#/)

Welcome to CheckMatey, an online chess community inspired by Chess.com.

------
### How to Use
------
![Splash Page](https://github.com/phillllymon/checkMatey/blob/master/app/assets/images/checkMateySpash.png)

To try out CheckMatey, you can use the live link at the top of this page. If you want to host it yourself, download this repository, start postgreSQL, and run

```rails server```

Then navigate to localhost:3000.

------
### Features
------
CheckMatey is a fully-functional chess application. Users can log in, post in the community forum, play against the computer, and play live matches against other users. Users also have the ability to open a chessboard sandbox, where they can move pieces around with no rules, record a sequence of moves, and post that sequence to the forum for other users to play through. Users are assigned ratings, and games against other players affect their ratings. In addition, a complete history of all multiplayer games is available on a user's personal profile.

------
### Code Examples
------
Below are some code snippets:

* An important part of making the chessboard interface immersive is the ability to flip board and see the other player's perspective. The board is made of highly-styled css elements packed into a container just the right size. This is the board element:


```js
      <div
          className={this.flipped ? "board flipped" : "board"}
          onMouseMove={this.dragPiece}
          onMouseLeave={this.abortDrag}
      >
      {
            this.grid.map((row, rIdx) => {
                return (
                    row.map((spot, cIdx) => {
                        return (
                            <div
                                onMouseDown={this.beginDrag}
                                onMouseUp={this.endDrag}
                                key={rIdx + cIdx}
                                id={[rIdx, cIdx]}
                                className={(rIdx + cIdx) % 2 === 0 ? 'w' : 'b'}
                            >
                                <Piece
                                    grayed={this.state.dragging &&
                                        parseInt(this.origin[0]) === rIdx
                                        && parseInt(this.origin[2]) === cIdx ?
                                        true : false}
                                    pos={[rIdx, cIdx]}
                                    mark={this.state.grid[rIdx][cIdx]}
                                />
                            </div>
                        );
                    })
                );
            })
        }
        </div>
```
The variable ```this.flipped``` determines which class the board div will have, and this css ensures the squares appear in the correct order:
```css
      .board {
          display: flex;
          flex-wrap: wrap;
          width: 60vw;
          height: 60vw;
          max-height: 90vh;
          max-width: 90vh;
          border: 10px solid rgb(75, 59, 53);
          border-radius: 5px;
          margin-right: 2vw;
      }
      
      .flipped {
          flex-wrap: wrap-reverse;
          flex-direction: row-reverse;
      }
```
* One technical challenge of this application was setting up the board for a multiplayer match in chess960. For regular chess, the game logic lives on the frontend and each player keeps a separate version of the game. Those versions are both updated when a player broadcasts a move on the game channel. However, since chess960 involves setting a random starting position for pieces, both players need a way to make sure they start with the same board. When a new game is started, this Ruby code is run on the backend, and the starting position is then broadcast to both players:

```ruby
if gameType == 'Chess960'
      row = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
      newRow = []
      while row.length > 0
        nextIdx = rand(0...row.length)
        newRow << row[nextIdx]
        row = row[0...nextIdx].concat(row[nextIdx + 1...row.length])
      end
      gameType = newRow
    end
    ActionCable.server.broadcast("WaitingChannel", {
      playerWhite: playerWhite, 
      playerBlack: playerBlack,
      gameType: gameType,
      gameTime: challenge['gameTime'],
      gameId: rand()
    })
    }
```

Contributors:

Parker Harris

