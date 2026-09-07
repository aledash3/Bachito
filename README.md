# 🚗 Bachito: Sistema IoT de Detección de Baches en Tiempo Real con Dashboard Geoespacial

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-000000?style=for-the-badge&logo=espressif&logoColor=white)

---

## 📌 Descripción General

Este repositorio contiene el desarrollo integral del proyecto académico e investigativo **"Bachito"**, un ecosistema tecnológico Full-Stack y de Internet de las Cosas (IoT) diseñado para mitigar problemas de movilidad urbana mediante la auditoría vial automatizada, elaborado en la **Universidad Politécnica Salesiana** (Distinción en Casa Abierta 2026).

El objetivo principal consiste en detectar irregularidades en el asfalto (baches) utilizando sensores de hardware integrados en vehículos, y transmitir esta telemetría en tiempo real a una plataforma web centralizada. La plataforma ofrece mapas de calor, cálculo de proximidad GPS para prevención de accidentes y exportación de datos estadísticos.

---

## 🎯 Objetivos

### Objetivo General

Diseñar e implementar una arquitectura IoT de extremo a extremo capaz de detectar baches en tiempo real, procesar la información en un servidor seguro y visualizar los riesgos geolocalizados en una interfaz interactiva.

### Objetivos Específicos

- Configurar hardware embebido (ESP32) para capturar y filtrar datos de sensores ultrasónicos y de movimiento.
- Desarrollar una API RESTful en Node.js que gestione la autenticación de usuarios y almacene registros de telemetría de manera segura.
- Implementar validación y saneamiento de entradas para garantizar la integridad de los datos.
- Construir un panel administrativo en React con mapas interactivos de densidad geográfica (Heatmaps).
- Desarrollar un algoritmo de cálculo de distancia GPS en tiempo real para alertar a los usuarios de peligros inminentes a menos de 30 metros.

---

## 🏗️ Arquitectura del Sistema

El ecosistema se divide en tres capas principales interconectadas:

### 1️⃣ Capa de Hardware (Edge Computing)

- **Microcontrolador:** ESP32 programado en C++.
- **Sensores:** PIR (Sensor de movimiento) y HC-SR04 (Sensor Ultrasónico).
- **Lógica de Filtrado:** El sistema opera bajo un modelo orientado a eventos. Solo realiza peticiones HTTP al detectar una profundidad superior al umbral (`> 50cm`), implementando un *cooldown* de 5 segundos para prevenir saturación de red.

### 2️⃣ Capa de Backend (API REST)

- **Framework:** Node.js con Express.js.
- **Patrón de Diseño:** Modelo-Vista-Controlador (MVC) con rutas, controladores y modelos desacoplados.
- **Seguridad:** 
  - Autenticación y autorización basada en **JSON Web Tokens (JWT)**.
  - Cifrado unidireccional de contraseñas con `bcryptjs` (salt rounds = 10).
  - Variables de entorno centralizadas para evitar exposición de credenciales.

### 3️⃣ Capa de Frontend (Dashboard Reactivo)

- **Librerías Core:** React.js, Axios, React-Leaflet, Chart.js.
- **Características Clave:**
  - Renderizado de **Mapas de Calor** (HeatmapLayer) para identificar clústeres de daño vial.
  - Alertas dinámicas calculadas mediante la fórmula de Haversine para proximidad de coordenadas.
  - Generación nativa (Blob) de archivos CSV para exportación de auditorías.
  - Algoritmo de asignación GPS en caliente para emparejar reportes de hardware con coordenadas del dispositivo cliente.

---

## 📊 Estructura del Repositorio

El proyecto mantiene una separación limpia de responsabilidades:

```text
Bachito/
├── BachitoIno/       # Firmware C++ (Lógica de sensores y conexión WiFi para ESP32)
├── backend/          # API REST Node.js (Express, MongoDB Mongoose, Auth JWT)
└── frontend/         # SPA React (Mapas Leaflet, Dashboard, Descarga CSV)
```

---

## ⚙️ Requisitos

- Node.js (v18+)
- MongoDB (Local o Atlas)
- Arduino IDE o PlatformIO (con soporte para placa ESP32)

---

## 🚀 Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/aledash3/Bachito.git
cd Bachito
```

### 2. Iniciar el Backend (Servidor API)

```bash
cd backend
npm install
copy .env.example .env   # En Linux/Mac: cp .env.example .env
# Configura MONGO_URI y JWT_SECRET en el archivo .env
npm start                # Para desarrollo continuo: npm run dev
```
La API quedará disponible en `http://localhost:4000`. Endpoint de comprobación: `http://localhost:4000/api/health`.

### 3. Iniciar el Frontend (Dashboard Web)

En otra terminal:

```bash
cd frontend
npm install
copy .env.example .env   # En Linux/Mac: cp .env.example .env
npm start
```
La aplicación React se abrirá en `http://localhost:3000`.

### 4. Configurar el Firmware ESP32

1. Abrir `BachitoIno/BachitoIno.ino` en Arduino IDE.
2. Actualizar las credenciales `ssid` y `password` con la red Wi-Fi correspondiente.
3. Modificar `serverUrl` con la dirección IP y puerto del servidor backend (ej. `http://192.168.1.50:4000/api/sensores`).
4. Compilar y cargar el código en la placa ESP32.

---

## 🔬 Conclusiones Principales

- La arquitectura desacoplada en tres capas (Firmware, API y SPA) permitió la independencia tecnológica entre la sensorización embebida y el dashboard de visualización.
- El procesamiento geoespacial delegando el cálculo de distancias y renderizado de mapas de calor al frontend redujo la carga de procesamiento del servidor Node.js.
- La lógica restrictiva orientada a eventos en el firmware (C++) demostró ser vital para el ahorro de ancho de banda y almacenamiento en entornos de Internet de las Cosas.

---

## 👨‍💻 Autores

- **David Cruz**
- **Emily Ortega**
- **Carlos Pilatuña**

Carrera de Ingeniería en Ciencias de la Computación  
**Universidad Politécnica Salesiana**  
Quito, Ecuador

---

## 📜 Licencia

Este proyecto fue desarrollado con fines académicos y colaborativos dentro de la Universidad Politécnica Salesiana. Todos los derechos pertenecen a sus respectivos autores.
