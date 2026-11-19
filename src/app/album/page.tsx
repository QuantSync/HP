import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import galleryData from '@/data/gallery.json';
import type { GalleryData } from '@/types/gallery';

export const metadata = {
  title: 'Albums | For Mum 💕',
};

export default function AlbumIndexPage() {
  const data = galleryData as GalleryData;
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-8 pb-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-50" />
        <div className="relative z-10">
          <span className="text-blush-400 text-sm font-medium tracking-widest uppercase block mb-3">Our Albums</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            All <span className="gradient-text">Albums</span>
          </h1>
          <p className="text-white/50">{data.albums.length} albums</p>
        </div>
      </section>

      <section className="px-4 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.albums.map((album) => {
            const cover = album.photos[0];
            return (
              <Link key={album.slug} href={`/album/${album.slug}`} className="block group">
                <div className="glass rounded-3xl overflow-hidden hover:shadow-glow-rose transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={cover.src}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={cover.blur}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h2 className="font-serif text-xl font-bold text-white mb-1">{album.title}</h2>
                    <p className="text-white/40 text-sm">{album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
