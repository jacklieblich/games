class Connect4 < Game
	def create_board
		self.board = Array.new(7) { Array.new(6) { nil } }
	end

	def make_move(row, user)
		if legal_move?(row, user)
			space = board[row].find_index(nil)
			board[row][space] = user.id
			update(board: board)
		end
	end

	def legal_move?(row, user)
		users_turn?(user) && board[row].include?(nil)
	end

	def set_winner
		#rows
		(0..3).each do |col|
			(0..5).each do |row|
				if board[col][row] && board[col][row] == board[col+1][row] && board[col][row] == board[col+2][row] && board[col][row] == board[col+3][row]
					self.update(winner: board[col][row] , status:"completed")
				end
			end
		end

		#cols
		(0..6).each do |col|
			(0..2).each do |row|
				if board[col][row] && board[col][row] == board[col][row+1] && board[col][row] == board[col][row+2] && board[col][row] == board[col][row+3]
					self.update(winner: board[col][row] , status:"completed")
				end
			end
		end

		#diagonal /
		(0..3).each do |col|
			(0..2).each do |row|
				if board[col][row] && board[col][row] == board[col+1][row+1] && board[col][row] == board[col+2][row+2] && board[col][row] == board[col+3][row+3]
					self.update(winner: board[col][row] , status:"completed")
				end
			end
		end

		#diagonal \
		(0..3).each do |col|
			(3..5).each do |row|
				if board[col][row] && board[col][row] == board[col+1][row-1] && board[col][row] == board[col+2][row-2] && board[col][row] == board[col+3][row-3]
					self.update(winner: board[col][row] , status:"completed")
				end
			end
		end

		unless board.any?{|arr| arr.include?(nil)}
			self.update(status:"completed")
		end
	end

	def color_for_user(user_id)
		return "rgba(255, 0, 0, 1)" if user_id == player_1
		return "rgba(255, 255, 0, 1)" if user_id == player_2
	end
end
