import React, { Component } from 'react';
import propTypes from 'prop-types';

class AtlasProvider extends Component {
  getChildContext() {
    return {
      atlasClient: this.props.client,
    };
  }

  render() {
    return this.props.children;
  }
}

AtlasProvider.childContextTypes = {
  atlasClient: propTypes.object.isRequired,
};

AtlasProvider.propTypes = {
  client: propTypes.object.isRequired,
};

export default AtlasProvider;
