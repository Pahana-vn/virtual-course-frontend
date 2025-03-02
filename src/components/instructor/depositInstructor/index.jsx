import React from "react";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import { Eye } from "react-feather";
import MenuInstructorDashboard from "../deposit/menuInstructorDashboard";
import { useGetInstructorDepositsQuery } from "../../../redux/slices/instructor/instructorTransactionApiSlice";

export default function DepositInstructor() {
  const { data, error, isLoading } = useGetInstructorDepositsQuery();

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
                        <h3>Deposit History</h3>
                      </div>
                    </div>
                    <div className="settings-tickets-blk table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Referred ID</th>
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
                              <span className="text-green">+ {formatCurrency(item.amount)}</span>
                            </td>
                            <td>{formatDate(item.processedAt)}</td>
                            <td>
                              <span className="badge info-low">{item.statusTransaction}</span>
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
                                  No deposit data available.
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
