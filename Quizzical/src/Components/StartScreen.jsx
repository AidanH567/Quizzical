function startScreen(props) {
  return (
    <section className='start-screen'>
      <h1>Quizzical</h1>
      <p>The ultimate trivia game!</p>
      <button onClick={props.onClick}>Start quiz</button>
    </section>
  )
}

export default startScreen