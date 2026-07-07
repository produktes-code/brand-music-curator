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

🌐 **他の言語で読む:** [🇬🇧 English](README.md) | [🇪🇸 Español](README_es.md) | [🇩🇪 Deutsch](README_de.md) | [🇷🇺 Русский](README_ru.md) | **🇯🇵 日本語** | [🇺🇦 Українська](README_uk.md) | [🇨🇳 中文](README_zh.md)

---

## 🎯 ビジョン（はじめに）

Brand Music Curatorの起源は、小売業界における深い不満から生じています。エンジニアとして、オーディオは単なる装飾ではなく、心理的なアンカーであることを理解しました。このツールは、究極のオーディオデジタルツインとして設計されています。単なるプレーヤーではなく、施設のエネルギーを理解し、顧客の流れを調整し、著作権検査からビジネスを保護するキュレーションの頭脳です。

> [!NOTE]
> Developed by **produktes-code** and **Jesús Ferrer (CHUS BZN)** to establish professional standards in commercial engineering.

---

## 📸 Interface / Ergonomics

![Desktop Interface](docs/screenshots/screenshot-Desktop.png)


---

## ⚙️ パラメーターマスタークラス（機能）

- **分析DSPエンジン**：シームレスな移行のために、生のオーディオバイトをRMSエネルギー、BPM、およびキーについて分析します。
- **45の音楽スタイルマトリックス**：ジャンルの割合を組み合わせてカスタムサウンドテクスチャを作成します。
- **独立したゾーントポロジ**：単一のマシンから異なるエリアの異なる雰囲気を制御します。
- **SGAEシールド**：検査中にロイヤリティフリーのカタログに切り替えることで、著作権の罰金から保護します。
- **絶対的なフォールバック**：ローカルバッファを監視し、障害が発生した場合はシームレスにSpotifyに切り替えます。

---

## 🛡️ シールドアーキテクチャ（セキュリティ）

防御装甲：

• アンチフラッド：リクエストのスパイクを制限します。
• マジックバイト：16進ヘッダーの検証。
• RAM制限（2 GB）：OOM攻撃を防ぎます。

---

## 🚀 技術展開（インストール） とCI/CDインストール

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

## 📚 ドキュメントとマニュアル

公式マニュアルをダウンロードしてください：

📥 **[USER_MANUAL.pdf (PDF - 7 Languages)](docs/USER_MANUAL.pdf)**


---

## ⚖️ エンジニアリングマニフェスト、クレジット、ライセンス

produktes-codeとJesus Ferrer（CHUS BZN）によって開発されました。 CC BY-NC-SA 4.0。 企業標準。


