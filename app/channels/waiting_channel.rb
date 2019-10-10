class WaitingChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "WaitingChannel"
  end

  def requestRollCall
    ActionCable.server.broadcast("WaitingChannel", {requestRollCall: true})
  end

  def relayPresence(user)
    ActionCable.server.broadcast("WaitingChannel", {user: user['user']})
  end

  def relayExit(user)
    ActionCable.server.broadcast("WaitingChannel", {goner: user['user']})
  end

  def relayChallenge(challenge)
    ActionCable.server.broadcast("WaitingChannel", {
      challenger: challenge['challenger'], 
      challengee: challenge['challengee']
    })
  end

  def relayAcceptance(challenge)
    playerWhite = challenge['playerWhoChallenged']
    playerBlack = challenge['playerWhoAccepts']
    if rand() < 0.5
      playerBlack = challenge['playerWhoChallenged']
      playerWhite = challenge['playerWhoAccepts']
    end
    ActionCable.server.broadcast("WaitingChannel", {
      playerWhite: playerWhite, 
      playerBlack: playerBlack,
      gameId: rand()
    })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    #stop_all_streams
  end
end
