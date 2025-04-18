export default function MoveHistory({ move }) {
  if (!move || !move.movedPiece) return null; // 👈 prevent crash
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px",
        fontFamily: "sans-serif",
        fontSize: "14px",
      }}
    >
      {move.toString()}
    </div>
  );
}
