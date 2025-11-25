import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { triviaQuestions } from "./DummyQuestions"
import { fetchTriviaQuestions } from "./TrviaFetch"
import { v4 as uuidv4 } from "uuid"
import { decode } from "html-entities";
import clsx from "clsx"

function App() {

  const [startScreen, setStartScreen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [chosenAnswers, setChosenAnswers] = useState(null)


  async function loadQuestions() {
    const results = await fetchTriviaQuestions(5)

    const cleanedResults = results.map(q => ({
      ...q,
      question: decode(q.question),
      correct_answer: decode(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(ans => decode(ans))
    }))

    console.log("RESULTS IN APP:", results);
    setQuestions(cleanedResults)
  }


  console.log("results in questions", questions)

  function toggleStartScreen() {
    setStartScreen(true)
    loadQuestions()
  }

  const quizzElements = questions.map((question) => {
    const combined = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5)


    console.log("COMBINED ANSWERS:", combined)

    function handleAnswerClick(answer) {
      const isCorrect = answer === question.correct_answer
      if (isCorrect) {
        console.log("correct")
        
      } else {
        console.log("wrong")
      }
    }

    return (
        <article className='question-single' key={question.question}>
      <h2>{question.question}</h2>

      {combined.map((answer) => {
        const isCorrect = answer === question.correct_answer
        const isChosen = answer === chosenAnswers

        const btnStyle = {
          backgroundColor: isCorrect ? "green" : "red"
        }

        return (
          <button
            key={uuidv4()}
            onClick={() => handleAnswerClick(answer)}
            style={btnStyle}
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
      {!startScreen && <section className='start-screen'>
        <h1>Quizzical</h1>
        <p>The ultimate trivia game!</p>
        <button onClick={toggleStartScreen}>Start quiz</button>
      </section>}
      {startScreen && <section className='quizz-screen'>
        {quizzElements}
      </section>}


    </main>
  )
}

export default App
