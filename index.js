// HUOM! Tämä käytiin esimerkkinä .then menetelmän käytöstä Promisen purkamiseksi.
// Toimiva esimerkki löytyy chat.js tiedostosta.
// API_KEY ei ole tässä mukana vaan löytyy erikseen Moodlesta.
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

rl.question('Toimiiko tämä?').then((answer) => {

    console.log(answer)
    rl.close()

})


const API_KEY = "...tämän tilalle API_KEY..."


const chatData = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "system",
            "content": "Olen avulias assistentti"
        },
        {
            "role": "user",
            "content": "Selitä javaScriptin Promise"
        },
    ]
}

function chatAi() {

    fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        method: 'POST',
        body: JSON.stringify(chatData)
    }).then((data) => {

        const parsedJson = data.json()

        return parsedJson

    }).then((data) => {

        const { choices } = data

        const [choiceOne] = choices

        const { message } = choiceOne

        const { content, role } = message

        console.log(content)
    })

}
