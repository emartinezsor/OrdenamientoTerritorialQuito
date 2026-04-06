import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client"; // <--- AGREGA ESTA LÍNEA
import * as d3 from "d3";

const P = { bg: "#0a0f1e", card: "rgba(15,23,42,0.6)", bd: "#1a2340", tx: "#e2e8f0", mt: "#64748b" };

const CONCEPTS = [
  { id: "pmdot", emoji: "🗺️", title: "PMDOT", sub: "Plan Metropolitano de Desarrollo y Ordenamiento Territorial", analogy: "El GPS de Quito: hacia dónde vamos los próximos 12 años.", color: "#3B82F6", related: ["pugs", "lootugs", "cootad"] },
  { id: "pugs", emoji: "🏗️", title: "PUGS", sub: "Plan de Uso y Gestión del Suelo", analogy: "Las reglas del Monopoly: qué construir, dónde y cuánto alto.", color: "#8B5CF6", related: ["pmdot", "puos", "irm"] },
  { id: "puos", emoji: "📋", title: "PUOS", sub: "Plan anterior de Uso y Ocupación", analogy: "El menú antiguo, reemplazado por el PUGS.", color: "#F59E0B", related: ["pugs", "irm"] },
  { id: "lootugs", emoji: "⚖️", title: "LOOTUGS", sub: "Ley Orgánica de Ordenamiento Territorial", analogy: "La FIFA del territorio: reglas nacionales.", color: "#10B981", related: ["pmdot", "pugs", "cootad"] },
  { id: "cootad", emoji: "🏛️", title: "COOTAD", sub: "Código de Organización Territorial", analogy: "Organigrama de gobiernos locales.", color: "#EF4444", related: ["lootugs", "pmdot"] },
  { id: "irm", emoji: "📄", title: "IRM", sub: "Informe de Regulación Metropolitana", analogy: "La cédula de identidad de tu terreno.", color: "#06B6D4", related: ["pugs", "luae"] },
  { id: "luae", emoji: "🏪", title: "LUAE", sub: "Licencia para Actividades Económicas", analogy: "Licencia de conducir para tu negocio.", color: "#F97316", related: ["pugs", "irm", "cod"] },
  { id: "cod", emoji: "💰", title: "COD", sub: "Concesión Onerosa de Derechos", analogy: "Pagas el upgrade que te da el plan.", color: "#A855F7", related: ["pugs", "puos"] },
];

