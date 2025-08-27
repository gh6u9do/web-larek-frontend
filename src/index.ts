import { EventEmitter, IEvents } from './components/base/events';
import { BasketCardView } from './components/BasketCardView';
import { BasketData } from './components/BasketData';
import { BasketView } from './components/BasketView';
import { CardPreview } from './components/CardPreview';
import { CardsData } from './components/CardsData';
import { CatalogCardView } from './components/CatalogCardView';
import { Modal } from './components/common/Modal';
import { ContactFormView } from './components/ContactFormView';
import { MainPageView } from './components/MainPageView';
import { OrderData } from './components/OrderData';
import { OrderFormView } from './components/OrderFormView';
import { ShopApi } from './components/ShopApi';
import { SuccesView } from './components/SuccesView';
import './scss/styles.scss';
import { ICardViewItem, TBasketItem, TPayment } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';


// создаем экземпляр eventEmitter
const events: IEvents = new EventEmitter();

// создаем экземпляр класса ShopApi 
const api = new ShopApi(CDN_URL, API_URL, settings);


// создаем экземпляры классов моделей данных
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);



// создаем экземпляр модального окна
const modal = new Modal("modal-container", events);

// создаем экземпляры классов представлений для модальных окон
const cardPreview = new CardPreview('card-preview', events);
const basketView = new BasketView('basket', events);
const orderFormView = new OrderFormView('order', events);
const contactFormView = new ContactFormView('contacts', events);
const succesView = new SuccesView('success', events);

// создаем экземпляр mainPageView
const mainPageView = new MainPageView('page__wrapper', events);


// получаем карточки c сервера
async function init() {
    try {
        // получаем массив карточек с сервера
        const cards = await api.getProductList();
        // записываем полученные карточки в модель
        cardsData.setCards(cards);

        // создаем массив view карточек
        const cardsView = cards.map((item) => {
            const view = new CatalogCardView('card-catalog', events)
            return view.render(item);
        })

        // кладем карточки в галерею 
        mainPageView.setCards(cardsView);


    } catch (err) {
        console.log(err);
    }
}
init();




// обрабатываем событие выбора карточки
events.on('card:select', (data: { id: string }) => {
    // кладем id выбранной карточки
    cardsData.setPreviewId(data.id);
})

// обрабатываем событие перехода к модалке просмотра карточки
events.on('card:openPreview', () => {
    // получаем данные выбранной карточки
    const selectedCardData = cardsData.getCardById(cardsData.getPreviewId());

    // преобразуем данные в объект для модалки просмотра
    const objForCardPreview: ICardViewItem = {
        ...selectedCardData,
        inBasket: basketData.hasItem(selectedCardData.id)
    }

    // передаем объект в модалку
    cardPreview.setData(objForCardPreview);
    modal.setContent(cardPreview.render());

    // открываем модалку
    modal.open();
})

// обработка изменения модели корзины
events.on('basket:changed', () => {
    // изменяем значение отображения количества товаров в корзине
    mainPageView.setBasketCount(basketData.getItemsCount());
})

// обрабатываем клик на кнопку "купить" в модалке просмотра карточки
events.on('cardPreview:addItemInBasket', () => {
    // достаем объект выбранной карточки  
    const selectedCard = cardsData.getCardById(cardsData.getPreviewId());

    // создаем объект карточки для корзины
    const cardForBasket: TBasketItem = {
        id: selectedCard.id,
        price: selectedCard.price,
        title: selectedCard.title,
    }

    // добавляем элемент в корзину
    basketData.addItem(cardForBasket);

    // изменяем текст кнопки
    cardPreview.setButtonState(basketData.hasItem(cardForBasket.id));
})

// обрабатываем клик на кнопку "удалить из корзины" в модалке просмотра карточки
events.on('cardPreview:removeItemInBasket', () => {
    // получаем выбранную карточку
    const selectedCard = cardsData.getCardById(cardsData.getPreviewId());


    // удаляем элемент из корзины
    basketData.removeItem(selectedCard.id);

    // изменяем текст кнопки
    cardPreview.setButtonState(basketData.hasItem(selectedCard.id));
})

// обрабатываем клик на кнопку корзины на главной странице
events.on('mainPage:openBasket', () => {
    // получаем карточки из модели корзины
    const cardsFromModel = basketData.getItems();
    // считаем общую сумму товаров
    const totalSum = basketData.getTotal();

    // создаем объект карточек для отображения в корзине
    const cardsForBasket = cardsFromModel.map((card) => {
        // создаем экземпляр представления карточки в корзине
        const basketCardView = new BasketCardView('card-basket', events);
        // заполняем экзепляр представления карточки в корзине 
        basketCardView.setData(card, cardsFromModel.findIndex(item => card === item) + 1);
        // возвращаем dom элемент созданной карточки
        return basketCardView.render();
    })

    // устанавливаем карточки в модалку корзины
    basketView.setItems(cardsForBasket);
    // устанавливаем общую сумму товаров
    basketView.setTotal(totalSum);
    // в зависимости от наличия товаров в корзине отображаем/скрываем кнопку
    basketView.setValid(cardsFromModel.length > 0)
    // устанавливаем в модалку отображение корзины
    modal.setContent(basketView.render());
    // открываем модалку
    modal.open();
})

