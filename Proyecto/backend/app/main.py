import os
from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine,select,func
from sqlalchemy.orm import sessionmaker
from person import Person

app = FastAPI()
DATABASE_URL = os.getenv("DATABASE_URL")


def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session

@app.get("/")
def read_root(id : int):
    session = connect_db()
    person = session.query(Person).order_by(Person.id.desc()).first()
    session.close()
    return person.nombre

@app.get(f"/consulta_id/{id}")
def read_item(id: int):
    session = connect_db()
    person = session.query(Person).filter(Person.id == id).first()
    session.close()
    if person is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return person

