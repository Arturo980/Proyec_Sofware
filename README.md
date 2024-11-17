```markdown
# Bienvenido a tu aplicación Expo 👋

Este es un proyecto de [Expo](https://expo.dev) creado con [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Comenzar

1. Instalar las dependencias

   ```bash
   npm install
   ```

2. Iniciar la aplicación

   ```bash
    npx expo start
   ```

En la salida, encontrarás opciones para abrir la aplicación en:

- [build de desarrollo](https://docs.expo.dev/develop/development-builds/introduction/)
- [emulador de Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [simulador de iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), un sandbox limitado para probar el desarrollo de aplicaciones con Expo.

Puedes comenzar a desarrollar editando los archivos dentro del directorio **app**. Este proyecto utiliza [enrutamiento basado en archivos](https://docs.expo.dev/router/introduction).

## Obtener un proyecto limpio

Cuando estés listo, ejecuta el siguiente comando:

```bash
npm run reset-project
```

Este comando moverá el código inicial al directorio **app-example** y creará un directorio **app** vacío donde podrás comenzar a desarrollar.

## Estructura del Proyecto

La estructura básica del proyecto es la siguiente:

```
/app              # Contiene los archivos principales de la aplicación.
  /_layout.tsx    # Definición de la estructura de navegación.
  /index.tsx      # Página principal de la aplicación.
  
/scripts           # Scripts útiles para tareas automáticas.
  /reset-project.js # Script para reiniciar el proyecto con una nueva estructura.

/node_modules      # Dependencias instaladas para el proyecto.
  
/package.json      # Archivos de configuración del proyecto (dependencias, scripts, etc.).
```

## Funcionalidades principales

- **Enrutamiento basado en archivos**: Este proyecto utiliza el sistema de enrutamiento de Expo para manejar las pantallas, lo que permite una navegación sencilla basada en los archivos ubicados en el directorio `app`.
  
- **Soporte multiplataforma**: La aplicación está diseñada para ejecutarse tanto en dispositivos Android como iOS, con la posibilidad de probarla también en la web.

## Aprende más

Para aprender más sobre cómo desarrollar tu proyecto con Expo, revisa los siguientes recursos:

- [Documentación de Expo](https://docs.expo.dev/): Aprende lo esencial o profundiza en temas avanzados con nuestras [guías](https://docs.expo.dev/guides).
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/): Sigue un tutorial paso a paso para crear un proyecto que se ejecute en Android, iOS y la web.

## Unirte a la comunidad

Únete a nuestra comunidad de desarrolladores creando aplicaciones universales.

- [Expo en GitHub](https://github.com/expo/expo): Mira nuestra plataforma de código abierto y contribuye.
- [Comunidad en Discord](https://chat.expo.dev): Chatea con usuarios de Expo y haz preguntas.

## Personalización del Proyecto

Este proyecto está configurado para ser fácilmente extensible. Algunos aspectos clave incluyen:

- **Estilos personalizados**: Puedes modificar los estilos globales para que se ajusten a las necesidades de tu empresa, ya que el proyecto ya incluye una implementación de soporte para temas claros y oscuros.
  
- **Reinicio del proyecto**: Si alguna vez necesitas restablecer el proyecto, puedes usar el comando `npm run reset-project`, que moverá la estructura del directorio `app` actual a `app-example` y generará una nueva estructura limpia con archivos de inicio.

## Contribuciones

Si deseas contribuir al proyecto, puedes hacerlo de las siguientes maneras:

1. **Abriendo un Issue**: Si encuentras un problema o tienes una sugerencia, puedes abrir un "Issue" en el repositorio de GitHub.
2. **Haciendo un Pull Request**: Si has encontrado una mejora o corrección de errores, puedes hacer un Pull Request con tus cambios.

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, revisa el archivo [LICENSE](LICENSE).
```
