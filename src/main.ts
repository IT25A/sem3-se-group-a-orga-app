import './style.css'
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch'; // YOUR THEME
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import { renderBacklogPage } from './backlog';
import 'fullcalendar/skeleton.css'; // ALWAYS NEED SKELETON
import 'fullcalendar/themes/monarch/theme.css'; // YOUR THEME
import 'fullcalendar/themes/monarch/palettes/purple.css';
import { renderTimer, resetTimer1, resetTimer2, stoppTimer1, stoppTimer2, initEigenerWecker, stoppeiegener, initEigenerWecker1, zeigeDatum, startTimer1, startTimer2, startTimer3, stoppTimer3, resetTimer3 } from "./timer";
import { zitat, zeigeZitat,mainzitatanzeiger } from "./zitate.ts";
import { lists, validateData } from './persistence/state.ts';
import { displayListPage, renderListByIdInContainer } from './displayEditingLists';
//import { populateTestData } from './charlysTests/TestFictures' hat nicht mehr bei mir funktioniert
import { initializeData } from "./persistence/state.ts";
export let currentPage = "home-page";
export const app = document.querySelector<HTMLDivElement>('#app')!;


async function main() {
  try {
    // Daten aus IndexedDB laden
    await initializeData();
    validateData();
    //resetAppData(); // Zum Testen, um die Datenbank zu leeren und mit frischen Daten zu starten
    console.log("Daten erfolgreich geladen!");

    //Ich hoffe das geht (wieso hatten wir keine main() function? hahah)
      // stimmt wäre vlt nh idee hahahha



    renderHomePage();


    /*
    Hier werden die Funktionen für die Nav-Bar aufgerufen
    */

    document.getElementById("home-link")?.addEventListener("click", () =>{
        currentPage = "home-page";
        renderHomePage();
    })

    document.getElementById("meine-listen-link")?.addEventListener("click", () =>{
        currentPage = "list-page";
        displayListPage()
    })

    document.getElementById("backlog-link")?.addEventListener("click", () =>{
        currentPage = "backlog-page";
        renderBacklogPage()
    })
    /*
    Zitate
    */
    document.getElementById("zitate-link")?.addEventListener("click", async (event) => {
        event.preventDefault();
        document.getElementById("app")!.innerHTML = zitat();
        // Jetzt existiert der Button:
        document.getElementById("nxtqoute")
            ?.addEventListener("click", zeigeZitat);
        await zeigeZitat();
    });
    /*
    Timer
    */

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
        initEigenerWecker1();

        //document.getElementById("weckereinstellen").addEventListener("click", --);
    });



  } catch (error) {
    console.error(
      "Fehler beim Initialisieren:",
      error
    );
  }
}

main();

export function renderHomePage():void{
    app.replaceChildren();
    const generalContent = document.createElement('div');
    generalContent.className = 'app';



    generalContent.innerHTML = `
    <h1>Meine OrgaAPP</h1>
    <p>Ziehe deine Aufgaben mit der Maus!</p>
    `;
    app.append(generalContent)

    if (lists.length > 0) {
        renderListByIdInContainer(lists[0].id, app, true);
    }
// Zitatbereich hinzufügen
    const zitatBereich = document.createElement('div');
    zitatBereich.innerHTML = mainzitatanzeiger();
    zitatBereich.className = 'zitat-card';
    app.append(zitatBereich);
    zeigeZitat();
    zitatBereich.querySelector('#nxtqoute')
        ?.addEventListener('click', zeigeZitat);

    // Kalenderbereich
    const calenderSection = document.createElement('section');
    calenderSection.className = 'calendar-card';
    calenderSection.style = `width:80%`

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
    calendar.render();
}