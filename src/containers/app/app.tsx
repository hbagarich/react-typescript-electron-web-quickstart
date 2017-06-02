import * as React from 'react';
import * as classNames from 'classnames';
import './app.scss';
const connect = require('react-redux').connect;

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
  return {
  
  };
}

class App extends React.Component<IAppProps, void> {
  render() {
    return (
      <div>
          Hello
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
