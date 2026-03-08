# Toy Robot Simulator

A simulation of a toy robot moving on a 5x5 grid.

## Setup

`npm i`

## Run

`npm start`

## Test

`npm test` — Runs all test suites (Robot unit tests + FileSystem example tests)

### Test Suites

- **Robot.spec.ts** — Unit tests for the Robot class covering movement, rotation, and boundary validation
- **FileSystemExamples.spec.ts** — Integration tests that run command files from `fs-examples/` directory

### Example Command Files

Located in `fs-examples/`:
- `test-1.txt` — Basic movement and turning
- `test-2-edge-boundaries.txt` — Edge boundary testing
- `test-3-rotations.txt` — Full 360° left rotation
- `test-4-right-turns.txt` — Full 360° right rotation
- `test-5-spiral.txt` — Spiral movement pattern

## Commands

- **PLACE X,Y,F** — place the robot (F: NORTH, SOUTH, EAST, WEST)
- **MOVE** — move one step forward
- **LEFT** — rotate 90° left
- **RIGHT** — rotate 90° right
- **REPORT** — print current position

## Interactive Mode

Run `npm start` and select option 2 to enter commands interactively. Supported commands:
```
PLACE 0,0,NORTH
MOVE
LEFT
REPORT
EXIT
```

## File Mode

Run `npm start` and select option 1 to read commands from a file. The robot will process each line as a command.
