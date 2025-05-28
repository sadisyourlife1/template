import { useEffect, useState } from 'react';
import { getTopTracks, Track } from '../api/lastfm';

export default function PopularTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTopTracks().then(setTracks).catch(console.error);
  }, []);

  return (
    <section className="popular-tracks">
      <h2 className="popular-tracks-title">Popular tracks</h2>
      <div className="popular-tracks-underline" />

      <div className="popular-tracks-columns">
        {tracks.length > 0 ? (
          tracks.map((track) => <TrackCard key={track.name} track={track} />)
        ) : (
          <p className="popular-tracks-empty">No popular tracks found.</p>
        )}
      </div>
    </section>
  );
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="popular-tracks-item">
      <a href={track.url} className="popular-tracks-media">
        <img
          className="popular-tracks-thumb"
          src={track.image?.[2]?.['#text'] ?? '/images/image.png'}
          alt={track.name}
          loading="lazy"
        />
      </a>

      <div className="popular-tracks-info">
        <a href={track.url} className="popular-tracks-track">
          {track.name}
        </a>
        <a href={track.artist.url} className="popular-tracks-artist">
          {track.artist.name}
        </a>
      </div>
    </div>
  );
}