const DEEP = {
  pmdot: { sections: [
    { id: "obj", title: "Objetivos de Desarrollo", icon: "🎯", analogy: "Las 3 promesas de Quito a sus ciudadanos.", items: [
      { label: "01 LAS PERSONAS", emoji: "👥", color: "#3B82F6", desc: "Calidad de vida, justicia, equidad, trabajo digno, reducir brechas." },
      { label: "02 LA CIUDAD", emoji: "🏙️", color: "#8B5CF6", desc: "Ciudad segura, sostenible, integrada. Paz y convivencia." },
      { label: "03 LA GESTIÓN", emoji: "⚙️", color: "#22C55E", desc: "Eficiente, participativa, transparente, cercana al ciudadano." },
    ] },
    { id: "mtd", title: "Modelo Territorial Deseado", icon: "🗺️", analogy: "El sueño de cómo queremos que se vea Quito.", content: "Ciudad compacta, policéntrica, con movilidad eficiente y microrregiones rurales sostenibles.", items: [
      { label: "1. Ordenar según biofísica", emoji: "🌍", color: "#10B981", desc: "Asentamientos respetan la matriz natural." },
      { label: "2. Integrar urbano-rural", emoji: "🔗", color: "#3B82F6", desc: "Microrregiones articuladas con Quito." },
      { label: "3. Sistema policéntrico", emoji: "🏘️", color: "#8B5CF6", desc: "Servicios distribuidos, no todo en hipercentro." },
      { label: "4. Contener expansión", emoji: "🛑", color: "#EF4444", desc: "Proteger áreas agrícolas y conservación." },
      { label: "5. Centralidades sostenibles", emoji: "🏗️", color: "#F59E0B", desc: "Transporte, usos mixtos, densificación inteligente." },
      { label: "6. Microrregiones rurales", emoji: "🌿", color: "#22C55E", desc: "Vocación agroproductiva, turística, de conservación." },
    ] },
    { id: "ejes", title: "Ejes Estratégicos", icon: "📊", analogy: "Las 6 columnas que sostienen la visión de Quito.", items: [
      { label: "Hábitat y Seguridad", emoji: "🏠", color: "#3B82F6", desc: "Vivienda, espacio público, gestión de riesgos." },
      { label: "Trabajo y Economía", emoji: "💼", color: "#F59E0B", desc: "Empleo, emprendimiento, innovación." },
      { label: "Bienestar Social", emoji: "❤️", color: "#EC4899", desc: "Salud, educación, inclusión, derechos." },
      { label: "Movilidad Sostenible", emoji: "🚇", color: "#10B981", desc: "Metro, BRT, ciclovías, peatonalización." },
      { label: "Territorio Ecológico", emoji: "🌿", color: "#22C55E", desc: "Áreas protegidas, biodiversidad." },
      { label: "Gestión Metropolitana", emoji: "⚙️", color: "#6366F1", desc: "Eficiencia, transparencia, gobierno digital." },
    ] },
  ] },
  pugs: { sections: [
    { id: "ov", title: "¿Qué es el PUGS?", icon: "🏗️", analogy: "Si Quito fuera Monopoly, el PUGS son las reglas escritas en la caja.", content: "Define para cada metro cuadrado: qué se puede hacer (uso), cuánto construir (edificabilidad), cómo gestionar el cambio." },
    { id: "comp", title: "3 Componentes del PUGS", icon: "🧩", analogy: "Sándwich de 3 capas: base firme, relleno ajustable, salsa financiera.", items: [
      { label: "Estructurante", emoji: "🏛️", color: "#3B82F6", desc: "Largo plazo, NO cambia fácil: sistemas ambientales, policéntrico, movilidad, clasificación del suelo." },
      { label: "Urbanístico", emoji: "📏", color: "#8B5CF6", desc: "Detalle ajustable: tratamientos, usos, edificabilidad, retiros, zonificación." },
      { label: "Instrumentos de Gestión", emoji: "🔧", color: "#F59E0B", desc: "Herramientas: COD, planes parciales, banco de suelos, reparto cargas/beneficios." },
    ] },
    { id: "s1", title: "Sistema Ambiental y Riesgo", icon: "🌿", analogy: "El sistema inmunológico de la ciudad.", content: "Protege ecosistemas e incorpora infraestructura verde-azul.", children: [
      { id: "s1p1", title: "Infraestructura Verde-Azul", icon: "💧", analogy: "Red de venas verdes y azules: parques conectados con ríos y quebradas.", items: [
        { label: "Matriz Verde", emoji: "🌳", color: "#22C55E", desc: "Corredores ecológicos, áreas protegidas, parques, humedales." },
        { label: "Matriz Azul", emoji: "💧", color: "#06B6D4", desc: "Ríos, quebradas, lagos, drenaje urbano sostenible." },
      ], example: "Páramos de Píntag, río Mashpi, Bosque Pachijal proveen agua y biodiversidad." },
      { id: "s1p2", title: "Áreas Naturales Protegidas", icon: "🏔️", analogy: "Las joyas de la corona natural de Quito.", items: [
        { label: "SNAP", emoji: "🛡️", color: "#10B981", desc: "Sistema Nacional: conservación estatal de biodiversidad." },
        { label: "PFN", emoji: "🌲", color: "#22C55E", desc: "Patrimonio Forestal: bosques, páramos, manglares." },
        { label: "SPACUSP", emoji: "🗺️", color: "#3B82F6", desc: "Provincial Pichincha: conservar biodiversidad." },
        { label: "SMANP", emoji: "🦅", color: "#8B5CF6", desc: "Metropolitano: ACUS, AIER, humedales, santuarios." },
      ], example: "ACUS Mashpi-Guaycuyacu, Páramos de Píntag, AIER Pichincha-Atacazo." },
      { id: "s1p3", title: "Red Verde Urbana", icon: "🌳", analogy: "Pulmones verdes dentro de la ciudad.", items: [
        { label: "Quebradas Vivas", emoji: "🏞️", color: "#22C55E", desc: "Corredores ecológicos urbanos rehabilitados." },
        { label: "Corredores Verdes", emoji: "🛤️", color: "#10B981", desc: "Conexiones lineales entre parques y áreas naturales." },
        { label: "Áreas Verdes Metro", emoji: "🌿", color: "#059669", desc: "Parques actuales y propuestos." },
      ] },
      { id: "s1p4", title: "Zonas de Susceptibilidad", icon: "⚠️", analogy: "Mapa de peligros: deslizamientos, inundaciones, volcanes.", items: [
        { label: "Movimientos en masa", emoji: "⛰️", color: "#EF4444", desc: "Tierra/rocas por lluvias/sismos. Anexos O3-O4." },
        { label: "Inundaciones", emoji: "🌊", color: "#3B82F6", desc: "Lluvias intensas. Anexos O5-O6." },
        { label: "Subsidencia", emoji: "⬇️", color: "#F59E0B", desc: "Hundimiento por sobreexplotación. Anexos O7-O8." },
        { label: "Volcánica", emoji: "🌋", color: "#DC2626", desc: "Cotopaxi, Guagua Pichincha, Reventador. Anexos 9-12." },
        { label: "Sísmica", emoji: "📳", color: "#7C3AED", desc: "Fallas geológicas. Anexo PUGS 13." },
      ], example: "Amenaza alta + no consolidado → protección ecológica. Amenaza alta + consolidado → baja densidad." },
    ] },
    { id: "s2", title: "Sistema Productivo", icon: "🏭", analogy: "El motor económico del territorio.", content: "Polígonos industriales, zonas logísticas y áreas agrícolas.", children: [
      { id: "s2p1", title: "Polígonos Industriales", icon: "🏭", analogy: "Fábricas organizadas en barrios industriales con buenas vías.", content: "Zonas urbanas estratégicas para industria y logística.", items: [
        { label: "Existentes", emoji: "✅", color: "#22C55E", desc: "Calacalí, Ponceano, Turubamba, Itulcachi." },
        { label: "Propuestos", emoji: "🆕", color: "#3B82F6", desc: "San Antonio, Itulcachi (ampliación)." },
      ], example: "Industrias peligrosas deben alejarse de asentamientos. Acceso a vías arteriales o expresas." },
      { id: "s2p2", title: "Zona Logística Pifo", icon: "📦", content: "Equipamientos, comercio y servicios metropolitanos entre Panamericana y E-35.", example: "Junto al aeropuerto Mariscal Sucre: nodo logístico y tecnológico." },
      { id: "s2p3", title: "Zona Desarrollo Tababela", icon: "🚀", content: "Zona industrial con valor agregado, complementaria a actividades aeroportuarias." },
      { id: "s2p4", title: "Zonas Agroproductivas", icon: "🌾", analogy: "Las despensas de Quito: donde se produce tu comida.", items: [
        { label: "Agricultura sostenible", emoji: "🥕", color: "#22C55E", desc: "Seguridad alimentaria sin degradar suelo." },
        { label: "Agroecología", emoji: "🌱", color: "#10B981", desc: "Técnicas ancestrales, santuarios agrícolas." },
        { label: "Turismo comunitario", emoji: "🏕️", color: "#3B82F6", desc: "Turismo intercultural gestionado por comunidades." },
      ] },
      { id: "s2p5", title: "Zonas Extractivas", icon: "⛏️", analogy: "Minerales valiosos pero con precio ambiental.", items: [
        { label: "Exclusión", emoji: "🚫", color: "#EF4444", desc: "Áreas protegidas, fuentes de agua: NO se explota." },
        { label: "Concesiones", emoji: "📋", color: "#F59E0B", desc: "Permisos mineros vigentes." },
        { label: "Potencial geológico", emoji: "🔍", color: "#8B5CF6", desc: "Nuevas solicitudes de derechos mineros." },
      ] },
    ] },
    { id: "s3", title: "Microrregiones Rurales", icon: "🏘️", analogy: "Barrios rurales organizados, cada uno con su vocación y capitán (nodo articulador).", content: "10 microrregiones que articulan lo urbano y rural.", items: [
      { label: "Oriental", emoji: "🏔️", color: "#8B5CF6", desc: "Píntag, Amaguaña → Nodo: Amaguaña" },
      { label: "Nororiental 1", emoji: "✈️", color: "#3B82F6", desc: "Puembo, Pifo, Tababela → Nodo: Pifo" },
      { label: "Nororiental 2", emoji: "🌽", color: "#22C55E", desc: "Guayllabamba, El Quinche, Checa, Yaruquí → Nodo: Guayllabamba" },
      { label: "Norcentral", emoji: "🏙️", color: "#F59E0B", desc: "Calderón, Llano Chico, Zámbiza, Nayón" },
      { label: "Occidental", emoji: "🌄", color: "#10B981", desc: "Lloa, Nono" },
      { label: "Equinoccial", emoji: "🌐", color: "#06B6D4", desc: "Pomasqui, San Antonio, Calacalí" },
      { label: "Norequinoccial", emoji: "🌿", color: "#059669", desc: "San José de Minas, Puéllaro, Perucho... → Nodo: Perucho" },
      { label: "Valle Tumbaco", emoji: "☀️", color: "#F97316", desc: "Tumbaco, Cumbayá" },
      { label: "Los Chillos", emoji: "🏡", color: "#EC4899", desc: "La Merced, Guangopolo, Alangasí, Conocoto" },
      { label: "Noroccidental", emoji: "🦜", color: "#A855F7", desc: "Nanegal, Gualea, Pacto, Nanegalito → Nodo: Nanegalito" },
    ] },
    { id: "s4", title: "Sistema Policéntrico", icon: "🔵", analogy: "No un centro, sino muchos minicentros conectados.", content: "Centralidades, nodos funcionales y barrios.", children: [
      { id: "s4c", title: "Centralidades", icon: "⭐", items: [
        { label: "Metropolitana", emoji: "🌟", color: "#6366F1", desc: "Influencia nacional: Centro Histórico, La Mariscal." },
        { label: "Zonal", emoji: "⭐", color: "#8B5CF6", desc: "Atracción zonal: Calderón, Los Chillos." },
        { label: "Sectorial", emoji: "✨", color: "#A78BFA", desc: "Especialización barrial, articulada a mayores." },
      ] },
      { id: "s4n", title: "Nodos Funcionales", icon: "📍", items: [
        { label: "Tendenciales", emoji: "📊", color: "#3B82F6", desc: "Función existente que se mantiene." },
        { label: "Planificados", emoji: "🎯", color: "#F59E0B", desc: "Función propuesta de apoyo al modelo." },
      ] },
      { id: "s4b", title: "Barrios", icon: "🏠", content: "Célula básica: necesidades cotidianas, participación, comunidad.", example: "Donde compras el pan, llevas a los niños al parque. El PUGS protege su residencialidad." },
    ] },
    { id: "clasif", title: "Clasificación del Suelo", icon: "🗺️", analogy: "Pintar el mapa con 2 colores: urbano y rural.", items: [
      { label: "Suelo Urbano", emoji: "🏙️", color: "#3B82F6", desc: "Ciudad consolidada con infraestructura y servicios." },
      { label: "Suelo Rural", emoji: "🌾", color: "#22C55E", desc: "Fuera del perímetro: agrícola, protección, producción." },
    ] },
    { id: "subclasif", title: "Subclasificación del Suelo", icon: "🔬", analogy: "Si clasificación es 2 colores, subclasificación es 8 tonalidades.", items: [
      { label: "Urbano Consolidado", emoji: "🏢", color: "#3B82F6", desc: "Ciudad construida, servicios completos." },
      { label: "Urbano No Consolidado", emoji: "🔨", color: "#60A5FA", desc: "En urbanización, servicios parciales." },
      { label: "Urbano De Protección", emoji: "🛡️", color: "#06B6D4", desc: "Valor ecológico o riesgo dentro de lo urbano." },
      { label: "Rural De Producción", emoji: "🌽", color: "#22C55E", desc: "Aptitud agrícola, pecuaria, forestal." },
      { label: "Rural De Protección", emoji: "🌲", color: "#059669", desc: "Áreas naturales protegidas." },
      { label: "Rural De Expansión", emoji: "🔶", color: "#F59E0B", desc: "Reserva para crecimiento futuro. Requiere plan parcial." },
      { label: "Rural Extractivo", emoji: "⛏️", color: "#854D0E", desc: "Recursos no renovables con controles." },
    ] },
    { id: "edif", title: "Edificabilidad", icon: "📐", analogy: "Tu terreno es un vaso: COS PB = ancho, COS Total = cuánta agua cabe.", content: "COS PB (% planta baja), COS Total (total construible ÷ lote). Básica (incluida) y máxima (compras con COD).", example: "Código A608-50: Aislada, 6 pisos, retiro 8m, COS PB 50%." },
  ] },
  puos: { sections: [
    { id: "q", title: "¿Qué era?", icon: "📋", analogy: "Versión 1.0 de las reglas. La ley cambió → versión 2.0 (PUGS).", content: "Regulaba uso de suelo y zonificación. Ordenanza 0041 (2015). Derogado por Ordenanza 001-2021." },
    { id: "h", title: "Homologación PUOS → PUGS", icon: "🔄", analogy: "Como cuando pasamos del sucre al dólar: tabla de conversión.", items: [
      { label: "R1 (1-3 pisos)", emoji: "🏠", color: "#22C55E", desc: "→ Residencial baja densidad, Tipología 2" },
      { label: "R2 (4-6 pisos)", emoji: "🏢", color: "#3B82F6", desc: "→ Residencial media densidad, Tipología 3" },
      { label: "R3 (7+ pisos)", emoji: "🏗️", color: "#8B5CF6", desc: "→ Residencial alta densidad, Tipología 4" },
      { label: "I2", emoji: "🏭", color: "#F59E0B", desc: "→ Industrial mediano impacto (IMI)" },
      { label: "I3", emoji: "🏭", color: "#EF4444", desc: "→ Industrial alto impacto (IAI)" },
      { label: "I4", emoji: "🏭", color: "#DC2626", desc: "→ Industrial alto riesgo (IAR)" },
    ] },
    { id: "t", title: "Transición", icon: "⚡", analogy: "Goles anteriores siguen contando.", content: "Trámites iniciados con norma anterior se terminan con esa norma. Modificaciones hasta 25% del área aprobada.", example: "Licencia 2020 PUOS → modificatorio PUOS si no excede 25%." },
  ] },
  lootugs: { sections: [
    { id: "q", title: "¿Qué es?", icon: "⚖️", analogy: "La FIFA del ordenamiento territorial ecuatoriano.", content: "Ley nacional 2016. Obliga a todos los GADs a crear PDOT con PUGS." },
    { id: "o", title: "Obligaciones", icon: "📜", items: [
      { label: "Clasificar todo el suelo", emoji: "🗂️", color: "#10B981", desc: "Cada m² del cantón: urbano, rural o expansión." },
      { label: "Crear PUGS", emoji: "🏗️", color: "#8B5CF6", desc: "Estructurante + urbanístico + gestión." },
      { label: "12 años de vigencia", emoji: "📅", color: "#3B82F6", desc: "Actualizable al inicio de cada gestión." },
      { label: "Aprobación conjunta", emoji: "📎", color: "#F59E0B", desc: "PMDOT y PUGS en misma ordenanza." },
    ] },
  ] },
  cootad: { sections: [
    { id: "q", title: "¿Qué es?", icon: "🏛️", analogy: "Si Ecuador fuera empresa, el COOTAD es el organigrama.", content: "Competencias de todos los niveles de gobierno autónomo descentralizado." },
    { id: "c", title: "Competencias del DMQ", icon: "🎯", items: [
      { label: "Planificar desarrollo", emoji: "📊", color: "#EF4444", desc: "Formular y ejecutar el PMDOT." },
      { label: "Regular uso de suelo", emoji: "🗺️", color: "#F59E0B", desc: "Qué se construye, dónde, cuánto." },
      { label: "Expedir ordenanzas", emoji: "📜", color: "#3B82F6", desc: "Normas con fuerza de ley local." },
      { label: "Participación ciudadana", emoji: "🗣️", color: "#8B5CF6", desc: "Planes con participación activa." },
    ] },
  ] },
  irm: { sections: [
    { id: "q", title: "¿Qué es?", icon: "📄", analogy: "Así como tú tienes cédula, tu terreno tiene IRM.", content: "Documento con TODA la información normativa de un predio. Paso #1 antes de cualquier proyecto." },
    { id: "c", title: "¿Qué contiene?", icon: "📋", items: [
      { label: "Uso de suelo", emoji: "🏷️", color: "#06B6D4", desc: "Residencial, comercial, industrial..." },
      { label: "COS PB y COS Total", emoji: "📐", color: "#8B5CF6", desc: "% ocupación y construcción total." },
      { label: "Altura máxima", emoji: "📏", color: "#F59E0B", desc: "Pisos que puedes construir." },
      { label: "Retiros", emoji: "↔️", color: "#22C55E", desc: "Distancia desde linderos." },
      { label: "Afectaciones viales", emoji: "🛣️", color: "#EF4444", desc: "Franjas de vías planificadas." },
      { label: "Zonificación", emoji: "🗂️", color: "#3B82F6", desc: "Código que resume reglas (ej: A608-50)." },
    ], example: "IRM dice R2, COS PB 50%, 8 pisos, retiro 5m → uso residencial mediano, mitad del lote en PB, máx 8 pisos." },
  ] },
  luae: { sections: [
    { id: "q", title: "¿Qué es?", icon: "🏪", analogy: "Licencia de conducir para tu negocio.", content: "Autoriza funcionamiento de actividades económicas. Verifica compatibilidad con uso de suelo." },
    { id: "cm", title: "Compatibilidad", icon: "✅", analogy: "Zona residencial tranquila: no puedes abrir discoteca.", items: [
      { label: "Permitido ✅", emoji: "✅", color: "#22C55E", desc: "Actividad coincide con uso de suelo." },
      { label: "Restringido ⚠️", emoji: "⚠️", color: "#F59E0B", desc: "Con condiciones especiales." },
      { label: "Prohibido 🚫", emoji: "🚫", color: "#EF4444", desc: "No se puede bajo ninguna circunstancia." },
    ], example: "Restaurante en R2 = compatible. Fábrica química en R2 = prohibida." },
    { id: "pr", title: "Preexistencia", icon: "🕰️", content: "Si operabas antes del PUGS y ahora no es compatible:", items: [
      { label: "Autorización pre-2016", emoji: "📜", color: "#3B82F6", desc: "Prueba misma actividad, mismo predio." },
      { label: "LUAE 2016-2021", emoji: "📋", color: "#8B5CF6", desc: "Una o más LUAE entre ene-2016 y sep-2021." },
    ] },
  ] },
  cod: { sections: [
    { id: "q", title: "¿Qué es?", icon: "💰", analogy: "Antes 4 pisos, ahora 8. Los 4 extra no son gratis: pagas el upgrade.", content: "Pago obligatorio por mayor edificabilidad o compatibilidad de uso respecto al PUOS anterior." },
    { id: "cu", title: "¿Cuándo pago?", icon: "🤷", items: [
      { label: "Mayor edificabilidad", emoji: "🏗️", color: "#8B5CF6", desc: "Más COS Total. Pagas al obtener licencia." },
      { label: "Mayor compatibilidad", emoji: "🏪", color: "#F59E0B", desc: "Actividad antes prohibida ahora permitida." },
      { label: "Edificabilidad máxima", emoji: "⬆️", color: "#A855F7", desc: "Construir más allá de la básica." },
    ], example: "COS Total 200% (PUOS) → 400% (PUGS). Construyes 6 pisos → pagas COD por 2 pisos extra." },
    { id: "f", title: "Fórmula", icon: "🧮", content: "Avalúo × excedente × factor alfa. El alfa se revisa anualmente según economía.", example: "Alfa = termómetro económico. Economía bien → sube. Crisis → baja. Concejo aprueba cada año." },
  ] },
};

