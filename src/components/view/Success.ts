import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, protected actions: ISuccessActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__close`,
			container
		);
		this._description = ensureElement<HTMLElement>(
			`.${blockName}__description`,
			container
		);

		this._button.addEventListener('click', this.actions.onClick);
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
