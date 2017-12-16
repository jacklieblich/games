class Hex < Game
  def create_board
    self.board = Array.new(11) { Array.new(11) }
  end

  # location = [row, col]
  def make_move(location, user)
    if legal_move?(location, user)
      board[row][col] = user.id
      update(board: board)
    end
  end

  def legal_move?(row, user)
    users_turn?(user) && board[row][col].nil?
  end

  def turn
    board.flatten.count{ |spot| spot != nil} % 2 == 0 ? player_1 : player_2
  end

  def set_winner
    winner = findWinner(board)
    if winner
      self.update(
        winner: winner.player,
        status:"completed"
      )
    end
  end

  def findWinner(board)
    visitedBoard = [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ]

    for i in (0..board.count)
      # top row
      unless board[0][i].nil?
        winning = search([0, i], [0,i], board, visitedBoard.clone)
        if winning
          return winning
        end
      end

      # left column
      unless board[i][0].nil?
        winning = search([i,0], [i,0], board, visitedBoard.clone)
        if winning
          return winning
        end
      end
    end

    return false
  end

  def search(startingSpot, currentSpot, originalBoard, visited)
    # if we're at the bottom and current piece = starting piece
    if startingSpot[0] === 0 && currentSpot[0] === originalBoard.length - 1
      return visited
    end

    # if we're at the right and current piece = starting piece
    if startingSpot[1] === 0 && currentSpot[1] === originalBoard.length - 1
      return visited
    end

    targetPiece = originalBoard[startingSpot[0]][[startingSpot[1]]]

    # continue searching above, below, left & right if its the same piece
    [
      [-1,0],
      [0,-1],
      [1,0],
      [0,1]
    ].each do |searchMode|
      row, col = searchMode

      newRow = currentSpot[0] + row,
      newCol = currentSpot[1] + col

      next if newRow < 0 || newRow > board.count - 1 || newCol < 0 || newCol > board.count - 1

      if originalBoard[newRow][newCol] === targetPiece && !visited[newRow][newCol]
        newVisited = visited.clone
        newVisited[newRow][newCol] = true
        searched = search(startingSpot, [newRow, newCol], originalBoard, newVisited)
        if searched
          return {
            player: targetPiece,
            winningPath: searched
          }
        end
      end
    end

    return false
  end
end
