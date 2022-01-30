import { SET_TABLES } from "../actions/types";

const inital_state = {
  available_tables: [],
  booked_tables: [],
};

export default function (state = inital_state, action) {
  switch (action.type) {
    case SET_TABLES: {
      state = {
        ...state,
        available_tables: action.available_tables,
        booked_tables: action.booked_tables,
      };
      return { ...state };
    }
    default: {
      return { ...state };
    }
  }
}
