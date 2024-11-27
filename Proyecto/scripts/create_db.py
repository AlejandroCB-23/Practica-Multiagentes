from sqlalchemy import create_engine,select,delete
from sqlalchemy.orm import sessionmaker
from user_table import User, Role

DB_NAME = 'user'
URL_API = 'http://127.0.0.1:8000/'
DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'

def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session
    

def main():
    """Create database from the metadata"""
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Database created")

    # Create the roles if they don't exist
    try:
        session = connect_db()
        session.add(Role(name='sigma', can_get=True, can_post=True, can_put=True, can_delete=True))
        session.add(Role(name='mewer', can_get=True, can_post=True, can_put=False, can_delete=False))
        session.add(Role(name='rizzler', can_get=True, can_post=True, can_put=False, can_delete=False))
        session.commit()
        session.close()
        print("Roles created")
    except Exception as e:
        print("Roles already exist")

