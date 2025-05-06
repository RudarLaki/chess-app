function freezeMap(map) {
  return Object.freeze(map);
}

export default class Tile {
  constructor(tileCoordinate) {
    this.tileCoordinate = tileCoordinate;
  }

  static createTile(tileCoordinate, piece) {
    return piece != null
      ? new OccupiedTile(tileCoordinate, piece)
      : Tile.EMPTY_TILES[tileCoordinate];
  }

  isTileOccupied() {
    throw new Error("Must be implemented by subclass");
  }

  getPiece() {
    throw new Error("Must be implemented by subclass");
  }

  getTileCoordinate() {
    return this.tileCoordinate;
  }

  toString() {
    throw new Error("Must be implemented by subclass");
  }
}

export class EmptyTile extends Tile {
  constructor(tileCoordinate) {
    super(tileCoordinate);
  }

  isTileOccupied() {
    return false;
  }

  getPiece() {
    return null;
  }

  toString() {
    return `${String.fromCharCode(65 + (this.tileCoordinate % 8))}${8 - Math.floor(this.tileCoordinate / 8)}`;
  }
}

export class OccupiedTile extends Tile {
  constructor(tileCoordinate, pieceOnTile) {
    super(tileCoordinate);
    this.pieceOnTile = pieceOnTile;
  }

  isTileOccupied() {
    return true;
  }

  getPiece() {
    return this.pieceOnTile;
  }

  toString() {
    const col = String.fromCharCode(65 + (this.tileCoordinate % 8)); // A-H
    const row = 8 - Math.floor(this.tileCoordinate / 8); // 8-1
    return `${col}${row}${this.getPiece().toString()}`;
  }
}

// ✅ Static property initialized AFTER all class declarations
Tile.EMPTY_TILES = (function createEmptyTiles() {
  const emptyTileMap = {};
  for (let i = 0; i < 64; i++) {
    emptyTileMap[i] = new EmptyTile(i);
  }
  return freezeMap(emptyTileMap);
})();
