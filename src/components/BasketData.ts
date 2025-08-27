import { TBasketItem } from "../types";
import { IEvents } from "./base/events";

export class BasketData {
    protected items: TBasketItem[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        // записываем экземпляр EventEmitter в поле класса
        this.events = events;
    }

    // проверяет наличие товара в коризне
    hasItem(itemId: string):boolean {
        return this.items.some((item) => item.id === itemId );
    }

    // метод возвращает общую сумму товаров в корзине
    getTotal():number {
        return this.items.reduce((accumulator, value) => accumulator + value.price, 0);    
    }

    // метод возвращает количество товаров в корзине
    getItemsCount():number {
        return this.items.length;
    }

    // метод возвращает массив товаров в коризне
    getItems(): TBasketItem[] {
        return this.items;
    }

    // метод добавляет товар в корзину
    addItem(item: TBasketItem, payload: Function | null = null):void {
        // проверяем наличие товара в корзине
        if(!this.hasItem(item.id)){
            // кладем товар в массив товаров
            this.items.push(item);
        }

        // если payload была передана, то вызываем её
        if(payload) {
            payload();
        }

        // вызываем событие изменения корзины
        this.events.emit("basket:changed", {data: this.items});
    }

    // функция удаляет элемент из корзины
    removeItem(itemId: string, payload: Function | null = null):void {
        // находим индекс элемента в массиве
        const indexElem = this.items.findIndex((item) => item.id === itemId);

        // удаляем элемент из массива 
        if(indexElem >= 0) {
            this.items.splice(indexElem, 1);
        }
        
        // если payload была передана, то вызываем её
        if(payload) {
            payload();
        }

        // вызываем событие изменения корзины
        this.events.emit("basket:changed", {data: this.items});
    }

    // функция очищает корзину 
    clear(payload: Function | null = null):void {
        // очищаем массив товаров 
        this.items = [];

        // если payload была передана, то вызываем её
        if(payload) {
            payload();
        }

        // вызываем событие изменения корзины
        this.events.emit("basket:changed", {data: this.items});
    }

}