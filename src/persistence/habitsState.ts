import {
    saveHabitsData,
    saveHabits,
    saveHabitLogs,
    loadHabitsData,
} from './storage';

export interface Habit {
    id: string;
    name: string;
    count: number;
    lastAction?: 'plus' | 'minus';
}

export interface HabitLog {
    date: string;
    value: number;
}

interface HabitsState {
    habits: Habit[];
    logs: HabitLog[];
}

export const habitState: HabitsState = {
    habits: [],
    logs: [],
};

export async function initializeHabitsData(): Promise<void> {
    const habitData = await loadHabitsData();

    if (habitData.habits !== undefined && habitData.habitLogs !== undefined) {
        habitState.habits = habitData.habits;
        habitState.logs = habitData.habitLogs;
        return;
    }

    // Falls noch keine Daten existieren, mit leeren Arrays initialisieren
    habitState.habits = habitData.habits ?? [];
    habitState.logs = habitData.habitLogs ?? [];
    await saveHabitsData(habitState.habits, habitState.logs);
}

export async function addHabit(name: string): Promise<void> {
    habitState.habits.push({
        id: crypto.randomUUID(),
        name,
        count: 0,
    });
    await saveHabits(habitState.habits);
    await recalculateTodayLog();
}

export async function removeHabit(id: string): Promise<void> {
    habitState.habits = habitState.habits.filter((h) => h.id !== id);
    await saveHabits(habitState.habits);
    await recalculateTodayLog();
}

export async function updateHabit(
    id: string,
    delta: number,
    action: 'plus' | 'minus'
): Promise<void> {
    const habit = habitState.habits.find((h) => h.id === id);
    if (!habit) return;

    habit.count += delta;
    habit.lastAction = action;
    await saveHabits(habitState.habits);
    await recalculateTodayLog();
}

export async function recalculateTodayLog(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    if (habitState.habits.length === 0) {
        habitState.logs = habitState.logs.filter((log) => log.date !== today);
        await saveHabitLogs(habitState.logs);
        return;
    }

    const allGreen = habitState.habits.every((h) => h.lastAction === 'plus');
    const allRed = habitState.habits.every((h) => h.lastAction === 'minus');
    const anyClicked = habitState.habits.some((h) => h.lastAction !== undefined);

    if (!anyClicked) {
        habitState.logs = habitState.logs.filter((log) => log.date !== today);
        await saveHabitLogs(habitState.logs);
        return;
    }

    let statusValue = 0;
    if (allGreen) {
        statusValue = 1;
    } else if (allRed) {
        statusValue = -1;
    }

    const existingLog = habitState.logs.find((log) => log.date === today);
    if (existingLog) {
        existingLog.value = statusValue;
    } else {
        habitState.logs.push({ date: today, value: statusValue });
    }

    await saveHabitLogs(habitState.logs);
}