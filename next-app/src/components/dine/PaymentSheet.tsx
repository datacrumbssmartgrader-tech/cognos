"use client";

import { useState, useEffect } from "react";

interface PaymentSheetProps {
  isOpen: boolean;
  amountDue: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentSheet({ isOpen, amountDue, onClose, onPaymentSuccess }: PaymentSheetProps) {
  const [cardData, setCardData] = useState({ num: "", expiry: "", cvv: "", name: "" });
  const [cardNetwork, setCardNetwork] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCardData({ num: "", expiry: "", cvv: "", name: "" });
      setCardNetwork("");
      setIsProcessing(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCardNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    const prefix = v.slice(0, 2);
    if (v[0] === '4') setCardNetwork('VISA');
    else if (['51','52','53','54','55'].includes(prefix)) setCardNetwork('MC');
    else if (['34','37'].includes(prefix)) setCardNetwork('AMEX');
    else setCardNetwork('');
    
    v = v.replace(/(.{4})/g, '$1 ').trim();
    setCardData(prev => ({ ...prev, num: v }));
  };

  const handleCardExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    setCardData(prev => ({ ...prev, expiry: v }));
  };

  const handleCardCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardData(prev => ({ ...prev, cvv: v }));
  };

  const handlePay = () => {
    if (!cardData.num || !cardData.expiry || !cardData.cvv || !cardData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <>
      <div className={`sheet-backdrop ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <div className={`bottom-sheet pay-sheet ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Payment">
        <div className="sheet-handle"></div>
        <div className="pay-sheet-body">
          <div className="pay-amount-card">
            <span className="pay-amount-label">Amount Due</span>
            <span className="pay-amount-val">PKR {amountDue.toLocaleString()}</span>
          </div>

          <div className="pay-form">
            <div className="card-field-wrap">
              <input 
                type="text" 
                className="card-field" 
                placeholder="Card number"
                inputMode="numeric" 
                maxLength={19} 
                autoComplete="cc-number" 
                value={cardData.num}
                onChange={handleCardNum}
              />
              <span className="card-network">{cardNetwork}</span>
            </div>
            <div className="card-row">
              <input 
                type="text" 
                className="card-field" 
                placeholder="MM / YY"
                inputMode="numeric" 
                maxLength={7} 
                autoComplete="cc-exp" 
                value={cardData.expiry}
                onChange={handleCardExpiry}
              />
              <input 
                type="text" 
                className="card-field" 
                placeholder="CVV"
                inputMode="numeric" 
                maxLength={3} 
                autoComplete="cc-csc" 
                value={cardData.cvv}
                onChange={handleCardCvv}
              />
            </div>
            <input 
              type="text" 
              className="card-field" 
              placeholder="Cardholder name" 
              autoComplete="cc-name" 
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
            />

            <button 
              className={`btn-primary btn-full btn-pay ${isProcessing ? "processing" : ""}`} 
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><i className="ri-loader-4-line"></i> Processing...</>
              ) : (
                <><i className="ri-bank-card-line"></i> Pay PKR {amountDue.toLocaleString()} Securely</>
              )}
            </button>
            <button className="btn-ghost btn-full pay-cancel" onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
          </div>
        </div>
        <div style={{ height: "10dvh", flexShrink: 0 }}></div>
      </div>
    </>
  );
}
