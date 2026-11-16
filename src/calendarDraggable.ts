
import { Draggable } from 'fullcalendar/interaction';
import { backlog } from './persistence/state';
import { generateUniqueId } from './taskAndListLogik';

let draggables: Draggable[] = [];

export function initializeCalendarDraggable(): void {
    // Alte Instanzen zerstören
    destroyCalendarDraggable();
    // Alle Elemente mit der Klasse auswählen (wichtig xD)
    document.querySelectorAll<HTMLElement>('#app').forEach(container => {

        const draggable = new Draggable(container, {
            itemSelector: '.fc-draggable-task',
            appendTo: container,

            eventData: (eventEl) => {
                const originTask = backlog.tasks.find(t => t.id === eventEl.id);

                if (!originTask) {
                    return;
                }

                let myColor = null;
                let myTime = null;

                switch (originTask.priority) {
                    case 'klein':
                        myColor = '#dbc9f6';
                        break;
                    case 'mittel':
                        myColor = '#bc9aee';
                        break;
                    case 'hoch':
                        myColor = '#7952b3';
                        break;
                }

                switch (originTask.timeEstimate) {
                    case 'kurz':
                        myTime = '00:10';
                        break;
                    case 'mittel':
                        myTime = '00:30';
                        break;
                    case 'lang':
                        myTime = '02:00';
                        break;
                }

                return {
                    title: originTask.title,
                    duration: myTime,
                    color: myColor,
                    id: generateUniqueId(),
                    extendedProps: {
                        taskId: eventEl.id
                    }
                };
            }
        });

        // Instanz speichern
        draggables.push(draggable);
    });
}

export function destroyCalendarDraggable(): void {
    draggables.forEach(draggable => draggable.destroy());
    draggables = [];
}
