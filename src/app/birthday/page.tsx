import BirthdayClient from './BirthdayClient';
import galleryData from '@/data/gallery.json';
import type { GalleryData } from '@/types/gallery';

export const metadata = {
  title: 'Happy Birthday, Mum! 🎂',
};

export default function BirthdayPage() {
  const data = galleryData as GalleryData;

  // Collect photos that include Mum (combination albums first, then all)
  const mumAlbums = data.albums.filter((a) =>
    a.people.includes('mum')
  );
  const collagePhotos = mumAlbums.flatMap((a) => a.photos);

  return <BirthdayClient collagePhotos={collagePhotos} />;
}
