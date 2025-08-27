import { TBasketItem } from "../types";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";


export class BasketCardView {

    protected templateId: string;
    protected events: IEvents;
    protected element: HTMLElement; 
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected removeButton: HTMLButtonElement;


    constructor(templateId: string, events: IEvents) {
        // записываем events
        this.events = events;

        // записываем элемент
        const template:HTMLTemplateElement = document.querySelector(`#${templateId}`);
        this.element = cloneTemplate(template);

        // находим индекс товара в корзине
        this.indexElement = this.element.querySelector('.basket__item-index');
        // находим название карточки 
        this.titleElement = this.element.querySelector('.card__title');
        // находим поле с ценой товара
        this.priceElement = this.element.querySelector('.card__price');
    
        // устанавливаем обработчик клика на кнопку удаления
        this.removeButton = this.element.querySelector('.basket__item-delete');
        this.removeButton.addEventListener('click', (e: MouseEvent) => {
            this.events.emit('basketCardView:removeItem', {id: this.removeButton.dataset.id});
        })
        
    }

    // возвращает элемент 
    render():HTMLElement {
        return this.element;
    }

    // заполняет карточку данными
    setData(data: TBasketItem, indexNumber: number): void {
        // устанавливаем номер товара
        this.indexElement.textContent = `${indexNumber}`;
        // устанавливаем название карточки
        this.titleElement.textContent = data.title;
        // устанавливаем цену карточки
        this.priceElement.textContent = `${data.price} синапсов`;
        // устанавливаем id в dataset кнопки
        this.removeButton.dataset.id = data.id;
    }

}