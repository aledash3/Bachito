#include <WiFi.h>
#include <HTTPClient.h>

// ================= CONFIGURACIÓN WIFI & API =================
// Configura los datos de tu red Wi-Fi
const char* ssid = "TU_SSID_WIFI";
const char* password = "TU_PASSWORD_WIFI";

// URL del backend (reemplaza con la IP local o dominio de tu servidor)
// Ejemplo local: "http://192.168.1.50:4000/api/sensores"
// Ejemplo nube:  "https://tu-dominio.duckdns.org/api/sensores"
const char* serverUrl = "http://192.168.1.50:4000/api/sensores";

// ================= ASIGNACIÓN DE PINES =================
#define PIR_PIN        27   // Sensor de movimiento PIR
#define TRIG_PIN       26   // Trigger sensor ultrasónico HC-SR04
#define ECHO_PIN       25   // Echo sensor ultrasónico HC-SR04
#define LED_alerta     18   // 🚨 LED Rojo: Bache detectado
#define LED_correcto   19   // ✅ LED Verde: Calle normal

// Umbral de profundidad para clasificar un bache (en cm)
#define BACHE_UMBRAL 50

// ================= FUNCIONES AUXILIARES =================
float leerDistancia() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duracion = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duracion == 0) return -1;

  return (duracion * 0.0343) / 2;
}

void verificarConexionWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("📶 Reconectando a WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    int intentos = 0;
    while (WiFi.status() != WL_CONNECTED && intentos < 10) {
      delay(500);
      Serial.print(".");
      intentos++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ WiFi reconectado exitosamente");
    } else {
      Serial.println("\n⚠️ No se pudo reconectar a WiFi");
    }
  }
}

// ================= INICIALIZACIÓN (SETUP) =================
void setup() {
  Serial.begin(115200);
  Serial.println("\n--- INICIALIZANDO DISPOSITIVO BACHITO IOT ---");

  pinMode(PIR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_alerta, OUTPUT);
  pinMode(LED_correcto, OUTPUT);

  // Estado inicial de indicadores
  digitalWrite(LED_alerta, LOW);
  digitalWrite(LED_correcto, HIGH);

  WiFi.begin(ssid, password);
  Serial.print("Conectando a red WiFi: ");
  Serial.println(ssid);
  
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi conectado satisfactoriamente");
    Serial.print("Dirección IP asignada: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n⚠️ No fue posible conectar a WiFi al iniciar. Se reintentará en bucle.");
  }
}

// ================= BUCLE PRINCIPAL (LOOP) =================
void loop() {
  bool movimiento = digitalRead(PIR_PIN);

  if (movimiento) {
    float distancia = leerDistancia();

    if (distancia != -1) {
      if (distancia > BACHE_UMBRAL) {
        Serial.println("\n--------------------------------");
        Serial.println("⚠️ ALERTA: ¡BACHE DETECTADO!");
        Serial.print("📏 Profundidad registrada: ");
        Serial.print(distancia);
        Serial.println(" cm");

        // Activar señalización visual de alerta
        digitalWrite(LED_alerta, HIGH);
        digitalWrite(LED_correcto, LOW);

        // Transmisión telemétrica al backend
        verificarConexionWiFi();
        if (WiFi.status() == WL_CONNECTED) {
          HTTPClient http;
          http.begin(serverUrl);
          http.addHeader("Content-Type", "application/json");

          String payload = "{";
          payload += "\"deviceId\":\"ESP32-01\",";
          payload += "\"movimiento\":true,";
          payload += "\"distancia\":" + String(distancia, 2) + ",";
          payload += "\"bache\":true";
          payload += "}";

          Serial.print("📤 Transmitiendo reporte a servidor... ");
          int responseCode = http.POST(payload);

          if (responseCode > 0) {
            Serial.print("✅ Éxito (HTTP ");
            Serial.print(responseCode);
            Serial.println(")");
          } else {
            Serial.print("❌ Error de transmisión: ");
            Serial.println(http.errorToString(responseCode).c_str());
          }
          http.end();

          // Cooldown de 5s para evitar registros duplicados sobre el mismo bache
          delay(5000);
        } else {
          Serial.println("📶 Error: Conexión WiFi no disponible para enviar reporte.");
        }
      } else {
        // Calle en condiciones normales
        digitalWrite(LED_alerta, LOW);
        digitalWrite(LED_correcto, HIGH);
        delay(100);
      }
    }
  } else {
    // Sin detección de movimiento
    digitalWrite(LED_alerta, LOW);
    digitalWrite(LED_correcto, HIGH);
    delay(500);
  }
}
