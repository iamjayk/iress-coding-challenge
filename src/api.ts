import * as http from "http";
import { Direction, Robot } from "./Robot";

class RobotAPI {
  private robot: Robot;
  private commandHistory: string[] = [];
  private server: http.Server;

  constructor() {
    this.robot = new Robot();
    this.server = http.createServer(this.handleRequest);
  }

  private handleRequest = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method || "GET";

    try {
      if (method === "POST" && pathname === "/api/robot/place") {
        this.handlePlace(req, res);
      } else if (method === "POST" && pathname === "/api/robot/move") {
        this.handleMove(req, res);
      } else if (method === "POST" && pathname === "/api/robot/left") {
        this.handleLeft(req, res);
      } else if (method === "POST" && pathname === "/api/robot/right") {
        this.handleRight(req, res);
      } else if (method === "GET" && pathname === "/api/robot/report") {
        this.handleReport(req, res);
      } else if (method === "GET" && pathname === "/api/robot/history") {
        this.handleHistory(req, res);
      } else if (method === "POST" && pathname === "/api/robot/reset") {
        this.handleReset(req, res);
      } else if (method === "POST" && pathname === "/api/robot/batch") {
        this.handleBatch(req, res);
      } else if (method === "GET" && pathname === "/api/health") {
        this.handleHealth(req, res);
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
      }
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  };

  private readBody = (
    req: http.IncomingMessage,
    callback: (body: string) => void,
  ) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      callback(body);
    });
  };

  private handlePlace = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    this.readBody(req, (body) => {
      try {
        const { x, y, facing } = JSON.parse(body);
        if (typeof x !== "number" || typeof y !== "number" || !facing) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Missing x, y, or facing" }));
          return;
        }

        if (!["NORTH", "EAST", "SOUTH", "WEST"].includes(facing)) {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              error: "Invalid facing. Must be NORTH, EAST, SOUTH, or WEST",
            }),
          );
          return;
        }

        this.robot.place(x, y, facing as Direction);
        this.commandHistory.push(`PLACE ${x},${y},${facing}`);
        res.writeHead(200);
        res.end(
          JSON.stringify({
            success: true,
            message: `Placed at ${x},${y} facing ${facing}`,
          }),
        );
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
    });
  };

  private handleMove = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    try {
      this.robot.move();
      this.commandHistory.push("MOVE");
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: "Moved forward" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  };

  private handleLeft = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    try {
      this.robot.left();
      this.commandHistory.push("LEFT");
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: "Rotated left" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  };

  private handleRight = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    try {
      this.robot.right();
      this.commandHistory.push("RIGHT");
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: "Rotated right" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  };

  private handleReport = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    const report = this.robot.report();
    if (!report) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Robot not placed" }));
      return;
    }
    const [x, y, facing] = report.split(",");
    res.writeHead(200);
    res.end(JSON.stringify({ x: Number(x), y: Number(y), facing }));
  };

  private handleHistory = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        history: this.commandHistory,
        count: this.commandHistory.length,
      }),
    );
  };

  private handleReset = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    this.robot = new Robot();
    this.commandHistory = [];
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: "Robot reset" }));
  };

  private handleBatch = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    this.readBody(req, (body) => {
      try {
        const { commands } = JSON.parse(body);
        if (!Array.isArray(commands)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Commands must be an array" }));
          return;
        }

        const results: any[] = [];
        commands.forEach((cmd: string) => {
          try {
            this.processCommand(cmd);
            results.push({ command: cmd, status: "success" });
          } catch (error) {
            results.push({
              command: cmd,
              status: "error",
              message: (error as Error).message,
            });
          }
        });

        const finalState = this.robot.report();
        res.writeHead(200);
        res.end(JSON.stringify({ results, finalState }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
    });
  };

  private handleHealth = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  };

  private processCommand(line: string) {
    const [command, ...rest] = line.trim().toUpperCase().split(" ");

    switch (command) {
      case "PLACE":
        const placeParts = rest.join(" ").split(",");
        if (placeParts.length !== 3) {
          throw new Error("PLACE requires format: PLACE X,Y,FACING");
        }
        const x = Number(placeParts[0].trim());
        const y = Number(placeParts[1].trim());
        const facing = placeParts[2].trim().toUpperCase() as Direction;

        if (!["NORTH", "EAST", "SOUTH", "WEST"].includes(facing)) {
          throw new Error(`Invalid facing direction: ${facing}`);
        }

        if (isNaN(x) || isNaN(y)) {
          throw new Error("X and Y must be numbers");
        }

        this.robot.place(x, y, facing);
        this.commandHistory.push(line);
        break;
      case "MOVE":
        this.robot.move();
        this.commandHistory.push(line);
        break;
      case "LEFT":
        this.robot.left();
        this.commandHistory.push(line);
        break;
      case "RIGHT":
        this.robot.right();
        this.commandHistory.push(line);
        break;
      case "REPORT":
        this.robot.report();
        this.commandHistory.push(line);
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  start(port: number = 3000) {
    this.server.listen(port, () => {
      console.log(`🚀 Robot API running on http://localhost:${port}`);
      console.log(`\nAvailable endpoints:`);
      console.log(
        `  POST /api/robot/place    - Place robot at X,Y facing DIRECTION`,
      );
      console.log(`  POST /api/robot/move     - Move forward one unit`);
      console.log(`  POST /api/robot/left     - Rotate 90° left`);
      console.log(`  POST /api/robot/right    - Rotate 90° right`);
      console.log(
        `  GET  /api/robot/report   - Get current position and facing`,
      );
      console.log(`  GET  /api/robot/history  - Get command history`);
      console.log(`  POST /api/robot/reset    - Reset robot`);
      console.log(`  POST /api/robot/batch    - Execute batch of commands`);
      console.log(`  GET  /api/health         - Health check`);
    });
  }
}

const port = parseInt(process.env.PORT || "3000", 10);
const api = new RobotAPI();
api.start(port);
