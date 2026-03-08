# Toy Robot Simulator

A simulation of a toy robot moving on a 5x5 grid. Includes interactive CLI mode, file input processing, and a REST API interface.

## Setup

```bash
npm install
npm run build  # Optional: compile TypeScript
```

## Run

### Interactive CLI Mode
```bash
npm start
```
Select option `2` for interactive mode, then enter commands:
```
robot> PLACE 0,0,NORTH
robot> MOVE
robot> LEFT
robot> REPORT
robot> EXIT
```

### File Input Mode
```bash
npm start
```
Select option `1` and provide a file path. Example files are in `src/tests/fs-examples/`.

### REST API Server
```bash
npm run api
```
Server runs on `http://localhost:3000` (or set `PORT` environment variable)

## Test

```bash
npm test  # Runs all test suites (Robot unit tests + FileSystem example tests)
```

### Test Suites

- **Robot.spec.ts** — Unit tests for the Robot class covering movement, rotation, and boundary validation
- **FileSystemExamples.spec.ts** — Integration tests that run command files from `fs-examples/` directory

### Example Command Files

Located in `src/tests/fs-examples/`:
- `test-1.txt` — Basic movement and turning
- `test-2-edge-boundaries.txt` — Edge boundary testing
- `test-3-rotations.txt` — Full 360° left rotation
- `test-4-right-turns.txt` — Full 360° right rotation
- `test-5-spiral.txt` — Spiral movement pattern
- `test-6-invalid-place.txt` — Invalid placement handling

## CLI Commands

- **PLACE X,Y,FACING** — Place robot at position (X, Y) facing NORTH, SOUTH, EAST, or WEST
- **MOVE** — Move one step forward
- **LEFT** — Rotate 90° left
- **RIGHT** — Rotate 90° right
- **REPORT** — Print current position and facing direction
- **HISTORY** — Show all executed commands
- **HELP** — Show help message
- **EXIT** — Quit the simulator

## REST API

The API server provides endpoints to control the robot programmatically.

### Endpoints

#### `POST /api/robot/place`
Place robot at specified coordinates and facing direction.
```json
{
  "x": 0,
  "y": 0,
  "facing": "NORTH"
}
```

#### `POST /api/robot/move`
Move robot one unit forward in current facing direction.

#### `POST /api/robot/left`
Rotate robot 90° left.

#### `POST /api/robot/right`
Rotate robot 90° right.

#### `GET /api/robot/report`
Get current robot position and facing direction.

Response:
```json
{
  "x": 0,
  "y": 1,
  "facing": "NORTH"
}
```

#### `GET /api/robot/history`
Get all executed commands.

Response:
```json
{
  "history": ["PLACE 0,0,NORTH", "MOVE", "LEFT"],
  "count": 3
}
```

#### `POST /api/robot/reset`
Reset robot to unplaced state and clear history.

#### `POST /api/robot/batch`
Execute multiple commands in sequence.
```json
{
  "commands": [
    "PLACE 0,0,NORTH",
    "MOVE",
    "MOVE",
    "LEFT",
    "MOVE",
    "REPORT"
  ]
}
```

#### `GET /api/health`
Health check endpoint.

### Example API Usage

**Start the server:**
```bash
npm run api
```

**Unix/Linux/WSL:**
```bash
# Place robot at (0,0) facing NORTH
curl -X POST http://localhost:3000/api/robot/place \
  -H "Content-Type: application/json" \
  -d '{"x": 0, "y": 0, "facing": "NORTH"}'

# Move robot
curl -X POST http://localhost:3000/api/robot/move

# Get current state
curl http://localhost:3000/api/robot/report

# Execute batch commands
curl -X POST http://localhost:3000/api/robot/batch \
  -H "Content-Type: application/json" \
  -d '{"commands": ["PLACE 0,0,NORTH", "MOVE", "MOVE", "LEFT", "MOVE", "REPORT"]}'
```

**PowerShell:**
See [API_EXAMPLES.md](API_EXAMPLES.md) for PowerShell-compatible syntax (different from Unix curl)

## Architecture

- **Robot.ts** — Core robot logic with state management
- **index.ts** — Interactive CLI interface with file input support
- **api.ts** — Native Node.js HTTP server providing REST API
- **tests/** — Comprehensive test suites and example data
