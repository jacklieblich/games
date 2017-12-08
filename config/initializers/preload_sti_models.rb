if Rails.env.development?
  %w[game tic_tac_toe connect4].each do |c|
    require_dependency File.join("app","models","#{c}.rb")
  end
end