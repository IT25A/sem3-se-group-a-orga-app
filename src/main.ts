import './style.css'

import {benachrichtige, stummschalten,benachrichtigeOhneTon ,renderBacklogPage} from './backlog';
import 'fullcalendar/skeleton.css'; // ALWAYS NEED SKELETON
import 'fullcalendar/themes/monarch/theme.css'; // YOUR THEME
import 'fullcalendar/themes/monarch/palettes/purple.css';
import { renderTimer, resetTimer1, resetTimer2, stoppTimer1, stoppTimer2, initEigenerWecker, stoppeiegener, initEigenerWecker1, zeigeDatum, startTimer1, startTimer2, startTimer3, stoppTimer3, resetTimer3 } from "./timer";
import { zitat, zeigeZitat, mainzitatanzeiger } from "./zitate.ts";
import { lists, validateData } from './persistence/state.ts';

import { showCalender } from './calendar.ts';
import { displayPlanungsPage } from './wochePlanen.ts';
import { destroyCalendarDraggable } from './calendarDraggable.ts';

import { displayListPage } from './displayEditingLists';
//import { populateTestData } from './charlysTests/TestFictures' hat nicht mehr bei mir funktioniert
import { initializeData } from "./persistence/state.ts";
import { cardSliderNavigation, showCardSliderForListsInContainer } from './cardSlider.ts';
import { renderHabitsPage } from './habits';
import { displayZielePage } from './displayZiele.ts';
export let currentPage = "home-page";
export const app = document.querySelector<HTMLDivElement>('#app')!;

interface NavigatorUAData extends Navigator {
    userAgentData?: {
        platform: string;
    };
}

const nav = navigator as NavigatorUAData;

const ua = nav.userAgent;
const platform = nav.userAgentData?.platform || nav.platform;

const isFirefox = ua.includes("Firefox");

let os = "unknown";

if (/Win/i.test(platform)) {
    os = "windows";
} else if (/Mac/i.test(platform)) {
    os = "macos";
} else if (/Linux/i.test(platform)) {
    os = "linux";
} else if (/Android/i.test(platform)) {
    os = "android";
} else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "ios";
}

document.documentElement.classList.add(
    `os-${os}`,
    isFirefox ? "browser-firefox" : "browser-chromium"
);
async function main() {
  try {
    // Daten aus IndexedDB laden
    await initializeData();
    validateData();
    //resetAppData(); // Zum Testen, um die Datenbank zu leeren und mit frischen Daten zu starten
    console.log("Daten erfolgreich geladen!");

    renderHomePage();

    /*
    Hier werden die Funktionen für die Nav-Bar aufgerufen
    */

    document.getElementById("home-link")?.addEventListener("click", () =>{
        destroyCalendarDraggable();
        currentPage = "home-page";
        renderHomePage();
    })

    document.getElementById("meine-listen-link")?.addEventListener("click", () =>{
        destroyCalendarDraggable();
        currentPage = "list-page";
        displayListPage()
    })

    document.getElementById("backlog-link")?.addEventListener("click", () =>{
        destroyCalendarDraggable();
        currentPage = "backlog-page";
        renderBacklogPage()
    })
    document.getElementById("planung-link")?.addEventListener("click", () =>{
        currentPage = "planung-page";
        displayPlanungsPage()
    })
    document.getElementById("ziele-link")?.addEventListener("click", () =>{
        currentPage = "ziele-page";
        displayZielePage()
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

    });



    }catch (error) {
        console.error(
            "Fehler beim Initialisieren:",
            error
        );
    }
}

main();

export function renderHomePage(): void {
    app.replaceChildren();
    const generalContent = document.createElement('div');
    generalContent.className = 'app';

    generalContent.innerHTML = `
  <header class="kopfzeile">
  <h1>Meine OrgaAPP</h1>

  <div class="benachrichtigung-optionen">
    <label class="benachrichtigung-option">
      <input type="checkbox" id="benachrichtigung-stumm">
      <span class="option-emoji" aria-hidden="true">🔕</span>
      <span class="hover-text">Benachrichtigungen ausschalten</span>
    </label>

    <label class="benachrichtigung-option">
      <input type="checkbox" id="benachrichtigung-ohneTon">
      <span class="option-emoji" aria-hidden="true">🔇</span>
      <span class="hover-text">Benachrichtigungen ohne Ton</span>
    </label>
  </div>
</header>

<dialog id="aufgaben-popup">
  <p id="popup-text"></p>
  <form method="dialog">
    <button class="btnbenachrichtigung">OK</button>
  </form>
</dialog>
    `;

    app.append(generalContent)

    const listenBereich = document.createElement('div');

    if (lists.length > 0) {
        showCardSliderForListsInContainer(listenBereich);
        cardSliderNavigation();
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

    showCalender(calenderElement);
    //Benachrichtigung in Home
    benachrichtige();
    stummschalten();
    benachrichtigeOhneTon();

}
