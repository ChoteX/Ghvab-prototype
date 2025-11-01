
import React, { useState, useCallback } from 'react';
import { generateTestSamples } from './services/geminiService';
import LatexInput from './components/LatexInput';
import LatexOutput from './components/LatexOutput';
import Button from './components/Button';
import Loader from './components/Loader';

const DEFAULT_LATEX_SAMPLE = `\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}

\\title{მათემატიკის ტესტი}
\\author{სკოლა}
\\date{\\today}

\\begin{document}

\\maketitle

\\section*{ამოცანები}

\\begin{enumerate}
    \\item იპოვეთ \\(x\\) თუ \\(2x + 5 = 15\\).
    \\item გამოთვალეთ სამკუთხედის ფართობი, რომლის ფუძეა 10 სმ და სიმაღლე 5 სმ.
    \\item რა არის \\( \\sqrt{144} \\)?
\\end{enumerate}

\\end{document}`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>(DEFAULT_LATEX_SAMPLE);
  const [outputText, setOutputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setOutputText('');

    try {
      const result = await generateTestSamples(inputText);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setOutputText(result);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate test: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Georgian Math Test Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Generate 10 new LaTeX math problems based on your existing test script.
          </p>
        </header>

        <main className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
          <LatexInput
            value={inputText}
            onChange={setInputText}
            placeholder={DEFAULT_LATEX_SAMPLE}
          />
          
          <div className="mt-6 text-center">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader />
                  <span className="ml-2">Generating...</span>
                </div>
              ) : (
                'Generate New Test'
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-center">
              {error}
            </div>
          )}

          {(outputText || isLoading) && (
             <div className="mt-8">
                {isLoading && !outputText ? (
                    <div className="w-full h-96 p-4 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <Loader />
                            <p className="mt-4 text-gray-400">Generating your new LaTeX script...</p>
                            <p className="text-sm text-gray-500">This might take a moment.</p>
                        </div>
                    </div>
                ) : (
                    <LatexOutput latexScript={outputText} />
                )}
             </div>
          )}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini API. Ensure your input is valid LaTeX for best results.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
