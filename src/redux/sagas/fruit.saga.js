import { put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

// Fetch Fruits Saga
export function* fetchFruit () {
    try {
        const response = yield axios.get('/api/fruit'); 
        yield put({ 
            type: 'SET_FRUIT', 
            payload: response.data 
        });
      } catch (error) {
        console.error('Error fetching TEAMS:', error);
      }
    }
// Buy Fruit Saga
export function* buyFruit(action) {
  try {
    yield axios.post('/api/fruit/buy', action.payload);
    yield put({ 
        type: 'BUY_FRUIT_SUCCESS',
        payload: action.payload
    }); 
  } catch (error) {
    console.error('Error buying fruit:', error);
  }
}

// Sell Fruit Saga
export function* sellFruit(action) {
  try {
    const { fruitId, quantity } = action.payload;
    yield axios.post('/api/fruit/sell', { fruitId, quantity });
    yield put({ 
        type: 'SELL_FRUIT_SUCCESS',
        payload: action.payload
    }); 
  } catch (error) {
    console.error('Error selling fruit:', error);
  }
}
// Root Saga
function* fruitSaga() {
    yield takeLatest('FETCH_FRUIT', fetchFruit);
     yield takeLatest('BUY_FRUIT_REQUEST', buyFruit);
     yield takeLatest('SELL_FRUIT_REQUEST', sellFruit);
  }
  
export default fruitSaga;