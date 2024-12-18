function normalyzeBrandKitPalette(brandKitPalettes = []) {
  const normalyzedPalette = brandKitPalettes?.map((rawPalette) => {
    const id = rawPalette.id;
    const name = rawPalette.name;
    const colors = rawPalette.colours.map((paletteObj) => paletteObj.hex);
    return { id, name, colors };
  });

  return normalyzedPalette;
}

export default normalyzeBrandKitPalette;
