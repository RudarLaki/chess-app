import Piece from "./Piece.js";
import BoardUtils from "../boardLogic/BoardUtils.js";
import { MajorMove, AttackMove } from "../boardLogic/moveLogic/Move.js";

const CANDIDATE_MOVE_COORDINATES = [-17, -15, -10, -6, 6, 10, 15, 17];

export default class Knight extends Piece {
  constructor(piecePosition, pieceAlliance) {
    super(piecePosition, pieceAlliance);
  }

  movePiece(move) {
    return new Knight(move.destinationCordinate, this.pieceAlliance);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const offset of CANDIDATE_MOVE_COORDINATES) {
      const candidateDestination = this.piecePosition + offset;

      if (!this.isValidMove(offset, this.piecePosition)) continue;

      const tile = board.getTile(candidateDestination);
      if (!tile.isTileOccupied()) {
        legalMoves.push(new MajorMove(board, this, candidateDestination));
      } else {
        const pieceAtDestination = tile.getPiece();
        if (pieceAtDestination.pieceAlliance !== this.pieceAlliance) {
          legalMoves.push(
            new AttackMove(
              board,
              this,
              candidateDestination,
              pieceAtDestination
            )
          );
        }
      }
    }

    return legalMoves;
  }

  isValidMove(candidateOffset, currentPosition) {
    const destination = currentPosition + candidateOffset;
    if (destination < 0 || destination >= 64) return false;

    if (
      (BoardUtils.FIRST_COLUMN[currentPosition] &&
        (BoardUtils.EIGHT_COLUMN[destination] ||
          BoardUtils.SEVENTH_COLUMN[destination])) ||
      (BoardUtils.SECOND_COLUMN[currentPosition] &&
        BoardUtils.EIGHT_COLUMN[destination]) ||
      (BoardUtils.EIGHT_COLUMN[currentPosition] &&
        (BoardUtils.FIRST_COLUMN[destination] ||
          BoardUtils.SECOND_COLUMN[destination])) ||
      (BoardUtils.SEVENTH_COLUMN[currentPosition] &&
        BoardUtils.FIRST_COLUMN[destination])
    ) {
      return false;
    }

    return true;
  }

  toString() {
    return "N";
  }
}
