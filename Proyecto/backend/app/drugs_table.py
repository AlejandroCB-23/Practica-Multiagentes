from sqlalchemy import create_engine, String, Column, Integer, Boolean, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Base class
Base = declarative_base()

class Drug(Base):  
    __tablename__ = 'drugs'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    short_term_effects = Column(String)
    long_term_effects = Column(String)
    history = Column(String)
    age_range_plus_consumption = Column(Float)
    consumition_frequency = Column(Float)
    probability_of_abandonment = Column(Float)

