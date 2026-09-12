require_relative '../../lib/sendgrid_delivery_method'

ActionMailer::Base.add_delivery_method :sendgrid, SendgridDeliveryMethod, api_key: ENV['SENDGRID_API_KEY']
