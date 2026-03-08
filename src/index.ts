import * as readline from "readline";
import { Direction, Robot } from "./Robot";

type Command = "LEFT" | "RIGHT" | "REPORT" | "PLACE" | "MOVE";

class App {
  private rl: readline.Interface;
  private robot: Robot;

  constructor() {
    this.rl = readline.createInterface({ input: process.stdin });
    this.robot = new Robot();
  }

  run = async () => {
    console.log("-- Robot Simulator --");
    console.log(
      "Enter 1 to read commands from a file, or 2 to enter commands interactively:",
    );

    this.rl.question("> ", (answer) => {
      // Read from fs
      if (answer.trim() === "1") {
        console.log("Enter the file path:");
        this.rl.question("> ", (filePath) => {
          const fs = require("fs");
          const readStream = fs.createReadStream(filePath, "utf-8");
          console.log(`Reading commands from ${filePath}...`);
          readStream.on("data", (chunk: string) => {
            console.log(`Processing chunk: ${chunk}`);
            const lines = chunk.split("\n");
            lines.forEach(this.processLine);
            console.log("Processed file successfully.");
            this.rl.close();
          });
          readStream.on("error", (err: Error) => {
            console.error("Error reading file:", err.message);
            this.rl.close();
          });
        });
      } else {
        // Manual input
        console.log(
          "Enter commands (LEFT, RIGHT, REPORT, PLACE X,Y,FACING, MOVE):",
        );
        console.log("\n(Type 'EXIT' to quit)");
        console.log("> ");

        this.rl.on("line", (line: string) => {
          if (line.toUpperCase().trim() === "EXIT") {
            console.log("Exiting...");
            this.rl.close();
          } else {
            this.processLine(line);
          }
        });
      }
    });
  };

  processLine = (line: string) => {
    const [command, ...rest] = line.trim().toUpperCase().split(" ");
    switch (command as Command) {
      case "LEFT":
        this.robot.left();
        break;
      case "RIGHT":
        this.robot.right();
        break;
      case "REPORT":
        const result = this.robot.report();
        console.log(result);
        break;
      case "PLACE":
        const [x, y, facing] = rest[0].split(",");
        this.robot.place(Number(x), Number(y), facing as Direction);
        break;
      case "MOVE":
        this.robot.move();
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  };
}

const app = new App();
void app.run();
