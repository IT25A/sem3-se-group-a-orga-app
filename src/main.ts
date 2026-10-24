//Das ist ein Testkommentar von Charlotte, der ignoriert werden kann.
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
import { displayListPage } from './displayEditingLists';
import { showDialogNewTask } from './dialogs'; 

//import {plugins} from "fullcalendar/all"; hat nicht funktioniert

    // 1. Unsere Webseite erstellen
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
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
calendar.render();




displayListPage();










//"import './style.css'
// import heroImg from './assets/hero.png'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'
// import { setupCounter } from './counter.ts'
//
// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
// <section id="center">
//   <div class="hero">
//     <img src="${heroImg}" class="base" width="170" height="179">
//     <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
//     <img src="${viteLogo}" class="vite" alt="Vite logo" />
//   </div>
//   <div>
//     <h1>Get started</h1>
//     <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
//   </div>
//   <button id="counter" type="button" class="counter"></button>
// </section>
//
// <div class="ticks"></div>
//
// <section id="next-steps">
//   <div id="docs">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
//     <h2>Documentation</h2>
//     <p>Your questions, answered</p>
//     <ul>
//       <li>
//         <a href="https://vite.dev/" target="_blank">
//           <img class="logo" src="${viteLogo}" alt="" />
//           Explore Vite
//         </a>
//       </li>
//       <li>
//         <a href="https://www.typescriptlang.org" target="_blank">
//           <img class="button-icon" src="${typescriptLogo}" alt="">
//           Learn more
//         </a>
//       </li>
//     </ul>
//   </div>
//   <div id="social">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
//     <h2>Connect with us</h2>
//     <p>Join the Vite community</p>
//     <ul>
//       <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
//       <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
//       <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
//       <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
//     </ul>
//   </div>
// </section>
//
// <div class="ticks"></div>
// <section id="spacer"></section>
// `
//
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)"
