import { useState, useEffect } from "react";
import Tile from "./Tile";
import Pawn from "../gameLogic/pieceLogic/Pawn";
import { Alliance } from "../gameLogic/boardLogic/Alliance";
import { MoveStatus } from "../gameLogic/boardLogic/moveLogic/MoveStatus";
import Board from "../gameLogic/boardLogic/Board";
import {
  MoveFactory,
  PawnPromotionMove,
} from "../gameLogic/boardLogic/moveLogic/Move";
import Rook from "../gameLogic/pieceLogic/Rook";
import Knight from "../gameLogic/pieceLogic/Knight";
import Bishop from "../gameLogic/pieceLogic/Bishop";
import Queen from "../gameLogic/pieceLogic/Queen";
import King from "../gameLogic/pieceLogic/King";
import PromotionPanel from "./PromotionPanel";

function ChessBoard({ setMoveHistory, setIsRunningWhite, setIsRunningBlack }) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [boardState, setBoardState] = useState(new Array(64).fill(null));
  const [gameBoard, setGameBoard] = useState(null);
  const [highlightedMoves, setHighlightedMoves] = useState([]);
  const [kingInCheck, setKingInCheck] = useState(null);
  const [promotionData, setPromotionData] = useState({
    show: false,
    cordinate: null,
    alliance: null,
  });
  const updateBoardFromGame = (gameBoard) => {
    const newBoard = new Array(64).fill(null);
    [...gameBoard.getWhitePieces(), ...gameBoard.getBlackPieces()].forEach(
      (piece) => {
        newBoard[piece.piecePosition] = piece;
      }
    );
    setBoardState(newBoard);
  };

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
        piece.pieceAlliance == gameBoard.getCurrentPlayer().getAlliance()
      ) {
        setSelectedTile(tileIndex);
        let legalMoves = piece.calculateLegalMoves(gameBoard);

        if (piece instanceof King) {
          const castleMoves = gameBoard.getCurrentPlayer().getCastleMoves();
          legalMoves = [...legalMoves, ...castleMoves];
        }
        const moveDestinations = legalMoves
          .map((move) => {
            const transition = gameBoard.getCurrentPlayer().makeMove(move);
            return transition.getMoveStatus() == MoveStatus.DONE
              ? move.destinationCordinate
              : null;
          })
          .filter(Boolean); // Remove null values
        setHighlightedMoves(moveDestinations); // ✅ Highlight possible destinations
      }
    } else {
      setSelectedTile(null);
      setHighlightedMoves([]);
      const prepMove = MoveFactory.createMove(
        gameBoard,
        selectedTile,
        tileIndex
      );
      const transition = gameBoard.getCurrentPlayer().makeMove(prepMove);
      let newBoard = null;
      if (transition.getMoveStatus() == MoveStatus.DONE) {
        if (prepMove instanceof PawnPromotionMove)
          newBoard = handlePromotion(prepMove, transition);
        else newBoard = transition.getBoard();
        setMoveHistory((prevHistory) => [...prevHistory, prepMove]);
        setIsRunningBlack(newBoard.getCurrentPlayer().getAlliance() == "Black");
        setIsRunningWhite(newBoard.getCurrentPlayer().getAlliance() == "White");
        if (newBoard.getCurrentPlayer().isCheck())
          setKingInCheck(
            newBoard.getCurrentPlayer().getKing().getPiecePosition()
          );
        else setKingInCheck(null);
        setGameBoard(newBoard);
        updateBoardFromGame(newBoard);
      }
    }
  };
  const handlePromotion = (move, transition) => {
    const movedPiece = move.getMovedPiece();
    setPromotionData({
      show: true,
      cordinate: move.getDestinationCordinate(),
      alliance: movedPiece.pieceAlliance,
    });
    return transition.getBoard();
  };

  // Handler for when promotion piece is selected
  const handlePromotionSelection = (pieceType) => {
    if (!promotionData.show || promotionData.cordinate == null) return;

    let promotedPiece;
    switch (pieceType) {
      case "Queen":
        promotedPiece = new Queen(
          promotionData.cordinate,
          promotionData.alliance,
          false
        );
        break;
      case "Rook":
        promotedPiece = new Rook(
          promotionData.cordinate,
          promotionData.alliance,
          false
        );
        break;
      case "Bishop":
        promotedPiece = new Bishop(
          promotionData.cordinate,
          promotionData.alliance,
          false
        );
        break;
      case "Knight":
        promotedPiece = new Knight(
          promotionData.cordinate,
          promotionData.alliance,
          false
        );
        break;
      default:
        promotedPiece = new Queen(
          promotionData.cordinate,
          promotionData.alliance,
          false
        );
    }

    const builder = new Board.Builder();

    // Copy all pieces except the pawn being promoted
    gameBoard.getWhitePieces().forEach((piece) => {
      if (piece.getPiecePosition() !== promotedPiece.getPiecePosition()) {
        builder.setPiece(piece);
      }
    });
    gameBoard.getBlackPieces().forEach((piece) => {
      if (piece.getPiecePosition() !== promotedPiece.getPiecePosition()) {
        builder.setPiece(piece);
      }
    });

    builder.setPiece(promotedPiece);
    builder.setNextMoveMaker(gameBoard.getCurrentPlayer().getAlliance());

    const newBoard = builder.build();

    // Update board state and control
    setGameBoard(newBoard);
    updateBoardFromGame(newBoard);
    setIsRunningBlack(newBoard.getCurrentPlayer().getAlliance() === "Black");
    setIsRunningWhite(newBoard.getCurrentPlayer().getAlliance() === "White");

    if (newBoard.getCurrentPlayer().isCheck()) {
      setKingInCheck(newBoard.getCurrentPlayer().getKing().getPiecePosition());
    } else {
      setKingInCheck(null);
    }
    setPromotionData({ show: false, cordinate: null, alliance: null });
  };

  // Modify your return statement to include PromotionPanel
  return (
    <>
      {boardState.map((piece, index) => (
        <Tile
          key={index}
          index={index}
          piece={piece}
          selectedTile={selectedTile}
          onClick={handleTileClick}
          isKingInCheck={kingInCheck}
          isHighlighted={highlightedMoves.includes(index)}
        />
      ))}

      {promotionData.show && (
        <PromotionPanel
          alliance={promotionData.alliance}
          onSelect={handlePromotionSelection}
        />
      )}
    </>
  );
}
export default ChessBoard;
