# Brand Music Curator - Manual de Usuario / User Manual

## Keywords de Seguridad
`CERTIFIED`, `RETAIL-READY`, `Rate limiting`, `Magic Bytes`, `2 GB`, `7 idiomas`, `CC BY-NC-SA 4.0`

## 🇪🇸 Español (ES)

### 1. La Visión (Introducción)
La génesis de Brand Music Curator surge de una frustración profunda en la industria del Retail: la música ambiental en espacios comerciales siempre ha sido una idea de último momento, a menudo relegada a listas de reproducción genéricas que acaban por fatigar tanto a clientes como a empleados. Como ingenieros y diseñadores de experiencia, comprendimos que el audio no es un adorno, es un ancla psicológica. Brand Music Curator fue diseñado para ser el Gemelo Digital de Audio definitivo para grandes superficies. No es un reproductor; es un cerebro curatorial que comprende la energía del local, modula el flujo de clientes (CX) y, críticamente, blinda al negocio frente a las draconianas inspecciones de derechos de autor. Hemos creado esta herramienta para devolverle el control a las marcas sobre su identidad sonora.

### 2. Despliegue Técnico (Instalación) e Instalación CI/CD

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

### 3. Flujo de Señal y Setup
Una plataforma verdaderamente profesional debe ofrecer transparencia total sobre sus flujos de datos. La consola de 'Ajustes' no es decorativa; es el panel de ruteo principal.

• **Ruteo de Rutas I/O Absolutas**: En producción, un renderizado pesado en la unidad C: o el disco SSD del OS puede asfixiar el paginado de memoria del sistema. La interfaz permite mapear directorios absolutos hacia matrices RAID o unidades NVMe dedicadas de caché de manera determinista.
• **Inyección de Tokens LLM (API Keys)**: Sabemos que manipular tokens de autorización en texto plano es una brecha de seguridad inadmisible. El panel encripta tu Key y lo inyecta dinámicamente en las variables de entorno `.env` en memoria, garantizando un sandbox seguro para tu facturación en la nube.

### 4. Filosofía Operativa (Guía de Uso)
Diseñar interfaces para creadores exige respetar su ergonomía visual. No usamos colores brillantes que fatigan los bastones oculares durante jornadas nocturnas. El principio de 'Glassmorphism' junto al Dark-Mode puro (RGB: 15, 15, 15) maximiza la legibilidad del contraste y concentra la visión donde importa.

• **Lienzo Principal (El Workspace)**: El punto neural del operador. Arrastrar y soltar. Sin menús ocultos de 4 niveles de profundidad. Deslizadores directos y paramétricos.
• **Terminal de Ejecución HUD**: Un profesional no opera a ciegas. Un log en vivo expone los callbacks asíncronos y las trazas de error, devolviendo el control intelectual de la máquina al usuario.
• **La Naturaleza Asíncrona**: No hay bloqueos. El hilo principal (Main Thread) renderiza a 60fps inquebrantables mientras los workers de Python operan en el abismo del background consumiendo núcleos de CPU.

### 5. Masterclass de Parámetros (Funcionalidades)
- **Motor DSP Analítico (librosa)**: ¿Por qué necesitamos análisis matemático en tiempo real? Porque fiarse de los metadatos ID3 de un mp3 es un error de novato. Hemos integrado el motor 'librosa' para que la aplicación lea los bytes del audio, extrayendo la energía RMS (impacto real en el altavoz), el Tempo (BPM) y la Clave Armónica. Esto permite que el sistema ensamble listas que no tienen saltos de energía destructivos.
- **Matriz de 45 Estilos Musicales**: No creemos en las listas de reproducción estáticas. El usuario dispone de 45 géneros (desde Deep House a Acoustic Folk) y un sistema de 'Recetas' (Mixes) donde se cruzan porcentajes. Seleccionar 70% Indie Pop y 30% Lo-Fi Hip Hop crea una textura específica diseñada para relajar al cliente sin perder ritmo. Esto empodera al music curador para pintar con sonido.
- **Topología de Zonas Independientes**: Un hotel no suena igual en el lobby que en el restaurante. Hemos estructurado el software para enrutar el audio algorítmicamente por zonas de hardware. De este modo, desde una única máquina centralizada, el ingeniero de sonido de la instalación puede gobernar múltiples atmósferas sin cruces de fase ni de concepto.
- **SGAE Shield (Blindaje de Derechos)**: El dolor de cabeza más grande en retail son las multas por derechos de propiedad intelectual. El 'SGAE Shield' es nuestra respuesta de ingeniería legal. Un simple botón corta inmediatamente cualquier streaming no autorizado y fuerza al reproductor a alimentarse estrictamente de catálogos Royalty-Free preaprobados, actuando como un cortafuegos salvavidas ante una inspección sorpresa.
- **Fallback Absoluto (Spotify API)**: El silencio es inaceptable en un espacio comercial. Hemos programado un watchdog asíncrono que monitorea el buffer local. Si por cualquier fallo del disco duro la música se detiene, el sistema inyecta transparentemente el audio a través de la API de Spotify, garantizando una latencia cero en la percepción del usuario.

