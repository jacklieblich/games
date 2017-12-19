class UserMailer < ApplicationMailer
	default from: 'slickgamemailer@gmail.com'

	def challenged_email(user_id, game_id)
		game = Game.find(game_id)
		@user = User.find(user_id)
		@url  = root_url + "#/games/" + game.type + "/" + game_id.to_s
		@challenger = game.challenger
		@game_type = game.type
		mail(to: @user.email, subject: 'you have been challenged!')
	end
end
