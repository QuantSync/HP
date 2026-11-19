import GalleryClient from './GalleryClient';
import galleryData from '@/data/gallery.json';
import type { GalleryData } from '@/types/gallery';

export const metadata = {
  title: 'Gallery | For Mum 💕',
};

export default function GalleryPage() {
  const data = galleryData as GalleryData;
  return <GalleryClient albums={data.albums} />;
}
