import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
from drugs_table import Drug
from user_table import User, Role


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
DATABASE_URL = os.getenv("DATABASE_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
from functools import wraps
from fastapi import HTTPException, Depends

def role_required(required_permission):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: str = Depends(get_current_user), **kwargs):

            session = connect_db()
            try:
 
                user = session.query(User).filter(User.name == current_user).first()
                
                user_role = session.query(Role).filter(Role.name == user.role).first()
                
                if user_role:

                    permission_map = {
                        'get': user_role.can_get,
                        'post': user_role.can_post,
                        'put': user_role.can_put,
                        'delete': user_role.can_delete
                    }
                    

                    if permission_map.get(required_permission, False):
                        return await func(*args, **kwargs)
                

                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            except Exception as e:
                 raise HTTPException(status_code=403, detail=f"Permission check failed: {str(e)}")
            finally:
                session.close()
        
        return wrapper
    return decorator


def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    session = connect_db()
    try:
        user = session.query(User).filter(User.name == form_data.username).first()
        
        if not user or not pwd_context.verify(form_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        token = create_access_token(data={"sub": user.name})   

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role  
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Login error: " + str(e))
    finally:
        session.close()

@app.get("/healthcheck")
def read_root():
    session = connect_db()
    drug = session.query(Drug).order_by(Drug.id.desc()).first()
    session.close()
    return drug.name

@app.get("/get-drug/{id}")
@role_required('get')
async def get_drug(id: int, current_user: str = Depends(get_current_user)):
    session = connect_db()
    drug = session.query(Drug).filter(Drug.id == id).one()
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

@app.get("/get-drug-by-name/{name}")
@role_required('get')
async def get_drug_by_name(name: str, current_user: str = Depends(get_current_user)):
    session = connect_db()
    drug = session.query(Drug).filter_by(name=name).first()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
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

@app.post("/post-drug")
@role_required('post')
async def post_drug(
    name: str,
    short_term_effects: str = None,
    long_term_effects: str = None,
    history: str = None,
    age_range_plus_consumption: float = None,
    consumition_frequency: float = None,
    probability_of_abandonment: float = None,
    current_user: str = Depends(get_current_user)
):
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
@role_required('delete')
async def delete_drug(id: int, current_user: str = Depends(get_current_user)):
    session = connect_db()
    drug = session.query(Drug).filter(Drug.id == id).first()
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    session.delete(drug)
    session.commit()
    session.close()
    return {"message": "Drug record deleted successfully"}

@app.delete("/delete-drug-by-name/{name}")
@role_required('delete')
async def delete_drug_by_name(name: str, current_user: str = Depends(get_current_user)):
    session = connect_db()
    drug = session.query(Drug).filter_by(name=name).first()
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    session.delete(drug)
    session.commit()
    session.close()
    return {"message": "Drug record deleted successfully"}

@app.put("/update-drug/{id}")
@role_required('put')
async def update_drug(
    id: int,
    name: str = None,
    short_term_effects: str = None,
    long_term_effects: str = None,
    history: str = None,
    age_range_plus_consumption: float = None,
    consumition_frequency: float = None,
    probability_of_abandonment: float = None,
    current_user: str = Depends(get_current_user)
):
    session = connect_db()
    drug = session.query(Drug).filter(Drug.id == id).first()
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
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

@app.put("/update-drug-by-name")
@role_required('put')
async def update_drug_by_name(
    name: str,
    new_name: str = None,
    short_term_effects: str = None,
    long_term_effects: str = None,
    history: str = None,
    age_range_plus_consumption: float = None,
    consumition_frequency: float = None,
    probability_of_abandonment: float = None,
    current_user: str = Depends(get_current_user)
):
    session = connect_db()
    drug = session.query(Drug).filter_by(name=name).first()
    if drug is None:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    if new_name is not None:
        drug.name = new_name
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