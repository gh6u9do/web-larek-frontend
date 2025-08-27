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
    items: string[];
    total: number;
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

#### Класс CardsData [done]
Класс отвечает за хранение и логику карточек товаров. \
Конструктор принимает экземпляр класса брокера событий. \
Поля класса: 
- cards: IItem[] - массив объектов товаров (карточек)
- previewId: string | null - id карточки, выбранной для просмотра в модальном окне
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- setCards(cards: IItem[]):void; - позволяет записать в коллекцию массив товаров 
- getCards(): IItem[]; - возвращает записанные в коллекцию товары 
- getCardById(id: string): IItem | undefined; - возвращает товар по id 
- setPreviewId(id: string):void - позволяет записать id карточки для просмотра
- getPreviewId():string | null - возвращает id карточки для просмотра или null 


#### Класс BasketData [done]
Класс отвечает за хранение и логику товаров в корзине. \
Конструктор принимает экземпляр класса брокера событий \
В полях класса следующие даные: 
- items: TBasketItem[]; - хранит товары в корзине
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Методы класса для взаимодействия с данными: 
- getTotal(): number; - возвращает общую сумму стоимости товаров в корзине
- getItemsCount():number - возвращает количество заказов в корзине
- getItems(): TBasketItem[]; - возвращает все товары в корзине
- addItem(item: TBasketItem, payload: Function | null = null):void; - добавляет элемент в корзину и если передан коллбэк выполняет его после добавления, если нет, то вызывает событие изменение массива
- removeItem(itemId: string, payload: Function | null = null): void; - удаляет товар из массива, если передан колбэк, то выполняет его после удаления, если нет то вызывает событие изменения массива
- clear(payload: Function | null = null):void; - очищает корзину, если передан колбэк, то выполняет его после очищения, если нет то вызывает событие изменения массива
- hasItem(itemId:string):boolean - проверяет по id наличие товара в корзине;


#### Класс OrderData [done]
Класс отвечает за хранение пользовательской информации в заказе, а так же реализует методы работы с ними
В полях класса следующие данные: 
- payment: TPayment - способ оплаты
- address: string - адрес
- email: string - почта
- phone:string - телефон
- events: IEvents - экземпляр класса `EventEmmiter` для инициации событий при изменении данных

Конструктор принимает экземпляр класса брокера событий

Методы: 
- validatePayment(payment:string): boolean; - проверка способа оплаты
- validateAddress(value: string):boolean; - проверка адреса
- validateEmail(value: string):boolean; - проверка почты
- validatePhone(value:string):boolean; - проверка телефона
- validate(): boolean; - общая функция валидации, которая вызывает вышеуказанные функции проверки внутри себя
- getOrder(items: TBasketItem[]):IOrderFull; - возвращает всю информацию о заказе
- clear() - очищает все поля
- так же реализуются геттеры и сеттеры для полей



### Классы представления
Классы представления отвечают за отображение внутри контейнера (DOM элемент) передаваемых в них данных


#### Класс Modal [done]
Реализует работу модального окна. Представляет методы `open` `close` для отображения модального окна, метод установки контета внутри модального окна, очистки контента внутри модального окна. \
Устанавливает слушатели на клавиатуру для закрытия модального окна по нажатию `Esc`, на клик по оверлею и на крестик для закрытия. \

- constructor(modalId: string, events: IEvents) - конструктор принимает селектор модального окна, с которым будет происходить вся работа, экземпляр класса EventEmitter для возможности инициации событий

Поля класса: 
- modalElement:HTMLElement - элемент модального окна
- events: IEvents - брокер событий
- contentContainer - контейнер для контента модалки

- boundCloseWithOverlay(e: MouseEvent): void и boundCloseWithEsc(e: KeyboardEvent): void -> обработчики с привязанным контекстом для корректной работы
 
Методы: 
- open(payback: Function | null = null):void - открывает модальное окно, если передан колбэк - выполняет его после открытия
- close(payback: Function | null = null):void - закрывает модальное окно, если передан колбэк - выполняет его после закрытия
- setContent(content: HTMLElement):void - размещает контент в модальном окне
- removeContent():void - очищает контент внутри модалки
- private closeModalWithOverlay(e: MouseEvent): void - вспомогательный метод, закрывает модальное окно при клике по оверлею
- private closeModalWithEsc(e: KeyboardEvent):void - вспомогательный метод, закрывает модальное окно при нажатию на Esc


