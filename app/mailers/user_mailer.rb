class UserMailer < ApplicationMailer

    default from: 'notifications@exmple.com'

    def test_email
        mail(to: 'rparkerharris@gmail.com', subject: 'demo login')
    end

end