class UserMailer < ApplicationMailer

    default from: 'notifications@exmple.com'

    def test_email
        mail(to: 'rparkerharris@gmail.com', subject: 'demo login')
    end

    def challenge_email(address, friendName, yourName, message)
        @friendName = friendName
        @yourName = yourName
        @message = message
        mail(to: address, subject: yourName + ' invites you to play chess!')
    end

end