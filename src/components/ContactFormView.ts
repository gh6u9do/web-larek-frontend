import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";


export class ContactFormView {

    protected templateId: string;
    protected events: IEvents;
    protected element: HTMLFormElement;
    protected inputs: HTMLInputElement[];
    protected errorElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    protected inputValues: Record<string, string> = {
        "email": "",
        "phone": ""
    };

    constructor(templateId: string, events: IEvents) {

        this.templateId = templateId;
        this.events = events;

        // находим темплейт, клонируем и записываем в элемент
        const template:HTMLTemplateElement = document.querySelector(`#${templateId}`);
        this.element = cloneTemplate(template);

        // находим все инпуты формы
        this.inputs = Array.from(this.element.querySelectorAll<HTMLInputElement>('.form__input'));
        // находим элемент для вывода ошибок
        this.errorElement = this.element.querySelector('.form__errors');
        // находим кнопку подтверждения
        this.submitButton = this.element.querySelector('.button');


        // вешаем обработчик на клик по кнопке
        this.submitButton.addEventListener('click', (e: MouseEvent) => {
            // отменяем дефолтное действие
            e.preventDefault();
            // инициируем события сабмита формы контактов
            this.events.emit('userContactsView:submit', (this.getInputValues()))
        })

        // вешаем обработчик на input внутри инпутов
        this.inputs.forEach((input) => {
            input.addEventListener('input', (e: KeyboardEvent) => {
                // кладем значение инпута в поле класса
                this.inputValues[input.name] = input.value; 
                // инициируем событие ввода 
                events.emit('userContactsView:input', this.getInputValues());
            })
        })

    }

    // возвращает готовую форму
    render(): HTMLElement {
        return this.element;
    }

    // активируем / деактивируем кнопку отправки
    setValid(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    // собираем значения из инпутов
    getInputValues(): Record<string, string> {
        return this.inputValues;
    }

    // показываем сообщение об ошибке
    showInputError(errorMessage: string): void {
        this.errorElement.textContent = errorMessage;
    }

    // очищаем текст ошибки
    hideInputError(): void {
        this.errorElement.textContent = "";
    }

    // деактивируем кнопку, очищаем поля, 
    refresh(): void {
        // очищаем поля
        this.inputValues = {
            "email": "", 
            "phone": ""
        };

        this.setValid(false);

        this.element.reset();
    }

}