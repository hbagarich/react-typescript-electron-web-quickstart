import * as appActions from './../constants/app';

export function increaseIndexAction() {
    return (dispatch, getState) => {
        dispatch({
            type: appActions.INCREASE_INDEX_ACTION,
            payload: null
        });
    };

}

export function changeName(newName: string) {
    return (dispatch, getState) => {
        dispatch({
            type: appActions.GET_GIF_URL_REQUEST,
            payload: newName
        });

        fetch('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + newName, {
            method: 'get'
        }).then(r => {
            r.json().then(response => {
                dispatch({
                    type: appActions.GET_GIF_URL_RESPONSE,
                    payload: response.data.image_url
                });
            });
        }).catch(err => {
            dispatch({
                type: appActions.GET_GIF_URL_ERROR,
                payload: err
            });
        });
    };
}
