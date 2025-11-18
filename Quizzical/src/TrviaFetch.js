export async function fetchTriviaQuestions(amount = 5) {
    const res = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&type=multiple`
    )

    const data = await res.json()

    console.log("RAW API DATA:", data);
    
    return data.results
}

