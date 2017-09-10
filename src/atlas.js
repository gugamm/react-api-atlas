import React, { Component } from 'react';
import propTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

const atlas = (atlasRequestDescription, { options = {}, propName = 'request', auto = true } = {}) => (TargetComponent) => {
  class AtlasConnectedComponent extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        loading: auto,
        data: null,
        error: null,
      };

      this.buildOptions = this.buildOptions.bind(this);
      this.fetchData = this.fetchData.bind(this);
    }

    buildOptions() {
      if (typeof options === 'function') {
        return options(this.props);
      }
      return options;
    }

    fetchData(fetchOptions = {}) {
      const { client } = this.context;
      const finalOptions = {
        ...this.buildOptions(),
        ...fetchOptions,
      };
      this.setState({
        loading: true,
        data: null,
        error: null,
      });
      client.fetch(atlasRequestDescription, finalOptions)
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

    componentDidMount() {
      if (auto) {
        this.fetchData();
      }
    }

    render() {
      const props = {...this.props};
      props[propName] = {
        ...this.state,
        fetchData: this.fetchData,
      };
      return <TargetComponent {...props} />;
    }
  }

  AtlasConnectedComponent.contextTypes = {
    client: propTypes.object.isRequired,
  };

  hoistNonReactStatic(AtlasConnectedComponent, TargetComponent);

  return AtlasConnectedComponent;
}

export default atlas;