const TIMELINE = [
  { year: 2012, label: "ORDM-0170", desc: "Primer PMDOT", color: "#F59E0B", period: "2012–22", alcalde: "A. Barrera" },
  { year: 2015, label: "ORDM-0041", desc: "Actualización", color: "#3B82F6", period: "2015–25", alcalde: "M. Rodas" },
  { year: 2021, label: "ORDM-001", desc: "PMDOT+PUGS", color: "#8B5CF6", period: "2021–33", alcalde: "J. Yunda" },
  { year: 2024, label: "ORD-003", desc: "Alineación", color: "#EC4899", period: "2024–33", alcalde: "P. Muñoz" },
];

const QUIZ = [
  { q: "¿Cuántas microrregiones rurales tiene el DMQ?", o: ["5", "8", "10", "15"], c: 2 },
  { q: "¿Qué matriz incluye ríos y quebradas?", o: ["Verde", "Azul", "Roja", "Gris"], c: 1 },
  { q: "La Zona Logística Comercial está en:", o: ["Calderón", "Quitumbe", "Pifo", "Cumbayá"], c: 2 },
  { q: "Centralidad con influencia nacional:", o: ["Sectorial", "Zonal", "Metropolitana", "Barrial"], c: 2 },
  { q: "R2 del PUOS equivale a:", o: ["Tip. 1", "Tip. 2", "Tip. 3", "Tip. 4"], c: 2 },
  { q: "Polígono industrial existente:", o: ["Cumbayá", "Calacalí", "Guápulo", "Floresta"], c: 1 },
  { q: "¿Qué pagas si obtienes más pisos?", o: ["IRM", "LUAE", "COD", "PUGS"], c: 2 },
  { q: "Nodo articulador Nororiental 1:", o: ["Puembo", "Pifo", "Tababela", "Guayllabamba"], c: 1 },
  { q: "¿Cuántos años dura el PUGS?", o: ["4", "8", "12", "20"], c: 2 },
  { q: "COS PB mide:", o: ["Altura", "% planta baja", "Retiros", "Pisos"], c: 1 },
];

