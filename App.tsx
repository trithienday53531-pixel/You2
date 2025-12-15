import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizConfig as QuizConfigComponent } from './components/QuizConfig';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizResult } from './components/QuizResult';
import { readFileContent } from './utils/fileParser';
import { generateQuizFromContent } from './services/geminiService';
import { QuizState, QuizConfig, Question } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<QuizState>({
    status: 'upload',
    questions: [],
    userAnswers: {},
    timeRemaining: 0,
    score: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const handleFileProcess = async (file: File) => {
    setLoading(true);
    try {
      const fileContent = await readFileContent(file);
      const generatedQuestions = await generateQuizFromContent(fileContent);
      
      // Assign simple IDs if missing
      const processedQuestions = generatedQuestions.map((q, idx) => ({
        ...q,
        id: q.id || `q_${Date.now()}_${idx}`
      }));

      setAppState(prev => ({
        ...prev,
        status: 'config',
        questions: processedQuestions,
        fileName: file.name
      }));
    } catch (error) {
      alert("Lỗi xử lý file: " + (error as Error).message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    
    let quizQuestions = [...appState.questions];

    // Shuffle questions
    if (quizConfig.shuffleQuestions) {
      quizQuestions.sort(() => Math.random() - 0.5);
    }

    // Shuffle options within questions
    if (quizConfig.shuffleOptions) {
      quizQuestions = quizQuestions.map(q => {
        // Keep track of correct answer string
        const options = [...q.options].sort(() => Math.random() - 0.5);
        return { ...q, options };
      });
    }

    setAppState(prev => ({
      ...prev,
      status: 'playing',
      questions: quizQuestions,
      userAnswers: {}, // reset answers
    }));
  };

  const handleQuizSubmit = (answers: Record<string, string>, timeUsed: number) => {
    setAppState(prev => ({
      ...prev,
      status: 'result',
      userAnswers: answers,
      timeRemaining: timeUsed // abusing this field to store time used
    }));
  };

  const resetQuiz = () => {
    setAppState(prev => ({
      ...prev,
      status: 'config',
      userAnswers: {}
    }));
  };

  const newUpload = () => {
    setAppState({
      status: 'upload',
      questions: [],
      userAnswers: {},
      timeRemaining: 0,
      score: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={newUpload}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              QuizGen AI
            </h1>
          </div>
          {appState.status !== 'upload' && (
             <button onClick={newUpload} className="text-sm font-medium text-gray-500 hover:text-indigo-600">
               Tải file khác
             </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {appState.status === 'upload' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
             <div className="text-center mb-10 max-w-2xl">
               <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                 Biến tài liệu thành bài kiểm tra <br/>
                 <span className="text-indigo-600">chỉ trong 1 giây</span>
               </h2>
               <p className="text-lg text-gray-600">
                 Hỗ trợ PDF, Word, và văn bản thuần. A.I sẽ tự động phân tích và tạo bộ câu hỏi trắc nghiệm hoàn chỉnh cho bạn.
               </p>
             </div>
             <FileUpload onFileProcess={handleFileProcess} isLoading={loading} />
          </div>
        )}

        {appState.status === 'config' && (
          <QuizConfigComponent 
            questionsCount={appState.questions.length} 
            fileName={appState.fileName}
            onStart={startQuiz} 
          />
        )}

        {appState.status === 'playing' && (
          <QuizPlayer 
            questions={appState.questions}
            timeLimit={config?.enableTimer ? config.timeMinutes * 60 : undefined}
            onSubmit={handleQuizSubmit}
          />
        )}

        {appState.status === 'result' && (
          <QuizResult 
            questions={appState.questions}
            userAnswers={appState.userAnswers}
            timeUsed={appState.timeRemaining}
            onRetry={resetQuiz}
            onNewFile={newUpload}
          />
        )}

      </main>

      <footer className="text-center text-gray-400 py-6 text-sm">
        <p>© 2024 QuizGen AI - Powered by Gemini 2.5 Flash</p>
      </footer>

    </div>
  );
};

export default App;