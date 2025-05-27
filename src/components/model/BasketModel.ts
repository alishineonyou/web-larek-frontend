import { Model } from '../base/Model';
import { IBasketItem } from '../../types';

export class BasketModel extends Model<IBasketItem> {
	protected _items: IBasketItem[] = [];
	protected _total: number | null = null;

	toggleItem(item: IBasketItem) {
		if (item.inBasket) {
			this._items = this._items.filter((p) => p.id !== item.id);
			item.inBasket = false;
			this._total -= item.price;
		} else {
			this._items.push(item);
			item.inBasket = true;
			this._total += item.price;
		}

		this.events.emit('basket:changed', {
			items: this.items,
			total: this.total,
		});
	}

	clearBasket() {
		this._items = [];
		this.events.emit('basket:cleared');
	}

	get total(): number {
		return this._total;
	}

	get items(): IBasketItem[] {
		return this._items;
	}
}
