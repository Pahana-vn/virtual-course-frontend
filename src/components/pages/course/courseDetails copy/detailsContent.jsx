import PropTypes from 'prop-types';
import React from "react";
import { Link } from 'react-router-dom';
import { Video } from "../../../imagepath";

const DetailsContent = ({ courseDetails }) => {
  console.log(courseDetails);
  return (
    <>
      <section className="page-content course-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h1>{courseDetails.titleCourse}</h1>
              <p>{courseDetails.description}</p>
              {courseDetails.sections && courseDetails.sections.length > 0 && (
                <div>
                  <h3>What You Will Learn</h3>
                  <ul>
                    {courseDetails.sections.map((section, index) => (
                      <li key={index}>{section.titleSection}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* {requirements && requirements.length > 0 && (
                <div>
                  <h3>Requirements</h3>
                  <ul>
                    {requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )} */}
              <div>
                  <h3>Requirements</h3>
                  <ul>
                    <li>You will need a copy of Adobe XD 2019 or above. A free trial can be downloaded from Adobe.</li>
                    <li>No previous design experience is needed.</li>
                    <li>No previous Adobe XD skills are needed.</li>
                  </ul>
                </div>
            </div>

            <div className="col-lg-4">
              <div className="sidebar-sec">
                {/* Video */}
                <div className="video-sec vid-bg">
                  <div className="card">
                    <div className="card-body">
                      <Link
                        to={courseDetails.urlVideo}
                        className="video-thumbnail"
                        data-fancybox=""
                      >
                        <div className="play-icon">
                          <i className="fa-solid fa-play" />
                        </div>
                        <img className="" src={Video} alt="Video Preview" />
                      </Link>
                      <div className="video-details">
                        <div className="course-fee">
                          <h2>{courseDetails.basePrice ? `$${courseDetails.basePrice}` : 'Loading..'}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              // onClick={handleAddToCart}
                              // disabled={cartLoading}
                            >
                              Add to cart
                              {/* {cartLoading ? "Adding to cart..." : "Add to cart"} */}
                            </button>
                          </div>

                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              // onClick={handleAddToWishlist}
                              // disabled={loading}
                            >
                              Add to Favorites
                              {/* {loading ? "Adding..." : "Add to Favorites"} */}
                            </button>
                          </div>
                        </div>

                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Buy now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Video */}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

DetailsContent.propTypes = {
  courseDetails: PropTypes.shape({
    titleCourse: PropTypes.string,
    description: PropTypes.string,
    urlVideo: PropTypes.string,
    basePrice: PropTypes.number,
    sections: PropTypes.arrayOf(PropTypes.string),
    // requirements: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default DetailsContent;