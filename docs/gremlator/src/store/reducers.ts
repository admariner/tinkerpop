import { GremlinTranslator } from 'gremlin/language';
import { SET_QUERY_INPUT, TRANSLATE_QUERY } from './actions';
import initialState from './initialState';
import { State, TRANSLATOR_KEYS, Translations } from './types';

const emptyTranslations = (): Translations =>
  Object.fromEntries(TRANSLATOR_KEYS.map((k) => [k, ''])) as Translations;

const reducer = (state: State = initialState, action: { type: string; payload?: string }): State => {
  switch (action.type) {
    case SET_QUERY_INPUT:
      return { ...state, queryInput: action.payload ?? '', error: null };

    case TRANSLATE_QUERY: {
      const query = state.queryInput.trim();
      if (!query) {
        return { ...state, translations: emptyTranslations(), error: null };
      }
      try {
        const translations = Object.fromEntries(
          TRANSLATOR_KEYS.map((key) => [
            key,
            GremlinTranslator.translate(query, 'g', key).getTranslated(),
          ])
        ) as Translations;
        return { ...state, translations, error: null };
      } catch (e: unknown) {
        return {
          ...state,
          translations: emptyTranslations(),
          error: e instanceof Error ? e.message : String(e),
        };
      }
    }

    default:
      return state;
  }
};

export default reducer;
