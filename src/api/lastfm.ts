/**
 * @fileoverview Утилиты для работы с Last.fm API
 * Содержит методы для получения данных о популярных артистах, тегах и другом контенте.
 */
export const API_KEY = '597e306616b940e153ff7e2997b50c9f';
export const API_BASE = 'https://ws.audioscrobbler.com/2.0/ ';

type Params = Record<string, string | number | undefined>;

/**
 * Выполняет HTTP-запрос к Last.fm API и возвращает распарсенный JSON.
 * @template T Тип возвращаемых данных.
 * @param {string} method - Имя метода API.
 * @param {Params} [params={}] - Параметры запроса в виде ключ-значение.
 * @returns {Promise<T>} Промис с результатом запроса.
 * @throws {Error} При сетевой ошибке или ответе с кодом не 2xx.
 */
async function fetchFromApi<T>(method: string, params: Params = {}): Promise<T> {
  const url = new URL(API_BASE);
  url.searchParams.set('method', method);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');

  // Добавляем только валидные параметры
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error ${res.status}`);

  return res.json();
}

// === Вспомогательные функции ===
function ensureValidParams(...params: any[]) {
  return params.every(param => typeof param === 'string' && param.trim() !== '');
}

function extractImage(item: { image?: Image[] }, size: string = 'medium'): string | undefined {
  return item.image?.find(img => img.size === size)?.['#text'] || item.image?.[0]?.['#text'];
}

// === Интерфейсы ===

/**
 * Представляет изображение с указанием размера и URL.
 */

export interface Image {
  size: string;
  '#text': string;
}

/**
 * Информация о теге (жанре).
 */

export interface Tag {
  name: string;
  url: string;
}

/**
 * Информация об артисте.
 */

export interface Artist {
  name: string;
  mbid: string;
  url: string;
  listeners?: string;
  image: Image[];
}

/**
 * Информация об альбоме.
 */

export interface Album {
  name: string;
  mbid?: string;
  url: string;
  artist: string;
  image: Image[];
}

/**
 * Информация о треке.
 */

export interface Track {
  name: string;
  mbid?: string;
  url: string;
  artist: any;
  image: Image[];
}

/**
 * Информация о деталях трека.
 */

export interface TrackInfo {
  duration: string;
  artistUrl: string;
  imageUrl: string;
}

// === Методы для главной страницы (Top Artists / Tracks) ===

/**
 * Получает список самых популярных артистов.
 * @param {number} [limit=12] - Количество возвращаемых артистов.
 * @returns {Promise<Artist[]>}
 */

export async function getTopArtists(limit = 12): Promise<Artist[]> {
  const data = await fetchFromApi<{ artists: { artist: Artist[] } }>('chart.gettopartists', { limit });
  return data.artists.artist || [];
}

/**
 * Получает список популярных треков.
 * @param {number} [limit=18] - Максимальное число треков.
 * @returns {Promise<Track[]>}
 */

export async function getTopTracks(limit = 18): Promise<Track[]> {
  const data = await fetchFromApi<{ tracks: { track: Track[] } }>('chart.gettoptracks', { limit });
  return data.tracks.track || [];
}

// === Методы для получения тегов ===

/**
 * Получает теги (жанры) артиста.
 * @param {string} artist - Имя артиста.
 * @param {number} [limit=3] - Максимальное количество возвращаемых тегов.
 * @returns {Promise<Tag[]>}
 */

export async function getArtistTags(artist: string, limit = 3): Promise<Tag[]> {
  if (!ensureValidParams(artist)) return [];

  const data = await fetchFromApi<{ toptags: { tag: Tag[] } }>('artist.gettoptags', { artist });
  return data.toptags.tag.filter(tag => tag.url).slice(0, limit);
}

/**
 * Получает теги (жанры) трека.
 * @param {string} artist - Имя артиста.
 * @param {string} track - Название трека.
 * @param {number} [limit=3] - Максимальное количество возвращаемых тегов.
 * @returns {Promise<Tag[]>}
 */

export async function getTrackTags(artist: string, track: string, limit = 3): Promise<Tag[]> {
  if (!ensureValidParams(artist, track)) return [];

  const data = await fetchFromApi<{ toptags: { tag: Tag[] } }>('track.gettoptags', { artist, track });
  return data.toptags.tag.filter(tag => tag.url).slice(0, limit);
}

// === Методы для поиска ===

/**
 * Ищет артистов по имени.
 * @param {string} query - Поисковая строка.
 * @param {number} [limit=8] - Максимальное количество результатов.
 * @returns {Promise<Artist[]>}
 */

export async function searchArtists(query: string, limit = 8): Promise<Artist[]> {
  if (!query.trim()) return [];

  const data = await fetchFromApi<{ results: { artistmatches: { artist: Artist[] } } }>(
    'artist.search',
    { artist: query, limit }
  );
  return data.results.artistmatches.artist || [];
}

/**
 * Ищет альбомы по имени.
 * @param {string} query - Поисковая строка.
 * @param {number} [limit=8] - Максимальное количество результатов.
 * @returns {Promise<Album[]>}
 */

export async function searchAlbums(query: string, limit = 8): Promise<Album[]> {
  if (!query.trim()) return [];

  const data = await fetchFromApi<{ results: { albummatches: { album: Album[] } } }>(
    'album.search',
    { album: query, limit }
  );
  return data.results.albummatches.album || [];
}

/**
 * Ищет треки по имени.
 * @param {string} query - Поисковая строка.
 * @param {number} [limit=8] - Максимальное количество результатов.
 * @returns {Promise<Track[]>}
 */

export async function searchTracks(query: string, limit = 10): Promise<Track[]> {
  if (!query.trim()) return [];

  const data = await fetchFromApi<{ results: { trackmatches: { track: Track[] } } }>(
    'track.search',
    { track: query, limit }
  );
  return data.results.trackmatches.track || [];
}

// === Дополнительная информация о треке ===

/**
 * Получает информацию о треке: длительность, URL артиста, ссылку на изображение.
 * @param {string} artist - Имя артиста.
 * @param {string} track - Название трека.
 * @param {string} fallbackImage - Резервное изображение, если нет изображения у трека.
 * @returns {Promise<{ duration: string; artistUrl: string; imageUrl: string }>}
 */

export async function getTrackDetails(
  artistName: string,
  trackName: string,
  fallbackImage: string = '/images/image.png'
): Promise<TrackInfo> {
  if (!ensureValidParams(artistName, trackName)) {
    return { duration: '', artistUrl: '#', imageUrl: fallbackImage };
  }

  try {
    const response = await fetchFromApi<{
      track: {
        duration: string;
        artist: { url: string };
        album: { image: Image[] };
      };
    }>('track.getInfo', { artist: artistName, track: trackName });

    const info = response.track;

    const ms = parseInt(info.duration, 10);
    const duration = isNaN(ms)
      ? ''
      : `${Math.floor(ms / 60000)}:${('0' + Math.floor((ms / 1000) % 60)).slice(-2)}`;

    const artistUrl = info.artist?.url || '#';
    const imageUrl = extractImage(info.album, 'medium') || fallbackImage;

    return { duration, artistUrl, imageUrl };
  } catch {
    return { duration: '', artistUrl: '#', imageUrl: fallbackImage };
  }
}
