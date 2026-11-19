
import './styles/zielDetail.css';

import { cardSliderNavigation } from './cardSlider';
import { showCardSliderForZielInContainer } from './cardSlider';

import type { Ziel } from './displayZiele';
import type { List } from './taskAndListLogik';

import { habitState } from './persistence/habitsState';

import {
    ziellog,
    lists
} from './persistence/state';


// ================================================
// ZIEL DETAILSEITE
// ================================================

let currentZielDetail: {
    zielId: string;
    onBack: () => void;
    onEdit: (ziel: Ziel, onSaved: () => void) => void;
} | null = null;

export function displayZielDetailPage(
    zielId: string,
    onBack: () => void,
    onEdit: (ziel: Ziel, onSaved: () => void) => void
): void {

    currentZielDetail = {
        zielId,
        onBack,
        onEdit
    };

    const app = document.getElementById('app') as HTMLDivElement | null;

    if (!app) return;

    const ziel = (ziellog ?? []).find(
        entry => entry.id === zielId
    );

    if (!ziel) {
        onBack();
        return;
    }

    app.replaceChildren();

    const page = document.createElement('div');
    page.className = 'ziel-detail-page';

    const navigation = createNavigation(onBack);
    const header = createZielHeader(ziel, onEdit, onBack);
    const description = createDescriptionSection(ziel);
    const listSection = createListSection(ziel);
    const habitSection = createHabitSection(ziel);

    page.append(
        navigation,
        header,
        description,
        listSection,
        habitSection
    );

    app.appendChild(page);

    cardSliderNavigation();
}


// ================================================
// NAVIGATION
// ================================================

function createNavigation(onBack: () => void): HTMLElement {

    const navigation = document.createElement('div');
    navigation.className = 'ziel-detail-navigation';

    const backButton = document.createElement('button');
    backButton.className = 'ziel-back-button';
    backButton.textContent = '← Alle Ziele';

    backButton.addEventListener('click', onBack);

    navigation.appendChild(backButton);

    return navigation;
}


// ================================================
// ZIELKOPF
// ================================================

function createZielHeader(
    ziel: Ziel,
    onEdit: (ziel: Ziel, onSaved: () => void) => void,
    onBack: () => void
): HTMLElement {

    const header = document.createElement('section');
    header.className = 'ziel-detail-header';

    const flag = document.createElement('div');
    flag.className = 'ziel-detail-flag';
    flag.textContent = '🚩';

    const content = document.createElement('div');
    content.className = 'ziel-detail-heading-content';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'ziel-detail-eyebrow';
    eyebrow.textContent = 'MEIN PERSÖNLICHES ZIEL';

    const title = document.createElement('h1');
    title.textContent = ziel.title;

    const createdAt = document.createElement('p');
    createdAt.className = 'ziel-created-at';

    const date = new Date(ziel.createdAt);

    createdAt.textContent =
        `Erstellt am ${date.toLocaleDateString('de-DE')}`;

    content.append(eyebrow, title, createdAt);

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'ziel-detail-edit-button';
    editButton.textContent = '✏️ Ziel bearbeiten';

    editButton.addEventListener('click', () => {
        onEdit(ziel, () => {
            displayZielDetailPage(ziel.id, onBack, onEdit);
        });
    });

    header.append(flag, content, editButton);

    return header;
}


// ================================================
// BESCHREIBUNG
// ================================================

function createDescriptionSection(ziel: Ziel): HTMLElement {

    const section = document.createElement('section');
    section.className = 'ziel-description-section';

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Motivation';

    const description = document.createElement('p');

    description.textContent = ziel.description?.trim()
        ? ziel.description
        : 'Hier kannst du deine Motivation und deine Gedanken zu diesem Ziel festhalten.';

    if (!ziel.description?.trim()) {
        description.classList.add('ziel-description-placeholder');
    }

    section.append(heading, description);

    return section;
}


// ================================================
// LISTENBEREICH
// ================================================

function createListSection(ziel: Ziel): HTMLElement {

    const section = document.createElement('section');
    section.className = 'ziel-lists-section';

    const assignedLists: List[] = (ziel.lists ?? [])
        .map(listId => lists.find(list => list.id === listId))
        .filter((list): list is List => list !== undefined);

    const header = document.createElement('div');
    header.className = 'ziel-detail-section-header';

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Listen';

    const count = document.createElement('span');
    count.className = 'ziel-detail-count';
    count.textContent =
        `${assignedLists.length} ${assignedLists.length === 1 ? 'Liste' : 'Listen'}`;

    header.append(heading, count);

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'ziel-lists-slider-container';

    if (assignedLists.length === 0) {

        const emptyState = document.createElement('div');
        emptyState.className = 'ziel-detail-empty';

        const icon = document.createElement('span');
        icon.textContent = '📂';

        const text = document.createElement('p');
        text.textContent = 'Diesem Ziel sind noch keine Listen zugeordnet.';

        emptyState.append(icon, text);
        sliderContainer.appendChild(emptyState);

    } else {

        showCardSliderForZielInContainer(
            sliderContainer,
            assignedLists
        );
    }

    section.append(header, sliderContainer);

    return section;
}


