<p align="center">
  <img src="build/icon.png" width="128" height="128" style="border-radius: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);" alt="Brand Music Curator Logo" />
</p>

<h1 align="center">Brand Music Curator V1.0.0</h1>

<p align="center">
  <b>B2B Audio Sensory Neuro-Architecture Platform & Background Music Player</b><br/>
  <i>Plataforma de Neuro-Arquitectura Sensorial de Audio y Reproductor de Hilo Musical B2B</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" alt="Build" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Status-Enterprise_Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-red?style=for-the-badge" alt="License" />
</p>

🌐 **Leer en:** [🇬🇧 English](README.md) | **🇪🇸 Español** | [🇩🇪 Deutsch](README_de.md) | [🇷🇺 Русский](README_ru.md) | [🇯🇵 日本語](README_ja.md) | [🇺🇦 Українська](README_uk.md) | [🇨🇳 中文](README_zh.md)

---

## 🎯 La Visión (Introducción)

La génesis de Brand Music Curator surge de una frustración profunda en la industria del Retail: la música ambiental en espacios comerciales siempre ha sido una idea de último momento, a menudo relegada a listas de reproducción genéricas que acaban por fatigar tanto a clientes como a empleados. Como ingenieros y diseñadores de experiencia, comprendimos que el audio no es un adorno, es un ancla psicológica. Brand Music Curator fue diseñado para ser el Gemelo Digital de Audio definitivo para grandes superficies. No es un reproductor; es un cerebro curatorial que comprende la energía del local, modula el flujo de clientes (CX) y, críticamente, blinda al negocio frente a las draconianas inspecciones de derechos de autor. Hemos creado esta herramienta para devolverle el control a las marcas sobre su identidad sonora.

> [!NOTE]
> Desarrollado por **produktes-code** y **Jesús Ferrer (CHUS BZN)** para establecer estándares profesionales en la ingeniería comercial.

---

## 📸 Interface / Ergonomics

![Desktop Interface](docs/screenshots/screenshot-Desktop.png)


---

## ⚙️ Masterclass de Parámetros (Funcionalidades)

- **Motor DSP Analítico (librosa)**: ¿Por qué necesitamos análisis matemático en tiempo real? Porque fiarse de los metadatos ID3 de un mp3 es un error de novato. Hemos integrado el motor 'librosa' para que la aplicación lea los bytes del audio, extrayendo la energía RMS (impacto real en el altavoz), el Tempo (BPM) y la Clave Armónica. Esto permite que el sistema ensamble listas que no tienen saltos de energía destructivos.
- **Matriz de 45 Estilos Musicales**: No creemos en las listas de reproducción estáticas. El usuario dispone de 45 géneros (desde Deep House a Acoustic Folk) y un sistema de 'Recetas' (Mixes) donde se cruzan porcentajes. Seleccionar 70% Indie Pop y 30% Lo-Fi Hip Hop crea una textura específica diseñada para relajar al cliente sin perder ritmo. Esto empodera al music curador para pintar con sonido.
- **Topología de Zonas Independientes**: Un hotel no suena igual en el lobby que en el restaurante. Hemos estructurado el software para enrutar el audio algorítmicamente por zonas de hardware. De este modo, desde una única máquina centralizada, el ingeniero de sonido de la instalación puede gobernar múltiples atmósferas sin cruces de fase ni de concepto.
- **SGAE Shield (Blindaje de Derechos)**: El dolor de cabeza más grande en retail son las multas por derechos de propiedad intelectual. El 'SGAE Shield' es nuestra respuesta de ingeniería legal. Un simple botón corta inmediatamente cualquier streaming no autorizado y fuerza al reproductor a alimentarse estrictamente de catálogos Royalty-Free preaprobados, actuando como un cortafuegos salvavidas ante una inspección sorpresa.
- **Fallback Absoluto (Spotify API)**: El silencio es inaceptable en un espacio comercial. Hemos programado un watchdog asíncrono que monitorea el buffer local. Si por cualquier fallo del disco duro la música se detiene, el sistema inyecta transparentemente el audio a través de la API de Spotify, garantizando una latencia cero en la percepción del usuario.

---

## 🛡️ Arquitectura de Blindaje (Seguridad)

En el despliegue Retail y Enterprise, una caída de sistema no es un bug, es pérdida de capital. Hemos diseñado una coraza defensiva (Shielding) que emula las mejores prácticas de DevSecOps:

• **Ingeniería Anti-Flood (Rate limiting)**: Los algoritmos asíncronos estrangulan cualquier pico anómalo de peticiones mediante middlewares de limitación, evadiendo colapsos de Thread Pool.
• **Cristalografía Binaria (Magic Bytes)**: Validar un '.mp3' en el nombre es trivial para inyectar un payload malicioso. El sistema abre el encabezado del archivo y verifica la secuencia hexadecimal nativa para certificar la integridad del contenedor.
• **Sanidad de RAM (Limitador 2 GB)**: Los ataques OOM (Out Of Memory) destruyen servidores. Rechazamos implacablemente en el umbral de subida cualquier peso atípico.

---

## 🚀 Despliegue Técnico (Instalación) e Instalación CI/CD

Para garantizar estabilidad multiplataforma, ahora empleamos **CI/CD Automatizado vía GitHub Actions**. 
En lugar de empaquetar de forma local, nuestro código fuente se compila nativamente en entornos puros de Windows y macOS en la nube.

#### Cómo Descargar e Instalar
1. Navega a la sección **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** de este repositorio.
2. Descarga la última versión compilada automáticamente para tu Sistema Operativo:
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 Usuarios de macOS (Gatekeeper)
Al no contar con un certificado de desarrollador de pago de Apple, Gatekeeper marcará el binario. El método legítimo de bypass local es hacer **Clic derecho sobre la app -> Abrir** (no hagas doble clic).

### 🪟 Usuarios de Windows (SmartScreen)
Windows Defender puede mostrar un aviso azul de 'PC protegido' al ejecutar el instalador `.exe`. Haz clic en **'Más información'** y luego en **'Ejecutar de todas formas'**.

## 📚 Documentación y Manuales

Para una masterclass técnica exhaustiva, guías de resolución de problemas y detalles completos de la API, por favor descarga nuestro manual oficial:

📥 **[USER_MANUAL.pdf (PDF - 7 Languages)](docs/USER_MANUAL.pdf)**


---

## ⚖️ Manifiesto de Ingeniería, Créditos y Licencia

Este software es el resultado manifiesto de la profunda ingeniería concebida y articulada desde los laboratorios de produktes-code en unión indisociable con el Ingeniero Jesús Ferrer García (CHUS BZN).

Nos negamos a ofrecer cajas negras simplificadas. Entregamos consolas paramétricas absolutas. Licenciado bajo restricciones de propiedad intelectual y los más estrictos márgenes open source (CC BY-NC-SA 4.0). ESTÁNDAR CORPORATIVO - RETAIL READY. GRADO INGENIERÍA CERTIFICADO.


