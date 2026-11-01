import './dialogStyle.css';
import { removeTaskFromList, deleteTask } from './taskAndListLogik';



export function showDialogNewTask(
    listId: string,
    onCreate: (
        listId: string,
        title: string,
        description: string,
        priority: 'klein' | 'mittel' | 'hoch',
        complexity: 'einfach' | 'mittel' | 'schwierig',
        timeEstimate: 'kurz' | 'mittel' | 'lang',
        dueDate?: Date
    ) => void
): void {
    const addingTaskDialog = document.createElement('dialog');

    addingTaskDialog.innerHTML = `
        <h2>Neue Aufgabe</h2>

        <form>
            <label for="task-title">Titel</label>
            <input id="task-title" name="title" placeholder="Was möchtest du erledigen?" required />

            <label for="task-description">Beschreibung</label>
            <textarea id="task-description" name="description" placeholder="Beschreibe deine Aufgabe etwas genauer..."required></textarea>

            <label for="task-dueDate">Fälligkeit</label>
            <input id="task-dueDate" name="dueDate" type="date" />

            <label for="task-priority">Priorität</label>
            <select name="priority" id="task-priority">
                <option value="klein">Klein</option>
                <option value="mittel" selected>Mittel</option>
                <option value="hoch">Hoch</option>
            </select>

            <label for="task-complexity">Komplexität</label>
            <select name="complexity" id="task-complexity">
                <option value="einfach">Einfach</option>
                <option value="mittel" selected>Mittel</option>
                <option value="schwierig">Schwierig</option>
            </select>

            <label for="task-timeEstimate">Geschätzte Dauer</label>
            <select name="timeEstimate" id="task-timeEstimate">
                <option value="kurz">Kurz</option>
                <option value="mittel" selected>Mittel</option>
                <option value="lang">Lang</option>
            </select>

            <div class="dialog-actions">
                <button type="button" id="cancel-task">
                    Abbrechen
                </button>
                <button type="submit">Erstellen</button>
            </div>
        </form>
    `;

    document.body.appendChild(addingTaskDialog);

    const form = addingTaskDialog.querySelector('form')!;
    const cancelButton =
        addingTaskDialog.querySelector<HTMLButtonElement>(
            '#cancel-task'
        )!;

    cancelButton.addEventListener('click', () => {
        addingTaskDialog.close();
        addingTaskDialog.remove();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const title = String(formData.get('title') ?? '').trim();
        const description = String(
            formData.get('description') ?? ''
        );

        const dueDateValue = String(formData.get('dueDate') ?? '');

        const dueDate = dueDateValue
            ? new Date(`${dueDateValue}T00:00:00`)
            : undefined;

        const priority = formData.get('priority') as
            | 'klein'
            | 'mittel'
            | 'hoch';
        
        const complexity = formData.get('complexity') as
            | 'einfach'
            | 'mittel'
            | 'schwierig';

        const timeEstimate = formData.get('timeEstimate') as
            | 'kurz'
            | 'mittel'
            | 'lang';

        if (!title) return;
        if (!description) return;

        onCreate(listId, title, description, priority, complexity, timeEstimate, dueDate);

        addingTaskDialog.close();
        addingTaskDialog.remove();
    });

    addingTaskDialog.showModal();
}

//-------------------------------------------------------------------------------------------------------

export function showDialogNewList(
    onCreate: (
        title: string,
        description: string,
    ) => void
): void {
    const addingTaskDialog = document.createElement('dialog');

    addingTaskDialog.innerHTML = `
        <h2>Neue Liste</h2>

        <form>
            <label for="task-title">Titel</label>
            <input id="task-title" name="title" placeholder="Wofür möchtest du eine Liste erstellen?" required />

            <label for="task-description">Beschreibung</label>
            <textarea id="task-description" name="description" placeholder="Beschreibe etwas genauer, was in dieser Liste für Aufgaben stehen sollen..."required></textarea>

            <div class="dialog-actions">
                <button type="button" id="cancel-task">
                    Abbrechen
                </button>
                <button type="submit">Erstellen</button>
            </div>
        </form>
    `;

    document.body.appendChild(addingTaskDialog);

    const form = addingTaskDialog.querySelector('form')!;
    const cancelButton =
        addingTaskDialog.querySelector<HTMLButtonElement>(
            '#cancel-task'
        )!;

    cancelButton.addEventListener('click', () => {
        addingTaskDialog.close();
        addingTaskDialog.remove();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const title = String(formData.get('title') ?? '').trim();
        const description = String(
            formData.get('description') ?? ''
        );

        if (!title) return;
        if (!description) return;

        onCreate( title, description);

        addingTaskDialog.close();
        addingTaskDialog.remove();
    });

    addingTaskDialog.showModal();
}


//------------------------------------------------------------------------------

export function showDialogDeleteTask(
    taskId: string,
    listId: string,
    onCreate: (    

    ) => void
): void {
    const deletingTaskDialog = document.createElement('dialog');
    deletingTaskDialog.classList.add('delete-dialog');

    deletingTaskDialog.innerHTML = `
        <h2>Soll diese Aufgabe wirklich gelöscht werden?</h2>
        <p>Was möchtest du tun?</p>
            <div class="dialog-actions">
                <button type="button" id="cancel-task">
                    Abbrechen
                </button>
                <button type="button" id="delete-task-here">
                    Aufgabe aus dieser Liste entfernen
                </button>
                <button type="button" id="delete-task-everywhere">Aufgabe aus allen Listen entfernen</button>
            </div>
    `;

    document.body.appendChild(deletingTaskDialog);

    const form = deletingTaskDialog.querySelector('form')!;
    const cancelButton =
        deletingTaskDialog.querySelector<HTMLButtonElement>(
            '#cancel-task'
        )!;

    const deleteHereButton =
        deletingTaskDialog.querySelector<HTMLButtonElement>(
            '#delete-task-here'
        )!;
    const deleteEverywhereButton =
        deletingTaskDialog.querySelector<HTMLButtonElement>(
            '#delete-task-everywhere'
        )!;

    cancelButton.addEventListener('click', () => {
        deletingTaskDialog.close();
        deletingTaskDialog.remove();
    });

    deleteHereButton.addEventListener('click', () => {
        removeTaskFromList(taskId, listId);
        onCreate();
        deletingTaskDialog.close();
        deletingTaskDialog.remove();
    })

    deleteEverywhereButton.addEventListener('click', () => {
        deleteTask(taskId)
        onCreate();
        deletingTaskDialog.close();
        deletingTaskDialog.remove();
    });
    deletingTaskDialog.showModal();

}