// ================================================
// HABITBEREICH
// ================================================

function createHabitSection(ziel: Ziel): HTMLElement {

    const section = document.createElement('section');
    section.className = 'ziel-habits-section';

    // Zugeordnete Habits anhand ihrer IDs suchen
    const assignedHabits = (ziel.habits ?? [])
        .map(habitId =>
            habitState.habits.find(habit => habit.id === habitId)
        )
        .filter(
            (habit): habit is typeof habitState.habits[number] =>
                habit !== undefined
        );

    const header = document.createElement('div');
    header.className = 'ziel-detail-section-header';

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Gewohnheiten';

    const count = document.createElement('span');
    count.className = 'ziel-detail-count';

    count.textContent =
        `${assignedHabits.length} ${
            assignedHabits.length === 1 ? 'Habit' : 'Habits'
        }`;

    header.append(heading, count);

    const habitContainer = document.createElement('div');
    habitContainer.className = 'ziel-habit-grid';

    if (assignedHabits.length === 0) {

        const emptyState = document.createElement('div');
        emptyState.className = 'ziel-habit-empty';

        const icon = document.createElement('div');
        icon.className = 'ziel-habit-icon';
        icon.textContent = '🔥';

        const title = document.createElement('h3');
        title.textContent = 'Noch keine Habits zugeordnet';

        const description = document.createElement('p');
        description.textContent =
            'Bearbeite dein Ziel, um passende Gewohnheiten hinzuzufügen.';

        emptyState.append(icon, title, description);
        habitContainer.appendChild(emptyState);

    } else {

        assignedHabits.forEach(habit => {

            const settings = ziel.habitGoals?.[habit.id];
            const target = settings?.target;
            const currentCount = Math.max(0, habit.count);

            const card = document.createElement('article');
            card.className = 'ziel-habit-card';

            // Habit-Name
            const name = document.createElement('h3');
            name.className = 'ziel-habit-name';
            name.textContent = habit.name;

            // Score
            const score = document.createElement('div');
            score.className = 'ziel-habit-score';

            const current = document.createElement('strong');
            current.textContent = String(currentCount);

            score.appendChild(current);

            const progressTrack = document.createElement('div');
            progressTrack.className = 'ziel-habit-progress-track';

            const progressBar = document.createElement('div');
            progressBar.className = 'ziel-habit-progress-bar';

            const progressText = document.createElement('p');
            progressText.className = 'ziel-habit-progress-text';

            if (target !== undefined && target > 0) {

                const percentage = Math.min(
                    100,
                    (currentCount / target) * 100
                );

                const targetText = document.createElement('span');
                targetText.textContent = `/ ${target}`;

                score.appendChild(targetText);

                progressBar.style.width = `${percentage}%`;

                progressText.textContent =
                    `${Math.round(percentage)} % erreicht`;

                if (currentCount >= target) {
                    card.classList.add('ziel-habit-completed');
                    progressText.textContent = '🎉 Ziel erreicht!';
                }

            } else {

                progressText.textContent =
                    'Noch kein persönliches Ziel festgelegt';

                progressBar.style.width = '0%';
            }

            progressTrack.appendChild(progressBar);

            card.append(
                name,
                score,
                progressTrack,
                progressText
            );

            // Optionales Enddatum
            if (settings?.endDate) {

                const endDate = document.createElement('p');
                endDate.className = 'ziel-habit-end-date';

                const date = new Date(`${settings.endDate}T00:00:00`);

                endDate.textContent =
                    `Bis ${date.toLocaleDateString('de-DE')}`;

                card.appendChild(endDate);
            }

            habitContainer.appendChild(card);
        });
    }

    section.append(header, habitContainer);

    return section;
}

export function refreshZielDetailPage(): void {
    if (!currentZielDetail) {
        console.error('Kein aktuelles Ziel gespeichert!');
        return;
    }

    const { zielId, onBack, onEdit } = currentZielDetail;

    console.log('Rendere Ziel erneut:', zielId);
    console.log('Gefundene Ziele:', ziellog);

    displayZielDetailPage(zielId, onBack, onEdit);
}
