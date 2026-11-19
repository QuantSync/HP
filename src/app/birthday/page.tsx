import BirthdayClient from './BirthdayClient';
import galleryData from '@/data/gallery.json';
import type { GalleryData } from '@/types/gallery';

export const metadata = {
  title: 'Happy Birthday, Mum! 🎂',
};

export default function BirthdayPage() {
  const data = galleryData as GalleryData;

  // Individual Mum photos
  const mumAlbum = data.albums.find((a) => a.slug === 'mum');
  const mumPhotos = mumAlbum ? mumAlbum.photos : [];

  // All photos that include Mum (individual + combinations)
  const mumAlbums = data.albums.filter((a) => a.people.includes('mum'));
  const collagePhotos = mumAlbums.flatMap((a) => a.photos);

  return <BirthdayClient mumPhotos={mumPhotos} collagePhotos={collagePhotos} />;
}
