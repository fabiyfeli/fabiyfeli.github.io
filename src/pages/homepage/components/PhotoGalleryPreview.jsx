import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGalleryPreview = ({ language }) => {
  const content = {
    en: {
      title: "Our Journey Together",
      subtitle: "Capturing the moments that led us here",
      viewGallery: "View Full Gallery"
    },
    es: {
      title: "Nuestro Camino Juntos",
      subtitle: "Capturando los momentos que nos trajeron aquí",
      viewGallery: "Ver Galería Completa"
    }
  };

  const text = content?.[language];

  const photos = [
  {
    src: "https://images.unsplash.com/photo-1599041858467-0c4679740c96",
    alt: "Happy couple embracing and laughing together in outdoor park setting with autumn leaves and warm golden sunlight filtering through trees"
  },
  {
    src: "https://images.unsplash.com/photo-1648220131247-25cec3cdd487",
    alt: "Romantic couple holding hands while walking on sandy beach at sunset with ocean waves and pink sky in background"
  },
  {
    src: "https://images.unsplash.com/photo-1608062631429-80e2619c31e9",
    alt: "Couple sharing intimate moment sitting on wooden bench in urban setting with brick wall and green plants surrounding them"
  },
  {
    src: "https://images.unsplash.com/photo-1601239538638-e3d0e7bf6c7a",
    alt: "Engaged couple showing diamond ring to camera with joyful smiles in cozy indoor setting with soft natural lighting"
  },
  {
    src: "https://images.unsplash.com/photo-1702342456308-a572a138c57a",
    alt: "Couple dancing together in elegant formal attire at evening event with twinkling string lights and romantic ambiance"
  },
  {
    src: "https://images.unsplash.com/photo-1661308853869-7e4b73c9a406",
    alt: "Couple enjoying picnic together on checkered blanket in green meadow with basket of food and flowers on sunny day"
  }];


  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            {text?.title}
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            {text?.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {photos?.map((photo, index) =>
          <div
            key={index}
            className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer">

              <Image
              src={photo?.src}
              alt={photo?.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <Icon name="Heart" size={32} color="white" className="heartbeat" />
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/photo-gallery">
            <Button
              variant="default"
              size="lg"
              iconName="Images"
              iconPosition="left"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">

              {text?.viewGallery}
            </Button>
          </Link>
        </div>
      </div>
    </section>);

};

export default PhotoGalleryPreview;