# Trabajo práctico 03

## Descripción

Este proyecto es el tercer trabajo práctico solicitado en el módulo 3 de la Diplomatura en Desarrollo Web Full Stack con Javascript dictada por el Nodo Tecnológico de Catamarca.

Es una pequeña API HTTP desarrollada empleando **Node.js** y **Express** para administrar temporalmente un catálogo de instrumentos musicales.

La aplicación permite:

* Consultar el estado de la API.
* Obtener el listado completo de instrumentos.
* Filtrar instrumentos por familia.
* Consultar el detalle de un instrumento mediante su identificador.
* Crear nuevos instrumentos en memoria.
* Utilizar códigos de estado HTTP coherentes.
* Cargar los datos iniciales desde un archivo JSON antes de iniciar el servidor.

Los datos iniciales se encuentran en `datos/instrumentos.json`.

La aplicación utiliza `app.use(express.json());` como middleware, ya que Express permite interpretar automáticamente los cuerpos de las solicitudes que contienen datos en formato JSON, haciendo posible acceder a ellos mediante `req.body`.

## Instalación

Clonar el repositorio y acceder a la carpeta del proyecto:
```bash
git clone https://github.com/nedaro34/tp-03-api-http-express
cd tp-03-api-http-express
```

Instala las dependencias ejecutando:
```bash
npm install
```

## Ejecución

Inicia el servidor con:
```bash
npm start
```

Una vez iniciado, la API estará disponible en:
```text
http://localhost:3000
```

Para detener el servidor, presiona `Ctrl + C` en tu terminal.

También se puede verificar la sintaxis del proyecto mediante:
```bash
npm run check
```

## Endpoints

### 1. Estado de la API

**Método:** `GET`

**URL:**

```text
/
```

Permite comprobar que la API se encuentra disponible.

**Respuesta esperada:** `200 OK`

---

### 2. Listar todos los instrumentos

**Método:** `GET`

**URL:**

```text
/api/instrumentos
```

Devuelve todos los instrumentos disponibles en la colección.

**Respuesta esperada:** `200 OK`

---

### 3. Filtrar instrumentos por familia

**Método:** `GET`

**URL:**

```text
/api/instrumentos?familia=cuerda
```

El filtro se realiza mediante el parámetro de consulta `familia`.

La comparación no distingue entre mayúsculas y minúsculas. Por ejemplo:

```text
/api/instrumentos?familia=cuerda
```

y

```text
/api/instrumentos?familia=CUERDA
```

deben producir el mismo resultado.

Si no existen instrumentos que coincidan con la familia solicitada, la API responde con:

**Estado:** `200 OK`

```json
[]
```

El filtro no modifica la colección original.

---

### 4. Obtener un instrumento por ID

**Método:** `GET`

**URL:**

```text
/api/instrumentos/:id
```

El `id` es un parámetro de ruta utilizado para identificar el instrumento que se desea consultar.

Si el instrumento existe la API retornará:

**Estado:** `200 OK` junto con un JSON el instrumento que tiene ese id.

Si el identificador no corresponde a ningún instrumento:

**Estado:** `404 Not Found` junto con un JSON que especifica el error.

---

### 5. Crear un instrumento

**Método:** `POST`

**URL:**

```text
/api/instrumentos
```

Para enviar datos en el cuerpo de la solicitud se utiliza:

```http
Content-Type: application/json
```

El cuerpo debe contener los siguientes campos:

* `nombre`
* `familia`
* `origen`
* `descripcion`
* `disponible`

El identificador no debe enviarse desde el cliente. La API lo genera automáticamente a partir del último registro.

Si la creación es correcta la API retorna:

**Estado:** `201 Created` junto con el instrumento creado junto con su identificador.

Si falta alguno de los campos obligatorios, retorna:

**Estado:** `400 Bad Request` junto con una especificación del error.

El instrumento no se agrega a la colección cuando la validación falla.


## Parámetros de ruta y parámetros de consulta

La API utiliza dos tipos de parámetros:

### Parámetro de ruta

Se utiliza para identificar un recurso específico. Ejemplo:

```text
/api/instrumentos/3
```

En este caso, `3` es un parámetro de ruta y se obtiene mediante:

```javascript
req.params.id
```

### Parámetro de consulta

Se utiliza para modificar o filtrar una consulta.

Ejemplo:

```text
/api/instrumentos?familia=viento
```

En este caso, `familia` es un parámetro de consulta y se obtiene mediante:

```javascript
req.query.familia
```

## Ejemplos de solicitudes

### Verificar estado de la API

```http
GET http://localhost:3000/
```

Respuesta:
```json
{
  "disponibilidadAPI": true
}
```

### Obtener todos los instrumentos

```http
GET http://localhost:3000/api/instrumentos
```
La API responderá retornando todos los instrumentos.

### Buscar instrumentos de una familia

```http
GET http://localhost:3000/api/instrumentos?familia=Percusión
```
La API responderá retornando todos los perteneciente a esa familia.

### Buscar un instrumento específico

```http
GET http://localhost:3000/api/instrumentos/1
```

Si el instrumento existe la API retornará:

```json
{
    "id": 1,
    "nombre": "Guitarra",
    "familia": "Cuerda",
    "origen": "España",
    "descripcion": "Instrumento de cuerda pulsada utilizado en diversos estilos musicales.",
    "disponible": true
}
```

Si el identificador no corresponde a ningún instrumento:

```json
{
  "error": "instrumento no encontrado"
}
```

### Crear un instrumento

```http
POST http://localhost:3000/api/instrumentos
Content-Type: application/json
```

```json
{
  "nombre": "Siku",
  "familia": "Viento",
  "origen": "Región andina",
  "descripcion": "Instrumento de viento formado por tubos de diferentes longitudes.",
  "disponible": true
}
```

En caso de éxito, la API retornará el mismo JSON pero con un id agregado, en caso contrario retornará un JSON con el error especificado.

## Códigos de estado

| Código | Significado | Uso en la API                                     |
| ------ | ----------- | ------------------------------------------------- |
| `200`  | OK          | Solicitudes GET realizadas correctamente          |
| `201`  | Created     | Instrumento creado correctamente                  |
| `400`  | Bad Request | Faltan datos obligatorios al crear un instrumento |
| `404`  | Not Found   | No existe el instrumento solicitado               |


## Persistencia de los datos

Los instrumentos iniciales se cargan desde:

```text
datos/instrumentos.json
```

Los instrumentos creados mediante `POST` se almacenan únicamente **en memoria** mientras el servidor permanece activo.

Por ejemplo, si se crea un nuevo instrumento mediante:

```http
POST /api/instrumentos
```

este aparecerá posteriormente en:

```http
GET /api/instrumentos
```

Sin embargo, los nuevos instrumentos **no se escriben en `instrumentos.json`**.

Por este motivo, cuando el servidor se reinicia, la aplicación vuelve a cargar los datos originales del archivo JSON y los instrumentos creados durante la ejecución anterior desaparecen.