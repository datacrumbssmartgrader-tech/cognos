"use client";

import { useState, useEffect } from "react";

interface WaiterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAlert: (msg: string, isComplaint: boolean) => void;
}

export default function WaiterSheet({ isOpen, onClose, onSubmitAlert }: WaiterSheetProps) {
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaintMsg, setComplaintMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShowComplaint(false);
      setComplaintMsg("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCallWaiter = () => {
    onSubmitAlert("", false);
  };

  const handleSubmitComplaint = () => {
    onSubmitAlert(complaintMsg, true);
  };

  return (
    <>
      <div className={`sheet-backdrop ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <div className={`bottom-sheet waiter-sheet ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="sheet-handle"></div>
        <div className="waiter-body">
          <div className="waiter-icon"><i className="ri-service-line"></i></div>
          <h3 className="waiter-title">At Your Service</h3>
          <p className="waiter-sub" style={{ marginBottom: "1.5rem" }}>How can we help you today?</p>
          
          {!showComplaint ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
              <button className="btn-primary btn-full" onClick={handleCallWaiter}>Call Waiter</button>
              <button className="btn-ghost btn-full" onClick={() => setShowComplaint(true)}>File a Complaint</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", textAlign: "left" }}>
              <textarea 
                className="form-input" 
                placeholder="Enter your complaint or request here..."
                value={complaintMsg}
                onChange={(e) => setComplaintMsg(e.target.value)}
                rows={3}
              ></textarea>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-ghost btn-full" style={{ flex: 1 }} onClick={() => setShowComplaint(false)}>Cancel</button>
                <button className="btn-primary btn-full" style={{ flex: 1 }} onClick={handleSubmitComplaint}>Submit</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ height: "10dvh", flexShrink: 0 }}></div>
      </div>
    </>
  );
}
