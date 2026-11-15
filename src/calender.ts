
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch';
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import interactionPlugin, {
    Draggable
} from 'fullcalendar/interaction';

import { getCalendarEvents } from './persistence/state';
// Kalenderinstanz zentral speichern
let calendar: Calendar | null = null;
export interface CalendarEvent {
    id: string;
    taskId: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
}

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
            themePlugin,
            interactionPlugin
        ],

        initialView: "timeGridWeek",
        locale: "de",
        firstDay:1,
        weekends:true,
        allDaySlot:true,
        slotDuration: "01:00:00",
        editable:true,
        droppable:true,

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
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
