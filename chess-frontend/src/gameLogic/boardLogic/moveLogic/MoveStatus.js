export const MoveStatus = Object.freeze({
  DONE: {
    isDone: () => true,
  },
  ILLEGAL_MOVE: {
    isDone: () => false,
  },
  LEAVES_PLAYER_IN_CHECK: {
    isDone: () => false,
  },
});
