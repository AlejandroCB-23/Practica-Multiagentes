from sqlalchemy import create_engine, String, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

base = declarative_base()

class Person(base):
    __tablename__ = 'prueba'
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String)