
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch';
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import { updateEventlog, eventlog} from './persistence/state';
import interactionPlugin, {
    Draggable
} from 'fullcalendar/interaction';

import { getCalendarEvents } from './persistence/state';
import { loadEventlog } from './persistence/storage';

// Kalenderinstanz zentral speichern
let calendar: Calendar | null = null;
export type CalendarEvent = {
    id: string;
    taskId: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
}

export async function showCalender(container: HTMLDivElement): Promise<void> {

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

        events: await loadEventlog(),
        eventReceive: (info) => {
            const newEvent = info.event;

            const calendarEvent: CalendarEvent = {
                id: newEvent.id,
                taskId: String(newEvent.extendedProps.taskId),
                title: newEvent.title,
                start: newEvent.start!.toISOString(),
                end: newEvent.end!.toISOString(),
                allDay: newEvent.allDay
            };
            eventlog.push(calendarEvent)
            updateEventlog(eventlog);
        }
    });

    calendar.render();
}

// Kalender aktualisieren
export function refreshCalendar(): void {
    calendar?.refetchEvents();
}
