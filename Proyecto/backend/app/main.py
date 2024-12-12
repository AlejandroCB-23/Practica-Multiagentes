import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from drugs_table import Drug 

app = FastAPI()
DATABASE_URL = os.getenv("DATABASE_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session

@app.get("/healthcheck")
def read_root():
    session = connect_db()
    drug = session.query(Drug).order_by(Drug.id.desc()).first()
    session.close()
    return drug.name

@app.get("/get-drug/{id}")
async def get_drug(id: int):
    """
    Retrieve drug information by ID
    """
    session = connect_db()

    try:
        drug = session.query(Drug).filter(Drug.id == id).one()  # Cambio de .first() a .one()
        
        return {
            "id": drug.id,
            "name": drug.name,
            "short_term_effects": drug.short_term_effects,
            "long_term_effects": drug.long_term_effects,
            "history": drug.history,
            "age_range_plus_consumption": drug.age_range_plus_consumption,
            "consumition_frequency": drug.consumition_frequency,
            "probability_of_abandonment": drug.probability_of_abandonment
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Drug not found: {str(e)}")
    finally:
        session.close()

@app.get("/get-drug-by-name/{name}")
async def get_drug_by_name(name: str):
    """
    Get a drug by its name
    """
    try:
        session = connect_db()
        drug = session.query(Drug).filter_by(name=name).first()
        if not drug:
            raise HTTPException(status_code=404, detail=f"Drug not found")
        return {
            "id": drug.id,
            "name": drug.name,
            "short_term_effects": drug.short_term_effects,
            "long_term_effects": drug.long_term_effects,
            "history": drug.history,
            "age_range_plus_consumption": drug.age_range_plus_consumption,
            "consumition_frequency": drug.consumition_frequency,
            "probability_of_abandonment": drug.probability_of_abandonment
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Drug not found: {str(e)}")
    finally:    
        session.close()

@app.post("/post-drug")
async def post_drug(
    name: str, 
    short_term_effects: str = None, 
    long_term_effects: str = None,
    history: str = None,
    age_range_plus_consumption: float = None,
    consumition_frequency: float = None,
    probability_of_abandonment: float = None
):
    """
    Create a new drug record
    """
    session = connect_db()
    id = session.query(func.max(Drug.id)).scalar() or 0
    id += 1
    
    new_drug = Drug(
        id=id, 
        name=name, 
        short_term_effects=short_term_effects,
        long_term_effects=long_term_effects,
        history=history,
        age_range_plus_consumption=age_range_plus_consumption,
        consumition_frequency=consumition_frequency,
        probability_of_abandonment=probability_of_abandonment
    )
    
    session.add(new_drug)
    session.commit()
    
    response = {
        "id": new_drug.id,
        "name": new_drug.name
    }
    session.close()
    return response

@app.delete("/delete-drug/{id}")
async def delete_drug(id: int):
    """
    Delete a drug record by ID
    """
    session = connect_db()
    drug = session.query(Drug).filter(Drug.id == id).first()
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    session.delete(drug)
    session.commit()
    session.close()
    return {"message": "Drug record deleted successfully"}

@app.put("/update-drug/{id}")
async def update_drug(
    id: int, 
    name: str = None, 
    short_term_effects: str = None, 
    long_term_effects: str = None,
    history: str = None,
    age_range_plus_consumption: float = None,
    consumition_frequency: float = None,
    probability_of_abandonment: float = None
):
    """
    Update an existing drug record
    """
    session = connect_db()
    drug = session.query(Drug).filter(Drug.id == id).first()
    
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    # Update fields only if they are provided
    if name is not None:
        drug.name = name
    if short_term_effects is not None:
        drug.short_term_effects = short_term_effects
    if long_term_effects is not None:
        drug.long_term_effects = long_term_effects
    if history is not None:
        drug.history = history
    if age_range_plus_consumption is not None:
        drug.age_range_plus_consumption = age_range_plus_consumption
    if consumition_frequency is not None:
        drug.consumition_frequency = consumition_frequency
    if probability_of_abandonment is not None:
        drug.probability_of_abandonment = probability_of_abandonment
    
    session.commit()
    session.close()
    return {"message": "Drug record updated successfully"}