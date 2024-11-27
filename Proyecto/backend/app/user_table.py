from sqlalchemy import create_engine, String, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


base = declarative_base()  # Base class


class User():
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    password_hash = Column(String)  
    role = Column(String, ForeignKey('roles.name'))

class Role():
    __tablename__ = 'roles'
    name = Column(String, primary_key=True)
    can_get = Column(Boolean)  # Read access
    can_post = Column(Boolean)  # Write access
    can_put = Column(Boolean)  # Update access 
    can_delete = Column(Boolean)  # Delete access
    # Roles breakdown:
    # sigma: All permissions
    # mewer: Can get and post
    # rizzler: Can get
