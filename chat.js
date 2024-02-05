// Tuodaan 'readline' moduulin promiseja tukeva versio ja 'stdin' sekä 'stdout' objektit 'process' moduulista.
// Ks. https://nodejs.org/api/readline.html 
// - Huomaa JSM - EMS nappi noden dokumentaatiossa, tässä node-projektissa on ESM moduulit käytössä!
import readline from 'readline/promises'; 
import { stdin, stdout } from 'process';

// Luodaan uusi readline-käyttöliittymä, joka mahdollistaa tekstisyötteen lukemisen ja tekstin tulostamisen komentorivi-ikkunaan.
const rl = readline.createInterface({
    input: stdin, // Määritellään syötteen lähde, tässä tapauksessa standardisyöte (komentorivin syöte).
    output: stdout // Määritellään tulosteen kohde, tässä tapauksessa standardituloste (komentorivin tuloste).
});

// API-avain, joka tarvitaan autentikoimaan pyynnöt OpenAI:n API:lle. 
// Tämän pitäisi olla jatkossa turvallisesti säilytetty esim. .env tiedostossa, ei suoraan koodissa.
const API_KEY = "...tämän tilalle API_KEY...";

// Alustetaan chatData objekti, joka sisältää konfiguraation ja viestit, jotka lähetetään OpenAI:n API:lle.
// Ks. https://platform.openai.com/docs/guides/text-generation/chat-completions-api
const chatData = {
    "model": "gpt-3.5-turbo", // Määritellään käytettävä AI-malli.
    "messages": [ // Lista viesteistä, jotka muodostavat keskusteluhistorian.
        {
            "role": "system", // Viestin rooli, 'system' viittaa järjestelmän tuottamaan viestiin.
            "content": "Olen avulias assistentti" // Viestin sisältö.
        },
    ]
};

// Asynkroninen funktio, joka toteuttaa chat-toiminnallisuuden käyttäen rekursiota toistamaan kysymys-vastaus sykliä.
async function chat(){
    // Pyydetään käyttäjää kirjoittamaan kysymys ja odotetaan syötettä.
    const question = await rl.question('kysy:\n');

    // Luodaan viestiobjekti käyttäjän kysymykselle ja lisätään se chatDataan.
    const questionMessage = {
        "role": "user", // Asetetaan rooliksi 'user', viitaten käyttäjän lähettämään viestiin.
        "content": question // Lisätään käyttäjän kysymys sisällöksi.
    };

    // Lisätään käyttäjän viesti chatData.messages -listaan.
    chatData.messages.push(questionMessage);

    // Tehdään POST-pyyntö OpenAI:n chat-completions endpointiin, lähettäen chatData JSON-muodossa.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json', // Määritellään sisällön tyyppi JSON-muotoiseksi.
            'Authorization': 'Bearer ' + API_KEY // Lisätään autorisaatio-header API-avaimella.
        },
        method: 'POST', // Määritellään HTTP-metodiksi POST, jotta voidaan lähettää dataa palvelimelle.
        body: JSON.stringify(chatData) // Muunnetaan chatData JSON-merkkijonoksi ja asetetaan pyynnön rungoksi.
    });

    // Puretaan vastaus ja otetaan siitä 'choices', joka sisältää AI:n vastaukset.
    // Ks. https://platform.openai.com/docs/guides/text-generation/chat-completions-response-format
    const {choices} = await response.json();

    // Oletetaan, että ensimmäinen valinta sisältää halutun vastauksen.
    const [choiceOne] = choices;

    // Oletetaan, että choiceOne sisältää 'message'-objektin, joka edustaa AI:n vastausta.
    const { message } = choiceOne;

    // Lisätään AI:n viesti chatDataan tulevia pyyntöjä varten.
    chatData.messages.push(message);

    // Puretaan viestistä sisältö ja rooli, ja tulostetaan ne.
    const { content, role } = message;

    // Tulostetaan viestin rooli ja sisältö komentoriville.
    console.log(role, content);

    // Kutsutaan chat-funktiota uudelleen, jotta käyttäjä voi jatkaa keskustelua.
    // https://www.freecodecamp.org/news/recursion-in-javascript/
    await chat();
}

// Käynnistetään chat-funktio, aloittaen interaktiivisen chat-istunnon.
// chat-funktio suoritetaan ensimmäisen kerran tässä.
chat();