import { IContacts } from '../../types';
import { Form } from './Form';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Contacts extends Form<IContacts> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			`.form__input[name=email]`,
			container
		);

		this._emailInput.addEventListener('click', () => {
			this.onInputChange('email', this._emailInput.value);
		});

		this._phoneInput = ensureElement<HTMLInputElement>(
			`.form__input[name=phone]`,
			container
		);

		this._phoneInput.addEventListener('click', () => {
			this.onInputChange('phone', this._phoneInput.value);
		});
	}

	set email(value: string) {
		(this.container.children.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.children.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