function NetworkGraph({ concepts, onSelect, selected }) {
  const svgRef = useRef(null);
  const boxRef = useRef(null);
  const [dims, setDims] = useState({ w: 500, h: 300 });

  useEffect(() => {
    const el = boxRef.current;
    if (el) {
      setDims({ w: el.clientWidth, h: Math.min(el.clientWidth * 0.55, 320) });
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const { w, h } = dims;

    const nodes = concepts.map((c, i) => ({ ...c, index: i }));
    const links = [];
    concepts.forEach((c) => {
      c.related.forEach((r) => {
        const si = concepts.findIndex((x) => x.id === c.id);
        const ti = concepts.findIndex((x) => x.id === r);
        if (ti > si) links.push({ source: si, target: ti });
      });
    });

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(78).strength(0.4))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide(35));

    const g = svg.append("g");

    const linkSel = g.selectAll("line")
      .data(links).join("line")
      .attr("stroke", "#333").attr("stroke-width", 1.2).attr("stroke-opacity", 0.25);

    const nodeSel = g.selectAll("g.nd")
      .data(nodes).join("g").attr("class", "nd")
      .style("cursor", "pointer")
      .on("click", (e, d) => onSelect(d.id));

    nodeSel.append("circle")
      .attr("r", (d) => (selected === d.id ? 26 : 20))
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => (selected === d.id ? "#fff" : "none"))
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (selected && selected !== d.id ? 0.3 : 1));

    nodeSel.append("text")
      .text((d) => d.emoji)
      .attr("text-anchor", "middle").attr("dy", "0.35em")
      .style("font-size", "14px").style("pointer-events", "none");

    nodeSel.append("text")
      .text((d) => d.title)
      .attr("text-anchor", "middle").attr("dy", 34)
      .style("font-size", "8.5px").style("fill", "#94a3b8")
      .style("font-weight", "700").style("pointer-events", "none");

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      nodeSel.attr("transform", (d) => {
        d.x = Math.max(28, Math.min(w - 28, d.x));
        d.y = Math.max(28, Math.min(h - 28, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    return () => sim.stop();
  }, [dims, selected, concepts, onSelect]);

  return (
    <div ref={boxRef}>
      <svg ref={svgRef} width={dims.w} height={dims.h} style={{ display: "block" }} />
    </div>
  );
}

function SectionCard({ s, color, depth = 0, onDrillChild }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: P.card, border: `1px solid ${open ? color + "40" : P.bd}`, borderRadius: 11, marginBottom: 6, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "10px 12px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: 17 }}>{s.icon}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: P.tx }}>{s.title}</span>
        <span style={{ color, fontSize: 14, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: "0 12px 14px", animation: "fadeIn .2s" }}>
          {s.analogy && (
            <div style={{ background: `${color}0c`, border: `1px solid ${color}20`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 8, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>💡 ANALOGÍA</div>
              <p style={{ margin: 0, color: P.tx, fontSize: 12, lineHeight: 1.55, fontStyle: "italic" }}>{s.analogy}</p>
            </div>
          )}

          {s.content && <p style={{ margin: "0 0 10px", color: "#cbd5e1", fontSize: 11.5, lineHeight: 1.6 }}>{s.content}</p>}

          {s.items && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: s.example || s.children ? 10 : 0 }}>
              {s.items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 7, background: `${it.color}08`, border: `1px solid ${it.color}14`, borderRadius: 7, padding: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{it.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: it.color }}>{it.label}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4, marginTop: 1 }}>{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {s.example && (
            <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.14)", borderRadius: 7, padding: 8, marginBottom: s.children ? 10 : 0 }}>
              <div style={{ fontSize: 8, color: "#22C55E", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>📌 EJEMPLO</div>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 10.5, lineHeight: 1.5 }}>{s.example}</p>
            </div>
          )}

          {s.children && s.children.map((child) => (
            <SectionCard key={child.id} s={child} color={color} depth={depth + 1} onDrillChild={onDrillChild} />
          ))}
        </div>
      )}
    </div>
  );
}

