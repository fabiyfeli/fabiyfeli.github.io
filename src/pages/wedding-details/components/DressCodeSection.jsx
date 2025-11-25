import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const DressCodeSection = ({ language }) => {
  const dressCodeInfo = {
    en: {
      title: "Dress Code",
      subtitle: "Formal Attire",
      description: "We kindly request formal attire for our celebration. Think elegant evening wear that makes you feel confident and beautiful.",
      guidelines: [
      {
        category: "For Her",
        icon: "Sparkles",
        suggestions: [
        "Floor-length gowns or elegant cocktail dresses",
        "Dressy separates or formal jumpsuits",
        "Heels or dressy flats recommended",
        "Please avoid white, ivory, or cream colors"]

      },
      {
        category: "For Him",
        icon: "Award",
        suggestions: [
        "Dark suits or tuxedos preferred",
        "Dress shirt with tie or bow tie",
        "Dress shoes (no sneakers please)",
        "Optional: Pocket square or cufflinks"]

      }],

      colorPalette: {
        title: "Suggested Color Palette",
        description: "While not required, these colors complement our wedding theme beautifully:",
        colors: [
        { name: "Rose Gold", hex: "#D4A574", description: "Warm and elegant" },
        { name: "Sage Green", hex: "#7D8471", description: "Natural sophistication" },
        { name: "Navy Blue", hex: "#1E3A5F", description: "Classic formal" },
        { name: "Burgundy", hex: "#800020", description: "Rich and romantic" }]

      },
      weatherNote: "June weather averages 75°F (24°C). Consider bringing a light wrap or jacket for evening.",
      image: "https://images.unsplash.com/photo-1628019095030-f6729546a026",
      imageAlt: "Elegant formal wedding attire display featuring sophisticated evening gowns and tailored suits in romantic color palette with rose gold and navy accents"
    },
    es: {
      title: "Código de Vestimenta",
      subtitle: "Vestimenta Formal",
      description: "Solicitamos amablemente vestimenta formal para nuestra celebración. Piense en ropa de noche elegante que lo haga sentir seguro y hermoso.",
      guidelines: [
      {
        category: "Para Ella",
        icon: "Sparkles",
        suggestions: [
        "Vestidos largos o vestidos de cóctel elegantes",
        "Conjuntos elegantes o monos formales",
        "Se recomiendan tacones o zapatos elegantes",
        "Por favor evite colores blancos, marfil o crema"]

      },
      {
        category: "Para Él",
        icon: "Award",
        suggestions: [
        "Trajes oscuros o esmoquin preferidos",
        "Camisa de vestir con corbata o pajarita",
        "Zapatos de vestir (no zapatillas por favor)",
        "Opcional: Pañuelo de bolsillo o gemelos"]

      }],

      colorPalette: {
        title: "Paleta de Colores Sugerida",
        description: "Aunque no es obligatorio, estos colores complementan maravillosamente nuestro tema de boda:",
        colors: [
        { name: "Oro Rosa", hex: "#D4A574", description: "Cálido y elegante" },
        { name: "Verde Salvia", hex: "#7D8471", description: "Sofisticación natural" },
        { name: "Azul Marino", hex: "#1E3A5F", description: "Formal clásico" },
        { name: "Borgoña", hex: "#800020", description: "Rico y romántico" }]

      },
      weatherNote: "El clima de junio promedia 75°F (24°C). Considere traer un chal ligero o chaqueta para la noche.",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_142daa070-1764102468132.png",
      imageAlt: "Exhibición elegante de vestimenta formal de boda con sofisticados vestidos de noche y trajes a medida en paleta de colores románticos con acentos de oro rosa y azul marino"
    }
  };

  const content = dressCodeInfo?.[language];

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Icon name="Shirt" size={32} color="var(--color-primary)" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
          {content?.title}
        </h2>
        <p className="text-xl text-primary font-semibold mb-3">
          {content?.subtitle}
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {content?.description}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="relative h-64 rounded-xl overflow-hidden">
          <Image
            src={content?.image}
            alt={content?.imageAlt}
            className="w-full h-full object-cover" />

        </div>

        <div className="space-y-6">
          {content?.guidelines?.map((guideline, index) =>
          <div key={index} className="bg-background rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                  <Icon name={guideline?.icon} size={20} color="var(--color-accent)" />
                </div>
                <h3 className="text-xl font-headline font-bold text-foreground">
                  {guideline?.category}
                </h3>
              </div>
              <ul className="space-y-2">
                {guideline?.suggestions?.map((suggestion, idx) =>
              <li key={idx} className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{suggestion}</span>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-headline font-bold text-foreground mb-3">
          {content?.colorPalette?.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {content?.colorPalette?.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {content?.colorPalette?.colors?.map((color, index) =>
          <div key={index} className="text-center">
              <div
              className="w-full h-20 rounded-lg mb-2 shadow-md"
              style={{ backgroundColor: color?.hex }} />

              <p className="text-sm font-semibold text-foreground">{color?.name}</p>
              <p className="text-xs text-muted-foreground">{color?.description}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-start gap-3 bg-warning/10 border border-warning/20 rounded-lg p-4">
        <Icon name="CloudSun" size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {language === 'en' ? 'Weather Note: ' : 'Nota del Clima: '}
          </span>
          {content?.weatherNote}
        </p>
      </div>
    </div>);

};

export default DressCodeSection;