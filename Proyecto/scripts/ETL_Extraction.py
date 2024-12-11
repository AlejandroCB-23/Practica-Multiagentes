import requests
import pandas as pd
from bs4 import BeautifulSoup


def extraer_sintomas_de_destacado(url, nombre_droga):
    '''
    Extrae los síntomas de un div con la clase 'destacado' en una página web.
    '''
    lista_sintomas = []

    # Realizar la solicitud HTTP
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Buscar el div con la clase 'destacado'
    destacado = soup.find('div', class_='destacado')

    if destacado:
        # Buscar todos los <li> dentro del div 'destacado'
        lista_li = destacado.find_all('li')
        for li in lista_li:
            texto = li.text.strip()  # Corregido aquí: .strip() en lugar de .pristrip()
            if texto:  # Asegurarse de que el texto no esté vacío
                lista_sintomas.append(texto)

    return {nombre_droga: lista_sintomas}



def extraer_efectos_corto_plazo():
    '''
    Extrae los efectos a corto plazo de las drogas.
    '''
    sintomas = {}

    # Tabaco
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/tabaco/menuTabaco/efectos.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Tabaco"))

    # Marihuana
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/cannabis/menuCannabis/efectos.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Marihuana"))

    # Cocaína
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/cocaina/menuCocaina/efectos.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Cocaína"))

    # Heroína
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/heroina/menuHeroina/efectos.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Heroína"))

    # Alcohol
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/alcohol/menuAlcohol/cortoPlazo.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    negrita = soup.find_all('span', class_='negrita')
    
    lista_sintomas = []
    for i, negrita in enumerate(negrita):
        if i < 2:  # Limitar a los primeros dos elementos
            texto_negrita = negrita.text.strip()
            if texto_negrita:  # Asegurarse de que no esté vacío
                lista_sintomas.append(texto_negrita)

    sintomas["Alcohol"] = lista_sintomas

    # Metanfetamina
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/sustanciasPsicoactivas/metanfetamina/menuMetanfetamina/cortoPlazo.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    negrita = soup.find_all('span', class_='negrita')

    lista_sintomas = []
    for negrita in negrita:
        texto_negrita = negrita.text.strip()
        if texto_negrita:  # Asegurarnos de que no esté vacío
            lista_sintomas.append(texto_negrita)

    sintomas["Metanfetamina"] = lista_sintomas

    return sintomas


def extraer_efectos_largo_plazo():
    '''
    Extrae los efectos a largo plazo de las drogas.
    '''
    sintomas = {}

    # Tabaco
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/tabaco/menuTabaco/riesgos.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    negrita = soup.find_all('span', class_='negrita')
    
    lista_sintomas = []
    for i, negrita in enumerate(negrita):
        if i < 12:  # Limitar a los primeros dos elementos
            texto_negrita = negrita.text.strip()
            if texto_negrita:  
                lista_sintomas.append(texto_negrita)
    
    sintomas["Tabaco"] = lista_sintomas

    # Alcohol
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/alcohol/menuAlcohol/largoPlazo.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    negrita = soup.find_all('span', class_='negrita')
    
    lista_sintomas = []
    for i, negrita in enumerate(negrita):
        if i < 14:  # Limitar a los primeros dos elementos
            texto_negrita = negrita.text.strip()
            if texto_negrita:  
                lista_sintomas.append(texto_negrita)
    
    sintomas["Alcohol"] = lista_sintomas


    # Marihuana
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/cannabis/menuCannabis/riesgosConsecuencias.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Marihuana"))

    #Cocaína
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/cocaina/menuCocaina/medioLargo.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Cocaína"))

    #Heroína
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/heroina/menuHeroina/riesgos.htm'
    sintomas.update(extraer_sintomas_de_destacado(url, "Heroína"))

    #Metanfetamina
    url = f'https://pnsd.sanidad.gob.es/ciudadanos/informacion/sustanciasPsicoactivas/metanfetamina/menuMetanfetamina/largoPlazo.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    negrita = soup.find_all('span', class_='negrita')

    lista_sintomas = []
    for i, negrita in enumerate(negrita):
        if i < 8:  # Limitar a los primeros ocho elementos
            texto_negrita = negrita.text.strip()
            if texto_negrita:  
                lista_sintomas.append(texto_negrita)
    
    sintomas["Metanfetamina"] = lista_sintomas


    return sintomas


def extraer_parrafo_despues_historia(drogas):

    '''
    Extrae el primer párrafo después de la sección "Historia" de la página de Wikipedia de cada droga.
    '''
    parrafos = {}

    for droga in drogas:
        url = f'https://es.wikipedia.org/wiki/{droga}'
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Buscar el h2 con el texto "Historia"
        h2_objetivo = soup.find('h2', id="Historia")
        
        if h2_objetivo:
            # Buscar la clase que contiene este h2
            contenedor_clase = h2_objetivo.find_parent()  # Encuentra el contenedor que tiene este h2

            # Buscar el primer párrafo inmediatamente después de esta clase
            siguiente_parrafo = contenedor_clase.find_next("p")  
            
            if siguiente_parrafo:
                parrafo_texto = siguiente_parrafo.get_text(strip=True)
            else:
                parrafo_texto = ''  
        else:
            parrafo_texto = ''  
        
        # Asignar el parrafo correspondiente para la droga
        if droga == "Cannabis_(psicotrópico)":
            parrafos["Marihuana"] = parrafo_texto
        else:
            parrafos[droga] = parrafo_texto

    return parrafos


def limpiar_texto(texto):
    '''
    Limpia el texto eliminando los saltos de línea y los caracteres invisibles.
    '''
    texto = texto.replace("\n", " ")  # Reemplazar saltos de línea por espacios
    texto = texto.replace("\u200b", "")  # Eliminar los caracteres invisibles
    return texto


def combinar_datos(drogas, efectos_corto_plazo, efectos_largo_plazo, historia):
    '''
    Combina los datos de los efectos de corto plazo, largo plazo y el primer párrafo en un DataFrame.
    '''

    datos = []

    for droga in drogas:
        # Obtener efectos de corto plazo, largo plazo y primer párrafo
        efectos_corto = ", ".join(efectos_corto_plazo.get(droga, []))  
        efectos_largo = ", ".join(efectos_largo_plazo.get(droga, []))  
        parrafo = historia.get(droga, '')  
        
        # Limpiar el párrafo
        parrafo = limpiar_texto(parrafo)

        # Añadir una fila con los datos
        datos.append([droga, efectos_corto, efectos_largo, parrafo])

    # Crear un DataFrame de pandas
    df = pd.DataFrame(datos, columns=["droga", "efectos_corto_plazo", "efectos_largo_plazo", "historia"])

    return df


def extraccion():

    # Extraer los efectos de corto plazo, largo plazo y el primer párrafo
    efectos_corto_plazo = extraer_efectos_corto_plazo()

    efectos_largo_plazo = extraer_efectos_largo_plazo()

    drogas = ["Alcohol","Tabaco","Cannabis_(psicotrópico)", "Cocaína", "Heroína", "Metanfetamina"]
    historia = extraer_parrafo_despues_historia(drogas)


    # Combinar los tres diccionarios en un DataFrame
    drogas = ["Alcohol","Tabaco","Marihuana", "Cocaína", "Heroína", "Metanfetamina"]
    df = combinar_datos(drogas, efectos_corto_plazo, efectos_largo_plazo, historia)



    # Guardar el DataFrame en un archivo CSV
    df.to_csv('../datasets/drogas_efectos.csv', index=False, encoding='utf-8')