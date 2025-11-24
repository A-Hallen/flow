# Stack tecnológico de la app USSD/SMS

## Objetivo de la app

- **Plataforma**: Android
- **Función principal**: Simplificar el uso de códigos USSD y transacciones asociadas.
- **Características clave**:
  - Lanzar operaciones USSD (consultar saldo, transferencias, etc.).
  - Detectar y parsear mensajes SMS de confirmación.
  - Mostrar historial de transacciones basado en SMS.
  - Escanear códigos QR para rellenar datos de transacción.

---

## Base del proyecto

- **Framework**: Expo + React Native
- **Tipo de proyecto**: Expo Managed (configuración vía `app.json` / `app.config.ts`).
- **Navegación**: `expo-router`.

Motivos:
- Facilita el build y debugging en Android.
- Configuración centralizada para iconos, permisos y plugins nativos.
- `expo-router` simplifica la estructura de pantallas basada en el sistema de archivos.

---

## Gestión de estado

- **Librería**: Zustand

Usos principales:
- Estado global ligero (filtros, UI, datos temporales de transacciones).
- No se usa Redux ni soluciones pesadas, porque:
  - No hay backend complejo.
  - No se requiere un árbol de estado muy grande.

---

## Estilos y diseño

- **Librería**: NativeWind
- **Inspiración**: Tailwind CSS

Ventajas:
- Sintaxis tipo Tailwind con `className` en componentes React Native.
- Facilita un diseño consistente y rápido.
- Encaja bien con Expo y el ecosistema RN.

---

## Animaciones

- **Base**: React Native Reanimated 3
- **Capa de alto nivel**: Moti

Motivos:
- Moti ofrece una API similar a Framer Motion, pero pensada para React Native.
- Reanimated asegura animaciones fluidas y con buen rendimiento en dispositivos Android.

Usos previstos:
- Transiciones suaves entre pantallas.
- Microinteracciones (botones, feedback visual al lanzar una transacción, etc.).

---

## Escaneo de códigos QR

- **Librería**: `expo-barcode-scanner`

Motivos:
- Integración sencilla en proyectos Expo Managed.
- Permite escanear códigos QR para:
  - Número de destino.
  - Monto de la transacción.
  - Tipo de operación (según el formato del QR que se defina).

Flujo típico:
- Botón "Escanear QR".
- Pantalla con vista de cámara.
- Al escanear, se parsea el contenido del QR y se rellena un objeto de transacción.
- Pantalla de confirmación para que el usuario revise antes de ejecutar el USSD.

---

## SMS y USSD (visión general)

### SMS

- Lectura de SMS para construir historial de transacciones:
  - Se filtran mensajes de emisores específicos (banco / operador).
  - Se aplican expresiones regulares para extraer monto, fecha, tipo de operación, saldo resultante.

- Consideraciones:
  - Se necesitan permisos Android (`READ_SMS` / `RECEIVE_SMS`).
  - Políticas de Google Play son estrictas; la distribución puede ser por APK directo si es necesario.

### USSD

- Uso de URIs `tel:*123%23` para lanzar códigos USSD.
- Limitaciones:
  - Android restringe la automatización e incluso la lectura de la respuesta USSD.
  - En muchos dispositivos, la respuesta se muestra solo en un popup del sistema.

- Enfoque:
  - La app estandariza y simplifica la entrada (qué código lanzar y cuándo).
  - El usuario puede seguir confirmando manualmente si la plataforma lo exige.

---

## Persistencia y caché

- Para la primera versión, el foco no está en almacenamiento complejo.
- Si se requiere persistir datos básicos (ej. preferencias, últimos filtros), se puede usar:
  - `AsyncStorage` (vía Expo) de forma simple.

No se usan por ahora:
- Bases de datos locales pesadas (SQLite, MMKV, etc.).
- Capa de caché avanzada (React Query / TanStack Query), porque no hay backend.

---

## Resumen del stack

- **Core**: Expo + React Native
- **Navegación**: `expo-router`
- **Estado global**: Zustand
- **Estilos**: NativeWind (estilo Tailwind)
- **Animaciones**: Reanimated 3 + Moti
- **QR**: `expo-barcode-scanner`
- **Persistencia básica (opcional)**: AsyncStorage
- **Integraciones de plataforma**: SMS + USSD (dependientes de permisos y limitaciones de Android)

Este stack está pensado para:
- Mantener el proyecto ligero y fácil de mantener.
- Permitir una UX moderna y fluida.
- Enfocarse en el caso de uso principal: facilitar las transacciones USSD y el seguimiento de SMS de confirmación.
