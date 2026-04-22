import time
import random

class AutonomousReorderAgent:
    """
    Demonstrates the 'Reasoning Engine' logic for autonomous inventory management.
    Targets Odoo/SAP manually-driven replenishment hurdles.
    """
    def __init__(self, sku: str, current_stock: int, min_threshold: int):
        self.sku = sku
        self.current_stock = current_stock
        self.min_threshold = min_threshold
        self.lead_times = [5, 7, 4, 12, 6] # Historical days to deliver

    def analyze_lead_time_risk(self):
        avg_lead = sum(self.lead_times) / len(self.lead_times)
        max_lead = max(self.lead_times)
        risk_score = (max_lead - avg_lead) / avg_lead
        return risk_score

    def decide_reorder_quantity(self):
        # Disruptive logic: Predict next month's demand + safety stock
        base_qty = 100
        predicted_growth = 1.15 # 15% growth predicted by "Market Agent"
        return int(base_qty * predicted_growth)

    def draft_po(self):
        risk = self.analyze_lead_time_risk()
        qty = self.decide_reorder_quantity()
        
        po_draft = {
            "sku": self.sku,
            "quantity": qty,
            "supplier": "Global Logistics Corp",
            "risk_assessment": f"{risk:.2f} (High Variability)",
            "status": "DRAFT_PENDING_REVIEW",
            "reason": f"Inventory {self.current_stock} fell below {self.min_threshold}."
        }
        return po_draft

def simulate_agentic_workflow():
    print("--- Starting Agentic ERP Controller Simulation ---")
    sku = "CHIP-A1-X"
    current_stock = 45
    threshold = 50
    
    print(f"Monitoring {sku}... Current Stock: {current_stock}")
    
    if current_stock < threshold:
        print(f"!! LOW STOCK DETECTED. Human UI bypassed. Reasoning Engine taking over...")
        agent = AutonomousReorderAgent(sku, current_stock, threshold)
        
        print("Agent: Analyzing historical lead times and market demand...")
        time.sleep(1) # Simulating "thinking"
        
        po = agent.draft_po()
        print("\n--- PO DRAFT CREATED AUTONOMOUSLY ---")
        for key, value in po.items():
            print(f"{key.upper()}: {value}")
        
        print("\nNotification: Sent PO Draft to CEO Mobile Dashboard for 1-click approval.")

if __name__ == "__main__":
    simulate_agentic_workflow()
