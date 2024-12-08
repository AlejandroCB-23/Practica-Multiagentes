from sqlalchemy import create_engine,select,delete
from sqlalchemy.orm import sessionmaker
import pandas as pd
from drugs_table import Drug, Base


DB_NAME = 'user'
URL_API = 'http://127.0.0.1:8000/'
DATABASE_URL = 'postgresql+psycopg2://user:user@postgres-db:5432/postgres'



def connect_db():
    engine = create_engine(DATABASE_URL)
    factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = factory()
    return session


def main():
    """Create database from the metadata"""
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Database created")

    #Read the csv file
    drugs_data = pd.read_csv('../datasets/dataset_tratados.csv')

    # 
    try:
        session = connect_db()

        for _, row in drugs_data.iterrows():
            existing_drug = session.query(Drug).filter_by(name=row['droga']).first()

            if existing_drug:
                print(f"Drug {row['droga']} already exists. Skipping...")
                continue 

            drug = Drug(
                    name=row['droga'],
                    short_term_effects=row['efectos_corto_plazo'],
                    long_term_effects=row['efectos_largo_plazo'],
                    history=row['historia'],
                    age_range_plus_consumption=row['rango_edad_mas_consumo'],
                    consumition_frequency=row['frecuencia_consumo (cig/mes|resto/año)'],
                    probability_of_abandonment=row['probabilidad_abandono']
                )
            session.add(drug)
        session.commit()  # Confirmar cambios
        print("Drugs loaded successfully!")
    except Exception as e:
        print(f"Error while adding drugs: {e}")
        session.rollback()
    finally:
        session.close()