from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Agentic ERP Reasoning Engine")

class Event(BaseModel):
    type: str
    payload: dict

@app.get("/")
def read_root():
    return {"status": "Agentic ERP Online", "engine": "Reasoning Controller v1.0"}

@app.post("/events")
async def handle_event(event: Event, background_tasks: BackgroundTasks):
    """
    Primary interface for the 'Reasoning Engine'.
    Instead of UI CRUD, everything is an event that the Controller Agent monitors.
    """
    # Logic to route to LangGraph agents would go here
    if event.type == "low_stock":
        background_tasks.add_task(run_reorder_agent, event.payload)
    return {"message": "Event received, agent thinking...", "event_id": "evt_123"}

def run_reorder_agent(payload: dict):
    # This simulates the LangGraph controller logic
    print(f"Agent triggered for SKU: {payload.get('sku')}")
    # In a real app, this calls agents/reorder_agent.py
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