function DeepDive({ id, onBack, onNav }) {
  const c = CONCEPTS.find((x) => x.id === id);
  const data = DEEP[id];
  if (!c || !data) return null;

  return (
    <div style={{ animation: "slideUp .25s" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: P.mt, fontSize: 12, cursor: "pointer", padding: "0 0 10px", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14 }}>←</span> Volver a la red
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${c.color}18`, border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: c.color }}>{c.title}</h2>
          <p style={{ margin: "1px 0 0", color: "#475569", fontSize: 9.5 }}>{c.sub}</p>
        </div>
      </div>

      <div style={{ background: `${c.color}0c`, border: `1px solid ${c.color}20`, borderRadius: 9, padding: 10, margin: "8px 0 14px" }}>
        <p style={{ margin: 0, color: P.tx, fontSize: 12.5, lineHeight: 1.5 }}>💡 <em>{c.analogy}</em></p>
      </div>

      <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
        {data.sections.length} secciones para explorar
      </div>

      {data.sections.map((s) => (
        <SectionCard key={s.id} s={s} color={c.color} />
      ))}

      <div style={{ marginTop: 14, padding: 12, background: P.card, borderRadius: 10, border: `1px solid ${P.bd}` }}>
        <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, marginBottom: 6 }}>Relacionados:</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {c.related.map((r) => {
            const rc = CONCEPTS.find((x) => x.id === r);
            if (!rc) return null;
            return (
              <button key={r} onClick={() => { onNav(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: `${rc.color}10`, border: `1px solid ${rc.color}20`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13 }}>{rc.emoji}</span>
                <span style={{ color: rc.color, fontSize: 10, fontWeight: 700 }}>{rc.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizGame() {
  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [ans, setAns] = useState(null);
  const [done, setDone] = useState(false);
  const [sh] = useState(() => [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 6));

  const go = (i) => {
    if (ans !== null) return;
    setAns(i);
    if (i === sh[qi].c) setSc((s) => s + 1);
    setTimeout(() => {
      if (qi < sh.length - 1) { setQi(qi + 1); setAns(null); }
      else setDone(true);
    }, 1000);
  };

  if (done) {
    const p = Math.round((sc / sh.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: 18 }}>
        <div style={{ fontSize: 44 }}>{p >= 80 ? "🏆" : p >= 50 ? "👏" : "📚"}</div>
        <h3 style={{ color: P.tx, margin: "6px 0 2px" }}>{sc}/{sh.length}</h3>
        <p style={{ color: P.mt, fontSize: 11 }}>{p >= 80 ? "¡Expert@ en normativa!" : "Sigue explorando la red."}</p>
        <button onClick={() => { setQi(0); setSc(0); setAns(null); setDone(false); }}
          style={{ marginTop: 8, background: "#8B5CF6", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Otra vez</button>
      </div>
    );
  }

  const q = sh[qi];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: P.mt, fontSize: 10 }}>{qi + 1}/{sh.length}</span>
        <span style={{ color: "#8B5CF6", fontSize: 11, fontWeight: 700 }}>⭐ {sc}</span>
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
        {sh.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < qi ? "#8B5CF6" : i === qi ? "#8B5CF640" : "#1e293b" }} />
        ))}
      </div>
      <p style={{ color: P.tx, fontSize: 13, fontWeight: 600, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</p>
      <div style={{ display: "grid", gap: 5 }}>
        {q.o.map((o, i) => {
          let bg = "rgba(30,41,59,0.5)";
          let bd = "#334155";
          if (ans !== null) {
            if (i === q.c) { bg = "rgba(34,197,94,0.1)"; bd = "#22c55e"; }
            else if (i === ans) { bg = "rgba(239,68,68,0.1)"; bd = "#ef4444"; }
          }
          return (
            <button key={i} onClick={() => go(i)}
              style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 8, padding: "8px 10px", color: P.tx, fontSize: 12, cursor: ans !== null ? "default" : "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: P.mt, flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimelineViz() {
  const [a, setA] = useState(null);
  return (
    <div style={{ position: "relative", padding: "12px 0 2px" }}>
      <div style={{ position: "absolute", top: 32, left: 20, right: 20, height: 3, background: "linear-gradient(90deg,#F59E0B,#3B82F6,#8B5CF6,#EC4899)", borderRadius: 2 }} />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", padding: "0 2px" }}>
        {TIMELINE.map((d, i) => (
          <div key={i} style={{ textAlign: "center", cursor: "pointer", flex: 1 }} onClick={() => setA(a === i ? null : i)}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: d.color, margin: "0 auto 10px", border: a === i ? "2px solid #fff" : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#fff" }}>
              {String(d.year).slice(2)}
            </div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: d.color }}>{d.label}</div>
            <div style={{ fontSize: 7, color: "#475569" }}>{d.period}</div>
            {a === i && (
              <div style={{ background: "rgba(15,23,42,.95)", border: `1px solid ${d.color}`, borderRadius: 6, padding: 7, marginTop: 3, textAlign: "left", zIndex: 10, animation: "fadeIn .2s" }}>
                <div style={{ fontSize: 9, color: d.color, fontWeight: 700 }}>{d.desc}</div>
                <div style={{ fontSize: 8, color: "#94a3b8", marginTop: 1 }}>{d.alcalde}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { e: "🏠", l: "Tengo terreno", d: "Punto de partida", c: "#3B82F6" },
    { e: "📄", l: "Obtengo IRM", d: "Cédula del predio", c: "#06B6D4" },
    { e: "🔍", l: "Uso de suelo", d: "¿Residencial? ¿Comercial?", c: "#8B5CF6" },
    { e: "📐", l: "Edificabilidad", d: "¿Cuántos pisos?", c: "#10B981" },
    { e: "💰", l: "¿COD?", d: "Si hay beneficio vs PUOS", c: "#A855F7" },
    { e: "🏗️", l: "Licencia", d: "Planos + permisos", c: "#F59E0B" },
    { e: "✅", l: "¡Construyo!", d: "Respetando IRM", c: "#22C55E" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {steps.map((s, i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: `${s.c}08`, border: `1px solid ${s.c}12`, borderRadius: 7, padding: "6px 9px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `${s.c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{s.e}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, color: P.tx, fontWeight: 700 }}>{s.l}</div>
              <div style={{ fontSize: 8.5, color: "#475569" }}>{s.d}</div>
            </div>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
          </div>
          {i < steps.length - 1 && <div style={{ width: 2, height: 3, background: "#334155", margin: "0 auto" }} />}
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: "explore", l: "🔗 Red" },
  { id: "timeline", l: "📅 Historia" },
  { id: "flow", l: "🏠 Construir" },
  { id: "quiz", l: "🎮 Quiz" },
];

