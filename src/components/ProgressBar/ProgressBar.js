import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar as Progress } from 'react-bootstrap';

import './ProgressBar.css';

const { number } = PropTypes;

const ProgressBar = props => {
  return (
    <Progress
      now={props.value}
      label={props.label ? `Current year: ${props.label}` : null}
    />
    );
};

ProgressBar.propTypes = {
  value: number,
  label: number,
};

export { ProgressBar };
