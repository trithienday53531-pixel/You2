import React, { useState } from 'react';
import { QuizConfig as IQuizConfig, Question } from '../types';
import { Settings, Play, Clock, Shuffle } from 'lucide-react';

interface QuizConfigProps {
  questionsCount: number;
  fileName?: string;
  onStart: (config: IQuizConfig) => void;
}

export const QuizConfig: React.FC<QuizConfigProps> = ({ questionsCount, fileName, onStart }) => {
  const [config, setConfig] = useState<IQuizConfig>({
    shuffleQuestions: true,
    shuffleOptions: true,
    enableTimer: false,
    timeMinutes: 15
  });

  const handleStart = () => {
    onStart(config);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-indigo-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Settings className="w-6 h-6" /> Thiết Lập Bài Kiểm Tra
        </h2>
        {fileName && <p className="text-indigo-200 text-sm mt-1 truncate max-w-md mx-auto">{fileName}</p>}
        <div className="mt-4 inline-block bg-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
          Đã tìm thấy {questionsCount} câu hỏi
        </div>
      </div>

      <div className="p-8 space-y-6">
        
        {/* Shuffle Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cấu hình trộn đề</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setConfig(p => ({...p, shuffleQuestions: !p.shuffleQuestions}))}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.shuffleQuestions ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                <Shuffle size={20} />
              </div>
              <span className="font-medium text-gray-700">Xáo trộn thứ tự câu hỏi</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.shuffleQuestions ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
              {config.shuffleQuestions && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setConfig(p => ({...p, shuffleOptions: !p.shuffleOptions}))}>
             <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.shuffleOptions ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                <Shuffle size={20} className="transform rotate-90" />
              </div>
              <span className="font-medium text-gray-700">Xáo trộn đáp án (A,B,C,D)</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.shuffleOptions ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
              {config.shuffleOptions && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
          </div>
        </div>

        {/* Timer Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Thời gian</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
             <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.enableTimer ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
                <Clock size={20} />
              </div>
              <span className="font-medium text-gray-700">Giới hạn thời gian</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={config.enableTimer} onChange={(e) => setConfig(p => ({...p, enableTimer: e.target.checked}))} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.enableTimer && (
            <div className="ml-4 animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian làm bài (phút)</label>
              <input 
                type="number" 
                min="1" 
                max="180" 
                value={config.timeMinutes}
                onChange={(e) => setConfig(p => ({...p, timeMinutes: parseInt(e.target.value) || 1}))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-lg"
              />
            </div>
          )}
        </div>

        <button 
          onClick={handleStart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Play fill="currentColor" size={20} /> BẮT ĐẦU LÀM BÀI
        </button>

      </div>
    </div>
  );
};