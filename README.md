# Reyes Miguel Tech — sitio profesional v2

Código fuente privado de un sitio multipágina: **portada original de Canva**, red de nodos y curvas animadas, navegación con menús desplegables y páginas específicas para CV, Docencia, Investigación, Intereses, Divulgación, Portfolio, Publicaciones, Conferencias y Contacto. El sitio no está publicado.

## Acceso público solo a documentos

Este repositorio contiene el código fuente y debe permanecer **privado**. El sitio HTML no se publica: la cuenta no permite activar GitHub Pages para este repositorio privado.

Para compartir materiales, creá un repositorio público separado (por ejemplo, `reyesmigueltech-recursos`) y cargá allí únicamente PDFs y presentaciones autorizados. No agregues código, datos privados ni documentación interna. Cada archivo tendrá un enlace directo similar a `https://raw.githubusercontent.com/migue212852/reyesmigueltech-recursos/main/docs/cv/CV_Miguel_Reyes.pdf`. Cualquiera podrá descargar los archivos de ese repositorio público; no se expondrá el código fuente de este proyecto. Todavía no hay PDFs ni presentaciones en este repositorio, así que no existen enlaces públicos a documentos hasta que se carguen en el repositorio separado.

### Actualizar desde una computadora

```bash
# En la carpeta de este repositorio privado:
git add -A
git commit -m "Update private source"
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
├── .nojekyll
└── README.md
```

## Cómo agregar archivos sin modificar HTML

El sitio **no necesita WordPress, backend ni Node.js**. Toda la información editable reside en `assets/data/content.json`. Las páginas leen ese archivo por HTTP cuando se abren. Estas instrucciones describen la fuente del sitio y la vista local; no publican el sitio ni sus archivos. Para compartir un documento, cargalo solo en el repositorio público separado y usá su URL directa `raw.githubusercontent.com`.

### CV

1. Guardá el PDF en `docs/cv/CV_Miguel_Reyes.pdf` del repositorio público de recursos.
2. En el objeto `profile` escribí `"cvPdf": "https://raw.githubusercontent.com/migue212852/reyesmigueltech-recursos/main/docs/cv/CV_Miguel_Reyes.pdf"`.
3. La descarga aparecerá en `cv.html` al usar el sitio localmente.

### Teaching (materiales PDF)

Guardá los archivos autorizados en `docs/teaching/` del repositorio público de recursos y agregá al array `teaching` un objeto con su URL directa, por ejemplo:

```json
{
  "title": "Título de material real",
  "category": "Apuntes",
  "description": "Descripción del documento",
  "pdf": "https://raw.githubusercontent.com/migue212852/reyesmigueltech-recursos/main/docs/teaching/nombre-del-documento.pdf"
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
  "pdf": "https://raw.githubusercontent.com/migue212852/reyesmigueltech-recursos/main/docs/conferencias/archivo-real.pdf"
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

> **No subir información sensible:** todo archivo cargado al repositorio público de recursos será accesible y descargable por cualquiera. Para datos clínicos, emplear únicamente datos con autorización y aptos para publicación.

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

El sitio se puede probar localmente, pero no se publica desde este repositorio privado. Los únicos archivos públicos deben estar en el repositorio separado de recursos.
