import { redirect } from 'next/navigation';
import HomeClient from './HomeClient';
import galleryData from '@/data/gallery.json';

export default function HomePage() {
  const data = galleryData as import('@/types/gallery').GalleryData;
  if (!data || !data.albums) redirect('/login');

  // Gather all photos for slideshow (prioritise combination albums, then mix all)
  const allPhotos = data.albums.flatMap((a) => a.photos);
  // shuffle deterministically for SSR (pick every other from each album)
  const slideshowPhotos = data.albums
    .flatMap((a) => a.photos.slice(0, 3))
    .slice(0, 18);

  const individualAlbums = data.albums.filter((a) => a.people.length === 1);
  const combinationAlbums = data.albums.filter((a) => a.people.length > 1);

  return (
    <HomeClient
      allPhotos={allPhotos}
      slideshowPhotos={slideshowPhotos}
      individualAlbums={individualAlbums}
      combinationAlbums={combinationAlbums}
    />
  );
}
