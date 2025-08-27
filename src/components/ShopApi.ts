import { IItem, IOrderForm, IOrderFull, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

// пишем интерфейс для класса ShopApi
export interface IShopApi {
    // метод для получения списка товаров 
    getProductList(): Promise<IItem[]>; 
    // метод для получения конкретного товара по id
    getProductItem(id: string): Promise<IItem>;
    // метод оформления заказа (отправки заказа на сервер) 
    createOrder(order: IOrderFull):Promise<IOrderResult>;
}


export class ShopApi extends Api implements IShopApi {

    constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
        // вызываем родительский конструктор
        super(baseUrl, options);
    }

    // метод возвращает массив товаров
    getProductList():  Promise<IItem[]> {
        return this.get('/product').then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    } 

    // метод возвращает окнретный товар по id
    getProductItem(id: string): Promise<IItem> {
         return this.get(`/product/${id}`).then(
            (item: IItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    // метод отправляет объект заказа на сервер
    createOrder(order: IOrderFull): Promise<IOrderResult> {
        return this.post(`/order`, order).then((data: IOrderResult) => data);
    }

}