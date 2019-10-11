class WaitingChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "WaitingChannel"
  end

  def requestRollCall
    ActionCable.server.broadcast("WaitingChannel", {requestRollCall: true})
  end

  def relayPresence(user)
    ActionCable.server.broadcast("WaitingChannel", {user: user['user'], rating: user['rating']})
  end

  def relayExit(user)
    ActionCable.server.broadcast("WaitingChannel", {goner: user['user']})
  end

  def relayChallenge(challenge)
    ActionCable.server.broadcast("WaitingChannel", {
      challenger: challenge['challenger'], 
      challengee: challenge['challengee'],
      gameType: challenge['gameType'],
      gameTime: challenge['gameTime']
    })
  end

  def relayAcceptance(challenge)
    playerWhite = challenge['playerWhoChallenged']
    playerBlack = challenge['playerWhoAccepts']
    if rand() < 0.5
      playerBlack = challenge['playerWhoChallenged']
      playerWhite = challenge['playerWhoAccepts']
    end
    gameType = challenge['gameType']
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
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    #stop_all_streams
  end
end
