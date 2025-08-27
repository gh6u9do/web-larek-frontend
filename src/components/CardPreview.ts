import { ICardViewItem } from "../types";
import { categoryList } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";


export class CardPreview {

    protected templateId: string;
    protected events: IEvents;

    protected element: HTMLElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected priceElement: HTMLElement;
    protected actionButton: HTMLButtonElement;

    constructor(templateId: string, events: IEvents) {
        // записываем значения из параметров
        this.templateId = templateId;
        this.events = events;

        // находим темплейт
        const template: HTMLTemplateElement = document.querySelector(`#${templateId}`);

        // проверяем что такой темплейт существует
        if (!template) {
            throw new Error(`темлейт с id ${templateId} не найден`);
        }

        // клонируем элемент и записываем в поле
        this.element = cloneTemplate(template);

        // записываем элементы карточки в поля
        this.categoryElement = this.element.querySelector('.card__category');
        this.titleElement = this.element.querySelector('.card__title');
        this.descriptionElement = this.element.querySelector('.card__text');
        this.imageElement = this.element.querySelector('.card__image');
        this.priceElement = this.element.querySelector('.card__price');
        this.actionButton = this.element.querySelector('.card__button');


        // навешиваем обработчик на кнопку
        this.actionButton.addEventListener('click', (e) => {
            if (this.actionButton.textContent === "Купить") {
                // эмитим событие добавления в корзину
                this.events.emit('cardPreview:addItemInBasket', { id: this.actionButton.dataset.id });
            } else if (this.actionButton.textContent === "Удалить из корзины") {
                // эмитим события удаления из корзины
                this.events.emit('cardPreview:removeItemInBasket', { id: this.actionButton.dataset.id });
            }
        })
    }

    // метод возвращает элемент карточки
    render() {
        // возвращаем элемент
        return this.element;
    }

    // метод устанавливает данные в модалке 
    setData(data: ICardViewItem): void {
        this.categoryElement.textContent = data.category;
        this.categoryElement.className = `card__category card__category_${categoryList[data.category]}`;
        this.titleElement.textContent = data.title;
        this.descriptionElement.textContent = data.description;
        this.imageElement.src = data.image;
        this.imageElement.alt = data.title;

        // проверяем цену товара
        if(data.price){
            // если цена есть - отображаем
            this.actionButton.disabled = false;
            this.priceElement.textContent = `${data.price} синапсов`;
        } else {
            // если цены нет - делаем кнопку недоступной
            this.actionButton.textContent = `Недоступно`;
            this.actionButton.disabled = true;


            // делаем товар бесценным
            this.priceElement.textContent = `Бесценно`;
            
        }

        this.actionButton.textContent = data.inBasket ? "Удалить из корзины" : "Купить";
        this.actionButton.dataset.id = data.id;
    }

   setButtonState(inBasket: boolean) {
        if(inBasket) {
            this.actionButton.textContent = "Удалить из корзины";
        } else {
            this.actionButton.textContent = "Купить";
        }    
   }
}