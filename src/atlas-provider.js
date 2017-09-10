import React, { Component } from 'react';
import propTypes from 'prop-types';

class AtlasProvider extends Component {
  getChildContext() {
    return {
      client: this.props.client,
    };
  }

  render() {
    return this.props.children;
  }
}

AtlasProvider.childContextTypes = {
  client: propTypes.object.isRequired,
};

export default AtlasProvider;
