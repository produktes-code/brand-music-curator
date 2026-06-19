# Brand Music Curator Pro V2.5 - B2B Audio Player

![Status](https://img.shields.io/badge/Status-Production_Ready-success) ![License](https://img.shields.io/badge/License-Proprietary-red) ![Version](https://img.shields.io/badge/Version-2.5.0-blue)

**Brand Music Curator** is an enterprise-grade sensory neuro-architecture audio platform designed specifically for commercial and B2B environments (Retail, Hospitality, and Flagship stores). It is built as a native desktop player that automates store playlists, handles offline caching for zero-silence, provides local supervisor locks (PIN `1234`), and integrates a legal defense shield (SGAE Shield).

**Developed in collaboration by Antigravity AI and Jesús Ferrer (CHUS BZN).**

---

## 🎯 Core Purpose
Brand Music Curator addresses critical background music challenges in physical stores:
1.  **Sales Optimization:** Modulates music tempo and energy level dynamically based on traffic flow or time of day.
2.  **Network Resilience (Zero-Silence):** Uses an offline-first caching system to ensure playback continues seamlessly even during total internet drops.
3.  **Legal Exemption Auditing (SGAE Shield):** Fast, certified transition to Royalty-Free catalog during inspector checks, providing an immutable audit proof ledger.

---

## 🏗️ Technical Architecture
The player is built using a modern desktop application stack:

*   **Frontend (UI):** Built in **React 19** with custom design tokens (Stitch System) to yield a premium glassmorphic dark-mode control console.
*   **Shell (Desktop):** Structured in **Electron** to pack as a native application for macOS and Windows.
*   **Storage (Database):** Uses local sqlite-backed parameters to persist mixes and schedules across power outages.
*   **Audio Engine (DSP):** IPC bridge connected to local systems to analyze audio attributes and apply dynamic filters.

---

## ⚙️ Key Features & Modules

### 1. B2B Player Security Lock
*   A padlock button in the top-right header locks the player interface, disabling manual music skips or volume changes for store employees.
*   Unlock using the supervisor-level PIN: **`1234`**.

### 2. Mixes Manager (Smart DJ)
*   Create dynamic recipes using **10 real genres**: *Indie Pop, Deep House, Chillout, Jazz, Rock, Pop Comercial, Latino/Urbano, Clásica, Blues, Soul*.
*   Adjust blending ratio, energy levels, ad insertion frequencies, and content blocks (explicit lyrics, urban genres). Save changes directly to SQLite.

### 3. Dayparting Matrix Schedule
*   Weekly grid (7 days × 4 time blocks) to automate mix changes. Includes a smooth 7-second crossfade between schedule transitions.

### 4. Advanced Engine Settings & SGAE Shield
*   Adjust cache limits (default **4 GB** / ~400 hours) and toggle Neuro-IoT variables.
*   **SGAE Shield:** A red panic button that instantly switches all audio output to a royalty-free catalog (exemption code `RF-101`) and writes immutable proof to the log.

---

## 🚀 Installation & Usage (Desktop Mode)

### macOS Setup
1. Mount the `Brand Music Curator-1.0.0.dmg` installer.
2. Drag **Brand Music Curator** into your **Applications** folder.
3. If running from source/development:
   ```bash
   npm install
   npm run electron:dev
   ```

### Production Build
To pack native desktop installers for Windows and macOS:
```bash
npm run pack:all
```
This compiles the client and generates the `.dmg` and `.exe` binaries under `dist-electron`.

---

## 📋 Technical User Manual

📥 **[Download Comprehensive PDF Manual](./manual.pdf)**

For a complete step-by-step tutorial on parameter usage, dayparting setup, and troubleshooting in the 7 supported languages (Spanish, English, German, Russian, Japanese, Ukrainian, and Chinese), refer to the pre-compiled PDF manual located in this folder.

---

*© Brand Music Curator 2.5 — Jesús Ferrer (CHUS BZN) & Antigravity AI. All rights reserved.*
