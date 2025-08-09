
import os
import requests
import json

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise Exception("Supabase URL or Anon Key not set in environment.")

url = f"{SUPABASE_URL}/rest/v1/rpc/get_random_questions_mock_test"
headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json"
}
payload = {
    "start_date": "2023-01-01",
    "end_date": "2025-12-31",
    "num_questions": 5,
    "difficulty": None,
    "topic": None
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print("Status Code:", response.status_code)
try:
    print(json.dumps(response.json(), indent=2))
except Exception:
    print(response.text)
