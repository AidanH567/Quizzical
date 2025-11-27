import { useState } from 'react'
import './App.css'
import { fetchTriviaQuestions } from "./TrviaFetch"
import { v4 as uuidv4 } from "uuid"
import { decode } from "html-entities";
import QuizzElements from './Components/QuizzElements';
import StartScreen from './Components/StartScreen';
import QuizzScreen from './Components/QuizzScreen';


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

  

  const allAnswered = Object.keys(chosenAnswers).length === questions.length

  return (
    <main>
      {!startScreen && (
        <StartScreen onClick={toggleStartScreen}/>
      )}

      {startScreen && (
        <QuizzScreen>
          <QuizzElements 
            questions={questions}
            chosenAnswers={chosenAnswers}
            isChecked={isChecked}
            handleAnswerClick={handleAnswerClick}>
          </QuizzElements>
        </QuizzScreen>
      )}

      {startScreen && (
        <>
          <span>Score: {score}</span>

         
          {allAnswered && !isChecked && (
            <button onClick={checkAnswers}>Check answers</button>
          )}

          
          {isChecked && (
            <button onClick={toggleStartScreen}>Restart Game</button>
          )}
        </>
      )}
    </main>
  )
}

export default App
