/**
 * Unit tests for hub helper functions (colors, SEO, content, business types)
 */
/// <reference types="vitest/globals" />

import { describe, it, expect } from "vitest";
import {
  getHubColors,
  getHubSEO,
  getHubBusinessTypes,
  getHubHeroContent,
  getHubCTAContent,
  getHubProblemSolutionContent,
  getHubStatsContent,
  getHubTestimonialsContent,
  getHubFAQContent,
  getHubAboutContent,
  getHubPricingContent,
} from "@sms-hub/hub-logic";
import type { HubType } from "../../packages/hub-logic/src/types";

const ALL_HUBS: HubType[] = ["percytech", "gnymble", "percymd", "percytext"];

describe("getHubColors", () => {
  it("should return colors object for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const colors = getHubColors(hub);
      expect(colors).toBeDefined();
      expect(colors).toHaveProperty("primary");
      expect(colors).toHaveProperty("secondary");
      expect(colors).toHaveProperty("accent");
      expect(colors).toHaveProperty("tailwind");
    });
  });

  it("should have valid hex color codes", () => {
    ALL_HUBS.forEach((hub) => {
      const colors = getHubColors(hub);
      // Hex colors should start with #
      expect(colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(colors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(colors.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("should have Tailwind class mappings", () => {
    ALL_HUBS.forEach((hub) => {
      const colors = getHubColors(hub);
      const tailwind = colors.tailwind;

      expect(tailwind).toHaveProperty("text");
      expect(tailwind).toHaveProperty("textHover");
      expect(tailwind).toHaveProperty("bg");
      expect(tailwind).toHaveProperty("bgHover");
      expect(tailwind).toHaveProperty("bgLight");
      expect(tailwind).toHaveProperty("border");
      expect(tailwind).toHaveProperty("borderLight");
      expect(tailwind).toHaveProperty("gradient");
      expect(tailwind).toHaveProperty("shadow");
      expect(tailwind).toHaveProperty("contactButton");

      // All should be strings
      Object.values(tailwind).forEach((className) => {
        expect(typeof className).toBe("string");
        expect(className.length).toBeGreaterThan(0);
      });
    });
  });

  it("should return different colors for different hubs", () => {
    const percytechColors = getHubColors("percytech");
    const gnymbleColors = getHubColors("gnymble");

    // These hubs should have different primary colors
    expect(percytechColors.primary).not.toBe(gnymbleColors.primary);
  });

  it("should default to gnymble colors for fallback", () => {
    const defaultColors = getHubColors("invalid" as HubType);
    const gnymbleColors = getHubColors("gnymble");

    expect(defaultColors.primary).toBe(gnymbleColors.primary);
  });
});

describe("getHubSEO", () => {
  it("should return SEO data for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const seo = getHubSEO(hub);
      expect(seo).toBeDefined();
      expect(seo).toHaveProperty("title");
      expect(seo).toHaveProperty("description");
      expect(seo).toHaveProperty("keywords");
      expect(seo).toHaveProperty("footerDescription");
    });
  });

  it("should have non-empty SEO fields", () => {
    ALL_HUBS.forEach((hub) => {
      const seo = getHubSEO(hub);

      expect(seo.title.length).toBeGreaterThan(0);
      expect(seo.description.length).toBeGreaterThan(0);
      expect(seo.keywords.length).toBeGreaterThan(0);
      expect(seo.footerDescription.length).toBeGreaterThan(0);
    });
  });

  it("should have SMS-related keywords", () => {
    ALL_HUBS.forEach((hub) => {
      const seo = getHubSEO(hub);
      const keywords = seo.keywords.toLowerCase();

      // Should mention SMS or texting
      expect(keywords).toMatch(/sms|text|messaging/);
    });
  });

  it("should have unique SEO content per hub", () => {
    const percytechSEO = getHubSEO("percytech");
    const gnymbleSEO = getHubSEO("gnymble");

    // Different hubs should have different titles
    expect(percytechSEO.title).not.toBe(gnymbleSEO.title);
  });

  it("should default to gnymble SEO for fallback", () => {
    const defaultSEO = getHubSEO("invalid" as HubType);
    const gnymbleSEO = getHubSEO("gnymble");

    expect(defaultSEO.title).toBe(gnymbleSEO.title);
  });
});

describe("getHubBusinessTypes", () => {
  it("should return business types array for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const businessTypes = getHubBusinessTypes(hub);
      expect(Array.isArray(businessTypes)).toBe(true);
      expect(businessTypes.length).toBeGreaterThan(0);
    });
  });

  it("should have at least 3 business types per hub", () => {
    ALL_HUBS.forEach((hub) => {
      const businessTypes = getHubBusinessTypes(hub);
      expect(businessTypes.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have non-empty strings as business types", () => {
    ALL_HUBS.forEach((hub) => {
      const businessTypes = getHubBusinessTypes(hub);
      businessTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have different business types for different hubs", () => {
    const percytechTypes = getHubBusinessTypes("percytech");
    const percymdTypes = getHubBusinessTypes("percymd");

    // Medical hub should have different types than tech hub
    expect(percytechTypes).not.toEqual(percymdTypes);
  });

  it("should default to gnymble business types for fallback", () => {
    const defaultTypes = getHubBusinessTypes("invalid" as HubType);
    const gnymbleTypes = getHubBusinessTypes("gnymble");

    expect(defaultTypes).toEqual(gnymbleTypes);
  });
});

describe("getHubHeroContent", () => {
  it("should return hero content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const hero = getHubHeroContent(hub);
      expect(hero).toBeDefined();
      expect(hero).toHaveProperty("fixedText");
      expect(hero).toHaveProperty("tagline");
      expect(hero).toHaveProperty("description");
      expect(hero).toHaveProperty("ctaText");
    });
  });

  it("should have tagline with line1 and line2", () => {
    ALL_HUBS.forEach((hub) => {
      const hero = getHubHeroContent(hub);
      expect(hero.tagline).toHaveProperty("line1");
      expect(hero.tagline).toHaveProperty("line2");
      expect(hero.tagline.line1.length).toBeGreaterThan(0);
      expect(hero.tagline.line2.length).toBeGreaterThan(0);
    });
  });

  it("should have non-empty fields", () => {
    ALL_HUBS.forEach((hub) => {
      const hero = getHubHeroContent(hub);
      expect(hero.fixedText.length).toBeGreaterThan(0);
      expect(hero.description.length).toBeGreaterThan(0);
      expect(hero.ctaText.length).toBeGreaterThan(0);
    });
  });
});

describe("getHubCTAContent", () => {
  it("should return CTA content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const cta = getHubCTAContent(hub);
      expect(cta).toBeDefined();
      expect(cta).toHaveProperty("title");
      expect(cta).toHaveProperty("description");
      expect(cta).toHaveProperty("steps");
      expect(cta).toHaveProperty("ctaText");
    });
  });

  it("should have non-empty CTA fields", () => {
    ALL_HUBS.forEach((hub) => {
      const cta = getHubCTAContent(hub);
      expect(cta.title.length).toBeGreaterThan(0);
      expect(cta.description.length).toBeGreaterThan(0);
      expect(cta.ctaText.length).toBeGreaterThan(0);
      expect(Array.isArray(cta.steps)).toBe(true);
      expect(cta.steps.length).toBeGreaterThan(0);
    });
  });
});

