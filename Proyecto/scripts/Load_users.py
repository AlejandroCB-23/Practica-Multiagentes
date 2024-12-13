import hashlib
from sqlalchemy import create_engine,select,delete
from sqlalchemy.orm import sessionmaker
import pandas as pd
from user_table import User, Base


DB_NAME = 'user'
URL_API = 'http://127.0.0.1:8000/'
DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'



def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session


def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def main():
    """Create database from the metadata"""
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)

    # 
    try:
        session = connect_db()

        roles = {
            "sigma": ["Juan", "Maria"],
            "mewer": ["Jose", "Ruben"],
            "rizzler": ["Sofia", "Fran"]
        }

        password_hash = hash_password("1234")

        for role, names in roles.items():
            for name in names:
                existing_user = session.query(User).filter_by(name=name, role=role).first()
                if existing_user:
                    print(f"User {name} with role {role} already exists, skipping...")
                    continue

                # Create and add new user
                new_user = User(name=name, password_hash=password_hash, role=role)
                session.add(new_user)
                print(f"Added user {name} with role {role}.")


        session.commit()  # Confirmar cambios
        print("Users loaded successfully!")
    except Exception as e:
        print(f"Error while adding users: {e}")
        session.rollback()
    finally:
        session.close()

