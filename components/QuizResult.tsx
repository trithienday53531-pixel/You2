import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, RefreshCcw, Award, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface QuizResultProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  timeUsed: number;
  onRetry: () => void;
  onNewFile: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({ questions, userAnswers, timeUsed, onRetry, onNewFile }) => {
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / questions.length) * 10);
  const percentage = Math.round((correctCount / questions.length) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getGradeColor = (s: number) => {
    if (s >= 8) return 'text-green-600 bg-green-50';
    if (s >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // State for accordion functionality in review
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
          <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">Kết Quả Bài Làm</h2>
          <p className="opacity-80">Bạn đã hoàn thành bài kiểm tra!</p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 ${score >= 5 ? 'border-green-500' : 'border-red-500'} mx-auto mb-2`}>
                <span className={`text-4xl font-bold ${score >= 5 ? 'text-green-600' : 'text-red-600'}`}>{score}</span>
                <span className="text-gray-400 text-sm font-medium">/ 10 điểm</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
               <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center">
                 <CheckCircle2 className="text-green-600 mb-1" />
                 <span className="text-2xl font-bold text-gray-800">{correctCount}</span>
                 <span className="text-xs text-gray-500 uppercase tracking-wide">Câu đúng</span>
               </div>
               <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center">
                 <XCircle className="text-red-600 mb-1" />
                 <span className="text-2xl font-bold text-gray-800">{questions.length - correctCount}</span>
                 <span className="text-xs text-gray-500 uppercase tracking-wide">Câu sai</span>
               </div>
               <div className="col-span-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center gap-2">
                 <Clock className="text-blue-600 w-5 h-5" />
                 <span className="text-blue-900 font-medium">Thời gian: {formatTime(timeUsed)}</span>
               </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={onRetry}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-2 font-bold transition-transform transform hover:scale-105"
            >
              <RefreshCcw size={20} /> Làm lại bài này
            </button>
            <button 
              onClick={onNewFile}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 font-medium"
            >
              Tạo bài mới
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 ml-2">Chi tiết đáp án</h3>
        
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const isExpanded = expandedId === q.id;

          return (
            <div key={q.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${isCorrect ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
              <div 
                className="p-5 cursor-pointer flex justify-between items-start gap-4 hover:bg-gray-50"
                onClick={() => toggleExpand(q.id)}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 leading-snug">{q.text}</h4>
                    {!isExpanded && (
                      <div className="mt-2 text-sm flex gap-4">
                         <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                           Chọn: {userAnswer || '(Bỏ trống)'}
                         </span>
                         {!isCorrect && (
                           <span className="text-green-600 font-medium">
                             Đúng: {q.correctAnswer}
                           </span>
                         )}
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pl-14 space-y-2 border-t border-gray-100 bg-gray-50/50 pt-4">
                   {q.options.map((opt, i) => {
                     let optStyle = "p-3 rounded-lg border text-sm ";
                     if (opt === q.correctAnswer) {
                       optStyle += "bg-green-100 border-green-200 text-green-800 font-medium";
                     } else if (opt === userAnswer && !isCorrect) {
                       optStyle += "bg-red-100 border-red-200 text-red-800";
                     } else {
                       optStyle += "bg-white border-gray-200 text-gray-600";
                     }
                     
                     return (
                       <div key={i} className={optStyle}>
                         <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
                       </div>
                     )
                   })}
                   {q.explanation && (
                     <div className="mt-3 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
                       <strong>Giải thích:</strong> {q.explanation}
                     </div>
                   )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};