
  const useDateFormatter = () => {
    const formatDate = (utcDateString) => {
        const date = new Date(utcDateString);
        // Convert UTC to Vietnam time zone
        return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      };
  
    return formatDate;
  };
  
  export default useDateFormatter;