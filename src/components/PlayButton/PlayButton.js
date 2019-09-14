import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import './PlayButton.css';

const { bool, func } = PropTypes;

const PlayButton = props => {
  let icon;

  if (props.showRestart) {
    icon = <span>&#8635;</span>;
  } else {
    icon = props.isPlaying ? <span>&#8214;</span> : <span>&#9654;</span>;
  }

  return (
    <Button
      onClick={props.onPlay}
      variant="outline-dark"
      className="button"
    >
      {icon}
    </Button>
  );
};

PlayButton.propTypes = {
  showRestart: bool,
  isPlaying: bool,
  onPlay: func.isRequired,
};

export { PlayButton }
