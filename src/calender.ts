
import { Calendar } from 'fullcalendar';
import themePlugin from 'fullcalendar/themes/monarch';
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import { updateEventlog, eventlog} from './persistence/state';
import interactionPlugin from 'fullcalendar/interaction';

import { getCalendarEvents } from './persistence/state';
import { loadEventlog } from './persistence/storage';

// Kalenderinstanz zentral speichern
let calendar: Calendar | null = null;
export type CalendarEvent = {
    id: string;
    taskId: string;
    title: string;
    start: string;
    color: string;
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
        slotMinHeight: 40,
        editable:true,
        droppable:true,

        buttons: {
            zoomIn: {
            text: '+',
            click: () => zoomIn(),
            },
            zoomOut: {
            text: '-',
            click: () => zoomOut(),
            },
        },

        headerToolbar: {
            left: 'prev,next zoomIn,zoomOut',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

        eventSources: [
        {
            id: 'saved-events',
            events: await loadEventlog(),
            color: '#7952b3'
        },
        {
            id: 'other-events',
            events: getCalendarEvents(),
        }
    ],
    eventClick: (info) => {
        const event = info.event;
        const confirmed = confirm(
            `Möchtest du das Event "${event.title}" wirklich löschen?`
        );
        if (!confirmed) return;

        event.remove();

        const index = eventlog.findIndex(
            e => e.id === event.id
        );

        if (index !== -1) {
            eventlog.splice(index, 1);
            updateEventlog(eventlog);
        }
    },
        eventReceive: (info) => {
            const newEvent = info.event;

            const calendarEvent: CalendarEvent = {
                id: newEvent.id,
                taskId: String(newEvent.extendedProps.taskId),
                title: newEvent.title,
                start: newEvent.start!.toISOString(),
                color: newEvent.color,
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

const zoomLevels = [
  { duration: '01:00:00', height: 40 },
  { duration: '00:30:00', height: 40 },
  { duration: '00:15:00', height: 40 },
  { duration: '00:05:00', height: 40 },
];

let zoomIndex = 1;

function zoomIn() {
  if (zoomIndex < zoomLevels.length - 1) {
    zoomIndex++;
    applyZoom();
  }
}

function zoomOut() {
  if (zoomIndex > 0) {
    zoomIndex--;
    applyZoom();
  }
}

function applyZoom() {
  const zoom = zoomLevels[zoomIndex];
    if(calendar){
        calendar.setOption('slotDuration', zoom.duration);
        calendar.setOption('slotMinHeight', zoom.height);
    }
}
