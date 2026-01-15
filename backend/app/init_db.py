from app.database import engine, Base
from app.db_models.user import User

Base.metadata.create_all(bind=engine)

print("✅ Database initialized")
