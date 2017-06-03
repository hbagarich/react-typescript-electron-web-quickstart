import * as appActions from './../constants/app';

export interface IAppReducerState {
    helloMessage: string;
    counter: number;
    url: string;
}

let initialState: IAppReducerState = {
    helloMessage: 'Hello from the future!',
    counter: 0,
    url: ''
};

export default function appReducer(state = initialState, action = { type: '', payload: null }) {
    switch (action.type) {
        case appActions.INCREASE_INDEX_ACTION:
            return { ...state, counter: state.counter + 1 };
        case appActions.GET_GIF_URL_RESPONSE:
            return { ...state, url: action.payload };
        default:
            return state;
    }
}
