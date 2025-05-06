import { KingCastleMove } from "../moveLogic/Move.js";
import { QueenCastleMove } from "../moveLogic/Move.js";
import Rook from "../../pieceLogic/Rook.js";
import Player from "./Player.js";
import { Alliance } from "../Alliance.js";

export default class WhitePlayer extends Player {
  constructor(board, whiteLegalMoves, blackLegalMoves) {
    super(board, whiteLegalMoves, blackLegalMoves);
  }
  getActivePieces() {
    return this.board.getWhitePieces();
  }

  getAlliance() {
    return Alliance.WHITE;
  }

  getOpponent() {
    return this.board.getBlackPlayer();
  }

  getCastleMoves() {
    const castleMoves = [];

    const kingCastle = this.getKingCastleMove();
    if (kingCastle) {
      castleMoves.push(kingCastle);
    }

    const queenCastle = this.getQueenCastleMove();
    if (queenCastle) {
      castleMoves.push(queenCastle);
    }

    return castleMoves;
  }

  getKingCastleMove() {
    if (this.king.isFirstMove() && !this.isCheck()) {
      if (
        this.board.getTile(63).isTileOccupied() &&
        this.board.getTile(63).getPiece() instanceof Rook &&
        this.board.getTile(63).getPiece().isFirstMove()
      ) {
        if (
          !this.isTileAttacked(62, this.opponentsMoves) &&
          !this.isTileAttacked(61, this.opponentsMoves) &&
          !this.board.getTile(62).isTileOccupied() &&
          !this.board.getTile(61).isTileOccupied()
        ) {
          return new KingCastleMove(
            this.board,
            this.king,
            62,
            this.board.getTile(63).getPiece(),
            61
          );
        }
      }
    }
    return null;
  }

  getQueenCastleMove() {
    if (this.king.isFirstMove() && !this.isCheck()) {
      if (
        this.board.getTile(56).isTileOccupied() &&
        this.board.getTile(56).getPiece() instanceof Rook &&
        this.board.getTile(56).getPiece().isFirstMove()
      ) {
        if (
          !this.isTileAttacked(58, this.opponentsMoves) &&
          !this.isTileAttacked(59, this.opponentsMoves) &&
          !this.board.getTile(57).isTileOccupied() &&
          !this.board.getTile(58).isTileOccupied() &&
          !this.board.getTile(59).isTileOccupied()
        ) {
          return new QueenCastleMove(
            this.board,
            this.king,
            58,
            this.board.getTile(56).getPiece(),
            59
          );
        }
      }
    }
    return null;
  }
}
