# Test Interactivo de Logística

Este es un proyecto de una aplicación de quiz interactivo.

## Cómo hacer Deploy en GitHub Pages

Para desplegar esta aplicación en GitHub Pages de forma sencilla, sigue estos pasos:

### Prerrequisitos

1.  Debes tener [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/) instalados en tu máquina.
2.  Debes tener [Git](https://git-scm.com/) instalado.
3.  Ya debes haber subido el código a un repositorio de GitHub.

### Pasos para el Deploy

**Paso 1: Instalar dependencias**

Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para instalar la herramienta de despliegue (`gh-pages`):

```bash
npm install
```

**Paso 2: Configurar la URL del proyecto**

Abre el archivo `package.json`. Verás una línea como esta:

```json
"homepage": "https://<GITHUB_USERNAME>.github.io/<REPOSITORY_NAME>",
```

Debes reemplazar `<GITHUB_USERNAME>` con tu nombre de usuario de GitHub y `<REPOSITORY_NAME>` con el nombre de tu repositorio.

Por ejemplo, si tu usuario es `juanperez` y tu repositorio se llama `quiz-logistica`, la línea debería quedar así:

```json
"homepage": "https://juanperez.github.io/quiz-logistica",
```

**Paso 3: Ejecutar el script de Deploy**

Una vez configurada la URL, ejecuta el siguiente comando en tu terminal:

```bash
npm run deploy
```

Este comando creará una nueva rama en tu repositorio llamada `gh-pages` y subirá los archivos de tu aplicación a esa rama.

**Paso 4: Configurar GitHub**

1.  Ve a tu repositorio en GitHub.
2.  Haz clic en la pestaña **"Settings"**.
3.  En el menú de la izquierda, selecciona **"Pages"**.
4.  En la sección "Build and deployment", bajo "Source", selecciona **"Deploy from a branch"**.
5.  En "Branch", selecciona la rama `gh-pages` y la carpeta `/(root)`.
6.  Haz clic en **"Save"**.

GitHub tardará unos minutos en publicar tu sitio. Una vez listo, podrás acceder a él desde la URL que configuraste en el archivo `package.json`.

¡Y eso es todo! Tu aplicación estará funcionando en GitHub Pages.
