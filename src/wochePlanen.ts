
import { renderBacklogInContainer } from "./backlog";
import { showCalender } from "./calendar.ts";
import './styles/planungsPage.css'
import { destroyCalendarDraggable, initializeCalendarDraggable } from './calendarDraggable.ts';

export function displayPlanungsPage() {
    destroyCalendarDraggable();

    const container = document.querySelector<HTMLDivElement>("#app");

    if (!container) {
        throw new Error("container not found");
    }

    container.replaceChildren();
    container.classList.add('app')
    // Hauptbereich
    const planningPage = document.createElement("div");
    planningPage.classList.add("planning-page");

    // Überschrift
    const header = document.createElement("div");
    header.classList.add("planning-header");

    const title = document.createElement("h1");
    title.textContent = "Meine Planung";

    const description = document.createElement("p");
    description.textContent =
        "Was steht heute auf dem Zettelchen?";

    header.append(title, description);

    // Flexbox-Bereich
    const planningContent = document.createElement("div");
    planningContent.classList.add("planning-content");

    // Backlog links
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.id="backlog-container";

    // Kalender rechts
    const calenderContainer = document.createElement("div");
    calenderContainer.classList.add("calender-container");


    //beide
    planningContent.append(taskContainer, calenderContainer);

    planningPage.append(header, planningContent);

    container.appendChild(planningPage);

    renderBacklogInContainer(taskContainer, true);
    showCalender(calenderContainer);

    initializeCalendarDraggable();
}
