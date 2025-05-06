export default function ScoreBoard({ score }) {
    return (
      <div className="mt-auto text-xl">
        {/* Display current score */}
        Score: <span className="font-semibold">{score}</span>
      </div>
    );
  }
  