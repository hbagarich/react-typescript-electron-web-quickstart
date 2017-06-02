import 'babel-polyfill';
import 'ts-helpers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import thunk from 'redux-thunk';

import configureStore from './store/configureStore';
import App from './containers/app/app';


const { Provider } = require('react-redux');
const { Router, hashHistory, Route } = require('react-router');
const { syncHistoryWithStore } = require('react-router-redux');
const store = configureStore({});
const history = syncHistoryWithStore(hashHistory, store);

export default class Index extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <Provider store={store}>
                    <Router history={history} >
                        <Route path="/" component={App} />
                    </Router>
                </Provider>
            </div>
        );
    }
}


ReactDOM.render(<Index />, document.getElementById('root'));
