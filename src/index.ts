import * as readline from "readline";
import { Direction, Robot } from "./Robot";

type Command = "LEFT" | "RIGHT" | "REPORT" | "PLACE";

async function main() {
  const robot = new Robot();
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    const [command, ...rest] = line.trim().toUpperCase().split(" ");
    switch (command) {
      case "LEFT":
        robot.left();
        break;
      case "RIGHT":
        robot.right();
        break;
      case "REPORT":
        const result = robot.report();
        console.log(result);
        break;
      case "PLACE":
        const [x, y, facing] = rest[0].split(",");
        robot.place(Number(x), Number(y), facing as Direction);
        break;
      case "MOVE":
        robot.move();
        break;
    }
  });
}

main();
