from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from user_table import User, Role, Base  # Adjust the import path as needed

DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'

def connect_db():
    """Establish a session with the database."""
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session

def main():
    """Create database from the metadata and initialize roles."""
    engine = create_engine(DATABASE_URL)
    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)
    print("Database created")

    # Create the roles if they don't exist
    session = connect_db()
    try:
        if not session.query(Role).first():  # Check if roles already exist
            session.add(Role(name='sigma', can_get=True, can_post=True, can_put=True, can_delete=True))
            session.add(Role(name='mewer', can_get=True, can_post=True, can_put=False, can_delete=False))
            session.add(Role(name='rizzler', can_get=True, can_post=False, can_put=False, can_delete=False))
            session.commit()
            print("Roles created")
    except Exception as e:
        print(f"Error creating roles: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    main()

