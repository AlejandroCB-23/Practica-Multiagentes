import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine,select,func
from sqlalchemy.orm import sessionmaker
from person import Person

app = FastAPI()
DATABASE_URL = os.getenv("DATABASE_URL")

# Permitir solicitudes CORS desde localhost:8080
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Permitir solo el frontend en localhost:8080
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session

@app.get("/healthcheck")
def read_root():
    session = connect_db()
    person = session.query(Person).order_by(Person.id.desc()).first()
    session.close()
    return person.nombre

@app.get("/consulta_nombre/{id}")
def read_item(id: int):
    session = connect_db()
    person = session.query(Person).filter(Person.id == id).first()
    session.close()
    if person is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return person

@app.get("/get-info/{id}")
async def get_info(id: int):
    """
    """
    session = connect_db()

    person = session.query(Person).filter(Person.id == id).first()
    session.close()
    if person is None:
       raise HTTPException(status_code=404, detail="Person not found")
    
    return {
        "id": person.id,
        "nombre": person.nombre
    }

@app.post("/post-record/{id}")
async def post_records(id: int, nombre: str=None):
    """
    """
    session = connect_db()
    new_person = Person(id=id, nombre=nombre)
    session.add(new_person)
    session.commit()
    session.close()
    return {
        "id": new_person.id,
        "nombre": new_person.nombre
    }


@app.delete("/delete-record/{id}")
async def delete_record(id: int):
    """
    """
    session = connect_db()
    person = session.query(Person).filter(Person.id == id).first()
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    session.delete(person)
    session.commit()
    session.close()
    return {"message": "Record deleted successfully"}


@app.put("/update-record/{id}")
async def update_record(id: int, nombre: str):
    """
    """
    session = connect_db()
    person = session.query(Person).filter(Person.id == id).first()
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    person.nombre = nombre
    session.commit()
    session.close()
    return {"message": "Record updated successfully"}

