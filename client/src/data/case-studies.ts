/** Public, source-backed case studies. Keep claims aligned with the linked project repositories. */
export const caseStudies = [
  {
    projectId: 2,
    slug: "search-microservice",
    title: "Search Microservice: Product Discovery at Million-Item Scale",
    summary: "A typo-tolerant search API for one million products and roughly 29,000 brands, designed for a small cloud VM.",
    challenge: "A product search needs to handle misspelled queries and concurrent traffic without requiring a large server. The project targets a two-CPU, 12 GB RAM environment and keeps the database out of the request-time search path.",
    approach: [
      "PostgreSQL holds the source records while OpenSearch provides a rebuildable search index. A FastAPI service queries the product and brand indices concurrently and applies field boosts to favor relevant titles.",
      "An in-process LRU cache and a short-lived Redis cache absorb repeated queries. Nginx applies a per-IP rate limit before traffic reaches the API. Docker Compose and k6 provide a reproducible way to run and load-test the stack.",
    ],
    outcome: "In the published, resource-limited benchmarks, warm repeat queries reached about 180 requests per second at 3.2 ms P95. Unseen typo queries reached 179 requests per second at 13 ms P95. A separate unthrottled ceiling test reached 1,046 requests per second with much higher latency; it is not the normal serving target.",
    caveat: "The repository explains the benchmark setup and an adversarial typo test that exposed failures hidden by warm-cache runs. The public clone does not include the multi-gigabyte product dataset.",
  },
  {
    projectId: 5,
    slug: "outlet-fraud-detection",
    title: "Outlet Fraud Detection: Evidence-First Photo Screening",
    summary: "A no-label review pipeline that compares verification photos only with other photos from the same outlet.",
    challenge: "When field teams collect many outlet photographs, manually checking every folder for recycled or off-topic evidence does not scale. A useful tool should rank suspicious photos and explain why they need review without claiming to prove fraud automatically.",
    approach: [
      "The pipeline detects exact re-uploads by file hash, extracts image embeddings, and builds a per-outlet similarity view. Density, gap, minority-cluster, and duplicate rules produce review flags with deterministic reasons.",
      "A local review interface shows the outlet image grid, rule badges, and a similarity heatmap. The repository includes a small sample outlet and committed results so the workflow can be inspected without private field data.",
    ],
    outcome: "On the repository's labeled manual benchmark of 213 images from 15 outlets, the combined rules plus duplicate detection reported 83.3% precision and 85.7% recall. These are benchmark results for that sample, not a production guarantee.",
    caveat: "The suspicion score is a rank within an outlet, not a probability of fraud. Small photo sets and missing time information limit what the tool can conclude; a human reviewer makes the final decision.",
  },
] as const;

export type CaseStudy = (typeof caseStudies)[number];

export function caseStudyForProject(projectId: number) {
  return caseStudies.find((study) => study.projectId === projectId);
}
