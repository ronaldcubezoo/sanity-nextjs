const EXECUTIVE_IMAGES = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400", // Male 1
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400", // Female 1
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400", // Male 2
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400", // Female 2
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400", // Male 3
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400", // Male 4
  ];
  
  /**
   * Returns a consistent image from our gallery based on the profile ID string.
   */
  export function getProfileImage(id: string): string {
    // Simple hash to turn the ID string into a number
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % EXECUTIVE_IMAGES.length;
    return EXECUTIVE_IMAGES[index];
  }