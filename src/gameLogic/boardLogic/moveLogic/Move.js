import Board from "../Board";
import Rook from "../../pieceLogic/Rook";

const niz = ["a", "b", "c", "d", "e", "f", "g", "h"];
export class Move {
  constructor(board, movedPiece, destinationCordinate) {
    this.board = board;
    this.movedPiece = movedPiece;
    this.destinationCordinate = destinationCordinate;
  }

  getBoard() {
    return this.board;
  }
  getMovedPiece() {
    return this.movedPiece;
  }
  getDestinationCordinate() {
    return this.destinationCordinate;
  }
  executeMove() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece.movePiece(this));
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );
    return builder.build();
  }

  undo() {
    throw new Error("Abstract method 'undo' must be implemented by subclasses");
  }

  isAttack() {
    return false;
  }

  isCastlingMove() {
    return false;
  }

  getAttackedPiece() {
    return null;
  }

  equals(object) {
    if (object == this) return true;
    if (!(object instanceof Move)) return false;
    if (
      object.board === this.board &&
      object.getDestinationCordinate() === this.getDestinationCordinate() &&
      this.movedPiece === object.movedPiece
    )
      return true;
  }
}

export class MajorMove extends Move {
  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }
  toString() {
    return (
      this.movedPiece.toString() +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class AttackMove extends Move {
  constructor(board, movedPiece, destinationCordinate, attackedPiece) {
    super(board, movedPiece, destinationCordinate);
    this.attackedPiece = attackedPiece;
  }

  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setPiece(this.attackedPiece);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }

  isAttack() {
    return true;
  }

  getAttackedPiece() {
    return this.attackedPiece;
  }

  equals(other) {
    return (
      super.equals(other) &&
      other instanceof AttackMove &&
      this.attackedPiece.equals(other.attackedPiece)
    );
  }
  toString() {
    return (
      this.movedPiece.toString() +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class PawnMove extends MajorMove {
  toString() {
    return (
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}
export class PawnAttackMove extends AttackMove {
  constructor(board, movedPiece, destinationCordinate, attackedPiece) {
    super(board, movedPiece, destinationCordinate, attackedPiece);
  }
  toString() {
    return (
      niz[this.movedPiece.getPiecePosition() % 8] +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class PawnEnPassantAttackMove extends PawnAttackMove {
  executeMove() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.attackedPiece) builder.setPiece(piece);
      });

    const piece = this.movedPiece.movePiece(this);
    builder.setPiece(piece);
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );
    builder.setEnPassant(null);

    return builder.build();
  }
  toString() {
    return (
      niz[this.movedPiece.getPiecePosition()] +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class PawnJump extends MajorMove {
  executeMove() {
    const builder = new Board.Builder();
    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });
    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });
    const pawn = this.movedPiece.movePiece(this);
    builder.setPiece(pawn);
    builder.setEnPassant(pawn);
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );

    return builder.build();
  }
  toString() {
    return (
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class CastleMove extends Move {
  constructor(board, king, kingDestination, rook, rookDestination) {
    super(board, king, kingDestination);
    this.rook = rook;
    this.rookDestination = rookDestination;
  }

  executeMove() {
    const builder = new Board.Builder();
    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (
          piece.getPiecePosition() !== this.movedPiece.getPiecePosition() &&
          piece !== this.rook
        )
          builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    const newKing = this.movedPiece.movePiece(this);
    const newRook = new Rook(
      this.rookDestination,
      this.rook.getPieceAlliance(),
      false
    );

    builder.setPiece(newKing);
    builder.setPiece(newRook);
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );

    return builder.build();
  }

  isCastlingMove() {
    return true;
  }

  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setPiece(this.rook);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }
}

export class KingCastleMove extends CastleMove {
  constructor(board, king, kingDestionation, rook, rookDestination) {
    super(board, king, kingDestionation, rook, rookDestination);
  }
  toString() {
    return "0-0";
  }
}
export class QueenCastleMove extends CastleMove {
  constructor(board, king, kingDestionation, rook, rookDestination) {
    super(board, king, kingDestionation, rook, rookDestination);
  }
  toString() {
    return "0-0-0";
  }
}

export class PawnPromotionMove extends Move {
  constructor(move, promotingTo) {
    super(move.board, move.movedPiece, move.destinationCordinate);
    this.move = move;
    this.promotingTo = promotingTo;
  }

  executeMove() {
    const builder = new Board.Builder();
    const original = this.move.executeMove();
    const pawn = original
      .getTile(this.move.getDestinationCordinate())
      .getPiece();

    original
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece) => {
        if (piece !== pawn) builder.setPiece(piece);
      });

    original
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.promotingTo);
    builder.setNextMoveMaker(original.getCurrentPlayer().getAlliance());
    return builder.build();
  }

  undo() {
    return this.move.undo();
  }
}
export class MoveFactory {
  static createMove(board, source, destination) {
    const move = board
      .getCurrentPlayer()
      .getLegalMoves()
      .find(
        (move) =>
          move.getMovedPiece().getPiecePosition() == source &&
          move.getDestinationCordinate() == destination
      );
    return move;
  }
}
export function putPiece(board, newPiece) {
  const builder = new Board.Builder();
  const blackKingPos = board.getBlackPlayer().getKing().getPiecePosition();
  const whiteKingPos = board.getWhitePlayer().getKing().getPiecePosition();
  if (
    newPiece.getPiecePosition() === blackKingPos ||
    newPiece.getPiecePosition() === whiteKingPos
  )
    return board;
  board
    .getCurrentPlayer()
    .getActivePieces()
    .forEach((piece) => {
      if (piece.getPiecePosition() !== newPiece.getPiecePosition())
        builder.setPiece(piece);
    });
  board
    .getCurrentPlayer()
    .getOpponent()
    .getActivePieces()
    .forEach((piece) => {
      if (piece.getPiecePosition() !== newPiece.getPiecePosition())
        builder.setPiece(piece);
    });
  builder.setPiece(newPiece);
  builder.setNextMoveMaker(board.getCurrentPlayer().getAlliance());
  return builder.build();
}
export function removePiece(board, tileID) {
  const builder = new Board.Builder();
  board
    .getCurrentPlayer()
    .getActivePieces()
    .forEach((piece) => {
      if (piece.getPiecePosition() !== tileID) builder.setPiece(piece);
    });
  board
    .getCurrentPlayer()
    .getOpponent()
    .getActivePieces()
    .forEach((piece) => {
      if (piece.getPiecePosition() !== tileID) builder.setPiece(piece);
    });
  builder.setNextMoveMaker(board.getCurrentPlayer().getAlliance());
  return builder.build();
}
