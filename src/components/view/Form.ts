import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IFormState {
	valid: boolean;
	errors: object;
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected _container: HTMLFormElement, protected _events: IEvents) {
		super(_container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this._container
		);

		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this._errors = ensureElement<HTMLElement>('.form__errors', this._container);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this._events.emit(`${this._container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	protected onInputChange(field: keyof T, value: string) {
		this._events.emit(`${String(field)}:change`, { field, value });
	}

	render(state?: Partial<T> & IFormState): HTMLElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid });
		Object.assign(this, inputs);
		return this.container;
	}
}
