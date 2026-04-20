/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