#### Класс OrderFormView [done]
Класс предназначен для реализации модального окна оформления заказа. 
constructor(templateId: string, events: EventEmitter) - конструктор принимает id темлейта для того чтобы знать с какой формой оформления заказа производится работа, экземпляр класса EventEmitter для инициации событий

Поля класса: 
- templateId: string - id используемого темлейта формы
- events: EventEmitter - экземпляр класса EventEmitter для инициации событий

- element: HTMLElement - элемент модалки
- orderButtons: HTMLElement - контейнер для кнопок - способов оплаты
- submitButton: HTMLButtonElement - кнопка подтверждения
- input: HTMLInputElement - коллекция всех полей ввода формы
- errorElement: HTMLElement - блок для вывода ошибок, выявленных на валидации

- payment: TPayment | null = null - хранит полученное от пользователя значение способа оплаты, по умолчанию null
- address: string | null = null - хранит полученный адрес от пользователя

Методы класса: 
- render() - возвращает DOM элемент модалки 
- setValid(isValid:boolean) - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает данные из инпутов формы
- showInputError(errorMessage: string):void - отображает полученный текст ошибки 
- hideInputError():void - очищает текст ошибки под указанным полем ввода
- refresh():void - деактивирует кнопку , очищает поля


#### Класс ContactFormView [done]
Класс предназначен для реализации модального окна контактов

constructor(templateId: string, events: IEvents) 

Поля класса:
- templateId: string - id используемого темплейта формы
- events: IEvents - экземпляр класса EventEmitter для инициации событий
- element - HTMLFormElement - элемент модалки
- inputs - HTMLInputElement[] - массив инпутов формы
- errorElement: HTMLElement - элемент для вывода ошибок валидации
- submitButton: HTMLButtonElement - кнопка подтверждения

- inputValues: Record<string, string> - объект хранящий название полей как ключи и значения инпутов как значения

Методы класса: 
- render():HTMLElement - возвращает DOM элемент модалки
- setValid(isValid: boolean) - меняет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает данные из инпутов формы
- showInputError(errorMessage: string):void - отображает полученный текст ошибки 
- hideInputError():void - очищает текст ошибки под указанным полем ввода
- refresh():void - деактивирует кнопку , очищает поля


#### Класс BasketView [done]
Класс предназначен для реализации модального окна корзины

constructor(templateId: string, events: IEvents) - в конструктор принимает id темплейта корзины, экзмепляр класса EventEmitter для инициации событий

Поля класса: 
- templateId: string - id используемого темплейта формы
- events: IEvents - экземпляр класса EventEmitter для инициации событий
- element: HTMLElement - элемент модалки
- submitButton: HTMLButtonElement - кнопка подтверждения
- listContainer: HTMLElement - контейнер для списка товаров
- totalElement: HTMLElement - элемент с суммарной стоимостью товаров
- emptyMessageElement: HTMLElement - элемент с надписью "корзина пуста"

Методы:
- render(): HTMLElement - возвращает готовую форму корзины
- setValid(isValid:boolean) - изменяет активность кнопки подтверждения
- refresh(): void - деактивирует кнопку, очищает список корзины, очищает сумму
- setItems(items: HTMLElement[]): void - отображает элементы в списке корзины
- setTotal(total: number): void - устанавливает общую сумму товаров
- clearListContainer():void - очищает контейнер со списком товаров


#### Класс SuccessView
Класс предназначен для реализации модального окна успешной покупки 

constructor(templateId: string, events: IEvents) - конструктор принимает id темлейта блока успешной покупки, экземпляр класса EventEmitter для инициации событий

Поля класса: 
- templateId:string - id темплейта
- events: IEvents - экземпляр класса EventEmitter для инициации событий
- element: HTMLElement - DOM элемент модалки
- actionButton: HTMLButtonElement - кнопка подтверждения
- totalElement: HTMLElement - элемент со значением списанных синапсов 

Методы класса: 
- render(): HTMLElement - возвращает верстку окна успешной покупки
- setTotal(value: number) - устаналивает в строку число списанных синапсов

#### Класс CardPreview [done]
Класс отвечает за отображение модального окна просмотра карточки \

constructor(templateId: string, events: IEvents) - конструктор принимает id темплейта карточки в режиме просмотра, экземпляр EventEmitter для инициации событий

Поля класса: 
- templateId: string - Id темплейта
- events: IEvents - экземпляр EventEmitter для инициации событий
- element: HTMLElement - элемент всей карточки
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


