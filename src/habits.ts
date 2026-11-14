// @ts-ignore cal-heatmap declarations are inaccessible through its package exports map.
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import { habitState, addHabit, removeHabit, updateHabit } from './persistence/habitsState';
import './style.css';
import './styles/habitsStyle.css';

let calInstance: any = null;

export function renderHabitsPage(): void {
    const app = document.getElementById('app') as HTMLDivElement;
    app.innerHTML = `
        <h1>Meine Habits</h1>
        
        <div id="habit-heatmap"></div>

        <div class="habit-form">
            <input type="text" id="new-habit-input" placeholder="Neues Habit eingeben..." />
            <button id="add-habit-btn">Hinzufügen</button>
        </div>

        <div id="habit-list-container" class="list-card">
            <ul id="habit-list"></ul>
        </div>
    `;

    setupFormEvents();
    renderHabitList();
    initHeatmap();
}

function setupFormEvents(): void {
    const input = document.getElementById('new-habit-input') as HTMLInputElement;
    const addBtn = document.getElementById('add-habit-btn') as HTMLButtonElement;

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
    habitList.innerHTML = '';

    for (const habit of habitState.tasks) {
        const li = document.createElement('li');
        li.className = 'habit-item';

        if (habit.lastAction === 'plus') {
            li.classList.add('status-green');
        } else if (habit.lastAction === 'minus') {
            li.classList.add('status-red');
        }

        li.innerHTML = `
            <span class="habit-name">${habit.name}</span>
            <div class="habit-controls">
                <button class="btn-minus" title="Minus">-</button>
                <span class="habit-count">${habit.count}</span>
                <button class="btn-plus" title="Plus">+</button>
                <button class="btn-delete" title="Habit löschen">✕</button>
            </div>
        `;

        const minusButton = li.querySelector('.btn-minus') as HTMLButtonElement;
        const plusButton = li.querySelector('.btn-plus') as HTMLButtonElement;
        const deleteButton = li.querySelector('.btn-delete') as HTMLButtonElement;

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
                range: ['#ef4444', '#f97316', '#22c55e'],
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