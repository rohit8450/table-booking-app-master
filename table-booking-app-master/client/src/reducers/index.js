import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import table_Reducer from "./table_Reducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  tables: table_Reducer,
});
