import axios from 'axios';
import { put, call, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}
// User Balance Saga
export function* fetchUserBalance() {
  try {
      const response = yield call(axios.get, '/api/user/balance');
      yield put({ type: 'FETCH_TOTAL_CASH', payload: parseFloat(response.data.total_cash) });
  } catch (error) {
      console.error('Error fetching user balance:', error);
  }
}
function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_USER_BALANCE', fetchUserBalance);
}

export default userSaga;
