import { IEvents } from "./base/events";

export class MainPageView {

    protected containerElement: HTMLElement;
    protected events: IEvents;
    protected basketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;
    protected galleryElement: HTMLElement;

    constructor(containerSelector: string, events: IEvents) {

        this.events = events;

        // находим контейнер
        this.containerElement = document.querySelector(`.${containerSelector}`);

        // находим кнопку корзины
        this.basketButton = this.containerElement.querySelector('.header__basket');

        // находим счетчик товаров в корзине
        this.basketCounter = this.containerElement.querySelector('.header__basket-counter');

        // устанавливаем обработчик на кнопку корзины
        this.basketButton.addEventListener('click', (e:MouseEvent)=> {
            this.events.emit('mainPage:openBasket');
        })

        // находим галерею
        this.galleryElement = this.containerElement.querySelector('.gallery');
    }

    // метод очищает контейнер от карточек
    clear(): void {
        // находим контейнер с карточками и очищаем его
        this.galleryElement.innerHTML = "";
    }

    // метод устанавливает карточки в галерею
    setCards(cards: HTMLElement[]):void {
        // перебираем полученный массив и вставляем его в галерею
        cards.forEach((card) => {
            this.galleryElement.append(card);
        })
    }

    // метод устанавливает число в счетчик товаров 
    setBasketCount(count: number): void {
        // записываем значение в элемент-счетчик
        this.basketCounter.textContent = `${count}`;
    }

}