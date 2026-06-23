# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-22

### Added
- Initial release with audio file analysis (BPM, key, energy, genre detection).
- Spotify API integration placeholder for track metadata enrichment.
- AI-powered music curation engine.
- React frontend (Vite & Electron) with premium glassmorphic drag & drop upload interface.
- Docker and docker-compose support for easy deployment.
- Node.js Express backend with sqlite3 database and local cache.
- CC BY-NC-SA 4.0 License file protecting the application.
- Auto-generation of `.env` file with secure random decryption key on server start.
- Rate limiting module utilizing `express-rate-limit` for DDoS prevention.
- Custom structured logging utility (`logger.js`) mapping backend and database events to `logs/combined.log`.
- `GET /health/ready` endpoint verifying API, Python dependencies (mutagen), and credentials.
- `CHANGELOG.md` and `CONTRIBUTING.md` guides.
- Blindaje de seguridad extremo con políticas estrictas de CORS y Rate Limiting.
- Soporte multilingüe completo con UI mutante en 7 idiomas nativos.
- Validación de archivos robusta en frontend y backend mediante Magic Bytes y validación MIME.
- Control estricto de subidas con un límite de 2 GB.
- Empaquetado de producción con Instaladores nativos distribuidos (.dmg para macOS, .exe para Windows).
