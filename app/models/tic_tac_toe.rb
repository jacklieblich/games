class TicTacToe < Game

	def create_board
		self.board = Array.new(9) { nil }
	end

	def make_move(piece, location, user_id)
		if legal_move(piece, location, user_id)
			board[location] = piece
			update(board: board)
		end
	end

	def legal_move(piece, location, user_id)
		piece == turn && player(piece).id == user_id && board[location] == nil
	end


	def turn
		board.count{ |spot| spot != nil} % 2 == 0 ? 'X' : 'O'
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
				self.update(winner: player(board[a]).id , status:"completed")
			end
		end
	end

	
  def player(symbol)
    symbol == 'X' ? challenged : challenger
  end
end