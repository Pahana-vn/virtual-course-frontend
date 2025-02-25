import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import {
  BookSvg,
  EmptyWalletChange,
  EmptyWalletTick,
  ProfileUser,
  ReceiptText,
} from "../../imagepath";
import MenuInstructorDashboard from "./menuInstructorDashboard";
import { useGetInstructorStatisticsQuery } from "../../../redux/slices/instructor/instructorStatisticsApiSlice";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";

export default function InstructorDepositDashboard() {

  const instructorId = useSelector(selectCurrentInstructor);
  const { data: instructorStatistics, isError, isLoading } = useGetInstructorStatisticsQuery({instructorId:instructorId});

  if (isLoading) return <p>Loading statistics...</p>;
  if (isError) return <p>Error loading statistics</p>;
  return (
    <div className="main-wrapper">
      <InstructorHeader />
      <MenuInstructorDashboard instructorStatistics={instructorStatistics}/>
      {/* Dashboard Instructors */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* Profile Details */}
            <div className="col-xl-12 col-md-12">
              <div className="settings-top-widget student-deposit-blk">
                <div className="row">
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info ttl-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalPurchasedCourses}</h3>
                            <p>Purchased Courses</p>
                            <Link to="/instructor/instructor-dashboard">View All</Link>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={BookSvg} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info open-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalTransactions}</h3>
                            <p>Total Transactions</p>
                            <Link to="/instructor/transactions-instructor">View All</Link>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={ReceiptText} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info close-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalDeposits}</h3>
                            <p>Total Deposit</p>
                            <Link to="/instructor/deposit-student">View All</Link>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={EmptyWalletTick} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info medium-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalWithdrawals}</h3>
                            <p>Total Withdraw</p>
                            <Link to="/instructor/withdrawal-instructor">View All</Link>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={EmptyWalletChange} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info blue-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalStudents}</h3>
                            <p>Total Student</p>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={ProfileUser} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 d-flex">
                    <div className="card stat-info ttl-tickets">
                      <div className="card-body">
                        <div className="view-all-grp d-flex">
                          <div className="student-ticket-view">
                            <h3>{instructorStatistics.totalPublishedCourses}</h3>
                            <p>Total Approved Course</p>
                            <Link to="/instructor/instructor-dashboard">View All</Link>
                          </div>
                          <div className="img-deposit-ticket">
                            <img src={BookSvg} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="settings-widget">
                <div className="settings-inner-blk p-0">
                  <div className="comman-space pb-0">
                    <div className="filter-grp ticket-grp d-flex align-items-center justify-content-between">
                      <h3>Latest Transactions</h3>
                    </div>
                    <div className="settings-tickets-blk table-responsive">
                      {/* Referred Users */}
                      <table className="table table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Referred ID</th>
                            <th>Details</th>
                            <th>Amount</th>
                            <th>Post Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link to="#">K2WX7JJ6R1UA</Link>
                            </td>
                            <td>10 USD Refunded from withdrawal rejection </td>
                            <td>
                              <span className="text-success">+ $45.00</span>
                            </td>
                            <td>$45.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">9RVE1N1TA1H3</Link>
                            </td>
                            <td>Deposit Via Stripe Hosted - USD </td>
                            <td>
                              <span className="text-success">+ $75.00</span>
                            </td>
                            <td>$75.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">C83Z7EQ4A1WX</Link>
                            </td>
                            <td>Deposit Via Stripe Hosted - USD </td>
                            <td>
                              <span className="text-success">+ $100.00</span>
                            </td>
                            <td>$100.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">1C6A5M4YPV39</Link>
                            </td>
                            <td>Withdraw Via Bank withdrawal </td>
                            <td>
                              <span className="text-danger">- $5.00</span>
                            </td>
                            <td>$5.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">K2WX7JJ6R1UA</Link>
                            </td>
                            <td>10 USD Refunded from withdrawal rejection </td>
                            <td>
                              <span className="text-danger">- $25.00</span>
                            </td>
                            <td>$25.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">KSM5CW4EOEGQ</Link>
                            </td>
                            <td>Added Balance Via Admin </td>
                            <td>
                              <span className="text-success">+ $160.00</span>
                            </td>
                            <td>S160.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">K2WX7JJ6R1UA</Link>
                            </td>
                            <td>10 USD Refunded from withdrawal rejection </td>
                            <td>
                              <span className="text-success">+ $150.00</span>
                            </td>
                            <td> $150.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">9RVE1N1TA1H3</Link>
                            </td>
                            <td>Deposit Via Stripe Hosted - USD </td>
                            <td>
                              <span className="text-success">+ $45.00</span>
                            </td>
                            <td>$45.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">C83Z7EQ4A1WX</Link>
                            </td>
                            <td>Deposit Via Stripe Hosted - USD </td>
                            <td>
                              <span className="text-success">+ $10.00</span>
                            </td>
                            <td>$10.00</td>
                          </tr>
                          <tr>
                            <td>
                              <Link to="#">1C6A5M4YPV39</Link>
                            </td>
                            <td>Withdraw Via Bank withdrawal </td>
                            <td>
                              <span className="text-danger">- $10.00</span>
                            </td>
                            <td>$10.00</td>
                          </tr>
                        </tbody>
                      </table>
                      {/* Referred Users */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile Details */}
          </div>
        </div>
      </div>
      {/* Dashboard Instructors */}
      <Footer />
    </div>
  );
}
