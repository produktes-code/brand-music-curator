# Brand Music Curator

![Brand Music Curator](https://img.shields.io/badge/Status-Enterprise_Ready-success) ![License](https://img.shields.io/badge/License-Open_Source-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

**Brand Music Curator** es un Gemelo Digital de Audio de arquitectura corporativa diseñado para el sector *Retail*, franquicias y hostelería a gran escala. No se trata de un simple reproductor, sino de un motor de **Neuro-Arquitectura Sensorial** B2B capaz de sincronizar el hilo musical de cientos de establecimientos, tomar decisiones mediante inteligencia artificial e implementando un escudo legal infalible frente a entidades de gestión de derechos de autor.

**Proyecto creado y desarrollado conjuntamente por Antigravity IA y Jesús Ferrer.**

---

## 🎯 Propósito Principal
La plataforma está diseñada para resolver tres problemas críticos en la industria del retail:
1. **Control de Flujo de Clientes:** Modificación dinámica del ritmo de la música (BPMs) para acelerar o pausar la afluencia de compradores.
2. **Resiliencia Extrema (Zero-Silence):** Arquitectura *Offline-First* con cachés dinámicas que garantizan la reproducción ininterrumpida ante caídas crónicas de la red de fibra óptica.
3. **Escudo Legal (SGAE Shield):** Transición algorítmica hacia música *Royalty-Free* (libre de derechos) ante inspecciones, respaldado por un registro de auditoría (Audit Log) inmutable.

---

## 🏗️ Arquitectura Técnica
Brand Music Curator es un sistema monolítico distribuido operado desde una aplicación nativa, estructurado en 4 motores:

*   **Frontend (UI):** Desarrollado en React 19 con empaquetado **Electron**. Interfaz *Glassmorphism* para una experiencia de usuario fluida y reactiva.
*   **Backend (Core):** Servidor local Node.js que orquesta las llamadas al sistema y la telemetría física.
*   **Base de Datos (Persistencia):** Motor **Better-SQLite3** encriptado. Garantiza que la programación musical persista y se reanude de forma autónoma tras cortes de electricidad (Blackouts).
*   **Motor DSP (Inteligencia Artificial):** *Bridge* IPC conectado a un entorno **Python 3**. Usa librerías como `librosa` y `scipy` para analizar las formas de onda, procesar audios en tiempo real y aplicar filtros matemáticos a las pistas.

---

## ⚙️ Características y Secciones del Software

### 1. Dashboard de Telemetría
Panel de control principal que muestra el *Now Playing* y hace un diagnóstico de red en tiempo real. Utiliza *child_process* para lanzar comandos de latencia al sistema y verificar si la red del local comercial está sana o si debe recurrir al disco duro.

### 2. Groups & Zones
Gestor de infraestructura física. Permite organizar y agrupar diferentes locales (Zonas) bajo marcas maestras (Grupos). Cada zona genera un Hardware ID único para facilitar auditorías remotas.

### 3. Mixes Manager (Smart DJ)
En lugar de "listas de reproducción" estáticas, el sistema utiliza "Mixes" en un formato de rejilla de tarjetas compacta y de alta densidad de información (optimizada para B2B).
*   **Estilos Dinámicos:** El usuario selecciona el género de inicio (Estilo A) y fin (Estilo B) entre **10 géneros reales** (*Indie Pop, Deep House, Chillout, Jazz, Rock, Pop Comercial, Latino/Urbano, Clásica, Blues, Soul*).
*   **Control del Ratio y Tempo:** Deslizador porcentual de probabilidad para ajustar la mezcla y selector de energía/tempo (*Low, Medium, High*).
*   **Frecuencia de Cuñas Publicitarias:** Permite configurar el intervalo de reproducción de mensajes comerciales (anuncios).
*   **Guardado SQLite:** Un botón directo permite persistir la receta de mezcla en la base de datos local SQLite.

### 4. Dayparting Schedule (Matriz Semanal)
Calendario visual interactivo estructurado en una cuadrícula de **7 días de la semana** (Lunes a Domingo) por **4 franjas horarias** comerciales (*Mañana, Mediodía, Tarde, Noche/Cierre*).
*   **Auto-Sincronización:** Cada celda dispone de un desplegable con las recetas de mezcla creadas. Al cambiar la selección, la programación se guarda automáticamente en la base de datos central sin ventanas emergentes molestas.
*   **Transiciones Inteligentes:** El motor realiza una transición atenuada cruzada (crossfade) de 7 segundos de forma autónoma al cruzar las franjas horarias.

### 5. Engine Settings (Neuro-IoT)
Centro de control de la infraestructura y hardware:
*   Asignación dinámica de memoria Caché de disco para reproducciones sin conexión.
*   **Tringbox Mode:** Conexión con sensores cuentapersonas y clima local para modular automáticamente la velocidad y BPM de la música según el tráfico y el tiempo exterior.

### 6. SGAE Shield (Escudo de Propiedad Intelectual)
Sistema de defensa frente a inspectores. Al activarse, purga la RAM, silencia la música comercial y transiciona el sistema íntegramente a un catálogo de librería libre de derechos (Royalty-Free). Genera un *Audit Log* inmutable y certificado para acreditar la exención de pagos.

### 7. B2B Player Lock (Bloqueo del Panel de Tienda)
Para mantener la identidad de marca en los establecimientos, los gerentes pueden bloquear el panel. Al pulsar el candado de seguridad en la cabecera, se ocultan y deshabilitan los controles locales en tienda. Para reactivar las modificaciones manuales, se requiere ingresar el **PIN Supervisor: `1234`**.

---

## 🚀 Instalación y Uso (MacOS)
1. Descargue la última *release* del archivo de instalación `Brand Music Curator-1.0.0.dmg`.
2. Monte la imagen de disco e instale la aplicación arrastrándola a su carpeta de **Aplicaciones**.
3. Al abrir el software, el servidor SQLite y el motor Node.js local se inicializarán automáticamente.

---

## 📋 Manual de Uso

📥 **[Descargar Manual Extensivo y Tutorial en PDF](./manual.pdf)**

Para la lectura exhaustiva de cada funcionalidad, consulte el manual interactivo en PDF.

---

**Licencia:** Dominio Público / Open Source.  
*Diseñado con pasión por la convergencia entre la música y la ingeniería neuronal.*
*Desarrollado en colaboración por Antigravity IA y Jesús Ferrer.*
