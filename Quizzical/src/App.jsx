import { useState } from 'react'
import './App.css'
import { fetchTriviaQuestions } from "./TrviaFetch"
import { v4 as uuidv4 } from "uuid"
import { decode } from "html-entities";

function App() {
  const [startScreen, setStartScreen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [chosenAnswers, setChosenAnswers] = useState({}) // { [questionId]: answer }

  console.log(questions.length)
  console.log(Object.keys(chosenAnswers).length)

  async function loadQuestions() {
    const results = await fetchTriviaQuestions(5)

    const cleanedResults = results.map(q => {
      const decodedCorrect = decode(q.correct_answer)
      const decodedIncorrect = q.incorrect_answers.map(ans => decode(ans))

      // shuffle ONCE here and store as `answers`
      const shuffledAnswers = [decodedCorrect, ...decodedIncorrect]
        .sort(() => Math.random() - 0.5)

      return {
        id: uuidv4(),              // give each question a stable id
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
  }

  function handleAnswerClick(questionId, answer) {
    setChosenAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const quizzElements = questions.map((question) => {
    const chosen = chosenAnswers[question.id]

    return (
      <article className='question-single' key={question.id}>
        <h2>{question.question}</h2>

        {question.answers.map((answer) => {
          const isCorrect = answer === question.correct_answer
          const isWrong = !isCorrect
          const isChosen = answer === chosen

          let bg = {}

          if (isChosen && isCorrect) {
            bg = {
              backgroundColor: "green",
              opacity: 0.5
            }
          } else if (isChosen && isWrong) {
            bg = {
              backgroundColor: "red",
              opacity: 0.5
            }
          }

          return (
            <button
              key={answer} // answers are unique strings here, so ok
              onClick={() => handleAnswerClick(question.id, answer)}
              style={bg}
              disabled={chosen}
            >
              {answer}
            </button>
          )
        })}
      </article>
    )
  })

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
      {Object.keys(chosenAnswers).length === questions.length && (
  <button onClick={toggleStartScreen}>Restart Game</button>
)}
    </main>
  )
}

export default App
