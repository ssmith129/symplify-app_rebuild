import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { all_routes } from '../../../../routes/all_routes';
import {
  Appointment_Type,
  Department,
  Doctor,
  Patient,
  Status_Checkout,
} from '../../../../../core/common/selectOption';
import CommonSelect from '../../../../../core/common/common-select/commonSelect';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../../../core/redux/store';
import { fetchSlotSuggestions, selectSlot } from '../../../../../core/redux/aiSlice';
import type { SlotSuggestion } from '../../../../../core/ai/types';
import Modals from './modals/modals';

/* ── AI Insight mock data ── */
const PATIENT_INSIGHTS: Record<string, { noShowRate: number; preferredTime: string; lastVisit: string; visitCount: number }> = {
  'Dr. Mick Thompson': { noShowRate: 5, preferredTime: 'Morning', lastVisit: '2 weeks ago', visitCount: 12 },
  'Dr. Sarah Johnson': { noShowRate: 12, preferredTime: 'Afternoon', lastVisit: '1 month ago', visitCount: 8 },
  'Dr. Emily Carter': { noShowRate: 8, preferredTime: 'Morning', lastVisit: '3 days ago', visitCount: 22 },
  'Dr. David Lee': { noShowRate: 15, preferredTime: 'Evening', lastVisit: '6 weeks ago', visitCount: 4 },
};

