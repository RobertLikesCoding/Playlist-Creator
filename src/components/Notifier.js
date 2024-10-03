import React, { useEffect } from 'react';

export default function Notifier({ modalStatus }) {
  if (!modalStatus) {
    return null;
  }

  return (
    <div className="modal session">
      <p>Authentication Successfull, you can save your Playlist!</p>
    </div>
  );
}