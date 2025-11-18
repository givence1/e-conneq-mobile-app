import ResultSecTerm from '@/components/ResultSecTerm';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';


type TermSecRouteParams = {
  term: string;
  result_type: string;
};


const termsec = () => {
  const route = useRoute<RouteProp<Record<string, TermSecRouteParams>, string>>();
  const { term, result_type } = route.params || {};

  return (
    <ResultSecTerm
      result_type={result_type}
      term={"term_" + term}
    />
  );
}

export default termsec;