// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// import useUser from "../../hooks/useUser";
// import InstructorSidebar from "../sidebar";
// import { InstructorHeader } from "../header";

// import { Icon1, Icon2 } from "../../imagepath";

// const InstructorCourse = () => {
//   const userData = useUser();
//   const [instructorCourses, setInstructorCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInstructorCourseData = async () => {
//       const id = userData.id;
//       try {
//         const [instructorCoursesResponse] = await Promise.all([
//           fetch(`http://localhost:8080/api/instructors/${id}/courses`),
//         ]);
//         if (!instructorCoursesResponse.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const instructorCoursesData = await instructorCoursesResponse.json();
//         setInstructorCourses(instructorCoursesData);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };
//     fetchInstructorCourseData();
//   }, []);
//   if (loading) {
//     return <div>Loading...</div>; // Hiển thị loading khi đang fetch dữ liệu
//   }

//   if (error) {
//     return <div>Error: {error}</div>; // Hiển thị lỗi nếu fetch thất bại
//   }

//   const publishedCourses = instructorCourses.filter(
//     (course) => course.status === "PUBLISHED"
//   );
//   const pendingCourses = instructorCourses.filter(
//     (course) => course.status === "PENDING"
//   );
//   const canceledCourses = instructorCourses.filter(
//     (course) => course.status === "CANCELED"
//   );

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const totalPublishedPages = Math.ceil(publishedCourses.length / itemsPerPage + 1);
//   const totalPendingPages = Math.ceil(pendingCourses.length / itemsPerPage + 1);
//   const totalCanceledPages = Math.ceil(canceledCourses.length / itemsPerPage + 1);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const paginatedpublishedCourses = publishedCourses.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const paginatedPendingCourses = pendingCourses.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const paginatedCanceledCourses = canceledCourses.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   return (
//     <div className="main-wrapper">
//       <InstructorHeader activeMenu={"My Course"} />
//       <>
//         {/* Breadcrumb */}
//         <div className="breadcrumb-bar breadcrumb-bar-info">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-12 col-12">
//                 <div className="breadcrumb-list">
//                   <h2 className="breadcrumb-title">My Courses</h2>
//                   <nav aria-label="breadcrumb" className="page-breadcrumb">
//                     <ol className="breadcrumb">
//                       <li className="breadcrumb-item">
//                         <Link to="/">Home</Link>
//                       </li>
//                       <li
//                         className="breadcrumb-item active"
//                         aria-current="page"
//                       >
//                         My Courses
//                       </li>
//                     </ol>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* /Breadcrumb */}
//         {/* Page Content */}
//         <div className="page-content">
//           <div className="container">
//             <div className="row">
//               {/* sidebar */}
//               <InstructorSidebar />
//               {/* /Sidebar */}
//               {/* Instructor Courses */}
//               <div className="col-xl-9 col-lg-9">
//                 <div className="settings-widget card-info">
//                   <div className="settings-menu p-0">
//                     <div className="profile-heading">
//                       <h3>My Courses</h3>
//                       <p>Manage your courses and its updates</p>
//                     </div>
//                     <div className="checkout-form pb-0">
//                       <div className="wishlist-tab">
//                         <ul className="nav">
//                           <li className="nav-item">
//                             <Link
//                               to="#"
//                               className="active"
//                               data-bs-toggle="tab"
//                               data-bs-target="#enroll-courses"
//                             >
//                               Published ({publishedCourses.length})
//                             </Link>
//                           </li>
//                           <li className="nav-item">
//                             <Link
//                               to="#"
//                               data-bs-toggle="tab"
//                               data-bs-target="#active-courses"
//                             >
//                               Pending ({pendingCourses.length})
//                             </Link>
//                           </li>
//                           <li className="nav-item">
//                             <Link
//                               to="#"
//                               data-bs-toggle="tab"
//                               data-bs-target="#complete-courses"
//                             >
//                               Canceled ({canceledCourses.length})
//                             </Link>
//                           </li>
//                         </ul>
//                       </div>
//                       <div className="tab-content">
//                         <div
//                           className="tab-pane fade show active"
//                           id="enroll-courses"
//                         >
//                           <div className="row">
//                             {/* Course Grid */}
//                             {publishedCourses.map((course) => (
//                               <div
//                                 key={course.id}
//                                 className="col-xxl-4 col-md-6 d-flex"
//                               >
//                                 <div className="course-box flex-fill">
//                                   <div className="product">
//                                     <div className="product-img">
//                                       <Link to={`/course-details/${course.id}`}>
//                                         <img
//                                           className="img-fluid"
//                                           alt="Img"
//                                           src={course.imageCover}
//                                         />
//                                       </Link>
//                                       <div className="price combo">
//                                         <h3>{course.basicPrice}</h3>
//                                       </div>
//                                     </div>
//                                     <div className="product-content">
//                                       <h3 className="title instructor-text">
//                                         <Link
//                                           to={`/course-details/${course.id}`}
//                                         >
//                                           {course.titleCourse}
//                                         </Link>
//                                       </h3>
//                                       <div className="course-info d-flex align-items-center">
//                                         <div className="rating-img d-flex align-items-center">
//                                           <img src={Icon1} alt="Img" />
//                                           <p>{course.lessons}+ Lesson</p>
//                                         </div>
//                                         <div className="course-view d-flex align-items-center">
//                                           <img src={Icon2} alt="Img" />
//                                           <p>{course.duration}h</p>
//                                         </div>
//                                       </div>
//                                       <div className="course-edit-btn d-flex align-items-center justify-content-between">
//                                         <Link to="#">
//                                           <i className="bx bx-edit me-2" />
//                                           Edit
//                                         </Link>
//                                         <Link to="#">
//                                           <i className="bx bx-trash me-2" />
//                                           Delete
//                                         </Link>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                             {/* /Course Grid */}
//                           </div>
//                         </div>
//                         <div className="tab-pane fade" id="active-courses">
//                           <div className="row">
//                             {/* Course Grid */}
//                             {pendingCourses.map((course) => (
//                               <div
//                                 key={course.id}
//                                 className="col-xxl-4 col-md-6 d-flex"
//                               >
//                                 <div className="course-box flex-fill">
//                                   <div className="product">
//                                     <div className="product-img">
//                                       <Link to={`/course-details/${course.id}`}>
//                                         <img
//                                           className="img-fluid"
//                                           alt="Img"
//                                           src={course.imageCover}
//                                         />
//                                       </Link>
//                                       <div className="price combo">
//                                         <h3>{course.basicPrice}</h3>
//                                       </div>
//                                     </div>
//                                     <div className="product-content">
//                                       <h3 className="title instructor-text">
//                                         <Link
//                                           to={`/course-details/${course.id}`}
//                                         >
//                                           {course.titleCourse}
//                                         </Link>
//                                       </h3>
//                                       <div className="course-info d-flex align-items-center">
//                                         <div className="rating-img d-flex align-items-center">
//                                           <img src={Icon1} alt="Img" />
//                                           <p>{course.lessons}+ Lesson</p>
//                                         </div>
//                                         <div className="course-view d-flex align-items-center">
//                                           <img src={Icon2} alt="Img" />
//                                           <p>{course.duration}h</p>
//                                         </div>
//                                       </div>
//                                       <div className="course-edit-btn d-flex align-items-center justify-content-between">
//                                         <Link to="#">
//                                           <i className="bx bx-edit me-2" />
//                                           Edit
//                                         </Link>
//                                         <Link to="#">
//                                           <i className="bx bx-trash me-2" />
//                                           Delete
//                                         </Link>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                             {/* /Course Grid */}
//                           </div>
//                         </div>
//                         <div className="tab-pane fade" id="complete-courses">
//                           <div className="row">
//                             {/* Course Grid */}
//                             {canceledCourses.map((course) => (
//                               <div
//                                 key={course.id}
//                                 className="col-xxl-4 col-md-6 d-flex"
//                               >
//                                 <div className="course-box flex-fill">
//                                   <div className="product">
//                                     <div className="product-img">
//                                       <Link to={`/course-details/${course.id}`}>
//                                         <img
//                                           className="img-fluid"
//                                           alt="Img"
//                                           src={course.imageCover}
//                                         />
//                                       </Link>
//                                       <div className="price combo">
//                                         <h3>{course.basicPrice}</h3>
//                                       </div>
//                                     </div>
//                                     <div className="product-content">
//                                       <h3 className="title instructor-text">
//                                         <Link
//                                           to={`/course-details/${course.id}`}
//                                         >
//                                           {course.titleCourse}
//                                         </Link>
//                                       </h3>
//                                       <div className="course-info d-flex align-items-center">
//                                         <div className="rating-img d-flex align-items-center">
//                                           <img src={Icon1} alt="Img" />
//                                           <p>{course.lessons}+ Lesson</p>
//                                         </div>
//                                         <div className="course-view d-flex align-items-center">
//                                           <img src={Icon2} alt="Img" />
//                                           <p>{course.duration}h</p>
//                                         </div>
//                                       </div>
//                                       <div className="course-edit-btn d-flex align-items-center justify-content-between">
//                                         <Link to="#">
//                                           <i className="bx bx-edit me-2" />
//                                           Edit
//                                         </Link>
//                                         <Link to="#">
//                                           <i className="bx bx-trash me-2" />
//                                           Delete
//                                         </Link>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                             {/* /Course Grid */}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="dash-pagination">
//                   <div className="row align-items-center">
//                     <div className="col-6">
//                       <p>Page 1 of 2</p>
//                     </div>
//                     <div className="col-6">
//                       <ul className="pagination">
//                         <li className="active">
//                           <Link to="#">1</Link>
//                         </li>
//                         <li>
//                           <Link to="#">2</Link>
//                         </li>
//                         <li>
//                           <Link to="#">
//                             <i className="bx bx-chevron-right" />
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* /Instructor Courses */}
//             </div>
//           </div>
//         </div>
//         {/* /Page Content */}
//       </>
//     </div>
//   );
// };

// export default InstructorCourse;