const NewAppointment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestions, loading } = useSelector((state: RootState) => state.ai.scheduler);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(Patient[0]?.value || '');
  const [selectedDoctor, setSelectedDoctor] = useState(Doctor[0]?.value || '');
  const [selectedDepartment, setSelectedDepartment] = useState(Department[0]?.value || '');
  const [selectedType, setSelectedType] = useState(Appointment_Type[0]?.value || '');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState(Status_Checkout[0]?.value || '');

  // AI panel state
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [activeSlot, setActiveSlot] = useState<SlotSuggestion | null>(null);
  const [slotApplied, setSlotApplied] = useState(false);
  const [booking, setBooking] = useState(false);

  // Fetch AI suggestions on mount and when type changes
  useEffect(() => {
    dispatch(fetchSlotSuggestions({
      patientId: selectedPatient || 'patient-1',
      appointmentType: selectedType || 'General Consultation',
    }));
  }, [dispatch, selectedPatient, selectedType]);

  const handleSlotClick = useCallback((slot: SlotSuggestion) => {
    setActiveSlot(slot);
    dispatch(selectSlot(slot));
    setSlotApplied(false);
  }, [dispatch]);

  const handleApplySlot = useCallback(() => {
    if (!activeSlot) return;
    const dt = new Date(activeSlot.datetime);
    setSelectedDate(dayjs(dt));
    setSelectedTime(dayjs(dt));

    // Match doctor from suggestions to form options
    const matchedDoc = Doctor.find(d => d.value === activeSlot.providerName);
    if (matchedDoc) setSelectedDoctor(matchedDoc.value);

    setSlotApplied(true);
  }, [activeSlot]);

  const handleCreateAppointment = async () => {
    setBooking(true);
    await new Promise(r => setTimeout(r, 1200));
    setBooking(false);
    alert('Appointment created successfully!');
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getShowRateClass = (risk: number) => {
    if (risk < 15) return 'badge-show-green';
    if (risk < 25) return 'badge-show-amber';
    return 'badge-show-red';
  };

  const getScoreStars = (score: number) => {
    const full = Math.round(score);
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`ti ti-star-filled appt-star ${i < full ? 'active' : ''}`} />
    ));
  };

  const patientInsight = PATIENT_INSIGHTS[selectedDoctor] || null;

  const getModalContainer = () => {
    const el = document.getElementById('modal-datepicker');
    return el || document.body;
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content new-appointment-ai">
          {/* Back link */}
          <div className="appt-back-row">
            <Link to={all_routes.appointments} className="appt-back-link">
              <i className="ti ti-chevron-left" /> Appointments
            </Link>
          </div>

          <div className="appt-layout">
            {/* ─── LEFT: Appointment Form ─── */}
            <div className="appt-form-panel">
              <div className="appt-form-card">
                <div className="appt-form-header">
                  <h5 className="appt-form-title">
                    <i className="ti ti-calendar-plus" /> New Appointment
                  </h5>
                  {slotApplied && (
                    <span className="appt-ai-applied-badge">
                      <i className="ti ti-sparkles" /> AI Slot Applied
                    </span>
                  )}
                </div>

                <div className="appt-form-body">
                  {/* Appointment ID */}
                  <div className="appt-field">
                    <label className="appt-label">
                      Appointment ID <span className="required">*</span>
                    </label>
                    <input type="text" className="form-control" defaultValue="AP234354" disabled />
                  </div>

                  {/* Patient + Department */}
                  <div className="appt-row">
                    <div className="appt-col">
                      <div className="appt-field">
                        <div className="appt-label-row">
                          <label className="appt-label">
                            Patient <span className="required">*</span>
                          </label>
                          <Link to="#" className="appt-add-link" data-bs-toggle="modal" data-bs-target="#add_modal">
                            <i className="ti ti-circle-plus" /> Add New
                          </Link>
                        </div>
                        <CommonSelect
                          options={Patient}
                          className="select"
                          defaultValue={Patient[0]}
                          onChange={(opt: any) => setSelectedPatient(opt?.value || '')}
                        />
                      </div>
                    </div>
                    <div className="appt-col">
                      <div className="appt-field">
                        <label className="appt-label">
                          Department <span className="required">*</span>
                        </label>
                        <CommonSelect
                          options={Department}
                          className="select"
                          defaultValue={Department[0]}
                          onChange={(opt: any) => setSelectedDepartment(opt?.value || '')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctor + Appointment Type */}
                  <div className="appt-row">
                    <div className="appt-col">
                      <div className="appt-field">
                        <label className="appt-label">
                          Doctor <span className="required">*</span>
                        </label>
                        <CommonSelect
                          options={Doctor}
                          className="select"
                          defaultValue={Doctor.find(d => d.value === selectedDoctor) || Doctor[0]}
                          key={selectedDoctor}
                          onChange={(opt: any) => setSelectedDoctor(opt?.value || '')}
                        />
                      </div>
                    </div>
                    <div className="appt-col">
                      <div className="appt-field">
                        <label className="appt-label">
                          Appointment Type <span className="required">*</span>
                        </label>
                        <CommonSelect
                          options={Appointment_Type}
                          className="select"
                          defaultValue={Appointment_Type[0]}
                          onChange={(opt: any) => setSelectedType(opt?.value || '')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="appt-row">
                    <div className="appt-col">
                      <div className="appt-field">
                        <label className="appt-label">
                          Date of Appointment <span className="required">*</span>
                        </label>
                        <div className="input-icon-end position-relative">
                          <DatePicker
                            className="form-control datetimepicker"
                            format={{ format: 'DD-MM-YYYY', type: 'mask' }}
                            getPopupContainer={getModalContainer}
                            placeholder="DD-MM-YYYY"
                            suffixIcon={null}
                            value={selectedDate}
                            onChange={val => setSelectedDate(val)}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-calendar" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="appt-col">
                      <div className="appt-field">
                        <label className="appt-label">
                          Time <span className="required">*</span>
                        </label>
                        <div className="input-icon-end position-relative">
                          <TimePicker
                            className="form-control"
                            value={selectedTime}
                            onChange={val => setSelectedTime(val)}
                            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
                          />
                          <span className="input-icon-addon">
                            <i className="ti ti-clock text-gray-7" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="appt-field">
                    <label className="appt-label">
                      Appointment Reason <span className="required">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Describe the reason for appointment..."
                    />
                  </div>

                  {/* Status */}
                  <div className="appt-field">
                    <label className="appt-label">
                      Status <span className="required">*</span>
                    </label>
                    <CommonSelect
                      options={Status_Checkout}
                      className="select"
                      defaultValue={Status_Checkout[0]}
                      onChange={(opt: any) => setStatus(opt?.value || '')}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="appt-form-actions">
                  <Link to={all_routes.appointments} className="btn btn-light">
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateAppointment}
                    disabled={booking}
                  >
                    {booking ? (
                      <><span className="spinner-border spinner-border-sm me-2" /> Creating...</>
                    ) : (
                      <><i className="ti ti-calendar-check me-1" /> Create Appointment</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: AI Scheduler Assistant ─── */}
            <div className={`appt-ai-panel ${aiPanelOpen ? 'open' : ''}`}>
              <div className="appt-ai-card">
                <div className="appt-ai-header" onClick={() => setAiPanelOpen(!aiPanelOpen)}>
                  <div className="appt-ai-header-left">
                    <i className="ti ti-sparkles appt-ai-icon" />
                    <span className="appt-ai-title">AI Scheduling Assistant</span>
                  </div>
                  <i className={`ti ti-chevron-${aiPanelOpen ? 'up' : 'down'} appt-ai-toggle`} />
                </div>

                {aiPanelOpen && (
                  <div className="appt-ai-body">
                    {/* Patient Insight Card */}
                    {patientInsight && (
                      <div className="appt-insight-card">
                        <div className="appt-insight-header">
                          <i className="ti ti-brain" />
                          <span>Provider Insights</span>
                        </div>
                        <div className="appt-insight-grid">
                          <div className="appt-insight-item">
                            <span className="appt-insight-value">{patientInsight.preferredTime}</span>
                            <span className="appt-insight-label">Preferred Time</span>
                          </div>
                          <div className="appt-insight-item">
                            <span className="appt-insight-value">{patientInsight.lastVisit}</span>
                            <span className="appt-insight-label">Last Visit</span>
                          </div>
                          <div className="appt-insight-item">
                            <span className="appt-insight-value">{patientInsight.visitCount}</span>
                            <span className="appt-insight-label">Total Visits</span>
                          </div>
                          <div className="appt-insight-item">
                            <span className={`appt-insight-value ${patientInsight.noShowRate > 10 ? 'text-warning' : 'text-success'}`}>
                              {patientInsight.noShowRate}%
                            </span>
                            <span className="appt-insight-label">No-Show Rate</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suggested Slots */}
                    <div className="appt-slots-section">
                      <div className="appt-slots-header">
                        <span className="appt-slots-title">Suggested Time Slots</span>
                        <button
                          className="appt-refresh-btn"
                          onClick={() => dispatch(fetchSlotSuggestions({
                            patientId: selectedPatient || 'patient-1',
                            appointmentType: selectedType || 'General Consultation',
                          }))}
                          disabled={loading}
                          aria-label="Refresh suggestions"
                        >
                          <i className={`ti ti-refresh ${loading ? 'spin' : ''}`} />
                        </button>
                      </div>

                      {loading ? (
                        <div className="appt-slots-loading">
                          <div className="spinner-border spinner-border-sm" />
                          <span>Analyzing optimal time slots...</span>
                        </div>
                      ) : (
                        <div className="appt-slots-list">
                          {suggestions.map((slot, idx) => {
                            const { date, time } = formatDateTime(slot.datetime);
                            const showRate = Math.round(100 - slot.factors.noShowRisk);
                            const isActive = activeSlot?.datetime === slot.datetime;

                            return (
                              <div
                                key={idx}
                                className={`appt-slot-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleSlotClick(slot)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSlotClick(slot); } }}
                                aria-label={`${date} at ${time} with ${slot.providerName}`}
                                aria-selected={isActive}
                              >
                                <div className="appt-slot-top">
                                  <div className="appt-slot-datetime">
                                    <span className="appt-slot-date">{date}</span>
                                    <span className="appt-slot-time">{time}</span>
                                  </div>
                                  <span className={`appt-slot-showrate ${getShowRateClass(slot.factors.noShowRisk)}`}>
                                    {showRate}%
                                  </span>
                                </div>
                                <div className="appt-slot-meta">
                                  <span className="appt-slot-doctor">
                                    <i className="ti ti-stethoscope" /> {slot.providerName}
                                  </span>
                                  <span className="appt-slot-score">
                                    {getScoreStars(slot.score)}
                                  </span>
                                </div>

                                {/* Expanded details */}
                                {isActive && (
                                  <div className="appt-slot-details">
                                    <div className="appt-slot-factors">
                                      <div className="appt-factor">
                                        <i className="ti ti-user-check" />
                                        <span>Provider Fit</span>
                                        <span className="appt-factor-val">{Math.round(slot.factors.providerPreference)}%</span>
                                      </div>
                                      <div className="appt-factor">
                                        <i className="ti ti-heart" />
                                        <span>Convenience</span>
                                        <span className="appt-factor-val">{Math.round(slot.factors.patientConvenience)}%</span>
                                      </div>
                                      <div className="appt-factor">
                                        <i className="ti ti-clock" />
                                        <span>Wait Optimal</span>
                                        <span className="appt-factor-val">{Math.round(slot.factors.waitTimeOptimal)}%</span>
                                      </div>
                                    </div>
                                    {slot.conflicts.length > 0 && (
                                      <div className="appt-slot-conflict">
                                        <i className="ti ti-alert-triangle" />
                                        {slot.conflicts.join(', ')}
                                      </div>
                                    )}
                                    <button
                                      className="appt-apply-btn"
                                      onClick={e => { e.stopPropagation(); handleApplySlot(); }}
                                    >
                                      <i className="ti ti-check" /> Apply to Form
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* AI footer note */}
                    <div className="appt-ai-footer">
                      <i className="ti ti-info-circle" />
                      <span>Slots optimized based on historical patterns, provider availability, and patient preferences</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile AI toggle FAB */}
          <button
            className="appt-ai-fab"
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            aria-label="Toggle AI scheduling assistant"
          >
            <i className={`ti ${aiPanelOpen ? 'ti-x' : 'ti-sparkles'}`} />
          </button>
        </div>

        <div className="footer text-center bg-white p-2 border-top">
          <p className="text-dark mb-0">
            2025 © <Link to="#" className="link-primary">Symplify</Link>, All Rights Reserved
          </p>
        </div>
      </div>
      <Modals />
    </>
  );
};

export default NewAppointment;
