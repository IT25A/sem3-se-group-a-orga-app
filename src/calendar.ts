

import themePlugin from 'fullcalendar/themes/monarch';
import dayGridPlugin from 'fullcalendar/daygrid';
import timeGridPlugin from 'fullcalendar/timegrid';
import listPlugin from 'fullcalendar/list';
import { updateEventlog, eventlog} from './persistence/state';
import interactionPlugin from 'fullcalendar/interaction';
import { Calendar, type EventApi } from 'fullcalendar';


import { getCalendarEvents } from './persistence/state';
import { loadEventlog } from './persistence/storage';

// Kalenderinstanz zentral speichern
let calendar: Calendar | null = null;
let isUndoing = false;
export type CalendarEvent = {
    id: string;
    taskId: string;
    title: string;
    description?: string;
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
        nowIndicator: true,
        weekNumbers: true,
        scrollTime: '09:00:00',
        dayMaxEvents: true,
        navLinks: true, //wenn man auf einen tag klickt kommt man auf tag 

        buttons: {
            zoomIn: {
            text: '+',
            click: () => zoomIn(),
            },
            zoomOut: {
            text: '-',
            click: () => zoomOut(),
            },
            undo: {
                text: '↶',
                click: () => undoLast(),
            }
        },

        headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,next today undo zoomIn zoomOut dayGridMonth,timeGridWeek,timeGridDay'
        },
        displayEventTime: false,
        eventSources: [
        {
            id: 'saved-events',
            events: await loadEventlog(),
            color: '#7952b3'
        },
        {
            id: 'other-events',
            events: getCalendarEvents(),
        },{
            id: 'night-zones',
            editable: false,
            events: [
                // 22:00 bis 24:00 – leichtes Lila
                {
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: '22:00:00',
                    endTime: '24:00:00',
                    display: 'background',
                    color: 'rgb(166, 98, 243)'
                },

                // 00:00 bis 04:00 – stärkeres Lila
                {
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: '00:00:00',
                    endTime: '04:00:00',
                    display: 'background',
                    color: 'rgb(120, 6, 251)'
                },

                // 04:00 bis 06:00 – leichtes Lila
                {
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: '04:00:00',
                    endTime: '06:00:00',
                    display: 'background',
                    color: 'rgb(166, 98, 243)'
                }
            ]
        }
    ],
    eventChange: (info) => {
        const event = info.event;

        const index = eventlog.findIndex(
            e => e.id === event.id
        );

        if (index === -1) return;

        eventlog[index] = {
            ...eventlog[index],
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
        };

        updateEventlog(eventlog);
        //undo
         // Undo darf keine neue Undo-Aktion erzeugen
        if (isUndoing) {
            saveEvent(event);
            return;
        }

        // Aktuelle Position speichern
        saveEvent(event);

        pushUndo({
            label: 'Termin verschieben',

            undo: () => {
                isUndoing = true;

                info.revert();

                isUndoing = false;

                const restored = calendar?.getEventById(event.id);

                if (restored) {
                    saveEvent(restored);
                }
            }
        });
    },
    eventMouseLeave: (info) => {
        const tooltips = document.getElementsByClassName('fc-event-tooltip')
        //HTML collection => für jedes element remove ausführen
        for(const element of tooltips){
            element.classList.remove('visible');
        }
    },
    eventDidMount: (info) => {
        createEventTooltip(info);
    },
    dateClick: (info) => {
        const title = prompt('Titel des Termins:')?.trim();

        if (!title) return;

        const description =
            prompt('Beschreibung (optional):')?.trim() ?? '';

        const start = info.date;

        const end = new Date(
            start.getTime() +
            (info.allDay ? 86400000 : 3600000)
        );

        const id = crypto.randomUUID();

        const newEvent = calendar!.addEvent({
            id,
            title,
            start,
            end,
            allDay: info.allDay,
            color: '#7952b3',

            extendedProps: {
                taskId: '',
                description,
                origin: 'manual'
            }
        });
        
        if(newEvent){saveEvent(newEvent);}

        // Undo-Aktion registrieren
        pushUndo({
            label: 'Termin erstellen',
            undo: () => {
                calendar?.getEventById(id)?.remove();
                removeEventFromLog(id);
            }
        });
    },
    eventClick: (info) => {
        const event = info.event;
        const confirmed = confirm(
            `Möchtest du das Event "${event.title}" wirklich löschen?`
        );
        if (!confirmed) return;

        const snapshot = {
            id: event.id,
            title: event.title,
            start: event.startStr,
            end: event.endStr || undefined,
            allDay: event.allDay,
            color: event.color || event.color,
            extendedProps: {
                ...event.extendedProps,
                origin: 'manual'
            }
        };

        event.remove();
        removeEventFromLog(event.id);

        pushUndo({
            label: 'Termin löschen',

            undo: () => {
                const restored = calendar?.addEvent(snapshot);

                if (restored) {
                    saveEvent(restored);
                }
            }
        });

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
//Zum erstellen von events per klick
function toStoredEvent(event: EventApi): CalendarEvent {
    return {
        id: event.id,
        taskId: String(event.extendedProps.taskId ?? ''),
        title: event.title,
        description: String(event.extendedProps.description ?? ''),
        start: event.startStr,
        end: event.endStr,
        color: event.color || event.color || '#7952b3',
        allDay: event.allDay
    };
}

function saveEvent(event: EventApi) {
    const storedEvent = toStoredEvent(event);

    const index = eventlog.findIndex(
        e => e.id === storedEvent.id
    );

    if (index === -1) {
        eventlog.push(storedEvent);
    } else {
        eventlog[index] = storedEvent;
    }

    updateEventlog(eventlog);
}

function removeEventFromLog(id: string) {
    const index = eventlog.findIndex(
        e => e.id === id
    );

    if (index !== -1) {
        eventlog.splice(index, 1);
        updateEventlog(eventlog);
    }
}

// hier folgt undo zeugs

type UndoAction = {
    label: string;
    undo: () => void;
};

const undoStack: UndoAction[] = [];

function pushUndo(action: UndoAction) {
    undoStack.push(action);

    // Maximal 50 Aktionen speichern
    if (undoStack.length > 50) {
        undoStack.shift();
    }
}

function undoLast() {
    const action = undoStack.pop();

    if (!action) return;

    action.undo();

    console.log('Rückgängig:', action.label);
}

//tooltip zeugs
function createEventTooltip(info: any) {
    const event = info.event;

    const tooltip = document.createElement('div');
    tooltip.className = 'fc-event-tooltip';

    const accent = document.createElement('div');
    accent.className = 'fc-event-tooltip-accent';
    accent.style.backgroundColor =
        event.backgroundColor || '#7952b3';

    const title = document.createElement('div');
    title.className = 'fc-event-tooltip-title';
    title.textContent = event.title;

    const time = document.createElement('div');
    time.className = 'fc-event-tooltip-time';

    if (event.allDay) {
        time.textContent = 'Ganztägig';
    } else {
        const format = (date: Date | null) =>
            date?.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            }) ?? '';

        time.textContent =
            `${format(event.start)} - ${format(event.end)}`;
    }

    const description = document.createElement('div');
    description.className =
        'fc-event-tooltip-description';

    description.textContent =
        event.extendedProps.description || '';

    tooltip.append(accent, title, time);

    if (description.textContent) {
        tooltip.append(description);
    }

    document.body.appendChild(tooltip);

    const moveTooltip = (e: MouseEvent) => {
        const offset = 14;

        let x = e.clientX + offset;
        let y = e.clientY + offset;

        const rect = tooltip.getBoundingClientRect();

        if (x + rect.width > window.innerWidth - 10) {
            x = e.clientX - rect.width - offset;
        }

        if (y + rect.height > window.innerHeight - 10) {
            y = e.clientY - rect.height - offset;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    };

    const show = (e: MouseEvent) => {
        moveTooltip(e);
        tooltip.classList.add('visible');
    };

    const hide = () => {
        tooltip.classList.remove('visible');
        refreshCalendar();
    };

    info.el.addEventListener('mouseenter', show);
    info.el.addEventListener('mousemove', moveTooltip);
    info.el.addEventListener('mouseleave', hide);

    return () => {
        info.el.removeEventListener('mouseenter', show);
        info.el.removeEventListener('mousemove', moveTooltip);
        info.el.removeEventListener('mouseleave', hide);
        tooltip.remove();
    };
}
