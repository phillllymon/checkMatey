class Playing < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "Playing"
  end

  def testMove
    ActionCable.server.broadcast("Playing", {move: 'move'})
  end

  def relayDraw(offer)
    gameId = offer['gameId']
    theMessage = offer['message']
    theColor = offer['color']
    ActionCable.server.broadcast("Playing", {gameId: gameId, message: theMessage, color: theColor})
  end

  def relayResign(resignation)
    gameId = resignation['gameId']
    theColor = resignation['color']
    ActionCable.server.broadcast("Playing", {gameId: gameId, resign: true, color: theColor})
  end

  def relayTimeout(timeout)
    gameId = timeout['gameId']
    theColor = timeout['color']
    ActionCable.server.broadcast("Playing", {gameId: gameId, timeout: true, color: theColor})
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
