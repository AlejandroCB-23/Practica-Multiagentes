# Usa una imagen oficial de Node.js para construir la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código de la aplicación
COPY . .

# Cambia el permiso de la carpeta app (descomentar esta linea si es necesario)
#RUN chmod -R 755 /app

# Ejecuta el build de la aplicación para producción
RUN npm run build

# Usa una imagen de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos de la build al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia el archivo de configuración personalizado de NGINX
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto en el que Nginx está sirviendo la aplicación
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]