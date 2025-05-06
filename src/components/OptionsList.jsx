export default function OptionsList({
    options,
    onSelect,
    selected,
    correctAnswer
  }) {
    // Common base classes for all buttons
    const baseClasses = 'py-2 px-4 rounded-lg transition disabled:opacity-50';
  
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {options.map(opt => {
          let btnClass = '';
  
          if (!selected) {
            // Before selection: normal blue buttons
            btnClass = `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white`;
          } else {
            // After selection
            if (opt.name === selected) {
              // The clicked button: green if correct, red if wrong
              btnClass = `${baseClasses} ${
                opt.name === correctAnswer ? 'bg-green-500' : 'bg-red-500'
              } text-white`;
            } else if (opt.name === correctAnswer) {
              // Highlight the correct answer when wrong was picked
              btnClass = `${baseClasses} bg-green-100 dark:bg-green-900 text-gray-900 dark:text-gray-100 ring-2 ring-green-500`;
            } else {
              // Other unselected options: muted
              btnClass = `${baseClasses} bg-gray-300 dark:bg-gray-700 text-gray-500`;
            }
          }
  
          return (
            <button
              key={opt.name}
              onClick={() => onSelect(opt.name)}
              className={btnClass}
              disabled={!!selected}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    );
  }
  