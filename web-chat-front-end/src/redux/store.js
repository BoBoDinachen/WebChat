import { createStore,combineReducers } from 'redux'
import chatInfoReducer from './reducer/chatInfo_reducer'
import {composeWithDevTools} from 'redux-devtools-extension';
// 通过reducer创建tore
const allReducer = combineReducers({
  chatInfo: chatInfoReducer
})
const store = createStore(allReducer,composeWithDevTools());
export default store; 
