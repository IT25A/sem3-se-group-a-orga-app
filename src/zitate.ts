
import './zitate.css';

export function zitat() {
    return `
<div class="zitatbody">


        <div class="background">
            <div class="zitate">
                <h1>Motivierende Zitate</h1>
                <h2>Zitat des Tages</h2>

                <p id="zitat"></p>
                <p id="autor"></p>

                <button id="nxtqoute" class="nxtqoute">Nächstes Zitat</button>
            </div>
        </div>
        
 </div>
 `;
}

export async function zeigeZitat() {
    const response = await fetch("/zitate.json");
    const daten = await response.json();

    const zufallsIndex = Math.floor(Math.random() * daten.length);
    const zufallsZitat = daten[zufallsIndex];

    const textElement = document.querySelector("#zitat");
    const autorElement = document.querySelector("#autor");

    if (textElement && autorElement) {
        textElement.textContent = zufallsZitat.quote;
        autorElement.textContent = zufallsZitat.author;
    }
}
export async function nächsterzitat() {

    const response = await fetch("/zitate.json");
    const daten = await response.json();

    const zufallsIndex = Math.floor(Math.random() * daten.length);
    const zufallsZitat = daten[zufallsIndex];

    const textElement = document.querySelector("#zitat");
    const autorElement = document.querySelector("#autor");

    if (textElement && autorElement) {
        textElement.textContent = zufallsZitat.quote;
        autorElement.textContent = zufallsZitat.author;
    }

}
document.getElementById("nxtqoute")
    ?.addEventListener("click", nächsterzitat);

export function mainzitatanzeiger() {
    return `
<div class="x">


        <div class="main">
            <div class="zitate">
                <h1>Motivierende Zitate</h1>
                <h2>Zitat des Tages</h2>

                <p id="zitat"></p>
                <p id="autor"></p>

                <button id="nxtqoute" class="nxtqoute">Nächstes Zitat</button>
            </div>
        </div>
        
 </div>
 `;

}
mainzitatanzeiger();
/*
Zitate fetchen von api
export async function zeigeZitat()
{
    const response = await fetch("https://qapi.vercel.app/api/random");
    const date = await response.json();
    console.log(date);
    const x = document.querySelector("#zitat");

    if (x)
    {
        x.textContent = date.quote;
    }
}

 */