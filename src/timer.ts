import "./timer.css";
import {backlog} from './persistence/state'
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
export function zeigeDatum() {

    function aktualisieren() {

        const now = new Date();
        document.getElementById("monat")!.textContent =
            String(now.getMonth() +1 ).padStart(2, "0");

        document.getElementById("tag")!.textContent =
            String(now.getDate()).padStart(2, "0");

        document.getElementById("stunden")!.textContent =
            String(now.getHours()).padStart(2, "0");

        document.getElementById("minuten")!.textContent =
            String(now.getMinutes()).padStart(2, "0");

        document.getElementById("sekunden")!.textContent =
            String(now.getSeconds()).padStart(2, "0");
    }

    aktualisieren();

    setInterval(aktualisieren, 1000);
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

            const minuten = Math.floor(restSekunden1 / 60);
            const sekunden = restSekunden1 % 60;

            document.getElementById("countdown-display1")!.textContent =
                `${String(minuten).padStart(2, "0")}:${String(sekunden).padStart(2, "0")}`;

            // Bei 0 stoppen
            if (restSekunden1 <= 0) {
                clearInterval(intervall1!);
                intervall1 = null;
                console.log("Timer ist abgelaufen!");

                const audio = new Audio("/audio1.mp3");

                audio.play()
                    .then(() => console.log("Audio gestartet!"))
                    .catch(error => console.error("Audiofehler:", error));

                setTimeout(()=> {
                    alert( "Dein Timer ist abgelaufen!⏰");
                },1500);


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

        const minuten = Math.floor(restSekunden2 / 60);
        const sekunden = restSekunden2 % 60;

        document.getElementById("countdown-display2")!.textContent =
            `${String(minuten).padStart(2, "0")}:${String(sekunden).padStart(2, "0")}`;

        // Bei 0 stoppen
        if (restSekunden2 <= 0) {
            clearInterval(intervall2!);
            intervall2 = null;
            console.log("Timer ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .then(() => console.log("Audio gestartet!"))
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(()=> {
                alert( "Dein Timer ist abgelaufen!⏰");
            },1500);

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

    document.getElementById("countdown-display2")!.textContent = "30:00";
}
export function resetTimer1() {
    stoppTimer1();

    restSekunden1 = 5 * 60;

    document.getElementById("countdown-display1")!.textContent = "05:00";
}
export function startTimer3() {

    if (intervall3 !== null || restSekunden3 <= 0) {
        return;
    }

    intervall3 = setInterval(() => {

        restSekunden3--;

        const minuten = Math.floor(restSekunden3 / 60);
        const sekunden = restSekunden3 % 60;

        document.getElementById("countdown-display3")!.textContent =
            `${String(minuten).padStart(2, "0")}:${String(sekunden).padStart(2, "0")}`;

        if (restSekunden3 <= 0) {
            clearInterval(intervall3!);
            intervall3 = null;
            console.log("Timer ist abgelaufen!");

            const audio = new Audio("/audio1.mp3");

            audio.play()
                .then(() => console.log("Audio gestartet!"))
                .catch(error => console.error("Audiofehler:", error));

            setTimeout(()=> {
                alert( "Dein Timer ist abgelaufen!⏰");
            },1500);


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

    document.getElementById("countdown-display3")!.textContent = "60:00";
}







export function initEigenerWecker() {

    const button = document.getElementById("btn") as HTMLButtonElement;
    button.addEventListener("click", ()=>{
        const input = document.getElementById("selbstdefiniert") as HTMLInputElement;
        const zeit = input.value;
        const time= new Date(zeit).getTime();
        const differenz = time - Date.now();
        const restsekunden = Math.floor(differenz / 1000);
        // Wecker starten und Sekunden übergeben
        if (Number.isFinite(time) && restsekunden > 0) {
            eigenerwecker(restsekunden);
        } else {
            alert("Bitte eine gültige Uhrzeit in der Zukunft auswählen!");
        }
    });
    document.getElementById("reset-eigen")!
        .addEventListener("click", () => {
            stoppeiegener();

            document.getElementById("countdown-display-eigen")!
                .textContent = "00:00";
        });
    }

export function initEigenerWecker1() {
    tasks();
    const button = document.getElementById("btn1") as HTMLButtonElement;

    button.addEventListener("click", () => {
        const input = document.getElementById(
            "selbstdefiniert1"
        ) as HTMLInputElement;

        const zeit = input.value;
        const time = new Date(zeit).getTime();
        const differenz = time - Date.now();
        const restsekunden = Math.floor(differenz / 1000);

        if (Number.isFinite(time) && restsekunden > 0) {
            eigenerwecker1(restsekunden);
        } else {
            alert("Bitte eine gültige Uhrzeit in der Zukunft auswählen!");
        }
        document.getElementById("reset-eigen1")!
            .addEventListener("click", () => {
                stoppeiegener1();

                document.getElementById("countdown-display-eigen1")!
                    .textContent = "00:00";
            });


    });

    document.getElementById("stoppeneiegner1")!
        .addEventListener("click", stoppeiegener1);
}

let eigenerintervall: ReturnType<typeof setInterval> | null = null;

export function eigenerwecker(restsekunden: number) {

    if (eigenerintervall !== null || restsekunden <= 0) {
        return;
    }

    eigenerintervall = setInterval(() => {

        restsekunden--;

        const uebrigeminuten = Math.floor(restsekunden / 60);
        const uebrigesekunden = restsekunden % 60;

        // Countdown-Anzeige
        document.getElementById("countdown-display-eigen")!.textContent =
            `${String(uebrigeminuten).padStart(2, "0")}:${String(uebrigesekunden).padStart(2, "0")}`;

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

export function eigenerwecker1(restsekunden: number) {
    const auswahl = document.getElementById(
        "aufgabeWecker"
    ) as HTMLSelectElement;

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

    eigenerintervall1 = setInterval(() => {
        restsekunden--;

        const uebrigeminuten = Math.floor(restsekunden / 60);
        const uebrigesekunden = restsekunden % 60;

        // Nur die Anzeige des Aufgabenweckers verändern.
        document.getElementById("countdown-display-eigen1")!.textContent =
            `${String(uebrigeminuten).padStart(2, "0")}:${String(uebrigesekunden).padStart(2, "0")}`;

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








