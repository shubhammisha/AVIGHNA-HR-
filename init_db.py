from backend.models.database import engine, Base
import backend.models.user as user_model
import os
import sys

# Add the current directory to sys.path so it can find backend
sys.path.append(os.getcwd())

print("🚀 Connecting to Supabase and creating tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Success! Tables created on Supabase.")
except Exception as e:
    print(f"❌ Error connecting to Supabase: {e}")
