
import './styles/zielDetail.css';
import { cardSliderNavigation } from './cardSlider';

import type { Ziel } from './displayZiele';
import type { List } from './taskAndListLogik';

import {
    ziellog,
    lists
} from './persistence/state';

import {
    showCardSliderForZielInContainer
} from './cardSlider';


// ================================================
// ZIEL DETAILSEITE
// ================================================

export function displayZielDetailPage(
    zielId: string,
    onBack: () => void
): void {

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

    // Hauptcontainer
    const page = document.createElement('div');
    page.className = 'ziel-detail-page';

    // Navigation
    const navigation = createNavigation(onBack);

    // Zielkopf
    const header = createZielHeader(ziel);

    // Beschreibung
    const description = createDescriptionSection(ziel);

    // Zugeordnete Listen
    const listSection = createListSection(ziel);

    // Habits
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

function createZielHeader(ziel: Ziel): HTMLElement {

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

    createdAt.textContent = `Erstellt am ${date.toLocaleDateString('de-DE')}`;

    content.append(eyebrow, title, createdAt);
    header.append(flag, content);

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
        : 'Hier kannst du später deine Motivation und deine Gedanken zu diesem Ziel festhalten.';

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
    count.textContent = `${assignedLists.length} ${assignedLists.length === 1 ? 'Liste' : 'Listen'}`;

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

    const header = document.createElement('div');
    header.className = 'ziel-detail-section-header';

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Gewohnheiten';

    const count = document.createElement('span');
    count.className = 'ziel-detail-count';
    count.textContent = `${(ziel.habits ?? []).length} Habits`;

    header.append(heading, count);

    // Vorbereiteter Habit-Bereich
    const habitContainer = document.createElement('div');
    habitContainer.className = 'ziel-habit-container';

    const emptyState = document.createElement('div');
    emptyState.className = 'ziel-habit-empty';

    const icon = document.createElement('div');
    icon.className = 'ziel-habit-icon';
    icon.textContent = '🔥';

    const title = document.createElement('h3');
    title.textContent = 'Deine Gewohnheiten';

    const description = document.createElement('p');
    description.textContent =
        'Hier erscheinen später deine zugeordneten Habits und ihre Scores.';

    // Platzhalter für späteren Gesamtscore
    const score = document.createElement('div');
    score.className = 'ziel-habit-total-score';

    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'Gesamtscore';

    const scoreValue = document.createElement('strong');
    scoreValue.textContent = '—';

    score.append(scoreLabel, scoreValue);

    emptyState.append(
        icon,
        title,
        description,
        score
    );

    habitContainer.appendChild(emptyState);

    section.append(header, habitContainer);

    return section;
}
