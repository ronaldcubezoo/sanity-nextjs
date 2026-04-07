/**
 * Default copy & structure for Marque **profile** page builder blocks, aligned with the live
 * public profile layout (example: Peter Arnell — themarque.com/profile/peter-arnell).
 * Editors replace with their own content; this seeds realistic structure only.
 */

/** Hero / title area — mirrors top of profile page */
export const DEFAULT_MARQUE_PROFILE_HEADER = {
  name: "Peter Arnell",
  roleLine1: "Designer, Branding Executive, Founder, and CEO",
  roleLine2: "PETERARNELL, Intellectual Capital Investments",
  location: "New York, NY, USA",
  tags: ["Chad Angle", "ReputationDefender", "Liran Assness", "Tabono"],
};

/** Biography block */
export const DEFAULT_MARQUE_PROFILE_BIOGRAPHY = {
  sectionTitle: "Peter Arnell’s Biography",
  body:
    "Peter Eric Arnell is a Brand and Design Expert, Author, Photographer and Founder, Chairman & Chief Creative Officer of PETERARNELL. He is known for transforming products, brands and campaigns for some of the world’s most prestigious companies, including Chrysler, Pepsi-Cola Co., Reebok, Donna Karan, Unilever and Fontainebleau. He has been at the forefront of creating, building and transforming brands, corporations, institutions and communities for more than 40 years.\n\nArnell has built an unparalleled reputation creating groundbreaking, boundary-averse work. His unique interdisciplinary approach to brand building unites graphic arts, communications, photography, filmmaking, experience design, product engineering, architecture and more to create holistic solutions that drive enduring brand value creation.",
};

/** Newsfeed */
export const DEFAULT_MARQUE_PROFILE_NEWSFEED = {
  sectionTitle: "Peter Arnell’s Newsfeed",
  items: [
    {
      source: "Morningstar",
      headline:
        "Arnell Delivers with His Champion Team a Historic and Breakthrough Super Bowl Moment Starring Mike T",
      href: "#",
    },
    {
      source: "The New York Times",
      headline: "Eyeing the Midterms, Kennedy Pivots Toward Food and Away From Vaccines",
      href: "#",
    },
    {
      source: "CBS News",
      headline: "Mike Tyson on Healthy Eating and Super Bowl Ad",
      href: "#",
    },
  ],
};

