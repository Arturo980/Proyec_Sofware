### 1. `useColorScheme.ts`

Este archivo exporta el hook `useColorScheme` directamente desde **React Native**. Este hook se utiliza para detectar el esquema de color actual (modo claro u oscuro) del dispositivo. 

#### Función exportada:
- `useColorScheme`: Devuelve el esquema de color actual, que puede ser `'light'` o `'dark'`.

Este archivo proporciona una manera de usar el esquema de colores en el proyecto para ajustar dinámicamente los estilos según el tema del sistema.

### 2. `useColorScheme.web.ts`

Este archivo contiene una implementación alternativa del hook `useColorScheme`, diseñada específicamente para la web. Dado que **React Native** no admite la renderización en el servidor de manera predeterminada, el hook en la web devuelve un valor fijo ('light').

#### Función:
- `useColorScheme`: Retorna `'light'` de forma predeterminada, lo cual es útil para los navegadores web, donde el esquema de colores generalmente no se cambia hasta que el cliente se carga. 

Este archivo maneja la incompatibilidad con la renderización del lado del servidor, sugiriendo el uso de CSS media queries o bibliotecas como **Nativewind** para manejar la adaptación del esquema de colores en la web.

### 3. `useThemeColor.ts`

Este archivo exporta una función que proporciona un color del tema adecuado, ya sea claro u oscuro, basándose en el esquema de color actual del dispositivo. Utiliza el hook `useColorScheme` de React Native para determinar el tema y luego selecciona el color adecuado de los valores definidos en `Colors`.

#### Función:
- `useThemeColor`: Esta función toma dos parámetros:
  - `props`: Un objeto que puede contener las propiedades `light` y `dark` con valores de color personalizados para cada tema.
  - `colorName`: El nombre de un color específico (como `text`, `background`, etc.) que se usará según el tema actual.

El comportamiento de la función es el siguiente:
1. Llama al hook `useColorScheme` para obtener el esquema de color actual.
2. Intenta devolver el valor de color de `props` según el tema (si se ha proporcionado).
3. Si no hay un color en `props`, devuelve el valor predeterminado del tema desde el archivo `Colors.ts` (`Colors[theme][colorName]`).
