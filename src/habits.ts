// @ts-ignore cal-heatmap declarations are inaccessible through its package exports map.
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import { habitState, addHabit, removeHabit, updateHabit } from './persistence/habitsState';
import './style.css';
import './styles/habitsStyle.css';

let calInstance: any = null;

export function renderHabitsPage(): void {
    const app = document.getElementById('app') as HTMLDivElement;
    app.replaceChildren(); // Leert den Container sauber ohne innerHTML

    const heading = document.createElement('h1');
    heading.textContent = 'Meine Habits';

    const heatmapContainer = document.createElement('div');
    heatmapContainer.id = 'habit-heatmap';

    // Formular-Bereich erstellen
    const habitForm = document.createElement('div');
    habitForm.classList.add('habit-form');

    const newHabitInput = document.createElement('input');
    newHabitInput.type = 'text';
    newHabitInput.id = 'new-habit-input';
    newHabitInput.placeholder = 'Neues Habit eingeben...';

    const addHabitBtn = document.createElement('button');
    addHabitBtn.id = 'add-habit-btn';
    addHabitBtn.textContent = 'Hinzufügen';

    habitForm.append(newHabitInput, addHabitBtn);

    // Listen-Container erstellen
    const listContainer = document.createElement('div');
    listContainer.id = 'habit-list-container';
    listContainer.classList.add('list-card');

    const habitList = document.createElement('ul');
    habitList.id = 'habit-list';
    listContainer.appendChild(habitList);

    // Alles in #app einfügen
    app.append(heading, heatmapContainer, habitForm, listContainer);

    setupFormEvents(newHabitInput, addHabitBtn);
    renderHabitList();
    initHeatmap();
}

function setupFormEvents(input: HTMLInputElement, addBtn: HTMLButtonElement): void {
    addBtn.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) return;

        addHabit(name);
        input.value = '';
        renderHabitList();
        updateHeatmap();
    });
}

function renderHabitList(): void {
    const habitList = document.getElementById('habit-list') as HTMLUListElement;
    habitList.replaceChildren(); // Liste sauber leeren

    for (const habit of habitState.tasks) {
        const li = document.createElement('li');
        li.classList.add('habit-item');

        if (habit.lastAction === 'plus') {
            li.classList.add('status-green');
        } else if (habit.lastAction === 'minus') {
            li.classList.add('status-red');
        }

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('habit-name');
        nameSpan.textContent = habit.name;

        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('habit-controls');

        const minusButton = document.createElement('button');
        minusButton.classList.add('btn-minus');
        minusButton.title = 'Minus';
        minusButton.textContent = '-';

        const countSpan = document.createElement('span');
        countSpan.classList.add('habit-count');
        countSpan.textContent = String(habit.count);

        const plusButton = document.createElement('button');
        plusButton.classList.add('btn-plus');
        plusButton.title = 'Plus';
        plusButton.textContent = '+';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.title = 'Habit löschen';
        deleteButton.textContent = '🗑️';

        // Event-Listener direkt an die erstellten Buttons hängen
        minusButton.addEventListener('click', () => {
            updateHabit(habit.id, -1, 'minus');
            renderHabitList();
            updateHeatmap();
        });

        plusButton.addEventListener('click', () => {
            updateHabit(habit.id, 1, 'plus');
            renderHabitList();
            updateHeatmap();
        });

        deleteButton.addEventListener('click', () => {
            removeHabit(habit.id);
            renderHabitList();
            updateHeatmap();
        });

        controlsDiv.append(minusButton, countSpan, plusButton, deleteButton);
        li.append(nameSpan, controlsDiv);
        habitList.appendChild(li);
    }
}

function initHeatmap(): void {
    calInstance = new CalHeatmap();
    calInstance.paint({
        itemSelector: '#habit-heatmap',
        date: { start: new Date('2026-11-01') },
        range: 12,
        domain: { type: 'month' },
        subDomain: { type: 'day', radius: 2 },
        data: {
            source: habitState.logs,
            x: 'date',
            y: 'value',
        },
        scale: {
            color: {
                type: 'threshold',
                range: ['#f01b1b', '#f5a802', '#22c55e'],
                domain: [0, 0.5],
            },
        },
    });
}

function updateHeatmap(): void {
    if (calInstance) {
        calInstance.fill(habitState.logs);
    }
}