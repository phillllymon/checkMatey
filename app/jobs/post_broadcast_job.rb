class PostBroadcastJob < ApplicationJob
  queue_as :default

  def perform(post)
    # Do something later
    
  end
end
