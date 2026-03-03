from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import sys

# Ensure local imports work on Vercel
sys.path.append(os.path.dirname(__file__))

from agents.reorder_agent import AutonomousReorderAgent
from agents.nl2sql_agent import NL2SQLAgent
from schema_gen.vision_parser import SchemaLessOnboarding

app = FastAPI(title="Agentic ERP Reasoning Engine")

# simple in-memory state for demo
tasks_log = [
    {"id": 1, "agent": "Inventory", "message": "Low stock detected for Chip-A1. Draft PO #882 created.", "time": "2 mins ago"},
    {"id": 2, "agent": "Finance", "message": "SAP Migration sync complete. 12,000 entities cleaned.", "time": "1 hour ago"}
]

class Event(BaseModel):
    type: str
    payload: dict

class QueryRequest(BaseModel):
    text: str

@app.get("/api")
def read_root():
    return {"status": "Agentic ERP Online", "engine": "Reasoning Controller v1.0", "active_agents": 3}

@app.get("/api/tasks")
def get_tasks():
    return tasks_log

@app.post("/api/query")
def ceo_query(request: QueryRequest):
    agent = NL2SQLAgent() # In production, this would be a persistent instance
    result = agent.query_engine(request.text)
    return {"result": result}

@app.post("/api/events")
async def handle_event(event: Event, background_tasks: BackgroundTasks):
    if event.type == "low_stock":
        background_tasks.add_task(run_reorder_logic, event.payload)
    return {"message": "Event received, agent thinking...", "event_id": "evt_" + os.urandom(4).hex()}

def run_reorder_logic(payload: dict):
    sku = payload.get("sku", "UNKNOWN")
    agent = AutonomousReorderAgent(sku, 45, 50)
    po = agent.draft_po()
    tasks_log.insert(0, {
        "id": len(tasks_log) + 1,
        "agent": "Inventory",
        "message": f"Autonomous Reorder for {sku}: PO Drafted for {po['quantity']} units.",
        "time": "Just now"
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
