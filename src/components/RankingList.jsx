export default function RankingList({ rankings, onRestart }) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center">
        {/* Apply Caveat font to the title */}
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 caveat-1">
          🏆 Score Rankings
        </h2>
  
        {/* Ranking list */}
        <ol className="w-full max-w-md space-y-2 mb-6">
          {rankings.map((item, idx) => {
            // Set background color for top 3
            let bgClass = 'bg-white dark:bg-gray-800';
            if (idx === 0) bgClass = 'bg-yellow-200 dark:bg-yellow-800';  // Gold
            else if (idx === 1) bgClass = 'bg-gray-200 dark:bg-gray-700'; // Silver
            else if (idx === 2) bgClass = 'bg-orange-200 dark:bg-orange-700'; // Bronze
  
            return (
              <li
                key={idx}
                className={`${bgClass} flex justify-between shadow p-3 rounded-lg`}
              >
                {/* Display rank and score */}
                <span className="text-gray-900 dark:text-gray-100">
                  {idx + 1}. Score: <strong>{item.score}</strong>
                </span>
                {/* Display date */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleString()}
                </span>
              </li>
            );
          })}
        </ol>
  
        {/* Play Again button */}
        <button
          onClick={onRestart}
          className="mt-auto py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          Play Again
        </button>
      </div>
    );
  }
  