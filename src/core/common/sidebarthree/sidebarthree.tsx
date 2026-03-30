import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../imageWithBasePath";
import { all_routes } from "../../../feature-module/routes/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "../../redux/themeSlice";
import { setExpandMenu, setMobileSidebar } from "../../redux/sidebarSlice";

interface SidebarthreeProps {
  onExpandEnter?: () => void;
  onExpandLeave?: () => void;
}

const Sidebarthree: React.FC<SidebarthreeProps> = ({ onExpandEnter, onExpandLeave }) => {
  const location = useLocation();
  const routes = all_routes;

  // State for open submenus
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    settings: false,
  });

  // Open settings submenu if on a settings route
  useEffect(() => {
    const isSettingsRoute = [
      routes.patientprofilesettings,
      routes.patientpasswordsettings,
      routes.patientnotificationssettings,
    ].includes(location.pathname);
    setOpenSubmenus((prev) => ({
      ...prev,
      settings: isSettingsRoute ? true : prev.settings,
    }));
  }, [location.pathname, routes]);

  const isActive = (path: string) => location.pathname === path;

  const handleToggle = (menu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const dispatch = useDispatch();

  const handleMiniSidebar = () => {
    const rootElement = document.documentElement;
    const isMini = rootElement.getAttribute("data-layout") === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    dispatch(
      updateTheme({
        "data-layout": updatedLayout,
      })
    );
    if (isMini) {
      rootElement.classList.remove("mini-sidebar");
    } else {
      rootElement.classList.add("mini-sidebar");
    }
  };

  const onMouseEnter = () => {
    if (onExpandEnter) {
      onExpandEnter();
    } else {
      dispatch(setExpandMenu(true));
    }
  };
  const onMouseLeave = () => {
    if (onExpandLeave) {
      onExpandLeave();
    } else {
      dispatch(setExpandMenu(false));
    }
  };

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );
  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  return (
    <>
      {/* Sidenav Menu Start */}
      <div
        className="sidebar patient-sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Mobile Sidebar Close */}
        <div className="sidebar-mobile-close d-lg-none">
          <button className="sidebar-close" onClick={toggleMobileSidebar}>
            <i className="ti ti-x align-middle" />
          </button>
        </div>
        {/* Sidenav Menu */}
        <div className="sidebar-inner" data-simplebar="">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Main Menu</span>
              </li>
              <li>
                <ul>
                  <li
                    className={
                      isActive(routes.patientdashboard) ? "active" : ""
                    }
                  >
                    <Link to={routes.patientdashboard}>
                      <i className="ti ti-layout-dashboard" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li
                    className={
                      isActive(routes.patientappointments) ||
                      isActive(routes.patientappointmentdetails)
                        ? "active"
                        : ""
                    }
                  >
                    <Link to={routes.patientappointments}>
                      <i className="ti ti-calendar-check" />
                      <span>Appointments</span>
                    </Link>
                  </li>
                  <li
                    className={isActive(routes.patientdoctors) ? "active" : ""}
                  >
                    <Link to={routes.patientdoctors}>
                      <i className="ti ti-stethoscope" />
                      <span>Doctors</span>
                    </Link>
                  </li>
                  <li
                    className={
                      isActive(routes.patientPrescriptions) ||
                      isActive(routes.patientprescriptiondetails)
                        ? "active"
                        : ""
                    }
                  >
                    <Link to={routes.patientPrescriptions}>
                      <i className="ti ti-prescription" />
                      <span>Prescriptions</span>
                    </Link>
                  </li>
                  <li
                    className={
                      isActive(routes.patientinvoices) ||
                      isActive(routes.patientinvoicedetails)
                        ? "active"
                        : ""
                    }
                  >
                    <Link to={routes.patientinvoices}>
                      <i className="ti ti-star" />
                      <span>Invoice</span>
                    </Link>
                  </li>
                  <li
                    className={`submenu${
                      openSubmenus.settings ? " active" : ""
                    }`}
                  >
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggle("settings");
                      }}
                    >
                      <i className="ti ti-settings" />
                      <span>Settings</span>
                      <span className="menu-arrow">
                        <i
                          className={
                            openSubmenus.settings
                              ? "ti ti-chevron-down"
                              : "ti ti-chevron-right"
                          }
                        />
                      </span>
                    </Link>
                    <ul
                      style={{
                        display: openSubmenus.settings ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link
                          to={routes.patientprofilesettings}
                          className={
                            isActive(routes.patientprofilesettings)
                              ? "active"
                              : ""
                          }
                        >
                          Profile Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={routes.patientpasswordsettings}
                          className={
                            isActive(routes.patientpasswordsettings)
                              ? "active"
                              : ""
                          }
                        >
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={routes.patientnotificationssettings}
                          className={
                            isActive(routes.patientnotificationssettings)
                              ? "active"
                              : ""
                          }
                        >
                          Notifications
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="sidebar-footer border-top mt-3">
            <div className="trial-item mt-0 p-3 text-center">
              <div className="trial-item-icon rounded-4 mb-3 p-2 text-center shadow-sm d-inline-flex">
                <ImageWithBasePath
                  src="./assets/img/icons/sidebar-icon.svg"
                  alt="img"
                />
              </div>
              <div>
                <h6 className="fs-14 fw-semibold mb-1">Upgrade To Pro</h6>
                <p className="fs-13 mb-0">
                  Check 1 min video and begin use Symplify like a pro
                </p>
              </div>
              <Link to="#" className="close-icon shadow-sm">
                <i className="ti ti-x" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Sidenav Menu End */}
    </>
  );
};

export default Sidebarthree;
