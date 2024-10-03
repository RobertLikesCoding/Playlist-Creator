import React from 'react';
import '../styles/App.css';

export default function Notifier({ modalContent, setModalContent }) {
  if (!modalContent) {
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
          <i className="fa-solid fa-xmark" onClick={handleClose}></i>
        </div>
        <p>{modalContent}</p>
      </div>
    </>
  );
}