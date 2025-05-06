import Pawn from "../pieceLogic/Pawn";
import Rook from "../pieceLogic/Rook";
import Knight from "../pieceLogic/Knight";
import Bishop from "../pieceLogic/Bishop";
import Queen from "../pieceLogic/Queen";
import King from "../pieceLogic/King";
import Tile from "./Tile";
import { Alliance } from "./Alliance";
import BlackPlayer from "./playerLogic/BlackPlayer";
import WhitePlayer from "./playerLogic/WhitePlayer";

import { List, Map } from "immutable"; // Using Immutable.js

export default class Board {
  constructor(builder) {
    this.gameBoard = this.createGameBoard(builder);
    this.blackPieces = this.calculateActivePieces(
      this.gameBoard,
      Alliance.BLACK
    );
    this.whitePieces = this.calculateActivePieces(
      this.gameBoard,
      Alliance.WHITE
    );
    this.enPassantPawn = builder.getEnPassantMove();
    this.blackLegalMoves = this.calculateLegalMoves(this.blackPieces);
    this.whiteLegalMoves = this.calculateLegalMoves(this.whitePieces);

    this.whitePlayer = new WhitePlayer(
      this,
      this.whiteLegalMoves,
      this.blackLegalMoves
    );
    this.blackPlayer = new BlackPlayer(
      this,
      this.whiteLegalMoves,
      this.blackLegalMoves
    );
    this.currentPlayer = builder.nextMoveMaker.choosePlayer(
      this.whitePlayer,
      this.blackPlayer
    );
  }
  helpPrint(i) {
    if (this.gameBoard.get(i).isTileOccupied()) {
      if (
        this.gameBoard.get(i).getPiece().getPieceAlliance() == Alliance.BLACK
      ) {
        return this.gameBoard.get(i).toString().toLowerCase();
      }
      return this.gameBoard.get(i).toString();
    }
    return this.gameBoard.get(i).toString();
  }
  toString() {
    let string = "";
    for (let i = 0; i < 64; i++) {
      string += this.helpPrint(i) + " ";
      if (i % 8 == 7) string += "\n";
    }
    return string;
  }
  static createStandardBoard() {
    const builder = new this.Builder();
    builder.setPiece(new Rook(0, Alliance.BLACK));
    builder.setPiece(new Knight(1, Alliance.BLACK));
    builder.setPiece(new Bishop(2, Alliance.BLACK));
    builder.setPiece(new Queen(3, Alliance.BLACK));
    builder.setPiece(new King(4, Alliance.BLACK));
    builder.setPiece(new Bishop(5, Alliance.BLACK));
    builder.setPiece(new Knight(6, Alliance.BLACK));
    builder.setPiece(new Rook(7, Alliance.BLACK));
    builder.setPiece(new Pawn(8, Alliance.BLACK));
    builder.setPiece(new Pawn(9, Alliance.BLACK));
    builder.setPiece(new Pawn(10, Alliance.BLACK));
    builder.setPiece(new Pawn(11, Alliance.BLACK));
    builder.setPiece(new Pawn(12, Alliance.BLACK));
    builder.setPiece(new Pawn(13, Alliance.BLACK));
    builder.setPiece(new Pawn(14, Alliance.BLACK));
    builder.setPiece(new Pawn(15, Alliance.BLACK));

    // White Layout

    builder.setPiece(new Rook(63, Alliance.WHITE));
    builder.setPiece(new Knight(62, Alliance.WHITE));
    builder.setPiece(new Bishop(61, Alliance.WHITE));
    builder.setPiece(new King(60, Alliance.WHITE));
    builder.setPiece(new Queen(59, Alliance.WHITE));
    builder.setPiece(new Bishop(58, Alliance.WHITE));
    builder.setPiece(new Knight(57, Alliance.WHITE));
    builder.setPiece(new Rook(56, Alliance.WHITE));
    builder.setPiece(new Pawn(55, Alliance.WHITE));
    builder.setPiece(new Pawn(54, Alliance.WHITE));
    builder.setPiece(new Pawn(53, Alliance.WHITE));
    builder.setPiece(new Pawn(52, Alliance.WHITE));
    builder.setPiece(new Pawn(51, Alliance.WHITE));
    builder.setPiece(new Pawn(50, Alliance.WHITE));
    builder.setPiece(new Pawn(49, Alliance.WHITE));
    builder.setPiece(new Pawn(48, Alliance.WHITE));
    builder.setNextMoveMaker(Alliance.WHITE);
    return builder.build();
  }

  createGameBoard(builder) {
    const tiles = new Array(64);
    for (let i = 0; i < 64; i++) {
      tiles[i] = Tile.createTile(i, builder.boardConfig.get(i)); // Assuming boardConfig is a Map
    }
    return List(tiles); // Return an immutable list of tiles
  }

  // Placeholder for your actual implementation of this method
  calculateLegalMoves(pieces) {
    const legalMoves = [];
    pieces.forEach((piece) => {
      const moves = piece.calculateLegalMoves(this);
      legalMoves.push(...moves);
    });

    // Logic to calculate legal moves for the given pieces
    return List(legalMoves);
  }

  // Placeholder for your actual implementation of this method
  calculateActivePieces(gameBoard, alliance) {
    const activePieces = [];
    gameBoard.forEach((tile) => {
      if (
        tile.isTileOccupied() &&
        tile.getPiece().getPieceAlliance() === alliance
      )
        activePieces.push(tile.getPiece());
    });

    // Logic to calculate legal moves for the given pieces
    return activePieces;
  }

  getWhitePieces() {
    return this.whitePieces;
  }
  getBlackPieces() {
    return this.blackPieces;
  }
  getWhitePlayer() {
    return this.whitePlayer;
  }
  getBlackPlayer() {
    return this.blackPlayer;
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }
  getTile(current) {
    return this.gameBoard.get(current);
  }

  static Builder = class {
    constructor() {
      this.boardConfig = new Map();
      this.nextMoveMaker = null;
      this.enPassantPawn = null;
    }

    setPiece(piece) {
      this.boardConfig = this.boardConfig.set(piece.getPiecePosition(), piece);
      return this;
    }

    setNextMoveMaker(alliance) {
      this.nextMoveMaker = alliance;
    }

    setEnPassant(pawn) {
      this.enPassantPawn = pawn;
    }
    getEnPassantMove() {
      return this.enPassantPawn;
    }

    build() {
      return new Board(this);
    }
  };
}
