### **Carpeta `components`**

La carpeta `components` contiene diversos archivos y subcarpetas que gestionan los componentes reutilizables en la aplicación. A continuación se detallan los archivos y carpetas que la componen:

#### **Archivos:**

1. **`Collapsible.tsx`**  
   Este componente crea una vista colapsable que permite mostrar u ocultar contenido cuando se hace clic en el título. Utiliza el ícono de chevrón para indicar si la sección está expandida o colapsada.  
   - **Props**:  
     - `title`: Título que se muestra en la cabecera de la vista colapsable.  
     - `children`: Contenido que se muestra u oculta al interactuar con el componente.

2. **`ExternalLink.tsx`**  
   Este componente permite abrir un enlace en el navegador del dispositivo, manejando el comportamiento tanto para la web como para plataformas móviles (abre el enlace en un navegador dentro de la app).  
   - **Props**:  
     - `href`: URL que se abrirá al hacer clic en el enlace.

3. **`HelloWave.tsx`**  
   Componente que muestra un texto animado con un emoji de saludo 👋, el cual realiza un movimiento de rotación repetido.  
   - Utiliza **`react-native-reanimated`** para la animación, con una rotación de 25 grados que se repite varias veces.

4. **`ParallaxScrollView.tsx`**  
   Este componente implementa un efecto parallax en una vista de desplazamiento, donde la imagen de cabecera se desplaza y escala en función del desplazamiento del usuario en la lista.  
   - **Props**:  
     - `headerImage`: Imagen que se utiliza como cabecera de la vista parallax.  
     - `headerBackgroundColor`: Colores de fondo para los temas claro y oscuro.  
   - Se utiliza **`react-native-reanimated`** para gestionar la animación y la interpolación de los valores de desplazamiento.

5. **`ThemedText.tsx`**  
   Componente para mostrar texto con estilos personalizados basados en el tema de la aplicación (claro u oscuro). Admite varios tipos de texto como título, subtítulo, y texto de enlace.  
   - **Props**:  
     - `lightColor` / `darkColor`: Colores del texto para los temas claro y oscuro.  
     - `type`: Tipo de texto (por ejemplo, `default`, `title`, `subtitle`, `link`).

6. **`ThemedView.tsx`**  
   Componente para crear vistas con fondo temático, ajustando automáticamente el color de fondo según el tema de la aplicación (claro u oscuro).  
   - **Props**:  
     - `lightColor` / `darkColor`: Colores de fondo para los temas claro y oscuro.

#### **Subcarpetas:**

1. **`__tests__`**  
   Esta carpeta contiene pruebas automatizadas para los componentes de la aplicación. Se asegura de que el comportamiento de los componentes funcione según lo esperado.

2. **`navigation`**  
   Contiene los componentes relacionados con la navegación de la aplicación, gestionando las rutas y la transición entre pantallas.
