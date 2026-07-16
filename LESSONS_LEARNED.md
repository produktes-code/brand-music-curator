Crea un archivo `LESSONS_LEARNED.md` en la raíz de cada uno de los 4 repositorios con este contenido exacto:

# Lecciones Aprendidas - NO REPETIR

## Workflows de GitHub Actions
- ❌ NO crear workflows automáticos sin permiso (ej: "Promote Release")
- ❌ NO usar GH_TOKEN manual (usar GITHUB_TOKEN automático)
- ❌ NO intentar firmar código (codesign, signtool) - no tenemos certificado
- ❌ NO intentar notarizar (notarytool, xcrun) - no tenemos Apple Developer
- ❌ NO usar --publish always (usar --publish never)
- ✅ USAR actions/upload-artifact para guardar los binarios
- ✅ USAR gh release create manualmente para publicar

## Instaladores
- ❌ NO intentar generar .exe desde macOS (no funciona sin wine)
- ✅ USAR GitHub Actions (windows-latest) para generar .exe
- ✅ USAR macOS local o GitHub Actions (macos-latest) para generar .dmg

## Manuales PDF
- ❌ NO usar Pandoc (no instalado en macOS Ventura)
- ❌ NO usar markdown-pdf (comprime el texto)
- ✅ USAR fpdf2 con set_compression(False)

## Código
- ❌ NO dejar placeholders (funciones con pass)
- ❌ NO hardcodear textos (usar sistema i18n con 7 idiomas)
- ❌ NO mezclar referencias de otros proyectos
- ✅ Verificar que los 7 JSON de idiomas tienen claves idénticas

## Auditoría
- ✅ SIEMPRE verificar con comandos reales antes de reportar OK
- ✅ SIEMPRE mostrar evidencia (rutas, tamaños, logs)
- ✅ SIEMPRE probar instaladores en PATH=/bin