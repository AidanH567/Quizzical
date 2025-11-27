function QuizzElements({questions, chosenAnswers, isChecked, handleAnswerClick}) {

  const quizzElements = questions.map((question) => {
    const chosen = chosenAnswers[question.id]

    return (
      <article className='question-single' key={question.id}>
        <h2>{question.question}</h2>

        {question.answers.map((answer) => {
          const isCorrect = answer === question.correct_answer
          const isChosen = answer === chosen

          let bg = {}

          if (!isChecked) {
            if (isChosen) bg = { opacity: 0.5 }
          } else {
            if (isCorrect) {
              bg = { backgroundColor: "green", opacity: 0.5 }
            } else if (isChosen && !isCorrect) {
              bg = { backgroundColor: "red", opacity: 0.5 }
            } else {
              bg = { opacity: 0.5 }
            }
          }

          return (
            <button
              key={answer}
              onClick={() => handleAnswerClick(question.id, answer)}
              style={bg}
              disabled={!!chosen || isChecked}
            >
              {answer}
            </button>
          )
        })}
      </article>
    )
  })

  return quizzElements
}
  export default QuizzElements