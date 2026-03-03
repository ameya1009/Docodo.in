import sqlite3

class NL2SQLAgent:
    """
    The 'Oracle-Killer' Feature.
    Converts CEO natural language into executable SQL queries.
    Targets the friction of 'Running Reports' in traditional ERPs.
    """
    def __init__(self, db_path: str = ":memory:"):
        self.conn = sqlite3.connect(db_path)
        self.setup_mock_data()

    def setup_mock_data(self):
        cursor = self.conn.cursor()
        cursor.execute("CREATE TABLE sales (date TEXT, amount REAL, shipping_cost REAL, margin REAL)")
        data = [
            ('2026-02-24', 5000, 450, 0.22),
            ('2026-02-25', 6000, 500, 0.25),
            ('2026-02-26', 4500, 600, 0.18), # High shipping cost impact
            ('2026-02-27', 8000, 550, 0.30)
        ]
        cursor.executemany("INSERT INTO sales VALUES (?, ?, ?, ?)", data)
        self.conn.commit()

    def query_engine(self, natural_language_query: str):
        print(f"CEO query: {natural_language_query}")
        print("Agent: Translating to SQL and executing...")
        
        # Simplified Logic: In production, this uses an LLM (Gemini/GPT-4)
        if "margin" in natural_language_query.lower() and "last week" in natural_language_query.lower():
            sql = "SELECT AVG(margin) FROM sales"
            cursor = self.conn.cursor()
            cursor.execute(sql)
            avg_margin = cursor.fetchone()[0]
            
            # Formulate response
            result = f"Your real margin after shipping last week was {avg_margin*100:.1f}%. (Calculated from {sql})"
            return result
        return "I can't translate that query yet. Please try 'What was my margin last week?'"

if __name__ == "__main__":
    agent = NL2SQLAgent()
    print(agent.query_engine("What was my real margin after shipping last week?"))
