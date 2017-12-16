if Rails.env.development?
	require_dependency File.join("app","models", "game.rb")
	%w[tic_tac_toe connect4 hex].each do |c|
		require_dependency File.join("app","models","games", "#{c}.rb")
	end
end