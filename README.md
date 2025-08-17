# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения 
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных используемые в приложении

- Категория товара

```
type TItemCategory = "софт-скил" | "хард-скил" | "дополнительное" | "другое";
```


- Товар
```
export interface IItem {
    id: string; 
    description: string;
    image: string;
    title: string; 
    category: TItemCategory;
    price: number;
} 
```


- Интерфейс с данными карточки товара

```
export type TCardItem = Pick<IItem, "id" | "category" | "image" | "title" | "price">
```


- Интерфейс карточки товара для модального окна просмотра карточки

```
export interface ICardViewItem extends IItem {
    inBasket: boolean; // 
} 
```


- Интерфейс для модели данных карточек

```
export interface ICardsData {
    cards: IItem[];
    preview: string | null; // id товара который сейчас в модалке
}
```


- Товар в корзине

```
export type TBasketItem = Pick<IItem, "id" | "title" | "price">
```


- Способы оплаты

```
export type TPayment = "online" | "in getting";
```


- Данные пользователя в форме оформления заказа

```
export interface IOrderForm {
    payment: TPayment;
    address: string;
}
```


- Данные пользователя в форме контактов

```
export interface IUserContact {
    email: string;
    phone: string;
}
```


- Интерфейс для всей информации о заказе и пользовательских данных

```
export interface IOrderFull extends IOrderForm, IUserContact {
    items: TBasketItem[];
}
```

## Архитектура приложения 

Код приложения разделен на слои согласно парадигме MVP:
- Слой данных, отвечает за хранение и изменение данных 
- Слой представления, отвечает за отображение данных на странице
- Презентер, отвечает за связь представления и данных

### Базовый код

#### Класс EventEmitter
Брокер событий позволяет инициализировать события, подписываться на события, отписываться от событий, происходящих в системе. Класс используется в презенторе для обработки событий и в слоях приложения для генерации событий.

Интерфейс `IEvents` описывает основные методы:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Api
Содержит базовую логику отправки запросов. В конструктор принимает базовый адрес сервера и опциональный объект с заголовками запросов. \
Реализуемые методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт, возвращает промис с объектом, который вернул сервер
- `post` - принимает в параметры ендпоинт и объект с данными, которые будут переданные в JSON в теле запроса, опционально принимает тип запроса, по умолчанию выполняется `POST` запрос


### Слой данных

#### Класс CardsData 
Класс отвечает за хранение и логику карточек товаров. \
Конструктор принимает экземпляр класса брокера событий. \
Поля класса: 
- cards: IItem[] - массив объектов товаров (карточек)
- preview: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- setCards(cards: IItem[]):void; - позволяет записать в коллекцию массив товаров
- getCards(): IItem[]; - возвращает записанные в коллекцию товары
- getCardById(id: string): IItem | undefined; - возвращает товар по id

#### Класс BasketData 
Класс отвечает за хранение и логику товаров в корзине. \
Конструктор принимает экземпляр класса брокера событий \
В полях класса следующие даные: 
- _items: TBasketItem[]; - хранит товары в корзине
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Методы класса для взаимодействия с данными: 
- getTotal(): number; - возвращает обшую сумму стоимости товаров в корзине
- getItemsCount():number - возвращает количество заказов в корзине
- getItems(): TBasketItem[]; - возвращает все товары в корзине
- addItem(item: TBasketItem, payload: Function | null = null):void; - добавляет элемент в корзину и если передан коллбэк выполняет его после добавления, если нет, то вызывает событие изменение массива
- removeItem(itemId: string, payload: Function | null = null): void; - удаляет товар из массива, если передан колбэк, то выполняет его после удаления, если нет то вызывает событие изменения массива
- clear(payload: Function | null = null):void; - очищает корзину, если передан колбэк, то выполняет его после очищения, если нет то вызывает событие изменения массива
- hasItem(itemId:string):boolean - проверяет по id наличие товара в корзине;
Так же геттеры и сеттеры для полей данных


