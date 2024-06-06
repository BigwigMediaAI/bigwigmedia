import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

interface TriviaQuestion {
  question: string;
  answers: string[];
  correctAnswer: string;
}

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

export function TriviaGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [numberOfAnswers, setNumberOfAnswers] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(difficultyLevels[0]);
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
        difficultyLevel
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
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); handleInputChange(); }}
          placeholder="Enter the topic of trivia"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Number of Questions</label>
        <input
          type="number"
          value={numberOfQuestions}
          onChange={(e) => { setNumberOfQuestions(e.target.value); handleInputChange(); }}
          placeholder="Enter the number of questions"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Number of Answers</label>
        <input
          type="number"
          value={numberOfAnswers}
          onChange={(e) => { setNumberOfAnswers(e.target.value); handleInputChange(); }}
          placeholder="Enter the number of answer choices per question"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Difficulty Level</label>
        <select
          value={difficultyLevel}
          onChange={(e) => { setDifficultyLevel(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        >
          {difficultyLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleGenerate : handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : buttonText}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          triviaQuestions.length > 0 && (
            <div className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Trivia Questions:</h2>
                {currentQuestion && (
                  <>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{currentQuestion.question}</p>
                    <ul className="mt-4">
                      {currentQuestion.answers.map((answer, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {String.fromCharCode(97 + index)}. {answer}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Correct Answer: {currentQuestion.correctAnswer}</p>
                  </>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
                    onClick={handleNext}
                    disabled={currentQuestionIndex === triviaQuestions.length - 1}
                  >
                    Next
                  </button>
                </div>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCopy}
                >
                  <Clipboard className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}