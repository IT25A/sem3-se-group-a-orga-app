
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch';
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';

import { getCalendarEvents } from './persistence/state';
// Kalenderinstanz zentral speichern
let calendar: Calendar | null = null;


export function showCalender(container: HTMLDivElement): void {

    // Falls bereits ein Kalender existiert:
    // Vorherige Instanz zerstören
    if (calendar) {
        calendar.destroy();
    }

    calendar = new Calendar(container, {

        plugins: [
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            themePlugin
        ],

        initialView: "timeGridWeek",

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },

        events: (_fetchInfo, successCallback, failureCallback) => {
            try {
                successCallback(getCalendarEvents());
            } catch (error) {
                failureCallback(error as Error);
            }
        },

        eventClick: (info) => {
            console.log(
                "Aufgabe:",
                info.event.extendedProps.taskId
            );
        }
    });

    calendar.render();
}

// Kalender aktualisieren
export function refreshCalendar(): void {
    calendar?.refetchEvents();
}
