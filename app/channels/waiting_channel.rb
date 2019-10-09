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

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    #stop_all_streams
  end
end
