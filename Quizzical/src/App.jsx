import { useState } from 'react'
import './App.css'
import { fetchTriviaQuestions } from "./TrviaFetch"
import { v4 as uuidv4 } from "uuid"
import { decode } from "html-entities";

function App() {
  const [startScreen, setStartScreen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [chosenAnswers, setChosenAnswers] = useState({}) // { [questionId]: answer }
  const [score, setScore] = useState(0)
  const [isChecked, setIsChecked] = useState(false)

  async function loadQuestions() {
    const results = await fetchTriviaQuestions(5)

    const cleanedResults = results.map(q => {
      const decodedCorrect = decode(q.correct_answer)
      const decodedIncorrect = q.incorrect_answers.map(ans => decode(ans))

      const shuffledAnswers = [decodedCorrect, ...decodedIncorrect]
        .sort(() => Math.random() - 0.5)

      return {
        id: uuidv4(),
        question: decode(q.question),
        correct_answer: decodedCorrect,
        incorrect_answers: decodedIncorrect,
        answers: shuffledAnswers
      }
    })

    setQuestions(cleanedResults)
  }

  function toggleStartScreen() {
    setStartScreen(true)
    loadQuestions()
    setChosenAnswers({})
    setScore(0)
    setIsChecked(false)
  }

  function handleAnswerClick(questionId, answer) {
    // only choose before checking
    if (isChecked) return

    setChosenAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  function checkAnswers() {
    let newScore = 0

    questions.forEach(q => {
      const chosen = chosenAnswers[q.id]
      if (chosen === q.correct_answer) {
        newScore++
      }
    })

    setScore(newScore)
    setIsChecked(true)
  }

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
            // BEFORE "Check answers": just grey out chosen answer
            if (isChosen) {
              bg = { opacity: 0.5 }
            }
          } else {
            // AFTER "Check answers": red/green logic
            if (isCorrect) {
              bg = {
                backgroundColor: "green",
                opacity: 0.5
              }
            } else if (isChosen && !isCorrect) {
              bg = {
                backgroundColor: "red",
                opacity: 0.5
              }
            } else {
              bg = {
                opacity: 0.5
              }
            }
          }

          return (
            <button
              key={answer}
              onClick={() => handleAnswerClick(question.id, answer)}
              style={bg}
              disabled={!!chosen || isChecked} // lock in once chosen or checked
            >
              {answer}
            </button>
          )
        })}
      </article>
    )
  })

  const allAnswered = Object.keys(chosenAnswers).length === questions.length

  return (
    <main>
      {!startScreen && (
        <section className='start-screen'>
          <h1>Quizzical</h1>
          <p>The ultimate trivia game!</p>
          <button onClick={toggleStartScreen}>Start quiz</button>
        </section>
      )}

      {startScreen && (
        <section className='quizz-screen'>
          {quizzElements}
        </section>
      )}

      {startScreen && (
        <>
          <span>Score: {score}</span>

          {/* Show "Check answers" when all answered and not yet checked */}
          {allAnswered && !isChecked && (
            <button onClick={checkAnswers}>Check answers</button>
          )}

          {/* After checking, allow restart */}
          {isChecked && (
            <button onClick={toggleStartScreen}>Restart Game</button>
          )}
        </>
      )}
    </main>
  )
}

export default App
