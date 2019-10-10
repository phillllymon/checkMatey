class Playing < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "Playing"
  end

  def testMove
    ActionCable.server.broadcast("Playing", {move: 'move'})
  end

  def relayMove(move)
    theMove = move['move']
    theColor = move['color']
    gameId = move['gameId']
    ActionCable.server.broadcast("Playing", {gameId: gameId, move: theMove, color: theColor})
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    #stop_all_streams
  end
end