### 6. Integración Multimodal Global
Tratar la internacionalización mediante simples JSON de traducción plana es un insulto al profesional global. Hemos codificado un paradigma Multimodal Estructural. Esto implica soporte Unicode del 100% y recarga en caliente (Hot-Reloading) de las capas léxicas completas en los 7 idiomas (ES, EN, DE, UK, RU, ZH, JA). Porque la precisión de la ingeniería y el respeto al operador no entienden de barreras idiomáticas.

### 7. Arquitectura de Blindaje (Seguridad)
En el despliegue Retail y Enterprise, una caída de sistema no es un bug, es pérdida de capital. Hemos diseñado una coraza defensiva (Shielding) que emula las mejores prácticas de DevSecOps:

• **Ingeniería Anti-Flood (Rate limiting)**: Los algoritmos asíncronos estrangulan cualquier pico anómalo de peticiones mediante middlewares de limitación, evadiendo colapsos de Thread Pool.
• **Cristalografía Binaria (Magic Bytes)**: Validar un '.mp3' en el nombre es trivial para inyectar un payload malicioso. El sistema abre el encabezado del archivo y verifica la secuencia hexadecimal nativa para certificar la integridad del contenedor.
• **Sanidad de RAM (Limitador 2 GB)**: Los ataques OOM (Out Of Memory) destruyen servidores. Rechazamos implacablemente en el umbral de subida cualquier peso atípico.

### 8. Debug Log (FAQ)
P: macOS Gatekeeper informa que la aplicación está 'dañada' o no puede abrirse.
R: Este es un flag de seguridad estricto temporal de Apple. Como ingeniero, sabes que debes aprobar el binario usando 'Clic derecho -> Abrir'. Confirmamos la absoluta integridad de la compilación local.

P: Interbloqueo infinito al importar o generar payload pesado.
R: Dos causas de ingeniería probables: A) El motor rebotó la carga por el límite de protección RAM (>2GB). B) La firma binaria (Magic Bytes) del archivo estaba corrupta.

P: Discrepancias de latencia en la conexión de red (API / LLM).
R: Los algoritmos core son ofuscados y calculados en la CPU/GPU local. Únicamente las inferencias LLM masivas transitan por el socket WAN. Revisa tu router si los pings son altos.

### 9. Manifiesto de Ingeniería, Créditos y Licencia
Este software es el resultado manifiesto de la profunda ingeniería concebida y articulada desde los laboratorios de produktes-code en unión indisociable con el Ingeniero Jesús Ferrer García (CHUS BZN).

Nos negamos a ofrecer cajas negras simplificadas. Entregamos consolas paramétricas absolutas. Licenciado bajo restricciones de propiedad intelectual y los más estrictos márgenes open source (CC BY-NC-SA 4.0). ESTÁNDAR CORPORATIVO - RETAIL READY. GRADO INGENIERÍA CERTIFICADO.

## 🇬🇧 English (EN)

### 1. The Vision (Introduction)
The genesis of Brand Music Curator stems from a deep frustration in the Retail industry: background music in commercial spaces has always been an afterthought, often relegated to generic playlists that end up fatiguing both customers and employees. As engineers and experience designers, we understood that audio is not an ornament, it is a psychological anchor. Brand Music Curator was designed to be the ultimate Audio Digital Twin for large venues. It is not a player; it is a curatorial brain that understands the energy of the premises, modulates customer flow (CX) and, critically, shields the business against draconian copyright inspections. We created this tool to give brands back control over their sonic identity.

