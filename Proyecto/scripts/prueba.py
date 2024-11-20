from sqlalchemy import create_engine,select,delete
from sqlalchemy.orm import sessionmaker
from person import Person

DB_NAME = 'user'
URL_API = 'http://127.0.0.1:8000/'
DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'

def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session
    
def main(): 
    # Vamos a añadir una persona simplemente
    session = connect_db()
    new_rec = Person(nombre="uwu")
    session.add(new_rec)
    session.commit()
    print("Persona añadida a la bbdd")

if __name__ == '__main__':
    main()