import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import SCol19Chart from "./chats/scol19";
import { Calendar, type CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import { SmartWidget, ShiftHandoffWidget, ChatInboxWidget, QuickStatsWidget } from "../../ai";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../core/redux/store";
import { loadPersonalizedLayout, recordInteraction, fetchClinicalAlerts } from "../../../../core/redux/aiSlice";
import PageHeader from "../../../../core/common/page-header/PageHeader";

/* ── Carousel Row wrapper for tablet/mobile horizontal scrolling ── */
const CarouselRow: React.FC<{ className?: string; children: React.ReactNode; cardCount: number }> = ({ className = '', children, cardCount }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    // Calculate active dot based on scroll position
    if (cardCount > 1) {
      const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1);
      setActiveIndex(Math.round(scrollRatio * (cardCount - 1)));
    }
  }, [cardCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);
    return () => {
      el.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [updateFades]);

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cardCount;
    el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  return (
    <div className={`carousel-fade-wrapper${showLeft ? ' show-fade-left' : ''}${showRight ? ' show-fade-right' : ''}`}>
      <div ref={scrollRef} className={`row dashboard-carousel ${className}`}>
        {children}
      </div>
      {cardCount > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: cardCount }, (_, i) => (
            <button
              key={i}
              className={`dot${i === activeIndex ? ' active' : ''}`}
              onClick={() => scrollToDot(i)}
              aria-label={`Scroll to card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { personalizedLayout } = useSelector((state: RootState) => state.ai.dashboard);

  useEffect(() => {
    dispatch(loadPersonalizedLayout({ userId: 'admin-1', role: 'admin' }));
    dispatch(fetchClinicalAlerts());
  }, [dispatch]);

  const handleWidgetInteraction = (widgetId: string, action: string) => {
    dispatch(recordInteraction({
      userId: 'admin-1',
      widgetId,
      action: action as 'view' | 'click' | 'expand' | 'collapse' | 'dismiss',
      timestamp: Date.now()
    }));
  };

  const suggestedWidgetIds = personalizedLayout?.aiSuggestions.map(s => s.widgetId) || [];

  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="Admin Dashboard"
            actions={
              <>
                <Link
                  to={all_routes.newAppointment}
                  className="btn btn-primary d-inline-flex align-items-center"
                  style={{ minHeight: 32 }}
                >
                  <i className="ti ti-plus me-1" />
                  New Appointment
                </Link>
                <Link
                  to={all_routes.doctorschedule}
                  className="btn btn-outline-white bg-white d-inline-flex align-items-center"
                  style={{ minHeight: 32 }}
                >
                  <i className="ti ti-calendar-time me-1" />
                  Schedule Availability
                </Link>
              </>
            }
          />
          {/* End Page Header */}

          {/* Page-level AI indicator */}
          <div className="d-flex align-items-center mb-3 py-2 px-3 rounded-2" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
            <i className="ti ti-sparkles text-warning me-2 fs-16" />
            <span className="fs-13 fw-medium text-dark">AI-Enhanced Dashboard</span>
            <span className="fs-12 text-muted ms-2">Insights and alerts are powered by predictive analytics</span>
          </div>

          {/* ── Section: Clinical Overview ── */}
          <div className="d-flex align-items-center mb-3 mt-4">
            <i className="ti ti-heartbeat text-danger me-2 fs-20" />
            <h5 className="fw-bold mb-0 fs-16">Clinical Overview</h5>
          </div>
          <CarouselRow className="ai-dashboard-grid mb-4 g-3 g-lg-4" cardCount={3}>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-acuity">
              <SmartWidget
                widgetId="patientAcuity"
                onInteraction={handleWidgetInteraction}
                aiRecommended={suggestedWidgetIds.includes('patientAcuity')}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-alerts">
              <SmartWidget
                widgetId="clinicalAlerts"
                onInteraction={handleWidgetInteraction}
                aiRecommended={suggestedWidgetIds.includes('clinicalAlerts')}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-insights">
              <SmartWidget
                widgetId="aiInsights"
                onInteraction={handleWidgetInteraction}
                aiRecommended={suggestedWidgetIds.includes('aiInsights')}
              />
            </div>
          </CarouselRow>

          {/* ── Section: Operations ── */}
          <div className="d-flex align-items-center mb-3 mt-2">
            <i className="ti ti-chart-bar text-primary me-2 fs-20" />
            <h5 className="fw-bold mb-0 fs-16">Operations</h5>
          </div>
          <CarouselRow className="mb-4 g-3 g-lg-4" cardCount={3}>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-stats">
              <QuickStatsWidget />
            </div>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-handoff">
              <ShiftHandoffWidget />
            </div>
            <div className="col-12 col-md-6 col-lg-4 d-flex ai-grid-item ai-grid-inbox">
              <ChatInboxWidget maxChats={5} />
            </div>
          </CarouselRow>

          {/* ── Section: Scheduling ── */}
          <div className="d-flex align-items-center mb-3 mt-2">
            <i className="ti ti-calendar-event text-info me-2 fs-20" />
            <h5 className="fw-bold mb-0 fs-16">Scheduling</h5>
          </div>
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">Appointment Statistics</h5>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      Monthly <i className="ti ti-chevron-down ms-1" />
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="#">
                          Monthly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Weekly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Yearly
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div className="row row-gap-3 mb-2">
                    <div className="col-md-3 col-6">
                      <div className="bg-light border p-2 text-center rounded-2">
                        <p className="mb-1 text-truncate">
                          <i className="ti ti-point-filled me-1 text-primary" />
                          All Appointments
                        </p>
                        <h5 className="fw-bold mb-0">6314</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-light border p-2 text-center rounded-2">
                        <p className="mb-1">
                          <i className="ti ti-point-filled me-1 text-danger" />
                          Cancelled
                        </p>
                        <h5 className="fw-bold mb-0">456</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-light border p-2 text-center rounded-2">
                        <p className="mb-1">
                          <i className="ti ti-point-filled me-1 text-warning" />
                          Reschedule
                        </p>
                        <h5 className="fw-bold mb-0">745</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-light border p-2 text-center rounded-2">
                        <p className="mb-1">
                          <i className="ti ti-point-filled me-1 text-success" />
                          Completed
                        </p>
                        <h5 className="fw-bold mb-0">4578</h5>
                      </div>
                    </div>
                  </div>
                  <div className="chart-set" id="s-col-19">
                    <SCol19Chart />
                  </div>
                </div>
              </div>
              {/* card end */}
              {/* card start */}
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">Popular Doctors</h5>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      Weekly <i className="ti ti-chevron-down ms-1" />
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="#">
                          Monthly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Weekly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Yearly
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row row-gap-3">
                    <div className="col-md-4">
                      <div className="border shadow-sm p-3 rounded-2">
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to={all_routes.doctordetails}
                            className="avatar me-2 flex-shrink-0 position-relative"
                          >
                            <span className="online text-success position-absolute end-0 bottom-0 pe-1">
                              <i className="ti ti-circle-filled d-flex bg-white fs-6 rounded-circle border border-1 border-white" />
                            </span>
                            <ImageWithBasePath
                              src="assets/img/doctors/doctor-01.jpg"
                              alt="img"
                              className="rounded-circle"
                            />
                          </Link>
                          <div>
                            <h6 className="fs-14 mb-1 text-truncate">
                              <Link
                                to={all_routes.doctordetails}
                                className="fw-semibold"
                              >
                                Dr. Alex Morgan
                              </Link>
                            </h6>
                            <p className="mb-0 fs-13">Cardiologist</p>
                          </div>
                        </div>
                        <p className="mb-0">
                          <span className="text-dark fw-semibold">258</span>
                          Bookings
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border shadow-sm p-3 rounded-2">
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to={all_routes.doctordetails}
                            className="avatar me-2 flex-shrink-0 position-relative"
                          >
                            <span className="online text-success position-absolute end-0 bottom-0 pe-1">
                              <i className="ti ti-circle-filled d-flex bg-white fs-6 rounded-circle border border-1 border-white" />
                            </span>
                            <ImageWithBasePath
                              src="assets/img/doctors/doctor-03.jpg"
                              alt="img"
                              className="rounded-circle"
                            />
                          </Link>
                          <div>
                            <h6 className="fs-14 mb-1 text-truncate">
                              <Link
                                to={all_routes.doctordetails}
                                className="fw-semibold"
                              >
                                Dr. Emily Carter
                              </Link>
                            </h6>
                            <p className="mb-0 fs-13">Pediatrician</p>
                          </div>
                        </div>
                        <p className="mb-0">
                          <span className="text-dark fw-semibold">125</span>
                          Bookings
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border shadow-sm p-3 rounded-2">
                        <div className="d-flex align-items-center mb-3">
                          <Link
                            to={all_routes.doctordetails}
                            className="avatar me-2 flex-shrink-0 position-relative"
                          >
                            <ImageWithBasePath
                              src="assets/img/doctors/doctor-04.jpg"
                              alt="img"
                              className="rounded-circle"
                            />
                          </Link>
                          <div>
                            <h6 className="fs-14 mb-1 text-truncate">
                              <Link
                                to={all_routes.doctordetails}
                                className="fw-semibold"
                              >
                                Dr. David Lee
                              </Link>
                            </h6>
                            <p className="mb-0 fs-13">Gynecologist</p>
                          </div>
                        </div>
                        <p className="mb-0">
                          <span className="text-dark fw-semibold">115</span>
                          Bookings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* card end */}
            </div>
            {/* col end */}
            {/* col start */}
            <div className="col-xl-6 d-flex">
              <div className="card shadow-sm">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0 text-truncate">Appointments</h5>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      All Type <i className="ti ti-chevron-down ms-1" />
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="#">
                          In Person
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Online
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="datepic appointment-calender mb-1">
                    <Calendar
                      fullscreen={false}
                      onPanelChange={onPanelChange}
                    />
                  </div>
                  <div className="mb-3 bg-light p-3 rounded-2 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fs-14 fw-semibold mb-1">General Visit</h6>
                      <p className="mb-0 text-truncate">
                        <i className="ti ti-calendar-time me-1 text-dark" />
                        Wed, 05 Apr 2025, 06:30 PM
                      </p>
                    </div>
                    <div className="avatar-list-stacked avatar-group-sm event flex-shrink-0">
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-26.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/doctors/doctor-05.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 bg-soft-danger p-3 rounded-2 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fs-14 fw-semibold mb-1">General Visit</h6>
                      <p className="mb-0 text-truncate">
                        <i className="ti ti-calendar-time me-1 text-dark" />
                        Wed, 05 Apr 2025, 04:10 PM
                      </p>
                    </div>
                    <div className="avatar-list-stacked avatar-group-sm event flex-shrink-0">
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/users/user-17.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/doctors/doctor-10.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 bg-soft-info p-3 rounded-2 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fs-14 fw-semibold mb-1">General Visit</h6>
                      <p className="mb-0 text-truncate">
                        <i className="ti ti-calendar-time me-1 text-dark" />
                        Wed, 05 Apr 2025, 10:00 AM
                      </p>
                    </div>
                    <div className="avatar-list-stacked avatar-group-sm event flex-shrink-0">
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/users/user-16.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                      <span className="avatar avatar-lg rounded-circle border-0">
                        <ImageWithBasePath
                          src="assets/img/doctors/doctor-09.jpg"
                          className="img-fluid rounded-circle border border-white"
                          alt="Img"
                        />
                      </span>
                    </div>
                  </div>
                  <Link
                    to={all_routes.appointments}
                    className="btn btn-light w-100"
                  >
                    View All Appointments
                  </Link>
                </div>
              </div>
            </div>
            {/* col end */}
          </div>
          {/* end row */}
          {/* ── Section: Management ── */}
          <div className="d-flex align-items-center mb-3 mt-2">
            <i className="ti ti-building-hospital text-success me-2 fs-20" />
            <h5 className="fw-bold mb-0 fs-16">Management</h5>
          </div>
          <CarouselRow className="" cardCount={2}>
            {/* col start */}
            <div className="col-xl-4 col-lg-6 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">Doctors Schedule</h5>
                  <Link
                    to={all_routes.doctorschedule}
                    className="btn fw-normal btn-outline-white"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body">
                  <div className="row g-2 mb-4">
                    <div className="col d-flex border-end">
                      <div className="text-center flex-fill">
                        <p className="mb-1">Available</p>
                        <h3 className="fw-bold mb-0">48</h3>
                      </div>
                    </div>
                    <div className="col d-flex border-end">
                      <div className="text-center flex-fill">
                        <p className="mb-1">Unavailable</p>
                        <h3 className="fw-bold mb-0">28</h3>
                      </div>
                    </div>
                    <div className="col d-flex">
                      <div className="text-center flex-fill">
                        <p className="mb-1">Leave</p>
                        <h3 className="fw-bold mb-0">12</h3>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center flex-shrink-0">
                        <Link
                          to={all_routes.doctordetails}
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/doctors/doctor-02.jpg"
                            className="rounded-circle"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2 flex-shrink-0">
                          <div>
                            <h6 className="fw-semibold fs-14 text-truncate mb-1">
                              <Link to={all_routes.doctordetails}>
                                Dr. Sarah Johnson
                              </Link>
                            </h6>
                            <p className="fs-13">Orthopedic Surgeon</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ms-2">
                        <Link
                          to="#"
                          className="btn btn-primary btn-sm py-1 flex-shrink-0"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center flex-shrink-0">
                        <Link
                          to={all_routes.doctordetails}
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/doctors/doctor-03.jpg"
                            className="rounded-circle"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2 flex-shrink-0">
                          <div>
                            <h6 className="fw-semibold fs-14 text-truncate mb-1">
                              <Link to={all_routes.doctordetails}>
                                Dr. Emily Carter
                              </Link>
                            </h6>
                            <p className="fs-13">Pediatrician</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ms-2">
                        <Link to="#" className="btn btn-primary btn-sm py-1">
                          Book Now
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center flex-shrink-0">
                        <Link
                          to={all_routes.doctordetails}
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/doctors/doctor-04.jpg"
                            className="rounded-circle"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2 flex-shrink-0">
                          <div>
                            <h6 className="fw-semibold fs-14 text-truncate mb-1">
                              <Link to={all_routes.doctordetails}>
                                Dr. David Lee
                              </Link>
                            </h6>
                            <p className="fs-13">Gynecologist</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ms-2">
                        <Link to="#" className="btn btn-primary btn-sm py-1">
                          Book Now
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-0">
                      <div className="d-flex align-items-center flex-shrink-0">
                        <Link
                          to={all_routes.doctordetails}
                          className="avatar flex-shrink-0"
                        >
                          <ImageWithBasePath
                            src="assets/img/doctors/doctor-14.jpg"
                            className="rounded-circle"
                            alt="img"
                          />
                        </Link>
                        <div className="ms-2 flex-shrink-0">
                          <div>
                            <h6 className="fw-semibold fs-14 text-truncate mb-1">
                              <Link to={all_routes.doctordetails}>
                                Dr. Michael Smith
                              </Link>
                            </h6>
                            <p className="fs-13">Cardiologist</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ms-2">
                        <Link to="#" className="btn btn-primary btn-sm py-1">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* col end */}
            {/* col start */}
            <div className="col-xl-4 col-lg-6 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">Income By Treatment</h5>
                  <div className="dropdown">
                    <Link
                      to="#"
                      className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      Weekly <i className="ti ti-chevron-down ms-1" />
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" to="#">
                          Monthly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Weekly
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#">
                          Yearly
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="fw-semibold mb-1 text-dark">Cardiology</p>
                      <p className="mb-0">4,556 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$5,985</h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="fw-semibold mb-1 text-dark">Radiology</p>
                      <p className="mb-0">4,125 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$5,194</h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="fw-semibold mb-1 text-dark">
                        Dental Surgery
                      </p>
                      <p className="mb-0">1,796 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$2,716</h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <p className="fw-semibold mb-1 text-dark">Orthopaedics</p>
                      <p className="mb-0">3,827 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$4,682</h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <div>
                      <p className="fw-semibold mb-1 text-dark">
                        General Medicine
                      </p>
                      <p className="mb-0">9,894 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$9,450</h6>
                  </div>
                </div>
              </div>
            </div>
            {/* col end */}
          </CarouselRow>
          {/* row start */}
          <div className="row">
            <div className="col-12 d-flex">
              <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0">All Appointments</h5>
                  <Link
                    to={all_routes.appointments}
                    className="btn fw-normal btn-outline-white"
                  >
                    View All
                  </Link>
                </div>
                <div className="card-body">
                  {/* Table start */}
                  <div className="table-responsive table-nowrap">
                    <table className="table border">
                      <thead className="thead-light">
                        <tr>
                          <th>Doctor</th>
                          <th>Patient</th>
                          <th>Date &amp; Time</th>
                          <th>Mode</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.doctordetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/doctors/doctor-06.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.doctordetails}
                                    className="fw-semibold"
                                  >
                                    Dr. John Smith
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">Neurosurgeon</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.patientDetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-02.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.patientDetails}
                                    className="fw-medium"
                                  >
                                    Jesus Adams
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">+1 41254 45214</p>
                              </div>
                            </div>
                          </td>
                          <td>28 May 2025 - 11:15 AM</td>
                          <td>Online</td>
                          <td>
                            <span className="badge fs-13 py-1 badge-soft-success border border-success rounded text-success fw-medium">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.doctordetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/doctors/doctor-07.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.doctordetails}
                                    className="fw-semibold"
                                  >
                                    Dr. Lisa White
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">Oncologist</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.patientDetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-27.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.patientDetails}
                                    className="fw-medium"
                                  >
                                    Ezra Belcher
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">+1 65895 41247</p>
                              </div>
                            </div>
                          </td>
                          <td>29 May 2025 - 11:30 AM</td>
                          <td>In-Person</td>
                          <td>
                            <span className="badge fs-13 py-1 badge-soft-danger border border-danger rounded fw-medium">
                              Cancelled
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.doctordetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/doctors/doctor-10.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.doctordetails}
                                    className="fw-semibold"
                                  >
                                    Dr. Patricia Brown
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">Pulmonologist</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.patientDetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-20.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.patientDetails}
                                    className="fw-medium"
                                  >
                                    Glen Lentz
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">+1 62458 45845</p>
                              </div>
                            </div>
                          </td>
                          <td>30 May 2025 - 09:30 AM </td>
                          <td>Online</td>
                          <td>
                            <span className="badge fs-13 py-1 badge-soft-success border border-success rounded text-success fw-medium">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.doctordetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/doctors/doctor-11.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.doctordetails}
                                    className="fw-semibold"
                                  >
                                    Dr. Rachel Green
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">Urologist</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.patientDetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-06.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.patientDetails}
                                    className="fw-medium"
                                  >
                                    Bernard Griffith
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">+1 61422 45214</p>
                              </div>
                            </div>
                          </td>
                          <td>30 May 2025 - 10:00 AM</td>
                          <td>Online</td>
                          <td>
                            <span className="badge fs-13 py-1 badge-soft-secondary border border-secondary rounded fw-medium">
                              Checked Out
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.doctordetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/doctors/doctor-14.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.doctordetails}
                                    className="fw-semibold"
                                  >
                                    Dr. Michael Smith
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">Cardiologist</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                to={all_routes.patientDetails}
                                className="avatar me-2"
                              >
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-25.jpg"
                                  alt="img"
                                  className="rounded-circle"
                                />
                              </Link>
                              <div>
                                <h6 className="fs-14 mb-1">
                                  <Link
                                    to={all_routes.patientDetails}
                                    className="fw-medium"
                                  >
                                    John Elsass
                                  </Link>
                                </h6>
                                <p className="mb-0 fs-13">+1 47851 26371</p>
                              </div>
                            </div>
                          </td>
                          <td>30 May 2025 - 11:00 AM</td>
                          <td>Online</td>
                          <td>
                            <span className="badge fs-13 py-1 badge-soft-info border border-info rounded fw-medium">
                              Schedule
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Table end */}
                </div>
              </div>
            </div>
          </div>
          {/* row end */}
        </div>
        {/* End Content */}
        {/* Footer Start */}
        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 ©
            <Link to="#" className="link-primary">
              Symplify
            </Link>
            , All Rights Reserved
          </p>
        </div>
        {/* Footer End */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default Dashboard;
