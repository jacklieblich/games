class Hex < Game

	def create_board
		self.board = Array.new(9) { nil }
	end

	def make_move(location, user)
		if legal_move?(location, user)
			board[location] = user.id
			update(board: board)
		end
	end

	def legal_move?(location, user)
		users_turn?(user) && board[location] == nil
	end

	def set_winner
		lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]
		lines.size.times do |i|
			a, b, c = lines[i]
			if board[a] && board[a] == board[b] && board[a] == board[c]
				self.update(winner: board[a] , status:"completed")
			end
		end
		unless winner || board.include?(nil)
			self.update(status:"completed")
		end
	end
end
