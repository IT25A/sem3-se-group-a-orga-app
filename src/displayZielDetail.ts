
import './styles/zielDetail.css';

import { cardSliderNavigation } from './cardSlider';
import { showCardSliderForZielInContainer } from './cardSlider';
import { displayProgressBar } from './displayEditingLists';
import { calculateZielListsProgress } from './ziele';

import type { Ziel } from './displayZiele';
import type { List } from './taskAndListLogik';

import { habitState } from './persistence/habitsState';

import {
    ziellog,
    lists,
    updateZiellog
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
    const achievementButton = createAchievementButton(ziel, onBack, onEdit);
    const congratulationsMessage = ziel.completed
        ? createCongratulationsMessage(ziel)
        : null;
    const description = createDescriptionSection(ziel);
    const listSection = createListSection(ziel);
    const habitSection = createHabitSection(ziel);
    const joinedSuperHeader = document.createElement('div');
    joinedSuperHeader.append(navigation, achievementButton);
    joinedSuperHeader.className = 'ziel-detail-navigation';

   page.append(
        joinedSuperHeader,
        header
    );

    if (congratulationsMessage) {
        page.appendChild(congratulationsMessage);
    }

    page.append(
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

    const backButton = document.createElement('button');
    backButton.className = 'ziel-back-button';
    backButton.textContent = '← Alle Ziele';

    backButton.addEventListener('click', onBack);


    navigation.append(backButton);
    return backButton;
}

// ================================================
// ZIEL ALS ERREICHT MARKIEREN
// ================================================

function createAchievementButton(
    ziel: Ziel,
    onBack: () => void,
    onEdit: (ziel: Ziel, onSaved: () => void) => void
): HTMLElement {

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ziel-achievement-button';

    button.textContent = ziel.completed
        ? '✓ Ziel wieder öffnen'
        : '⚑ Ziel als erreicht markieren';

    if (ziel.completed) {
        button.classList.add('ziel-achievement-button-completed');
    }

    button.addEventListener('click', async () => {

        const updatedZiele = (ziellog ?? []).map(entry =>
            entry.id === ziel.id
                ? { ...entry, completed: !ziel.completed }
                : entry
        );

        await updateZiellog(updatedZiele);

        // Detailseite mit dem neuen Status neu anzeigen
        displayZielDetailPage(ziel.id, onBack, onEdit);
    });

    return button;
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

    const flag = document.createElement('span');
        flag.className = ziel.completed
            ? 'ziel-detail-flag ziel-detail-flag-completed'
            : 'ziel-detail-flag';

        flag.textContent = ziel.completed ? '⚑' : '🚩';

        flag.setAttribute(
            'aria-label',
            ziel.completed ? 'Ziel erreicht' : 'Ziel noch offen'
        );

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
    editButton.textContent = '✏️';

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

    const progress = displayProgressBar(calculateZielListsProgress(ziel));

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

    section.append(header, progress, sliderContainer);

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

// ================================================
// GLÜCKWUNSCH-NACHRICHT
// ================================================

function createCongratulationsMessage(ziel: Ziel): HTMLElement {

    const message = document.createElement('section');
    message.className = 'ziel-congratulations';

    const icon = document.createElement('div');
    icon.className = 'ziel-congratulations-icon';
    icon.textContent = '🎉';

    const heading = document.createElement('h2');
    heading.textContent = 'Herzlichen Glückwunsch!';

    const title = document.createElement('p');
    title.className = 'ziel-congratulations-title';
    title.textContent = `Du hast dein Ziel „${ziel.title}“ erreicht!`;

    const text = document.createElement('p');
    text.className = 'ziel-congratulations-text';
    text.textContent =
        'Du kannst unglaublich stolz auf dich sein. Du hast dir etwas vorgenommen und es geschafft! Jeder Schritt, jede Anstrengung und jedes kleine Durchhalten haben dich hierhergebracht.';

    const closing = document.createElement('strong');
    closing.className = 'ziel-congratulations-closing';
    closing.textContent = 'Feiere deinen Erfolg – du hast es verdient! 💜';

    message.append(icon, heading, title, text, closing);

    return message;
}
