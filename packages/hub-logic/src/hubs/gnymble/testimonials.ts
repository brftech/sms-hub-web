/**
 * Gnymble Testimonials Section Content
 * Homepage testimonials section
 */

import type { TestimonialsContent } from "../../types";

export const gnymbleTestimonials: TestimonialsContent = {
  title: {
    highlight: "Real businesses.",
    suffix: "Real results.",
  },
  description: "See how regulated businesses use Gnymble to connect with customers compliantly.",
  testimonials: [
    {
      category: "CIGAR RETAIL",
      quote:
        "We were rejected by three SMS platforms before finding Gnymble. They understood our industry from day one and got us live in under two weeks. Game changer for our VIP events.",
      name: "Marcus R.",
      company: "Premium Cigar Lounge",
      location: "Miami, FL",
    },
    {
      category: "CRAFT DISTILLERY",
      quote:
        "Finally, an SMS platform that doesn't treat alcohol businesses like criminals. The compliance support alone is worth it. Our tasting room events are now consistently sold out.",
      name: "Sarah K.",
      company: "Artisan Spirits Co.",
      location: "Portland, OR",
    },
    {
      category: "FIREARM RETAIL",
      quote:
        "Other platforms either rejected us or shut us down after a month. Gnymble knows the regulations and helps us stay compliant. Our in-store event attendance is up 60%.",
      name: "David M.",
      company: "Precision Firearms & Range",
      location: "Dallas, TX",
    },
  ],
};
