import "./timer.css";
import { backlog } from './persistence/state'
// Beim Reiterwechsel existieren die Countdown-Elemente vorübergehend nicht.
// Der Countdown läuft weiter; nur die DOM-Aktualisierung wird übersprungen.
function setCountdownText(id: string, text: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function formatZeit(sekunden: number): string {
    const minuten = Math.floor(sekunden / 60);
    return `${String(minuten).padStart(2, "0")}:${String(sekunden % 60).padStart(2, "0")}`;
}

// select tag : auswählbare liste , options ist die zu ausgewählten einträge
export function renderTimer() {
    return `
        <div class="timebody">
            <div class="hero">
                <h1 class="ueberschrift">Aktuelles Datum &#128198 und Uhrzeit ⏱️</h1>

                <div class="timebox">
                <div class="time">
                        <h2 id="tag">00</h2>
                        <p>Tag</p>
                </div>
                    <div class="time">
                        <h2 id="monat">00</h2>
                        <p>Monat</p>
                    </div>
                    <div class="time">
                        <h2 id="stunden">00</h2>
                        <p>Stunden</p>
                    </div>

                    <div class="time">
                        <h2 id="minuten">00</h2>
                        <p>Minuten</p>
                    </div>

                    <div class="time">
                        <h2 id="sekunden">00</h2>
                        <p>Sekunden</p>
                    </div>
                 </div>
                 <div class="wecker" id="wecker">
                    <h2 class="ueberschrift"> Wecker anlegen? </h2> 
                    <input type="datetime-local" id="selbstdefiniert" placeholder="dein Timer">
                    <button class="btn-65" id="btn">Bestätigen</button>
                    <button class="btn-65" id="stoppeneiegner">Stoppen</button>
                    <button class="btn-65" id="reset-eigen">Resetten</button>
                    <h2 id="countdown-display-eigen">00:00</h2>
                 </div>
                 
                <div class="wecker" id="wecker1">
                    <h2 class="ueberschrift">Aufgabenwecker anlegen?</h2>
                    <div class="wecker-bedienung">  
                        <select
                            id="aufgabeWecker">
                            <options value ="">Bitte wähle Aufgabe</options>
                        </select>
                            
                        <input type="datetime-local" id="selbstdefiniert1">
                        <button class="btn-65" id="btn1">Bestätigen</button>
                        <button class="btn-65" id="stoppeneiegner1">Stoppen</button>
                        <button class="btn-65" id="reset-eigen1">Resetten</button>
                   
                    </div>

                    <h2 id="countdown-display-eigen1">00:00</h2>
                </div>

                <div class="timer-container">
                    <h1 class="ueberschrift">Countdown starten</h1>

                    <!-- Hier wird die verbleibende Zeit angezeigt -->
                    <h2 id="countdown-display1">05:00</h2>

                    <div class="timer-display1">
                        <button id="starten-btn1">Starten</button>
                        <button id="stoppen-btn1">Stoppen</button>
                        <button id="reseten-btn1">Resetten</button>
                    </div>
                    <h2 id="countdown-display2">30:00</h2>

                    <div class="timer-display2">
                        <button id="starten-btn2">Starten</button>
                        <button id="stoppen-btn2">Stoppen</button>
                        <button id="reseten-btn2">Resetten</button>
                    </div>
                    <!-- 60-Minuten-Timer -->
                    <h2 id="countdown-display3">60:00</h2>
                    
                    <div class="timer-display3">
                        <button id="starten-btn3">Starten</button>
                        <button id="stoppen-btn3">Stoppen</button>
                        <button id="reseten-btn3">Resetten</button>
                    </div>
                    
                    
                    
                </div>
                    
            </div>                   
        </div>
    `;
}


export function tasks() {
    const selectelement = document.getElementById(
        "aufgabeWecker"
    ) as HTMLSelectElement;

    if (!selectelement) return;

    selectelement.innerHTML =
        '<option value="">Bitte wähle eine Aufgabe</option>';

    for (const task of backlog.tasks) {
        const option = document.createElement("option");

        option.value = String(task.id);
        option.textContent = task.title;

        selectelement.appendChild(option);
    }
}

// 2. Datum anzeigen
// Außerhalb der Funktion speichern
let datumIntervall: ReturnType<typeof setInterval> | null = null;

export function zeigeDatum() {
    // Vorheriges Intervall beenden
    if (datumIntervall !== null) {
        clearInterval(datumIntervall);
        datumIntervall = null;
    }

    const monat = document.getElementById("monat");
    const tag = document.getElementById("tag");
    const stunden = document.getElementById("stunden");
    const minuten = document.getElementById("minuten");
    const sekunden = document.getElementById("sekunden");

    if (!monat || !tag || !stunden || !minuten || !sekunden) {
        return;
    }

    const monatElement = monat;
    const tagElement = tag;
    const stundenElement = stunden;
    const minutenElement = minuten;
    const sekundenElement = sekunden;

    function aktualisieren() {
        // Timer-Seite wurde verlassen: Intervall beenden
        if (!monatElement.isConnected) {
            if (datumIntervall !== null) {
                clearInterval(datumIntervall);
                datumIntervall = null;
            }
            return;
        }

        const now = new Date();

        monatElement.textContent =
            String(now.getMonth() + 1).padStart(2, "0");
        tagElement.textContent =
            String(now.getDate()).padStart(2, "0");
        stundenElement.textContent =
            String(now.getHours()).padStart(2, "0");
        minutenElement.textContent =
            String(now.getMinutes()).padStart(2, "0");
        sekundenElement.textContent =
            String(now.getSeconds()).padStart(2, "0");
    }

    aktualisieren();
    aktualisiereTimerAnzeigen();
    datumIntervall = setInterval(aktualisieren, 1000);
}
// Laufende Timer nach erneutem Rendern des Reiters sofort korrekt anzeigen.
function aktualisiereTimerAnzeigen(): void {
    setCountdownText("countdown-display1", formatZeit(restSekunden1));
    setCountdownText("countdown-display2", formatZeit(restSekunden2));
    setCountdownText("countdown-display3", formatZeit(restSekunden3));
    if (eigeneRestsekunden !== null) setCountdownText("countdown-display-eigen", formatZeit(eigeneRestsekunden));
    if (aufgabenRestsekunden !== null) setCountdownText("countdown-display-eigen1", formatZeit(aufgabenRestsekunden));
}

//Timer
let restSekunden1 = 5 * 60;   // 5 Minuten
let restSekunden2 = 30 * 60;  // 30 Minuten

// Je Timer bekommt sein eigenes Intervall
let intervall1: ReturnType<typeof setInterval> | null = null;
let intervall2: ReturnType<typeof setInterval> | null = null;
// 60 Minuten
let restSekunden3 = 60 * 60;
let intervall3: ReturnType<typeof setInterval> | null = null;





export function startTimer1() {

    // Verhindert, dass mehrere Timer gleichzeitig laufen
    if (intervall1 !== null || restSekunden1 <= 0) {
        return;
    }

    intervall1 = setInterval(() => {

        restSekunden1--;

        setCountdownText("countdown-display1", formatZeit(restSekunden1));

        // Bei 0 stoppen
        if (restSekunden1 <= 0) {
            clearInterval(intervall1!);
            intervall1 = null;
            console.log("Timer ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .then(() => console.log("Audio gestartet!"))
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(() => {
                alert("Dein Timer ist abgelaufen!⏰");
            }, 1500);


        }

    }, 1000);
}
export function stoppTimer1() {
    //restSekunden1 = 0
    clearInterval(intervall1!);
    intervall1 = null;
    return// 5 Minuten


}


export function startTimer2() {
    // Verhindert, dass mehrere Timer gleichzeitig laufen
    if (intervall2 !== null || restSekunden2 <= 0) {
        return;
    }

    intervall2 = setInterval(() => {

        restSekunden2--;

        setCountdownText("countdown-display2", formatZeit(restSekunden2));

        // Bei 0 stoppen
        if (restSekunden2 <= 0) {
            clearInterval(intervall2!);
            intervall2 = null;
            console.log("Timer ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .then(() => console.log("Audio gestartet!"))
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(() => {
                alert("Dein Timer ist abgelaufen!⏰");
            }, 1500);

            //alert("⏰ Dein 30-Minuten-Timer ist abgelaufen!");
        }

    }, 1000);
}
export function stoppTimer2() {
    //restSekunden2 = 0
    clearInterval(intervall2!);
    intervall2 = null;
    return// 30 Minuten
}
export function resetTimer2() {
    stoppTimer2();

    restSekunden2 = 30 * 60;

    setCountdownText("countdown-display2", "30:00");
}
export function resetTimer1() {
    stoppTimer1();

    restSekunden1 = 5 * 60;

    setCountdownText("countdown-display1", "05:00");
}
export function startTimer3() {

    if (intervall3 !== null || restSekunden3 <= 0) {
        return;
    }

    intervall3 = setInterval(() => {

        restSekunden3--;

        setCountdownText("countdown-display3", formatZeit(restSekunden3));

        if (restSekunden3 <= 0) {
            clearInterval(intervall3!);
            intervall3 = null;
            console.log("Timer ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .then(() => console.log("Audio gestartet!"))
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(() => {
                alert("Dein Timer ist abgelaufen!⏰");
            }, 1500);


        }

    }, 1000);
}


// 60-Minuten-Timer stoppen
export function stoppTimer3() {
    clearInterval(intervall3!);
    intervall3 = null;
}


// 60-Minuten-Timer zurücksetzen
export function resetTimer3() {
    stoppTimer3();

    restSekunden3 = 60 * 60;

    setCountdownText("countdown-display3", "60:00");
}







export function initEigenerWecker() {

    const button = document.getElementById("btn") as HTMLButtonElement;
    if (!button) return;
    button.addEventListener("click", () => {
        const input = document.getElementById("selbstdefiniert") as HTMLInputElement;
        if (!input) return;
        const zeit = input.value;
        const time = new Date(zeit).getTime();
        const differenz = time - Date.now();
        const restsekunden = Math.floor(differenz / 1000);
        // Wecker starten und Sekunden übergeben
        if (Number.isFinite(time) && restsekunden > 0) {
            eigenerwecker(restsekunden);
        } else {
            alert("Bitte eine gültige Uhrzeit in der Zukunft auswählen!");
        }
    });
    document.getElementById("reset-eigen")?.addEventListener("click", () => {
        stoppeiegener();
        eigeneRestsekunden = null;
        setCountdownText("countdown-display-eigen", "00:00");
    });
    document.getElementById("stoppeneiegner")?.addEventListener("click", stoppeiegener);
}

export function initEigenerWecker1() {
    tasks();
    const button = document.getElementById("btn1") as HTMLButtonElement;

    if (!button) return;
    button.addEventListener("click", () => {
        const input = document.getElementById(
            "selbstdefiniert1"
        ) as HTMLInputElement;

        if (!input) return;
        const zeit = input.value;
        const time = new Date(zeit).getTime();
        const differenz = time - Date.now();
        const restsekunden = Math.floor(differenz / 1000);

        if (Number.isFinite(time) && restsekunden > 0) {
            eigenerwecker1(restsekunden);
        } else {
            alert("Bitte eine gültige Uhrzeit in der Zukunft auswählen!");
        }
    });

    // Nur einmal binden, nicht bei jedem Klick auf „Bestätigen“.
    document.getElementById("reset-eigen1")?.addEventListener("click", () => {
        stoppeiegener1();
        aufgabenRestsekunden = null;
        setCountdownText("countdown-display-eigen1", "00:00");
    });
    document.getElementById("stoppeneiegner1")?.addEventListener("click", stoppeiegener1);
}

let eigenerintervall: ReturnType<typeof setInterval> | null = null;
let eigeneRestsekunden: number | null = null;

export function eigenerwecker(restsekunden: number) {

    if (eigenerintervall !== null || restsekunden <= 0) {
        return;
    }

    eigeneRestsekunden = restsekunden;
    eigenerintervall = setInterval(() => {

        restsekunden--;
        eigeneRestsekunden = restsekunden;

        // Countdown-Anzeige
        setCountdownText("countdown-display-eigen", formatZeit(restsekunden));

        // Wecker stoppen
        if (restsekunden <= 0) {

            clearInterval(eigenerintervall!);
            eigenerintervall = null;

            console.log("Wecker ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(() => {
                alert("Dein Wecker ist abgelaufen! ⏰");
            }, 1500);
        }

    }, 1000);
}
export function stoppeiegener() {
    clearInterval(eigenerintervall!);
    eigenerintervall = null;
}

let eigenerintervall1: ReturnType<typeof setInterval> | null = null;
let aufgabenRestsekunden: number | null = null;

export function eigenerwecker1(restsekunden: number) {
    const auswahl = document.getElementById(
        "aufgabeWecker"
    ) as HTMLSelectElement;

    if (!auswahl) return;

    const task = backlog.tasks.find(
        task => String(task.id) === auswahl.value
    );

    if (!task) {
        alert("Bitte eine Aufgabe auswählen!");
        return;
    }

    const aufgabe = task.title;


    // Hier muss eigenerintervall1 geprüft werden.
    if (eigenerintervall1 !== null || restsekunden <= 0) {
        return;
    }

    // Aufgabe einmal beim Start auslesen.
    //

    //const aufgabe = aufgabenEingabe.value.trim() || "Dein Ereignis";

    aufgabenRestsekunden = restsekunden;
    eigenerintervall1 = setInterval(() => {
        restsekunden--;
        aufgabenRestsekunden = restsekunden;

        // Nur die Anzeige des Aufgabenweckers verändern.
        setCountdownText("countdown-display-eigen1", formatZeit(restsekunden));

        if (restsekunden <= 0) {
            // Nur das Intervall des Aufgabenweckers beenden.
            clearInterval(eigenerintervall1!);
            eigenerintervall1 = null;

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(() => {
                alert(`Dein Wecker für „${aufgabe}“ ist abgelaufen! ⏰`);
            }, 1500);
        }
    }, 1000);
}

export function stoppeiegener1() {
    clearInterval(eigenerintervall1!);
    eigenerintervall1 = null;
}
