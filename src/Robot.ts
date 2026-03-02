export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

type State = {
  x: number;
  y: number;
  facing: Direction;
};

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];

const DELTAS: Record<Direction, { dx: number; dy: number }> = {
  NORTH: { dx: 0, dy: 1 },
  EAST: { dx: 1, dy: 0 },
  SOUTH: { dx: 0, dy: -1 },
  WEST: { dx: -1, dy: 0 },
};

const isValidCoordinate = (c: number): boolean => {
  return c >= 0 && c <= 4;
};

const isValidPosition = (x: number, y: number): boolean => {
  return isValidCoordinate(x) && isValidCoordinate(y);
};

export class Robot {
  private state: State | null = null;

  place(x: number, y: number, facing: Direction): void {
    if (isValidPosition(x, y)) {
      this.state = {
        x,
        y,
        facing,
      };
    }
  }

  move(): void {
    if (this.state == null) return;
    const { x, y, facing } = this.state;
    const { dx, dy } = DELTAS[facing];

    const newX = x + dx;
    const newY = y + dy;

    if (isValidPosition(newX, newY)) {
      this.state = {
        x: newX,
        y: newY,
        facing,
      };
    }
  }

  left(): void {
    if (this.state == null) return;
    const { facing, ...rest } = this.state;

    const currentIndex = DIRECTIONS.indexOf(facing);
    const newIndex = (currentIndex - 1 + DIRECTIONS.length) % DIRECTIONS.length;

    this.state = {
      ...rest,
      facing: DIRECTIONS[newIndex],
    };
  }

  right(): void {
    if (this.state == null) return;

    const { facing, ...rest } = this.state;

    const currentIndex = DIRECTIONS.indexOf(facing);
    const newIndex = (currentIndex + 1 + DIRECTIONS.length) % DIRECTIONS.length;

    this.state = {
      ...rest,
      facing: DIRECTIONS[newIndex],
    };
  }

  report(): string | null {
    if (this.state == null) return null;
    const { x, y, facing } = this.state;
    return `${x},${y},${facing}`;
  }
}
