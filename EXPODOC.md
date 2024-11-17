# Carpeta `.expo`

Esta carpeta contiene archivos y configuraciones relacionadas con el entorno de Expo para la aplicación. Específicamente, contiene configuraciones para dispositivos y tipos utilizados por el enrutador de Expo.

## Archivos

### `devices.json`

Este archivo contiene un objeto JSON con información sobre los dispositivos registrados en el proyecto. Actualmente, no se han registrado dispositivos en este archivo.

### Descripción del archivo `router.d.ts`

Este archivo define las rutas de la aplicación, especificando que no hay rutas dinámicas y detallando las rutas estáticas disponibles. Las rutas definidas son aquellas que se utilizarán para la navegación dentro de la aplicación, y se organizan de acuerdo a las pestañas principales (`tabs`).

**Rutas estáticas definidas:**
- `/` - Ruta principal
- `/(tabs)` - Ruta de pestañas principales
- Rutas dentro de las pestañas como `/auth/login`, `/explore`, `/home`, `/profile`, `/resource`, y `/settings`
- Otros: `/auth/login`, `/explore`, `/home`, `/profile`, `/resource`, `/settings`, y `/_sitemap`

## Propósito

Esta carpeta tiene como principal función almacenar configuraciones y tipos para la correcta gestión de rutas y dispositivos en la aplicación Expo. Es un componente importante para el flujo de trabajo del enrutamiento, pero no contiene funcionalidades directas de la interfaz de usuario.

### **Notas**

- La carpeta `.expo` es una carpeta generada automáticamente por el ecosistema de Expo y generalmente no requiere modificación directa, excepto en casos específicos de configuración.
- Los archivos `devices.json` y `router.d.ts` se utilizan para manejar las configuraciones de dispositivos y las rutas en la aplicación Expo, respectivamente.
