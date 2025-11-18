import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { triviaQuestions } from "./DummyQuestions"
import { fetchTriviaQuestions } from "./TrviaFetch"

function App() {

  const [startScreen, setStartScreen] = useState(false)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    async function loadQuestions() {
      const results = await fetchTriviaQuestions(5)
      console.log("RESULTS IN APP:", results);
      setQuestions(results)
    }

    loadQuestions()

  }, [])

   console.log("results in questions", questions)

  function toggleStartScreen() {
    setStartScreen(true)
  }

  const quizzElements = triviaQuestions.map((question) => {
    return (<article className='question-single'>
      <h2>{question.question}</h2>
      <button>{question.options[0]}</button>
      <button>{question.options[1]}</button>
      <button>{question.options[2]}</button>
      <button>{question.options[3]}</button>
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
