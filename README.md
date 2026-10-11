# Reyes Miguel Tech — sitio profesional v2

Sitio multipágina para GitHub Pages: **portada original de Canva**, red de nodos y curvas animadas, navegación con menús desplegables y páginas específicas para CV, Docencia, Investigación, Intereses, Divulgación, Portfolio, Publicaciones, Conferencias y Contacto.

## Publicación en GitHub Pages

Destino previsto: https://github.com/migue212852/reyesmigueltech.github.io

**URL pública esperada:** https://migue212852.github.io/reyesmigueltech.github.io/

> El nombre del repositorio no coincide exactamente con `migue212852.github.io`, por lo que GitHub lo trata como **sitio de proyecto**. Todos los enlaces del sitio son relativos y funcionan bajo ese prefijo.

> **Repositorio público:** podrá clonarse y descargarse completo. GitHub Pages publicará solo los archivos del sitio y los PDFs/presentaciones autorizados, pero esto no oculta el código almacenado en GitHub.

1. En GitHub, abrí **Settings → General → Danger Zone → Change repository visibility** y cambiá el repositorio a **Public**. Esto hará público el código fuente y el historial Git: cualquiera podrá verlos, clonarlos y descargarlos.
2. En **Settings → Pages → Build and deployment**, elegí **Source: GitHub Actions**. El workflow no puede activar Pages por sí mismo porque GitHub no concede ese permiso al token de Actions.
3. El archivo `.github/workflows/deploy.yml` publica al hacer `push` a `main` solo las páginas y recursos necesarios, junto con archivos PDF y presentaciones autorizados. También se puede ejecutar desde **Actions**.
4. Verificá la URL pública indicada al inicio.

No configures Pages para publicar la rama `main` desde `/ (root)`: eso expondría también archivos que el workflow excluye del sitio.

### Actualizar desde una computadora

```bash
# En la carpeta de tu repositorio local, una vez copiados los archivos:
git add -A
git commit -m "Rediseño Canva y páginas independientes"
git push origin main
```

## Directorios y páginas

```text
reyesmigueltech-site/
├── index.html                         ← portada original de Canva + animación superpuesta
├── cv.html                            ← CV / descarga PDF
├── teaching.html                      ← filtros y buscador de materiales PDF
├── research.html                      ← investigación y accesos a repositorios
├── intereses.html
├── divulgacion.html
├── portfolio.html
├── publicaciones.html
├── conferencias.html
├── contacto.html
├── research/
│   ├── salud/index.html              ← proyectos de salud computacional
│   └── IA_imagenes_medicas/index.html ← IA e imágenes médicas
├── assets/
│   ├── img/portada-webSite.jpg        ← imagen Canva intacta (1920 × 1080)
│   ├── img/favicon.svg
│   ├── css/styles.css                 ← paleta derivada de la portada
│   ├── js/main.js                     ← menús, listados y animaciones
│   └── data/content.json              ← información editable
├── docs/
│   ├── cv/
│   ├── teaching/
│   ├── conferencias/
│   └── publicaciones/
├── .github/workflows/deploy.yml
├── .nojekyll
└── README.md
```

## Cómo agregar archivos sin modificar HTML

El sitio **no necesita WordPress, backend ni Node.js**. Toda la información editable reside en `assets/data/content.json`. Las páginas leen ese archivo por HTTP cuando se abren.

### CV

1. Guardá el PDF en `docs/cv/CV_Miguel_Reyes.pdf`.
2. En el objeto `profile` escribí `"cvPdf": "docs/cv/CV_Miguel_Reyes.pdf"`.
3. La descarga aparecerá automáticamente en `cv.html`.

### Teaching (materiales PDF)

Guardá tus archivos en `docs/teaching/` y agregá al array `teaching` un objeto como:

```json
{
  "title": "Título de material real",
  "category": "Apuntes",
  "description": "Descripción del documento",
  "pdf": "docs/teaching/nombre-del-documento.pdf"
}
```

Categorías filtrables: `Apuntes`, `Guías`, `Presentaciones`, `Ejercicios`. Los acentos distinguen categorías. Para un nombre sin tildes en la ruta del PDF evitás problemas de codificación.

### Conferencias y congresos

```json
{
  "title": "Nombre de la presentación real",
  "type": "Conferencia",
  "year": "2026",
  "event": "Nombre real del evento",
  "description": "Una breve reseña",
  "pdf": "docs/conferencias/archivo-real.pdf"
}
```

### Publicaciones

```json
{
  "title": "Título del artículo publicado",
  "type": "Artículo",
  "year": "2026",
  "authors": "Autores, año, editorial/revista",
  "url": "https://doi.org/DOI_REAL"
}
```

### Portfolio

```json
{
  "title": "Título del proyecto real",
  "category": "Software · Python",
  "description": "Problema, método y resultado",
  "url": "https://github.com/migue212852/REPOSITORIO_REAL"
}
```

### Investigación

En el array `researchProjects` guardá registros con `"area": "salud"` o `"area": "IA_imagenes_medicas"`; se mostrarán en su repositorio correspondiente. Es posible guardar código, documentación y notebooks en las carpetas respectivas o enlazar a otros repositorios de GitHub.

### Divulgación

En `divulgacion` guardá objetos del mismo formato que los del portfolio o las conferencias.

### Contacto

En `profile.email` completá un correo real. Si queda vacío, **no aparece un correo inventado**.

> **No subir información sensible:** los repositorios de GitHub Pages son públicos, así como todo PDF, script e imagen añadidos al sitio. Para datos clínicos, emplear únicamente datos con autorización y aptos para publicación.

## La portada y la animación

- La imagen `assets/img/portada-webSite.jpg` es la **imagen original subida**, sin modificaciones.
- Un `<canvas>` transparente ubicado encima dibuja una animación suave de nodos, conexiones trianguladas, curvas ondulantes y trazos elípticos alineados con su estética. **La animación es una recreación superpuesta**: los elementos de Canva en formato JPG no tienen capas vectoriales independientes que puedan animarse individualmente.
- Los títulos de la imagen son zonas clicables transparentes y llevan a las páginas correspondientes. También aparecen en el menú superior y en tarjetas inferiores, accesibles en dispositivos móviles.
- Se respetan las preferencias de accesibilidad `prefers-reduced-motion`; cuando están activadas, el movimiento se deshabilita.
- La gama de violetas, azules, turquesas, lavandas y mostaza se extrajo visualmente de la imagen y se usa en todas las páginas.
- Si luego exportás desde Canva las redes y curvas **en SVG, separadas del fondo y del texto**, podemos animar exactamente cada forma vectorial sin reconstrucciones aproximadas.

## Cómo ver el sitio en local

Dentro de la carpeta principal:

```bash
python -m http.server 8000
```

Abrí http://localhost:8000/ y probá los enlaces. No uses el protocolo `file://` para las listas, porque el navegador no puede cargar `content.json` mediante `fetch()` desde archivos locales.

## Buenas prácticas técnicas

- HTML semántico, CSS adaptativo, JavaScript nativo, enlaces relativos y navegación por teclado.
- Menús desplegables con atributos `aria-expanded`; los títulos de menú siempre abren la página principal correspondiente.
- Contenidos cargados con `textContent` para evitar inyección HTML en el JSON.
- Enlaces externos HTTPS y `rel="noopener noreferrer"`.
- No se inventan publicaciones, títulos, instituciones ni resultados; las listas vacías muestran una invitación a cargar datos reales.

Archivos desarrollados para uso y edición directa en GitHub Pages.
