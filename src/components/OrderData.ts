import { IOrderFull, TBasketItem, TPayment } from "../types";
import { IEvents } from "./base/events";

// создаем интерфейс для объекта validateData
interface IValidateData {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export class OrderData { 
    protected payment: TPayment | null = null;
    protected address: string | null = null;
    protected email: string | null = null;
    protected phone: string | null = null;
    protected events: IEvents;


    constructor(events: IEvents) {
        this.events = events;
    }

    // метод записывает значение payment
    setPayment(value: TPayment): void {
        this.payment = value;

        // инициируем событие изменения
        this.events.emit("order:changed", {field: "payment", value });
    } 

    // метод возвращает записанное значение payment
    getPayment(): TPayment {
        return this.payment;
    }

    // метод записывает значение address 
    setAddress(value: string) {
        this.address = value;

        // инициируем событие изменения 
        this.events.emit("order:changed", {field: "address", value})
    }

    // метод возвращает значение address
    getAddress():string {
        return this.address;
    }

    // метод устанавливает email
    setEmail(value: string):void {
        this.email = value.trim();

        // инициируем событие изменения
        this.events.emit("order:changed", {field: "email", value});
    }

    // метод вощзвращает email
    getEmail():string {
        return this.email;
    } 

    // метод устанавливает phone
    setPhone(value: string):void {
        this.phone = value;

        // инициируем событие изменения
        this.events.emit("order:changed", {field: "phone", value});
    }

    // метод возвращает phone
    getPhone():string {
        return this.phone;
    }



    // валидация способа оплаты
    validatePayment(payment: string):boolean {
        if(payment === "online" || payment === "in getting") {
            return true;
        } else {
            return false;
        }
    }

    // валидация адреса
    validateAddress(value: string):boolean {
        // проверяем переданное значение на пустоту
        if(value.trim().length > 0 ) {
            return true;
        } else {
            return false;
        }
    }

    // валадицая почты
    validateEmail(value:string):boolean {
        // проверяем значение с помощью регулярки
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // валидация телефона
    validatePhone(value: string):boolean {
        if(value.trim().length >= 11) {
            return true;
        } else {
            return false;
        }
    }

    // обобщающая функция валидации 
    validate(data: IValidateData):boolean {
        return (
            this.validatePayment(data.payment) &&
            this.validateAddress(data.address) &&
            this.validateEmail(data.email) && 
            this.validatePhone(data.phone)
        );
    }


    // работа с заказом 


    // возвращает всю информацию о заказе
    getOrder(cards: TBasketItem[]): IOrderFull {
        return {
            payment: this.payment,
            address: this.address || "",
            email: this.email || "", 
            phone: this.phone || "",
            items: cards.map((item) => item.id),
            total: cards.reduce((accumulator, item) => accumulator + item.price, 0)
        }
    }

    // очищает всю информацию о заказе
    clear():void {
        this.payment = null;
        this.address = null;
        this.email = null;
        this.phone = null;

        // инициируем событие изменения информации о заказе
        this.events.emit("order:cleared");
    }
}