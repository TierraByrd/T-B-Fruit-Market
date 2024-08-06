import { put, call, takeLatest, select, all, takeEvery} from 'redux-saga/effects';
import axios from 'axios';

    
// Fetch Fruits Saga
export function* fetchFruit() {
    try {
        const response = yield call(axios.get, '/api/fruit');
        yield put({ type: 'SET_FRUIT', payload: response.data });
    } catch (error) {
        console.error('Error fetching fruits:', error);
    }
}

// Buy Fruit Saga
export function* buyFruit(action) {
    try {
        yield call(axios.post, '/api/fruit/buy', action.payload);
         // Fetch updated average price
        yield put({ type: 'FETCH_FRUIT_AVERAGE_PRICE_REQUEST', payload: { fruitId: action.payload.fruitId } });
        yield put({ type: 'BUY_FRUIT_SUCCESS', payload: action.payload });
    } catch (error) {
        console.error('Error buying fruit:', error);
    }
}
//fetch purchased fruit
export function* fetchPurchasedFruits() {
    try {
        const response = yield call(axios.get, '/api/fruit/purchased');
        yield put({ type: 'SET_PURCHASED_FRUITS', payload: response.data });
    } catch (error) {
        console.error('Error fetching purchased fruits:', error);
    }
}

// Sell Fruit Saga
export function* sellFruit(action) {
    try {
        const { fruitId, quantity } = action.payload;
        yield call(axios.post, '/api/fruit/sell', { fruitId, quantity });
        yield put({ type: 'SELL_FRUIT_SUCCESS', payload: action.payload });
    } catch (error) {
        console.error('Error selling fruit:', error);
    }
}

// // Helper function to generate new price
// const generateNewPrice = (currentPrice) => {
//   const change = (Math.random() * 0.49 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
//   let newPrice = Math.max(0.50, Math.min(9.99, parseFloat(currentPrice) + change));
//   return parseFloat(newPrice.toFixed(2));
// };

// Saga to update fruit prices
function* updatePricesSaga() {
  try {
        // Request the server to calculate and update fruit prices
        yield call(axios.post, '/api/fruit/update-prices');
        
        // Optionally, refetch the updated prices from the server
        yield put({ type: 'FETCH_FRUIT' });
    } catch (error) {
        console.error('Error requesting price update from server:', error);
    }
}
// Saga to get averaged purchased price
function* fetchFruitAveragePrice(action) {
    try {
        const response = yield call(axios.get, `/api/fruit/${action.payload.fruitId}/average-price`);
        yield put({
            type: 'UPDATE_FRUIT_AVERAGE_PRICE',
            payload: {
                id: action.payload.fruitId,
                averagePurchasedPrice: response.data.averagePurchasedPrice
            }
        });
    } catch (error) {
        console.error('Error fetching average price:', error);
    }
}
// Watcher saga for periodic price updates
function* watchPriceUpdates() {
    yield call(updatePricesSaga); // Initial update
    yield takeLatest('UPDATE_PRICES_INTERVAL', updatePricesSaga); // Handle price updates on action
}


// Root Saga
export default function* rootSaga() {
    yield all([
        takeLatest('FETCH_FRUIT', fetchFruit),
        takeLatest('BUY_FRUIT_REQUEST', buyFruit),
        takeLatest('SELL_FRUIT_REQUEST', sellFruit),
        takeLatest('FETCH_PURCHASED_FRUITS', fetchPurchasedFruits),
        takeEvery('FETCH_FRUIT_AVERAGE_PRICE_REQUEST', fetchFruitAveragePrice), // Make sure this is added
        watchPriceUpdates()
    ]);
}