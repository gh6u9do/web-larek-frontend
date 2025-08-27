import { IEvents } from "../base/events";


export class Modal { 

    protected modalElement: HTMLElement;
    protected events: IEvents;
    protected contentContainer: HTMLElement;

    private boundCloseWithOverlay: (e: MouseEvent) => void;
    private boundCloseWithEsc: (e: KeyboardEvent) => void;


    constructor(modalId: string, events: IEvents) {
        // находим модалку 
        this.modalElement = document.querySelector(`#${modalId}`);
        // записываем events
        this.events = events;

        // находим контейнер для контента
        this.contentContainer = this.modalElement.querySelector(".modal__content");

        // находим кнопку закрыьтия
        const closeButton = this.modalElement.querySelector(".modal__close");
        closeButton.addEventListener('click', (e) => {
            // закрываем модалку
            this.close();
        })

        // привязываем контекст 
        this.boundCloseWithEsc = this.closeModalWithEsc.bind(this);
        this.boundCloseWithOverlay = this.closeModalWithOverlay.bind(this);

    }

    // функция открывает модальное окно
    open(payback: Function | null = null):void {
        this.modalElement.classList.add('modal_active');

        // назначаем обработчик на клик по оверлею
        document.addEventListener('click', this.boundCloseWithOverlay)
                
        // назначаем обработчик на нажатие Esc
        document.addEventListener('keydown', this.boundCloseWithEsc);

        // если есть payback - вызываем его
        if(payback) {
            payback();
        }
    }

    close(payback: Function | null = null):void {
        // удаляем активный класс
        this.modalElement.classList.remove('modal_active');

        // снимаем click обработчик на document
        document.removeEventListener('click', this.closeModalWithOverlay);

        // снимаем keydown обработчик на document
        document.removeEventListener('keydown', this.closeModalWithEsc); 

        // очищаем модалку
        this.removeContent();

        // если есть payback - вызываем его
        if(payback) {
            payback();
        }
    }

    // метод размещает полученный контент в модальном окне
    setContent(content: HTMLElement): void {
        // принудительно очищаем контейнер
        this.removeContent();
        // устанавливаем контент 
        this.contentContainer.append(content);
    }

    removeContent(): void {
        // очищаем контент контейнер от содержимого
        this.contentContainer.innerHTML= "";
    }

    // метод закрывает модалку через клик по оверлею
    private closeModalWithOverlay(e: MouseEvent):void {
        // записываем target как HTMLElement
        const target = e.target as HTMLElement;
        // проверяем что клик по оверлею
        if(target === this.modalElement){
            this.close();
        }
    }

    private closeModalWithEsc(e: KeyboardEvent):void {
        // записываем target как HTMLElement
        const target = e.target as HTMLElement;
        // проверяем что нажата Esc
        if(e.key === "Escape") {
            this.close();
        }
    }

}