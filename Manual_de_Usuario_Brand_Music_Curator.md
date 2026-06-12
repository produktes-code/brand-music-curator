# BRAND MUSIC CURATOR
## MANUAL DEL USUARIO (Edición Exhaustiva)
**Versión del Software:** 1.0.0 Enterprise  
**Fecha de Publicación:** Junio 2026  

---

## ÍNDICE DE CONTENIDOS
1. [Introducción y Conceptos Básicos](#1-introducción-y-conceptos-básicos)
2. [Requisitos e Instalación](#2-requisitos-e-instalación)
3. [Primeros Pasos: El Dashboard](#3-primeros-pasos-el-dashboard)
4. [Gestión de Infraestructura: Groups & Zones](#4-gestión-de-infraestructura-groups--zones)
5. [Programación Musical: Mixes Manager](#5-programación-musical-mixes-manager)
6. [Automatización: Visual Dayparting Schedule](#6-automatización-visual-dayparting-schedule)
7. [Configuración Avanzada del Motor (Engine Settings)](#7-configuración-avanzada-del-motor-engine-settings)
8. [Auditoría Legal: SGAE Shield](#8-auditoría-legal-sgae-shield)
9. [Resolución de Problemas (Troubleshooting)](#9-resolución-de-problemas-troubleshooting)

---

## 1. INTRODUCCIÓN Y CONCEPTOS BÁSICOS
Bienvenido a **Brand Music Curator**. Este software no es un simple reproductor de música; es una plataforma de **Neuro-Arquitectura Sensorial** diseñada para operar en entornos corporativos (Retail, Hostelería, Flagships). 

Su propósito principal es automatizar el hilo musical de múltiples establecimientos físicos, garantizando que la música suene sin interrupciones (incluso sin internet), cumpliendo estrictamente con la legalidad de derechos de autor (SGAE) y adaptando el ritmo de la música a la afluencia de clientes para optimizar las ventas.

### 1.1 Glosario de Términos
*   **Zona (Zone):** Un espacio físico independiente dentro de un local comercial (ej. "Probadores", "Terraza").
*   **Mix:** Una fórmula matemática que combina dos listas de reproducción en un porcentaje exacto (ej. 70% Pop, 30% Electrónica).
*   **Dayparting:** La técnica de dividir el día en franjas horarias para asignar un estilo musical específico a cada una.
*   **Fallback / Offline Cache:** El sistema de emergencia que permite a la aplicación reproducir música desde el disco duro cuando el router del local se queda sin internet.
*   **SGAE Shield:** El protocolo de defensa legal que cambia la música comercial por música libre de derechos en caso de inspección.

---

## 2. REQUISITOS E INSTALACIÓN

### 2.1 Requisitos del Sistema (Hardware "Freebox")
*   **Sistema Operativo:** macOS 12 (Monterey) o superior. Arquitectura Intel x64 o Apple Silicon.
*   **Almacenamiento:** Mínimo 10 GB de espacio libre en disco (SSD recomendado para caché ultrarrápida).
*   **Memoria RAM:** 8 GB Mínimo.
*   **Conectividad:** Conexión a internet estable para sincronización de catálogo.

### 2.2 Instalación
1. Localice el archivo `Brand Music Curator-1.0.0.dmg` proporcionado por su equipo de ingeniería.
2. Haga doble clic para montar la imagen de disco.
3. Arrastre el icono de **Brand Music Curator** hacia la carpeta **Aplicaciones** (Applications).
4. Abra la aplicación desde su Launchpad o carpeta de Aplicaciones.

---

## 3. PRIMEROS PASOS: EL DASHBOARD
El **Dashboard** (Panel de Control) es la pantalla principal que aparece al iniciar sesión. Su objetivo es ofrecer un estado de salud general de la infraestructura a nivel global y permitir el control de reproducción local.

### 3.1 Now Playing (Reproducción Actual)
En la parte superior verá la tarjeta de reproducción actual. 
*   **Indicador de Progreso:** Muestra el tiempo transcurrido y restante de la canción actual.
*   **Controles de Transporte:** Botones estándar de Pausa, Play, Siguiente, Anterior. 
*   *Nota:* Como administrador, puede saltar canciones, pero recuerde que el sistema está diseñado para fluir automáticamente según el calendario programado.

### 3.2 B2B Player Lock (Bloqueo del Reproductor)
Una función clave de Brand Music Curator es el **Bloqueo del Panel**. 
*   **Propósito:** Evita que el personal de la tienda altere la música de marca o pause la reproducción sin autorización.
*   **Cómo funciona:** En la parte superior derecha de la cabecera, junto al perfil de usuario, hay un botón con un candado. Al pulsarlo, el panel se bloquea y los botones de control de reproducción quedan ocultos tras un escudo de seguridad.
*   **Desbloqueo:** Para volver a habilitar los cambios manuales, pulse el candado e introduzca el **PIN de Supervisor de Fábrica: `1234`**.

### 3.3 Indicador de Estado de Red (Network Status)
Ubicado en la esquina superior izquierda de la cabecera:
*   **ONLINE CLOUD SYNC (Gris/Blanco):** El sistema está descargando música fresca y enviando telemetría al servidor central.
*   **FALLBACK: OFFLINE CACHE (Naranja):** Indica una caída de internet en el establecimiento. El software ha transicionado sin cortes a la música almacenada en el disco duro.

---

## 4. GESTIÓN DE INFRAESTRUCTURA: GROUPS & ZONES
Esta sección permite organizar físicamente los reproductores instalados en sus tiendas.

### 4.1 Añadir un Nuevo Grupo
Un "Grupo" representa una región o franquicia (ej. "Tiendas Madrid Centro").
1. En la parte superior derecha, localice la barra de texto `New Group Name...`
2. Escriba el nombre deseado.
3. Pulse el botón rojo **`+ Add Group`**.
4. El grupo se guardará de forma persistente en la base de datos y aparecerá en la lista inferior.

### 4.2 Monitorización de Zonas
Cada grupo despliega una tabla con las **Zonas** que lo componen. En la tabla podrá verificar:
*   **Hardware ID:** El número de serie único del ordenador que reproduce la música en esa tienda.
*   **Status:** Un indicador verde (`Online`) o naranja (`Offline`) que le dice en tiempo real si el equipo de esa tienda está encendido y conectado a la red de la central.

---

## 5. PROGRAMACIÓN MUSICAL: MIXES MANAGER (SMART DJ)
El verdadero corazón curatorial del sistema. Aquí no creamos "listas de canciones", sino "Recetas Musicales" dinámicas de gran densidad visual.

### 5.1 Crear un Nuevo Mix
1. Escriba un nombre descriptivo en la caja de texto superior (ej. "Tarde de Rebajas").
2. Pulse **`+ Create Mix`**. Se generará una tarjeta de control compacta en la rejilla.

### 5.2 Estilos Dinámicos (Dropdowns de Estilo)
Cada mix permite seleccionar dos playlists/estilos para mezclarse:
*   **Estilo A (Base) y Estilo B (Contrapunto):** Configúrelos mediante los selectores desplegables. Dispone de **10 estilos reales**: *Indie Pop, Deep House, Chillout, Jazz, Rock, Pop Comercial, Latino/Urbano, Clásica, Blues, Soul*.

### 5.3 Ajuste de la Mezcla (Blend Ratio)
En la tarjeta del Mix, use la barra deslizadora (*slider*) en el centro.
*   **Uso del Slider:** Arrastre hacia la izquierda o la derecha. 
*   **Efecto:** Si lo sitúa en un 70% hacia el lado izquierdo, el algoritmo seleccionará aleatoriamente 7 canciones de la base (Estilo A) por cada 3 canciones del contrapunto (Estilo B). Esto garantiza que la música nunca sea repetitiva.

### 5.4 Energía, Cuñas y Filtros de Seguridad (Brand Guardrails)
*   **Energía/Tempo:** Seleccione el nivel deseado (*Low, Medium, High*) para ajustar la velocidad de reproducción.
*   **Frecuencia Cuñas:** Defina con qué intervalo de tiempo de reproducción se inyectan las cuñas publicitarias de audio (*cada 15m, 30m, 45m o 60m*).
*   **Block Explicit Lyrics:** Filtra y bloquea canciones que contengan letras con etiqueta *Parental Advisory*.
*   **Block Reggaeton/Urban:** Bloquea géneros urbanos que no encajen con la filosofía de su marca.
*   **Guardado SQLite:** Tras configurar un mix, es obligatorio pulsar el botón verde **`💾 Guardar Mix`** para almacenar de forma persistente los cambios en SQLite.

---

## 6. AUTOMATIZACIÓN: VISUAL DAYPARTING SCHEDULE (MATRIZ SEMANAL)
Esta herramienta permite programar la programación musical a lo largo de toda la semana de forma compacta y visual.

### 6.1 Cuadrícula de Calendario Tabular (7 Días)
La pantalla despliega una matriz de **7 días de la semana** (Lunes a Domingo) por **4 franjas horarias** comerciales:
*   **Mañana:** 08:00 - 12:00
*   **Mediodía:** 12:00 - 16:00
*   **Tarde:** 16:00 - 20:00
*   **Noche/Cierre:** 20:00 - 00:00

### 6.2 Cómo Asignar un Mix a una Franja
1. Cada celda de la cuadrícula muestra el mix actualmente asignado en un selector desplegable.
2. Haga clic en el selector desplegable de la celda correspondiente al día y hora deseados.
3. Elija el Mix que prefiera de la lista de mixes existentes en el sistema (o elija *Sin Asignar*).
4. El sistema guardará el cambio de forma automática y persistente en la base de datos de manera inmediata.

*Nota Técnica:* El cambio de música al pasar de una franja a otra no es brusco; el software realiza un *Crossfade* algorítmico de 7 segundos.

---

## 7. CONFIGURACIÓN AVANZADA DEL MOTOR (ENGINE SETTINGS)
Sección reservada para el personal de TI y administradores de sistemas.

### 7.1 Offline Architecture (Caché local)
*   **Pre-Caching Limit (GB):** Defina el tamaño máximo que la aplicación puede ocupar en el disco duro del Mac. Por defecto está fijado en **4 GB** (suficiente para ~400 horas de reproducción sin red).

### 7.2 Tringbox AI Engine (Neuro-IoT)
*   **Interruptor ACTIVE / DISABLED:** Habilita el puente de comunicación con sensores locales y meteorología. Si se activa, el algoritmo de la IA modulará de forma autónoma los BPM según las variables climáticas o el tráfico de personas del establecimiento.

### 7.3 Guardado Persistente
*   Tras realizar cualquier cambio en esta pantalla, pulse el botón **`💾 Guardar Proyecto`** para inyectar los cambios en la base de datos centralizada (SQLite).

---

## 8. AUDITORÍA LEGAL: SGAE SHIELD
El escudo legal definitivo para locales y franquicias en España.

### 8.1 Botón del Pánico (Panic Mode)
*   **Funcionamiento:** En caso de una inspección sorpresa, pulse el botón rojo gigante **`ACTIVATE PANIC MODE`**.
*   **Qué ocurre:** El software purga inmediatamente la memoria RAM y fuerza una transición absoluta hacia el catálogo *Royalty-Free* (Música de Librería Libre de Derechos). Toda música comercial queda bloqueada.

### 8.2 Audit Log (Registro de Auditoría)
*   Muestra un registro inmutable (fecha, hora, ubicación y código de certificación de exención `RF-101`) de cada canción royalty-free que ha sonado, sirviendo como prueba legal pericial ante las entidades de gestión colectiva de derechos de autor (SGAE, AGEDI, AIE).

---

## 9. RESOLUCIÓN DE PROBLEMAS (TROUBLESHOOTING)

**Problema 1: La aplicación no guarda los grupos nuevos o mixes.**
*   *Solución:* Asegúrese de que el motor de base de datos (Backend) está en ejecución. El administrador de TI debe verificar que el proceso `node server.js` está activo en el puerto 4000.

**Problema 2: El indicador muestra "FALLBACK" constantemente aunque hay internet.**
*   *Solución:* El sistema de telemetría hace un ping constante a `8.8.8.8`. Si el ping supera los 250ms, el sistema activa la protección offline. Verifique la congestión de red del local.

**Problema 3: Las modificaciones de Mixes o Programación no responden.**
*   *Solución:* Compruebe que el panel no está bloqueado. Si aparece el botón de candado arriba a la derecha en rojo con la etiqueta "🔒 Panel Tienda Bloqueado", haga clic en él e introduzca el PIN `1234` de supervisor.

---
*(Fin del Documento. Copyright © 2026 Antigravity IA & Jesús Ferrer. Todos los derechos reservados).*
