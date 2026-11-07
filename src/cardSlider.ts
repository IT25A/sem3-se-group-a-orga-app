import { lists} from './persistence/state'
import { renderListByIdInContainer } from './displayEditingLists'
import { app } from './main';
import './styles/cardSlider.css'

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
