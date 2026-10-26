// render = anzeigen/darstellen
export function renderTimer() {
    return `
        <div class="timebody">
            <div class="hero">
                <h1 class="ueberschrift">Now ⏱️</h1>

                <div class="timebox">
                    <div class="time">
                        <h2 id="monat">00</h2>
                        <p>Monat</p>
                    </div>
                               
                    <div class="time">
                        <h2 id="tag">00</h2>
                        <p>Tag</p>
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
                    
                    
                    <!-- 5-Sekunden-Timer -->
                    <h2 id="countdown-display4">00:05</h2>
                    
                    <div class="timer-display4">
                        <button id="starten-btn4">Starten</button>
                        <button id="stoppen-btn4">Stoppen</button>
                        <button id="reseten-btn4">Resetten</button>
                    </div>
                    
             
                    
                    
                    
                </div>
            </div>
        </div>
    `;
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

// 5 Sekunden
let restSekunden4 = 5;
let intervall4: ReturnType<typeof setInterval> | null = null;



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
                alert("⏰ Dein 5-Minuten-Timer ist abgelaufen!");

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
            alert("⏰ Dein 30-Minuten-Timer ist abgelaufen!");

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

            alert("⏰ Dein 60-Minuten-Timer ist abgelaufen!");
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
export function startTimer4() {

    if (intervall4 !== null || restSekunden4 <= 0) {
        return;
    }

    intervall4 = setInterval(() => {

        restSekunden4--;

        const minuten = Math.floor(restSekunden4 / 60);
        const sekunden = restSekunden4 % 60;

        document.getElementById("countdown-display4")!.textContent =
            `${String(minuten).padStart(2, "0")}:${String(sekunden).padStart(2, "0")}`;

        if (restSekunden4 <= 0) {
            clearInterval(intervall4!);
            intervall4 = null;

            alert("⏰ Dein 5-Sekunden-Timer ist abgelaufen!");
        }

    }, 1000);
}


// 5-Sekunden-Timer stoppen
export function stoppTimer4() {
    clearInterval(intervall4!);
    intervall4 = null;
}


// 5-Sekunden-Timer zurücksetzen
export function resetTimer4() {
    stoppTimer4();

    restSekunden4 = 5;

    document.getElementById("countdown-display4")!.textContent = "00:05";
}