#### Класс CatalogCardView [done]
Отвечает за отображение карточки в каталоге. 
constructor(templateId: string, events: IEvents) - конструктор принимает Id используемого теймплейта карточки и eventEmitter для инициации событий

Поля класса:
- templateId: string - Id темплейта карточки
- events: IEvents - экземпляр EventEmitter для инициации событий
- cardElement: HTMLElement - DOM элемент карточки
- titleElement: HTMLElement - элемент с названием
- categoryElement: HTMLElement - элемент с категорией
- priceElement: HTMLElement - элемент с ценой
- imageElement: HTMLImageElement - элемент с картинкой
- cardId: string - хранит идентификатор карточки

Методы класса: 
- render(data: Partial<TCardItem>): HTMLElement - принимает все или некоторые данные, для заполнения карточки, возвращает DOM элемент карточки
- deleteCard(): void - метод для удаления разметки карточки
- getId():string - возвращает хранимое id

Сеттеры: 
- id — задаёт id карточки
- title — устанавливает заголовок
- category — устанавливает категорию
- price — устанавливает цену
- image — устанавливает ссылку на картинку


#### Класс BasketCardView [done]
Класс отвечает за отображение карточки товара в модальном окне корзины
constructor(templateId: string, events: IEvents)

Поля класса: 
- templateId: string - id темлейта карточки в корзине
- events: IEvents - экземпляр класса EventEmitter для инициации событий
- element: HTMLElement - DOM элемент карточки
- indexElement: HTMLElement - элемент с индексом товара в корзине
- titleElement: HTMLElement - название товара
- priceElement: HTMLElement - цена товара 
- removeButton: HTMLButtonElement - кнопка удаления

Методы класса: 
- render():HTMLElement - возвращает DOM элемент карточки
- setData(data: TBasketItem, indexNumber: number):void - заполняет карточку данными 


#### Класс MainPageView [done]
Класс отвечает за отображение главной страницы. 
constructor(containerSelector: string, events: IEvents) - конструктор принимает селектор контейнера, в который вставляются карточки, экземпляр класса eventEmitter

Поля класса: 
- containerElement: HTMLElement - DOM элемент контейнера каталога
- events: IEvents - экземпляр класса EventEmitter для инициации событий
- basketButton: HTMLButtonElement - кнопка с иконкой корзины
- basketCounter: HTMLElement - элемент-счетчик товаров в корзине
- galleryElement: HTMLElement - элемент - контейнер для карточек 

Методы класса:  
- clear(): void - очищает контейнер от всех карточек
- setCards(cards: HTMLElement[]) - заменяет содержимое контейнера на переданный массив элементов
- setBasketCount(count: number):void - устанавливает значение количества товаров в корзине


### Слой коммуникации 

#### Класс AppApi [done]
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполнябщим роль презентера \
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts\
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий 

События изменения данных (генерируются классами моделями данных)
- `cards:changed` - изменение данных карточек
- `cards:previewChanged` - изменение выбранной карточки
- `basket:changed` - изменение данных в корзине
- `order:changed` - изменение данных заказа 
- `order:cleared` - очистка данных заказа

События, возникающие при взаимодействии пользователя с интерфейсом
(генерируются классами представления):
- `mainPage:openBasket` - событие генерируется при клике на иконку корзины на главной странице
- `basketCardView:removeItem` - удаление товара из корзины
- `basketCardView:submit` - событие, генерируемое при нажатии "оформить"
- `basketView:submit` - переход к модальному окну способа оплаты
- `userContancts:open` - переход к модальному окну контактов пользователя
- `successView:open` - переход к модальному окну успешного оформления заказа
- `card:select` - выбор карточки для отображения в модальном окне
- `card:openPreview` - переход к модалке просмотра карточки
- `cardPreview:addItemInBasket` - добавление товара в корзину
- `cardPreview:removeItemInBasket` - удаление товара из корзины
- `orderFormView:input` - изменение данных в форме оформления заказа
- `orderFormView:validation` - сообщает о необходимости валидации формы оформления заказа
- `orderFormView:submit` - событие, генерируемое при нажатии "далее" 
- `userContactsView:input` - изменение данных в форме пользовательских данных
- `userContactsView:validation` - сообщает о необходимости 
- `userContactsView:submit` - событие, генерируемое при нажатии "оплатить"
- `succesView:submit` - событие генерируемое при нажатии "за новыми покупками"
