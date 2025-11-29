export default function QuizFooter({
  score,
  isChecked,
  allAnswered,
  onCheck,
  onRestart
}) {
  return (
    <div className="quiz-footer">
     {isChecked && <span>You scored {score}/5 correct answers</span>}

      {!isChecked && allAnswered && (
        <button onClick={onCheck}>Check answers</button>
      )}

      {isChecked && (
        <button onClick={onRestart}>Play Again</button>
      )}
    </div>
  );
}
