import React from 'react';
import Track from './Track';

export default function Tracklist(props) {
  return (
    <div className='tracklist'>
      <ul>
        { props.topTracks.map((track) => {
          return <Track track={track} key={track.id}/>
        })}
      </ul>
    </div>
  )
};