export default function QuizFooter({
  score,
  isChecked,
  allAnswered,
  onCheck,
  onRestart
}) {
  return (
    <div className="quiz-footer">
      <span>Score: {score}</span>

      {!isChecked && allAnswered && (
        <button onClick={onCheck}>Check answers</button>
      )}

      {isChecked && (
        <button onClick={onRestart}>Restart Game</button>
      )}
    </div>
  );
}
