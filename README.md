# Bachito

Prototipo IoT para detectar irregularidades en la vía, registrar telemetría y visualizar eventos georreferenciados en una aplicación web.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Geoespacial-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)
[![C++](https://img.shields.io/badge/C++-ESP32%20Firmware-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://isocpp.org/)
[![ESP32](https://img.shields.io/badge/ESP32-Espressif-000000?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
![Licencia](https://img.shields.io/badge/Licencia-Acad%C3%A9mica%20y%20Educativa-blue?style=for-the-badge)

## Descripción

Bachito integra un dispositivo basado en ESP32, una API REST y una aplicación web geoespacial. El firmware toma lecturas con sensores HC-SR04 y PIR, clasifica eventos mediante un umbral configurable y envía la telemetría al servidor por HTTP. La plataforma web consulta los registros, los representa sobre mapas de Leaflet y calcula la proximidad entre el usuario y los eventos mediante la fórmula de Haversine.

El panel administrativo permite consultar estadísticas, visualizar un mapa de calor, actualizar el estado de los registros y exportar la información en formato CSV.

El prototipo fue desarrollado en la Universidad Politécnica Salesiana y recibió una distinción en la Casa Abierta UPS 2026.

## Estado y alcance

Este repositorio contiene un prototipo académico funcional. Su alcance actual incluye:

- Detección experimental de irregularidades mediante un umbral de distancia.
- Envío de telemetría desde el ESP32 hacia una API REST.
- Persistencia de registros en MongoDB.
- Geolocalización desde el navegador del usuario.
- Actualización periódica del mapa cada cuatro segundos.
- Alertas de proximidad para eventos ubicados a menos de 30 metros.
- Panel administrativo con estadísticas, mapa de calor y exportación CSV.
- Registro e inicio de sesión con contraseñas cifradas mediante `bcryptjs` y emisión de tokens JWT.

No se ha realizado una validación vial en producción ni se dispone de mediciones concluyentes sobre precisión, ahorro de ancho de banda o rendimiento a escala. El umbral de detección y la ubicación de los sensores deben calibrarse para cada montaje físico.

## Arquitectura

```text
┌─────────────────────────────────────────────┐
│ Dispositivo IoT                             │
│ ESP32 + HC-SR04 + PIR + indicadores LED     │
│ Firmware C++ y conexión Wi-Fi               │
└─────────────────────┬───────────────────────┘
                      │ POST /api/sensores
                      │ JSON sobre HTTP
                      ▼
┌─────────────────────────────────────────────┐
│ API REST                                    │
│ Node.js + Express + Mongoose                 │
│ Autenticación JWT y persistencia en MongoDB │
└─────────────────────┬───────────────────────┘
                      │ Consulta periódica
                      ▼
┌─────────────────────────────────────────────┐
│ Aplicación web                              │
│ React + Leaflet + Chart.js                  │
│ Mapa, alertas, estadísticas y exportación   │
└─────────────────────────────────────────────┘
```

### Flujo de un evento

1. El sensor PIR habilita la lectura del sensor ultrasónico.
2. El firmware compara la distancia con el umbral configurado.
3. Cuando identifica un evento, envía la lectura a la API y aplica un intervalo de cinco segundos para reducir registros consecutivos.
4. Si el registro no contiene coordenadas, la aplicación web puede asociarle la ubicación obtenida desde el navegador.
5. El mapa consulta los datos cada cuatro segundos y calcula la distancia al evento activo más cercano.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Dispositivo | ESP32, C++, HC-SR04, PIR, Wi-Fi y HTTP |
| Backend | Node.js, Express 5, Mongoose, JWT y bcryptjs |
| Base de datos | MongoDB local o MongoDB Atlas |
| Frontend | React 19, React Router, Axios, Leaflet y Chart.js |

## Estructura del repositorio

```text
Bachito/
├── BachitoIno/
│   └── BachitoIno.ino         # Firmware del ESP32
├── backend/
│   ├── src/
│   │   ├── config/            # Conexión con MongoDB
│   │   ├── controllers/       # Procesamiento de telemetría
│   │   ├── middleware/        # Verificación de tokens JWT
│   │   ├── models/            # Modelos de Mongoose
│   │   ├── routes/            # Rutas de autenticación y sensores
│   │   └── app.js             # Configuración de Express
│   ├── package.json
│   └── server.js              # Punto de entrada del servidor
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navegación y componentes compartidos
│   │   ├── pages/             # Mapa, configuración y administración
│   │   ├── utils/             # Cálculo de distancia con Haversine
│   │   ├── App.js             # Rutas y estado global
│   │   └── config.js          # URL base de la API
│   └── package.json
└── README.md
```

## Requisitos

- Node.js 18 o superior.
- Una instancia local de MongoDB o un clúster de MongoDB Atlas.
- Arduino IDE o PlatformIO con soporte para placas ESP32.
- Una placa ESP32, un sensor ultrasónico HC-SR04, un sensor PIR y los componentes electrónicos del montaje.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/aledash3/Bachito.git
cd Bachito
```

### 2. Configurar el backend

Instala las dependencias desde el archivo de bloqueo:

```bash
cd backend
npm ci
```

Crea `backend/.env` con una configuración equivalente a la siguiente:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/bachito
JWT_SECRET=reemplaza_este_valor_por_una_clave_segura
PORT=4000
```

Inicia la API:

```bash
npm start
```

La comprobación de estado estará disponible en `http://localhost:4000/api/health`.

### 3. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm ci
```

Para las vistas que utilizan la configuración centralizada, puedes definir la API en `frontend/.env`:

```dotenv
REACT_APP_API_URL=http://localhost:4000/api
```

Después inicia la aplicación:

```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`.

> La vista principal del mapa conserva actualmente la URL del despliegue de demostración en su código. Para una ejecución completamente local, actualiza `urlBackend` en `frontend/src/pages/MapaPage.js`. Esta configuración está registrada como una limitación pendiente de centralización.

### 4. Configurar el firmware

1. Abre `BachitoIno/BachitoIno.ino` en Arduino IDE o PlatformIO.
2. Define `ssid` y `password` con las credenciales de la red Wi-Fi.
3. Cambia `serverUrl` por la dirección de la API, por ejemplo `http://192.168.1.50:4000/api/sensores`.
4. Verifica los pines y el umbral de detección según el montaje físico.
5. Compila y carga el firmware en el ESP32.

## API REST

| Método | Ruta | Descripción | Autorización en el backend |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Comprueba el estado de la API | Pública |
| `POST` | `/api/auth/register` | Registra un usuario | Pública |
| `POST` | `/api/auth/login` | Inicia sesión y emite un token JWT | Pública |
| `GET` | `/api/sensores` | Consulta los registros de telemetría | Pública |
| `POST` | `/api/sensores` | Registra telemetría del dispositivo | Pública |
| `PATCH` | `/api/sensores/:id` | Actualiza coordenadas o estado | Pública actualmente |
| `DELETE` | `/api/sensores/:id` | Elimina un registro | Pública actualmente |

Ejemplo de telemetría enviada por el dispositivo:

```json
{
  "deviceId": "ESP32-01",
  "movimiento": true,
  "distancia": 63.4,
  "bache": true
}
```

## Limitaciones conocidas

- Las rutas de telemetría todavía no aplican el middleware JWT en el backend. Las restricciones del panel administrativo existen en el cliente, pero no sustituyen la autorización del servidor.
- El registro permite solicitar el rol de administrador desde una ruta pública; este flujo debe restringirse antes de un despliegue productivo.
- La vista del mapa utiliza directamente la URL del despliegue de demostración en lugar de la configuración centralizada.
- La geolocalización se obtiene desde el navegador y puede asociarse al evento más reciente que todavía no tenga coordenadas.
- La API aplica validaciones básicas y requiere controles adicionales de esquema, rangos, tasa de solicitudes y origen antes de exponerse a producción.
- El prototipo utiliza consultas periódicas cada cuatro segundos y no una conexión en tiempo real mediante WebSocket.

## 👨‍💻 Autores

El proyecto fue desarrollado de forma colaborativa por:

* **David Alejandro Cruz Palacios** — [@aledash3](https://github.com/aledash3)
* **Emily Mabel Ortega Constante** — [@BOOTEABLE](https://github.com/BOOTEABLE)
* **Carlos José Pilatuña Roldan** — [@Katsuro03](https://github.com/Katsuro03)

Carrera de Ingeniería en Ciencias de la Computación  
Asignaturas: **Programación y Plataformas Web** & **Sistemas Embebidos** (5to Semestre)  
**Universidad Politécnica Salesiana (UPS)**  
Quito, Ecuador

## Contribución de David Cruz

La contribución de David Alejandro Cruz Palacios se concentró en el prototipado del circuito electrónico y el desarrollo del firmware C++ para el ESP32 encargado de capturar y enviar telemetría. Este repositorio conserva los créditos del equipo original.

## 📜 Licencia

Este proyecto fue desarrollado exclusivamente con fines académicos, educativos y de divulgación científica en la **Universidad Politécnica Salesiana (UPS)**.

Todos los derechos reservados conforme a las normativas de desarrollo académico e institucional. Prohibido su uso comercial no autorizado.
