class UserMailer < ApplicationMailer
	default from: 'notifications@' + Setting.url + '.com'

	def challenged_email(user_id, game_id)
		game = Game.find(game_id)
		@user = User.find(user_id)
		@url  = Setting.url + "games/" + game.type + "/" + game_id.to_s
		@challenger = game.challenger
		@game_type = game.type
		mail(to: @user.email, subject: 'you have been challenged!')
	end
end