#### Класс OrderData
Класс отвечает за хранение пользовательской информации в заказе, а так же реализует методы работы с ними
В полях класса следующие данные: 
- _payment - способ оплаты
- _address - адрес
- _email - почта
- _phone - телефон
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Методы: 
- validatePayment(): boolean; - проверка способа оплаты
- validateAddress():boolean; - проверка адреса
- validateEmail():boolean; - проверка почты
- validatePhone():boolean; - проверка телефона
- validate(): boolean; - общая функция валидации, которая вызывает вышеуказанные функции проверки внутри себя
- getOrder(items: TBasketItem[]):IOrderFull; - возвращает всю информацию о заказе
- clear() - очищает все поля
- так же реализуются геттеры и сеттеры для полей

### Классы представления
Классы представления отвечают за отображение внутри контейнера (DOM элемент) передаваемых в них данных

#### Класс Modal
Реализует работу модального окна. Представляет методы `open` `close` для отображения модального окна, метод установки контета внутри модального окна, очистки контента внутри модального окна. \
Устанавливает слушатели на клавиатуру для закрытия модального окна по нажатию `Esc`, на клик по оверлею и на крестик для закрытия. \
- constructor(modalSelector: string, events: IEvents) - конструктор принимает селектор модального окна, с которым будет происходить вся работа, экземпляр класса EventEmitter для возможности инициации событий

Поля класса: 
- modalElement:HTMLElement - элемент модального окна
- events: IEvents - брокер событий
 
Методы: 
- open(payback: Function | null = null):void - открывает модальное окно, если передан колбэк - выполняет его после открытия
- close(payback: Function | null = null):void - закрывает модальное окно, если передан колбэк - выполняет его после закрытия
- setContent(content: HTMLElement):void - размещает контент в модальном окне
- removeContent():void - очищает контент внутри модалки

#### Класс OrderFormView
Класс предназначен для реализации модального окна оформления заказа. 
constructor(templateId: string, events: EventEmitter) - конструктор принимает id темлейта для того чтобы знать с какой формой оформления заказа производится работа, экземпляр класса EventEmitter для инициации событий

Поля класса: 
- _formElement: HTMLFormElement
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий
- submitButton: HTMLButtonElement - кнопка подтверждения
- inputs: NodeListOf<HtmlElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов
- templateId: string - id используемого темлейта формы

Методы класса: 
- render() - возвращает готовую форму
- setValid(isValid:boolean) - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает данные из инпутов формы
- setInputValues(data: Record<string, string>):void - принимает объект с данными и устанавливает их в соответсвующие инпуты формы (через value), используется при открытии формы
- showInputError(field: string, errorMessage: string):void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError(field: string):void - очищает текст ошибки под указанным полем ввода
- refresh():void - деактивирует кнопку , очищает поля
- геттер и сеттер для formElement


#### Класс BasketView 
Класс предназначен для реализации модального окна корзины
constructor(templateId: string, events: EventEmitter) - в конструктор принимает id темплейта корзины, экзмепляр класса EventEmitter для инициации событий

Поля класса: 
- templateId: string - id используемого темплейта формы
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий
- submitButton: HTMLButtonElement - кнопка подтверждения
- listContainer: HTMLElement - контейнер для списка товаров
- totalElement: HTMLElement - элемент с суммарной стоимостью товаров
- emptyMessageElement: HTMLElement - элемент с надписью "корзина пуста"

Методы:
- render():void - возвращает готовую форму корзины
- setValid(isValid:boolean) - изменяет активность кнопки подтверждения
- refresh(): void - деактивирует кнопку, очищает список корзины, очищает сумму
- setItems(items: HTMLElement[]): void - отображает элементы в списке корзины
- setTotal(total: number): void - устанавливает суммарную сумму товаров

#### Класс SuccessView
Класс предназначен для реализации модального окна успешной покупки 

constructor(templateId: string, events: EventEmitter) - конструктор принимает id темлейта блока успешной покупки, экземпляр класса EventEmitter для инициации событий

Поля класса: 
- templateId:string - id темплейта
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий
- actionButton: HTMLButtonElement - кнопка подтверждения
- totalElement: HTMLElement - элемент со значением списанных синапсов 

Методы класса: 
- render(): HTMLElement - возвращает верстку окна успешной покупки
- setTotal(value: number) - устаналивает в строку число списанных синапсов

#### Класс CardPreview
Класс отвечает за отображение модального окна просмотра карточки \
constructor(templateId: string, events: EventEmitter) - конструктор принимает id темплейта карточки в режиме просмотра, экземпляр EventEmitter для инициации событий

