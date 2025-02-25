import React from "react";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import { Eye } from "react-feather";
import MenuInstructorDashboard from "../deposit/menuInstructorDashboard";
import { useGetInstructorWithdrawalsQuery } from "../../../redux/slices/instructor/instructorTransactionApiSlice";
export default function WithdrawalInstructor() {
  const { data, error, isLoading } = useGetInstructorWithdrawalsQuery();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const formatDate = (utcDateString) => {
    const date = new Date(utcDateString);
    // Convert UTC to Vietnam time zone
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching withdrawal history.</div>;
  }
  return (
    <div className="main-wrapper">
      <InstructorHeader />
      <MenuInstructorDashboard />
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-md-12">
              <div className="settings-widget">
                <div className="settings-inner-blk p-0">
                  <div className="comman-space pb-0">
                    <div className="filter-grp ticket-grp d-flex align-items-center justify-content-between">
                      <div>
                        <h3>Withdrawal History</h3>
                      </div>
                      <div className="ticket-btn-grp">
                        <Link
                          to="/instructor/instructor-checkout"
                          // data-bs-toggle="modal"
                          // data-bs-target="#depositMethod"
                        >
                          Withdrawal Money
                        </Link>
                      </div>
                    </div>
                    <div className="settings-tickets-blk table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Gateway</th>
                            <th>Amount</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data.length > 0 ? (
                            data.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <Link to="#">{item.id}</Link>
                                </td>
                                <td>{item.paymentMethod}</td>
                                <td>
                                  <span className="text-danger">
                                    - {formatCurrency(item.amount)}
                                  </span>
                                </td>
                                <td>{formatDate(item.processedAt)} </td>
                                <td>
                                  <span className="badge info-low">
                                    {item.statusTransaction}
                                  </span>
                                </td>
                                <td>
                                  <Link to="#" className="btn-style">
                                    <Eye />
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No withdrawal data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
