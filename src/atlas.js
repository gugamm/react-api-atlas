import React, { Component } from 'react';
import propTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

const atlas = (atlasRequestDescription, { options = {}, propName = 'request', auto = true, props } = {}) => (TargetComponent) => {
  class AtlasConnectedComponent extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        loading: auto,
        data: null,
        error: null,
      };
      this.prevRequest = null;
      this.unsubscribeForStateChange = null;
      this.buildOptions = this.buildOptions.bind(this);
      this.fetchData = this.fetchData.bind(this);
      this.refetch = this.refetch.bind(this);
      this.handleRequestStateChange = this.handleRequestStateChange.bind(this);
    }

    buildOptions() {
      if (typeof options === 'function') {
        return options(this.props);
      }
      return options;
    }

    fetchData(fetchOptions = {}) {
      const { atlasClient } = this.context;
      const finalOptions = {
        ...this.buildOptions(),
        ...fetchOptions,
      };

      // build or get previous request
      const request = atlasClient.buildRequest(atlasRequestDescription, finalOptions);

      // subscribe for changes
      if (this.prevRequest !== request) {
        if (this.prevRequest && this.unsubscribeForStateChange) {
          this.unsubscribeForStateChange();
        }
        this.unsubscribeForStateChange = request.subscribeForState(this.handleRequestStateChange);
        this.prevRequest = request;
      }

      // subscribe to response
      return request.doFetch();
    }

    // fetch must have been called first
    refetch() {
      const request = this.prevRequest;
      return request.refetch();
    }

    handleRequestStateChange(newState) {
      this.setState(newState);
    }

    componentDidMount() {
      if (auto) {
        this.fetchData();
      }
    }

    componentWillUnmount() {
      if (this.unsubscribeForStateChange) {
        this.unsubscribeForStateChange();
      }
    }

    render() {
      const newProps = {...this.props};
      newProps[propName] = {
        ...this.state,
        fetchData: this.fetchData,
        refetch: this.refetch,
        client: this.context.atlasClient,
      };

      if (props) {
        const mapProps = {
          ownProps: {...this.props},
          fetchData: this.fetchData,
          refetch: this.refetch,
          client: this.context.atlasClient,
        };
        return <TargetComponent {...newProps} {...props(mapProps)} />;
      }

      return <TargetComponent {...newProps} />;
    }
  }

  AtlasConnectedComponent.contextTypes = {
    atlasClient: propTypes.object.isRequired,
  };

  hoistNonReactStatic(AtlasConnectedComponent, TargetComponent);

  return AtlasConnectedComponent;
};

export default atlas;
