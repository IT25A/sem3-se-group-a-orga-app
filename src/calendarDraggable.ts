import { Draggable } from 'fullcalendar/interaction';

let draggable: Draggable | null = null;

export function initializeCalendarDraggable(
    container: HTMLElement
): void {

    // Alte Instanz zerstören
    draggable?.destroy();

    // Neue Draggable-Instanz erstellen
    draggable = new Draggable(container, {

        itemSelector: '.fc-draggable-task',

        eventData: (eventEl) => {

            return {
                title: eventEl.textContent?.trim() ?? '',
                duration: '01:00',

                extendedProps: {
                    taskId: eventEl.id
                }
            };
        }
    });
}

export function destroyCalendarDraggable(): void {
    draggable?.destroy();
    draggable = null;
}