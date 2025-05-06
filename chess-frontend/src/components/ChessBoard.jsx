import { useState, useEffect } from "react";
import { MoveStatus } from "../gameLogic/boardLogic/moveLogic/MoveStatus";
import Tile from "./Tile";
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

function ChessBoard({
  roomId,
  socket,
  setMoveHistory,
  setIsRunningWhite,
  setIsRunningBlack,
  setGameOver,
}) {
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

  useEffect(() => {
    const initialBoard = Board.createStandardBoard();
    setGameBoard(initialBoard);
    updateBoardFromGame(initialBoard);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("Move", (moveData) => {
      console.log("Move received from opponent:", moveData);
      applyMoveFromSocket(moveData);
    });

    return () => {
      socket.off("Move");
    };
  }, [socket, gameBoard]);

  const handleTileClick = (tileIndex) => {
    if (!gameBoard) return;

    if (selectedTile == null) {
      const piece = boardState[tileIndex];
      if (
        piece &&
        piece.pieceAlliance === gameBoard.getCurrentPlayer().getAlliance()
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
            return transition.getMoveStatus() === MoveStatus.DONE
              ? move.destinationCordinate
              : null;
          })
          .filter((destination) => destination !== null);
        setHighlightedMoves(moveDestinations);
      }
    } else {
      socket.emit("Move", {
        roomId: roomId, // the room ID you are in
        moveData: {
          from: selectedTile,
          to: tileIndex,
        },
      });

      setSelectedTile(null);
      setHighlightedMoves([]);

      const moveData = {
        from: selectedTile,
        to: tileIndex,
      };

      applyMoveFromSocket(moveData); // Immediately apply your own move
    }
  };

  const applyMoveFromSocket = (moveData) => {
    const { from, to } = moveData;
    if (!gameBoard) return;

    const move = MoveFactory.createMove(gameBoard, from, to);
    const transition = gameBoard.getCurrentPlayer().makeMove(move);

    if (transition.getMoveStatus() === MoveStatus.DONE) {
      let newBoard;

      if (move instanceof PawnPromotionMove) {
        newBoard = handlePromotion(move, transition);
      } else {
        newBoard = transition.getBoard();
      }

      setMoveHistory((prevHistory) => [...prevHistory, move]);
      setIsRunningBlack(newBoard.getCurrentPlayer().getAlliance() == "Black");
      setIsRunningWhite(newBoard.getCurrentPlayer().getAlliance() == "White");

      if (newBoard.getCurrentPlayer().isCheck()) {
        setKingInCheck(
          newBoard.getCurrentPlayer().getKing().getPiecePosition()
        );
      } else {
        setKingInCheck(null);
      }

      setGameBoard(newBoard);
      updateBoardFromGame(newBoard);

      if (newBoard.getCurrentPlayer().isCheckMate()) {
        setIsRunningBlack(false);
        setIsRunningWhite(false);
        setGameOver({
          finished: false,
          checkMate: true,
          alliance: gameBoard.getCurrentPlayer().getAlliance().toString(),
        });
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

    if (newBoard.getCurrentPlayer().isCheckMate()) {
      setGameOver({
        alliance: newBoard.getCurrentPlayer().getOpponent().getAlliance(),
        checkMate: true,
      });
    }
  };

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
