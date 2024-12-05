# Importamos las librerias necesarias
import pandas as pd
import numpy as np

'''
Programa con el objetivo de tratar los datos obtenidos anteriormente en el proceso de extración 
dentro de un ETL.

Objetivo: Construir un DataFrama con los datos obtenidos, haciendo un tratamiento de los mismos.
Dentro de los tratamiento tenemos eliminar valores nulos, posibles renombramientos de columnas,
y el calculo del rango de edad que mas consume cada droga, como la frecuencia de consumo y
su probabilidad de abandonar el consumo.
Teniendo los datasets sin valores nulos, se procederá a la limpieza de los mismos como se comentó 
anteriormente.
'''

def clean_data(dataset : pd.DataFrame) -> None:
    '''
    Elimina las instancias que constituyen valores no pertenecientes a una respuesta válida,
    junto a las instancias que no consumen drogas.
    '''
    
    # Extraemos las personas que han consumido drogas
    dataset = process_consume(dataset)

    # Eliminamos los registros con valores nulos
    valores_null = [-9,85,91,93,94,97,98,985,991,993,994,997,998,999] # Lista de valores no válidos para cualquier columna
    for column in dataset.columns:
        valores_columna = dataset[column].unique()
        for valor in valores_columna:
            if valor in valores_null:
                dataset = dataset.drop(dataset[dataset[column] == valor].index)

    # Procesamos la edad: filtramos las edades que no nos interesan y las agrupamos en rangos
    dataset = process_age(dataset)

    # Renombramiento de las columnas
    lista_ultima_vez_consumo : list = ['cigrec','alcrec','cocrec','mjrec','herrec','methamrec']
    lista_frecuencia_consumo : list = ['cig30use','alcyrtot','cocyrtot','mjyrtot','heryrtot','methdysyr']

    for columna in dataset.columns:
        if columna in lista_ultima_vez_consumo:
            dataset.rename(columns={columna: 'ultima_vez_consumo'}, inplace=True)

        if columna in lista_frecuencia_consumo:
            dataset.rename(columns={columna: 'frecuencia_consumo'}, inplace=True)

    dataset.rename(columns={'age2': 'rango_edad'}, inplace=True)

    return dataset


def process_consume(df : pd.DataFrame) -> pd.DataFrame:
    '''
    Filtra las instancias que consumen drogas.
    '''
    columnas_consumo = ['cigever','alcever','cocever','mjever','herever','methamevr']
    for columna in df.columns:
        if columna in columnas_consumo:
            df = df[df[columna] == 1]
            df = df.drop(columns=columna) # Eliminamos la columna

    return df

def process_age(df : pd.DataFrame) -> pd.DataFrame:
    '''
    Procesa la columna de edad para que se pueda trabajar con ella.
    Filtraremos las edades que no nos interesan y las agruparemos en rangos ya que el dataset
    original trabaja con rangos de edad.
    '''
    # Seleccionamos las columnas de edad que nos interesan
    df = df[(df['age2']>= 7) & (df['age2'] <= 14)]
    
    bins = [6, 10,12, 13, 14]
    labels = [1, 2, 3,4] 

    df.loc[:, 'age2'] = pd.cut(df['age2'], bins=bins, labels=labels, right=True)
    
    return df

def divide_data(df : pd.DataFrame) -> tuple:
    '''
    Divide el dataset en datasets por droga para una mejor manipulación de los datos.
    '''
    cig_columns : list = ['cigever','cigrec','cig30use','age2']
    alc_columns : list = ['alcever','alcrec','alcyrtot','age2']
    mj_columns : list = ['mjever','mjrec','mjyrtot','age2']
    coc_columns : list = ['cocever','cocrec','cocyrtot','age2']
    her_columns : list = ['herever','herrec','heryrtot','age2']
    met_columns : list = ['methamevr','methamrec','methdysyr','age2']

    df_cig : pd.DataFrame = df[cig_columns]
    df_alc : pd.DataFrame = df[alc_columns]
    df_coc : pd.DataFrame = df[coc_columns]
    df_mj : pd.DataFrame = df[mj_columns]
    df_her : pd.DataFrame = df[her_columns]
    df_met : pd.DataFrame = df[met_columns]
                            
    return df_cig, df_alc, df_coc, df_mj, df_her, df_met

