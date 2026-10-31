import './style.css'
//inpm run devnpm run devmport {plugins} from "fullcalendar/all" funktioniert nicht bitte nicht aktivieren
//import Sortable from 'sortablejs'
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch'; // YOUR THEME
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import 'fullcalendar/skeleton.css'; // ALWAYS NEED SKELETON
import 'fullcalendar/themes/monarch/theme.css'; // YOUR THEME
import 'fullcalendar/themes/monarch/palettes/purple.css';
import {
    renderTimer,
    resetTimer1,
    resetTimer2,
    stoppTimer1,
    stoppTimer2,
    initEigenerWecker,
    stoppeiegener
} from "./timer";
import { zeigeDatum } from "./timer";
import {startTimer1} from "./timer";
import {startTimer2} from "./timer";
import {
    startTimer3, stoppTimer3, resetTimer3,

} from "./timer";
import { lists } from './taskAndListLogik';
import { displayListPage, renderListByIdInContainer } from './displayEditingLists';
import { populateTestData } from './charlysTests/TestFictures'
export let currentPage = "home-page";
//import {plugins} from "fullcalendar/all"; hat nicht funktioniert

// 1. Unsere Webseite erstellen

populateTestData(); //Wie der Name sagt, zum Laden von Testdaten (decken eine Auswahl verschiedener  Fälle ab, das ganze ist grob beschrieben in TestFictures über die Namen der Vars und so)
const app = document.querySelector<HTMLDivElement>('#app')!;

renderHomePage();


/*
Hier werden die Funktionen für die Nav-Bar aufgerufen
*/

document.getElementById("meine-listen-link")?.addEventListener("click", () =>{
    currentPage = "list-page";
    displayListPage()
})

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



    document.getElementById("stoppeneiegner")
    ?.addEventListener("click", stoppeiegener);

    initEigenerWecker();

    //document.getElementById("weckereinstellen").addEventListener("click", --);
});

export function renderHomePage():void{
    app.replaceChildren();
    const generalContent = document.createElement('div');
    generalContent.className = 'app';

    generalContent.innerHTML = `
    <h1>Meine OrgaAPP</h1>
    <p>Ziehe deine Aufgaben mit der Maus!</p>
    `;
    app.append(generalContent)
    renderListByIdInContainer(lists[0].id, app)

    // Kalenderbereich
    const calenderSection = document.createElement('section');
    calenderSection.className = 'calendar-card';
    calenderSection.style = `width: 90%`

    const calenderHeading = document.createElement('h2');
    calenderHeading.textContent = 'Mein Kalender';

    const calenderElement = document.createElement('div');
    calenderElement.id = 'calendar';

    calenderSection.append(calenderHeading, calenderElement);

    // Alles an #app anhängen
    app.append(calenderSection);


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
}
//document.querySelector<HTMLDivElement>("#app")!.innerHTML = renderTimer();

