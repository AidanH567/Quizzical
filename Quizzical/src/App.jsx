import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { triviaQuestions } from "./DummyQuestions"
import { fetchTriviaQuestions } from "./TrviaFetch"
import { v4 as uuidv4 } from "uuid"
import { decode } from "html-entities";

function App() {

  const [startScreen, setStartScreen] = useState(false)
  const [questions, setQuestions] = useState([])


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
    return (<article className='question-single'>
      <h2>{question.question}</h2>
      <button key={uuidv4()}>{question.correct_answer}</button>
      <button key={uuidv4()}>{question.incorrect_answers[0]}</button>
      <button key={uuidv4()}>{question.incorrect_answers[1]}</button>
      <button key={uuidv4()}>{question.incorrect_answers[2]}</button>
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
        {/* <article className='question-single'>
          <h2>How would one say goodbye in Spanish?</h2>
            <button>Adiós</button>
            <button>Hola</button>
            <button>Au Revoir</button>
            <button>Salir</button>
        </article> */}
        {quizzElements}
      </section>}


    </main>
  )
}

export default App
