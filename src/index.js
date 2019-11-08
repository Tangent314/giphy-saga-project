
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';

//ROOT saga here
function* rootSaga() {
    yield takeEvery('FETCH_GIFS', getGifsSaga);
  }

  //GET saga here
function* getGifsSaga() {
    try {
        const receivedGifs = yield axios.get(`/api/search/${this.state.keyword}`);
        yield put({type: 'GET_GIFS', payload: receivedGifs.data});
    } catch (error) {
        console.log('error fetching gifs', error);
    }
  }

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Reducer that holds our results

const fetchNewGifs = (state = {}, action) => {
    if(action.type === 'GET_GIFS') {
        return action.payload;
    }
    return state;
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        fetchNewGifs
    }),
    applyMiddleware(logger),
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
