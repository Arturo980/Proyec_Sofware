# Documentación de la carpeta `scripts`

La carpeta `scripts` contiene archivos de scripts personalizados que facilitan diversas tareas de mantenimiento y configuración en el proyecto. Estos scripts están diseñados para automatizar tareas repetitivas y mejorar la eficiencia en el desarrollo.

## Archivo: `reset-project.js`

Este script tiene como propósito **restablecer el proyecto a un estado limpio**. Específicamente, mueve el directorio `app` a `app-example` y crea un nuevo directorio `app` con dos archivos de inicio: `index.tsx` y `_layout.tsx`.

### Descripción del Script

El script realiza las siguientes tareas:

1. **Mover el directorio `app` a `app-example`**:
   - Si el directorio `app` ya existe, se moverá a `app-example`. Esto puede ser útil cuando se desea mantener una versión de respaldo de la estructura original del directorio `app`.

2. **Crear un nuevo directorio `app`**:
   - Después de mover `app`, el script crea un nuevo directorio `app` que contendrá una estructura básica para comenzar el desarrollo.
   
3. **Generar los archivos `index.tsx` y `_layout.tsx`**:
   - El script crea dos archivos básicos de React Native con Expo:
     - `index.tsx`: Este archivo sirve como la pantalla inicial del proyecto, con un texto de ejemplo.
     - `_layout.tsx`: Este archivo define la estructura de navegación básica utilizando `Stack` de `expo-router`, que es el componente para gestionar las pantallas en el proyecto.

### Explicación del Código

1. **Obteniendo rutas de directorios**:
   - `process.cwd()` se utiliza para obtener el directorio de trabajo actual (es decir, el directorio raíz del proyecto).
   - `path.join()` se usa para construir rutas completas de directorios y archivos de forma que sea independiente del sistema operativo.

2. **Moviendo el directorio `app`**:
   - `fs.rename()` mueve el directorio `app` a `app-example`. Si ocurre algún error, lo muestra en la consola.

3. **Creando el nuevo directorio `app`**:
   - `fs.mkdir()` crea el nuevo directorio `app` donde se colocarán los archivos de inicio.

4. **Creando archivos `index.tsx` y `_layout.tsx`**:
   - `fs.writeFile()` crea los archivos `index.tsx` y `_layout.tsx` con el contenido básico definido en las constantes `indexContent` y `layoutContent`.

### Uso

Este script se ejecuta típicamente cuando se desea **reiniciar el proyecto a un estado limpio**. Para usarlo, asegúrate de que el archivo tenga permisos de ejecución y ejecutarlo desde la línea de comandos con:

```bash
node scripts/reset-project.js
```

### Propósito y Consideraciones

- **Propósito**: El script es útil cuando se quiere restablecer la estructura del proyecto sin perder la versión actual del código, ya que mueve la carpeta `app` a `app-example` y genera una nueva estructura mínima para comenzar a trabajar nuevamente.
  
- **Eliminación posterior**: Después de ejecutar el script, puedes eliminar el archivo `reset-project.js` y el script en `package.json` para evitar que se ejecute por accidente en el futuro.

- **Precauciones**: Este script no realiza un respaldo completo del contenido de `app`, solo lo mueve a una nueva ubicación. Asegúrate de no necesitar los archivos dentro de `app` antes de ejecutar el script.
