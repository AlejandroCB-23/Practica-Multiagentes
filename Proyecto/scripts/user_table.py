from sqlalchemy import create_engine, String, Column, Integer, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import UniqueConstraint

# Base class
Base = declarative_base()

class User(Base):  
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)   
    password_hash = Column(String)
    role = Column(String, ForeignKey('roles.name'))  

    __table_args__ = (UniqueConstraint('name', 'role', name='_name_role_uc'),)

class Role(Base):  
    __tablename__ = 'roles'
    name = Column(String, primary_key=True)
    can_get = Column(Boolean)  # Accesolectura
    can_post = Column(Boolean)  # Acceso escritura
    can_put = Column(Boolean)  # Acceso modificación
    can_delete = Column(Boolean)  # Acceso borrado

