import { put, call, takeLatest, select, all} from 'redux-saga/effects';
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

// Helper function to generate new price
const generateNewPrice = (currentPrice) => {
  const change = (Math.random() * 0.49 + 0.01) * (Math.random() < 0.5 ? -1 : 1);
  let newPrice = Math.max(0.50, Math.min(9.99, parseFloat(currentPrice) + change));
  return parseFloat(newPrice.toFixed(2));
};

// Saga to update fruit prices
function* updatePricesSaga() {
    try {
        // Get current fruit prices from the Redux store
        const fruits = yield select(state => state.fruit.fruits);
        const updatedPrices = fruits.reduce((acc, fruit) => {
            acc[fruit.id] = generateNewPrice(fruit.current_price);
            return acc;
        }, {});

        // Dispatch action to update fruit prices in the server
        yield call(axios.post, '/api/fruit/update-prices', updatedPrices);

        // Dispatch action to update fruit prices in the Redux store
        yield put({ type: 'UPDATE_FRUIT_PRICES', payload: updatedPrices });
    } catch (error) {
        console.error('Error updating fruit prices:', error);
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
        watchPriceUpdates() // price update watcher saga
    ]);
}