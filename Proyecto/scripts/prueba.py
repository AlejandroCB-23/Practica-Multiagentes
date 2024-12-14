from sqlalchemy import create_engine,select,delete
from sqlalchemy.orm import sessionmaker
from person import Person
import ETL_Extraction
import ETL_Treatment
import ETL_Load
import Load_users
import create_db



DB_NAME = 'user'
URL_API = 'http://127.0.0.1:8000/'
DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'

def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session
    
def main(): 

    #Cargamos los roles
    create_db.main()
    print("Roles cargados")

    # NOTE: This is for updating the hash of the password
    # When it's not needed anymore, it should be removed
    Load_users.delete_all_users()
    #Cragamos usuariod
    Load_users.main()
    print("Usuarios cargados")

    # Extraer los datos
    ETL_Extraction.extraccion()
    print("Datos extraidos")

    # Tratar los datos
    ETL_Treatment.main()
    print("Datos tratados")

    # Cargar los datos
    ETL_Load.main()
    print("Datos cargados")



if __name__ == '__main__':
    main()