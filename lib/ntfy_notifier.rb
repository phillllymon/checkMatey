require 'net/http'
require 'uri'

# Sends a free push notification via ntfy.sh (https://ntfy.sh) - no account
# or API key needed, just a shared topic name that both sides know.
# Never raises: a notification failure shouldn't break whatever triggered it.
class NtfyNotifier
  def self.notify(message, title: nil)
    topic = ENV['NTFY_TOPIC']
    return unless topic.present?

    uri = URI("https://ntfy.sh/#{topic}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request['Title'] = title if title
    request.body = message

    http.request(request)
  rescue => e
    Rails.logger.error("NtfyNotifier failed: #{e.class}: #{e.message}")
  end
end
