import { useState, useEffect } from "react";

const useInstructorId = () => {
  const [instructorId, setInstructorId] = useState(null);

  useEffect(() => {
    const persistedState = localStorage.getItem("persist:root");
    if (persistedState) {
      const authState = JSON.parse(JSON.parse(persistedState).auth);
      const instructorIdLong = authState.instructorId ? Number(authState.instructorId) : null;
      setInstructorId(instructorIdLong);
    }
  }, []);

  return instructorId;
};
export default useInstructorId;