Поля класса: 
- templateId: string - Id темплейта
- events: EventEmitter - экземпляр EventEmitter для инициации событий
- categoryElement: HTMLElement - элемент с категорией товара
- titleElement: HTMLElement - элемент с названием товара
- descriptionElement: HTMLElement - элемент с описанием товара
- imageElement: HTMLImageElement - элемент с картинкой товара
- priceElement: HTMLElement - элемент с ценой товара  
- actionButton: HTMLButtonElement - элемент кнопки 

Методы класса: 
- render(): HTMLElement - возвращает DOM элемент карточки для просмотра
- setData(item: ICardViewItem): void - заполняет данными шаблон карточки
- setButtonState(inBasket: boolean): void - позволяет изменить текст кнопки без перерисовки всей карточки 


#### Класс CatalogCardView 
Отвечает за отображение карточки в каталоге. 
constructor(templateId: string, events: EventEmiter) - конструктор принимает Id используемого теймплейта карточки и eventEmitter для инициации событий

Поля класса:
- templateId: string - Id темплейта карточки
- events: EventEmitter - экземпляр EventEmitter для инициации событий
- cardElement: HTMLElement - DOM элемент карточки
- titleElement: HTMLElement - элемент с названием
- categoryElement: HTMLElement - элемент с категорией
- priceElement: HTMLElement - элемент с ценой
- imageElement: HTMLImageElement - элемент с картинкой
- cardId - хранит идентификатор карточки

Методы класса: 
- render(): HTMLElement - возвращает DOM элемент карточки
- deleteCard(): void - метод для удаления разметки карточки
- setData(data: TCardItem): void - заполняет карточку данными
- getId():string - возвращает хранимое id


#### Класс BasketItemView
Класс отвечает за отображение карточки товара в модальном окне корзины
constructor(templateId: string, events: eventEmitter)

Поля класса: 
- templateId: string - id темлейта карточки в корзине
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий
- element: HTMLElement - DOM элемент карточки
- titleElement: HTMLElement - название товара
- priceElement: HTMLElement - цена товара 
- removeButton: HTMLButtonElement - кнопка удаления

Методы класса: 
- render():HTMLElement - возвращает DOM элемент карточки
- setData(data: TBasketItem):void - заполняет карточку данными 


#### Класс MainPageView
Класс отвечает за отображение главной страницы. 
constructor(containerSelector: string, events: eventEmitter) - конструктор принимает селектор контейнера, в который вставляются карточки

Поля класса: 
- containerElement: HTMLElement - DOM элемент контейнера каталога
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий
- basketButton: HTMLButtonElement - кнопка с иконкой корзины
- basketCounter: HTMLElement - элемент-счетчик товаров в корзине

Методы класса:  
- clear(): void - очищает контейнер от всех карточек
- setCards(cards: HTMLElement[]) - вставляет в контейнер массив карточек 
- setBasketCount(count: number):void - устанавливает значение количества товаров в корзине


### Слой коммуникации 

#### Класс AppApi 
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполнябщим роль презентера \
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts\
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий 

События изменения данных (генерируются классами моделями данных)
- `basket:changed` - изменение данных в корзине
- `order:changed` - изменение данных заказа 

События, возникающие при взаимодействии пользователя с интерфейсом
(генерируются классами представления)
- cardPreview:open - открытие модального окна карточки
- cardPreview:clear - очистка модального окна карточки
- basket:open - открытие модального окна корзины
- basket:removeItem - удаление товара из корзины
- basket:submit - событие, генерируемое при нажатии "оформить"
- order:open - переход к модальному окну способа оплаты
- userContancts:open - переход к модальному окну контактов пользователя
- orderSuccess:open - переход к модальному окну успешного оформления заказа
- card:select - выбор карточки для отображения в модальном окне
- cardPreview:addItemInBasket - добавление товара в коризну
- cardPreview:removeItemInBasket - удаление товара из корзины
- order:input - изменение данных в форме оформления заказа
- order:validation - сообщает о необходимости валидации формы оформления заказа
- order:submit - событие, генерируемое при нажатии "далее" 
- userContacts:input - изменение данных в форме пользовательских данных
- userContacts:validation - сообщает о необходимости 
- userContacts:submit - событие, генерируемое при нажатии "оплатить"
