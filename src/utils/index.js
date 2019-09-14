import qs from 'querystringify';
import { find, property, isBoolean, isEmpty } from 'lodash';

const chartConfig = {
  label: 'Pigs population',
  backgroundColor: 'rgba(255,99,132,0.2)',
  borderColor: 'rgba(255,99,132,1)',
  borderWidth: 1,
  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  hoverBorderColor: 'rgba(255,99,132,1)',
};

const strToBool = string => {
  switch (string) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return string;
  }
};

export const setQueryParams = ({ paused, year }) => {
  window.history.replaceState(
    '',
    '',
    `?paused=${paused}&year=${year}`,
  );
};

export const getQueryParams = () => {
  const params = qs.parse(window.location.search);

  if (isEmpty(params)) {
    return null;
  }

  if ('paused' in params) {
    const paused = strToBool(params.paused);

    if (isBoolean(paused)) {
      params.paused = paused;
    } else {
      delete params.paused;
    }
  }

  return {
    ...params,
    year: Number(params.year),
  };
};

export const getNextProgressbarValue = ({ previousYear, currentYear, years }) => {
  const totalYearsValue = years[years.length - 1] - years[0];
  const yearsDifference = currentYear - previousYear;

  return (yearsDifference / totalYearsValue) * 100;
};

export const getCurrentProgressbarValue = ({ currentYear, years }) => {
  const totalYearsValue = years[years.length - 1] - years[0];
  return (years.indexOf(currentYear) / totalYearsValue) * 100;
};


export const getDatasetByYear = ({ year, dataGroupedByYears }) => {
  const dataForYear = dataGroupedByYears[year];

  if (!dataForYear) {
    return {};
  }

  const islandNames = dataForYear.map(property('island')).sort((island, nextIsland) => island > nextIsland ? 1 : -1);

  const populationSortedByIsland = islandNames.map(islandName => {
    return find(dataForYear, { island: islandName })['pigPopulation']
  });

  return {
    labels: islandNames,
    datasets: [{
      ...chartConfig,
      data: populationSortedByIsland,
    }],
  };
};

export const getYearsList = dataGroupedByYears => Object.keys(dataGroupedByYears).map(Number).sort((year, nextYear) => year > nextYear ? 1 : -1);
