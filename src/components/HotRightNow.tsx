import { useEffect, useState } from 'react';
import { getTopArtists, getArtistTags, Artist, Tag } from '../api/lastfm';

export default function HotRightNow() {
  const [artists, setArtists] = useState<Artist[]>([]);
  useEffect(() => {
    getTopArtists().then(setArtists).catch(console.error);
  }, []);

  return (
    <section className="hot-right-now">
      <h2 className="hot-right-now-title">Hot right now</h2>
      <div className="hot-right-now-underline" />

      <div className="hot-right-now-grid">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard key={artist.name} artist={artist} />
          ))
        ) : (
          <p className="hot-right-now-empty">No trending artists found.</p>
        )}
      </div>
    </section>
  );
}

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div className="hot-right-now-item">
      <a href={artist.url} className="hot-right-now-media">
        <img
          className="hot-right-now-thumb"
          src={artist.image?.[2]?.['#text'] ?? '/images/image.png'}
          alt={artist.name}
          loading="eager"
          width={120}
          height={120}
        />
        <p className="hot-right-now-name">{artist.name}</p>
      </a>

      <ArtistTags name={artist.name} />
    </div>
  );
}

function ArtistTags({ name }: { name: string }) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    getArtistTags(name).then(setTags).catch(() => {});
  }, [name]);

  if (tags.length === 0) return null;

  return (
    <p className="hot-right-now-tags">
      {tags.map((tag) => (
        <a key={tag.name} href={tag.url} className="hot-right-now-tag">
          {tag.name}
        </a>
      ))}
    </p>
  );
}