### 2. Technical Deployment (Installation) & CI/CD Installation

To guarantee cross-platform stability, we now employ **Automated CI/CD via GitHub Actions**. 
Instead of local packaging, our source code is natively compiled on pure Windows and macOS environments in the cloud.

#### How to Download and Install
1. Navigate to the **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** section of this repository.
2. Download the latest automated build for your Operating System:
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 macOS Users (Gatekeeper)
Lacking a paid Apple developer certificate, Gatekeeper will quarantine the binary. As engineers, the legitimate local bypass is to **Right-click the app -> Open**.

### 🪟 Windows Users (SmartScreen)
Windows Defender may show a blue 'Windows protected your PC' warning when running the `.exe` installer. Click **'More info'** and then **'Run anyway'**.

### 3. Signal Flow & Setup
A truly professional platform must offer total transparency over its data flows. The 'Settings' console is not decorative; it is the main routing panel.

• **Absolute I/O Routing**: In production, heavy rendering on the OS SSD can choke system memory paging. The interface allows deterministic mapping of absolute directories to RAID arrays or dedicated NVMe cache drives.
• **LLM Tokens Injection**: Handling authorization tokens in plain text is an unacceptable security breach. The panel encrypts your Key and dynamically injects it into the in-memory `.env` variables, guaranteeing a secure sandbox.

### 4. Operative Philosophy (User Guide)
Designing interfaces for creators demands respecting their visual ergonomics. We do not use bright colors that fatigue eye rods during night shifts. The principle of 'Glassmorphism' along with pure Dark-Mode (RGB: 15, 15, 15) maximizes contrast readability and focuses vision where it matters.

• **Main Canvas (Workspace)**: The neural point of the operator. Drag and drop. No 4-level deep hidden menus. Direct and parametric sliders.
• **HUD Execution Terminal**: A professional does not operate blindly. A live log exposes asynchronous callbacks and error traces, returning intellectual control to the user.
• **Asynchronous Nature**: No blockages. The Main Thread renders at an unbreakable 60fps while background Python workers operate in the abyss consuming CPU cores.

### 5. Parameter Masterclass (Features)
- **Analytical DSP Engine (librosa)**: Why do we need real-time mathematical analysis? Because relying on MP3 ID3 metadata is a rookie mistake. We integrated the 'librosa' engine to read raw audio bytes, extracting RMS energy (true speaker impact), Tempo (BPM), and Harmonic Key. This allows seamless playlists without destructive energy drops.
- **45 Musical Styles Matrix**: We don't believe in static playlists. You cross percentages of 45 genres. Selecting 70% Indie Pop and 30% Lo-Fi Hip Hop creates a specific texture designed to relax the customer while keeping pace. This empowers the music curator to paint with sound.
- **Independent Zone Topology**: A hotel's lobby doesn't sound like its restaurant. We structured the software to route audio algorithmically across hardware zones from a single centralized machine.
- **SGAE Shield (Copyright Armor)**: The biggest headache in retail is IP fines. The 'SGAE Shield' is our legal-engineering answer. One button strictly forces the player into pre-approved Royalty-Free catalogs, acting as a life-saving firewall during surprise inspections.
- **Absolute Fallback (Spotify API)**: Silence is unacceptable. Our asynchronous watchdog monitors the local buffer. If local drives fail, it transparently injects audio via the Spotify API, ensuring zero perceived latency.

### 6. Global Multimodal Integration
Treating internationalization through simple flat translation JSONs is an insult to the global professional. We encoded a Structural Multimodal paradigm. This implies 100% Unicode support and Hot-Reloading of complete lexical layers in 7 languages (ES, EN, DE, UK, RU, ZH, JA).

### 7. Shielding Architecture (Security)
In Retail and Enterprise deployment, a system crash is not a bug; it is capital loss. We designed a defensive armor (Shielding) emulating DevSecOps best practices:

• **Anti-Flood Engineering (Rate limiting)**: Asynchronous algorithms strangle anomalous request spikes using limitation middlewares.
• **Binary Crystallography (Magic Bytes)**: The system opens the file header and verifies the native hexadecimal sequence to certify container integrity.
• **RAM Sanity (2 GB Limit)**: We relentlessly reject any atypical weight at the upload threshold to prevent Out Of Memory attacks.

