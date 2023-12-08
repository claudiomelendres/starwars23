<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. clonar el repositorio
2. Ejecuatar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up -d

```

5. Clonar el archivo **.env.template** y renombrar la copia a **.env**

6. llenar las variables de entorno definidas en el `.env`

7. Ejecutar la aplicacion en dev:
   `yarn start:dev`

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

## Stack usado

- MongoDB
- Nest

# Prod Build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notas

Heroku redeploy sin cambios

```
git commit --allow-empty -m "Trigger Heroku deploy"
git push heroku main
```
