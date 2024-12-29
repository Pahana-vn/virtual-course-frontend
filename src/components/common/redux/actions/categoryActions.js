// import axios from "axios";

// // Action types
// export const FETCH_CATEGORIES_REQUEST = "FETCH_CATEGORIES_REQUEST";
// export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
// export const FETCH_CATEGORIES_FAILURE = "FETCH_CATEGORIES_FAILURE";

// // Action creator để fetch categories
// export const fetchCategories = () => async (dispatch) => {
//   dispatch({ type: FETCH_CATEGORIES_REQUEST }); // Bắt đầu gọi API

//   try {
//     const response = await axios.get("http://localhost:8080/api/categories"); // Thay đổi URL nếu cần thiết
//     dispatch({
//       type: FETCH_CATEGORIES_SUCCESS,
//       payload: response.data, // Dữ liệu trả về từ API
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_CATEGORIES_FAILURE,
//       payload: error.message, // Lỗi nếu gọi API thất bại
//     });
//   }
// };
