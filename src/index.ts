import * as readline from "readline";
import { Direction, Robot } from "./Robot";

type Command =
  | "LEFT"
  | "RIGHT"
  | "REPORT"
  | "PLACE"
  | "MOVE"
  | "HISTORY"
  | "HELP"
  | "EXIT";

class App {
  private rl: readline.Interface;
  private robot: Robot;
  private commandHistory: string[] = [];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.robot = new Robot();
  }

  run = async () => {
    console.log("🤖 Toy Robot Simulator");
    console.log("Enter 1 for file mode, 2 for interactive, or 3 for help:");

    this.rl.question("> ", (answer) => {
      if (answer.trim() === "1") {
        this.fileMode();
      } else if (answer.trim() === "2") {
        this.interactiveMode();
      } else {
        this.showHelp();
        this.interactiveMode();
      }
    });
  };

  private fileMode = () => {
    console.log("Enter the file path:");
    this.rl.question("> ", (filePath) => {
      const fs = require("fs");
      const readStream = fs.createReadStream(filePath, "utf-8");
      console.log(`Reading commands from ${filePath}...\n`);
      readStream.on("data", (chunk: string) => {
        const lines = chunk.split("\n");
        lines.forEach(this.processLine);
        console.log("\n✓ File processed successfully.");
        this.rl.close();
      });
      readStream.on("error", (err: Error) => {
        console.error("❌ Error reading file:", err.message);
        this.rl.close();
      });
    });
  };

  private interactiveMode = () => {
    console.log("Enter commands (or type HELP for options):\n");
    this.promptUser();
  };

  private promptUser = () => {
    this.rl.question("robot> ", (input) => {
      if (input.trim()) {
        this.processLine(input);
      }
      this.promptUser();
    });
  };

  processLine = (line: string) => {
    const [command, ...rest] = line.trim().toUpperCase().split(" ");
    const originalCommand = line.trim();

    try {
      switch (command as Command) {
        case "PLACE":
          const placeParts = rest.join(" ").split(",");
          if (placeParts.length !== 3) {
            throw new Error("PLACE requires format: PLACE X,Y,FACING");
          }
          const x = Number(placeParts[0].trim());
          const y = Number(placeParts[1].trim());
          const facing = placeParts[2].trim().toUpperCase() as Direction;

          if (!["NORTH", "EAST", "SOUTH", "WEST"].includes(facing)) {
            throw new Error(
              `Invalid facing direction: ${facing}. Must be NORTH, EAST, SOUTH, or WEST.`,
            );
          }

          if (isNaN(x) || isNaN(y)) {
            throw new Error(`Invalid coordinates. X and Y must be numbers.`);
          }

          this.robot.place(x, y, facing);
          console.log(`✓ Placed at ${x},${y} facing ${facing}`);
          this.commandHistory.push(originalCommand);
          break;

        case "MOVE":
          this.robot.move();
          console.log("✓ Moved forward");
          this.commandHistory.push(originalCommand);
          break;

        case "LEFT":
          this.robot.left();
          console.log("✓ Rotated left");
          this.commandHistory.push(originalCommand);
          break;

        case "RIGHT":
          this.robot.right();
          console.log("✓ Rotated right");
          this.commandHistory.push(originalCommand);
          break;

        case "REPORT":
          const result = this.robot.report();
          console.log(result ? `📍 ${result}` : "❌ Robot not placed");
          this.commandHistory.push(originalCommand);
          break;

        case "HISTORY":
          this.showHistory();
          break;

        case "HELP":
          this.showHelp();
          break;

        case "EXIT":
          console.log("Goodbye!");
          this.rl.close();
          process.exit(0);
          break;

        default:
          if (command) console.log(`❌ Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${(error as Error).message}`);
    }
  };

  private showHistory = () => {
    if (this.commandHistory.length === 0) {
      console.log("No commands executed yet.");
    } else {
      console.log("\nCommand History:");
      this.commandHistory.forEach((cmd, i) => {
        console.log(`  ${i + 1}. ${cmd}`);
      });
      console.log("");
    }
  };

  private showHelp = () => {
    console.log(`
Commands:
  PLACE X,Y,FACING    Place robot at position (e.g., PLACE 0,0,NORTH)
  MOVE                Move forward one unit
  LEFT                Rotate 90° left
  RIGHT               Rotate 90° right
  REPORT              Show current position and facing
  HISTORY             Show command history
  HELP                Show this help message
  EXIT                Quit the simulator
    `);
  };
}

const app = new App();
void app.run();
