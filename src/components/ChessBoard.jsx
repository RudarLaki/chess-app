import { useState, useEffect } from "react";
import Tile from "./Tile";
import Pawn from "../gameLogic/pieceLogic/Pawn";
import { Alliance } from "../gameLogic/boardLogic/Alliance";
import { MoveStatus } from "../gameLogic/boardLogic/moveLogic/MoveStatus";
import Board from "../gameLogic/boardLogic/Board";
import { MoveFactory } from "../gameLogic/boardLogic/moveLogic/Move";
import Queen from "../gameLogic/pieceLogic/Queen";
import King from "../gameLogic/pieceLogic/King";

function ChessBoard({ setMoveHistory }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [boardState, setBoardState] = useState(new Array(64).fill(null));
  const [gameBoard, setGameBoard] = useState(null);
  const [highlightedMoves, setHighlightedMoves] = useState([]);
  //const [moveIndex, setMoveIndex] = useState(-1); // ✅ Track current move position

  useEffect(() => {
    const initialBoard = Board.createStandardBoard();
    setGameBoard(initialBoard);
    updateBoardFromGame(initialBoard);
  }, []);

  const handleTileClick = (tileIndex) => {
    if (selectedTile == null) {
      const piece = boardState[tileIndex];
      if (
        piece &&
        piece.pieceAlliance == gameBoard.currentPlayer.getAlliance()
      ) {
        setSelectedTile(tileIndex);
        let legalMoves = piece.calculateLegalMoves(gameBoard);

        if (piece instanceof King) {
          const castleMoves = gameBoard.getCurrentPlayer().getCastleMoves();
          legalMoves = [...legalMoves, ...castleMoves];
        }
        const moveDestinations = legalMoves.map(
          (move) => move.destinationCordinate
        );
        setHighlightedMoves(moveDestinations); // ✅ Highlight possible destinations
      }
    } else {
      const prepMove = MoveFactory.createMove(
        gameBoard,
        selectedTile,
        tileIndex
      );

      const transition = gameBoard.getCurrentPlayer().makeMove(prepMove);

      if (transition.getMoveStatus() == MoveStatus.DONE) {
        const newBoard = handlePromotion(prepMove, transition);

        setMoveHistory((prevHistory) => [...prevHistory, prepMove]);

        setGameBoard(newBoard);
        updateBoardFromGame(newBoard);
      }

      setSelectedTile(null);
      setHighlightedMoves([]); // ✅ Clear highlights
    }
  };

  const handlePromotion = (move, transition) => {
    const destinationRank = Math.floor(move.getDestinationCordinate() / 8);
    const movedPiece = move.getMovedPiece();
    const isWhitePromotion =
      movedPiece.pieceAlliance == Alliance.WHITE && destinationRank === 0;
    const isBlackPromotion =
      movedPiece.pieceAlliance == Alliance.BLACK && destinationRank === 7;

    if (movedPiece instanceof Pawn && (isWhitePromotion || isBlackPromotion)) {
      const promotedQueen = new Queen(
        move.getDestinationCordinate(),
        movedPiece.getPieceAlliance()
      );
      const builder = new Board.Builder();

      gameBoard.getAllActivePieces().forEach((piece) => {
        if (piece !== movedPiece) builder.setPiece(piece);
      });

      builder.setPiece(promotedQueen);
      builder.setNextMoveMaker(
        gameBoard.getCurrentPlayer().getOpponent().getPieceAlliance()
      );
      return builder.build();
    }

    return transition.getBoard();
  };

  const updateBoardFromGame = (gameBoard) => {
    const newBoard = new Array(64).fill(null);
    [...gameBoard.getWhitePieces(), ...gameBoard.getBlackPieces()].forEach(
      (piece) => {
        newBoard[piece.piecePosition] = piece;
      }
    );
    setBoardState(newBoard);
  };

  return boardState.map((piece, index) => (
    <Tile
      key={index}
      index={index}
      piece={piece}
      selectedTile={selectedTile}
      onClick={handleTileClick}
      isHighlighted={highlightedMoves.includes(index)}
    />
  ));
}

export default ChessBoard;
