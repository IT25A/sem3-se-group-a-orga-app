
import './styles/ziele.css';
import { displayZielDetailPage } from './displayZielDetail';

import type { List } from './taskAndListLogik';
import { lists, ziellog, updateZiellog } from './persistence/state';
import { habitState } from './persistence/habitsState';

// --------------------------------
// DATENTYP
// --------------------------------

export type ZielHabitSettings = {
    target: number;
    endDate?: string;
};

export type Ziel = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    lists: string[];
    habits: string[];
    habitGoals?: Record<string, ZielHabitSettings>;
};

// --------------------------------
// ZIELE SEITE ANZEIGEN
// --------------------------------

export function displayZielePage(zielId?: string): void {
    const app = document.getElementById('app') as HTMLDivElement | null;

    if (!app) return;

    app.replaceChildren();

    if (zielId) {
        displayZielDetailPage(
            zielId,
            () => displayZielePage(),
            (ziel, onSaved) => showZielDialog(ziel, onSaved)
        );
        return;
    }

    renderZieleOverview(app);
}

// --------------------------------
// ÜBERSICHT
// --------------------------------

function renderZieleOverview(app: HTMLDivElement): void {

    // Seitenkopf
    const heading = document.createElement('h1');
    heading.textContent = 'Meine Ziele';
    heading.className = 'ziele-heading';

    const description = document.createElement('p');
    description.textContent = 'Was möchtest du erreichen? Hier behältst du deine Ziele im Blick.';
    description.className = 'ziele-description';

    // Neues Ziel
    const createCard = document.createElement('section');
    createCard.className = 'ziel-create-card';

    const createTitle = document.createElement('h2');
    createTitle.textContent = 'Neues Ziel setzen';

    const createForm = document.createElement('form');
    createForm.className = 'ziel-create-form';

    const newZielInput = document.createElement('input');
    newZielInput.type = 'text';
    newZielInput.id = 'new-ziel-input';
    newZielInput.placeholder = 'Was möchtest du erreichen?';
    newZielInput.maxLength = 120;
    newZielInput.required = true;

    const addZielBtn = document.createElement('button');
    addZielBtn.type = 'submit';
    addZielBtn.className = 'ziel-add-button';
    addZielBtn.textContent = '+';

    addZielBtn.setAttribute('aria-label', 'Neues Ziel hinzufügen');

    createForm.append(newZielInput, addZielBtn);
    createCard.append(createTitle, createForm);

    // Zielliste
    const zielSection = document.createElement('section');
    zielSection.className = 'ziel-section';

    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'ziel-section-header';

    const listHeading = document.createElement('h2');
    listHeading.textContent = 'Deine Ziele';

    const zielCount = document.createElement('span');
    zielCount.className = 'ziel-count';
    zielCount.textContent = String((ziellog ?? []).length);

    sectionHeader.append(listHeading, zielCount);

    const zielContainer = document.createElement('div');
    zielContainer.className = 'ziel-container';

    const zielList = document.createElement('ul');
    zielList.className = 'ziel-list';

    zielContainer.appendChild(zielList);
    zielSection.append(sectionHeader, zielContainer);

    app.append(
        heading,
        description,
        createCard,
        zielSection
    );

    // Neues Ziel anlegen
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = newZielInput.value.trim();

        if (!title) return;

        const newZiel: Ziel = {
            id: crypto.randomUUID(),
            title,
            description: '',
            createdAt: new Date(),
            lists: [],
            habits: []
        };

        const newZiele = [...(ziellog ?? []), newZiel];

        await updateZiellog(newZiele);

        displayZielePage();
    });

    renderZielListInContainer(zielList);
}

// --------------------------------
// ZIELE RENDERN
// --------------------------------

