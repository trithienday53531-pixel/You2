import React, { useRef, useState } from 'react';
import { FileType } from '../types';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileProcess: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validTypes = [FileType.TXT, FileType.PDF, FileType.DOCX, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!validTypes.includes(file.type as FileType) && !file.name.endsWith('.docx')) {
      setError("Định dạng file không hỗ trợ. Vui lòng tải lên .pdf, .docx, hoặc .txt");
      return;
    }

    setError(null);
    onFileProcess(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-50 scale-102' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50 bg-white'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${isLoading ? 'bg-indigo-100' : 'bg-gray-100 group-hover:bg-indigo-100'}`}>
            {isLoading ? (
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-gray-500 group-hover:text-indigo-600 transition-colors" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'A.I Đang Phân Tích...' : 'Tải lên tài liệu của bạn'}
            </h3>
            <p className="text-sm text-gray-500">
              Kéo thả hoặc click để chọn file (.docx, .pdf, .txt)
            </p>
          </div>

          {!isLoading && (
            <div className="flex gap-2 text-xs text-gray-400 mt-4">
              <span className="flex items-center"><FileText size={14} className="mr-1"/> Word</span>
              <span className="flex items-center"><FileText size={14} className="mr-1"/> PDF</span>
              <span className="flex items-center"><FileText size={14} className="mr-1"/> Text</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 animate-fade-in">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-6 text-center">
          <p className="text-indigo-600 font-medium animate-pulse">
            Hệ thống đang đọc và tạo bộ câu hỏi chuẩn xác...
          </p>
        </div>
      )}
    </div>
  );
};