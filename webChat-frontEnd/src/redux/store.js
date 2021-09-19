import { createStore,combineReducers,applyMiddleware } from 'redux'
import chatInfoReducer from './reducer/chatInfo_reducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'
// 通过reducer创建tore
const allReducer = combineReducers({
  chatInfo: chatInfoReducer
})
const store = createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)));
export default store; 
