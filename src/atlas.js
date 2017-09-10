import React, { Component } from 'react';
import propTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

const atlas = (atlasRequestDescription, { options, propName = 'data' }) => (TargetComponent) => {
  class AtlasConnectedComponent extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        loading: false,
        data: null,
        error: null,
      };
    }

    componentDidMount() {
      const { client } = this.context.client;
      this.setState({
        loading: true,
        data: null,
        error: null,
      });
      client.fetch(atlasRequestDescription, options)
      .then(
        response => this.setState({
          loading: false,
          data: response,
          error: null,
        }),
      )
      .catch(
        err => this.setState({
          loading: false,
          data: null,
          error: err,
        }),
      );
    }

    render() {
      const { props } = this.props;
      props[propName] = this.state;
      return <TargetComponent {...props} />;
    }
  }

  AtlasConnectedComponent.contextTypes = {
    client: propTypes.object.isRequired,
  };

  hoistNonReactStatic(AtlasConnectedComponent, TargetComponent);

  return AtlasConnectedComponent;
}

