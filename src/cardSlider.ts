import { lists, backlog} from './persistence/state'
import { renderListByIdInContainer } from './displayEditingLists'
import { app } from './main';
import './styles/cardSlider.css'
import type { List } from './taskAndListLogik';

export function showCardSliderForListsInContainer(container: HTMLDivElement): void {
    container.classList.add('card-slider');

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Listen';
    container.appendChild(heading);

    const leftArrow = document.createElement('button');
    leftArrow.id = 'previous-card';
    leftArrow.classList.add('card-slider-arrow');
    leftArrow.textContent = '<';
    

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    for(const list of lists) {
        const card = document.createElement('div');
        card.classList.add('slidable-card');
        renderListByIdInContainer(list.id, card, false);
        cardContainer.append(card);
    }

    const rightArrow = document.createElement('button');
    rightArrow.id = 'next-card';
    rightArrow.classList.add('card-slider-arrow');
    rightArrow.textContent = '>';
    container.append(leftArrow, cardContainer, rightArrow);
    app.insertBefore(container, app.querySelector('.zitat-card'));
}


export function cardSliderNavigation(): void {
    const cards = document.querySelectorAll<HTMLElement>(
        ".slidable-card"
    );

    const prevButton = document.getElementById("previous-card");
    const nextButton = document.getElementById("next-card");

    if (cards.length === 0) return;

    let currentIndex = 0;

    function showCard(index: number): void {
        cards.forEach((card, i) => {
            card.classList.toggle("active", i === index);
        });
    }

    function nextCard(): void {
        currentIndex = (currentIndex + 1) % cards.length;
        showCard(currentIndex);
    }

    function previousCard(): void {
        currentIndex =
            (currentIndex - 1 + cards.length) % cards.length;

        showCard(currentIndex);
    }

    nextButton?.addEventListener("click", nextCard);
    prevButton?.addEventListener("click", previousCard);

    showCard(currentIndex);
}
//ganz obere Funktion kann evtl später weg, falls slider nur noch auf displayZiel


export function showCardSliderForZielInContainer(
    container: HTMLDivElement,
    zielLists: List[]
): void {
    container.classList.add('card-slider', 'ziel-card-slider');

    const heading = document.createElement('h2');
    heading.textContent = 'Meine Listen';

    const leftArrow = document.createElement('button');
    leftArrow.id = 'previous-card';
    leftArrow.className = 'card-slider-arrow';
    leftArrow.textContent = '<';
    leftArrow.setAttribute('aria-label', 'Vorherige Liste');

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    zielLists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'slidable-card';

        // Prüfen, ob alle Aufgaben dieser Liste erledigt sind
        const isCompleted =
            list.tasks.length > 0 &&
            list.tasks.every(taskId => {
                const task = backlog.tasks.find(
                    task => task.id === taskId
                );

                return task?.completed === true;
            });

        if (isCompleted) {
            const successCard = document.createElement('article');
            successCard.className = 'ziel-list-completed-content';

            const icon = document.createElement('div');
            icon.className = 'ziel-list-completed-icon';
            icon.textContent = '🎉';

            const message = document.createElement('h3');
            message.textContent = 'Geschafft!';

            const title = document.createElement('h4');
            title.textContent = list.title;

            const motivation = document.createElement('p');
            motivation.textContent =
                'Du hast alle Aufgaben dieser Liste erledigt. Sei stolz auf dich und mach weiter so!';

            successCard.append(icon, message, title, motivation);

            if (list.description?.trim()) {
                const description = document.createElement('p');
                description.className = 'ziel-list-completed-description';
                description.textContent = list.description;
                successCard.appendChild(description);
            }

            card.appendChild(successCard);
        } else {
            renderListByIdInContainer(list.id, card, false);
        }

        cardContainer.appendChild(card);
    });

    const rightArrow = document.createElement('button');
    rightArrow.id = 'next-card';
    rightArrow.className = 'card-slider-arrow';
    rightArrow.textContent = '>';
    rightArrow.setAttribute('aria-label', 'Nächste Liste');

    container.append(heading, leftArrow, cardContainer, rightArrow);
}