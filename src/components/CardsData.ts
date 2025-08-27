import { IItem } from "../types";
import { IEvents } from "./base/events";

export class CardsData {

    protected cards: IItem[] = [];
    protected previewId: string | null = null;
    protected events: IEvents;


    constructor(events: IEvents) {
        // записываем экземляр брокера событий в поле класса
        this.events = events;
    }

    // метод записывает карточки в поле класса
    setCards(cards: IItem[]):void {
        // записываем карточки в поле
        this.cards = cards;

        // вызываем событие изменения массива карточек
        this.events.emit("cards:changed", {data: this.cards});
    }

    // метод возвращает массив карточек
    getCards(): IItem[] {
        return this.cards;
    }

    getCardById(id:string):IItem | undefined{
        // возвращаем карточку по переданному id
        return this.cards.find((el) => el.id === id);
    }

    // метод устанавливает id карточки для просмотра 
    setPreviewId(id: string):void {
        // записываем полученный id в поле
        this.previewId = id;

        // инициируем событие изменения карточки для просмотра
        this.events.emit("cards:previewChanged", {previewId: this.previewId});
    }

    // метод возвращает значение хранимое в preview
    getPreviewId():string | null {
        return this.previewId;
    }
}