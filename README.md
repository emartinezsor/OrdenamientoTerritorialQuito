# 🏗️ Normativa Urbana Interactiva — Distrito Metropolitano de Quito

**Aplicación educativa interactiva para entender la normativa de planificación urbana y ordenamiento territorial del Distrito Metropolitano de Quito.**

---

## 📋 Descripción

Esta aplicación web permite a ciudadanos, estudiantes de arquitectura y profesionales de planificación urbana comprender de forma fácil, visual y divertida la normativa que regula el desarrollo territorial de Quito.

La app transforma documentos legales complejos (ordenanzas, planes, leyes) en una experiencia interactiva con analogías cotidianas, gráficos de red, ejemplos reales de barrios de Quito y un quiz gamificado.

---

## 🎯 Público objetivo

| Perfil | Uso principal |
|--------|---------------|
| **Ciudadanos** | Entender qué dice la normativa sobre su terreno, negocio o barrio |
| **Estudiantes de Arquitectura** | Aprender la estructura jerárquica del PUGS y PMDOT |
| **Profesionales de planificación** | Referencia rápida de conceptos, homologaciones y relaciones normativas |
| **Funcionarios municipales** | Herramienta de socialización y capacitación |

---

## 🧩 Funcionalidades

### 🔗 Red de Normativa (pestaña principal)
- **Grafo interactivo D3.js** con 8 conceptos normativos conectados por sus relaciones legales
- Al tocar un nodo se muestra un **resumen con analogía** (ej: "El PMDOT es como el GPS de Quito")
- Botón **"Explorar en detalle"** que abre una página completa con secciones desplegables

### 📖 Páginas de detalle por concepto
Cada uno de los 8 conceptos tiene entre 2 y 8 secciones expandibles con:

- **Analogías** destacadas visualmente (fondo con borde de color)
- **Contenido técnico** explicado en lenguaje accesible
- **Items con iconos y colores** para clasificaciones, tipos y listas
- **Ejemplos reales** de barrios y situaciones de Quito
- **Sub-secciones anidadas** (acordeones dentro de acordeones)
- **Navegación a conceptos relacionados** al final de cada página

### 📅 Historia (línea de tiempo)
- Línea de tiempo visual con los 4 hitos normativos: 2012, 2015, 2021, 2024
- Cada hito es expandible con detalles del alcalde y los cambios introducidos

### 🏠 ¿Quiero construir? (flujo paso a paso)
- Diagrama de 7 pasos desde "tengo un terreno" hasta "¡construyo!"
- Alertas sobre preexistencias, COD y zonas de riesgo

### 🎮 Quiz
- 6 preguntas aleatorias de un banco de 10
- Incluye preguntas sobre microrregiones, polígonos industriales, sistema ambiental, edificabilidad
- Puntuación y retroalimentación visual

---

## 🏛️ Conceptos cubiertos

### Instrumentos de planificación
| Sigla | Nombre completo | Analogía |
|-------|----------------|----------|
| **PMDOT** | Plan Metropolitano de Desarrollo y Ordenamiento Territorial | El GPS de Quito |
| **PUGS** | Plan de Uso y Gestión del Suelo | Las reglas del Monopoly |
| **PUOS** | Plan de Uso y Ocupación del Suelo (anterior) | El menú antiguo del restaurante |

### Marco legal
| Sigla | Nombre completo | Analogía |
|-------|----------------|----------|
| **LOOTUGS** | Ley Orgánica de Ordenamiento Territorial, Uso y Gestión del Suelo | La FIFA del territorio |
| **COOTAD** | Código Orgánico de Organización Territorial, Autonomía y Descentralización | El organigrama de gobiernos locales |

### Instrumentos operativos
| Sigla | Nombre completo | Analogía |
|-------|----------------|----------|
| **IRM** | Informe de Regulación Metropolitana | La cédula de identidad de tu terreno |
| **LUAE** | Licencia Metropolitana Única para Actividades Económicas | Licencia de conducir para tu negocio |
| **COD** | Concesión Onerosa de Derechos | Pagas el upgrade que te da el nuevo plan |

---

## 🌳 Profundidad del contenido del PUGS

La aplicación cubre la estructura jerárquica completa del Plan de Uso y Gestión del Suelo, incluyendo:

### Componente Estructurante
- **Sistema Ambiental y Riesgo Natural**
  - Infraestructura Verde-Azul (Matriz Verde + Matriz Azul)
  - Áreas Naturales Protegidas (SNAP, PFN, SPACUSP, SMANP)
  - Red Verde Urbana (quebradas vivas, corredores verdes, áreas verdes metropolitanas)
  - Zonas de Susceptibilidad (movimientos en masa, inundaciones, subsidencia, volcánica, sísmica)
- **Sistema Productivo**
  - Polígonos Industriales (existentes: Calacalí, Ponceano, Turubamba, Itulcachi; propuestos: San Antonio)
  - Zona Logística Comercial Regional (Pifo)
  - Zona de Desarrollo Económico (Tababela)
  - Zonas Agroproductivas (agricultura sostenible, agroecología, turismo comunitario)
  - Zonas de Aprovechamiento Extractivo
