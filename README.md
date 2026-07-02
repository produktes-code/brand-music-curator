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

🌐 **Read this in:** **🇬🇧 English** | [🇪🇸 Español](README_es.md) | [🇩🇪 Deutsch](README_de.md) | [🇷🇺 Русский](README_ru.md) | [🇯🇵 日本語](README_ja.md) | [🇺🇦 Українська](README_uk.md) | [🇨🇳 中文](README_zh.md)

---

## 🎯 The Vision (Introduction)

The genesis of Brand Music Curator stems from a deep frustration in the Retail industry: background music in commercial spaces has always been an afterthought, often relegated to generic playlists that end up fatiguing both customers and employees. As engineers and experience designers, we understood that audio is not an ornament, it is a psychological anchor. Brand Music Curator was designed to be the ultimate Audio Digital Twin for large venues. It is not a player; it is a curatorial brain that understands the energy of the premises, modulates customer flow (CX) and, critically, shields the business against draconian copyright inspections. We created this tool to give brands back control over their sonic identity.

> [!NOTE]
> Developed by **produktes-code** and **Jesús Ferrer (CHUS BZN)** to establish professional standards in commercial engineering.

---

## 📸 Interface / Ergonomics

![Desktop Interface](docs/screenshots/screenshot-Desktop.png)


---

## ⚙️ Parameter Masterclass (Features)

- **Analytical DSP Engine (librosa)**: Why do we need real-time mathematical analysis? Because relying on MP3 ID3 metadata is a rookie mistake. We integrated the 'librosa' engine to read raw audio bytes, extracting RMS energy (true speaker impact), Tempo (BPM), and Harmonic Key. This allows seamless playlists without destructive energy drops.
- **45 Musical Styles Matrix**: We don't believe in static playlists. You cross percentages of 45 genres. Selecting 70% Indie Pop and 30% Lo-Fi Hip Hop creates a specific texture designed to relax the customer while keeping pace. This empowers the music curator to paint with sound.
- **Independent Zone Topology**: A hotel's lobby doesn't sound like its restaurant. We structured the software to route audio algorithmically across hardware zones from a single centralized machine.
- **SGAE Shield (Copyright Armor)**: The biggest headache in retail is IP fines. The 'SGAE Shield' is our legal-engineering answer. One button strictly forces the player into pre-approved Royalty-Free catalogs, acting as a life-saving firewall during surprise inspections.
- **Absolute Fallback (Spotify API)**: Silence is unacceptable. Our asynchronous watchdog monitors the local buffer. If local drives fail, it transparently injects audio via the Spotify API, ensuring zero perceived latency.

---

## 🛡️ Shielding Architecture (Security)

In Retail and Enterprise deployment, a system crash is not a bug; it is capital loss. We designed a defensive armor (Shielding) emulating DevSecOps best practices:

• **Anti-Flood Engineering (Rate limiting)**: Asynchronous algorithms strangle anomalous request spikes using limitation middlewares.
• **Binary Crystallography (Magic Bytes)**: The system opens the file header and verifies the native hexadecimal sequence to certify container integrity.
• **RAM Sanity (2 GB Limit)**: We relentlessly reject any atypical weight at the upload threshold to prevent Out Of Memory attacks.

---

## 🚀 Technical Deployment (Installation)

The deployment process of this tool responds to an industry imperative: in a studio or production environment, time spent configuring dependencies is time wasted. We packaged a 'Zero-Friction' architecture compiling DSP libraries, Python binaries, and renderers directly into the application's core.

• **macOS Systems**: The `.dmg` binary guarantees absolute portability. Note: Because it lacks a paid developer certificate for Apple's Notarization Service, macOS Gatekeeper will quarantine the binary. As engineers, we know the legitimate local bypass method is 'Right-click -> Open'. It is not a flaw; it is the standard flow of high-performance open-source software.
• **Windows Systems**: The installer payload silently auto-configures the Windows PATH environment, evading conflicts with pre-existing Python installations.

---

## 📚 Documentation & Manuals

For an exhaustive technical masterclass, troubleshooting guides, and full API details, please download our official manual:

📥 **[USER_MANUAL.pdf (PDF - 7 Languages)](docs/USER_MANUAL.pdf)**


---

## ⚖️ Engineering Manifesto, Credits & License

Software conceived and articulated from the produktes-code labs in inseparable union with Engineer Jesus Ferrer Garcia (CHUS BZN).

Licensed under proprietary restrictions and strictest open source margins (CC BY-NC-SA 4.0). CORPORATE STANDARD - RETAIL READY.



⚠️ macOS Users Notice: When opening the application for the first time, macOS may show a security warning. Solution: right-click on the application and select "Open", then click "Open" in the dialog. If it was already blocked, go to System Preferences > Privacy & Security and click "Open Anyway".