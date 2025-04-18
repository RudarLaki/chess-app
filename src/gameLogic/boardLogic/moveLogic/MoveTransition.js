export default class MoveTransition {
  constructor(board, move, moveStatus) {
    this.board = board;
    this.move = move;
    this.moveStatus = moveStatus;
  }

  getMoveStatus() {
    return this.moveStatus;
  }

  getBoard() {
    return this.board;
  }

  getMove() {
    return this.move;
  }
}
