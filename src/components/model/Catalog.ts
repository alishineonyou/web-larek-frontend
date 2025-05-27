import { Model } from '../base/Model';
import { IProduct } from '../../types';

export class Catalog extends Model<IProduct[]>{
	products: IProduct[] = [];

	setProducts(items: IProduct[]) {
		items.map((item) => this.products.push(item));
		this.emitChanges('items:changed', { products: this.products });
	}
}