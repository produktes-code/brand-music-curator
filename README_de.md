> **Nota:** Esta es la documentación oficial en Deutsch.

<p align="center">
  <img src="build/icon.png" width="128" height="128" style="border-radius: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" alt="Brand Music Curator Logo" />
</p>

<h1 align="center">Brand Music Curator V1.0.0 (Deutsch)</h1>

<p align="center">
  <b>Plataforma de Neuro-Arquitectura Sensorial de Audio y Reproductor de Hilo Musical B2B</b><br/>
  <i>B2B Audio Sensory Neuro-Architecture Platform & Background Music Player</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="Build" />
  <img src="https://img.shields.io/badge/Version-v1.0.0-blue?style=for-the-badge" alt="Versión 1.0.0" />
  <img src="https://img.shields.io/badge/Status-Enterprise_Ready-success?style=for-the-badge" alt="Estado" />
  <img src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-red?style=for-the-badge" alt="Licencia" />
</p>

<p align="center">
  <b>🌐 Multilingual & Multimodal Support / Soporte Multiidioma:</b><br/>
  🇪🇸 Spanish | 🇬🇧 English | 🇩🇪 German | 🇷🇺 Russian | 🇯🇵 Japanese | 🇺🇦 Ukrainian | 🇨🇳 Chinese
</p>

---

## 🎯 Overview / Descripción del Proyecto

**Brand Music Curator** es un Gemelo Digital de Audio corporativo diseñado específicamente para el sector *Retail*, franquicias y hostelería a gran escala. Actúa como el cerebro curatorial de tus establecimientos, ofreciendo música ininterrumpida y modulada mediante IA, protegiendo al negocio frente a inspecciones legales y asegurando una experiencia de cliente (CX) perfecta.

> [!NOTE]
> Desarrollado por **produktes-code** y **Antigravity IA** para establecer estándares profesionales en la ingeniería de audio comercial.

---

## 📸 Capturas de Pantalla
*(Actualizadas: Junio 2026)*

<p align="center">
  <img src="https://via.placeholder.com/800x450/1a1a1a/c3f400?text=Dashboard+Principal+(Dayparting)" alt="Dashboard Principal" />
</p>

---

## ⚙️ Características Principales

1. 🎼 **Análisis de BPM y Key**: Algoritmos avanzados para la detección de energía, tempo y armónicos de los archivos de audio.
2. 🧠 **Curación IA y NLP**: Generación de *Mixes* matemáticos perfectos usando prompts en lenguaje natural.
3. 🎧 **Integración de Fuentes (Local y Spotify)**: Capacidad para procesar bibliotecas FLAC locales o realizar integraciones con Spotify API (como fallback).
4. 🌍 **Soporte Multilingüe (7 idiomas)**: Interfaz de usuario mutante al 100% en Español, Inglés, Alemán, Ruso, Japonés, Ucraniano y Chino.
5. 🛡️ **Blindaje de Seguridad (SGAE Shield)**: Auditoría blockchain inmutable y botón del pánico para conmutar inmediatamente a un catálogo libre de derechos (*Royalty-Free*).

---

## 🏗️ Stack Tecnológico

*   **Frontend Interface:** React 19 + Tailwind CSS + Vite (Empaquetado en Electron para escritorio).
*   **Backend Server:** Node.js (Express) con Rate Limiting y CORS restrictivo.
*   **Database Storage:** Better-SQLite3 con cifrado nativo.
*   **Audio DSP:** Python 3 + `librosa` / `scipy` para análisis de ondas.

### 📁 Estructura de Carpetas

```text
brand-music-curator/
├── audio-engine/       # Analizador Python (BPM, Key) y DSP
├── backend/            # API Express Node.js, Base de datos y Auth
├── docs/               # Manuales PDF multilingües compilados
└── player/             # Frontend React/Vite y empaquetador Electron
```


---

## 🚀 Instalación y Configuración Rápida

### Vía Docker (Recomendado para servidores)
```bash
docker build -t brand-music-curator .
docker run -d -p 4000:4000 -p 5173:5173 --env-file .env brand-music-curator
```

### Vía Manual (Desarrollo local)
```bash
# 1. Clonar el repositorio
git clone https://github.com/produktes-code/brand-music-curator.git
cd brand-music-curator

# 2. Iniciar el Backend
cd backend && npm ci && npm start

# 3. Iniciar el Frontend (En otra terminal)
cd player && npm ci && npm run dev
```

---

## 📖 Guía de Uso Rápido

1. **Inicia el servidor** y accede a `http://localhost:5173`.
2. **Desbloquea el panel** utilizando el PIN de Supervisor (`1234`).
3. Ve a la pestaña **Mixes** y crea una receta musical (ej. 70% Deep House, 30% Jazz).
4. Arrastra la música en la pestaña **Dashboard** (Archivos hasta 2 GB con validación de archivos mediante Magic Bytes).
5. Asigna tus mezclas a las franjas horarias en el **Planificador**.
6. Haz clic en **Guardar Proyecto**. El hilo musical comenzará a sonar en la tienda conectada.

---

## 💻 Instaladores Nativos

El proyecto se compila y empaqueta en binarios ejecutables para las distintas plataformas:
*   **macOS**: Instalador nativo disponible como archivo `.dmg`.
*   **Windows**: Instalador disponible como archivo `.exe`.

---

## 📚 Documentación Completa

Para acceder a la documentación técnica, manual de usuario y guía de resolución de problemas:
👉 **[Descargar Manual Técnico Completo (PDF)](./docs/USER_MANUAL.pdf)**

---

## ⚖️ Créditos y Licencia

Este software está bajo la licencia **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**. 
Permite el uso, distribución y modificación de la herramienta para fines no comerciales. Creado y mantenido por **produktes-code**. 

*© 2026 Brand Music Curator — Todos los derechos reservados.*


⚠️ Hinweis für macOS-Benutzer: Beim ersten Öffnen der Anwendung zeigt macOS möglicherweise eine Sicherheitswarnung an. Lösung: Klicken Sie mit der rechten Maustaste auf die Anwendung und wählen Sie "Öffnen", dann klicken Sie im Dialog auf "Öffnen". Falls sie bereits blockiert wurde, gehen Sie zu Systemeinstellungen > Datenschutz & Sicherheit und klicken Sie auf "Trotzdem öffnen".

