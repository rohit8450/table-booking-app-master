import axios from "axios";

export const getTables = (time) => (dispatch) => {
  axios
    .get(`/api/users/getTables/${time}`)
    .then((res) => console.log(res.data)) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