- **Microrregiones Rurales Sostenibles** (10 microrregiones con parroquias y nodos articuladores)
- **Sistema Policéntrico** (centralidades metropolitanas/zonales/sectoriales, nodos funcionales, barrios)
- **Clasificación y Subclasificación del Suelo** (urbano/rural con todas las subcategorías)
- **Edificabilidad** (COS PB, COS Total, edificabilidad básica y máxima)

### Componente Urbanístico
- Tratamientos urbanísticos, usos de suelo y CIIU, zonificación

### Instrumentos de Gestión
- COD, planes parciales, banco de suelos, reparto de cargas y beneficios

---

## 📚 Fuentes documentales

La aplicación fue construida a partir del análisis de los siguientes documentos oficiales:

| Documento | Año | Descripción |
|-----------|-----|-------------|
| ORDM-0170 | 2012 | Primer PMDOT del DMQ (2012–2022) |
| ORDM-0041 | 2015 | Actualización PMDOT (2015–2025) |
| ORDM-001-2021 | 2021 | Ordenanza PMDOT-PUGS (2021–2033) — 29 páginas de ordenanza |
| ORDM-001-2021 (PMDOT) | 2021 | Plan Metropolitano de Desarrollo y Ordenamiento Territorial completo |
| ORDM-001-2021 (PUGS) | 2021 | Plan de Uso y Gestión del Suelo — 350 páginas |
| ORD-003-2024 | 2024 | Actualización y alineación PMDOT-PUGS — 219 páginas |
| PMDOT 2024-2033 | 2024 | Diagramado actualización alineación final — 188 páginas |

Adicionalmente se utilizó como referencia el board de Miro con la estructura jerárquica del PUGS elaborado como material de análisis visual.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **React** | Framework de interfaz de usuario |
| **D3.js** | Grafo de red interactivo (force simulation) |
| **Tailwind CSS** (utility classes) | Estilos inline con sistema de diseño coherente |
| **Google Fonts** | DM Sans (cuerpo) + Space Mono (acentos) |

### Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Azul | `#3B82F6` | PMDOT, sistemas de soporte |
| Violeta | `#8B5CF6` | PUGS, componente urbanístico |
| Amarillo | `#F59E0B` | PUOS, sistema productivo |
| Verde | `#22C55E` | Sistema ambiental, ejemplos |
| Rojo | `#EF4444` | COOTAD, alertas de riesgo |
| Cian | `#06B6D4` | IRM |
| Naranja | `#F97316` | LUAE |
| Púrpura | `#A855F7` | COD |

---

## 📂 Estructura del proyecto

```
quito-normativa-app.jsx    # Aplicación React completa (componente único)
README.md                  # Este documento
```

### Componentes internos del archivo JSX

| Componente | Descripción |
|------------|-------------|
| `App` | Componente principal con tabs y estado de navegación |
| `NetworkGraph` | Grafo D3 de fuerza con nodos interactivos |
| `DeepDive` | Página de detalle completa por concepto |
| `SectionCard` | Acordeón recursivo con analogías, items, ejemplos y sub-secciones |
| `QuizGame` | Motor de quiz con preguntas aleatorias y puntuación |
| `TimelineViz` | Línea de tiempo interactiva |
| `FlowDiagram` | Diagrama de flujo paso a paso |

### Estructuras de datos

| Constante | Contenido |
|-----------|-----------|
| `CONCEPTS` | 8 conceptos normativos con relaciones |
| `DEEP` | Datos profundos por concepto (secciones, items, analogías, ejemplos, children) |
| `TIMELINE` | 4 hitos normativos (2012–2024) |
| `QUIZ` | Banco de 10 preguntas |

---

## 🚀 Cómo ejecutar

### En Claude.ai
La aplicación se renderiza directamente como artifact React en la interfaz de Claude.

### En un proyecto local

1. Crear un proyecto React (Vite, CRA, Next.js, etc.)
2. Instalar D3: `npm install d3`
3. Copiar el contenido del archivo `.jsx` en un componente
4. Importar y renderizar el componente

```bash
npm create vite@latest quito-normativa -- --template react
cd quito-normativa
npm install d3
# Copiar quito-normativa-app.jsx → src/App.jsx
npm run dev
```

---

## ⚠️ Aviso legal

**Esta es una herramienta educativa.** No reemplaza la consulta oficial de normativa ni constituye asesoramiento legal o urbanístico. Para trámites oficiales, consultar directamente con el Municipio del Distrito Metropolitano de Quito, las Administraciones Zonales o la Secretaría de Hábitat y Ordenamiento Territorial.

---

## 📝 Licencia

Proyecto educativo de acceso libre. Los contenidos normativos son de dominio público del Gobierno Autónomo Descentralizado del Distrito Metropolitano de Quito.

---

## 🤝 Créditos

- **Contenido normativo:** GAD del Distrito Metropolitano de Quito
- **Diseño de información y estructura:** Basado en board de Miro con análisis jerárquico del PUGS
- **Desarrollo:** Generado con asistencia de Claude (Anthropic)

---

*Última actualización: Abril 2026*
