import { MoveStatus } from "../moveLogic/MoveStatus";
import MoveTransition from "../moveLogic/MoveTransition";

export default class Player {
  constructor(board, legalMoves, opponentsMoves) {
    this.board = board;
    this.opponentsMoves = opponentsMoves;
    this.king = this.establishKing();
    this.legalMoves = [...legalMoves, ...this.getCastleMoves()];
  }

  establishKing() {
    for (const piece of this.getActivePieces()) {
      if (piece.toString() === "K") {
        return piece;
      }
    }
    throw new Error("Error: No king found!");
  }

  // Abstract methods to be implemented in subclasses
  getQueenCastleMove() {
    throw new Error("Must be implemented by subclass");
  }

  getKingCastleMove() {
    throw new Error("Must be implemented by subclass");
  }

  getCastleMoves() {
    throw new Error("Must be implemented by subclass");
  }

  getActivePieces() {
    throw new Error("Must be implemented by subclass");
  }

  getAlliance() {
    throw new Error("Must be implemented by subclass");
  }

  getOpponent() {
    throw new Error("Must be implemented by subclass");
  }

  getKing() {
    return this.king;
  }

  isMoveLegal(move) {
    return this.legalMoves.find(
      (move1) =>
        move1.getMovedPiece().getPiecePosition() ==
          move.getMovedPiece().getPiecePosition() &&
        move1.getDestinationCordinate() == move.getDestinationCordinate()
    );
  }

  isCheck() {
    return this.opponentsMoves.some(
      (move) => move.getDestinationCordinate() === this.king.getPiecePosition()
    );
  }

  getLegalMoves() {
    return this.legalMoves;
  }

  isCheckMate() {
    return this.isCheck() && this.noSafeMove();
  }

  noSafeMove() {
    for (const move of this.legalMoves) {
      const transitionBoard = move.executeMove();
      if (!transitionBoard.getCurrentPlayer().getOpponent().isCheck()) {
        return false;
      }
    }
    return true;
  }

  isInStaleMate() {
    return !this.isCheck() && this.noSafeMove();
  }

  isCastled() {
    return false;
  }

  isTileAttacked(tileCordinate, opponentsMoves) {
    return opponentsMoves.some(
      (move) => move.getDestinationCordinate() === tileCordinate
    );
  }

  makeMove(move) {
    if (move == undefined || move == null || !this.isMoveLegal(move)) {
      return new MoveTransition(this.board, move, MoveStatus.ILLEGAL_MOVE);
    }

    const transitionBoard = move.executeMove();
    const kingsTile = transitionBoard
      .getCurrentPlayer()
      .getOpponent()
      .getKing()
      .getPiecePosition();

    const move1 = transitionBoard
      .getCurrentPlayer()
      .getLegalMoves()
      .find((move1) => move1.getDestinationCordinate() == kingsTile);
    if (move1 !== undefined) {
      return new MoveTransition(
        this.board,
        move,
        MoveStatus.LEAVES_PLAYER_IN_CHECK
      );
    }
    return new MoveTransition(transitionBoard, move, MoveStatus.DONE);
  }
}
