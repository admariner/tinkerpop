import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import QueryInput from '../../components/QueryInput';
import LanguageTabs from '../../components/LanguageTabs';
import TranslationResult from '../../components/TranslationResult';
import ErrorAlert from '../../components/ErrorAlert';
import { reducer, initialState, SET_QUERY_INPUT, TRANSLATE_QUERY } from '../../store';
import { TranslatorKey } from '../../store/types';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OutputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const QueryTranslator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState<TranslatorKey>('CANONICAL');

  const handleChange = (value: string) => {
    dispatch({ type: SET_QUERY_INPUT, payload: value });
  };

  const handleTranslate = () => {
    dispatch({ type: TRANSLATE_QUERY });
  };

  const handleDismissError = () => {
    dispatch({ type: SET_QUERY_INPUT, payload: state.queryInput });
  };

  return (
    <Wrapper>
      {state.error && (
        <ErrorAlert message={state.error} onDismiss={handleDismissError} />
      )}
      <QueryInput
        value={state.queryInput}
        onChange={handleChange}
        onTranslate={handleTranslate}
      />
      <OutputSection>
        <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <TranslationResult activeTab={activeTab} translations={state.translations} />
      </OutputSection>
    </Wrapper>
  );
};

export default QueryTranslator;
