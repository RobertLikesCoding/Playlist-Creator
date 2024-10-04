import React from 'react';
import '../styles/App.css';

export default function Notifier({ modalContent, setModalContent }) {
  if (!modalContent || modalContent.length === 0) {
    return null;
  }

  function handleClose() {
    setModalContent(null);
  }

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modalHeader">
          {modalContent[1] && (
            <i className="fa-solid fa-xmark" onClick={handleClose}></i>
          )}
        </div>
        <div className="modalBody">
          {modalContent[0]}
        </div>
      </div>
    </>
  );
}