class SendEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id, game_id)
    UserMailer.challenged_email(user_id, game_id).deliver_later
  end
end
