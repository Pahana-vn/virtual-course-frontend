// import { useSelector } from "react-redux";
// import { useInstructorAvatarQuery } from "../components/common/redux/slices/instructor/instructorApiSlice";
// import { useStudentAvatarQuery } from "../components/common/redux/slices/student/studentApiSlice";
// import { selectCurrentRoles } from "../components/common/redux/slices/auth/authSlice";

// const useAvatar = ({ accountId}) => {
//   const role = useSelector(selectCurrentRoles);
//   if (role === "ROLE_INSTRUCTOR") {
//     return useInstructorAvatarQuery({ accountId });
//   }
//   if (role === "ROLE_STUDENT") {
//     return useStudentAvatarQuery({ accountId });
//   }
//   return { data: { url: "default-avatar.png" } }; // Trường hợp không có role
// };

// export default useAvatar;