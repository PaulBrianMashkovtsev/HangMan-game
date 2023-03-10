import React, {useCallback, useEffect, useState} from 'react';
import words from "./Vocab.json";
import './App.css';
import {Hangman} from "./components/Hangman";
import {Word} from "./components/Word";
import {Keyboard} from "./components/Keyboard";


function App() {

    const [wordGuess, setWordGuess] = useState(() => {
        return words [Math.floor(Math.random() * words.length)]
    })
    const [guessLetters, setGuessLetters] = useState<string[]>([])

    const incorrectLetters = guessLetters.filter(letter =>
        !wordGuess.includes(letter)
    )

    const isLoser = incorrectLetters.length >= 6;
    const isWinner = wordGuess.split('').every(letter =>
    guessLetters.includes(letter))

    const addGuessLetter = useCallback((letter: string) => {
        if (guessLetters.includes(letter) || isWinner|| isLoser) return
        setGuessLetters(currentLetters => [...currentLetters, letter])
    }, [guessLetters || isWinner|| isLoser])


    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key
            if (!key.match(/^[a-z]/))
                return
            e.preventDefault()
            addGuessLetter(key)
        }
        document.addEventListener("keypress", handler)
        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [guessLetters])



    return (
        <div style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            margin: "0 auto",
            alignItems: "center",
        }}>
            <div style={{fontSize: "2rem", textAlign: "center"}}>

                {isWinner && "Good Play!!! You are smart!!!"}
                {isLoser && "Stupid guy!!! Back to school!!!"}

            </div>
            <Hangman numberOfGuesses={incorrectLetters.length}/>
            <Word guessLetters={guessLetters}
                  wordGuess={wordGuess}
                  reveal={isLoser}
            />
            <div style={{alignSelf: "stretch"}}>


            <Keyboard activeLetters={guessLetters.filter(letter =>
                wordGuess.includes(letter))}
                      inactiveLetters={incorrectLetters}
                      addGuessLetter={addGuessLetter}
                      disabled={isWinner || isLoser}
            />
            </div>
        </div>
    );
}

export default App;