function renderZielListInContainer(
    container: HTMLUListElement
): void {

    container.replaceChildren();

    const ziele = ziellog ?? [];

    if (ziele.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'ziel-empty-state';

        const icon = document.createElement('div');
        icon.className = 'ziel-empty-icon';
        icon.textContent = '🚩';

        const title = document.createElement('h3');
        title.textContent = 'Noch keine Ziele gesetzt';

        const text = document.createElement('p');
        text.textContent = 'Jede große Veränderung beginnt mit einem Ziel. Was möchtest du erreichen?';

        emptyState.append(icon, title, text);
        container.appendChild(emptyState);

        return;
    }

    ziele.forEach(ziel => {

        const item = document.createElement('li');
        item.className = 'ziel-item';

        // Klickbarer Zielbereich
        const zielMain = document.createElement('div');
        zielMain.className = 'ziel-main';
        zielMain.tabIndex = 0;
        zielMain.setAttribute('role', 'button');
        zielMain.setAttribute('aria-label', `Details zu ${ziel.title} öffnen`);

        const flag = document.createElement('span');
        flag.className = 'ziel-flag';
        flag.textContent = '🚩';

        const content = document.createElement('div');
        content.className = 'ziel-content';

        const title = document.createElement('h3');
        title.className = 'ziel-title';
        title.textContent = ziel.title;

        const listInfo = document.createElement('p');
        listInfo.className = 'ziel-list-info';

        const assignedLists = (ziel.lists ?? [])
            .map(id => lists.find(list => list.id === id))
            .filter((list): list is List => list !== undefined);

        if (assignedLists.length > 0) {
            listInfo.textContent = assignedLists
                .map(list => list.title)
                .join(' · ');
        } else {
            listInfo.textContent = 'Noch keine Listen zugeordnet';
        }

        content.append(title, listInfo);

        const arrow = document.createElement('span');
        arrow.className = 'ziel-arrow';
        arrow.textContent = '>';

        zielMain.append(flag, content, arrow);

        // Verwaltungsbuttons
        const actions = document.createElement('div');
        actions.className = 'ziel-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'edit-button';
        editButton.textContent = '✏️';
        editButton.setAttribute('aria-label', 'Ziel bearbeiten');

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '🗑️';
        deleteButton.setAttribute('aria-label', 'Ziel löschen');

        actions.append(editButton, deleteButton);

        item.append(zielMain, actions);

        // Ziel öffnen
        const openDetail = () => displayZielePage(ziel.id);

        zielMain.addEventListener('click', openDetail);

        zielMain.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openDetail();
            }
        });

        // Bearbeiten
        editButton.addEventListener('click', event => {
            event.stopPropagation();
            showZielDialog(ziel);
        });

        // Löschen
        deleteButton.addEventListener('click', async event => {
            event.stopPropagation();

            const confirmed = window.confirm(
                `Möchtest du das Ziel "${ziel.title}" wirklich löschen?`
            );

            if (!confirmed) return;

            const newZiele = (ziellog ?? []).filter(
                entry => entry.id !== ziel.id
            );

            await updateZiellog(newZiele);

            displayZielePage();
        });

        container.appendChild(item);
    });
}

// --------------------------------
// ZIEL BEARBEITEN
// --------------------------------


