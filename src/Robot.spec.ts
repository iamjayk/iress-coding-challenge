import assert from "node:assert";
import { Robot } from "./Robot";

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

describe("place", () => {
  it("Returns null before placement", () => {
    const robot = new Robot();
    assert.strictEqual(robot.report(), null);
  });

  it("Sets position correctly", () => {
    const robot = new Robot();
    robot.place(0, 0, "NORTH");
    assert.strictEqual(robot.report(), "0,0,NORTH");
  });

  it("Returns null for invalid position", () => {
    const robot = new Robot();
    robot.place(5, 5, "NORTH");
    assert.strictEqual(robot.report(), null);
  });

  it("Moves correctly", () => {
    const robot = new Robot();
    robot.place(0, 0, "NORTH");
    robot.move();
    assert.strictEqual(robot.report(), "0,1,NORTH");
  });

  it("Moves to the left correctly", () => {
    const robot = new Robot();
    robot.place(0, 0, "NORTH");
    robot.left();
    assert.strictEqual(robot.report(), "0,0,WEST");
  });

  it("Moves to the right correctly", () => {
    const robot = new Robot();
    robot.place(0, 0, "NORTH");
    robot.right();
    assert.strictEqual(robot.report(), "0,0,EAST");
  });

  it("Moves to multiple positions correctly", () => {
    const robot = new Robot();
    robot.place(1, 2, "EAST");
    robot.move();
    robot.move();
    robot.left();
    robot.move();
    assert.strictEqual(robot.report(), "3,3,NORTH");
  });

  it("Does not fall off the north edge", () => {
    const robot = new Robot();
    robot.place(0, 4, "NORTH");
    robot.move();
    robot.move();
    robot.move();
    robot.move();
    assert.strictEqual(robot.report(), "0,4,NORTH");
  });
  it("Does not fall off the south edge", () => {
    const robot = new Robot();
    robot.place(0, 0, "SOUTH");
    robot.move();
    robot.move();
    robot.move();
    robot.move();
    assert.strictEqual(robot.report(), "0,0,SOUTH");
  });
  it("Does not fall off the east edge", () => {
    const robot = new Robot();
    robot.place(4, 0, "EAST");
    robot.move();
    robot.move();
    robot.move();
    robot.move();
    assert.strictEqual(robot.report(), "4,0,EAST");
  });
  it("Does not fall off the west edge", () => {
    const robot = new Robot();
    robot.place(0, 0, "WEST");
    robot.move();
    robot.move();
    robot.move();
    robot.move();
    assert.strictEqual(robot.report(), "0,0,WEST");
  });

  it("Ignores MOVE before PLACE", () => {
    const robot = new Robot();
    robot.move();
    robot.left();
    robot.move();
    assert.strictEqual(robot.report(), null);
  });
  it("Ignores LEFT before PLACE", () => {
    const robot = new Robot();
    robot.left();
    robot.move();
    assert.strictEqual(robot.report(), null);
  });
  it("Ignores invalid PLACE, then accepts valid PLACE", () => {
    const robot = new Robot();
    robot.place(1, 2, "EAST");
    robot.place(0, 0, "NORTH");
    assert.strictEqual(robot.report(), "0,0,NORTH");
  });
  it("returns to original facing on 4 left turns", () => {
    const robot = new Robot();
    robot.place(0, 2, "SOUTH");
    robot.left();
    robot.left();
    robot.left();
    robot.left();
    assert.strictEqual(robot.report(), "0,2,SOUTH");
  });
});
