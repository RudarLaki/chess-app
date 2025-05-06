export default function MoveHistory({ move }) {
  if (!move || !move.movedPiece) return null; // 👈 prevent crash
  return <div className="move-history-text">{move.toString()}</div>;
}
