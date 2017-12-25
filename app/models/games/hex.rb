class Hex < Game
  def create_board
    self.board = Array.new(11) { Array.new(11) }
  end

  # location = [row, col]
  def make_move(location, user)
    row = location[0]
    col = location[1]
    if legal_move?(row, col, user)
      board[row][col] = user.id
      update(board: board)
    end
  end

  def legal_move?(row, col, user)
    users_turn?(user) && board[row][col].nil?
  end

  def set_winner
    winner = findWinner(board)
    if winner
      self.update(
        winner: winner,
        status:"completed"
        )
    end
  end

  def depth_first_search(source_index)
    target = board[source_index[0]][source_index[1]]
    node_stack = [source_index]
    visited = Set.new

    loop do
      curr_node = node_stack.pop
      visited << curr_node
      if curr_node == nil
        return false
      end
      if source_index[1] == 0
        return board[curr_node[0]][curr_node[1]] if curr_node[1] == 10 && board[curr_node[0]][curr_node[1]] == target
      end
      if source_index[0] == 0
        return board[curr_node[0]][curr_node[1]] if curr_node[0] == 10 && board[curr_node[0]][curr_node[1]] == target
      end

      children = [
        [curr_node[0], curr_node[1]+1],
        [curr_node[0]+1, curr_node[1]],
        [curr_node[0]+1, curr_node[1]-1],
        [curr_node[0], curr_node[1]-1],
        [curr_node[0]-1, curr_node[1]],
        [curr_node[0]-1, curr_node[1]+1]

      ]
      children.keep_if do |child|
        !visited.include?(child) && child[0] >= 0 && child[0] <= 10 && child[1] >= 0 && child[1] <= 10 && board[child[0]][child[1]] == target
      end
      node_stack = node_stack + children
    end
  end

  def findWinner(board)
    (0..10).each do |i|
      winner = depth_first_search([0, i]) if board[0][i] != nil
      return winner if winner
      winner = depth_first_search([i, 0]) if board[i][0] != nil
      return winner if winner
    end
    return false

  #   visitedBoard = [
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0],
  #     [0,0,0,0,0,0,0,0,0,0,0]
  #   ]

  #   for i in (0..board.count - 1)
  #     # top row
  #     unless board[0][i].nil?
  #       winning = search([0, i], [0,i], board, visitedBoard.clone)
  #       if winning
  #         return winning
  #       end
  #     end

  #     # left column
  #     unless board[i][0].nil?
  #       winning = search([i,0], [i,0], board, visitedBoard.clone)
  #       if winning
  #         return winning
  #       end
  #     end
  #   end

  #   return false
  # end

  # def search(startingSpot, currentSpot, originalBoard, visited)
  #   # if we're at the bottom and current piece = starting piece
  #   if startingSpot[0] == 0 && currentSpot[0] == originalBoard.length - 1
  #     return visited
  #   end

  #   # if we're at the right and current piece = starting piece
  #   if startingSpot[1] == 0 && currentSpot[1] == originalBoard.length - 1
  #     return visited
  #   end

  #   targetPiece = originalBoard[startingSpot[0]][startingSpot[1]]

  #   # continue searching above, below, left & right if its the same piece
  #   [
  #     [-1,0],
  #     [0,-1],
  #     [1,0],
  #     [0,1]
  #   ].each do |searchMode|
  #     row, col = searchMode

  #     newRow = currentSpot[0] + row
  #     newCol = currentSpot[1] + col
  #     next if newRow < 0 || newRow > board.count - 1 || newCol < 0 || newCol > board.count - 1

  #     if originalBoard[newRow][newCol] == targetPiece && !visited[newRow][newCol]
  #       newVisited = visited.clone
  #       newVisited[newRow][newCol] = true
  #       searched = search(startingSpot, [newRow, newCol], originalBoard, newVisited)
  #       if searched
  #         return {
  #           player: targetPiece,
  #           winningPath: searched
  #         }
  #       end
  #     end
  #   end

  #   return false
end
end
