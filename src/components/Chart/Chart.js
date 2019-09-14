import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { groupBy, isEmpty, last } from 'lodash';

import { PlayButton } from '../PlayButton';
import { ProgressBar } from '../ProgressBar';
import './Chart.css';
import * as utils from '../../utils';

const { arrayOf, number, shape, string } = PropTypes;

export class Chart extends Component {
  static propTypes = {
    data: arrayOf(shape({
      island: string,
      pigPopulation: number,
      year: number,
    })),
  };

  state = {
    isPlaying: false,
    hasEnded: false,
    currentDataset: {},
    currentYear: null,
    currentDatasetIndex: 0,
    dataGroupedByYears: null,
    years: null,
    progressBarValue: 0,
    intervalId: null,
  };

  componentDidMount() {
    const dataGroupedByYears = groupBy(this.props.data, 'year');
    const years = utils.getYearsList(dataGroupedByYears);

    this.setState({
      dataGroupedByYears,
      years,
    });

    this.handleUrlParams(years, dataGroupedByYears);
  }

  handleUrlParams(years, dataGroupedByYears) {
    const params = utils.getQueryParams();

    if (isEmpty(params)) {
      const currentYear = years[this.state.currentDatasetIndex];

      this.setState({
        currentYear,
        currentDatasetIndex: this.state.currentDatasetIndex + 1,
        currentDataset: utils.getDatasetByYear({ year: currentYear, dataGroupedByYears }),
      });
    } else {
      this.setStateFromParams(params, years, dataGroupedByYears);
    }
  }

  setStateFromParams(params, years, dataGroupedByYears) {
    const isLastYear = params.year === last(years);

    this.setState({
      isPlaying: !params.paused,
      hasEnded: isLastYear,
      currentYear: params.year,
      currentDatasetIndex: years.indexOf(params.year) + 1,
      currentDataset: utils.getDatasetByYear({ year: params.year, dataGroupedByYears }),
      progressBarValue: utils.getCurrentProgressbarValue({
        currentYear: params.year,
        years
      }),
    }, () => {
      if (!params.paused) {
        this.startAnimation();
      }
    });
  }

  showNextDataset = () => {
    const currentYear = this.state.years[this.state.currentDatasetIndex];

    this.setState({
      progressBarValue: this.state.progressBarValue + utils.getNextProgressbarValue({
        currentYear,
        previousYear: this.state.years[this.state.currentDatasetIndex - 1],
        years: this.state.years,
      }),
    });

    utils.setQueryParams({ paused: false, year: currentYear });

    if (!currentYear) {
      this.stopAnimation();
      this.setState({ hasEnded: true });
      return;
    }

    this.setState({
      currentYear,
      currentDatasetIndex: this.state.currentDatasetIndex + 1,
      currentDataset: utils.getDatasetByYear({ year: currentYear, dataGroupedByYears: this.state.dataGroupedByYears }),
    });
  };

  startAnimation = () => {
    const intervalId = setInterval(() => {
      this.showNextDataset();
    }, 2000);

    this.setState({ intervalId, isPlaying: true });

    utils.setQueryParams({ paused: false, year: this.state.currentYear });
  };

  stopAnimation() {
    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null, isPlaying: false });

    utils.setQueryParams({ paused: true, year: this.state.currentYear });
  }

  onPlayToggle = () => {
    if (this.state.hasEnded) {
      const currentYear = this.state.years[0];

      this.setState({
        progressBarValue: 0,
        hasEnded: false,
        isPlaying: true,
        currentYear,
        currentDatasetIndex: 1,
        currentDataset: utils.getDatasetByYear({
          year: currentYear,
          dataGroupedByYears: this.state.dataGroupedByYears
        }),
      });

      utils.setQueryParams({ paused: false, year: currentYear });
      this.startAnimation();

      return;
    }

    if (this.state.isPlaying) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

  render() {
    return (
      <Fragment>
        <Bar data={this.state.currentDataset}/>
        <div className="controls">
          <PlayButton
            showRestart={this.state.hasEnded}
            onPlay={this.onPlayToggle}
            isPlaying={this.state.isPlaying}
          />
          <ProgressBar value={this.state.progressBarValue} label={this.state.currentYear}/>
        </div>
      </Fragment>
    );
  }
}