describe("getHubProblemSolutionContent", () => {
  it("should return problem/solution content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const content = getHubProblemSolutionContent(hub);
      expect(content).toBeDefined();
      expect(content).toHaveProperty("title");
      expect(content).toHaveProperty("description");
      expect(content).toHaveProperty("deliver");
      expect(content).toHaveProperty("overlook");
    });
  });

  it("should have deliver and overlook with title and items", () => {
    ALL_HUBS.forEach((hub) => {
      const content = getHubProblemSolutionContent(hub);

      expect(content.title).toHaveProperty("prefix");
      expect(content.title).toHaveProperty("highlight");
      expect(content.deliver).toHaveProperty("title");
      expect(content.deliver).toHaveProperty("features");
      expect(Array.isArray(content.deliver.features)).toBe(true);
      expect(content.overlook).toHaveProperty("title");
      expect(content.overlook).toHaveProperty("items");
      expect(Array.isArray(content.overlook.items)).toBe(true);
    });
  });
});

describe("getHubStatsContent", () => {
  it("should return stats content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const stats = getHubStatsContent(hub);
      expect(stats).toBeDefined();
      expect(Array.isArray(stats.stats)).toBe(true);
    });
  });

  it("should have at least 3 stats per hub", () => {
    ALL_HUBS.forEach((hub) => {
      const stats = getHubStatsContent(hub);
      expect(stats.stats.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("should have valid stat objects", () => {
    ALL_HUBS.forEach((hub) => {
      const stats = getHubStatsContent(hub);
      stats.stats.forEach((stat) => {
        expect(stat).toHaveProperty("value");
        expect(stat).toHaveProperty("label");
        expect(typeof stat.value).toBe("string");
        expect(typeof stat.label).toBe("string");
      });
    });
  });
});

describe("getHubTestimonialsContent", () => {
  it("should return testimonials content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const testimonials = getHubTestimonialsContent(hub);
      expect(testimonials).toBeDefined();
      expect(Array.isArray(testimonials.testimonials)).toBe(true);
    });
  });

  it("should have at least 2 testimonials per hub", () => {
    ALL_HUBS.forEach((hub) => {
      const testimonials = getHubTestimonialsContent(hub);
      expect(testimonials.testimonials.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have valid testimonial objects", () => {
    ALL_HUBS.forEach((hub) => {
      const testimonials = getHubTestimonialsContent(hub);
      testimonials.testimonials.forEach((testimonial) => {
        expect(testimonial).toHaveProperty("category");
        expect(testimonial).toHaveProperty("quote");
        expect(testimonial).toHaveProperty("name");
        expect(testimonial).toHaveProperty("company");
        expect(testimonial).toHaveProperty("location");
        expect(typeof testimonial.category).toBe("string");
        expect(typeof testimonial.quote).toBe("string");
        expect(typeof testimonial.name).toBe("string");
      });
    });
  });
});

describe("getHubFAQContent", () => {
  it("should return FAQ content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const faq = getHubFAQContent(hub);
      expect(faq).toBeDefined();
      expect(faq).toHaveProperty("title");
      expect(Array.isArray(faq.categories)).toBe(true);
    });
  });

  it("should have at least 2 FAQ categories per hub", () => {
    ALL_HUBS.forEach((hub) => {
      const faq = getHubFAQContent(hub);
      expect(faq.categories.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have valid FAQ category and item objects", () => {
    ALL_HUBS.forEach((hub) => {
      const faq = getHubFAQContent(hub);
      faq.categories.forEach((category) => {
        expect(category).toHaveProperty("category");
        expect(category).toHaveProperty("items");
        expect(Array.isArray(category.items)).toBe(true);

        category.items.forEach((item) => {
          expect(item).toHaveProperty("id");
          expect(item).toHaveProperty("question");
          expect(item).toHaveProperty("answer");
          expect(typeof item.question).toBe("string");
          expect(typeof item.answer).toBe("string");
          expect(item.question.length).toBeGreaterThan(0);
          expect(item.answer.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

describe("getHubAboutContent", () => {
  it("should return About content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const about = getHubAboutContent(hub);
      expect(about).toBeDefined();
      expect(about).toHaveProperty("title");
      expect(about).toHaveProperty("subtitle");
      expect(about).toHaveProperty("storyParagraphs");
      expect(about).toHaveProperty("values");
    });
  });

  it("should have story paragraphs and values", () => {
    ALL_HUBS.forEach((hub) => {
      const about = getHubAboutContent(hub);
      expect(Array.isArray(about.storyParagraphs)).toBe(true);
      expect(about.storyParagraphs.length).toBeGreaterThan(0);
      expect(Array.isArray(about.values)).toBe(true);
      expect(about.values.length).toBeGreaterThan(0);
    });
  });

  it("should have valid value objects", () => {
    ALL_HUBS.forEach((hub) => {
      const about = getHubAboutContent(hub);
      about.values.forEach((value) => {
        expect(value).toHaveProperty("title");
        expect(value).toHaveProperty("description");
        expect(typeof value.title).toBe("string");
        expect(typeof value.description).toBe("string");
      });
    });
  });
});

describe("getHubPricingContent", () => {
  it("should return Pricing content for each hub", () => {
    ALL_HUBS.forEach((hub) => {
      const pricing = getHubPricingContent(hub);
      expect(pricing).toBeDefined();
      expect(pricing).toHaveProperty("title");
      expect(pricing).toHaveProperty("subtitle");
      expect(pricing).toHaveProperty("whyChooseUs");
      expect(pricing).toHaveProperty("faqs");
    });
  });

  it("should have at least 2 whyChooseUs items per hub", () => {
    ALL_HUBS.forEach((hub) => {
      const pricing = getHubPricingContent(hub);
      expect(Array.isArray(pricing.whyChooseUs)).toBe(true);
      expect(pricing.whyChooseUs.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have valid whyChooseUs and FAQ objects", () => {
    ALL_HUBS.forEach((hub) => {
      const pricing = getHubPricingContent(hub);

      pricing.whyChooseUs.forEach((item) => {
        expect(item).toHaveProperty("title");
        expect(item).toHaveProperty("description");
        expect(typeof item.title).toBe("string");
        expect(typeof item.description).toBe("string");
      });

      pricing.faqs.forEach((faq) => {
        expect(faq).toHaveProperty("q");
        expect(faq).toHaveProperty("a");
        expect(typeof faq.q).toBe("string");
        expect(typeof faq.a).toBe("string");
      });
    });
  });
});

describe("Hub content integration tests", () => {
  it("should return consistent content structure across all hubs", () => {
    ALL_HUBS.forEach((hub) => {
      // All these should not throw errors
      expect(() => getHubColors(hub)).not.toThrow();
      expect(() => getHubSEO(hub)).not.toThrow();
      expect(() => getHubBusinessTypes(hub)).not.toThrow();
      expect(() => getHubHeroContent(hub)).not.toThrow();
      expect(() => getHubCTAContent(hub)).not.toThrow();
      expect(() => getHubProblemSolutionContent(hub)).not.toThrow();
      expect(() => getHubStatsContent(hub)).not.toThrow();
      expect(() => getHubTestimonialsContent(hub)).not.toThrow();
      expect(() => getHubFAQContent(hub)).not.toThrow();
      expect(() => getHubAboutContent(hub)).not.toThrow();
      expect(() => getHubPricingContent(hub)).not.toThrow();
    });
  });

  it("should have unique content per hub", () => {
    const percytechHero = getHubHeroContent("percytech");
    const gnymbleHero = getHubHeroContent("gnymble");

    // Different hubs should have different hero fixed text
    expect(percytechHero.fixedText).not.toBe(gnymbleHero.fixedText);
  });
});
