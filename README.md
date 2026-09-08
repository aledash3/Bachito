# 🚗 Bachito: Sistema IoT de Detección de Baches en Tiempo Real con Dashboard Geoespacial

**Ecosistema tecnológico de extremo a extremo para la auditoría vial inteligente: adquisición de datos con ESP32, backend seguro en Node.js y visualización geoespacial reactiva en React con Leaflet.**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Geoespacial-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)
[![C++](https://img.shields.io/badge/C++-ESP32%20Firmware-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://isocpp.org/)
[![ESP32](https://img.shields.io/badge/ESP32-Espressif-000000?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
![Licencia](https://img.shields.io/badge/Licencia-Acad%C3%A9mica%20y%20Educativa-blue?style=for-the-badge)

---

## Contribución de David Cruz / My contribution

Proyecto colaborativo de David Alejandro Cruz Palacios, Emily Mabel Ortega Constante y Carlos José Pilatuña Roldan. Mi aporte se centró en el prototipado del circuito electrónico y el firmware C++ del ESP32 para enviar telemetría a la plataforma web. Este fork conserva los créditos del equipo original.

This is a collaborative project by David Alejandro Cruz Palacios, Emily Mabel Ortega Constante and Carlos José Pilatuña Roldan. My contribution focused on circuit prototyping and ESP32 C++ firmware sending telemetry to the web platform. This fork preserves the original team credits.

### Alcance del prototipo / Prototype scope

Prototipo académico presentado en la Casa Abierta UPS 2026. No se ha demostrado aquí validación vial en producción ni una medición del ahorro de ancho de banda. Las afirmaciones de rendimiento deben acompañarse de resultados medidos.

Academic prototype presented at UPS Open House 2026. Production road validation and bandwidth savings are not demonstrated here; performance claims require measured results.

## 📌 Descripción General

**Bachito** es un ecosistema tecnológico Full-Stack y de Internet de las Cosas (IoT) diseñado para mitigar problemas de movilidad urbana y deterioro de infraestructura vial mediante la auditoría automatizada en tiempo real, desarrollado en la **Universidad Politécnica Salesiana** (*Distinción en Casa Abierta 2026 de la UPS*).

El sistema integra sensores de hardware montados en vehículos para registrar anomalías de profundidad en el asfalto (baches) y enviar telemetría instantánea vía Wi-Fi/HTTP hacia una nube centralizada. La plataforma web React procesa las coordenadas GPS, proyecta mapas de calor de densidad vial y calcula distancias de proximidad (fórmula de Haversine) para alertar al conductor sobre riesgos viales inminentes.

---

## 🏛️ Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────────┐
│                 Capa 1: Edge Computing (Hardware)               │
│  - Microcontrolador ESP32 (Firmware C++)                        │
│  - Sensor Ultrasónico HC-SR04 + Sensor de Movimiento PIR        │
│  - Filtrado por umbral (>50 cm) y cooldown anti-saturación (5s) │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼ HTTP POST (JSON Payload / WiFi)
┌─────────────────────────────────────────────────────────────────┐
│                 Capa 2: Backend API RESTful                     │
│  - Servidor Node.js con Express.js (Arquitectura MVC)           │
│  - Autenticación y Autorización basada en JWT + bcryptjs        │
│  - Validación y saneamiento estricto de telemetría              │
│  - Persistencia documental en MongoDB (Mongoose)                │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼ REST API (Endpoints Seguros)
┌─────────────────────────────────────────────────────────────────┐
│                 Capa 3: Dashboard Web Reactivo                  │
│  - SPA React 18 con React-Leaflet y soporte para Dark Mode      │
│  - HeatmapLayer para visualización de clústeres viales          │
│  - Algoritmo de Haversine: alertas de proximidad (< 30 metros) │
│  - Exportación de telemetría a formato CSV para auditoría       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Objetivos

### Objetivo General
Diseñar e implementar una arquitectura IoT de extremo a extremo capaz de detectar baches en tiempo real, procesar la información en un servidor seguro y visualizar los riesgos geolocalizados en una interfaz interactiva.

### Objetivos Específicos
1. **Sensorización Embebida**: Configurar el microcontrolador ESP32 con sensores HC-SR04 y PIR con lógica de eventos eficiente.
2. **Backend Robusto**: Desarrollar una API RESTful en Node.js/Express con seguridad JWT y persistencia en MongoDB.
3. **Visualización Geoespacial**: Construir un panel administrativo interactivo en React con mapas Leaflet y capas térmicas.
4. **Seguridad Vial Preventiva**: Implementar algoritmo de distancia euclidiana/esférica (Haversine) para avisos en tiempo real al aproximarse a un bache.

---

## 🔌 Especificación de la API REST

| Método | Endpoint | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Comprobación de estado operativo del servidor | No |
| `POST` | `/api/auth/register` | Registro de nuevos usuarios administradores | No |
| `POST` | `/api/auth/login` | Autenticación y emisión de token JWT | No |
| `GET` | `/api/sensores` | Lista de registros de telemetría y baches detectados | No |
| `POST` | `/api/sensores` | Ingesta de telemetría enviada desde el microcontrolador ESP32 | No |
| `DELETE` | `/api/sensores/:id` | Eliminación de registro de telemetría | Sí (JWT) |

---

## 📂 Estructura del Repositorio

```text
Bachito/
├── BachitoIno/
│   └── BachitoIno.ino        # Firmware en C++ (lectura ultrasónica, filtro y WiFi)
├── backend/
│   ├── src/
│   │   ├── config/           # Conexión a base de datos MongoDB
│   │   ├── controllers/      # Controladores de negocio (sensores, usuarios)
│   │   ├── middleware/       # Verificación de tokens JWT
│   │   ├── models/           # Esquemas Mongoose (SensorData, User)
│   │   ├── routes/           # Enrutamiento de endpoints
│   │   └── app.js            # Configuración de Express, CORS y middlewares
│   ├── package.json          # Dependencias y scripts del backend
│   └── server.js             # Punto de entrada del servidor Node.js
├── frontend/
│   ├── public/               # Metadatos e iconos de la aplicación web
│   ├── src/
│   │   ├── components/       # Barra de navegación y componentes reutilizables
│   │   ├── pages/            # Vistas (Mapa interactivo, Login, Registro, Admin)
│   │   ├── utils/            # Cálculo geográfico Haversine (gpsHelpers.js)
│   │   └── App.js            # Router principal y estados globales
│   └── package.json          # Dependencias y scripts de React
└── README.md                 # Documentación técnica general
```

---

## ⚙️ Requisitos e Instalación

### Prerrequisitos
* **Node.js**: v18.0 o superior
* **MongoDB**: Instancia local o cluster en MongoDB Atlas
* **Arduino IDE** o PlatformIO (con paquete de placas ESP32 instalado)

### 1. Clonar el repositorio
```bash
git clone https://github.com/aledash3/Bachito.git
cd Bachito
```

### 2. Iniciar el Backend (Servidor API)
```bash
cd backend
npm install
copy .env.example .env   # En Linux/macOS: cp .env.example .env
# Configura MONGO_URI y JWT_SECRET en el archivo .env
npm start                # Para desarrollo con recarga: npm run dev
```
> La API quedará disponible en `http://localhost:4000`. Comprobación: `http://localhost:4000/api/health`.

### 3. Iniciar el Frontend (Dashboard Web)
En otra terminal:
```bash
cd frontend
npm install
copy .env.example .env   # En Linux/macOS: cp .env.example .env
npm start
```
> La aplicación React se abrirá automáticamente en `http://localhost:3000`.

### 4. Configuración del Firmware ESP32
1. Abrir `BachitoIno/BachitoIno.ino` en Arduino IDE.
2. Definir las credenciales de red Wi-Fi (`ssid` y `password`).
3. Especificar la dirección del backend en `serverUrl` (ej. `http://192.168.1.50:4000/api/sensores`).
4. Compilar y cargar el firmware en la placa ESP32.

---

## 🔬 Conclusiones Principales

1. **Desacoplamiento Efectivo**: La división en tres capas (Firmware, API y SPA) permitió total independencia tecnológica entre la sensorización embebida y el panel de visualización.
2. **Eficiencia en el Borde**: La lógica orientada a eventos en el firmware C++ incorpora un intervalo entre eventos para limitar la frecuencia de envío; su efecto sobre el tráfico requiere medición.
3. **Procesamiento Distribuido**: Delegar los cálculos de proximidad (Haversine) y el renderizado geoespacial al cliente React optimizó los recursos de cómputo del backend.

---

## 👨‍💻 Autores

Este proyecto fue desarrollado de forma colaborativa por:

* **David Alejandro Cruz Palacios** — [@aledash3](https://github.com/aledash3)
* **Emily Mabel Ortega Constante** — [@BOOTEABLE](https://github.com/BOOTEABLE)
* **Carlos José Pilatuña Roldan** — [@Katsuro03](https://github.com/Katsuro03)

Carrera de Ingeniería en Ciencias de la Computación
Asignaturas: **Programación y Plataformas Web** & **Sistemas Embebidos** (5to Semestre)
**Universidad Politécnica Salesiana (UPS)**
Quito, Ecuador

---

## 📜 Licencia

Este proyecto fue desarrollado exclusivamente con fines académicos, educativos y de divulgación científica en la **Universidad Politécnica Salesiana (UPS)**.

Todos los derechos reservados conforme a las normativas de desarrollo académico e institucional. Prohibido su uso comercial no autorizado.
