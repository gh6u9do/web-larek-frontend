import { TCardItem } from "../types";
import { categoryList } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { EventEmitter, IEvents } from "./base/events";


export class CatalogCardView {
    protected templateId: string;
    protected events: IEvents;
    protected cardElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected cardId: string;


    constructor(templateId: string, events: IEvents) {
        // записываем данные из параметров в поля
        this.templateId = templateId;
        this.events = events;

        // находим темлпейт 
        const template:HTMLTemplateElement = document.querySelector(`#${templateId}`);

        // проверяем что такой темплейт существует 
        if(!template) {
            throw new Error(`Шаблон с id ${templateId} не найден!`);
        }


        // клониурем темплейт и записываем элемент в поле
        this.cardElement = cloneTemplate(template);

        // записываем элементы карточки в поля
        this.titleElement = this.cardElement.querySelector(".card__title");
        this.categoryElement = this.cardElement.querySelector(".card__category");
        this.priceElement = this.cardElement.querySelector(".card__price");
        
        this.imageElement = this.cardElement.querySelector(".card__image");
    
        // инициируем событие выбора карточки
        this.cardElement.addEventListener('click', (e) => {
            // проверяем что id записано в поле
            if(this.cardId) {
                // инициируем событие выбора карточки
                this.events.emit('card:select', {id: this.cardId});
                this.events.emit('card:openPreview');
            }
        })
    }

    // метод удаляет разметку карточки
    deleteCard() {
        this.cardElement.remove();
    }

    // метод устанавливает данные в карточку
    render(data: Partial<TCardItem>): HTMLElement {

        // перезаписываем переданные свойства
        Object.assign(this, data);

        // возвращаем карточку
        return this.cardElement;
    }

    // возвращает id карточки
    getId():string {
        return this.cardId;
    }

    // устанавливаем id карточки
    set id(id: string) {
        this.cardId = id;
    }

    // устанавливает title в карточке
    set title(title: string) {
        this.titleElement.textContent = title;
    }

    // устанавливает category в карточке 
    set category(category: string) {
        // очищаем старые классы модификаторы
        this.categoryElement.className = "card__category";
       
        // пробуем найти и установить категорию
        const categoryName = categoryList[category];
        if(categoryName) {
            this.categoryElement.classList.add(`card__category_${categoryName}`);
        }

        // устанавливаем текст
        this.categoryElement.textContent = category;
    }

    // устанавливает price в карточке 
    set price(price: number) {
        if(price) {
            this.priceElement.textContent = `${price} синапсов`;
        } else {
            this.priceElement.textContent = "Бесценно";
        }
    }

    // устанавливает картинку в карточке
    set image(imageSrc: string) {
        this.imageElement.src = imageSrc;
    }

   
}