// обрабатываем событие удаления карточки из модалки корзины
events.on('basketCardView:removeItem', (data: { id: string }) => {
    // удаляем карточку в модели корзины по id
    basketData.removeItem(data.id);
    // получаем карточки из модели корзины
    const cardsFromModel = basketData.getItems();
    // считаем общую сумму товаров
    const totalSum = basketData.getTotal();

    // создаем объект карточек для отображения в корзине
    const cardsForBasket = cardsFromModel.map((card) => {
        // создаем экземпляр представления карточки в корзине
        const basketCardView = new BasketCardView('card-basket', events);
        // заполняем экзепляр представления карточки в корзине 
        basketCardView.setData(card, cardsFromModel.findIndex(item => card === item) + 1);
        // возвращаем dom элемент созданной карточки
        return basketCardView.render();
    })

    // устанавливаем карточки в модалку корзины
    basketView.setItems(cardsForBasket);
    // обновляет сумму
    basketView.setTotal(totalSum);
    // валидируем кнопку
    basketView.setValid(cardsFromModel.length > 0);
})

// обрабатываем переход к модальному окну выбора способа оплаты
events.on('basketView:submit', () => {
    // заменяем контент модалки корзины на контент модалки оплаты
    modal.setContent(orderFormView.render());
    // очищаем форму от возможных старых данных
    orderFormView.refresh();
    // предварительно очищаем данные в orderData т.к. ожидается новый ввод
    orderData.clear();

})

// обрабатываем ввод в инпут на форме способа оплаты
events.on('orderFormView:input', (data:
    {
        "address": HTMLInputElement,
        "payment": string
    }) => {
    // валидируем полученные данные
    let messageError = null;
    if (!orderData.validateAddress(data.address.value)) {
        messageError = "Необходимо указать адрес";
    }

    // если поле не пустое и выбран способ оплаты 
    if (!messageError && orderData.validatePayment(data.payment)) {
        // очищаем ошибку
        orderFormView.hideInputError();
        // делаем кнопку активной
        orderFormView.setValid(true);

    } else {
        // делаем кнопку неактивной
        orderFormView.setValid(false);
        // показываем сообщение об ошибке
        orderFormView.showInputTextError(messageError);
    }

})

// обрабатываем submit на форме способа оплаты
events.on('orderFormView:submit', (data: {
    "payment": TPayment,
    "address": string
}) => {
    // записываем данные в модель заказа
    orderData.setAddress(data.address);
    orderData.setPayment(data.payment);

    // заменяем контент модалки способа оплаты на модалку с контактами
    modal.setContent(contactFormView.render());
    contactFormView.refresh();

})

// обрабатываем ввод в модалке контактов 
events.on('userContactsView:input', (data: {
    "email": string,
    "phone": string
}) => {
    let messageError = null;
    if (!orderData.validateEmail(data.email)) {
        // если почта невалидна то блочим кнопку и показываем ошибку
        contactFormView.setValid(false);
        // записываем текст ошибки
        messageError = "Необходимо указать email";
        contactFormView.showInputError(messageError);
    } else if(!orderData.validatePhone(data.phone)) {
        messageError = "Необходимо указать телефон";
        contactFormView.setValid(false);
        contactFormView.showInputError(messageError);
    } else {
        // если все хорошо, то показываем кнопку и очищаем ошибку
        contactFormView.setValid(true);
        contactFormView.showInputError("");
    }
})

// обрабатываем submit в модалке контактов
events.on('userContactsView:submit', async (data: {"email": string, "phone": string}) => {
    // кладем почту и телефон в orderData
    orderData.setEmail(data.email);
    orderData.setPhone(data.phone);

    
    // отправляем на сервер заказ 
    const dataForServer = orderData.getOrder(basketData.getItems());

    try {
        const response = await api.createOrder(dataForServer); 
        // заменяем содержимое модалки на succesView
        succesView.setTotal(basketData.getTotal());
        modal.setContent(succesView.render());
        // очищаем модель корзины
        basketData.clear();
        // очищаем модель заказа
        orderData.clear();
        console.log(basketData);
        console.log(orderData);
    } catch (err) {
        console.log(err)
    }
})

events.on('succesView:submit', () => {
    // закрываем модалку
    modal.close();
})