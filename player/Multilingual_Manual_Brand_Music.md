<p align="center">
  <img src="build/icon.png" width="150" height="150" alt="Logo" />
</p>

# Brand Music Curator Pro V1.0.0 - Technical Manual
**Engineered by Chus BZN / Versión Final 1.0.0**

---

## 🌐 Table of Contents / Índice de Idiomas

| 🏳️ | Idioma / Language |
|-----|-------------------|
| 🏳️ | [Español](#-español) |\n| 🏳️ | [English](#-english) |\n| 🏳️ | [Deutsch](#-deutsch) |\n| 🏳️ | [Русский](#-русский) |\n| 🏳️ | [日本語](#-日本語) |\n| 🏳️ | [Українська](#-українська) |\n| 🏳️ | [中文](#-中文) |\n
---

<div style="page-break-after: always;"></div>
\n# 🏳️ Español\n\n
### Manual de Usuario y Guía Técnica: Brand Music Curator Pro V1.0.0

#### 1. Introducción y Neuro-Arquitectura Sensorial
**Brand Music Curator Pro V1.0.0** es una plataforma B2B corporativa de Neuro-Arquitectura Sensorial de audio. Diseñada para locales comerciales, retail, franquicias y hostelería a gran escala, la aplicación optimiza la música ambiental mediante la modulación de energía y BPM según el clima y hora del día. Ofrece resiliencia offline extrema (Offline Cache) y cumple con las normativas legales de protección de derechos de autor.

#### 2. Instalación y Requisitos del Sistema
*   **Requisitos de Hardware:** macOS 12 (Monterey) o superior. 8 GB RAM mínimo, 10 GB de espacio libre en SSD.
*   **Instalación:**
    1. Localice el archivo `Brand Music Curator-1.0.0.dmg`.
    2. Haga doble clic para montar la imagen de disco.
    3. Arrastre el icono de **Brand Music Curator** hacia la carpeta **Aplicaciones**.
    4. Abra la aplicación desde su Launchpad o carpeta de Aplicaciones.

#### 3. Módulos y Características
*   **Ad-Generator (Generador de Cuñas):** Permite inyectar anuncios auditivos promocionales en intervalos regulares de 15 a 60 minutos, con filtros para bloquear letras explícitas y bloqueo de reggaeton/géneros urbanos.
*   **Smart IoT Auto-Modulation:** Modula de forma inteligente los BPM de la música según la hora (mañana suave, tarde activa, noche/cierre relajado) y según el clima (soleado, lluvioso, nublado).
*   **Brand Prompt NLP Analysis:** Permite introducir la identidad del local en texto libre (ej. *"Boutique minimalista y joven"*). El motor NLP analizará el texto para calcular la proporción de mezcla óptima.
*   **B2B Dashboard & Supervisor Lock:** Bloqueo del panel para evitar manipulación del personal. Se desbloquea con el **PIN de Supervisor: `1234`**. Soporta caché de **4 GB** para reproducción offline sin microcortes de audio ante caídas de internet.
*   **SGAE Shield (Auditoría Legal):** Botón del pánico que purga la RAM y cambia la reproducción a música Royalty-Free libre de derechos (código de exención **`RF-101`**), registrando la fecha y hora de forma inmutable.

#### 4. Guía de Parámetros y Valores
*   **Blend Ratio (Deslizador):** Ajusta la mezcla porcentual entre Estilo A y Estilo B en los Mixes.
*   **Frecuencia de Cuñas:** Intervalo de tiempo para insertar publicidad comercial (de 15m a 60m).
*   **Offline Cache Size:** Capacidad de almacenamiento asignada al reproductor (fijado en 4 GB).

#### 5. Flujo de Trabajo Didáctico
1.  **Paso 1:** Abra la aplicación y configure sus Zonas y Grupos en la sección de Infraestructura.
2.  **Paso 2:** Cree un Mix en Mixes Manager, seleccionando Estilo A, Estilo B y el ratio de mezcla.
3.  **Paso 3:** Configure el calendario de automatización arrastrando los Mixes a las franjas horarias.
4.  **Paso 4:** Active el IoT Auto-Modulation para vincular el reproductor a los sensores.
5.  **Paso 5:** Guarde el proyecto con el botón **Guardar Proyecto**.

#### 6. Resolución de Problemas y Soporte
*   **Mixes No Guardan:** Asegure que el servicio local Node.js esté corriendo en el puerto 4000.
*   **Modo Fallback Offline Activo:** El ping supera los 250ms. Revise la conexión de red del local.
*   **Bloqueo de Interfaz:** Si los controles están inactivos, haga clic en el candado y use el PIN `1234`.
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ English\n\n
### User Manual and Technical Guide: Brand Music Curator Pro V1.0.0

#### 1. Introduction and Sensory Neuro-Architecture
**Brand Music Curator Pro V1.0.0** is an advanced B2B Sensory Neuro-Architecture corporate platform. It automates and optimizes background music across retail, hospitality, and flagships by modulating song energy and BPM based on foot traffic, weather, and time of day. It ensures uninterrupted offline playback (Offline Cache) and handles copyright compliance securely.

#### 2. Installation and System Requirements
*   **Hardware Requirements:** macOS 12 (Monterey) or higher. Minimum 8 GB RAM, 10 GB free space on SSD.
*   **Installation:**
    1. Locate the `Brand Music Curator-1.0.0.dmg` file.
    2. Double-click to mount the disk image.
    3. Drag the **Brand Music Curator** icon to the **Applications** folder.
    4. Open the application from your Launchpad or Applications folder.

#### 3. Modules and Features
*   **Ad-Generator (In-Store Marketing):** Enables planning and injecting audio ads into the store's background music in intervals from 15 to 60 minutes, filtering explicit lyrics and blocking unwanted genres.
*   **Smart IoT Auto-Modulation:** Sincronizes and alters music BPM dynamically based on opening hours (morning, afternoon, closing) and local weather (sunny, rainy, cloudy).
*   **Brand Prompt NLP Analysis:** Allows operators to describe the store's desired atmosphere in natural language. The NLP analyzer processes the text to recommend the mathematical genre-blend ratio.
*   **Local B2B Dashboard Control:** Prevents unauthorized store staff from changing playlists. Unlock using the **Supervisor PIN: `1234`**. Supported by a **4 GB** pre-cached local storage for zero-stutter playback.
*   **SGAE Shield (Legal Audit Safeguard):** A red panic button that instantly purges running memory and shifts all audio output to a royalty-free catalog (exemption code **`RF-101`**), outputting immutable logs.

#### 4. Parameters and Values Guide
*   **Blend Ratio (Slider):** Drag to adjust mixing ratio between Style A and Style B in the Mixes Manager.
*   **Ad Frequency:** Configurable interval of ad insertion (15m to 60m).
*   **Offline Cache Size:** Pre-caching limit allocated to the local player (set to 4 GB).

#### 5. Step-by-Step Production Workflow
1.  **Step 1:** Open the app and define Groups and Zones under Infrastructure Management.
2.  **Step 2:** Formulate a Mix in Mixes Manager, selecting Style A, Style B, and the blending ratio.
3.  **Step 3:** Assign Mixes across weekly time blocks on the calendar grid.
4.  **Step 4:** Toggle AI Engine to activate dynamic IoT sensor BPM modulation.
5.  **Step 5:** Save the project settings with the **Guardar Proyecto** button.

#### 6. Troubleshooting and Support
*   **Mixes not saving:** Verify Node.js backend is running on port 4000.
*   **Constant Fallback Status:** Local network latency exceeds 250ms. Check router connectivity.
*   **Dashboard locked:** Click the lock icon and enter Supervisor PIN `1234` to enable manual edits.
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ Deutsch\n\n
### Benutzerhandbuch und Technische Anleitung: Brand Music Curator Pro V1.0.0

#### 1. Einführung und Sensorische Neuroarchitektur
**Brand Music Curator Pro V1.0.0** ist eine B2B-Plattform für sensorische Neuroarchitektur. Sie moduliert BPM und Energie basierend auf Kundenstrom, Wetter und Tageszeit, bietet Offline-Cache und rechtliche Absicherung.

#### 2. Installation und Systemanforderungen
*   **Hardwareanforderungen:** macOS 12 (Monterey) oder höher. Mindestens 8 GB RAM, 10 GB freier Speicherplatz auf SSD.
*   **Installation:**
    1. Suchen Sie die Datei `Brand Music Curator-1.0.0.dmg`.
    2. Doppelklicken Sie, um das Image zu aktivieren.
    3. Ziehen Sie das **Brand Music Curator**-Symbol in den Ordner **Programme**.
    4. Öffnen Sie die App über Ihr Launchpad oder den Programme-Ordner.

#### 3. Module und Eigenschaften
*   **Ad-Generator:** Werbeeinblendung alle 15 bis 60 Minuten mit expliziter Inhaltsfilterung (Blockade von Reggaeton/expliziten Texten).
*   **Smart IoT Auto-Modulation:** Passt BPM an Wetter (sonnig, regnerisch) und Uhrzeit (Vormittag, Nachmittag, Abend) an.
*   **Brand Prompt NLP:** Verarbeitet Freitext zur automatischen Berechnung der Genre-Mischung (z.B. "Minimalistische Boutique").
*   **Dashboard & B2B Lock:** Sperrt den Player vor unbefugtem Filialpersonal (Supervisor PIN `1234`). Unterstützt einen **4 GB** Offline-Cache.
*   **SGAE Shield (Panic Mode):** Schaltet bei Prüfungen sofort auf lizenzfreie Musik um und schreibt ein unveränderliches Audit-Protokoll mit Lizenzcode `RF-101`.

#### 4. Parameter- und Wertanleitung
*   **Blend Ratio (Slider):** Mischungsverhältnis einstellen (z. B. 70% Stil A und 30% Stil B).
*   **Frecuencia de Cuñas:** Zeitintervall für die Werbe-Injektion (15 bis 60 Minuten).
*   **Offline Cache Size:** Speichergröße zugeteilt für Offline-Dateien (feste 4 GB).

#### 5. Didaktischer Arbeitsablauf
1.  **Schritt 1:** Öffnen Sie die App und definieren Sie Gruppen und Zonen.
2.  **Schritt 2:** Erstellen Sie ein Musikrezept (Mix) im Mixes Manager.
3.  **Schritt 3:** Weisen Sie die Mixes im visuellen Wochenkalender den Zeitsegmenten zu.
4.  **Schritt 4:** Aktivieren Sie die IoT-Modulation (AI Engine) im Einstellungsmenü.
5.  **Schritt 5:** Sichern Sie das Projekt mit **Guardar Proyecto**.

#### 6. Fehlerbehebung und Support
*   **Mixes speichern nicht:** Überprüfen Sie, ob der lokale Node.js-Dienst auf Port 4000 läuft.
*   **Ständiger Fallback-Status:** Ping zu 8.8.8.8 überschreitet 250ms; prüfen Sie den Filial-Router.
*   **Bedienfeld reagiert nicht:** Entsperren Sie das Panel durch Klicken auf das Vorhängeschloss und Eingabe der PIN `1234`.
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ Русский\n\n
### Руководство пользователя и техническое руководство: Brand Music Curator Pro V1.0.0

#### 1. Введение и сенсорная нейроархитектура
**Brand Music Curator Pro V1.0.0** — это B2B-платформа сенсорной нейроархитектуры. Автоматически оптимизирует фоновую музыку, адаптируя темп (BPM) и энергию треков в зависимости от погоды, времени суток и трафика клиентов, защищая от штрафов.

#### 2. Установка и системные требования
*   **Требования к оборудованию:** macOS 12 (Monterey) или выше. Минимум 8 ГБ ОЗУ, 10 ГБ свободного места на SSD.
*   **Установка:**
    1. Найдите файл `Brand Music Curator-1.0.0.dmg`.
    2. Дважды щелкните, чтобы смонтировать образ диска.
    3. Перетащите иконку **Brand Music Curator** в папку **Программы**.
    4. Запустите приложение из Launchpad или папки Программы.

#### 3. Модули и возможности
*   **Ad-Generator:** Планирование рекламы каждые 15–60 минут с фильтрацией мата и нежелательных жанров (урбан/реггетон).
*   **Smart IoT Auto-Modulation:** Подстройка темпа под погоду (солнечно, дождь) и время открытия/закрытия магазина.
*   **Brand Prompt NLP:** Анализ идентичности бренда по описанию на естественном языке с автоматическим расчетом смеси стилей.
*   **Панель B2B и блокировка:** Блокирует плеер от изменения сотрудниками (PIN-код `1234`). Локальный кэш на **4 ГБ** (~400 часов музыки) для работы без сети.
*   **SGAE Shield:** Кнопка паники переключает эфир на Royalty-Free треки и пишет лог с кодом `RF-101` для инспекторов.

#### 4. Руководство по параметрам и значениям
*   **Blend Ratio (Слайдер):** Соотношение смешивания Стиля А и Стиля B в Mixes Manager.
*   **Frecuencia de Cuñas:** Частота вставки коммерческих куплетов (15-60 мин).
*   **Offline Cache Size:** Размер дисковой кэш-памяти для локальной базы (4 ГБ).

#### 5. Пошаговый рабочий процесс
1.  **Шаг 1:** Откройте приложение, настройте Группы и Зоны.
2.  **Шаг 2:** Создайте музыкальный рецепт (Mix) в Mixes Manager.
3.  **Шаг 3:** Распределите Mix-рецепты по часовым интервалам на неделе.
4.  **Шаг 4:** Включите IoT-модуляцию темпа через настройки.
5.  **Шаг 5:** Сохраните проект кнопкой **Guardar Proyecto**.

#### 6. Устранение неполадок и поддержка
*   **Рецепты не сохраняются:** Проверьте, запущен ли Node.js на порту 4000.
*   **Статус Fallback:** Задержка связи выше 250 мс. Проверьте роутер.
*   **Панель заблокирована:** Нажмите на замок и введите PIN-код супервизора `1234`.
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ 日本語\n\n
### ユーザーマニュアルと技術ガイド：Brand Music Curator Pro V1.0.0

#### 1. はじめにと感覚的ニューロアーキテクチャ
**Brand Music Curator Pro V1.0.0** は、店舗設計のためのB2B感覚的ニューロアーキテクチャプラットフォームです。天気、時間帯、客数に合わせてテンポ（BPM）やエネルギーを最適化し、オフラインキャッシュによる完全な連続再生を担保します。

#### 2. インストール方法とシステム要件
*   **ハードウェア要件:** macOS 12 (Monterey) 以降。最低 8 GB RAM、10 GB 以上の SSD 空き容量。
*   **インストール方法:**
    1. `Brand Music Curator-1.0.0.dmg` ファイルを見つけます。
    2. ダブルクリックしてディスクイメージをマウントします。
    3. **Brand Music Curator** アイコンを **アプリケーション** フォルダにドラッグします。
    4. Launchpad またはアプリケーションフォルダからアプリを開きます。

#### 3. モジュールと機能
*   **Ad-GeneratorCM挿入機能:** 15分〜60分間隔での店内CM挿入機能、不適切コンテンツフィルター（レゲトンの除外設定など）。
*   **Smart IoT センサーモジュレーション:** 天候（晴れ、雨）や営業時間（朝、昼、夕方）に基づいてBPMを自動変調します。
*   **Brand Prompt NLP:** 店舗イメージを自由な文章で記述すると、AIがジャンル配合比率を自動算出します。
*   **管理者PINロック:** 操作ロック機能（Supervisor PIN：`1234`）。ネット切断時は自動でローカルキャッシュ（**4 GB**）再生に切り替わります。
*   **SGAEシールド:** 緊急ボタンを押すと即座に再生をパージし、免責コード `RF-101` 付きの著作権フリー再生へ移行します。

#### 4. パラメータと設定値ガイド
*   **Blend Ratio (スライダー):** スタイルAとスタイルBのミックス配合比率を調整します。
*   **Frecuencia de Cuñas:** 広告の挿入インターバル時間（15分〜60分）。
*   **Offline Cache Size:** オフラインファイル用に割り当てられたキャッシュサイズ（4 GB 固定）。

#### 5. 制作ワークフロー（ステップ・バイ・ステップ）
1.  **ステップ 1:** アプリを開き、インフラ管理メニューでグループとゾーンを設定します。
2.  **ステップ 2:** Mixes ManagerでスタイルA、スタイルB、およびミックス比率を定義します。
3.  **ステップ 3:** 週間の時間枠グリッドにミックスをドラッグし、スケジュールを設定します。
4.  **ステップ 4:** 設定画面でAI Engineを有効にし、IoT天候センサー連動を開始します。
5.  **ステップ 5:** **Guardar Proyecto** ボタンをクリックして、設定を保存します。

#### 6. トラブルシューティングとサポート
*   **ミックスが保存されない:** Node.js バックエンドサービスがポート4000で実行されているか確認してください。
*   **フォールバック状態が続く:** 通信遅延が250msを超えています。ルーターを確認してください。
*   **パネルが反応しない:** 南京錠アイコンをクリックし、PINコード `1234` を入力してください。
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ Українська\n\n
### Посібник користувача та технічний посібник: Brand Music Curator Pro V1.0.0

#### 1. Вступ та сенсорна нейроархітектура
**Brand Music Curator Pro V1.0.0** — це B2B-платформа сенсорної нейроархітектури. Вона оптимізує фонову музику в залах, керуючи BPM та енергією треків відповідно до погоди, трафіку та часу, а також забезпечує захист авторських прав та офлайн-режим.

#### 2. Встановлення та системні вимоги
*   **Вимоги до заліза:** macOS 12 (Monterey) або вище. Мінімум 8 ГБ ОЗУ, 10 ГБ вільного місця на SSD.
*   **Встановлення:**
    1. Знайдіть файл `Brand Music Curator-1.0.0.dmg`.
    2. Двічі клацніть для монтування диска.
    3. Перетягніть іконку **Brand Music Curator** до папки **Програми**.
    4. Запустіть програму з Launchpad або папки Програми.

#### 3. Модулі та характеристики
*   **Ad-Generator:** Планування реклами (кожні 15-60 хв) з фільтром нецензурної лексики та блокуванням небажаних стилів (реггетон).
*   **Smart IoT Auto-Modulation:** Синхронізація BPM з погодою (сонячно, дощ) та часом доби (ранок, день, вечір).
*   **Brand Prompt NLP:** Створення рецепту музичного міксу на основі текстового опису бренду в довільній формі.
*   **Блокування PIN-кодом:** Захист плеєра від персоналу (PIN: `1234`). Об'єм кешу на **4 ГБ** для безперебійного програвання за відсутності мережі.
*   **SGAE Shield:** Режим паніки миттєво запускає Royalty-Free плейлист і створює сертифікат `RF-101` для перевірок.

#### 4. Гід по параметрах та значеннях
*   **Blend Ratio (Слайдер):** Змішування стилів А і B в Mixes Manager.
*   **Frecuencia de Cuñas:** Часовий інтервал вставки реклами (15-60 хв).
*   **Offline Cache Size:** Ліміт дискової пам'яті для локальної копії (4 ГБ).

#### 5. Покроковий робочий процес
1.  **Крок 1:** Відкрийте програму, створіть Групи та Зони.
2.  **Крок 2:** Створіть музичний мікс (Mix) у Mixes Manager.
3.  **Крок 3:** Розподіліть мікси по часових інтервалах на тижні.
4.  **Крок 4:** Увімкніть IoT-модуляцію темпу через налаштування.
5.  **Крок 5:** Збережіть налаштування проекту кнопкою **Guardar Proyecto**.

#### 6. Усунення несправностей та підтримка
*   **Мікси не зберігаються:** Перевірте, чи запущений Node.js на порту 4000.
*   **Статус Fallback:** Затримка зв'язку вище 250 мс. Перевірте роутер.
*   **Панель заблокована:** Натисніть на замок і введіть PIN-код супервізора `1234`.
\n\n<div style='page-break-after: always;'></div>\n\n# 🏳️ 中文\n\n
### 用户手册与技术指南：Brand Music Curator Pro V1.0.0

#### 1. 简介与神经感官空间设计
**Brand Music Curator Pro V1.0.0** 是一款面向 B2B 用户的感官神经架构空间音乐管理平台。该平台通过识别客流量、营业时间段以及店内环境气候（天气）来自动调制背景音乐的能量和 BPM，保障播放连续性。

#### 2. 安装与系统要求
*   **硬件要求:** macOS 12 (Monterey) 或更高版本。最低 8 GB RAM，固态硬盘（SSD）上至少 10 GB 可用空间。
*   **安装步骤:**
    1. 找到 `Brand Music Curator-1.0.0.dmg` 文件。
    2. 双击挂载磁盘映像。
    3. 将 **Brand Music Curator** 图标拖动到 **应用程序**（Applications）文件夹中。
    4. 从 Launchpad 或应用程序文件夹打开该程序。

#### 3. 功能模块与特性
*   **Ad-Generator (广告插播引擎):** 允许在 15 至 60 分钟的间隔内智能插播促销语音，支持过滤敏感流派及歌词屏蔽。
*   **Smart IoT 动态调制:** 依据晴天、雨天、阴天等气象数据以及日营业时段自动调制曲库的 BPM 节奏和风格倾向。
*   **Brand Prompt NLP 品牌解析:** 允许管理者使用自然语言描述品牌个性，NLP 自动解析并生成流派比率。
*   **管理者 PIN 锁定与 4GB 缓存:** 锁定面板以防止店员更改音乐（密码为 **`1234`**）。离线缓存提供 4 GB 容量，断网无缝过渡。
*   **SGAE Shield 版权审计护盾:** 一键进入恐慌模式，自动切换为免版权库（证书代码 **`RF-101`**），并记录审计日志。

#### 4. 参数与值设置指南
*   **Blend Ratio (滑动条):** 调节 Mixes Manager 中风格 A 与风格 B 的混音比率。
*   **广告插播频率 (Frecuencia de Cuñas):** 广告插播的时间间隔（15分钟至60分钟）。
*   **离线缓存大小 (Offline Cache Size):** 分配给离线播放器的存储空间限制（固定为 4 GB）。

#### 5. 视频级音乐排程工作流
1.  **第一步:** 打开应用，在基础设施页面定义 Group（分组）与 Zone（区域）。
2.  **第二步:** 在 Mixes Manager 中创建混音（Mix）配方，设置基准流派与混合比率。
3.  **第三步:** 在每周自动化排程表上将 Mixes 拖拽到对应的时间段中。
4.  **第四步:** 启用 IoT 调制开关，使播放器与传感器挂钩。
5.  **第五步:** 点击 **Guardar Proyecto** 按钮保存当前项目设置。

#### 6. 故障排除与技术支持
*   **混音无法保存:** 检查本地 Node.js 后端服务是否运行在端口 4000 上。
*   **持续处于 Fallback 状态:** 延迟超过 250ms。请排查路由器和网络连接。
*   **控制面板锁定:** 点击锁头标志并输入主管 PIN 码 `1234` 解除锁定。
\n\n<div style='page-break-after: always;'></div>\n\n*© All rights reserved / Todos los derechos reservados — Jesús Ferrer García (CHUS BZN) — 2026*\n