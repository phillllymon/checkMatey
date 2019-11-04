class UserMailer < ApplicationMailer

    default from: 'notifications@exmple.com'

    def test_email
        mail(to: 'rparkerharris@gmail.com', subject: 'demo login')
    end

    def challenge_email(address, friendName, yourName, message, challengeId, gameType, gameTime)
        @friendName = friendName
        @yourName = yourName
        @message = message
        @challengeId = challengeId
        @gameType = gameType
        @gameTime = gameTime
        @username = friendName[0..4]
        if @username == ''
            @username = address[0..4].split('.').join('')
        end
        @username = @username + rand(1000..9999).to_s
        mail(to: address, subject: yourName + ' invites you to play chess!')
    end

end