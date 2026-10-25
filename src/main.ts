import './style.css'
//inpm run devnpm run devmport {plugins} from "fullcalendar/all" funktioniert nicht bitte nicht aktivieren
import Sortable from 'sortablejs'
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch'; // YOUR THEME
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import 'fullcalendar/skeleton.css'; // ALWAYS NEED SKELETON
import 'fullcalendar/themes/monarch/theme.css'; // YOUR THEME
import 'fullcalendar/themes/monarch/palettes/purple.css';
import {renderTimer, resetTimer1, resetTimer2, stoppTimer1, stoppTimer2} from "./timer";
import { zeigeDatum } from "./timer";
import {startTimer1} from "./timer";
import {startTimer2} from "./timer";
import {
    startTimer3, stoppTimer3, resetTimer3,
    startTimer4, stoppTimer4, resetTimer4,
} from "./timer";

import { displayListPage } from './displayEditingLists';
import { showDialogNewTask } from './dialogs'; 

//import {plugins} from "fullcalendar/all"; hat nicht funktioniert

    // 1. Unsere Webseite erstellen
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="app">  
<h1> Meine OrgaAPP</h1>
  <p>Ziehe deine Aufgaben mit der Maus!</p>

  <h2> Studium</h2>
  <ul id="studium">
    <li>Java lernen</li>
    <li>Hausaufgaben machen</li>
    <li>Prüfung vorbereiten</li>
  </ul>

  <h2>🏠 Privat</h2>
  <ul id="privat">
    <li>Einkaufen</li>
    <li>Sport machen</li>
    <li>Zimmer aufräumen</li>
  </ul>
  
 <h2> Mein Kalender</h2>
<div id="calendar"></div>

</div>
`

// 2. Studium-Liste verschiebbar machen
Sortable.create(document.getElementById('studium')!, {
    group: 'aufgaben',
    animation: 150
})

// 3. Privat-Liste verschiebbar machen
Sortable.create(document.getElementById('privat')!, {
    group: 'aufgaben',
    animation: 150
})
// 1. Platz für den Kalender suchen
const calendarEl = document.getElementById('calendar')!

// 2. Kalender erstellen
const calendar = new Calendar(calendarEl, {

    plugins: [
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        themePlugin
    ],

    // Monatsansicht
    initialView: 'dayGridMonth',

    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
    },

    // Beispielaufgaben- ihr könnt weitere ergänzen
    events: [
        {
            title: 'Java lernen',
            start: '2026-10-20'
        },
        {
            title: 'Sport machen',
            start: '2026-10-22'
        }
    ]
})

// 3. Kalender anzeigen
calendar.render()


document.getElementById("timer-link")?.addEventListener("click", () => {
    document.getElementById("app")!.innerHTML = renderTimer();
    zeigeDatum()
    document.getElementById("starten-btn1")
        ?.addEventListener("click", startTimer1);
    document.getElementById("stoppen-btn1")
        ?.addEventListener("click", stoppTimer1);

    document.getElementById("starten-btn2")
        ?.addEventListener("click", startTimer2);
    document.getElementById("stoppen-btn2")
        ?.addEventListener("click", stoppTimer2);
    document.getElementById("reseten-btn2")
        ?.addEventListener("click", resetTimer2);
    document.getElementById("reseten-btn1")
        ?.addEventListener("click", resetTimer1);
    // TIMER 3: 60 Minuten
    document.getElementById("starten-btn3")
        ?.addEventListener("click", startTimer3);

    document.getElementById("stoppen-btn3")
        ?.addEventListener("click", stoppTimer3);

    document.getElementById("reseten-btn3")
        ?.addEventListener("click", resetTimer3);


// TIMER 4: 5 Sekunden
    document.getElementById("starten-btn4")
        ?.addEventListener("click", startTimer4);

    document.getElementById("stoppen-btn4")
        ?.addEventListener("click", stoppTimer4);

    document.getElementById("reseten-btn4")
        ?.addEventListener("click", resetTimer4);

//displayListPage(); Testkommentar von Charlotte um ihre Seite anzuzeigen (Kann weg wenn Seite in Nav verlinkt ist)

});
//document.querySelector<HTMLDivElement>("#app")!.innerHTML = renderTimer();

