import React, { useState, useEffect, useRef } from 'react';
import FlagDisplay    from './components/FlagDisplay';
import OptionsList    from './components/OptionsList';
import ScoreBoard     from './components/ScoreBoard';
import RankingList    from './components/RankingList';

const TOTAL_QUESTIONS = 30;

export default function App() {
  const [countries, setCountries]       = useState([]);
  const [current, setCurrent]           = useState(null);
  const [options, setOptions]           = useState([]);
  const [score, setScore]               = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameEnded, setGameEnded]       = useState(false);
  const [rankings, setRankings]         = useState([]);
  const [darkMode, setDarkMode]         = useState(false);

  // Track user's selected answer
  const [selected, setSelected] = useState(null);

  // Audio refs for sound effects
  const correctSound = useRef(null);
  const wrongSound   = useRef(null);

  // Load dark mode preference and saved rankings
  useEffect(() => {
    const storedDark = localStorage.getItem('dq-darkmode') === 'true';
    if (storedDark) {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(storedDark);

    const storedRanks = JSON.parse(localStorage.getItem('flagQuizRanking') || '[]');
    setRankings(storedRanks);
  }, []);

  // Preload audio files
  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    wrongSound.current   = new Audio('/sounds/wrong.mp3');
  }, []);

  // Fetch country data once on mount
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const list = data.map(c => ({
          name: c.name.common,
          flag: c.flags.svg
        }));
        setCountries(list);
        generateQuestion(list);
      })
      .catch(console.error);
  }, []);

  // Toggle dark mode on/off
  const toggleDarkMode = () => {
    setDarkMode(dm => {
      const next = !dm;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('dq-darkmode', next);
      return next;
    });
  };

  // Generate a new quiz question
  const generateQuestion = pool => {
    const pick4 = [...pool]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    const answer = pick4[Math.floor(Math.random() * pick4.length)];
    setOptions(pick4);
    setCurrent(answer);
  };

  // Handle answer selection
  const handleAnswer = name => {
    if (selected) return; // ignore if already selected

    const correct = current && name === current.name;
    setSelected(name);

    if (correct) {
      // reset and play correct sound from start
      correctSound.current.pause();
      correctSound.current.currentTime = 0;
      correctSound.current.play();
      setScore(s => s + 1);
    } else {
      // reset and play wrong sound from start
      wrongSound.current.pause();
      wrongSound.current.currentTime = 0;
      wrongSound.current.play();
    }

    // Wait 1 second, then proceed or end
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL_QUESTIONS) {
        endGame();
      } else {
        setCurrentIndex(i => i + 1);
        generateQuestion(countries);
        setSelected(null);
      }
    }, 1000);
  };

  // End game and update rankings
  const endGame = () => {
    const date     = new Date().toISOString();
    const newEntry = { score, date };
    const updated  = [newEntry, ...rankings]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    localStorage.setItem('flagQuizRanking', JSON.stringify(updated));
    setRankings(updated);
    setGameEnded(true);
  };

  // Restart the game
  const restartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setGameEnded(false);
    generateQuestion(countries);
    setSelected(null);
  };

  // Show loading screen if data not ready
  if (!current) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-900 dark:text-gray-100">Loading…</p>
      </div>
    );
  }

  // Show ranking when game ends
  if (gameEnded) {
    return (
      <RankingList
        rankings={rankings}
        onRestart={restartGame}
      />
    );
  }

  // Main game UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="self-end mb-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-full transition"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>

      {/* Title with Caveat font */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 caveat-1">
        🌐 Flag Quiz
      </h1>

      {/* Progress indicator */}
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Question {currentIndex + 1} / {TOTAL_QUESTIONS}
      </p>

      <FlagDisplay flag={current.flag} />
      <OptionsList
        options={options}
        onSelect={handleAnswer}
        selected={selected}
        correctAnswer={current.name}
      />
      <ScoreBoard score={score} />
    </div>
  );
}
