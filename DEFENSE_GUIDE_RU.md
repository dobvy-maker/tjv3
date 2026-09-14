# Travel Journal — подготовка к защите

## 1. Как объяснить приложение за 30 секунд

Travel Journal — приложение на React Native + Expo для локального журнала путешествий. Пользователь видит список поездок, может добавить новую поездку, открыть детали и удалить запись. Данные хранятся между перезапусками через AsyncStorage. Для общего состояния используется Context API, а навигация построена на Expo Router: Tabs для основных разделов и Stack для Add Trip / Details.

## 2. Архитектура

- `app/(tabs)/index.tsx` — главный экран и список поездок.
- `app/(tabs)/about.tsx` — второй tab и краткая информация о проекте.
- `app/add-trip.tsx` — форма создания поездки.
- `app/trip/[id].tsx` — динамический экран деталей; `id` приходит через URL/route parameter.
- `app/context/TripsContext.tsx` — глобальные данные поездок и операции с ними.
- `components/TripCard.tsx` — переиспользуемый presentational component.
- `utils/tripUtils.ts` — чистые функции валидации/форматирования, которые легко тестировать.
- `constants/theme.ts` — общие цвета, spacing и border radius.

**Почему Context, а не Redux?** Проект небольшой, глобальное состояние одно — список поездок. Context встроен в React и не требует лишнего boilerplate. Для большого проекта с большим количеством state и сложными обновлениями Redux/Zustand были бы масштабируемее.

## 3. State

**Local state (`useState`)** находится в Add Trip: destination, date, rating, notes, isSaving. Эти данные нужны только форме.

**Global state** — массив `trips`. Он нужен Home, Details и Add Trip, поэтому находится в `TripsContext`.

После `setTrips` React делает re-render подписанных компонентов, поэтому новый trip появляется на Home без ручного обновления DOM/UI.

## 4. Context

`createContext` создаёт Context. `TripsProvider` оборачивает приложение в `app/_layout.tsx`. `useTrips()` — custom hook, через который экраны получают `trips`, `addTrip`, `deleteTrip`, `getTrip`.

Главная идея: экраны не передают массив через много уровней props и не дублируют состояние.

## 5. Router

Expo Router использует file-based routing.

- `(tabs)` — группа tab navigation.
- `add-trip.tsx` → `/add-trip`.
- `trip/[id].tsx` → динамический route, например `/trip/3`.
- `router.push(...)` открывает экран.
- `router.back()` возвращает назад.
- `useLocalSearchParams()` читает `id` на details screen.

В проекте есть два типа navigation: Tabs + Stack.

## 6. Storage / async

AsyncStorage — локальное key-value хранилище устройства. Массив нельзя сохранить напрямую, поэтому используется `JSON.stringify`; после чтения — `JSON.parse`.

Операции storage асинхронные, поэтому используются `async/await` и `try/catch`. На старте есть `isLoading`, а при ошибке — `storageError`. Это демонстрирует loading/success/error flow.

AsyncStorage подходит для обычных данных журнала, но НЕ для паролей/API tokens. Для чувствительных данных использовали бы SecureStore.

## 7. Native features

1. AsyncStorage — on-device persistent storage.
2. Expo Haptics — виброотклик после сохранения и удаления.

## 8. FlatList

Home использует `FlatList`, а не `.map()` внутри ScrollView. FlatList лучше масштабируется на длинных списках, потому что виртуализирует элементы и не обязан рендерить весь большой список одновременно. `keyExtractor` использует настоящий `id`, а не индекс массива.

## 9. Validation и error handling

- обязательны destination/date/rating;
- date проверяется как `DD.MM.YYYY`;
- rating — целое число 1–5;
- установлены maxLength;
- delete требует confirmation;
- AsyncStorage обёрнут в try/catch;
- при loading показывается ActivityIndicator.

Важно: regex проверяет ФОРМАТ даты, а не календарную корректность (например, 99.99.2026 всё ещё соответствует формату). Это известное ограничение, которое можно улучшить полноценным date parser/date picker.

## 10. Tests

В `__tests__/tripUtils.test.ts` 10 unit tests. Проверяются собственные pure functions: date format, rating boundaries, stars, trim и нормализация пробелов. Pure functions удобны для unit testing, потому что не зависят от UI или устройства.

Запуск: `npm test`.

## 11. API / LLM

В текущей версии внешнего API/LLM НЕТ. Не утверждать обратное на защите.

Если спросят, что можно добавить: Weather API по destination или LLM для генерации краткого travel plan. API key нельзя hardcode — его нужно хранить в environment configuration, а запрос должен иметь loading/error states.

## 12. Частые вопросы преподавателя

**Что такое component?** Переиспользуемая часть UI. TripCard получает данные через props.

**Что такое props?** Входные данные компонента от parent. TripCard получает title, date, rating, notes, onPress.

**useState vs Context?** useState — локальное состояние компонента. Context — способ сделать state доступным удалённым компонентам без prop drilling.

**Что делает useEffect?** Запускает side effect после render. Здесь один раз загружает сохранённые trips из AsyncStorage при старте Provider.

**Почему useEffect не async?** Callback useEffect не должен возвращать Promise. Поэтому внутри создаётся async function `loadTrips` и затем вызывается.

**Что такое async/await?** Синтаксис работы с Promise, позволяющий дождаться асинхронной операции без цепочки `.then()`.

**Что такое TypeScript type Trip?** Контракт структуры объекта trip: id/title/rating/date/notes и их типы.

**Что делает `Omit<Trip, 'id'>`?** Создаёт тип Trip без id. При добавлении пользователь вводит данные, а id генерирует приложение.

**Почему id не index?** Index меняется при удалении/сортировке; стабильный id лучше для идентификации и React keys.

**Что такое `...trip`?** Spread operator копирует свойства объекта в новый объект.

**Что делает `.filter()` при delete?** Создаёт новый массив без элемента с удаляемым id; исходный массив напрямую не мутируется.

**Что такое controlled TextInput?** `value` приходит из state, а `onChangeText` обновляет этот state.

**Почему Pressable вместо Button?** Pressable позволяет контролировать стили и visual feedback при нажатии.

**Почему FlatList?** Лучше для потенциально длинных списков благодаря virtualization.

**Что будет без интернета?** Основной журнал работает, потому что данные локальные и внешнего API нет.

**Что не готово?** Cloud backend/authentication/external API не реализованы. Это сознательно не заявляется как готовый функционал.

## 13. Если попросят изменить код на месте

Умей быстро показать: изменить цвет в `theme.ts`; добавить initial trip; изменить validation rating; добавить новое поле в `Trip`; изменить текст кнопки; объяснить/изменить route; добавить console.log в handleSave; найти функцию deleteTrip.

## 14. Перед показом

1. `npm install`
2. `npm run lint`
3. `npm test`
4. `npx expo start -c`
5. Проверить: Trips → Add → Save → Details → Delete → перезапуск приложения → сохранённые данные остаются.
