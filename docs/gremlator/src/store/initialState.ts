import { State, TRANSLATOR_KEYS } from './types';

const emptyTranslations = Object.fromEntries(
  TRANSLATOR_KEYS.map((key) => [key, ''])
) as State['translations'];

const initialState: State = {
  queryInput: '',
  translations: emptyTranslations,
  error: null,
};

export default initialState;