### 8. Debug Log (FAQ)
Q: macOS Gatekeeper reports the application is 'damaged' or cannot be opened.
A: This is a strict temporary Apple security flag. As an engineer, you know you must approve the binary using 'Right-click -> Open'. We confirm the absolute integrity of the local compilation.

Q: Infinite deadlock when importing or generating heavy payload.
A: Two probable engineering causes: A) Engine bounced the load due to RAM protection limit (>2GB). B) The file's binary signature (Magic Bytes) was corrupt.

### 9. Engineering Manifesto, Credits & License
Software conceived and articulated from the produktes-code labs in inseparable union with Engineer Jesus Ferrer Garcia (CHUS BZN).

Licensed under proprietary restrictions and strictest open source margins (CC BY-NC-SA 4.0). CORPORATE STANDARD - RETAIL READY.

## 🇩🇪 Deutsch (DE)

### 1. Die Vision (Einführung)
Die Entstehung von Brand Music Curator beruht auf einer tiefen Frustration in der Einzelhandelsbranche: Hintergrundmusik in gewerblichen Räumen war schon immer ein nachträglicher Einfall. Als Ingenieure haben wir verstanden, dass Audio kein Ornament, sondern ein psychologischer Anker ist. Dieses Tool wurde als ultimativer digitaler Audio-Zwilling entwickelt. Es ist kein Player, sondern ein kuratorisches Gehirn, das die Energie der Räumlichkeiten versteht, den Kundenfluss moduliert und das Unternehmen vor Urheberrechtsprüfungen schützt.

### 2. Technische Bereitstellung & CI/CD Installation

Um absolute plattformübergreifende Stabilität zu garantieren, verwenden wir nun **Automatisierte CI/CD über GitHub Actions**.
Anstelle einer lokalen Paketierung wird unser Quellcode in reinen Windows- und macOS-Umgebungen in der Cloud nativ kompiliert.

#### Herunterladen und Installieren
1. Navigieren Sie zum Bereich **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** dieses Repositories.
2. Laden Sie den neuesten automatisierten Build für Ihr Betriebssystem herunter:
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 macOS-Benutzer (Gatekeeper)
Die legitime lokale Umgehung ist **Rechtsklick auf die App -> Öffnen**.

### 🪟 Windows-Benutzer (SmartScreen)
Windows Defender zeigt möglicherweise einen blauen Warnbildschirm an. Klicken Sie auf **'Weitere Informationen'** und dann auf **'Trotzdem ausführen'**.

### 3. Signalfluss & Setup
Professionelle Transparenz:

• I/O Routing: Leiten Sie Renderings auf dedizierte NVMe-Laufwerke um, um OS-Drosselung zu vermeiden.
• LLM Tokens: Sichere, verschlüsselte Injektion in speicherresidente `.env`-Variablen.

### 4. Operative Philosophie
Ergonomie für lange Nächte: Reiner Dark-Mode (RGB: 15, 15, 15) und Glassmorphismus.

• Hauptleinwand: Keine versteckten Menüs. Parametrische Schieberegler.
• HUD-Terminal: Live-Protokoll für intellektuelle Kontrolle.
• Asynchron: 60fps UI, während Python-Worker die CPU-Kerne auslasten.

### 5. Parameter Masterclass
- **Analytische DSP-Engine (librosa)**: Wir verlassen uns nicht auf fehlerhafte Metadaten. Die librosa-Engine analysiert rohe Audio-Bytes auf RMS-Energie, BPM und harmonischen Schlüssel für nahtlose Übergänge.
- **45-Musikstile-Matrix**: Keine statischen Playlists. Kombinieren Sie z.B. 70 % Indie Pop und 30 % Lo-Fi Hip Hop für maßgeschneiderte Klangtexturen.
- **Unabhängige Zonentopologie**: Steuern Sie algorithmisch verschiedene Atmosphären in verschiedenen Räumen von einer zentralen Maschine aus.
- **SGAE Shield (Urheberrechtsschutz)**: Ein Panikschalter, der sofort auf lizenzfreie Kataloge umschaltet, um rechtliche Strafen bei Inspektionen zu vermeiden.
- **Absolutes Fallback**: Überwacht lokale Puffer und wechselt bei Ausfällen transparent zu Spotify, um Totenstille zu vermeiden.

