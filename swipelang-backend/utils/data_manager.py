import json
import os
from datetime import datetime
import pandas as pd

def load_slang_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, '..', 'slang_data', 'slang_list.csv')
    print(f"▶ Loading CSV from: {csv_path}")
    print(f"▶ Exists? {os.path.exists(csv_path)}")
    df = pd.read_csv(csv_path, encoding='utf-8')
    return [
        {
            "phrase": row["phrase"],
            "meaning": row["meaning"],
            "example": row.get("example", "")
        }
        for _, row in df.iterrows()
    ]

def load_user_history():
    if not os.path.exists('storage/user_history.json'):
        return {}
    with open('storage/user_history.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_user_history(history):
    with open('storage/user_history.json', 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def get_today_key():
    return datetime.now().strftime('%Y-%m-%d')
