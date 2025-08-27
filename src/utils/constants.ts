export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
 
};

// создаем объект для работы с классами категорий
export const categoryList: Record<string, string> = {
    "софт-скил": "soft",
    "хард-скил": "hard",
    "другое": "other",
    "кнопка": "button",
    "дополнительное": "additional"
}

// создаем объект для работы со способами оплаты
export const paymentList: Record<string, string> = {
    "Онлайн": "online",
    "При получении": "in getting"
}