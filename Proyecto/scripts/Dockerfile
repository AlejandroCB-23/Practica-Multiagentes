# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo en el contenedor
WORKDIR /app/scripts

# Copia el archivo de dependencias al contenedor
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto de los scripts
COPY . .

# Define el comando a ejecutar al iniciar el contenedor
CMD ["python", "prueba.py"]
