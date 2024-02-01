// API_KEY ei ole tässä mukana vaan löytyy erikseen Moodlesta.
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

const API_KEY = "...tämän tilalle API_KEY..."

const chatData = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "system",
            "content": "Olen avulias assistentti"
        },
    ]
}


async function chat(){


    const question = await rl.question('kysy:\n')

    const questionMessage = {
        "role": "user",
        "content": question
    }

    chatData.messages.push(questionMessage)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        method: 'POST',
        body: JSON.stringify(chatData)
    })

    const {choices} = await response.json()

    const [choiceOne] = choices

    const { message } = choiceOne

    chatData.messages.push(message)

    const { content, role } = message

    console.log(role, content)

    await chat()

}

chat()