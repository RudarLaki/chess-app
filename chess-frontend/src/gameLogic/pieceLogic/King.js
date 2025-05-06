import Piece from "./Piece";
import { MajorMove, AttackMove } from "../boardLogic/moveLogic/Move";

const CANDIDATE_MOVES = [-9, -8, -7, -1, 1, 7, 8, 9];

export default class King extends Piece {
  constructor(piecePosition, pieceAlliance, firstMove = true) {
    super(piecePosition, pieceAlliance);
    this.firstMove = firstMove;
  }

  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const offset of CANDIDATE_MOVES) {
      const destination = this.piecePosition + offset;

      if (!this.isValidMove(this.piecePosition, destination)) continue;

      const tile = board.getTile(destination);
      if (!tile.isTileOccupied()) {
        legalMoves.push(new MajorMove(board, this, destination));
      } else {
        const piece = tile.getPiece();
        if (piece.pieceAlliance !== this.pieceAlliance) {
          legalMoves.push(new AttackMove(board, this, destination, piece));
        }
      }
    }

    return legalMoves;
  }

  isValidMove(from, to) {
    if (to < 0 || to >= 64) return false;
    const sameRowWrap =
      (from % 8 === 0 && to % 8 === 7) || (from % 8 === 7 && to % 8 === 0);
    return !sameRowWrap;
  }
  movePiece(move) {
    return new King(move.destinationCordinate, this.pieceAlliance, false);
  }
  isFirstMove() {
    return this.firstMove;
  }
  toString() {
    return "K";
  }
}
