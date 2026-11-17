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
    tasks: Habit[];
    logs: HabitLog[];
}

export const habitState: HabitsState = {
    tasks: [],
    logs: [],
};

//Neues Habit anlegen
export function addHabit(name: string): void {
    habitState.tasks.push({
        id: crypto.randomUUID(),
        name,
        count: 0,
    });
    recalculateTodayLog();
}

//Habit löschen
export function removeHabit(id: string): void {
    habitState.tasks = habitState.tasks.filter((h) => h.id !== id);
    recalculateTodayLog();
}

//Zähler und Aktion (+ / -) aktualisieren
export function updateHabit(id: string, delta: number, action: 'plus' | 'minus'): void {
    const habit = habitState.tasks.find((h) => h.id === id);
    if (!habit) return;

    habit.count += delta;
    habit.lastAction = action;
    recalculateTodayLog();
}

//Berechnet die Farbe für den heutigen Tag in der Heatmap neu
export function recalculateTodayLog(): void {
    const today = new Date().toISOString().split('T')[0];

    // Wenn keine Habits mehr existieren, heutigen Log-Eintrag entfernen
    if (habitState.tasks.length === 0) {
        habitState.logs = habitState.logs.filter((log) => log.date !== today);
        return;
    }

    const allGreen = habitState.tasks.every((h) => h.lastAction === 'plus');
    const allRed = habitState.tasks.every((h) => h.lastAction === 'minus');
    const anyClicked = habitState.tasks.some((h) => h.lastAction !== undefined);

    //Noch kein Button wurde heute gedrückt -> Tag bleibt leer
    if (!anyClicked) {
        habitState.logs = habitState.logs.filter((log) => log.date !== today);
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
}