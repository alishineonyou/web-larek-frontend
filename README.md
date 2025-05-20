# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Проект использует трехслойную архитектуру: MVC
Используются базовые классы из папки `base` (для API, модели, отображения, контроллера), от которых наследуются все компоненты.

## Базовые компоненты

### `Api`
Базовый класс для `GET`/`POST` запросов к API.
*   **Поля:** `baseUrl: string`, `options: RequestInit`.
*   **Конструктор:** `baseUrl`, `options`.
*   **Методы:**
    *   `handleResponse(response: Response): Promise<object>` (защищенный): Обрабатывает ответ сервера.
    *   `get(uri: string): Promise<object>`: GET-запрос.
    *   `post(uri: string, data: object, method?: ApiPostMethods): Promise<object>`: POST-запрос.
*   **Типы:** `ApiListResponse<Type>`, `ApiPostMethods`.

### `EventEmitter`
Брокер событий для связи модели и отображения (реализует `IEvents`).
*   **Поля:** `_events: Map<EventName, Set<Subscriber>>` (событие -> подписчики).
*   **Конструктор:** Инициализирует `_events`.
*   **Методы:** `on` (подписка), `off` (отписка), `emit` (инициация события), `onAll` (подписка на все), `offAll` (отписка от всех), `trigger` (создание триггера).
*   **Типы:** `EventName`, `Subscriber`, `EmitterEvent`, `interface IEvents`.

### `Component<T>`
Абстрактный базовый класс для работы с DOM.
*   **Поля:** `container` (DOM-контейнер).
*   **Конструктор:** Принимает `container`.
*   **Методы:** `toggleClass`, `setText`, `setDisabled`, `setHidden`, `setVisible`, `setImage`, `render(data?: Partial<T>): HTMLElement`.

### `Model<T>`
Абстрактный базовый класс модели.
*   **Поля:** `events: IEvents`.
*   **Конструктор:** Копирует данные, упрощая наследование.
*   **Методы:** `emitChanges(event: string, payload?: object)` (уведомляет об изменениях).

## Модели данных
(Наследуют `Model`)

### `Catalog<IProduct[]>`
Хранит товары.
*   **Поля:** `products: IProduct[]`.
*   **Методы:** `setProducts(items: IProduct[])` (обновляет товары, уведомляет).

### `BasketModel<IBasket>`
Товары в корзине.
*   **Поля:** `products: IProduct[]`, `total: number | null`.
*   **Методы:** `addToBasket`, `removeFromBasket`, `clearBasket`, `getTotalBasketPrice`.

### `Order<IOrder>`
Данные заказа.
*   **Поля:** `items: string[]`, `total: number | null`, `payment: PaymentMethods`, `address: string`, `email: string`, `phone: string`, `valid: boolean`, `errors: Partial<Record<keyof IOrder, string>>`.
*   **Методы:** `validateContacts`, `validateDeliveryDetails`, `removeOrderData`.

## Отображение
(Наследуют `Component`)

### `Page<IPage>`
Главная страница. Отображает счетчик корзины, каталог. Управляет блокировкой прокрутки.
*   **DOM-элементы:** `_counter`, `_catalog`, `_wrapper`, `_basket`.
*   **Сеттеры:** `counter` (кол-во товаров в корзине), `catalog` (товары), `locked` (блокировка страницы).

### `Card<IProduct>`
Карточка товара (для каталога, превью, корзины).
*   **DOM-элементы:** `_title`, `_category`, `_image`, `_price`, `_description`, `_button`, `_basketIndex`, `_deleteFromBasketButton`.
*   **Геттеры/Сеттеры:** `id`, `title`, `image`, `price` (форматирует, блокирует кнопку для бесценных), `category` (устанавливает цвет тега), `description`, `basketIndex`.
*   **Методы:** `switchButtonText` (текст кнопки "В корзину" / "Удалить").

### `Modal<IModalData>`
Модальное окно для отображения контента (карточка, корзина, формы).
*   **DOM-элементы:** `_closeButton`, `_content`.
*   **Сеттеры:** `content`.
*   **Методы:** `open`, `close`, `render`.

### `Basket<IBasket>`
Отображение корзины в модальном окне.
*   **DOM-элементы:** `_list` (список товаров), `_total` (сумма), `_button` (оформить).
*   **Сеттеры:** `total` (сумма), `items` (товары, управляет активностью кнопки "Оформить").

### `Form<T extends IFormState>`
Базовый класс формы.
*   **DOM-элементы:** `_submit`, `_errors`.
*   **Методы:** `onInputChange` (обработка ввода), `render`.
*   **Сеттеры:** `valid` (активность кнопки submit), `errors` (текст ошибок).
*   **Интерфейсы:** `IFormState`.

### `DeliveryDetails<IDeliveryDetails>`
Форма деталей доставки (наследует `Form`).
*   **DOM-элементы:** `_card`/`_cash` (кнопки способа оплаты), `_address` (поле ввода).
*   **Сеттеры:** `address`, `payment`.
*   **Интерфейсы:** `IDeliveryDetails`.

### `Contacts<IContacts>`
Форма контактов (наследует `Form`).
*   **DOM-элементы:** `_email`, `_phone` (поля ввода).
*   **Сеттеры:** `email`, `phone`.
*   **Интерфейсы:** `IContacts`.

### `Success<ISuccess>`
Окно успешного оформления заказа.
*   **DOM-элементы:** `_button` (закрыть), `_description` (итоговая сумма).
*   **Сеттеры:** `total` (итоговая сумма).
*   **Интерфейсы:** `ISuccess`, `ISuccessActions`.

## Контроллер

Связь между моделями и отображением реализуется через `EventEmitter`. Компоненты подписываются на события (клики, изменения данных) и реагируют на них, обновляя модель или отображение. `EventEmitter` обеспечивает обновление `View` при изменении `Model`.