import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const certificates = [
  {
    id: 1,
    title: "Certificate: Angular Fundamentals",
    date: "24/03/2024",
    image: "https://ahrefs.com/blog/wp-content/uploads/2023/08/image9-11-1.jpg",
  },
  {
    id: 2,
    title: "Certificate: React Basics bester",
    date: "15/02/2024",
    image: "https://ahrefs.com/blog/wp-content/uploads/2023/08/image9-11-1.jpg",
  },
  {
    id: 3,
    title: "Certificate: Angular Advance New",
    date: "11/01/2023",
    image: "https://ahrefs.com/blog/wp-content/uploads/2023/08/image9-11-1.jpg",
  }
  // Add more certificates here
];

const StudentQA = () => {
  const [modalImage, setModalImage] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Certificates"} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Course Certificates</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Course Certificates
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Page Content */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* /Sidebar */}

            {/* Student Certificates */}
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Course Certificates</h3>
                  </div>
                  <div className="checkout-form">
                    {certificates.length > 3 ? (
                      <Slider {...sliderSettings}>
                        {certificates.map((certificate) => (
                          <div key={certificate.id} className="certificate-card">
                            <div className="card">
                              <img
                                src={certificate.image}
                                alt={certificate.title}
                                className="card-img-top"
                                onClick={() => setModalImage(certificate.image)}
                                style={{ cursor: "pointer" }}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{certificate.title}</h5>
                                <p className="card-text">Issued on: {certificate.date}</p>
                                <a
                                  href={certificate.image}
                                  download={`Certificate-${certificate.id}.jpg`}
                                  className="btn btn-danger"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="row">
                        {certificates.map((certificate) => (
                          <div
                            key={certificate.id}
                            className="col-md-4 certificate-card"
                          >
                            <div className="card">
                              <img
                                src={certificate.image}
                                alt={certificate.title}
                                className="card-img-top"
                                onClick={() => setModalImage(certificate.image)}
                                style={{ cursor: "pointer" }}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{certificate.title}</h5>
                                <p className="card-text">Issued on: {certificate.date}</p>

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* /Student Certificates */}
          </div>
        </div>
      </div>
      {/* /Page Content */}

      <Footer />

      {/* Modal for Image Preview */}
      {modalImage && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setModalImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "80%" }}>
            <div className="modal-content" style={{ backgroundColor: "transparent", border: "none" }}>
              <div className="modal-body text-center">
                <img
                  src={modalImage}
                  alt="Certificate Preview"
                  className="img-fluid"
                  style={{ maxHeight: "90vh", maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQA;