export default function App() {
  const [tab, setTab] = useState("explore");
  const [sel, setSel] = useState(null);
  const [deep, setDeep] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: P.bg, color: P.tx, fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,500;9..40,700&family=Space+Mono:wght@700&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px }
      `}</style>

      <div style={{ position: "fixed", top: -60, right: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(139,92,246,.05) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ padding: "16px 12px 8px", textAlign: "center" }}>
        <div style={{ fontSize: 8, color: "#8B5CF6", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>Distrito Metropolitano de Quito</div>
        <h1 style={{ margin: "2px 0 0", fontSize: 19, fontWeight: 700, background: "linear-gradient(135deg,#3B82F6,#8B5CF6,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Normativa Urbana Interactiva</h1>
      </div>

      {!deep && (
        <div style={{ display: "flex", gap: 3, padding: "0 12px 8px", overflowX: "auto" }}>
          {TABS.map((t) => (
            <button key={t.id}
              onClick={() => { setTab(t.id); setSel(null); setDeep(null); }}
              style={{ background: tab === t.id ? "rgba(139,92,246,.1)" : "rgba(30,41,59,.3)", border: tab === t.id ? "1.5px solid #8B5CF6" : "1.5px solid #1a2340", borderRadius: 7, padding: "4px 10px", color: tab === t.id ? "#c4b5fd" : "#475569", fontSize: 10.5, cursor: "pointer", whiteSpace: "nowrap", fontWeight: tab === t.id ? 700 : 500, flexShrink: 0 }}>
              {t.l}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "0 12px 30px", maxWidth: 660, margin: "0 auto" }}>

        {deep && <DeepDive id={deep} onBack={() => { setDeep(null); setSel(null); }} onNav={(id) => setDeep(id)} />}

        {!deep && tab === "explore" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 10, marginBottom: 10 }}>
              <h2 style={{ margin: "0 0 1px", fontSize: 12.5, fontWeight: 700 }}>Red de Normativa</h2>
              <p style={{ margin: "0 0 6px", color: "#475569", fontSize: 9 }}>Toca nodo → resumen → detalles con sub-secciones</p>
              <NetworkGraph concepts={CONCEPTS} onSelect={(id) => { setSel(id); setDeep(null); }} selected={sel} />
            </div>

            {sel && (() => {
              const c = CONCEPTS.find((x) => x.id === sel);
              const sCount = DEEP[c.id]?.sections?.length || 0;
              return (
                <div style={{ background: "rgba(15,23,42,.95)", border: `2px solid ${c.color}`, borderRadius: 13, padding: 16, animation: "slideUp .25s", position: "relative" }}>
                  <button onClick={() => setSel(null)} style={{ position: "absolute", top: 6, right: 10, background: "none", border: "none", color: "#475569", fontSize: 16, cursor: "pointer" }}>✕</button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{c.emoji}</span>
                    <div>
                      <h3 style={{ margin: 0, color: c.color, fontSize: 16 }}>{c.title}</h3>
                      <p style={{ margin: 0, color: "#475569", fontSize: 9 }}>{c.sub}</p>
                    </div>
                  </div>
                  <div style={{ background: `${c.color}0c`, border: `1px solid ${c.color}1e`, borderRadius: 8, padding: 9, marginBottom: 10 }}>
                    <p style={{ margin: 0, color: P.tx, fontSize: 12, lineHeight: 1.5, fontStyle: "italic" }}>💡 {c.analogy}</p>
                  </div>
                  <button
                    onClick={() => { setDeep(c.id); setSel(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ width: "100%", background: `${c.color}12`, border: `2px solid ${c.color}30`, borderRadius: 10, padding: "11px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <span style={{ color: c.color, fontSize: 12, fontWeight: 700 }}>Explorar {c.title} en detalle</span>
                    <span style={{ color: c.color, fontSize: 9, opacity: 0.7 }}>{sCount} secciones</span>
                    <span style={{ color: c.color, fontSize: 14 }}>→</span>
                  </button>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 8 }}>
                    {c.related.map((r) => {
                      const rc = CONCEPTS.find((x) => x.id === r);
                      if (!rc) return null;
                      return (
                        <button key={r} onClick={() => setSel(r)}
                          style={{ background: `${rc.color}0a`, border: `1px solid ${rc.color}1e`, borderRadius: 5, padding: "2px 6px", cursor: "pointer", fontSize: 9, color: rc.color, fontWeight: 600 }}>
                          {rc.emoji} {rc.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {!sel && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
                {CONCEPTS.map((c) => (
                  <button key={c.id} onClick={() => setSel(c.id)}
                    style={{ background: P.card, border: `1.5px solid ${c.color}15`, borderRadius: 9, padding: 8, cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginTop: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 8.5, color: "#475569", marginTop: 1, lineHeight: 1.3 }}>{c.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!deep && tab === "timeline" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 12, marginBottom: 8 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 12.5, fontWeight: 700 }}>Evolución</h2>
              <TimelineViz />
            </div>
            <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 12 }}>
              {[
                { c: "#F59E0B", y: "2012", t: "Primer PMDOT", d: "Plan integral de desarrollo territorial." },
                { c: "#3B82F6", y: "2015", t: "Actualización", d: "Nuevos ejes, PUOS, CIIU nivel 7." },
                { c: "#8B5CF6", y: "2021", t: "PMDOT+PUGS", d: "Nace PUGS, COD, Operador Urbano, 12 años." },
                { c: "#EC4899", y: "2024", t: "Alineación", d: "Actualiza sin alterar estructurante." },
              ].map((h, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${h.c}`, paddingLeft: 9, marginBottom: 8 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: h.c }}>{h.y} — {h.t}</div>
                  <p style={{ margin: "1px 0 0", fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{h.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!deep && tab === "flow" && (
          <div style={{ animation: "fadeIn .3s" }}>
            <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 12, marginBottom: 8 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 12.5, fontWeight: 700 }}>¿Quiero construir?</h2>
              <FlowDiagram />
            </div>
            <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 12 }}>
              {[
                { c: "#F97316", t: "Preexistencias", d: "Negocio anterior al PUGS puede obtener preexistencia." },
                { c: "#A855F7", t: "COD", d: "Más edificabilidad que PUOS = pagas COD." },
                { c: "#06B6D4", t: "Riesgo", d: "Zona de riesgo = informe obligatorio." },
              ].map((it, i) => (
                <div key={i} style={{ background: `${it.c}08`, border: `1px solid ${it.c}12`, borderRadius: 8, padding: 9, marginBottom: 5 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: it.c }}>{it.t}</div>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{it.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!deep && tab === "quiz" && (
          <div style={{ background: P.card, borderRadius: 13, border: `1px solid ${P.bd}`, padding: 16, animation: "fadeIn .3s" }}>
            <h2 style={{ margin: "0 0 1px", fontSize: 12.5, fontWeight: 700 }}>🎮 Quiz</h2>
            <p style={{ margin: "0 0 10px", color: "#475569", fontSize: 9 }}>6 preguntas aleatorias</p>
            <QuizGame />
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "10px 12px 18px", borderTop: `1px solid ${P.bd}` }}>
        <p style={{ margin: 0, color: "#0f172a", fontSize: 7.5 }}>PUGS 2021 · PMDOT 2024-2033 · Herramienta educativa</p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
