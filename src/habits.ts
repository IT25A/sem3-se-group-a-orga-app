// @ts-ignore cal-heatmap declarations are inaccessible through its package exports map.
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import {
    habitState,
    initializeHabitsData,
    addHabit,
    removeHabit,
    updateHabit,
} from './persistence/habitsState';
import './style.css';
import './styles/habitsStyle.css';

let calInstance: any = null;

export async function renderHabitsPage(): Promise<void> {
    const app = document.getElementById('app') as HTMLDivElement;
    app.replaceChildren();

    const heading = document.createElement('h1');
    heading.textContent = 'Meine Habits';

    const heatmapContainer = document.createElement('div');
    heatmapContainer.id = 'habit-heatmap';

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

    const listContainer = document.createElement('div');
    listContainer.id = 'habit-list-container';
    listContainer.classList.add('list-card');

    const habitList = document.createElement('ul');
    habitList.id = 'habit-list';
    listContainer.appendChild(habitList);

    app.append(heading, heatmapContainer, habitForm, listContainer);

    // 1. ZUERST Daten aus der Datenbank laden!
    await initializeHabitsData();

    // 2. Danach Events, Liste und Heatmap mit den geladenen Daten rendern
    setupFormEvents(newHabitInput, addHabitBtn);
    renderHabitList();
    await initHeatmap();
}

function setupFormEvents(input: HTMLInputElement, addBtn: HTMLButtonElement): void {
    addBtn.addEventListener('click', async () => {
        const name = input.value.trim();
        if (!name) return;

        await addHabit(name);
        input.value = '';
        renderHabitList();
        await updateHeatmap();
    });
}

function renderHabitList(): void {
    const habitList = document.getElementById('habit-list') as HTMLUListElement;
    habitList.replaceChildren();

    for (const habit of habitState.habits) {
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

        minusButton.addEventListener('click', async () => {
            await updateHabit(habit.id, -1, 'minus');
            renderHabitList();
            await updateHeatmap();
        });

        plusButton.addEventListener('click', async () => {
            await updateHabit(habit.id, 1, 'plus');
            renderHabitList();
            await updateHeatmap();
        });

        deleteButton.addEventListener('click', async () => {
            await removeHabit(habit.id);
            renderHabitList();
            await updateHeatmap();
        });

        controlsDiv.append(minusButton, countSpan, plusButton, deleteButton);
        li.append(nameSpan, controlsDiv);
        habitList.appendChild(li);
    }
}

async function initHeatmap(): Promise<void> {
    if (calInstance) {
        await calInstance.destroy();
    }

    calInstance = new CalHeatmap();
    await calInstance.paint({
        itemSelector: '#habit-heatmap',
        date: { start: new Date('2026-11-01') },
        range: 12,
        domain: { type: 'month' },
        subDomain: { type: 'day', radius: 2 },
        animationDuration: 0,
        data: {
            source: [...habitState.logs],
            x: 'date',
            y: 'value',
        },
        scale: {
            color: {
                type: 'threshold',
                range: ['#ef4444', '#f97316', '#22c55e'],
                domain: [0, 0.5],
            },
        },
    });
}

async function updateHeatmap(): Promise<void> {
    if (!calInstance) return;

    const today = new Date().toISOString().split('T')[0];
    const hasTodayLog = habitState.logs.some((log) => log.date === today);

    const dataToFill = hasTodayLog
        ? [...habitState.logs]
        : [...habitState.logs, { date: today, value: null }];

    await calInstance.fill(dataToFill);
}