/** Background / experience timeline */
export const DEFAULT_MARQUE_PROFILE_BACKGROUND = {
  sectionTitle: "Peter Arnell’s Background",
  items: [
    {
      org: "PETERARNELL, Intellectual Capital Investments",
      role: "Designer, Branding Executive, Founder, and CEO",
      dateRange: "2011 - Present",
      location: "New York, NY, USA",
      description:
        "Intellectual Capital Investments is an interdisciplinary brand design and product development company. Known for its success in brand creation, innovation, consumer experience, product development and environmental design.",
      logoUrl: "",
    },
    {
      org: "Peter Arnell Photography",
      role: "Photographer",
      dateRange: "",
      location: "New York, NY, USA",
      description:
        "An inventive photographer, his works have appeared for numerous fashion and lifestyle brands and his fine art photography has been included in solo and group exhibitions around the world.",
      logoUrl: "",
    },
    {
      org: "Chrysler",
      role: "Chief Innovation Officer, Founding Director of Peapod Mobility",
      dateRange: "2008 - 2012",
      location: "",
      description:
        "As CIO of Chrysler and a Founding Director of Peapod Mobility, Arnell led all electric vehicle development and designed the revolutionary Peapod Neighborhood Electric Vehicle.",
      logoUrl: "",
    },
    {
      org: "The Home Depot",
      role: "Chief Innovation Officer",
      dateRange: "2006 - 2008",
      location: "",
      description:
        "In a joint innovation venture with The Home Depot, Arnell held the position of CIO within The Home Depot organization.",
      logoUrl: "",
    },
    {
      org: "Arnell Group",
      role: "Founder, Chairman, and Chief Creative Officer",
      dateRange: "1979 - 2011",
      location: "New York, NY, USA",
      description:
        "Arnell Group developed an unparalleled reputation as a brand and product innovation firm creating revolutionary work for many of the world’s most celebrated brands.",
      logoUrl: "",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_GALLERY = {
  sectionTitle: "Peter Arnell’s Gallery",
  items: [
    {
      title: "Selected work",
      url: "https://example.com/video",
      mediaType: "video" as const,
    },
    {
      title: "Portrait series",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      mediaType: "image" as const,
    },
    {
      title: "Podcast feature",
      url: "https://example.com/audio/sample.mp3",
      mediaType: "audio" as const,
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_BOARDS = {
  sectionTitleCurrent: "Board Positions",
  current: [
    {
      org: "FDNY Foundation",
      role: "Board of Directors",
      dateRange: "2010 - Present",
      location: "New York, NY, USA",
      description:
        "The FDNY Foundation is a non-profit established in 1981 to promote New York’s life and fire safety education.",
      logoUrl: "",
    },
  ],
  sectionTitlePrevious: "Previous Board Positions",
  previous: [
    {
      org: "Special Olympics",
      role: "Board of Directors",
      dateRange: "2006 - 2010",
      location: "Washington, DC, USA",
      description:
        "The Special Olympics was founded in 1968 with the mission of fostering the inclusion and acceptance of all people.",
      logoUrl: "",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_MEDIA = {
  sectionTitle: "Media",
  items: [
    {
      title: "CBS Mornings | Mike Tyson opens up about obesity and talks about Super Bowl ad",
      url: "https://www.cbsnews.com",
      mediaType: "video" as const,
      date: "Feb 2026",
      description:
        "Peter Arnell created this advert for the 2026 Super Bowl event. Mike Tyson features in the advert and he mentions Peter in his interview.",
    },
    {
      title: "David Kronn Photography Collection Donation",
      url: "https://www.imma.ie",
      mediaType: "image" as const,
      date: "Oct 2024",
      description:
        "Peter's photographs feature in Dr David Kronn's donation of his collection of photographs to the Irish Museum of Modern Art.",
    },
    {
      title: "IMMA | David Kronn Collection",
      url: "https://www.imma.ie",
      mediaType: "image" as const,
      date: "Nov 2024",
      description:
        "Photographs by Peter feature in this photographic exhibition with a diverse selection of images from the David Kronn Collection.",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_INTERVIEWS = {
  sectionTitle: "Interviews",
  items: [
    {
      title: "Passion & Faith LIVE with Tashanea Whitlow | Peter Arnell",
      type: "Video of interview",
      date: "Jul 2025",
      description: "Peter speaks to Tashanea Whitlow about his career.",
    },
    {
      title: "Where the Greatest Creative Ideas Come From",
      type: "",
      date: "Aug 2023",
      description:
        "Legendary creative Peter Arnell breaks down his creative process — and shares how to make the most complex ideas memorably simple.",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_FEATURES = {
  sectionTitle: "Features",
  items: [
    {
      title: "Apple Podcast | Design and Marketing Visionary Peter Arnell",
      type: "Podcast",
      date: "Feb 2025",
      description:
        "Peter Arnell features on the 'Our Way' podcast for an in-depth interview with Paul Anka and Skip Bronson.",
    },
    {
      title: "Peter Arnell's Famous Campaigns Throughout the Years",
      type: "",
      date: "May 2023",
      description:
        "From Apple to Reebok, Samsung to Fila, Peter Arnell looks back on the most iconic images of his 40-year career.",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_PUBLICATIONS = {
  sectionTitle: "Publications",
  items: [
    {
      title: "Peter Arnell: Portfolio 1980–2020",
      role: "Author",
      date: "Feb 2023",
      location: "New York, NY, USA",
      description:
        "Celebrates over four decades of tireless innovation and provides rich insight into a creative mind and an exceptionally diverse body of work.",
    },
    {
      title: "Shift: How to Reinvent Your Business, Your Career, and Your Personal Brand",
      role: "Author",
      date: "Jun 2010",
      location: "",
      description:
        "Arnell’s New York Times Best Seller Shift weaves together personal stories of his own transformation with stories about how he created transformative change for brands such as Reebok and Pepsi.",
    },
    {
      title: "Samsung Rising",
      role: "",
      date: "2020",
      location: "New York, NY, USA",
      description:
        "Arnell is featured throughout Cain’s explosive exposé of Samsung that reads like a dynastic thriller.",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_AWARDS = {
  sectionTitle: "Awards & Recognition",
  items: [
    {
      org: "Council of Fashion Designers of America",
      award: "Award of Excellence in Branding and Communications",
      year: "1987",
      location: "New York, NY, USA",
      description:
        "The CFDA Fashion Awards acknowledges excellence in fashion design. Peter was the first non-fashion designer awarded for his work with Donna Karan.",
    },
    {
      org: "Ellis Island Medal of Honor",
      award: "Recipient",
      year: "2007",
      location: "",
      description:
        "The Ellis Island Medal of Honor is reserved for individuals who have given back to the country.",
    },
    {
      org: "Cannes Lions",
      award: "Honoree — Best in Category",
      year: "2003",
      location: "",
      description:
        "Peter was awarded the Cannes Gold Lion Award for Best in Category for his work on a Reebok commercial titled “Terry Tate, Office Linebacker.”",
    },
  ],
};

export const DEFAULT_MARQUE_PROFILE_SPEAKING = {
  sectionTitle: "Speaking Engagements",
  body:
    "Peter is represented by The Harry Walker Agency, a leading, global speakers' agency founded in 1946.",
  locationLine: "New York, NY, USA",
};
