# Multilingual User Manual / Manual de Usuario Multilingüe
## Brand Music Curator Pro V2.5

---

## 🌐 Table of Contents / Índice de Idiomas

| 🏳️ | Idioma / Language | Página |
|-----|-------------------|--------|
| 🇪🇸 | [Español](#-español) | 1 |
| 🇬🇧 | [English](#-english) | 2 |
| 🇩🇪 | [Deutsch](#-deutsch) | 3 |
| 🇷🇺 | [Русский](#-русский) | 4 |
| 🇯🇵 | [日本語](#-日本語) | 5 |
| 🇺🇦 | [Українська](#-українська) | 6 |
| 🇨🇳 | [中文](#-中文) | 7 |

---

<div style="page-break-after: always;"></div>

# 🇪🇸 Español

# Manual de Usuario y Tutorial Extensivo: Brand Music Curator Pro

### 1. Introducción y Conceptos Básicos
**Brand Music Curator** es una plataforma de Neuro-Arquitectura Sensorial diseñada para entornos corporativos (Retail, Hostelería, Flagships). Su propósito es automatizar el hilo musical de múltiples establecimientos físicos, garantizando reproducción sin interrupciones, cumplimiento de derechos de autor y adaptación del ritmo a la afluencia de clientes.

#### 1.1 Glosario de Términos
*   **Zona (Zone):** Un espacio físico independiente dentro de un local comercial (ej. "Probadores", "Terraza").
*   **Mix:** Una fórmula matemática que combina dos listas de reproducción en un porcentaje exacto (ej. 70% Pop, 30% Electrónica).
*   **Dayparting:** División del día en franjas horarias con un estilo musical específico para cada una.
*   **Fallback / Offline Cache:** Reproducción automática desde el disco duro en caso de caída de internet.
*   **SGAE Shield:** Protocolo de defensa legal que activa música libre de derechos en caso de inspección.

---

### 2. Requisitos e Instalación
*   **Requisitos del Sistema:** macOS 12 (Monterey) o superior. 8 GB RAM mínimo, 10 GB espacio libre en SSD.
*   **Instalación:**
    1. Localice el archivo `Brand Music Curator-1.0.0.dmg`.
    2. Haga doble clic para montar la imagen de disco.
    3. Arrastre el icono de **Brand Music Curator** hacia la carpeta **Aplicaciones**.
    4. Abra la aplicación desde su Launchpad o carpeta de Aplicaciones.

---

### 3. Primeros Pasos: El Dashboard
El Dashboard es la pantalla principal para el control de reproducción local y monitoreo del estado de salud del sistema.
*   **Now Playing:** Muestra el progreso de la canción y los controles estándar (Play, Pause, Next, Prev).
*   **B2B Player Lock:** Botón con candado en la cabecera derecha. Bloquea el panel para que el personal de la tienda no altere la reproducción. Se desbloquea con el **PIN de Supervisor: `1234`**.
*   **Network Status:** Indica `ONLINE CLOUD SYNC` (verde/blanco) si hay sincronización con el servidor, o `FALLBACK: OFFLINE CACHE` (naranja) si opera sin conexión sin cortes de audio.

---

### 4. Gestión de Infraestructura: Groups & Zones
Permite organizar los reproductores instalados en las tiendas.
*   **Añadir Grupo:** Escriba en la caja `New Group Name...` y pulse `+ Add Group`.
*   **Zonas:** Despliega una tabla indicando el `Hardware ID` y el `Status` (indicador verde `Online` o naranja `Offline`).

---

### 5. Programación Musical: Mixes Manager (Smart DJ)
Construcción de recetas musicales dinámicas.
*   **Crear Mix:** Escriba el nombre en `Create Mix`.
*   **Estilos Dinámicos:** Seleccione Estilo A (Base) y Estilo B (Contrapunto) entre **10 estilos**: *Indie Pop, Deep House, Chillout, Jazz, Rock, Pop Comercial, Latino/Urbano, Clásica, Blues, Soul*.
*   **Blend Ratio (Slider):** Ajuste del porcentaje de mezcla (ej. 70% Estilo A y 30% Estilo B).
*   **Seguridad y Energía:** Defina el nivel de energía (Low, Medium, High), frecuencia de cuñas (15m a 60m), bloqueo de letras explícitas y bloqueo de reggaeton. Guarde los cambios pulsando **`💾 Guardar Mix`**.

---

### 6. Automatización: Visual Dayparting Schedule
*   **Matriz Semanal:** Cuadrícula de 7 días (Lunes a Domingo) por 4 franjas horarias: *Mañana (08:00 - 12:00), Mediodía (12:00 - 16:00), Tarde (16:00 - 20:00), Noche/Cierre (20:00 - 00:00)*.
*   **Asignación:** Seleccione el Mix en la celda del calendario. La transición entre franjas horarias utiliza un *crossfade* de 7 segundos.

---

### 7. Configuración Avanzada del Motor (Engine Settings)
*   **Offline Cache:** Limite de pre-caché fijado en **4 GB** (aproximadamente 400 horas de audio).
*   **AI Engine (Neuro-IoT):** Interruptor `ACTIVE / DISABLED` para conectar con sensores y modular BPM de forma autónoma.
*   Guarde la configuración del proyecto con el botón **`💾 Guardar Proyecto`**.

---

### 8. Auditoría Legal: SGAE Shield
*   **Botón del Pánico:** Al pulsar `ACTIVATE PANIC MODE`, se purga la RAM y se reproduce exclusivamente música libre de derechos (Royalty-Free).
*   **Audit Log:** Registro inmutable con fecha, hora, ubicación y código de certificación de exención `RF-101` para demostración legal ante entidades de derechos de autor.

---

### 9. Resolución de Problemas
*   **No se guardan mixes:** Verifique que el servicio Node.js esté corriendo en el puerto 4000 (`node server.js`).
*   **FALLBACK constante:** El ping con `8.8.8.8` excede 250ms; verifique el router de la tienda.
*   **Panel no responde:** Compruebe si el panel está bloqueado. Desbloquee con el PIN `1234`.


<div style="page-break-after: always;"></div>

# 🇬🇧 English

# User Manual and Extensive Tutorial: Brand Music Curator Pro

### 1. Introduction and Core Concepts
**Brand Music Curator** is a Sensory Neuro-Architecture platform designed for corporate environments (Retail, Hospitality, Flagships). Its purpose is to automate the background music of multiple physical stores, ensuring uninterrupted playback, copyright compliance, and tempo adaptation to customer traffic.

#### 1.1 Glossary of Terms
*   **Zone:** An independent physical space within a store (e.g., "Fitting Rooms", "Terrace").
*   **Mix:** A mathematical formula combining two playlists in an exact percentage (e.g., 70% Pop, 30% Electronic).
*   **Dayparting:** Dividing the day into time slots, each with a specific musical style.
*   **Fallback / Offline Cache:** Automatic playback from the local SSD when network connection is lost.
*   **SGAE Shield:** Legal defense protocol that switches the catalog to Royalty-Free music in case of an audit.

---

### 2. Requirements and Installation
*   **System Requirements:** Minimum 8 GB RAM, 10 GB free space on SSD. macOS 12 or higher.
*   **Installation:**
    1. Locate the `Brand Music Curator-1.0.0.dmg` file.
    2. Double-click to mount the disk image.
    3. Drag the **Brand Music Curator** icon to the **Applications** folder.
    4. Open the application from your Launchpad or Applications folder.

---

### 3. Getting Started: The Dashboard
The Dashboard is the main control interface for local playback control and system monitoring.
*   **Now Playing:** Displays song progress and transport controls (Play, Pause, Next, Prev).
*   **B2B Player Lock:** Padlock button in the top-right header. Locks the panel to prevent store staff from changing playback. Unlock with the **Supervisor PIN: `1234`**.
*   **Network Status:** Shows `ONLINE CLOUD SYNC` (green/white) when connected to the server, or `FALLBACK: OFFLINE CACHE` (orange) when operating offline with zero audio cuts.

---

### 4. Infrastructure Management: Groups & Zones
Organizes the media players installed across your stores.
*   **Add Group:** Enter a name in the `New Group Name...` field and click `+ Add Group`.
*   **Zones:** Displays a table indicating the `Hardware ID` and `Status` (green `Online` or orange `Offline`).

---

### 5. Music Programming: Mixes Manager (Smart DJ)
Build dynamic music recipes.
*   **Create Mix:** Enter a mix name under `Create Mix`.
*   **Dynamic Styles:** Select Style A (Base) and Style B (Contrapuntal) from **10 real genres**: *Indie Pop, Deep House, Chillout, Jazz, Rock, Pop Comercial, Latino/Urbano, Clásica, Blues, Soul*.
*   **Blend Ratio (Slider):** Drag to adjust mixing ratio (e.g., 70% Style A and 30% Style B).
*   **Security and Energy:** Set the energy level (Low, Medium, High), ad insertion frequency (15m to 60m), explicit lyrics filtering, and reggaeton block. Save changes by clicking **`💾 Guardar Mix`**.

---

### 6. Automation: Visual Dayparting Schedule
*   **Weekly Matrix:** Grid of 7 days (Monday to Sunday) across 4 slots: *Morning (08:00 - 12:00), Noon (12:00 - 16:00), Afternoon (16:00 - 20:00), Night/Close (20:00 - 00:00)*.
*   **Assignment:** Select the Mix in the calendar cell. Transitions between slots use a smooth 7-second crossfade.

---

### 7. Advanced Engine Settings
*   **Offline Cache:** Pre-caching limit set to **4 GB** (approx. 400 hours of audio).
*   **AI Engine (Neuro-IoT):** `ACTIVE / DISABLED` switch to connect local sensors and modulate BPM automatically.
*   Save project configuration with the **`💾 Guardar Proyecto`** button.

---

### 8. Legal Audit: SGAE Shield
*   **Panic Button:** Clicking `ACTIVATE PANIC MODE` purges RAM and forces transition to Royalty-Free music library only.
*   **Audit Log:** Immutable ledger showing date, time, location, and waiver certification code `RF-101` for legal proof before copyright agencies.

---

### 9. Troubleshooting
*   **Mixes not saving:** Verify Node.js backend is running on port 4000 (`node server.js`).
*   **Constant FALLBACK status:** Ping to `8.8.8.8` exceeds 250ms; check store router connectivity.
*   **Panel not responding:** Ensure panel is unlocked. Unlock using PIN `1234`.


<div style="page-break-after: always;"></div>

# 🇩🇪 Deutsch

# Benutzerhandbuch und Anleitung: Brand Music Curator Pro

### 1. Einführung und Kernkonzepte
**Brand Music Curator** ist eine Plattform für sensorische Neuroarchitektur für Unternehmensumgebungen (Einzelhandel, Gastgewerbe, Flagship-Stores). Es automatisiert die Hintergrundmusik in Filialen und garantiert unterbrechungsfreie Wiedergabe, Urheberrechtskonformität und Tempoanpassung an den Kundenstrom.

#### 1.1 Glossar der Begriffe
*   **Zone:** Unabhängiger physischer Bereich in einer Filiale (z. B. "Umkleiden", "Terrasse").
*   **Mix:** Eine Formel, die zwei Playlists in einem genauen Prozentsatz mischt (z. B. 70% Pop, 30% Elektronik).
*   **Dayparting:** Einteilung des Tages in Zeitfenster mit jeweils einem spezifischen Musikstil.
*   **Fallback / Offline Cache:** Automatische Wiedergabe von der lokalen SSD bei Netzwerkausfall.
*   **SGAE-Schild:** Rechtsschutzprotokoll, das bei einer Prüfung auf lizenzfreie Musik umschaltet.

---

### 2. Anforderungen und Installation
*   **Systemanforderungen:** macOS 12 oder höher. Mindestens 8 GB RAM, 10 GB freier Speicherplatz auf SSD.
*   **Installation:**
    1. Suchen Sie die Datei `Brand Music Curator-1.0.0.dmg`.
    2. Doppelklicken Sie, um das Image zu aktivieren.
    3. Ziehen Sie das **Brand Music Curator**-Symbol in den Ordner **Programme**.
    4. Öffnen Sie die App über Ihr Launchpad oder den Programme-Ordner.

---

### 3. Erste Schritte: Das Dashboard
Das Dashboard ist die Hauptoberfläche zur Wiedergabesteuerung und Systemüberwachung.
*   **Now Playing:** Zeigt den Songfortschritt und die Steuerelemente (Play, Pause, Next, Prev).
*   **B2B-Sperre:** Vorhängeschloss-Schaltfläche oben rechts. Sperrt das Bedienfeld. Entsperren mit dem **Supervisor-PIN: `1234`**.
*   **Netzwerkstatus:** Zeigt `ONLINE CLOUD SYNC` (grün/weiß) oder `FALLBACK: OFFLINE CACHE` (orange) bei Offline-Betrieb.

---

### 4. Infrastrukturverwaltung: Gruppen & Zonen
*   **Gruppe hinzufügen:** Namen in `New Group Name...` eingeben und auf `+ Add Group` klicken.
*   **Zonen:** Tabelle mit `Hardware ID` und `Status` (grün `Online` oder orange `Offline`).

---

### 5. Musikprogrammierung: Mixes Manager (Smart DJ)
*   **Mix erstellen:** Mixnamen unter `Create Mix` eingeben.
*   **Dynamische Stile:** Wählen Sie Stil A (Basis) und Stil B (Kontrapunkt) aus **10 Genres** (Indie Pop, Deep House, Chillout, Jazz usw.).
*   **Blend Ratio (Slider):** Mischungsverhältnis einstellen (z. B. 70% Stil A und 30% Stil B).
*   **Sicherheit:** Energieniveau (Low, Medium, High), Werbefrequenz (15m bis 60m) und Inhaltsfilter einstellen. Speichern mit **`💾 Guardar Mix`**.

---

### 6. Automatisierung: Visual Dayparting Schedule
*   **Wochenmatrix:** 7 Tage, 4 Zeitfenster (Vormittag, Mittag, Nachmittag, Abend).
*   **Zuweisung:** Mix im Kalender auswählen. Der Übergang nutzt ein 7-Sekunden-Crossfade.

---

### 7. Erweiterte Motoreinstellungen
*   **Offline-Cache:** Limit auf **4 GB** eingestellt (ca. 400 Stunden Musik).
*   **AI Engine (Neuro-IoT):** `ACTIVE / DISABLED`-Schalter für Sensoren und automatische BPM-Modulation.
*   Speichern mit **`💾 Guardar Proyecto`**.

---

### 8. SGAE-Schild-Audits
*   **Panic Button:** Purged den RAM und erzwingt den Übergang zur lizenzfreien Musikbibliothek.
*   **Audit Log:** Unveränderbares Protokoll mit Datum, Uhrzeit, Ort und Freistellungscode `RF-101` als rechtlicher Nachweis.

---

### 9. Fehlerbehebung
*   **Mixes speichern nicht:** Überprüfen Sie, ob der Node.js-Dienst auf Port 4000 läuft.
*   **Ständiger FALLBACK:** Ping zu `8.8.8.8` überschreitet 250ms; Router prüfen.
*   **Bedienfeld reagiert nicht:** Entsperren mit PIN `1234`.


<div style="page-break-after: always;"></div>

# 🇷🇺 Русский

# Руководство пользователя: Brand Music Curator Pro

### 1. Введение и основные концепции
**Brand Music Curator** — это платформа сенсорной нейроархитектуры для корпоративной среды (ритейл, отели, рестораны). Она автоматизирует фоновую музыку, гарантируя бесперебойное воспроизведение, соблюдение авторских прав и адаптацию темпа к потоку покупателей.

#### 1.1 Глоссарий терминов
*   **Зона (Zone):** Независимое физическое пространство в магазине (например, "Примерочные", "Терраса").
*   **Микс (Mix):** Формула, сочетающая два плейлиста в точной пропорции (например, 70% поп-музыки, 30% электроники).
*   **Dayparting:** Деление дня на временные интервалы со своим музыкальным стилем.
*   **Fallback / Offline Cache:** Автоматическое воспроизведение с локального SSD при сбое сети.
*   **SGAE Shield:** Протокол защиты, который переключает музыку на свободную от авторских прав (Royalty-Free) в случае инспекции.

---

### 2. Требования и установка
*   **Системные требования:** macOS 12 или выше. Минимум 8 ГБ ОЗУ, 10 ГБ свободного места на SSD.
*   **Установка:**
    1. Найдите файл `Brand Music Curator-1.0.0.dmg`.
    2. Дважды щёлкните для монтирования диска.
    3. Перетащите иконку **Brand Music Curator** в папку **Программы** (Applications).
    4. Запустите приложение из Launchpad или папки Программы.

---

### 3. Начало работы: Панель управления
Панель управления — это главный экран для управления локальным воспроизведением и мониторинга системы.
*   **Now Playing:** Отображает прогресс песни и кнопки управления (Play, Pause, Next, Prev).
*   **B2B Player Lock:** Кнопка с замком в правом верхнем углу. Блокирует панель во избежание несанкционированного изменения. Разблокируйте с помощью **PIN-кода супервизора: `1234`**.
*   **Network Status:** Показывает `ONLINE CLOUD SYNC` (зеленый/белый) при подключении к серверу или `FALLBACK: OFFLINE CACHE` (оранжевый) при автономной работе.

---

### 4. Управление инфраструктурой: Группы и Зоны
*   **Добавить группу:** Введите имя в поле `New Group Name...` и нажмите `+ Add Group`.
*   **Зоны:** Таблица с указанием `Hardware ID` и `Status` (зеленый `Online` или оранжевый `Offline`).

---

### 5. Программирование музыки: Mixes Manager
*   **Создать микс:** Введите название микса под `Create Mix`.
*   **Динамические стили:** Выберите Стиль А (База) и Стиль B (Контрапункт) из **10 жанров** (Indie Pop, Deep House, Chillout, Jazz и др.).
*   **Blend Ratio (Слайдер):** Отрегулируйте соотношение смешивания (например, 70% Стиля А и 30% Стиля B).
*   **Безопасность:** Установите уровень энергии (Low, Medium, High), частоту рекламы (15м - 60м) и фильтры содержимого. Сохраните изменения кнопкой **`💾 Guardar Mix`**.

---

### 6. Автоматизация: Расписание Dayparting
*   **Недельная матрица:** Сетка из 7 дней (с понедельника по воскресенье) по 4 интервалам.
*   **Назначение:** Выберите микс в ячейке календаря. Переход использует 7-секундный кроссфейд.

---

### 7. Дополнительные настройки движка
*   **Offline-кэш:** Лимит кэширования установлен на **4 ГБ** (~400 часов музыки).
*   **AI Engine (Neuro-IoT):** Переключатель `ACTIVE / DISABLED` для датчиков и автоматической модуляции BPM.
*   Сохраните проект кнопкой **`💾 Guardar Proyecto`**.

---

### 8. Юридический аудит: SGAE Shield
*   **Кнопка паники:** Нажатие `ACTIVATE PANIC MODE` очищает ОЗУ и принудительно переключает воспроизведение на свободную от прав библиотеку.
*   **Журнал аудита:** Неизменяемый реестр с датой, временем, местоположением и кодом сертификации `RF-101` для предоставления инспекторам.

---

### 9. Устранение неполадок
*   **Миксы не сохраняются:** Проверьте, запущен ли Node.js на порту 4000 (`node server.js`).
*   **Постоянный статус FALLBACK:** Пинг до `8.8.8.8` превышает 250 мс; проверьте роутер.
*   **Панель не отвечает:** Убедитесь, что панель разблокирована с помощью PIN-кода `1234`.


<div style="page-break-after: always;"></div>

# 🇯🇵 日本語

# ユーザーマニュアルとチュートリアル：Brand Music Curator Pro

### 1. はじめにとコアコンセプト
**Brand Music Curator** は、企業環境（店舗、ホテル、フラッグシップストア）向けに設計された感覚的ニューロアーキテクチャプラットフォームです。B2B 音楽の自動化、著作権管理の遵守、顧客のトラフィックに合わせたテンポの自動調節を実現します。

#### 1.1 用語集
*   **ゾーン (Zone):** 店舗内の独立した物理スペース（例：「試着室」、「テラス」）。
*   **ミックス (Mix):** 2つのプレイリストを正確な比率で組み合わせる数式（例：Pop 70%、Electronic 30%）。
*   **デイパーティング (Dayparting):** 1日を時間帯に分割し、それぞれに特定の音楽スタイルを割り当てる手法。
*   **フォールバック / オフラインキャッシュ:** ネットワーク切断時にローカルSSDから音楽を自動再生する緊急システム。
*   **SGAEシールド:** 立ち入り調査時に著作権フリーの音楽に自動的に移行する法的防御プロトコル。

---

### 2. 要件とインストール
*   **システム要件:** macOS 12 以降。最低 8 GB RAM、10 GB 以上の SSD 空き容量。
*   **インストール方法:**
    1. `Brand Music Curator-1.0.0.dmg` ファイルを見つけます。
    2. ダブルクリックしてディスクイメージをマウントします。
    3. **Brand Music Curator** アイコンを **アプリケーション** フォルダにドラッグします。
    4. Launchpad またはアプリケーションフォルダからアプリを開きます。

---

### 3. はじめに：ダッシュボード
ダッシュボードは、ローカル再生制御およびシステム監視用のメイン画面です。
*   **Now Playing:** 曲の進行状況とトランスポートコントロール（再生、一時停止、曲送り、曲戻し）を表示。
*   **B2Bプレイヤーロック:** ヘッダー右上の南京錠ボタン。操作パネルをロックして店舗スタッフによる誤操作を防ぎます。**スーパーバイザーPIN：`1234`** でロック解除します。
*   **ネットワークステータス:** 接続時は `ONLINE CLOUD SYNC` (緑/白)、オフライン時は `FALLBACK: OFFLINE CACHE` (オレンジ) と表示されます。

---

### 4. インフラ管理：グループとゾーン
*   **グループの追加:** `New Group Name...` に名前を入力し、`+ Add Group` をクリック。
*   **ゾーン:** 各ゾーンの `Hardware ID` と `Status`（緑色の `Online` またはオレンジの `Offline`）を示すテーブル。

---

### 5. 音楽プログラミング：ミックスマネージャー
*   **ミックスの作成:** `Create Mix` の下にミックス名を入力。
*   **アライアンススタイル:** **10種類のジャンル**（Indie Pop、Deep House、Chillout、Jazzなど）からスタイルA（ベース）とスタイルB（コントラプンタ）を選択。
*   **ブレンド比率（スライダー）:** スライダーをドラッグして比率を調整（例：スタイルA 70%、スタイルB 30%）。
*   **セキュリティと安全ガードレール:** エネルギー（Low, Medium, High）、広告頻度（15分〜60分）、不適切な歌詞のブロック、レゲトン/アーバンのブロックを設定。変更を **`💾 Guardar Mix`** ボタンで保存します。

---

### 6. 自動化：デイパーティングスケジュール
*   **週間マトリクス:** 7日（月曜〜日曜）× 4つの時間帯のグリッド。
*   **割り当て:** セルでミックスを選択。時間帯移行時には7秒間のクロスフェードが適用されます。

---

### 7. エンジンの詳細設定
*   **オフラインキャッシュ:** プリキャッシュ制限を **4 GB**（約400時間の音楽）に設定。
*   **AI Engine (Neuro-IoT):** センサーと接続して自動的にBPMをモジュレートする `ACTIVE / DISABLED` スイッチ。
*   **`💾 Guardar Proyecto`** ボタンをクリックしてプロジェクト設定を保存します。

---

### 8. 法的監査：SGAEシールド
*   **パニックボタン:** `ACTIVATE PANIC MODE` をクリックすると、即座にRAMをパージし、ロイヤリティフリー（免責コード `RF-101`）のライブラリ音楽のみの再生を強制します。
*   **監査ログ:** 日時、場所、免責証明コードを示す不変のログ。著作権団体への提出証拠として機能します。

---

### 9. トラブルシューティング
*   **ミックスが保存されない:** Node.js バックエンドサービスがポート4000（`node server.js`）で実行されているか確認。
*   **常にフォールバック状態:** `8.8.8.8` への ping が 250ms を超えています。ルーターを確認してください。
*   **パネルが反応しない:** パネルがロックされていないか確認し、PIN `1234` を入力してください。


<div style="page-break-after: always;"></div>

# 🇺🇦 Українська

# Посібник користувача та навчальний посібник: Brand Music Curator Pro

### 1. Вступ та основні концепції
**Brand Music Curator** — це платформа сенсорної нейроархітектури для корпоративного середовища (рітейл, готелі, ресторани). Вона автоматизує фонову музику в філіях, гарантуючи безперебійне відтворення, дотримання авторських прав і адаптацію темпу до потоку покупців.

#### 1.1 Глосарій термінів
*   **Зона (Zone):** Незалежний фізичний простір у магазині (наприклад, "Примерочні", "Тераса").
*   **Мікс (Mix):** Формула, що поєднує два плейлисти в точній пропорції (наприклад, 70% поп, 30% електроніки).
*   **Dayparting:** Ділення дня на часові інтервали зі своїм музичним стилем.
*   **Fallback / Offline Cache:** Автоматичне відтворення з локального SSD при збої мережі.
*   **SGAE Shield:** Протокол захисту, який перемикає музику на вільну від авторських прав (Royalty-Free) у разі інспекції.

---

### 2. Вимоги та встановлення
*   **Системні вимоги:** macOS 12 або вище. Мінімум 8 ГБ ОЗУ, 10 ГБ вільного місця на SSD.
*   **Встановлення:**
    1. Знайдіть файл `Brand Music Curator-1.0.0.dmg`.
    2. Двічі клацніть для монтування диска.
    3. Перетягніть іконку **Brand Music Curator** до папки **Програми** (Applications).
    4. Запустіть програму з Launchpad або папки Програми.

---

### 3. Початок роботи: Панель керування
Панель керування — це головний екран для керування локальним відтворенням і моніторингу системи.
*   **Now Playing:** Відображає прогрес пісні та кнопки керування (Play, Pause, Next, Prev).
*   **B2B Player Lock:** Кнопка з замком у правому верхньому кутку. Блокує панель. Розблокуйте за допомогою **PIN-коду супервізора: `1234`**.
*   **Network Status:** Показує `ONLINE CLOUD SYNC` (зелений/білий) при підключенні до сервера або `FALLBACK: OFFLINE CACHE` (помаранчевий) при автономній роботі.

---

### 4. Керування інфраструктурою: Групи та Зони
*   **Додати групу:** Введіть ім'я у полі `New Group Name...` і натисніть `+ Add Group`.
*   **Зони:** Таблиця з вказівкою `Hardware ID` та `Status` (зелений `Online` або помаранчевий `Offline`).

---

### 5. Програмування музики: Mixes Manager
*   **Створити мікс:** Введіть назву міксу під `Create Mix`.
*   **Динамічні стилі:** Виберіть Стиль А (База) та Стиль B (Контрапункт) з **10 жанрів** (Indie Pop, Deep House, Chillout, Jazz тощо).
*   **Blend Ratio (Слайдер):** Відрегулюйте співвідношення змішування (наприклад, 70% Стилю А і 30% Стилю B).
*   **Безпека:** Встановіть рівень енергії (Low, Medium, High), частоту реклами (15м - 60м) та фільтри вмісту. Збережіть зміни кнопкою **`💾 Guardar Mix`**.

---

### 6. Автоматизація: Розклад Dayparting
*   **Тижнева матриця:** Сітка з 7 днів (з понеділка по неділю) по 4 інтервалах.
*   **Призначення:** Виберіть мікс у комірці календаря. Перехід використовує 7-секундний кросфейд.

---

### 7. Додаткові налаштування двигуна
*   **Offline-кеш:** Ліміт кешування встановлено на **4 ГБ** (~400 годин музики).
*   **AI Engine (Neuro-IoT):** Перемикач `ACTIVE / DISABLED` для датчиків та автоматичної модуляції BPM.
*   Збережіть проект кнопкою **`💾 Guardar Proyecto`**.

---

### 8. Юридичний аудит: SGAE Shield
*   **Кнопка паніки:** Натискання `ACTIVATE PANIC MODE` очищає ОЗУ та примусово перемикає відтворення на вільну від прав бібліотеку.
*   **Журнал аудиту:** Незмінний реєстр з датою, часом, місцем розташування та кодом сертифікації `RF-101` для надання інспекторам.

---

### 9. Усунення несправностей
*   **Мікси не зберігаються:** Перевірте, чи запущений Node.js на порту 4000 (`node server.js`).
*   **Постійний статус FALLBACK:** Пінг до `8.8.8.8` перевищує 250 мс; перевірте роутер.
*   **Панель не відповідає:** Переконайтеся, що панель розблокована за допомогою PIN-коду `1234`.


<div style="page-break-after: always;"></div>

# 🇨🇳 中文

# 用户手册与教程：Brand Music Curator Pro

### 1. 简介与核心概念
**Brand Music Curator** 是一款专为企业环境（零售、酒店、旗舰店）设计的感官神经架构平台。其目的是实现多门店背景音乐的自动化管理，确保无间断播放、版权合规以及根据客流量自动调节音乐节奏。

#### 1.1 术语表
*   **区域 (Zone):** 门店内的独立物理空间（如“试衣间”、“露台”）。
*   **混音 (Mix):** 将两个播放列表按精确比例结合的数学公式（如 70% 流行，30% 电子）。
*   **日校分时 (Dayparting):** 将一天划分为不同的时间段，每个时间段分配特定的音乐风格。
*   **备用/离线缓存 (Fallback / Offline Cache):** 网络连接中断时，系统自动从本地 SSD 缓存中无缝播放音乐。
*   **SGAE 护盾 (SGAE Shield):** 遭遇音乐版权稽查时，立即切换为免版税（Royalty-Free）音乐的法律保护协议。

---

### 2. 系统要求与安装
*   **系统要求:** 最低 8 GB RAM，固态硬盘（SSD）上至少 10 GB 可用空间。macOS 12 或更高版本。
*   **安装步骤:**
    1. 找到 `Brand Music Curator-1.0.0.dmg` 文件。
    2. 双击挂载磁盘映像。
    3. 将 **Brand Music Curator** 图标拖动到 **应用程序**（Applications）文件夹中。
    4. 从 Launchpad 或应用程序文件夹打开该程序。

---

### 3. 入门指南：控制面板
控制面板是用于本地播放控制和系统状态监控的主屏幕。
*   **正在播放 (Now Playing):** 显示歌曲进度和基本控制键（播放、暂停、下一首、上一首）。
*   **B2B 播放器锁定:** 右上角工具栏中的挂锁按钮。锁定面板以防止店内员工更改播放。使用 **主管 PIN 码: `1234`** 进行解锁。
*   **网络状态:** 连线时显示 `ONLINE CLOUD SYNC`（绿/白），离线无缝运行时显示 `FALLBACK: OFFLINE CACHE`（橙色）。

---

### 4. 基础设施管理：分组与区域
组织安装在各个门店中的播放器。
*   **添加分组:** 在 `New Group Name...` 框中输入名称，然后点击 `+ Add Group`。
*   **区域:** 显示一个指示 `Hardware ID` 和 `Status`（绿色表示 `Online`，橙色表示 `Offline`）的表格。

---

### 5. 音乐编程：混音管理器 (Mixes Manager)
构建动态音乐配方。
*   **创建混音:** 在 `Create Mix` 下输入混音名称。
*   **动态风格:** 从 **10种真实流派**（独立流行、深邃浩室、慢摇、爵士等）中选择风格 A（基础）和风格 B（对比）。
*   **混音比例 (滑动条):** 拖动以调整混合比例（如风格 A 占 70%，风格 B 占 30%）。
*   **安全性与能量控制:** 设置能量等级（Low, Medium, High）、插播广告频率（15分钟至60分钟）、过滤不雅歌词以及屏蔽雷鬼/都市音乐。点击 **`💾 Guardar Mix`** 按钮保存修改。

---

### 6. 自动化：时间段排程矩阵
*   **每周矩阵:** 7天（周一至周日）× 4个营业时间段的网格。
*   **分配:** 在单元格中选择混音。时间段之间的切换使用 7 秒的淡入淡出（Crossfade）。

---

### 7. 引擎高级设置
*   **离线缓存:** 预缓存限制设定为 **4 GB**（约 400 小时音频）。
*   **AI Engine (Neuro-IoT):** `ACTIVE / DISABLED` 开关，用于连接店内传感器并自动调制 BPM。
*   点击 **`💾 Guardar Proyecto`** 按钮保存项目设置。

---

### 8. 法律审计：SGAE 护盾
*   **恐慌按钮:** 点击 `ACTIVATE PANIC MODE` 立即清理 RAM，强制只播放免版税（豁免代码 `RF-101`）的库音乐。
*   **审计日志:** 不可篡改的日志，显示日期、时间、地点和豁免证书代码，供版权监管机构作为法律证明使用。

---

### 9. 故障排除
*   **混音无法保存:** 检查 Node.js 后端服务是否在端口 4000（`node server.js`）上运行。
*   **持续处于 FALLBACK 状态:** 连接 `8.8.8.8` 延迟超过 250 毫秒，请检查店内的路由器。
*   **控制面板无响应:** 检查面板是否已锁死，使用 PIN 码 `1234` 进行解锁。


*© Brand Music Curator Pro V2.5 — Jesús Ferrer García (CHUS BZN) — All rights reserved / Todos los derechos reservados*
