export interface Photo {
  src: string;
  width: number;
  height: number;
  blur: string;
}

export interface Album {
  slug: string;
  title: string;
  people: string[];
  cover: string;
  photos: Photo[];
}

export interface GalleryData {
  albums: Album[];
}
