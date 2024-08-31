import React from 'react';

export default function Tracklist(props) {
  return (
    <div className='tracklist'>
      <ul>
        { props.topTracks.map((track) => {
          return <li key={track.id}>{track.name}</li>
        })}
      </ul>
    </div>
  )
};