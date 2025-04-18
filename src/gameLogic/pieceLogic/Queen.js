import Piece from "./Piece";
import { MajorMove, AttackMove } from "../boardLogic/moveLogic/Move";

const CANDIDATE_DIRECTIONS = [-9, -8, -7, -1, 1, 7, 8, 9]; // All directions

export default class Queen extends Piece {
  constructor(piecePosition, pieceAlliance) {
    super(piecePosition, pieceAlliance);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const direction of CANDIDATE_DIRECTIONS) {
      let current = this.piecePosition;

      while (this.isValidMove(direction, current)) {
        current += direction;

        if (current < 0 || current >= 64) break;

        const tile = board.getTile(current);
        if (!tile.isTileOccupied()) {
          legalMoves.push(new MajorMove(board, this, current));
        } else {
          const piece = tile.getPiece();
          if (piece.pieceAlliance !== this.pieceAlliance) {
            legalMoves.push(new AttackMove(board, this, current, piece));
          }
          break; // Blocked after capture or same-side piece
        }
      }
    }

    return legalMoves;
  }

  isValidMove(direction, current) {
    const dest = current + direction;
    if (dest < 0 || dest >= 64) return false;

    const sameRowWrap =
      (current % 8 === 0 && dest % 8 === 7) ||
      (current % 8 === 7 && dest % 8 === 0);
    return !sameRowWrap;
  }

  movePiece(move) {
    return new Queen(move.destinationCordinate, this.pieceAlliance);
  }

  toString() {
    return "Q";
  }
}
