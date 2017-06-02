interface IAppState {
    helloMessage: string;
    counter: number;
}

let initialState: IAppState = {
    helloMessage: 'Hello from the future!',
    counter: 0
};

export default function appReducer(state = initialState, action = { type: '', payload: null }) {
    switch (action.type) {
        default:
            return state;
    }
}
