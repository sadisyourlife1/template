import React, { useEffect, useState } from 'react';
import {searchArtists, searchAlbums, searchTracks, getTrackDetails, Artist, Album, Track, TrackInfo} from '../api/lastfm';
import { useNavigate, useSearchParams } from 'react-router-dom';

type FullTrack = Track & TrackInfo;

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<FullTrack[]>([]);
  const [loading, setLoading] = useState(false);

  // Обработка формы поиска
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  // Загрузка данных при изменении запроса
  useEffect(() => {
    if (!query) {
      setArtists([]);
      setAlbums([]);
      setTracks([]);
      return;
    }

    setLoading(true);

    Promise.all([
      searchArtists(query),
      searchAlbums(query),
      searchTracks(query)
    ]).then(async ([a, b, c]) => {
      setArtists(a);
      setAlbums(b);
      const enrichedTracks = await Promise.all(
        c.map(t =>
          getTrackDetails(
            t.artist,
            t.name,
            t.image?.[1]?.['#text'] || '/images/image.png'
          ).then(info => ({ ...t, ...info }))
        )
      );
      setTracks(enrichedTracks);
    }).catch(err => {
      console.error('Search error:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <section className="search-results">
      {/* Заголовок */}
      <div className="search-results-header-tabs">
        <header className="search-results-header">
          <h1 className={`search-results-title ${query ? 'is-visible' : ''}`}>
            Search results for “{query}”
          </h1>
        </header>

        {/* Вкладки */}
        <nav className="search-results-tabs">
          <ul className="search-results-tabs-list">
            <li className="search-results-tab search-results-tab--active">
              <span className="search-results-tab-link">Top Results</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Artists</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Albums</span>
            </li>
            <li className="search-results-tab">
              <span className="search-results-tab-link">Tracks</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Форма поиска */}
      <div className="search-results-form">
        <form onSubmit={handleSearch} className="search-results-form-inner">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for music..."
            aria-label="Search"
            className="search-results-input"
          />
          <button
            type="reset"
            className="search-results-btn search-results-btn--clear"
            aria-label="Clear search input"
          >
            ×
          </button>
          <button
            type="submit"
            className="search-results-btn search-results-btn--submit"
            aria-label="Submit search"
          />
        </form>
      </div>

      {/* Результаты поиска */}
      <div className={`search-results-body ${query ? 'is-visible' : ''}`}>
        {!loading && (
          <>
            <ArtistsGrid artists={artists} />
            <AlbumsGrid albums={albums} />
            <TrackList tracks={tracks} />
          </>
        )}
      </div>
    </section>
  );
}

// === Компоненты результатов поиска ===

function ArtistsGrid({ artists }: { artists: Artist[] }) {
  return (
    <section className="artists">
      <h2 className="artists-title">Artists</h2>

      {artists.length > 0 ? (
        <div className="artists-grid">
          {artists.map((artist, i) => (
            <a
              key={`${artist.name}-${i}`}
              href={artist.url}
              className="artists-item"
              style={{ backgroundImage: `url(${artist.image?.[2]?.['#text']})` }}
            >
              <div className="artists-info">
                <h3 className="artists-name">{artist.name}</h3>
                <p className="artists-listeners">
                  {Number(artist.listeners).toLocaleString()} listeners
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="artists-empty">No artists found.</p>
      )}

      <p className="artists-more">More artists →</p>
    </section>
  );
}

function AlbumsGrid({ albums }: { albums: Album[] }) {
  return (
    <section className="albums">
      <h2 className="albums-title">Albums</h2>

      {albums.length > 0 ? (
        <div className="albums-grid">
          {albums.map((album, i) => (
            <a
              key={`${album.name}-${i}`}
              href={album.url}
              className="albums-item"
              style={{ backgroundImage: `url(${album.image?.[2]?.['#text']})` }}
            >
              <div className="albums-info">
                <h3 className="albums-name">{album.name}</h3>
                <p className="albums-artist">{album.artist}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="albums-empty">No albums found.</p>
      )}

      <p className="albums-more">More albums →</p>
    </section>
  );
}

function TrackList({ tracks }: { tracks: FullTrack[] }) {
  return (
    <section className="tracks">
      <h2 className="tracks-title">Tracks</h2>

      {tracks.length > 0 ? (
        <ul className="tracks-list">
          {tracks.map((track, i) => (
            <li key={`${track.name}-${i}`} className="tracks-item">
              <button className="tracks-play-btn" aria-label="Play" />
              <img
                className="tracks-image"
                src={track.imageUrl}
                alt={track.name}
              />
              <a href={track.url} className="tracks-name">
                {track.name}
              </a>
              <a href={track.artistUrl} className="tracks-artist">
                {track.artist}
              </a>
              <div className="tracks-duration">{track.duration}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tracks-empty">No tracks found.</p>
      )}

      <p className="tracks-more">More tracks →</p>
    </section>
  );
}