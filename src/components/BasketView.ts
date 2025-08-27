import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";


export class BasketView {

    protected templateId: string;
    protected events: IEvents;
    protected element: HTMLElement;
    protected submitButton: HTMLButtonElement;
    protected listContainer: HTMLElement;
    protected totalElement: HTMLElement;
    protected emptyMessageElement: HTMLElement;

    constructor(templateId: string, events: IEvents) {
        this.templateId = templateId;
        this.events = events;

        // находим темплейт
        const template: HTMLTemplateElement = document.querySelector(`#${templateId}`);

        // клонируем элемент и записываем в поле
        this.element = cloneTemplate(template);
        // находим submitButton
        this.submitButton = this.element.querySelector('.basket__button');
        // находим list container
        this.listContainer = this.element.querySelector('.basket__list');
        // находим totalElement
        this.totalElement = this.element.querySelector('.basket__price');
        // находим emptyMessageElement ?????????????
        // this.emptyMessageElement = this.element.querySelector('.')
    
        // иницируем событие перехода к модалке способа оплаты
        this.submitButton.addEventListener('click', (e: MouseEvent) => {
            this.events.emit('basketView:submit');
        })
    }

    // возвращает элемент модалки
    render(): HTMLElement {
        // возвращаем элемент модалки
        return this.element
    }

    // изменяет активность  кнопки подтверждения
    setValid(isValid: boolean): void {
        // если isValid == false то даективируем кнопку 
        if (!isValid) {
            this.submitButton.disabled = true
        } else {
            this.submitButton.disabled = false; 
        }
    }

    // отображает элементы в списке корзины
    setItems(items: HTMLElement[]): void {
        // предварительно  очищаем контейнер 
        this.clearListContainer();
        // перебираем переданный массив и пушим карточки в контейнер
        items.forEach((item) => {
            this.listContainer.append(item);
        })
    }

    // устанавливает общую сумму товаров
    setTotal(total: number):void {
        this.totalElement.textContent = `${total} синапсов`;
    }

    // очищает контейнер со списком товаров
    clearListContainer(): void {
        this.listContainer.innerHTML = '';
    }
}