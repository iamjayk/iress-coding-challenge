import * as fs from "fs";
import * as path from "path";
import assert from "node:assert";
import { Direction, Robot } from "../Robot";

type Command = "LEFT" | "RIGHT" | "REPORT" | "PLACE" | "MOVE";

function describe(name: string, fn: () => void) {
  console.log(`\n${name}:`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${(error as Error).message}`);
  }
}

// Helper function to process commands and collect reports
function processCommandsAndCollectReports(
  commands: string[],
): (string | null)[] {
  const robot = new Robot();
  const reports: (string | null)[] = [];

  for (const line of commands) {
    const trimmed = line.trim();
    if (!trimmed) continue; // Skip empty lines

    const [command, ...rest] = trimmed.toUpperCase().split(" ");
    switch (command as Command) {
      case "LEFT":
        robot.left();
        break;
      case "RIGHT":
        robot.right();
        break;
      case "REPORT":
        reports.push(robot.report());
        break;
      case "PLACE":
        const [x, y, facing] = rest[0].split(",");
        robot.place(Number(x), Number(y), facing as Direction);
        break;
      case "MOVE":
        robot.move();
        break;
    }
  }

  return reports;
}

describe("File System Examples", () => {
  const examplesDir = path.join(__dirname, "fs-examples");

  it("test-1.txt: Basic movement and turning", () => {
    const filePath = path.join(examplesDir, "test-1.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const commands = content.split("\n");
    const reports = processCommandsAndCollectReports(commands);

    // Expected: PLACE 1,1,NORTH -> MOVE -> MOVE -> LEFT -> REPORT
    // Should end at (1,3,WEST)
    assert.strictEqual(reports[0], "1,3,WEST");
  });

  it("test-2-edge-boundaries.txt: Edge boundary testing", () => {
    const filePath = path.join(examplesDir, "test-2-edge-boundaries.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const commands = content.split("\n");
    const reports = processCommandsAndCollectReports(commands);

    // PLACE 4,4,NORTH -> can't move north (already at edge) -> REPORT: 4,4,NORTH
    assert.strictEqual(reports[0], "4,4,NORTH");
    // After MOVE (can't move north) -> REPORT: 4,4,NORTH
    assert.strictEqual(reports[1], "4,4,NORTH");
    // After another MOVE (still can't) -> REPORT: 4,4,NORTH
    assert.strictEqual(reports[2], "4,4,NORTH");
    // After RIGHT (facing EAST) and MOVE -> REPORT: should fail (still at 4,4)
    assert.strictEqual(reports[3], "4,4,EAST");
  });

  it("test-3-rotations.txt: Full 360° left rotation", () => {
    const filePath = path.join(examplesDir, "test-3-rotations.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const commands = content.split("\n");
    const reports = processCommandsAndCollectReports(commands);

    // PLACE 2,2,NORTH -> LEFT 4 times should return to NORTH
    assert.strictEqual(reports[0], "2,2,WEST");
    assert.strictEqual(reports[1], "2,2,SOUTH");
    assert.strictEqual(reports[2], "2,2,EAST");
    assert.strictEqual(reports[3], "2,2,NORTH");
  });

  it("test-4-right-turns.txt: Full 360° right rotation", () => {
    const filePath = path.join(examplesDir, "test-4-right-turns.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const commands = content.split("\n");
    const reports = processCommandsAndCollectReports(commands);

    // PLACE 0,0,WEST -> RIGHT -> REPORT -> RIGHT -> REPORT -> RIGHT -> REPORT -> RIGHT -> REPORT
    // After each RIGHT turn: WEST -> NORTH -> EAST -> SOUTH -> WEST (back to start)
    assert.strictEqual(reports[0], "0,0,NORTH");
    assert.strictEqual(reports[1], "0,0,EAST");
    assert.strictEqual(reports[2], "0,0,SOUTH");
    assert.strictEqual(reports[3], "0,0,WEST");
  });

  it("test-5-spiral.txt: Spiral movement pattern", () => {
    const filePath = path.join(examplesDir, "test-5-spiral.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const commands = content.split("\n");
    const reports = processCommandsAndCollectReports(commands);

    // PLACE 2,2,NORTH -> MOVE -> REPORT: 2,3,NORTH
    assert.strictEqual(reports[0], "2,3,NORTH");
    // RIGHT -> MOVE -> REPORT: 3,3,EAST
    assert.strictEqual(reports[1], "3,3,EAST");
    // RIGHT -> MOVE -> REPORT: 3,2,SOUTH
    assert.strictEqual(reports[2], "3,2,SOUTH");
    // RIGHT -> MOVE -> REPORT: 2,2,WEST
    assert.strictEqual(reports[3], "2,2,WEST");
  });

  it("All test files exist in fs-examples directory", () => {
    const testFiles = [
      "test-1.txt",
      "test-2-edge-boundaries.txt",
      "test-3-rotations.txt",
      "test-4-right-turns.txt",
      "test-5-spiral.txt",
    ];

    for (const file of testFiles) {
      const filePath = path.join(examplesDir, file);
      assert.ok(
        fs.existsSync(filePath),
        `${file} should exist in fs-examples directory`,
      );
    }
  });
});

console.log("\n🤖 File System Examples Test Suite Complete!\n");
