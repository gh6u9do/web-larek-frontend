// тип категории товара
type TItemCategory = "софт-скил" | "хард-скил" | "дополнительное" | "кнопка" | "другое";

// интерфейс товара (такие данные приходят с сервера)
export interface IItem {
    id: string; 
    description: string;
    image: string;
    title: string; 
    category: TItemCategory;
    price: number;
} 

// тип карточки товара (такие данные отображаются в коллекции карточек)
export type TCardItem = Pick<IItem, "id" | "category" | "image" | "title" | "price">;

// интерфейс карточки товара в режиме просмотра
export interface ICardViewItem extends IItem {
    inBasket: boolean; 
} 

// интерфейс для коллекции карточек товара
export interface ICardsData {
    cards: IItem[]; // используем IItem потому что модель должна обладать полной информацией
    setCards(cards: IItem[]):void;
    getCards(): IItem[];
    getCardById(id: string): IItem | undefined;
    previewId: string | null; // id товара который сейчас в модалке
    setPreviewId(id: string):void;
    getPreviewId():string | null;
}

// интерфейс товара в корзине
export type TBasketItem = Pick<IItem, "id" | "title" | "price"> 

// интерфейс модели корзины
export interface IBasket {
    items: TBasketItem[];
    getTotal(): number;
    getItemsCount():number;
    getItems(): TBasketItem[];
    addItem(item: TBasketItem, payload?: Function | null):void;
    removeItem(itemId: string, payload?: Function | null): void;
    clear(payload?: Function | null):void;
    hasItem(itemId:string):boolean;
}

// создаем тип способа оплаты т.к. что-то может добавиться или убавиться
export type TPayment = "online" | "in getting";

// интерфейс для формы оформления заказа
export interface IOrderForm {
    payment: TPayment;
    address: string;
}

// интерфейс для формы контактов
export interface IUserContact {
    email: string;
    phone: string;
}

// тип для всей информации о заказе 
export interface IOrderFull extends IOrderForm, IUserContact {
    items: string[];
    total: number;
}

// интерфейс для модели заказа
export interface IOrderData extends IOrderForm, IUserContact{
   validatePayment(): boolean;
   validateAddress():boolean;
   validateEmail():boolean;
   validatePhone():boolean;
   validate():boolean;

   getOrder(items: TBasketItem[]): IOrderFull;
   clear():void;
}

// интерфейс для объекта возвращаемого с сервера при отправке заказа
export interface IOrderResult {
    id: string;
    tottal: number;
}