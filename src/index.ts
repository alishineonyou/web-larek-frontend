import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import {
	ApiResponse,
	IBasket,
	IBasketItem,
	IOrder,
	IProduct,
	PaymentMethods,
} from './types';
import { Catalog } from './components/model/Catalog';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Card } from './components/view/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { BasketModel } from './components/model/BasketModel';
import { BasketItem } from './components/view/BasketItem';
import { DeliveryDetails } from './components/view/DeliveryDetails';
import { Order } from './components/model/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';

const events = new EventEmitter();
const api = new Api(API_URL);

const page = new Page(document.body, events);
const catalog = new Catalog([], events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketModel = new BasketModel({}, events);
const basketComponent = new Basket(
	'basket',
	cloneTemplate(basketTemplate),
	events
);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const deliveryDetails = new DeliveryDetails(
	cloneTemplate<HTMLFormElement>('#order'),
	events
);
const catalogItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const itemViewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const order = new Order({}, events);
const contacts = new Contacts(
	cloneTemplate<HTMLFormElement>('#contacts'),
	events
);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('success:close');
	},
});

api
	.get('/product/')
	.then((res: ApiResponse) => {
		catalog.setProducts(res.items as IProduct[]);
	})
	.catch((err) => console.error(err));

events.on('items:changed', () => {
	page.catalog = catalog.products.map((item) => {
		const catalogItem = new Card('card', cloneTemplate(catalogItemTemplate), {
			onClick: () => events.emit('catalog:selectCard', item),
		});
		return catalogItem.render(item);
	});
});

events.on('catalog:selectCard', (item: IProduct) => {
	const card = new Card('card', cloneTemplate(itemViewTemplate), {
		onClick: () => {
			basketModel.toggleItem(item);
			card.switchButtonText(item);
		},
	});
	card.switchButtonText(item);
	modal.render({ content: card.render(item) });
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;

});

events.on('basket:delete-item', (item: IBasketItem) => {
	basketModel.toggleItem(item);
	basketComponent.render(basketModel);
});

events.on('basket:cleared', () => {
	basketComponent.items = [];
});

events.on('basket:changed', (basket: IBasket) => {
	basketComponent.items = basket.items.map(
		(item: IBasketItem, index: number) => {
			const basketItemComponent = new BasketItem(
				index + 1,
				'card',
				cloneTemplate<HTMLTemplateElement>(basketItemTemplate),
				{
					onClick: () => events.emit('basket:delete-item', item),
				}
			);
			return basketItemComponent.render(item);
		}
	);
	page.counter = basket.items.length;
});

events.on('basket:open', () => {
	modal.render({ content: basketComponent.render(basketModel) });
});

events.on('basket:order', () => {
	order.items = basketModel.items.map((item) => item.id);
	order.total = basketModel.total;
	order.valid = order.validateDeliveryDetails();
	modal.render({ content: deliveryDetails.render(order) });
});

events.on('address:change', (data: { field: keyof IOrder; value: string }) => {
	order.address = data.value;
	order.validateDeliveryDetails();
});

events.on('deliveryDetailsErrors:change', (errors: Partial<IOrder>) => {
	deliveryDetails.valid = !Object.keys(errors).length; //проверяем, есть ли что-нибудь в объекте ошибок
	const errorString = Object.values(errors).join(' и ');
	deliveryDetails.errors =
		errorString.charAt(0).toUpperCase() + errorString.slice(1); //делаем ошибки валидации красивыми
});

events.on(
	'payment:change',
	(data: { field: keyof IOrder; value: PaymentMethods }) => {
		//сохраняем в модель заказа тип оплаты
		order.payment = data.value;
		order.validateDeliveryDetails();
	}
);

events.on('order:submit', () => {
	order.valid = order.validateContacts();
	modal.render({ content: contacts.render(order) });
});

events.on(
	'email:change',
	(data: { field: keyof IOrder; value: PaymentMethods }) => {
		order.email = data.value;
		order.validateContacts();
	}
);

events.on(
	'phone:change',
	(data: { field: keyof IOrder; value: PaymentMethods }) => {
		order.phone = data.value;
		order.validateContacts();
	}
);

// изменилось состояние валидации данных с контактами
events.on('contactsErrors:change', (errors: Partial<IOrder>) => {
	contacts.valid = !Object.keys(errors).length;
	const errorString = Object.values(errors).join(' и ');
	contacts.errors = errorString.charAt(0).toUpperCase() + errorString.slice(1);
});

// отправить на сервер данные и показать окно успешной покупки
events.on('contacts:submit', () => {
	api
		.post('/order/', order)
		.then((res) => {
			modal.render({ content: success.render(order) });
			order.removeOrderData();
			basketModel.clearBasket();
			basketComponent.items = [];
			catalog.products.map((product) => (product.inBasket = false));
			page.counter = basketModel.items.length;
		})
		.catch((err) => console.error(err));
});

events.on('success:close', () => {
	modal.close();
});