def process_data(df : pd.DataFrame) -> pd.DataFrame:
    '''
    Procesa los datos para obtener las estadísticas necesarias:
    - Rango de edad que más consume la droga
    - Frecuencia de consumo
    - Probabilidad de abandonar el consumo
    '''
    # Creamos dataframe auxiliar para almacenar los datos
    df_aux = pd.DataFrame()
    df_aux['rango_edad_mas_consumo'] = df['rango_edad'].mode()
    df_aux['frecuencia_consumo (cig/mes|resto/año)'] = int(df['frecuencia_consumo'].mean())

    # Calculamos la probabilidad de abandonar el consumo
    n_adictos : int = len(df[df['ultima_vez_consumo'] == 1])
    n_no_adictos : int = len(df[df['ultima_vez_consumo'] != 1])
    df_aux['probabilidad_abandono'] = n_no_adictos / (n_adictos + n_no_adictos)

    return df_aux

def process_df(df : pd.DataFrame) -> pd.DataFrame:
    '''
    Metodo auxiliar donde se procesan los datasets de cada droga.
    '''
    df = clean_data(df)
    df = process_data(df)

    return df

def add_data(df_efectos : pd.DataFrame, df_drogas : pd.DataFrame, indice_fila : int) -> pd.DataFrame:
    '''
    Añade la información obtenida en el dataset de drogas al dataset de efectos.
    '''
    # Comprobamos si las nuevas columnas ya existen en el dataset de efectos
    if 'rango_edad_mas_consumo' not in df_efectos.columns:
        df_efectos['rango_edad_mas_consumo'] = np.nan
    if 'frecuencia_consumo (cig/mes|resto/año)' not in df_efectos.columns:
        df_efectos['frecuencia_consumo (cig/mes|resto/año)'] = np.nan
    if 'probabilidad_abandono' not in df_efectos.columns:
        df_efectos['probabilidad_abandono'] = np.nan

    # Añadimos la información al dataset de efectos en la fila correspondiente a la droga
    df_efectos.loc[indice_fila, 'rango_edad_mas_consumo'] = df_drogas['rango_edad_mas_consumo'].values[0]
    df_efectos.loc[indice_fila, 'frecuencia_consumo (cig/mes|resto/año)'] = df_drogas['frecuencia_consumo (cig/mes|resto/año)'].values[0]
    df_efectos.loc[indice_fila, 'probabilidad_abandono'] = df_drogas['probabilidad_abandono'].values[0]

    return df_efectos

def main() -> None:
    # Cargamos los datasets
    dataset_efectos : pd.DataFrame = pd.read_csv('../datasets/drogas_efectos.csv')
    dataset_drogas : pd.DataFrame = pd.read_csv('../datasets/Datos_2015-2019_Buenos.csv')

    # Dividimos los datasets por droga
    df_cig, df_alc, df_coc, df_mj, df_her, df_met = divide_data(dataset_drogas)

    # Para cada dataset, haremos un tratamiento de los datos
    df_cig = process_df(df_cig)
    df_alc = process_df(df_alc)
    df_coc = process_df(df_coc)
    df_mj = process_df(df_mj)
    df_her = process_df(df_her)
    df_met = process_df(df_met)

    # Metemos la informacion extraida en el dataset de efectos
    dataset_efectos = add_data(dataset_efectos, df_alc, 0)
    dataset_efectos = add_data(dataset_efectos, df_cig, 1)
    dataset_efectos = add_data(dataset_efectos, df_coc, 3)
    dataset_efectos = add_data(dataset_efectos, df_mj, 2)
    dataset_efectos = add_data(dataset_efectos, df_her, 4)
    dataset_efectos = add_data(dataset_efectos, df_met, 5)

    # Guardamos el dataset final
    dataset_efectos.to_csv('../datasets/dataset_tratados.csv', index=False)


if __name__ == '__main__':
    main()