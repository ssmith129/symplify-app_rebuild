/* eslint-disable */
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../imageWithBasePath";
import { useEffect, useState } from "react";
import { updateTheme } from "../../redux/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { setMobileSidebar } from "../../redux/sidebarSlice";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { NotificationDropdownAI } from "../../../feature-module/components/ai";
import RoleSelectorDropdown from './RoleSelectorDropdown';

const Header = () => {

  const dispatch = useDispatch();
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);

  useEffect(() => {
    const htmlElement: any = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      htmlElement.setAttribute(key, value);
    });
  }, [themeSettings]);

  const handleUpdateTheme = (key: string, value: string) => {
    if (themeSettings["dir"] === "rtl" && key !== "dir") {
      dispatch(updateTheme({ dir: "ltr" }));
    }
    dispatch(updateTheme({ [key]: value }));
  };

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const handleToggleSidebar = () => {
    const rootElement = document.documentElement;
    const isMini = rootElement.getAttribute("data-layout") === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    dispatch(updateTheme({ "data-layout": updatedLayout }));
    if (isMini) {
      rootElement.classList.remove("mini-sidebar");
    } else {
      rootElement.classList.add("mini-sidebar");
    }
  };


  return (
    <>
      {/* Topbar Start */}
      <header className="navbar-header">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-3">
            {/* Logo */}
            <Link to={all_routes.dashboard} className="logo">
              {/* Logo Normal */}
              <span className="logo-light">
                <span className="logo-lg">
                  <ImageWithBasePath src="assets/img/logo.svg" alt="logo" />
                </span>
                <span className="logo-sm">
                  <ImageWithBasePath
                    src="assets/img/logo-small.svg"
                    alt="small logo"
                  />
                </span>
              </span>
              {/* Logo Dark */}
              <span className="logo-dark">
                <span className="logo-lg">
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    alt="dark logo"
                  />
                </span>
              </span>
            </Link>
            {/* Sidebar Mobile Button */}
            <Link
              id="mobile_btn"
              className="mobile-btn"
              to="#"
              onClick={toggleMobileSidebar}
            >
              <i className="ti ti-menu-deep fs-24" />
            </Link>
            <button
              className="sidenav-toggle-btn btn border-0 p-0 active"
              id="toggle_btn2"
              onClick={handleToggleSidebar}
            >
              <i className="ti ti-arrow-right" />
            </button>
            {/* Role Selector */}
            <RoleSelectorDropdown />
            {/* Search */}
            <div className="me-auto d-flex align-items-center header-search d-lg-flex d-none ms-3">
              {/* Search */}
              <div className="input-icon-start position-relative me-2">
                <span className="input-icon-addon">
                  <i className="ti ti-search" />
                </span>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder="Search"
                />
                <span className="input-icon-addon text-dark shadow fs-18 d-inline-flex p-0 header-search-icon">
                  <i className="ti ti-command" />
                </span>
              </div>
              {/* /Search */}
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* Search for Mobile */}
            <div className="header-item d-flex d-lg-none me-2">
              <button
                className="topbar-link btn btn-icon"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
                type="button"
              >
                <i className="ti ti-search fs-16" />
              </button>
            </div>
            {/* Appointment */}
            <div className="header-item">
              <div className="dropdown me-2">
                <Link to={all_routes.newAppointment} className="btn topbar-link">
                  <i className="ti ti-calendar-due" />
                </Link>
              </div>
            </div>
            {/* Appointment */}
            {/* Settings */}
            <div className="header-item">
              <div className="dropdown me-2">
                <Link to={all_routes.profilesettings} className="btn topbar-link">
                  <i className="ti ti-settings-2" />
                </Link>
              </div>
            </div>
            {/* Settings */}
            {/* Light/Dark Mode Button */}
            <div className="header-item d-none d-sm-flex me-2">
              <Link
                to="#"
                id="dark-mode-toggle"
                className={`topbar-link btn btn-icon topbar-link header-togglebtn ${
                  themeSettings["data-bs-theme"] === "dark" ? "activate" : ""
                }`}
                onClick={() => handleUpdateTheme("data-bs-theme", "light")}
              >
                <i className="ti ti-sun fs-16" />
              </Link>
              {/* Light Mode Toggle */}
              <Link
                to="#"
                id="light-mode-toggle"
                className={`topbar-link btn btn-icon topbar-link header-togglebtn ${
                  themeSettings["data-bs-theme"] === "light" ? "activate" : ""
                }`}
                onClick={() => handleUpdateTheme("data-bs-theme", "dark")}
              >
                <i className="ti ti-moon fs-16" />
              </Link>
            </div>
            {/* AI-Enhanced Notification Dropdown */}
            <NotificationDropdownAI />
            {/* User Dropdown */}
            <div className="dropdown profile-dropdown d-flex align-items-center justify-content-center">
              <Link
                to="#"
                className="topbar-link dropdown-toggle drop-arrow-none position-relative"
                data-bs-toggle="dropdown"
                data-bs-offset="0,22"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fba69a23156414a589de97341511272c9%2Fe2de9f03098545c9b03b9146e8f306b0?format=webp&width=64&height=64"
                  width={32}
                  height={32}
                  className="rounded-circle d-flex"
                  alt="user-image"
                  style={{ objectFit: 'cover' }}
                />
                <span className="online text-success">
                  <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white" />
                </span>
              </Link>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                <div className="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fba69a23156414a589de97341511272c9%2Fe2de9f03098545c9b03b9146e8f306b0?format=webp&width=84&height=84"
                    className="rounded-circle"
                    width={42}
                    height={42}
                    alt=""
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="ms-2">
                    <p className="fw-medium text-dark mb-0">Jimmy Anderson</p>
                    <span className="d-block fs-13">Administrator</span>
                  </div>
                </div>
                {/* Item*/}
                <Link to={all_routes.profilesettings} className="dropdown-item">
                  <i className="ti ti-user-circle me-1 align-middle" />
                  <span className="align-middle">Profile Settings</span>
                </Link>
                {/* Item*/}
                <Link to={all_routes.profilesettings} className="dropdown-item">
                  <i className="ti ti-settings me-1 align-middle" />
                  <span className="align-middle">Account Settings</span>
                </Link>
                {/* item */}
                <div className="form-check form-switch form-check-reverse d-flex align-items-center justify-content-between dropdown-item mb-0">
                  <label className="form-check-label" htmlFor="notify">
                    <i className="ti ti-bell me-1" />
                    Notifications
                  </label>
                  <input
                    className="form-check-input me-0"
                    type="checkbox"
                    role="switch"
                    id="notify"
                  />
                </div>
                {/* Item*/}
                <Link to={all_routes.transactions} className="dropdown-item">
                  <i className="ti ti-transition-right me-1 align-middle" />
                  <span className="align-middle">Transactions</span>
                </Link>
                {/* Item*/}
                <div className="pt-2 mt-2 border-top">
                  <Link to={all_routes.login}className="dropdown-item text-danger">
                    <i className="ti ti-logout me-1 fs-17 align-middle" />
                    <span className="align-middle">Log Out</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Topbar End */}

      {/* Search Modal */}
      <div className="modal fade" id="searchModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-transparent">
            <div className="card shadow-none mb-0">
              <div
                className="px-3 py-2 d-flex flex-row align-items-center"
                id="search-top"
              >
                <i className="ti ti-search fs-22" />
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="Search"
                />
                <button
                  type="button"
                  className="btn p-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x fs-22" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
