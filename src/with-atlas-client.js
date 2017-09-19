import React, { Component } from 'react';
import hoistReactNonStatics from 'hoist-non-react-statics';
import propTypes from 'prop-types';

const withAtlasClient = (TargetComponent, { propName = 'atlasClient' } = {}) => {
  class WithAtlasClient extends Component {
    render() {
      const newProps = {...this.props};
      newProps[propName] = this.context.client;
      return <TargetComponent {...newProps} />;
    }
  }

  WithAtlasClient.contextTypes = {
    client: propTypes.object.isRequired,
  };

  hoistReactNonStatics(WithAtlasClient, TargetComponent);

  return WithAtlasClient;
};

export default withAtlasClient;