### 6. Multimodale Integration
Strukturelle Multimodalität. 100% Unicode, Hot-Reloading in 7 Sprachen.

### 7. Abschirmarchitektur
Systemabstürze sind Kapitalverlust. Shielding:

• Anti-Flood: Middlewares blockieren Spitzen.
• Magic Bytes: Hexadezimale Überprüfung der Header-Integrität.
• RAM-Sanity (2 GB Limit): Schutz vor OOM-Attacken.

### 8. Debug-Protokoll (FAQ)
F: macOS blockiert.
A: Rechtsklick -> Öffnen.

F: Unendlicher Deadlock.
A: 2GB-Limit überschritten oder Magic Bytes fehlerhaft.

### 9. Engineering Manifesto & Credits
Entwickelt von produktes-code und Jesus Ferrer (CHUS BZN). CC BY-NC-SA 4.0. CORPORATE STANDARD.

## 🇺🇦 Українська (UK)

### 1. Бачення
Створення Brand Music Curator походить від глибокого розчарування в індустрії роздрібної торгівлі. Як інженери, ми зрозуміли, що аудіо - це не прикраса, а психологічний якір. Цей інструмент був розроблений як кінцевий цифровий аудіо-двійник. Це не програвач, а кураторський мозок, який розуміє енергетику приміщення та захищає бізнес від перевірок авторських прав.

### 2. Технічне розгортання та встановлення CI/CD

Для гарантії кросплатформної стабільності ми використовуємо **Автоматизований CI/CD через GitHub Actions**.
Замість локальної збірки наш вихідний код компілюється нативно у хмарних середовищах Windows та macOS.

