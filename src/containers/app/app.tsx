import * as React from 'react';
import * as classNames from 'classnames';
import './app.scss';
import { connect } from 'react-redux';
import { IAppReducerState } from './../../reducers/appReducer';
import * as appActions from './../../action/app';

function mapStateToProps(state): IAppProps {
  let appState: IAppReducerState = state.app;
  return {
    indexer: appState.counter,
    name: appState.helloMessage,
    url: appState.url
  };
}

function mapDispatchToProps(dispatch): IAppProps {
  return {
    increaseCounter: () => { dispatch(appActions.increaseIndexAction()); },
    loadGid: (name: string) => { dispatch(appActions.changeName(name)); }
  };
}

interface IAppState {

}

interface IAppProps {
  name?: string;
  indexer?: number;
  url?: string;
  increaseCounter?: () => void;
  loadGid?: (name: string) => void;
}


class App extends React.Component<IAppProps, void> {
  constructor(props: IAppProps) {
    super(props);
  }

  componentDidMount() {
    this.props.increaseCounter();
    this.props.loadGid(this.props.name);
  }

  public render() {

    return (
      <div>
        {this.props.name} {this.props.indexer}
        {this.props.url &&
          <img src={this.props.url} />
        }

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App as any);
