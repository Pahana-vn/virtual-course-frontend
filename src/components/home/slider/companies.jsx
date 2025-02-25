import React from "react";
import OwlCarousel from "react-owl-carousel";

const Companies = () => {
  var settings = {
    //autoWidth: true,
    items: 2,
    margin: 25,
    dots: false,
    nav: true,

    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 3,
      },
      1170: {
        items: 6,
      },
    },
  };
  return (
    <OwlCarousel
      {...settings}
      className="lead-group-slider owl-carousel owl-theme"
    >
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIt8HFzQDFo450NNbnqObO7QGV6AF0dKbj0fZzy5Z-GYsCbxxfI641JBs9HEBqGGVvUtM&usqp=CAU" />
        </div>
      </div>
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Viettel_Telecom_banner.jpg" />
        </div>
      </div>
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://play-lh.googleusercontent.com/bUa3LS5hTNvyGZ3ZExqJ9onMPXYStuxahgBV7Lb-A0V2iz1kcBhLa3T1QD2jx-DDn6U" />
        </div>
      </div>
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://upload.wikimedia.org/wikipedia/commons/f/f0/HCMCUT.svg" />
        </div>
      </div>
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://media.licdn.com/dms/image/v2/C560BAQHVvAMOXMhnYQ/company-logo_200_200/company-logo_200_200/0/1633945207073/next_logix_consultancy_pvt_ltd_logo?e=2147483647&v=beta&t=peXLJtXMQEsJu84BKS_KzmPNGpI67x_7Vzn-yXriCI0" />
        </div>
      </div>
      <div className="item">
        <div className="lead-img">
          <img className="img-fluid" alt="" src="https://ictu.edu.vn/wp-content/uploads/2022/12/logo-co-vien-chu-JPG-scaled.jpg" />
        </div>
      </div>
    </OwlCarousel>
  );
};

export default Companies;
