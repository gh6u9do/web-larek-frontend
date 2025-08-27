import { TPayment } from "../types";
import { paymentList } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";

export class OrderFormView {

    protected templateId: string;
    protected events: IEvents;

    protected element: HTMLFormElement;
    protected orderButtons: HTMLElement;
    protected submitButton: HTMLButtonElement;
    protected input: HTMLInputElement;
    protected errorElement: HTMLElement;

    protected payment: TPayment | null = null;
    protected address: string | null = null;

    constructor(templateId: string, events: IEvents) {
        this.events = events;
        this.templateId = templateId;

        // копируем темплейт и записываем в элемент 
        const template: HTMLTemplateElement = document.querySelector(`#${templateId}`);
        this.element = cloneTemplate(template);

        // находим форму

        // находим контейнет с кнопками выбора способа оплаты
        this.orderButtons = this.element.querySelector('.order__buttons');
        // находим submitButton
        this.submitButton = this.element.querySelector('.order__button');
        // находим все инпуты 
        this.input = this.element.querySelector('.form__input');
        // находим блок для вывода ошибок
        this.errorElement = this.element.querySelector('.form__errors');


        // делегированием вешаем обработчик на кнопки - способы оплаты
        this.orderButtons.addEventListener('click', (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            if (target.classList.contains('button_alt')) {
                // снимаем аналогичный класс с других кнопок
                const buttonsArray = this.orderButtons.querySelectorAll('.button_alt');
                if (buttonsArray.length > 0) {
                    buttonsArray.forEach((button) => {
                        button.classList.remove('button_alt-active');
                    })
                }
                // отмечаем кнопку как выбранную
                target.classList.add('button_alt-active');

                // записываем выбранное значение
                this.payment = paymentList[target.textContent] as TPayment;

                // инициируем событие ввода
                this.events.emit('orderFormView:input', {
                    "address": this.input,
                    "payment": this.payment
                });
            }
        })


        // вешаем обработчик на input
        this.input.addEventListener('input', (e: InputEvent) => {
            const target = e.target as HTMLInputElement;
            // записываем в поле значение инпута
            this.address = target.value;
            this.events.emit('orderFormView:input', {
                "address": this.input,
                "payment": this.payment
            })
        })


        // вешаем обработчик на submitButton
        this.submitButton.addEventListener('click', (e: MouseEvent) => {
            // отменяем дефолтное действие
            e.preventDefault();
            // инициируем событие подтверждение формы заказа, 
            // передаем полученную информацию
            this.events.emit('orderFormView:submit', (this.getInputValues()));
        })

    }

    // возвращает DOM элемент модалки
    render(): HTMLElement {
        return this.element;
    }

    // изменяет активность кнопки подтверждения
    setValid(isValid: boolean): void {
        if (isValid) {
            this.submitButton.disabled = false;
        } else {
            this.submitButton.disabled = true;
        }
    }

    // возвращает данные введенные/выбранные пользователем
    getInputValues(): Record<string, string> {
        return {
            payment: this.payment,
            address: this.address
        }
    }

    // отображаем переданный текст ошибки
    showInputTextError(errorText: string): void {
        this.errorElement.textContent = errorText;
    }

    // очищает значение ошибки
    hideInputError(): void {
        this.errorElement.textContent = "";
    }

    // возвращает текущий выбранный способ оплаты
    getPayment() {
        return this.payment;
    }
 
    // очищает поля, деактивируем кнопку и убираем выбор с кнопки
    refresh():void {
        // очищаем поля
        this.element.reset();
        
        // убираем класс с кнопки
        if(this.element.querySelector('.button_alt-active')) {
            this.element.querySelector('.button_alt-active').classList.remove('button_alt-active');
        }
        
        // очищаем значения в полях класса
        this.payment = null;
        this.address = null;

        // деактивируем кнопку
        this.setValid(false);
    }

}