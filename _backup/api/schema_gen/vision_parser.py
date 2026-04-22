import json

class SchemaLessOnboarding:
    """
    Architectural demonstration of Vision-LLM ingestion.
    Parses 'Legacy' data and maps it to a dynamic PostgreSQL schema.
    """
    def __init__(self):
        self.dynamic_schema = {}

    def ingest_vision_payload(self, vision_output: str):
        """
        Simulates the output from a Vision-LLM (e.g. Gemini 1.5 Pro)
        after it analyzes a legacy PDF invoice.
        """
        # Mock Vision-LLM JSON output
        parsed_data = {
            "invoice_no": "INV-2024-001",
            "vendor": "Acme Corp",
            "items": [
                {"name": "Steel Rods", "qty": 50, "price": 120.5}
            ],
            "tax_id": "VAT-9911"
        }
        
        print("Vision-LLM: Parsing Legacy PDF...")
        print(f"Extracted Entities: {list(parsed_data.keys())}")
        
        return parsed_data

    def generate_sql_migration(self, parsed_data: dict):
        """
        Dynamically builds SQL 'CREATE TABLE' based on discovered fields.
        This is the core 'Anti-SAP' friction-less onboarding.
        """
        table_name = "onboarding_data"
        columns = []
        for key, value in parsed_data.items():
            col_type = "TEXT" if isinstance(value, str) else "REAL"
            columns.append(f"{key} {col_type}")
        
        sql = f"CREATE TABLE {table_name} ({', '.join(columns)});"
        print(f"\n--- Dynamic Migration Generated ---")
        print(sql)
        return sql

if __name__ == "__main__":
    onboarding = SchemaLessOnboarding()
    data = onboarding.ingest_vision_payload("path/to/invoice.pdf")
    onboarding.generate_sql_migration(data)
