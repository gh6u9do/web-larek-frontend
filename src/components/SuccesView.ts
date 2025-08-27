import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";

export class SuccesView {

    protected templateId: string;
    protected events: IEvents;
    protected element: HTMLElement;
    protected actionButton: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(templateId: string, events: IEvents) {
        this.templateId = templateId;
        this.events = events;

        // находим темплейт, клонируем и записываем в элемент
        const template: HTMLTemplateElement = document.querySelector(`#${templateId}`);
        this.element = cloneTemplate(template);

        // находим кнопку
        this.actionButton = this.element.querySelector('.order-success__close');

        // находим элемент с общей суммой
        this.totalElement = this.element.querySelector('.order-success__description');
    
        
        // устанавливаем обработчик на кнопку
        this.actionButton.addEventListener('click', (e: MouseEvent) => {
            this.events.emit('succesView:submit');
        }) 
    
    }

    // возвращает DOM элемент
    render(): HTMLElement {
        return this.element
    }

    // устанавливает в строку число списанных синапсов
    setTotal(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }



}