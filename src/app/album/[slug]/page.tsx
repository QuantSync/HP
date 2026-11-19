import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import galleryData from '@/data/gallery.json';
import type { GalleryData } from '@/types/gallery';

interface AlbumPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const data = galleryData as GalleryData;
  return data.albums.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: AlbumPageProps) {
  const data = galleryData as GalleryData;
  const album = data.albums.find((a) => a.slug === params.slug);
  if (!album) return { title: 'Not Found' };
  return { title: `${album.title} | For Mum 💕` };
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const data = galleryData as GalleryData;
  const album = data.albums.find((a) => a.slug === params.slug);
  if (!album) notFound();

  const coverPhoto = album.photos[0];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Album hero */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src={coverPhoto.src}
          alt={album.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={coverPhoto.blur}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <p className="text-blush-300 text-sm font-medium tracking-widest uppercase mb-2">Album</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">{album.title}</h1>
          <p className="text-white/50 text-sm">{album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      {/* Photos grid */}
      <section className="px-3 sm:px-4 py-10 max-w-7xl mx-auto">
        <MasonryGrid photos={album.photos} priority />
      </section>
    </main>
  );
}
