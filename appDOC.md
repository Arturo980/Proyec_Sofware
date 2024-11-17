### 1. **_layout.tsx (root)**:
Este archivo configura el layout raíz para la aplicación, utilizando `expo-router` y `react-navigation`. Aquí se carga una fuente personalizada y se maneja la pantalla de inicio (`SplashScreen`) mientras se cargan los recursos, como las fuentes. El esquema de color se ajusta dinámicamente según la preferencia del usuario (modo oscuro o claro) utilizando `useColorScheme`.

### 2. **html.tsx**:
Este archivo se utiliza únicamente en la web (cuando se está renderizando estáticamente en un entorno Node.js). Configura el HTML raíz de la página y aplica un estilo que asegura que el fondo no parpadee al cambiar entre el modo claro y oscuro.

### 3. **not-found.tsx**:
Este archivo gestiona la pantalla de "No encontrado" (404) cuando la ruta solicitada no existe. Muestra un mensaje y un enlace para redirigir al usuario a la pantalla principal (`home`).

### 4. **_layout.tsx (tabs)**:
En este archivo se configura la navegación por pestañas (`Tabs`) dentro de la aplicación. Se define la apariencia y las opciones de las pestañas, y cada pestaña puede tener su propio ícono y título. Además, maneja la configuración para que la cabecera no se muestre.

### 5. **explore.tsx**:
Este archivo es parte de una de las pestañas y muestra una pantalla de "Explorar" que contiene varios elementos colapsables (como componentes de documentación y ejemplos). También incluye una imagen de fondo y algunos componentes de ejemplo para ilustrar el uso de la aplicación.

### 6. **home.tsx**:
La pantalla de inicio (`HomeScreen`) contiene varias tarjetas interactivas que el usuario puede presionar para navegar a otras pantallas (como `resource`, `estado`, etc.). Además, incluye un botón flotante para compartir.

### 7. **index.txt**:
Este archivo contiene la pantalla principal de la aplicación. Desde aquí, el usuario puede navegar a diferentes secciones de la aplicación, como *Login*, *Home*, *Profile*, *Settings* y *Recurso* (Recursos). Se utiliza `useRouter` de `expo-router` para gestionar la navegación entre las pantallas.


### 8. ** profile.tsx**:
Este archivo define la pantalla de perfil de usuario. Aquí se muestra la información personal del usuario (como su nombre y correo electrónico), además de varias opciones disponibles como *Editar Perfil*, *Configuraciones* y *Cambiar Contraseña*. También incluye una opción para *Cerrar Sesión*.


### 9. ** resource.tsx**:

Este archivo contiene la pantalla de recursos. Aunque la descripción exacta no fue proporcionada, generalmente en aplicaciones de este tipo, la pantalla de *Recurso* podría ofrecer acceso a contenido adicional o funcionalidades específicas relacionadas con el servicio o la aplicación en general.


### 10. **settings.tsx**:

Este archivo define la pantalla de configuración, donde se pueden gestionar las preferencias y configuraciones del usuario dentro de la aplicación. Actualmente, se muestra solo un texto indicando que es la "Settings Screen", aunque probablemente en futuras actualizaciones se agregarán opciones específicas para el usuario.


### 11. **login.tsx**:

Este archivo contiene la pantalla de inicio de sesión, donde el usuario puede ingresar su nombre de usuario y contraseña para acceder a la aplicación. Proporciona los campos necesarios para la autenticación y un botón para enviar los datos de inicio de sesión.
