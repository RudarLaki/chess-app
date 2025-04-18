export const Alliance = Object.freeze({
  WHITE: {
    getDirection: () => -1,
    choosePlayer: (whitePlayer, _) => whitePlayer,
    toString: () => "White",
  },
  BLACK: {
    getDirection: () => 1,
    choosePlayer: (_, blackPlayer) => blackPlayer,
    toString: () => "Black",
  },
});
