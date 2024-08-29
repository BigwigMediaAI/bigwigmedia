import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard, Share2, Download } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';

interface TriviaQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
}

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const languages = [
  "English",
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chichewa",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Corsican",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Frisian",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Kinyarwanda",
  "Korean",
  "Kurdish (Kurmanji)",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Odia (Oriya)",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Turkish",
  "Turkmen",
  "Ukrainian",
  "Urdu",
  "Uyghur",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu"
]
;

export function TriviaGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [numberOfAnswers, setNumberOfAnswers] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(difficultyLevels[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triviaQuestions.length) {
      setButtonText('Generate');
    } else {
      setButtonText('Regenerate');
    }
  }, [triviaQuestions]);

  const handleGenerate = async () => {
    if (
      !validateInput(topic)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setTriviaQuestions([]);
    setCurrentQuestionIndex(0);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/trivia?clerkId=${userId}`, {
        topic,
        numberOfQuestions: parseInt(numberOfQuestions),
        numberOfAnswers: parseInt(numberOfAnswers),
        difficultyLevel,
        language
      });

      if (response.status === 200) {
        setTriviaQuestions(response.data.script);
      } else {
        toast.error('Error generating trivia questions. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating trivia questions:', error);
      toast.error('Error generating trivia questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const formattedTrivia = triviaQuestions.map((question: TriviaQuestion) => {
      const formattedOptions = question.answers.map((option, index) => {
        return `${String.fromCharCode(97 + index)}. ${option}`;
      }).join('\n');

      return `${question.question}\n${formattedOptions}\nCorrect Answer: ${question.correctAnswer}\n`;
    });

    navigator.clipboard.writeText(formattedTrivia.join('\n'));
    toast.success('Trivia questions copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      const formattedTrivia = triviaQuestions.map((question: TriviaQuestion) => {
        const formattedOptions = question.answers.map((option, index) => {
          return `${String.fromCharCode(97 + index)}. ${option}`;
        }).join('\n');

        return `${question.question}\n${formattedOptions}\nCorrect Answer: ${question.correctAnswer}\n`;
      }).join('\n');

      navigator.share({
        title: 'Trivia Questions',
        text: formattedTrivia,
      }).then(() => {
        toast.success('Trivia questions shared successfully!');
      }).catch((error) => {
        console.error('Error sharing trivia questions:', error);
        toast.error('Error sharing trivia questions. Please try again later.');
      });
    } else {
      toast.error('Sharing is not supported in this browser.');
    }
  };

  const handleDownload = () => {
    const formattedTrivia = triviaQuestions.map((question: TriviaQuestion) => {
      const formattedOptions = question.answers.map((option, index) => {
        return `${String.fromCharCode(97 + index)}. ${option}`;
      }).join('\n');

      return `${question.question}\n${formattedOptions}\nCorrect Answer: ${question.correctAnswer}\n`;
    }).join('\n\n');

    const blob = new Blob([formattedTrivia], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trivia_questions.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Trivia questions downloaded!');
  };

  const handleInputChange = () => {
    setTriviaQuestions([]);
    setButtonText('Generate');
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < triviaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    if (!isLoading && triviaQuestions.length) {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, triviaQuestions]);

  const currentQuestion = triviaQuestions[currentQuestionIndex];

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); handleInputChange(); }}
          placeholder="Enter the topic of trivia"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Number of Questions</label>
        <input
          type="number"
          value={numberOfQuestions}
          onChange={(e) => { setNumberOfQuestions(e.target.value); handleInputChange(); }}
          placeholder="Enter the number of questions"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Number of Answers</label>
        <input
          type="number"
          value={numberOfAnswers}
          onChange={(e) => { setNumberOfAnswers(e.target.value); handleInputChange(); }}
          placeholder="Enter the number of answer choices per question"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Difficulty Level</label>
        <select
          value={difficultyLevel}
          onChange={(e) => { setDifficultyLevel(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        >
          {difficultyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleGenerate : handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : buttonText}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          triviaQuestions.length > 0 && (
            <div className="border border-[var(--primary-text-color)] rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-[var(--primary-text-color)] mb-4 underline">Generated Trivia Questions:</h2>
                {currentQuestion && (
                  <>
                    <p className="text-lg text-[var(--primary-text-color)]">{currentQuestion.question}</p>
                    <ul className="mt-4">
                      {currentQuestion.answers.map((answer, index) => (
                        <li key={index} className="text-[var(--primary-text-color)]">
                          {String.fromCharCode(97 + index)}. {answer}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 mt-2">Correct Answer: {currentQuestion.correctAnswer}</p>
                  </>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === triviaQuestions.length - 1}
                  >
                    Next
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleCopy}
                 title='Copy' >
                    <Clipboard className="w-5 h-5" />
                  </button>
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleShare}
                  title='Share'>
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleDownload}
                  title='Download'>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
