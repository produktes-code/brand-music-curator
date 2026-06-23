import React, { useState, useRef } from 'react';
import { Upload, FileAudio, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',       // MP3
  'audio/mp3',        // MP3 alternative
  'audio/wav',        // WAV
  'audio/x-wav',      // WAV alternative
  'audio/flac',       // FLAC
  'audio/x-flac',     // FLAC alternative
  'audio/ogg',        // OGG
  'audio/x-ogg',      // OGG alternative
  'audio/aiff',       // AIFF
  'audio/x-aiff'      // AIFF alternative
];

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export default function MusicUpload({ onUploadSuccess, isLocked, t = (s) => typeof s === 'string' ? s : (s['en'] || s['es'] || '') }) {
  const [dragActive, setDragActive] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const validFiles = [];
    let currentTotalSize = filesList.reduce((acc, f) => acc + f.size, 0);

    for (let file of files) {
      // 1. MIME Validation
      if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|ogg|aiff|aif)$/i)) {
        setErrorMsg(t({
          es: `Formato de archivo no soportado: "${file.name}". Formatos permitidos: MP3, WAV, FLAC, OGG, AIFF.`,
          en: `Unsupported file format: "${file.name}". Allowed formats: MP3, WAV, FLAC, OGG, AIFF.`,
          de: `Ungültiges Dateiformat: "${file.name}". Erlaubte Formate: MP3, WAV, FLAC, OGG, AIFF.`,
          ru: `Неподдерживаемый формат файла: "${file.name}". Разрешенные форматы: MP3, WAV, FLAC, OGG, AIFF.`,
          ja: `サポートされていないファイル形式です: "${file.name}"。許可されている形式: MP3, WAV, FLAC, OGG, AIFF。`,
          uk: `Непідтримуваний формат файлу: "${file.name}". Дозволені формати: MP3, WAV, FLAC, OGG, AIFF.`,
          zh: `不支持的文件格式: "${file.name}"。允许的格式: MP3, WAV, FLAC, OGG, AIFF。`
        }));
        return [];
      }

      // 2. Individual File Size Validation
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(t({
          es: `El archivo "${file.name}" excede el límite de 2GB.`,
          en: `The file "${file.name}" exceeds the 2GB limit.`,
          de: `Die Datei "${file.name}" überschreitet das Limit von 2GB.`,
          ru: `Файл "${file.name}" превышает лимит в 2 ГБ.`,
          ja: `ファイル "${file.name}" は2GBの制限を超えています。`,
          uk: `Файл "${file.name}" перевищує ліміт у 2 ГБ.`,
          zh: `文件 "${file.name}" 超过了 2GB 的限制。`
        }));
        return [];
      }

      // 3. Total Request Size Validation
      currentTotalSize += file.size;
      if (currentTotalSize > MAX_FILE_SIZE) {
        setErrorMsg(t({
          es: 'El tamaño total acumulado excede el límite de 2GB.',
          en: 'The cumulative total size exceeds the 2GB limit.',
          de: 'Die kumulierte Gesamtgröße überschreitet das Limit von 2GB.',
          ru: 'Совокупный общий размер превышает лимит в 2 ГБ.',
          ja: '累積された合計サイズが2GBの制限を超えています。',
          uk: 'Сукупний загальний розмір перевищує ліміт у 2 ГБ.',
          zh: '累计总大小超过了 2GB 的限制。'
        }));
        return [];
      }

      validFiles.push(file);
    }

    setErrorMsg(null);
    return validFiles;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isLocked) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validated = validateFiles(droppedFiles);
      if (validated.length > 0) {
        setFilesList(prev => [...prev, ...validated]);
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      const validated = validateFiles(selectedFiles);
      if (validated.length > 0) {
        setFilesList(prev => [...prev, ...validated]);
      }
    }
  };

  const removeFile = (index) => {
    if (isLocked) return;
    setFilesList(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    if (isLocked) return;
    fileInputRef.current.click();
  };

  const uploadFiles = async () => {
    if (filesList.length === 0 || isLocked) return;
    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    filesList.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:4000/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFilesList([]);
        if (onUploadSuccess) onUploadSuccess(data.files);
        alert(t({
          es: '🎉 ¡Archivos subidos y validados con éxito!',
          en: '🎉 Files uploaded and validated successfully!',
          de: '🎉 Dateien erfolgreich hochgeladen und validiert!',
          ru: '🎉 Файлы успешно загружены и проверены!',
          ja: '🎉 ファイルのアップロードと検証が成功しました！',
          uk: '🎉 Файли успішно завантажено та перевірено!',
          zh: '🎉 文件上传并验证成功！'
        }));
      } else {
        setErrorMsg(data.error || t({
          es: 'Error en el servidor al subir archivos',
          en: 'Server error while uploading files',
          de: 'Serverfehler beim Hochladen von Dateien',
          ru: 'Ошибка сервера при загрузке файлов',
          ja: 'ファイルのアップロード中にサーバーエラーが発生しました',
          uk: 'Помилка сервера під час завантаження файлів',
          zh: '上传文件时 occur 服务器错误'
        }));
      }
    } catch (err) {
      setErrorMsg(t({
        es: 'Error de red al conectar con el servidor Express',
        en: 'Network error connecting to Express server',
        de: 'Netzwerkfehler beim Verbinden mit dem Express-Server',
        ru: 'Сетевая ошибка при подключении к серверу Express',
        ja: 'Expressサーバーへの接続中にネットワークエラーが発生しました',
        uk: 'Помилка мережі при підключенні до сервера Express',
        zh: '连接到 Express 服务器时发生网络错误'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      {/* Upload Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md ${
          dragActive 
            ? 'border-primary-fixed bg-primary-fixed/5 scale-[1.01]' 
            : 'border-white/10 bg-surface-container-low/30 hover:border-primary-fixed/50 hover:bg-surface-container-high/20'
        } ${isLocked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          accept=".mp3,.wav,.flac,.ogg,.aiff,.aif"
          onChange={handleFileInputChange}
          className="hidden" 
        />
        
        <div className="w-16 h-16 rounded-full bg-surface-container-high/60 border border-white/5 flex items-center justify-center text-primary-fixed mb-4 shadow-sm">
          <Upload className="w-8 h-8" />
        </div>
        
        <p className="text-on-background text-sm font-medium text-center mb-1">
          {t({
            es: 'Arrastra tu música aquí o haz clic para explorar',
            en: 'Drag your music here or click to browse',
            de: 'Ziehen Sie Ihre Musik hierher oder klicken Sie zum Durchsuchen',
            ru: 'Перетащите музыку сюда или нажмите для выбора',
            ja: 'ここに音楽をドラッグするか、クリックしてブラウズします',
            uk: 'Перетягніть музику сюди або натисніть для вибору',
            zh: '将您的音乐拖到此处或点击浏览'
          })}
        </p>
        <p className="text-on-surface-variant text-[11px] font-mono-data uppercase tracking-widest text-center opacity-70">
          {t({
            es: 'Formatos: MP3, WAV, FLAC, OGG, AIFF (Máx. 2GB)',
            en: 'Formats: MP3, WAV, FLAC, OGG, AIFF (Max. 2GB)',
            de: 'Formate: MP3, WAV, FLAC, OGG, AIFF (Max. 2GB)',
            ru: 'Форматы: MP3, WAV, FLAC, OGG, AIFF (Макс. 2 ГБ)',
            ja: 'フォーマット: MP3, WAV, FLAC, OGG, AIFF (最大2GB)',
            uk: 'Формати: MP3, WAV, FLAC, OGG, AIFF (Макс. 2 ГБ)',
            zh: '格式: MP3, WAV, FLAC, OGG, AIFF (最大 2GB)'
          })}
        </p>
      </div>
 
      {/* Error Alert Box */}
      {errorMsg && (
        <div className="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded-xl mt-4 flex items-center gap-3 text-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
 
      {/* Uploading Status Overlay */}
      {isUploading && (
        <div className="bg-primary-fixed/5 border border-primary-fixed/20 text-primary-fixed px-4 py-3 rounded-xl mt-4 flex items-center gap-3 text-sm animate-pulse">
          <span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span>
          <span>{t({
            es: 'Analizando y encriptando música en el servidor... Por favor espera.',
            en: 'Analyzing and encrypting music on the server... Please wait.',
            de: 'Musik auf dem Server analysieren und verschlüsseln... Bitte warten.',
            ru: 'Анализ и шифрование музыки на сервере... Пожалуйста, подождите.',
            ja: 'サーバー上の音楽の分析と暗号化中... お待ちください。',
            uk: 'Аналіз та шифрування музики на сервері... Будь ласка, зачекайте.',
            zh: '正在服务器上分析和加密音乐... 请稍候。'
          })}</span>
        </div>
      )}
 
      {/* Queued Files List */}
      {filesList.length > 0 && (
        <div className="mt-6 glass-panel rounded-2xl p-6 border-white/5 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
            <h4 className="text-sm font-medium text-on-background">
              {t({
                es: 'Archivos listos para procesar',
                en: 'Files ready to process',
                de: 'Dateien bereit zur Verarbeitung',
                ru: 'Файлы готовы к обработке',
                ja: '処理準備完了のファイル',
                uk: 'Файли готові до обробки',
                zh: '准备处理的文件'
              })} ({filesList.length})
            </h4>
            <span className="text-xs font-mono-data text-primary-fixed">
              {(filesList.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
 
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filesList.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center bg-surface-container-high/30 border border-white/5 p-3 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <FileAudio className="w-5 h-5 text-primary-fixed shrink-0" />
                  <div className="truncate">
                    <p className="text-xs text-on-background font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono-data">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-2 hover:bg-error/10 hover:text-error text-on-surface-variant rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
 
          <button 
            onClick={uploadFiles}
            disabled={isUploading}
            className="w-full bg-primary-fixed hover:bg-primary-fixed/90 text-background py-3 rounded-xl font-medium mt-6 transition-colors shadow-[0_0_20px_rgba(195,244,0,0.2)] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t({
              es: 'Subir y Procesar Música',
              en: 'Upload and Process Music',
              de: 'Musik hochladen und verarbeiten',
              ru: 'Загрузить и обработать музыку',
              ja: '音楽をアップロードして処理',
              uk: 'Завантажити та обробити музику',
              zh: '上传并处理音乐'
            })}</span>
          </button>
        </div>
      )}
    </div>
  );
}
