export type CategoryType =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое'
	| 'кнопка';

export interface IBasket {
	items: IBasketItem[];
	total: number | null;
}

export interface IBasketItem {
	id: string;
	title: string;
	price: number | null;
	inBasket: boolean | false;
}

export interface IProduct extends IBasketItem {
	category: CategoryType;
	description: string;
	image: string;
}

export type PaymentMethods = 'онлайн' | 'при получении';

export interface IDeliveryDetails {
	payment: PaymentMethods;
	address: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface IFormValidation {
	valid: boolean;
	errors: Partial<Record<keyof IOrder, string>>;
}

export type IOrder = IBasket & IDeliveryDetails & IContacts & IFormValidation;

export interface ApiResponse {
	items: IProduct[];
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}
