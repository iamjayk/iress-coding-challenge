# API Testing Examples

## PowerShell Commands

PowerShell's `curl` is an alias for `Invoke-WebRequest` with different syntax. Use these commands:

### Place Robot
```powershell
$body = @{x = 0; y = 0; facing = "NORTH"} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/robot/place `
  -Method Post `
  -Headers @{'Content-Type' = 'application/json'} `
  -Body $body
```

### Move Robot
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/move -Method Post
```

### Rotate Left
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/left -Method Post
```

### Rotate Right
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/right -Method Post
```

### Get Current State
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/report -Method Get
```

### Get Command History
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/history -Method Get
```

### Reset Robot
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/robot/reset -Method Post
```

### Batch Commands
```powershell
$commands = @(
  "PLACE 0,0,NORTH"
  "MOVE"
  "MOVE"
  "LEFT"
  "MOVE"
  "REPORT"
)
$body = @{commands = $commands} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/robot/batch `
  -Method Post `
  -Headers @{'Content-Type' = 'application/json'} `
  -Body $body
```

### Health Check
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/health -Method Get
```

## Unix/Linux Commands (if using WSL or Git Bash)

```bash
# Place robot
curl -X POST http://localhost:3000/api/robot/place \
  -H "Content-Type: application/json" \
  -d '{"x": 0, "y": 0, "facing": "NORTH"}'

# Move
curl -X POST http://localhost:3000/api/robot/move

# Get state
curl http://localhost:3000/api/robot/report

# Batch
curl -X POST http://localhost:3000/api/robot/batch \
  -H "Content-Type: application/json" \
  -d '{"commands": ["PLACE 0,0,NORTH", "MOVE", "MOVE", "LEFT", "MOVE", "REPORT"]}'
```

## Simpler PowerShell Shorthand

You can create a helper function in PowerShell profile:

```powershell
function robot {
  param([string]$method, [hashtable]$body)
  $headers = @{'Content-Type' = 'application/json'}
  $uri = "http://localhost:3000/api/robot/$method"
  
  if ($body) {
    $json = $body | ConvertTo-Json
    Invoke-WebRequest -Uri $uri -Method Post -Headers $headers -Body $json
  } else {
    Invoke-WebRequest -Uri $uri -Method Get
  }
}

# Usage:
robot place @{x = 0; y = 0; facing = "NORTH"}
robot move
robot report
```

