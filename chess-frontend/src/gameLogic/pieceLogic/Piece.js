export default class Piece {
  constructor(piecePosition, pieceAlliance) {
    this.piecePosition = piecePosition;
    this.pieceAlliance = pieceAlliance;
  }

  equals(object) {
    if (object === this) return true;
    if (object == null) return false;
    if (!(object instanceof Piece)) return false;

    return (
      this.pieceAlliance === object.getPieceAlliance() &&
      this.piecePosition === object.getPiecePosition() &&
      this.toString() === object.toString()
    );
  }

  calculateLegalMoves() {
    throw new Error("Method 'calculateLegalMoves(board)' must be implemented.");
  }

  movePiece() {
    throw new Error("Method 'movePiece(move)' must be implemented.");
  }

  getPieceAlliance() {
    return this.pieceAlliance;
  }

  getPiecePosition() {
    return this.piecePosition;
  }

  isFirstMove() {
    return false;
  }

  // static createPieceFromSelection(pieceName, alliance, tileID) {
  //   switch (pieceName) {
  //     case "P":
  //       return new Pawn(tileID, alliance, false);
  //     case "N":
  //       return new Knight(tileID, alliance);
  //     case "B":
  //       return new Bishop(tileID, alliance);
  //     case "R":
  //       return new Rook(tileID, alliance, false);
  //     case "Q":
  //       return new Queen(tileID, alliance);
  //     case "K":
  //       return new King(tileID, alliance, false);
  //     default:
  //       return null;
  //   }
  // }

  static PieceType = {
    PAWN: "P",
    BISHOP: "B",
    KNIGHT: "N",
    ROOK: "R",
    KING: "K",
    QUEEN: "Q",
  };
}
