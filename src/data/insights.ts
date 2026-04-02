export type InsightContent = {
  type: "paragraph" | "quote" | "video";
  text?: string;
  url?: string;
};

export type Insight = {
  id: string;
  title: string;
  category: string;
  author: string;
  read_time: string;
  image: string;
  date?: string;
  summary?: string;
  featured?: boolean;
  content: InsightContent[];
};

function calculateReadTime(content: InsightContent[]): string {
  const WORDS_PER_MINUTE = 200;
  
  // Extract all text from the content blocks and combine it into one massive string
  const fullText = content.map(block => block.text || "").join(" ");
  
  // Split the string by spaces to get an array of words, then count them
  const wordCount = fullText.trim().split(/\s+/).length;
  
  // Divide by 200 WPM and round up to the nearest whole minute
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  // Ensure it never says "0 min read" for very short snippets
  return `${Math.max(1, minutes)} min read`;
}

const rawInsights: Omit<Insight, "read_time">[] = [
  {
    id: "digital-due-diligence",
    title: "Digital Due Diligence: Why Your Online Profile is Your Greatest Asset",
    category: "Technology",
    author: "The Marque Editorial Team",
    date: "October 12, 2025",
    summary: "Before a meeting is booked, stakeholders are conducting extensive digital due diligence. Learn why curating your digital footprint is critical.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    featured: true,
    content: [
      { type: "paragraph", text: "In the modern corporate landscape, your digital footprint is evaluated long before you step into the boardroom. Before a meeting is booked, before a board seat is offered, and before an investment is finalized, stakeholders are conducting extensive digital due diligence." },
      { type: "paragraph", text: "Historically, executive reputation was managed through carefully placed PR pieces and word-of-mouth within closed networks. Today, the democratization of information means that your professional narrative is constantly being aggregated, synthesized, and served up by search engines and AI language models." },
      { type: "quote", text: "Your digital footprint is often the first impression people have of you. It must be curated with the same exactitude as a corporate balance sheet." },
      { type: "paragraph", text: "The rise of generative AI search—where tools like ChatGPT, Claude, and Google's AI Overviews summarize a person's entire career in seconds—has fundamentally shifted the landscape. If your digital footprint relies on outdated biographies, fragmented press releases, or unverified secondary sources, these AI tools will hallucinate or misrepresent your actual achievements." },
      { type: "paragraph", text: "Executives must take proactive control of their digital presence to ensure accuracy, authority, and prominence. This means establishing a centralized, verified, and highly optimized digital anchor—a definitive source of truth that algorithms are forced to prioritize." },
      { type: "quote", text: "Control the narrative, or the algorithm will construct one for you." },
      { type: "paragraph", text: "The consequences of a fragmented digital identity are no longer just reputational; they are financial. A strong, cohesive digital profile signals competence, transparency, and modern leadership to the market. It is time to treat your digital reputation not as an afterthought, but as an appreciating asset." }
    ]
  },
  {
    id: "future-of-board-governance",
    title: "The Future of Board Governance in an AI-Driven World",
    category: "Leadership",
    author: "Jonathan Hayes",
    date: "October 08, 2025",
    summary: "As artificial intelligence integrates into enterprise operations, board directors face a new frontier of risk and opportunity.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
    content: [
      { type: "paragraph", text: "As artificial intelligence rapidly integrates into enterprise operations, board directors face a completely unprecedented frontier of risk and opportunity. The days of treating technology as a purely operational matter relegated to the CIO are over." },
      { type: "paragraph", text: "Today's boards must grapple with questions of algorithmic bias, data privacy, and the ethical deployment of autonomous systems. When an AI makes a critical business decision that results in a regulatory fine or reputational damage, the ultimate liability rests with the board's oversight mechanisms." },
      { type: "quote", text: "The modern board director must transition from general digital literacy to specific algorithmic fluency." },
      { type: "paragraph", text: "This shift requires a restructuring of traditional board committees. We are seeing forward-thinking organizations establish dedicated Technology & Ethics committees, tasked not just with overseeing cybersecurity, but with auditing the models that drive the company's core operations." },
      { type: "paragraph", text: "Furthermore, the velocity of AI development means that annual or quarterly risk assessments are no longer sufficient. Continuous monitoring and dynamic risk frameworks must be implemented. Directors must demand transparent reporting from management on how AI models are trained, what data they consume, and what guardrails prevent unintended consequences." },
      { type: "paragraph", text: "Ultimately, the boards that thrive in this new era will be those that view AI not just as a risk to be mitigated, but as a strategic lever to outmaneuver competitors. Governance must evolve from a defensive posture to a proactive, value-creating discipline." }
    ]
  },
  {
    id: "sustainable-investing-2026",
    title: "Sustainable Investing: Beyond the ESG Checkbox",
    category: "Finance",
    author: "Sarah Collins",
    date: "October 01, 2025",
    summary: "Investors are demanding deeper accountability. The focus has shifted from high-level commitments to measurable, sustained impact.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
    content: [
      { type: "paragraph", text: "For the past five years, Environmental, Social, and Governance (ESG) criteria have dominated the investment landscape. However, as the market matures, investors are growing increasingly skeptical of 'greenwashing' and superficial corporate pledges." },
      { type: "paragraph", text: "We have entered an era of deep accountability. Institutional investors, sovereign wealth funds, and private equity giants are no longer satisfied with high-level sustainability reports filled with marketing rhetoric. They are demanding granular, verifiable data that proves measurable, sustained impact." },
      { type: "quote", text: "Capital deployment over the next decade will ruthlessly filter out superficial compliance in favor of systemic, provable sustainability." },
      { type: "paragraph", text: "This shift is being accelerated by stringent regulatory crackdowns across Europe and North America. Regulatory bodies are standardizing reporting frameworks and actively penalizing organizations that overstate their environmental initiatives. The cost of failing to embed genuine sustainability into a business model has never been higher." },
      { type: "paragraph", text: "For fund managers and executives, the mandate is clear: sustainability must move out of the PR department and into the core financial operations of the business. It must be treated with the same rigor, auditability, and strategic importance as traditional revenue and margin metrics." },
      { type: "paragraph", text: "The organizations that successfully transition from 'checking the ESG box' to fundamentally rewiring their operations for long-term ecological and social resilience will be the ones that command premium valuations in the markets of tomorrow." }
    ]
  }
];

export const insights: Insight[] = rawInsights.map(insight => ({
  ...insight,
  read_time: calculateReadTime(insight.content)
}));

export const insightCategories = ["All", "Technology", "Leadership", "Finance"];