#### Як завантажити та встановити
1. Перейдіть до розділу **[Releases](https://github.com/produktes-code/brand-music-curator/releases)**.
2. Завантажте останню автоматизовану збірку:
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 Користувачі macOS (Gatekeeper)
Законний локальный обхід: **Правий клік по додатку -> Відкрити**.

### 🪟 Користувачі Windows (SmartScreen)
Натисніть **'Докладніше'**, а потім **'Виконати в будь-якому випадку'**.

### 3. Потік сигналів
Прозорість даних:

• I/O Routing: Маршрутизація на NVMe.
• LLM Tokens: Безпечне шифрування ключів API.

### 4. Оперативна філософія
Ергономіка: Темний режим (RGB: 15, 15, 15).

• Робоча область: Параметричні повзунки.
• HUD Термінал: Журнал у реальному часі.
• Асинхронність: UI не блокується.

### 5. Майстер-клас параметрів
- **Аналітичний рушій DSP**: Ми аналізуємо необроблені аудіобайти на енергію RMS, BPM і ключ для плавних переходів.
- **Матриця з 45 музичних стилів**: Створюйте індивідуальні звукові текстури, поєднуючи відсотки жанрів.
- **Топологія незалежних зон**: Керуйте різними атмосферами з однієї машини.
- **SGAE Shield**: Захист від штрафів за авторські права шляхом перемикання на безкоштовні каталоги.
- **Абсолютний резерв**: Прозоре перемикання на Spotify у разі локальних збоїв.

### 6. Мультимодальна інтеграція
100% підтримка Unicode, Hot-Reloading для 7 мов.

### 7. Архітектура екранування
Екранування:

• Anti-Flood: Блокування сплесків запитів.
• Magic Bytes: Гексадецимальна перевірка файлів.
• 2 GB Limit: Захист оперативної пам'яті.

### 8. Журнал налагодження (FAQ)
З: macOS блокує.
В: Правий клік -> Відкрити.

З: Зависання під час імпорту.
В: Перевищено ліміт 2ГБ або пошкоджені Magic Bytes.

### 9. Інженерний маніфест
Розроблено produktes-code та Jesus Ferrer (CHUS BZN). CC BY-NC-SA 4.0. CORPORATE STANDARD.

## 🇷🇺 Русский (RU)

### 1. Видение
Создание Brand Music Curator проистекает из глубокого разочарования в индустрии розничной торговли. Как инженеры, мы поняли, что аудио — это не украшение, а психологический якорь. Этот инструмент был разработан как окончательный цифровой аудиодвойник. Это не плеер, а кураторский мозг, который понимает энергетику помещения и защищает бизнес от проверок авторских прав.

### 2. Техническое развертывание и установка CI/CD

Для гарантии кроссплатформенной стабильности мы используем **Автоматизированный CI/CD через GitHub Actions**.
Вместо локальной сборки наш исходный код компилируется нативно в чистых облачных средах Windows и macOS.

#### Как скачать и установить
1. Перейдите в раздел **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** этого репозитория.
2. Загрузите последнюю автоматизированную сборку:
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 Пользователи macOS (Gatekeeper)
Законный локальный обход: **Правый клик по приложению -> Открыть**.

### 🪟 Пользователи Windows (SmartScreen)
Нажмите **'Подробнее'**, а затем **'Выполнить в любом случае'**.

### 3. Поток сигналов
Прозрачность данных:

• I/O Routing: Маршрутизация на NVMe.
• LLM Tokens: Безопасное шифрование ключей API.

### 4. Оперативная философия
Эргономика: Темный режим (RGB: 15, 15, 15).

• Рабочая область: Параметрические ползунки.
• HUD Терминал: Журнал в реальном времени.
• Асинхронность: UI не блокируется.

### 5. Мастер-класс параметров
- **Аналитический движок DSP**: Мы анализируем необработанные аудиобайты на энергию RMS, BPM и ключ для плавных переходов.
- **Матрица из 45 музыкальных стилей**: Создавайте индивидуальные звуковые текстуры, комбинируя проценты жанров.
- **Топология независимых зон**: Управляйте различными атмосферами с одной машины.
- **SGAE Shield**: Защита от штрафов за авторские права путем переключения на бесплатные каталоги.
- **Абсолютный резерв**: Прозрачное переключение на Spotify в случае локальных сбоев.

### 6. Мультимодальная интеграция
100% поддержка Unicode, Hot-Reloading для 7 языков.

### 7. Архитектура экранирования
Экранирование:

• Anti-Flood: Блокировка всплесков запросов.
• Magic Bytes: Гексадецимальная проверка файлов.
• 2 GB Limit: Защита оперативной памяти.

### 8. Журнал отладки (FAQ)
В: macOS блокирует.
О: Правый клик -> Открыть.

В: Зависание при импорте.
О: Превышен лимит 2ГБ или повреждены Magic Bytes.

### 9. Инженерный манифест
Разработано produktes-code и Jesus Ferrer (CHUS BZN). CC BY-NC-SA 4.0. CORPORATE STANDARD.

## 🇨🇳 中文 (ZH)

### 1. 愿景 (介绍)
Brand Music Curator 的诞生源于零售业的深深挫败感：背景音乐往往是事后才想到的。作为工程师，我们明白音频不是装饰，而是心理锚点。该工具被设计为终极音频数字孪生。它不仅是一个播放器，而且是一个了解场所能量、调节客流并保护企业免受版权检查的策展大脑。

### 2. 技术部署 (安装) 与 CI/CD 安装

为了保证跨平台稳定性，我们现在采用 **基于 GitHub Actions 的自动化 CI/CD**。
我们的源代码不再在本地打包，而是在云端的纯 Windows 和 macOS 环境中原生编译。

#### 如何下载和安装
1. 导航到此存储库的 **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** 部分。
2. 下载适用于您操作系统的最新自动化版本：
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 macOS 用户 (Gatekeeper)
合法的本地绕过方法是 **右键单击应用程序 -> 打开**。

### 🪟 Windows 用户 (SmartScreen)
点击 **“更多信息”**，然后点击 **“仍要运行”**。

### 3. 信号流与设置
专业透明度：

• I/O 路由：映射到专用 NVMe 以避免操作系统节流。
• LLM 令牌：安全注入到内存变量中。

### 4. 操作理念 (用户指南)
纯暗模式 (RGB: 15, 15, 15)：

• 主画布：直接的参数化滑块。
• HUD 终端：知识控制的实时日志。
• 异步：后台处理时维持 60fps 的 UI。

### 5. 参数大师班 (功能)
- **分析 DSP 引擎**：分析原始音频字节的 RMS 能量、BPM 和调性，实现无缝过渡。
- **45 种音乐风格矩阵**：通过组合流派百分比创建自定义声音纹理。
- **独立区域拓扑**：从单台机器控制不同区域的不同氛围。
- **SGAE 护盾**：在检查期间通过切换到免版税目录来保护免受版权罚款。
- **绝对后备**：监控本地缓冲，发生故障时无缝切换到 Spotify。

### 6. 全球多模态整合
结构化多模态。100% Unicode 支持，7 种语言的热重载。

### 7. 屏蔽架构 (安全)
防御装甲：

• 反洪泛：限制请求峰值。
• 魔法字节：十六进制标头验证。
• RAM 限制 (2 GB)：防止 OOM 攻击。

### 8. 调试日志 (FAQ)
问：macOS 阻止运行。
答：右键单击 -> 打开。

问：无限死锁。
答：超出 2GB 限制或魔法字节损坏。

### 9. 工程宣言，鸣谢与许可
由 produktes-code 和 Jesus Ferrer (CHUS BZN) 开发。CC BY-NC-SA 4.0。企业标准。

## 🇯🇵 日本語 (JA)

### 1. ビジョン（はじめに）
Brand Music Curatorの起源は、小売業界における深い不満から生じています。エンジニアとして、オーディオは単なる装飾ではなく、心理的なアンカーであることを理解しました。このツールは、究極のオーディオデジタルツインとして設計されています。単なるプレーヤーではなく、施設のエネルギーを理解し、顧客の流れを調整し、著作権検査からビジネスを保護するキュレーションの頭脳です。

### 2. 技術展開（インストール） とCI/CDインストール

クロスプラットフォームの安定性を保証するために、**GitHub Actionsを介した自動CI/CD**を採用しています。
ローカルパッケージングの代わりに、ソースコードはクラウド上の純粋なWindowsおよびmacOS環境でコンパイルされます。

#### ダウンロードとインストール方法
1. このリポジトリの **[Releases](https://github.com/produktes-code/brand-music-curator/releases)** セクションに移動します。
2. オペレーティングシステム用の最新の自動ビルドをダウンロードします：
   - `Brand Music Curator Setup.exe` (Windows)
   - `Brand Music Curator.dmg` (macOS)

### 🍎 macOSユーザー（Gatekeeper）
正当なローカルバイパス方法は、**アプリを右クリック -> 開く**ことです。

### 🪟 Windowsユーザー（SmartScreen）
**「詳細情報」**をクリックし、**「実行」**をクリックします。

### 3. 信号の流れと設定
専門的な透明性：

• I/O ルーティング：OSのスロットリングを回避するために専用のNVMeにマッピングします。
• LLMトークン：メモリ内変数への安全な注入。

### 4. 操作哲学（ユーザーガイド）
純粋なダークモード（RGB：15、15、15）：

• メインキャンバス：直接的なパラメトリックスライダー。
• HUDターミナル：知的制御のためのリアルタイムログ。
• 非同期：バックグラウンドで処理しながら60fpsのUIを維持します。

### 5. パラメーターマスタークラス（機能）
- **分析DSPエンジン**：シームレスな移行のために、生のオーディオバイトをRMSエネルギー、BPM、およびキーについて分析します。
- **45の音楽スタイルマトリックス**：ジャンルの割合を組み合わせてカスタムサウンドテクスチャを作成します。
- **独立したゾーントポロジ**：単一のマシンから異なるエリアの異なる雰囲気を制御します。
- **SGAEシールド**：検査中にロイヤリティフリーのカタログに切り替えることで、著作権の罰金から保護します。
- **絶対的なフォールバック**：ローカルバッファを監視し、障害が発生した場合はシームレスにSpotifyに切り替えます。

### 6. グローバルマルチモーダル統合
構造化されたマルチモーダル。 100％のUnicodeサポート、7言語のホットリロード。

### 7. シールドアーキテクチャ（セキュリティ）
防御装甲：

• アンチフラッド：リクエストのスパイクを制限します。
• マジックバイト：16進ヘッダーの検証。
• RAM制限（2 GB）：OOM攻撃を防ぎます。

### 8. デバッグログ（FAQ）
Q：macOSがブロックします。
A：右クリック->開く。

Q：無限のデッドロック。
A：2GBの制限を超えたか、マジックバイトが破損しています。

### 9. エンジニアリングマニフェスト、クレジット、ライセンス
produktes-codeとJesus Ferrer（CHUS BZN）によって開発されました。 CC BY-NC-SA 4.0。 企業標準。

