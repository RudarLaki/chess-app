import { KingCastleMove } from "../moveLogic/Move.js";
import { QueenCastleMove } from "../moveLogic/Move.js";
import Rook from "../../pieceLogic/Rook.js";
import Player from "./Player.js";
import { Alliance } from "../Alliance.js";

export default class BlackPlayer extends Player {
  constructor(board, whiteLegalMoves, blackLegalMoves) {
    super(board, blackLegalMoves, whiteLegalMoves);
  }

  getActivePieces() {
    return this.board.getBlackPieces();
  }

  getAlliance() {
    return Alliance.BLACK;
  }

  getOpponent() {
    return this.board.getWhitePlayer();
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
        this.board.getTile(7).isTileOccupied() &&
        this.board.getTile(7).getPiece() instanceof Rook &&
        this.board.getTile(7).getPiece().isFirstMove()
      ) {
        if (
          !this.isTileAttacked(5, this.opponentsMoves) &&
          !this.isTileAttacked(6, this.opponentsMoves) &&
          !this.board.getTile(5).isTileOccupied() &&
          !this.board.getTile(6).isTileOccupied()
        ) {
          return new KingCastleMove(
            this.board,
            this.king,
            6,
            this.board.getTile(7).getPiece(),
            5
          );
        }
      }
    }
    return null;
  }

  getQueenCastleMove() {
    if (
      this.board.getTile(0).isTileOccupied() &&
      this.board.getTile(0).getPiece() instanceof Rook &&
      this.board.getTile(0).getPiece().isFirstMove()
    ) {
      if (
        !this.isTileAttacked(2, this.opponentsMoves) &&
        !this.isTileAttacked(3, this.opponentsMoves) &&
        !this.board.getTile(1).isTileOccupied() &&
        !this.board.getTile(2).isTileOccupied() &&
        !this.board.getTile(3).isTileOccupied()
      ) {
        return new QueenCastleMove(
          this.board,
          this.king,
          2,
          this.board.getTile(0).getPiece(),
          3
        );
      }
    }
    return null;
  }
}
