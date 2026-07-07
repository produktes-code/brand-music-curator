import { useState, useRef } from 'react';
import { Upload, FileAudio, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
const ALLOWED_MIME_TYPES = ['audio/mpeg',
// MP3
'audio/mp3',
// MP3 alternative
'audio/wav',
// WAV
'audio/x-wav',
// WAV alternative
'audio/flac',
// FLAC
'audio/x-flac',
// FLAC alternative
'audio/ogg',
// OGG
'audio/x-ogg',
// OGG alternative
'audio/aiff',
// AIFF
'audio/x-aiff' // AIFF alternative
];
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export default function MusicUpload({
  onUploadSuccess,
  isLocked,
  t = s => typeof s === 'string' ? s : s['en'] || s['es'] || ''
}) {
  const [dragActive, setDragActive] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const validateFiles = files => {
    const validFiles = [];
    let currentTotalSize = filesList.reduce((acc, f) => acc + f.size, 0);
    for (let file of files) {
      // 1. MIME Validation
      if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|ogg|aiff|aif)$/i)) {
        setErrorMsg(t("auto.unsupported_file_format_allowe").replace('{}', file.name));
        return [];
      }

      // 2. Individual File Size Validation
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(t("auto.the_file_exceeds_the_2gb_limit").replace('{}', file.name));
        return [];
      }

      // 3. Total Request Size Validation
      currentTotalSize += file.size;
      if (currentTotalSize > MAX_FILE_SIZE) {
        setErrorMsg(t("auto.the_cumulative_total_size_exce"));
        return [];
      }
      validFiles.push(file);
    }
    setErrorMsg(null);
    return validFiles;
  };
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = e => {
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
  const handleFileInputChange = e => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      const validated = validateFiles(selectedFiles);
      if (validated.length > 0) {
        setFilesList(prev => [...prev, ...validated]);
      }
    }
  };
  const removeFile = index => {
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
    filesList.forEach(file => {
      formData.append('files', file);
    });
    try {
      const response = await fetch('http://localhost:4000/api/audio/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFilesList([]);
        if (onUploadSuccess) onUploadSuccess(data.files);
        alert(t("auto.files_uploaded_and_validated"));
      } else {
        setErrorMsg(data.error || t("auto.server_error_while_uploading_f"));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(t("auto.network_error_connecting_to_ex"));
    } finally {
      setIsUploading(false);
    }
  };
  return <div className="w-full max-w-2xl mx-auto mt-6">
      {/* Upload Drag & Drop Area */}
      <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onClick={triggerFileSelect} className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md ${dragActive ? 'border-primary-fixed bg-primary-fixed/5 scale-[1.01]' : 'border-white/10 bg-surface-container-low/30 hover:border-primary-fixed/50 hover:bg-surface-container-high/20'} ${isLocked ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
        <input ref={fileInputRef} type="file" multiple accept=".mp3,.wav,.flac,.ogg,.aiff,.aif" onChange={handleFileInputChange} className="hidden" />
        
        <div className="w-16 h-16 rounded-full bg-surface-container-high/60 border border-white/5 flex items-center justify-center text-primary-fixed mb-4 shadow-sm">
          <Upload className="w-8 h-8" />
        </div>
        
        <p className="text-on-background text-sm font-medium text-center mb-1">
          {t("upload.dropzone")}
        </p>
        <p className="text-on-surface-variant text-[11px] font-mono-data uppercase tracking-widest text-center opacity-70">
          {t("upload.formats")}
        </p>
      </div>
 
      {/* Error Alert Box */}
      {errorMsg && <div className="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded-xl mt-4 flex items-center gap-3 text-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>}
 
      {/* Uploading Status Overlay */}
      {isUploading && <div className="bg-primary-fixed/5 border border-primary-fixed/20 text-primary-fixed px-4 py-3 rounded-xl mt-4 flex items-center gap-3 text-sm animate-pulse">
          <span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span>
          <span>{t("upload.analyzing")}</span>
        </div>}
 
      {/* Queued Files List */}
      {filesList.length > 0 && <div className="mt-6 glass-panel rounded-2xl p-6 border-white/5 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
            <h4 className="text-sm font-medium text-on-background">
              {t("auto.files_ready_to_process")} ({filesList.length})
            </h4>
            <span className="text-xs font-mono-data text-primary-fixed">
              {(filesList.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB
            </span>
          </div>
 
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filesList.map((file, idx) => <div key={idx} className="flex justify-between items-center bg-surface-container-high/30 border border-white/5 p-3 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <FileAudio className="w-5 h-5 text-primary-fixed shrink-0" />
                  <div className="truncate">
                    <p className="text-xs text-on-background font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono-data">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <button onClick={e => {
            e.stopPropagation();
            removeFile(idx);
          }} className="p-2 hover:bg-error/10 hover:text-error text-on-surface-variant rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>)}
          </div>
 
          <button onClick={uploadFiles} disabled={isUploading} className="w-full bg-primary-fixed hover:bg-primary-fixed/90 text-background py-3 rounded-xl font-medium mt-6 transition-colors shadow-[0_0_20px_rgba(195,244,0,0.2)] flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{t("upload.button")}</span>
          </button>
        </div>}
    </div>;
}