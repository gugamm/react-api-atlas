import React, { Component } from 'react';
import propTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

const atlas = (atlasRequestDescription, { options = {}, propName = 'request', auto = true, props, updateAfter } = {}) => (TargetComponent) => {
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
      this.handleOnCacheChange = this.handleOnCacheChange.bind(this);
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
      .then((response) => {
        if (updateAfter) {
          const cacheId = client.getCacheId(atlasRequestDescription);
          client.updateCache(cacheId, updateAfter)
          .then(
            updatedResponse => this.setState({
              loading: false,
              data: updatedResponse,
              error: null,
            })
          );
        } else {
          this.setState({
            loading: false,
            data: response,
            error: null,
          });  
        }
      })
      .catch(
        err => this.setState({
          loading: false,
          data: null,
          error: err,
        }),
      );
    }

    handleOnCacheChange(newCache) {
      if (!this.state.loading && this.state.date !== newCache) {
        this.setState({
          data: newCache,
        });
      }
    }

    componentDidMount() {
      const { client } = this.context;
      if (auto) {
        this.fetchData();
      }
      client.subscribeForCache(client.getCacheId(atlasRequestDescription), this.handleOnCacheChange);
    }

    render() {
      const newProps = {...this.props};
      newProps[propName] = {
        ...this.state,
        fetchData: this.fetchData,
      };

      if (props) {
        return <TargetComponent {...this.props} {...props(newProps)} />;
      }

      return <TargetComponent {...newProps} />;
    }
  }

  AtlasConnectedComponent.contextTypes = {
    client: propTypes.object.isRequired,
  };

  hoistNonReactStatic(AtlasConnectedComponent, TargetComponent);

  return AtlasConnectedComponent;
}

export default atlas;
