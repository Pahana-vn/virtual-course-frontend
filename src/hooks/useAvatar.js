import { useInstructorAvatarQuery } from "../components/common/redux/slices/instructorApiSlice";
import { useStudentAvatarQuery } from "../components/common/redux/slices/studentApiSlice";

const useAvatar = ({ id, role }) => {
  if (role === "ROLE_INSTRUCTOR") {
    return useInstructorAvatarQuery({ id });
  }
  if (role === "ROLE_STUDENT") {
    return useStudentAvatarQuery({ id });
  }
  return { data: { url: "default-avatar.png" } }; // Trường hợp không có role
};

export default useAvatar;