import sqlite3
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def read_business():
    db_name = "brain.db"
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, content FROM business")
    rows = cursor.fetchall()
    
    for row in rows:
        print(f"=== ID: {row[0]} | Title: {row[1]} ===")
        print(row[2])
        print("="*40 + "\n")
        
    conn.close()

if __name__ == "__main__":
    read_business()