function showZielDialog(
    ziel: Ziel,
    onSaved: () => void = () => displayZielePage()
): void {

    const dialog = document.createElement('dialog');
    dialog.className = 'ziel-dialog';

    const form = document.createElement('form');
    form.className = 'ziel-dialog-form';

    const heading = document.createElement('h2');
    heading.textContent = 'Ziel bearbeiten';


    // ================================================
    // TITEL
    // ================================================

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Ziel';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = ziel.title;
    titleInput.maxLength = 120;
    titleInput.required = true;

    titleLabel.appendChild(titleInput);


    // ================================================
    // BESCHREIBUNG
    // ================================================

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Beschreibung';

    const descriptionInput = document.createElement('textarea');
    descriptionInput.value = ziel.description ?? '';
    descriptionInput.placeholder =
        'Was möchtest du mit diesem Ziel erreichen?';

    descriptionLabel.appendChild(descriptionInput);


    // ================================================
    // LISTEN ZUORDNEN
    // ================================================

    const listHeading = document.createElement('h3');
    listHeading.textContent = 'Zugeordnete Listen';

    const listContainer = document.createElement('div');
    listContainer.className = 'ziel-list-selection';

    if (lists.length === 0) {
        const noLists = document.createElement('p');
        noLists.textContent = 'Du hast noch keine Listen angelegt.';
        listContainer.appendChild(noLists);
    }

    lists.forEach(list => {

        const label = document.createElement('label');
        label.className = 'ziel-list-option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = list.id;
        checkbox.checked = (ziel.lists ?? []).includes(list.id);

        const name = document.createElement('span');
        name.textContent = list.title;

        label.append(checkbox, name);
        listContainer.appendChild(label);
    });


    // ================================================
    // HABITS ZUORDNEN
    // ================================================

    const habitHeading = document.createElement('h3');
    habitHeading.textContent = 'Zugeordnete Habits';

    const habitDescription = document.createElement('p');
    habitDescription.className = 'ziel-dialog-habit-description';
    habitDescription.textContent =
        'Wähle deine Habits aus und lege für dieses Ziel eigene Fortschrittswerte fest.';

    const habitContainer = document.createElement('div');
    habitContainer.className = 'ziel-habit-selection';

    const habitInputs: HTMLInputElement[] = [];

    const habitTargetInputs = new Map<
        string,
        HTMLInputElement
    >();

    const habitEndDateInputs = new Map<
        string,
        HTMLInputElement
    >();

    if (habitState.habits.length === 0) {

        const noHabits = document.createElement('p');
        noHabits.textContent =
            'Du hast noch keine Habits angelegt.';

        habitContainer.appendChild(noHabits);
    }

    habitState.habits.forEach(habit => {

        const settings = ziel.habitGoals?.[habit.id];

        const wrapper = document.createElement('div');
        wrapper.className = 'ziel-habit-option';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = habit.id;
        checkbox.checked = (ziel.habits ?? []).includes(habit.id);

        // Habit-Name
        const name = document.createElement('span');
        name.className = 'ziel-habit-option-name';
        name.textContent = habit.name;

        // Zielwert
        const targetLabel = document.createElement('label');
        targetLabel.className = 'ziel-habit-input-label';
        targetLabel.textContent = 'Anzahl';

        const targetInput = document.createElement('input');
        targetInput.type = 'number';
        targetInput.min = '1';
        targetInput.step = '1';
        targetInput.placeholder = 'z. B. 50';

        if (settings?.target !== undefined) {
            targetInput.value = String(settings.target);
        }

        targetLabel.appendChild(targetInput);

        // Optionales Enddatum
        const dateLabel = document.createElement('label');
        dateLabel.className = 'ziel-habit-input-label';
        dateLabel.textContent = 'Enddatum (optional)';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';

        if (settings?.endDate) {
            dateInput.value = settings.endDate;
        }

        dateLabel.appendChild(dateInput);

        // Eingabefelder nur bei ausgewähltem Habit aktivieren
        targetInput.disabled = !checkbox.checked;
        dateInput.disabled = !checkbox.checked;

        checkbox.addEventListener('change', () => {
            targetInput.disabled = !checkbox.checked;
            dateInput.disabled = !checkbox.checked;
        });

        habitInputs.push(checkbox);
        habitTargetInputs.set(habit.id, targetInput);
        habitEndDateInputs.set(habit.id, dateInput);

        wrapper.append(
            checkbox,
            name,
            targetLabel,
            dateLabel
        );

        habitContainer.appendChild(wrapper);
    });


    // ================================================
    // BUTTONS
    // ================================================

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'ziel-dialog-actions';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Abbrechen';
    cancelButton.className = 'ziel-cancel-button';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Speichern';
    saveButton.className = 'ziel-save-button';

    buttonContainer.append(cancelButton, saveButton);


    // ================================================
    // FORM ZUSAMMENBAUEN
    // ================================================

    form.append(
        heading,
        titleLabel,
        descriptionLabel,
        listHeading,
        listContainer,
        habitHeading,
        habitDescription,
        habitContainer,
        buttonContainer
    );

    dialog.appendChild(form);
    document.body.appendChild(dialog);


    // ================================================
    // ABBRECHEN
    // ================================================

    cancelButton.addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('close', () => {
        dialog.remove();
    });


    // ================================================
    // SPEICHERN
    // ================================================

    form.addEventListener('submit', async event => {

        event.preventDefault();

        const newTitle = titleInput.value.trim();

        if (!newTitle) return;

        // Listen
        const selectedLists = Array.from(
            listContainer.querySelectorAll<HTMLInputElement>(
                'input[type="checkbox"]:checked'
            )
        ).map(checkbox => checkbox.value);


        // Habits
        const selectedHabits = habitInputs
            .filter(input => input.checked)
            .map(input => input.value);

        const habitGoals: NonNullable<Ziel['habitGoals']> = {};

        for (const habitId of selectedHabits) {

            const targetInput = habitTargetInputs.get(habitId);
            const dateInput = habitEndDateInputs.get(habitId);

            const targetValue = targetInput?.value.trim() ?? '';
            const endDateValue = dateInput?.value ?? '';

            // Ohne Zielwert wird für dieses Habit kein Fortschrittsziel gespeichert.
            if (targetValue === '') continue;

            const target = Number(targetValue);

            if (
                !Number.isInteger(target) ||
                target <= 0
            ) {
                targetInput?.setCustomValidity(
                    'Bitte gib eine positive ganze Zahl ein.'
                );
                targetInput?.reportValidity();
                return;
            }

            const settings: {
                target: number;
                endDate?: string;
            } = {
                target
            };

            if (endDateValue) {
                settings.endDate = endDateValue;
            }

            habitGoals[habitId] = settings;
        }


        // Alle Ziele aktualisieren
        const updatedZiele = (ziellog ?? []).map(entry => {

            if (entry.id !== ziel.id) return entry;

            return {
                ...entry,
                title: newTitle,
                description: descriptionInput.value.trim(),
                lists: selectedLists,
                habits: selectedHabits,
                habitGoals
            };
        });

        saveButton.disabled = true;

        try {
            await updateZiellog(updatedZiele);

            dialog.close();
            onSaved();

        } catch (error) {
            console.error(
                'Ziel konnte nicht gespeichert werden:',
                error
            );

            saveButton.disabled = false;
        }
    });


    // Validierung nach Änderungen wieder zurücksetzen
    habitTargetInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });

    dialog.showModal();
}
