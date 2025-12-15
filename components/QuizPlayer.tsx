import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Flag } from 'lucide-react';

interface QuizPlayerProps {
  questions: Question[];
  timeLimit?: number; // in seconds, if null/0 then no limit
  onSubmit: (answers: Record<string, string>, timeUsed: number) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, timeLimit, onSubmit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit || null);
  const [timeUsed, setTimeUsed] = useState(0);

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUsed(prev => prev + 1);
      if (timeLeft !== null) {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers, timeUsed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick navigation grid
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-start">
      
      {/* Main Question Area */}
      <div className="flex-1 w-full order-2 lg:order-1">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
          
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-10">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Câu hỏi {currentIdx + 1}/{questions.length}</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 w-32">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            {timeLeft !== null && (
               <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
                 <Clock size={18} />
                 {formatTime(timeLeft)}
               </div>
            )}
          </div>

          {/* Question Text */}
          <div className="p-8 flex-1">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="mt-8 space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                const labels = ['A', 'B', 'C', 'D'];
                
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`
                      group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors
                      ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-200 group-hover:text-indigo-700'}
                    `}>
                      {labels[idx] || idx + 1}
                    </div>
                    <span className={`text-lg ${isSelected ? 'font-medium text-indigo-900' : 'text-gray-700'}`}>
                      {option}
                    </span>
                    {isSelected && <CheckCircle2 className="ml-auto text-indigo-600" size={24} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <button 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              <ChevronLeft size={20} /> Trước
            </button>

            {isLastQuestion ? (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-bold"
              >
                NỘP BÀI
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-bold"
              >
                Tiếp theo <ChevronRight size={20} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Sidebar / Mobile Drawer for Navigation */}
      <div className="w-full lg:w-80 order-1 lg:order-2 shrink-0">
        <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Danh sách câu hỏi</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">{Object.keys(answers).length}/{questions.length} đã làm</span>
          </div>
          
          <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, idx) => {
              const answered = !!answers[q.id];
              const current = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    h-10 rounded-lg text-sm font-medium transition-all
                    ${current ? 'ring-2 ring-indigo-600 ring-offset-2 border-transparent' : ''}
                    ${answered 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full mt-6 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Nộp bài ngay
          </button>
        </div>
      </div>

    </div>
  );
};