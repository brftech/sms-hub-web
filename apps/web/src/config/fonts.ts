// Font configuration for logos and text elements
export const fontConfig = {
  // Primary brand fonts
  logos: {
    gnymble: {
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "900", // extra bold (font-black)
      fontSize: "32px",
      letterSpacing: "-0.025em", // tracking-tight
      textAnchor: "middle",
      // SVG viewBox dimensions
      width: 200,
      height: 50,
      // Text positioning
      x: 100,
      y: 35,
    },
    percytech: {
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "900", // extra bold (font-black)
      fontSize: "32px",
      letterSpacing: "-0.025em", // tracking-tight
      textAnchor: "middle",
      // SVG viewBox dimensions
      width: 200,
      height: 50,
      // Text positioning
      x: 100,
      y: 35,
    },
  },

  // Icon logos (smaller versions)
  iconLogos: {
    gnymble: {
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "900", // extra bold (font-black)
      fontSize: "36px",
      letterSpacing: "-0.025em", // tracking-tight
      textAnchor: "middle",
      // SVG viewBox dimensions
      width: 80,
      height: 80,
      // Text positioning
      x: 40,
      y: 52,
    },
    percytech: {
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: "900", // extra bold (font-black)
      fontSize: "36px",
      letterSpacing: "-0.025em", // tracking-tight
      textAnchor: "middle",
      // SVG viewBox dimensions
      width: 80,
      height: 80,
      // Text positioning
      x: 40,
      y: 52,
    },
  },

  // Color gradients - Updated to match phone component exactly
  gradients: {
    gnymble: {
      start: "#F97316", // orange-500
      end: "#DC2626", // red-600
    },
    percytech: {
      start: "#8B0000", // dark red
      end: "#1E40AF", // blue-700
    },
  },
};

// Helper function to get font styles for CSS
export const getFontStyles = (
  brand: "gnymble" | "percytech",
  type: "logo" | "icon"
) => {
  const config =
    type === "logo" ? fontConfig.logos[brand] : fontConfig.iconLogos[brand];
  return {
    fontFamily: config.fontFamily,
    fontWeight: config.fontWeight,
    fontSize: config.fontSize,
    letterSpacing: type === "logo" ? config.letterSpacing : "normal",
  };
};

// Helper function to get SVG attributes
export const getSVGAttributes = (
  brand: "gnymble" | "percytech",
  type: "logo" | "icon"
) => {
  const config =
    type === "logo" ? fontConfig.logos[brand] : fontConfig.iconLogos[brand];
  return {
    width: config.width,
    height: config.height,
    viewBox: `0 0 ${config.width} ${config.height}`,
    x: config.x,
    y: config.y,
    textAnchor: config.textAnchor,
  };
};
