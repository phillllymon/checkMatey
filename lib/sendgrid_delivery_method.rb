require 'net/http'
require 'json'
require 'uri'

# Render (like many hosts) blocks or times out on outbound raw SMTP, so Gmail
# SMTP delivery never completes. SendGrid's HTTP API runs over plain HTTPS,
# which sidesteps that entirely.
class SendgridDeliveryMethod
  def initialize(settings)
    @api_key = settings[:api_key]
  end

  def deliver!(mail)
    content = if mail.multipart?
      [
        { type: 'text/plain', value: mail.text_part.body.decoded },
        { type: 'text/html', value: mail.html_part.body.decoded }
      ]
    else
      [{ type: mail.mime_type || 'text/plain', value: mail.body.decoded }]
    end

    payload = {
      personalizations: [{ to: mail.to.map { |address| { email: address } } }],
      from: { email: mail.from.first },
      subject: mail.subject,
      content: content
    }

    uri = URI('https://api.sendgrid.com/v3/mail/send')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{@api_key}"
    request['Content-Type'] = 'application/json'
    request.body = payload.to_json

    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      raise "SendGrid delivery failed: #{response.code} #{response.body}"
    end

    response
  end
end
