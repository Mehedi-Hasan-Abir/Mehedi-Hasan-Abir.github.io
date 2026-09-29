/**
 * Original long-form writing published on this site.
 *
 * `blocks` is deliberately a small, plain data shape (no JSX, no HTML strings)
 * so the same source can be rendered by React at runtime AND serialised into
 * static HTML at build time by script/build.ts. That keeps the article readable
 * to crawlers and to visitors when JavaScript is unavailable, matching how the
 * rest of the site's content pages work.
 */
export type ArticleBlock =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "code"; text: string }
  | { t: "note"; text: string };

export interface Article {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated?: string;
  tags: string[];
  /** Canonical location of the original cross-post, when one exists. */
  externalLink?: string;
  externalPlatform?: string;
  /** Blog-card id in portfolio-data.ts, so the listing can link here. */
  blogId: number;
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "llm-in-production",
    title: "How to Use, Optimize, and Serve an LLM in Your Production System",
    summary:
      "A plain-English map of production LLM serving: making the model itself faster, building a serving system that holds P95/P99, and choosing an inference engine. Written as the overview to a three-part technical series.",
    date: "2026-06-20",
    tags: ["LLM", "Production Systems", "Optimization", "Inference", "MLOps", "vLLM"],
    externalLink:
      "https://medium.com/towards-artificial-intelligence/how-to-use-optimize-and-serve-an-llm-in-your-production-system-25fd40f63b6a",
    externalPlatform: "Medium",
    blogId: 3,
    blocks: [
      { t: "p", text: "You shipped the demo. The model works. Stakeholders are happy. Then real traffic hits, and suddenly:" },
      {
        t: "ul",
        items: [
          "\"Why is the first response taking 3 seconds?\"",
          "\"We're burning $8,000/month on GPU bills — there has to be a better way.\"",
          "\"The model is fast in testing but crawls under load. What's going on?\"",
          "\"We tried vLLM, TensorRT-LLM, and SGLang — which one do we actually use?\"",
          "\"Our P99 latency is 4 seconds but P50 is fine. What does that even mean?\"",
          "\"Can we fit a 70B model on two GPUs without destroying the quality?\"",
          "\"Batch inference is killing our real-time users. How do we fix this?\"",
        ],
      },
      {
        t: "p",
        text: "If any of these hit close to home, this article is the map. I also wrote a three-part technical series that goes an order of magnitude deeper on each section, from GPU kernels to cluster scaling. This is the territory; the series is the map you walk through it with.",
      },

      { t: "h2", text: "Why this problem is harder than it looks" },
      {
        t: "p",
        text: "Deploying an LLM isn't like deploying a REST API. A Flask endpoint is stateless, horizontally scalable, and usually CPU-bound. An LLM inference server is none of those things.",
      },
      {
        t: "p",
        text: "**1. Two completely different compute phases, back to back.** Every LLM request has two phases. The *prefill* phase reads your prompt — it's compute-intensive, runs fast, and can process many tokens in parallel. The *decode* phase generates the response one token at a time — it's memory-bandwidth-bound and inherently sequential. The bottleneck for each phase is a different hardware resource, so optimizing one without the other gets you half the gains.",
      },
      {
        t: "p",
        text: "**2. The GPU's memory is both the product and the bottleneck.** The model weights live in GPU memory, and so does the KV cache — the stored attention state for every active request. These two fight each other. A 7B model in FP16 alone eats 14 GB of VRAM, so on a 40 GB A100 that leaves 26 GB for batching real users. How you manage that 26 GB decides whether you serve 4 concurrent users or 40.",
      },
      {
        t: "p",
        text: "**3. Latency and throughput are opposites.** The things that make throughput high — large batches, long waits for requests to fill the batch — make latency worse. The things that make latency low waste GPU capacity. Production systems have to serve both interactive users who need sub-500ms responses and background jobs that need to process millions of documents cheaply. You can't use one configuration for both.",
      },
      {
        t: "p",
        text: "**4. The ecosystem moves fast and breaks things.** vLLM, SGLang, TensorRT-LLM, and TGI have all had major changes in 2025 and 2026. What was best practice 12 months ago may be deprecated today — TGI, for example, was fully archived in March 2026, and if you're still building on it you need to migrate.",
      },

      { t: "h2", text: "The three-layer mental model" },
      {
        t: "p",
        text: "Every production LLM problem lives in one of three layers. This is the organizing principle of the full series:",
      },
      {
        t: "code",
        text: "┌─────────────────────────────────────────────────────┐\n│  Layer 3: ENGINE CHOICE                             │\n│  Which inference runtime? vLLM, SGLang, TRT-LLM?   │\n├─────────────────────────────────────────────────────┤\n│  Layer 2: SERVING SYSTEM                            │\n│  Queuing, traffic routing, autoscaling, SLAs        │\n├─────────────────────────────────────────────────────┤\n│  Layer 1: THE MODEL ITSELF                          │\n│  Quantization, attention, GPU kernels, KV cache     │\n└─────────────────────────────────────────────────────┘",
      },
      {
        t: "p",
        text: "Most engineers start at Layer 3 — picking an engine — and then discover their problems are actually in Layer 1 or 2. The right order is bottom-up: make the model efficient, then make the serving layer stable, then pick the engine that fits your workload.",
      },

      { t: "h2", text: "Layer 1 — Making the model itself faster" },
      { t: "h3", text: "The core insight: decode is starving your GPU" },
      {
        t: "p",
        text: "Modern GPUs have hundreds of TFLOPS of tensor core capacity. But when generating tokens one by one, the GPU is mostly *reading weights from memory and doing almost no math on them*. Arithmetic intensity during decode is roughly 1 FLOP per byte of memory read; saturating tensor cores needs over 200 FLOP/byte. For most of a request's lifetime your expensive GPU sits idle at maybe 5–15% compute utilization, bottlenecked entirely on memory bandwidth.",
      },
      {
        t: "p",
        text: "This is why quantization and caching work so well — they don't make the math faster, they reduce how much data the GPU has to haul across the memory bus per step.",
      },
      { t: "h3", text: "The five-level optimization ladder" },
      {
        t: "p",
        text: "**Level 1 — BF16 + Flash Attention (free wins, zero quality loss).** Flash Attention rewrites the attention operation to avoid materializing the full N×N attention matrix in GPU memory. Instead of writing intermediate results back to slow HBM and reading them again, it fuses the operation into a single kernel that stays in fast on-chip SRAM. The result is 30–50% faster prefill on prompts longer than ~2K tokens with zero change to model quality. It's already on by default in vLLM and SGLang; if you're running anything else, check that it is.",
      },
      {
        t: "p",
        text: "**Level 2 — INT8 quantization (1.5–2× batch size, negligible quality loss).** Storing weights as 8-bit integers instead of 16-bit floats halves memory use. Perplexity degradation is under 0.1% on standard benchmarks, which is essentially invisible, and you can fit twice the model — or twice as many concurrent users — into the same VRAM. Libraries like `bitsandbytes` make this close to a one-line change.",
      },
      {
        t: "p",
        text: "**Level 3 — INT4 quantization / AWQ / GPTQ (3–4× memory, 2–3× throughput).** Going to 4-bit gives a 4× memory reduction; the challenge is doing it without quality collapse. Two methods are production-grade:",
      },
      {
        t: "ul",
        items: [
          "**AWQ (Activation-Aware Weight Quantization)** identifies which weights actually matter by looking at activation magnitudes and protects them with higher precision. This is the recommended default for quality-sensitive deployments.",
          "**GPTQ** uses a Hessian-based approach to minimize quantization error per layer. For inference speed, set `desc_act=False` — it's 2–3× faster at inference time with minimal quality trade-off.",
        ],
      },
      { t: "p", text: "Both are well-supported in vLLM and SGLang." },
      {
        t: "p",
        text: "**Level 4 — Paged KV cache + KV cache quantization (2–3× concurrency).** Without memory management the KV cache fragments — you might have 40% of your VRAM technically allocated but unusable because it sits in non-contiguous chunks. vLLM's PagedAttention solves this the way an OS solves memory fragmentation: by managing the cache in fixed-size pages of 16–64 tokens. GPU memory utilization typically improves from ~45% to ~85%.",
      },
      {
        t: "p",
        text: "On top of that you can quantize the KV cache itself to FP8. The cost is ~5–10% throughput; the benefit is that the same VRAM holds twice as many active requests. At scale that trade is usually worth it.",
      },
      {
        t: "p",
        text: "**Level 5 — Speculative decoding + tensor parallelism.** Speculative decoding uses a small draft model to predict several tokens ahead, then verifies them all at once with the main model. When predictions are mostly right — common phrases and patterns often are — you effectively generate multiple tokens per main-model forward pass, cutting TTFT and per-token latency by 2–3× on the right workloads. Tensor parallelism splits the model across GPUs, the standard approach for 70B+ models that don't fit on one card.",
      },
      {
        t: "note",
        text: "Most teams stop at Level 3 and see TTFT drop from ~800ms to ~250ms with throughput improving from ~30 to ~80 tokens/second. Levels 4 and 5 are for teams with serious production scale.",
      },

      { t: "h2", text: "Layer 2 — Building a serving system that doesn't fall apart under load" },
      { t: "h3", text: "The counterintuitive truth: your latency problem is probably queueing, not compute" },
      {
        t: "p",
        text: "Once a model is reasonably optimized, P95 and P99 latency are almost never caused by the GPU being slow. They're caused by *requests waiting*. A request that takes 50ms of actual GPU work can easily spend 800ms in queue because the batch scheduler waited for one more request, or because a 4K-token document summary monopolized the prefill slot while 12 chat queries waited.",
      },
      { t: "h3", text: "The traffic lanes pattern" },
      {
        t: "p",
        text: "The single most impactful serving change most teams can make is also the simplest: **run interactive traffic and batch traffic on separate replicas.**",
      },
      {
        t: "p",
        text: "Interactive users — chat UI, streaming responses — need low time-to-first-token and can tolerate lower throughput. Batch jobs like document summarization and embedding pipelines need high throughput and can tolerate higher latency. These two workloads want opposite things from the scheduler, and forcing them to share a GPU means one will always suffer. vLLM lets you tune this per instance:",
      },
      {
        t: "code",
        text: "# Interactive lane: small batches, fast dispatch\n--max-num-seqs 4\n\n# Batch lane: large batches, maximum throughput\n--max-num-seqs 16",
      },
      {
        t: "p",
        text: "Add short-prompt vs. long-prompt splitting and you've removed the most common source of P99 spikes in production.",
      },
      { t: "h3", text: "Measure the right things" },
      {
        t: "p",
        text: "Most teams log \"total request time,\" which is nearly useless for diagnosis. Log these instead, on every request:",
      },
      {
        t: "ul",
        items: [
          "**TTFT (time-to-first-token)** — user-perceived responsiveness. This is the number users actually feel.",
          "**TPOT (time per output token)** — decode speed, e.g. 20 ms/token. The inverse of tokens-per-second.",
          "**Queue wait time** — how long the request waited before the GPU touched it. If this is high, your problem is the serving layer, not the model.",
          "**Prefill time** — cost of reading the prompt. Spikes here mean long prompts or that Flash Attention is off.",
          "**Decode time** — cost of generating the response. Spikes here mean quantization or batching issues.",
          "**P95/P99 per traffic lane** — not a global P99, but per-lane: interactive vs. batch, short vs. long prompt.",
        ],
      },
      {
        t: "p",
        text: "Per-lane P99 matters especially. If you mix 50-token chat queries with 4K-token RAG summaries, a global P99 will always look terrible and will always be caused by the wrong thing.",
      },
      { t: "h3", text: "Backpressure, admission control, graceful degradation" },
      {
        t: "p",
        text: "Production systems need a way to say \"no\" before they fall over:",
      },
      {
        t: "ul",
        items: [
          "**Admission control** — return HTTP `429 Too Many Requests` (or `503`) when queue depth exceeds a threshold. Far better than letting requests queue for 30 seconds and then time out.",
          "**Streaming backpressure** — if a client consumes tokens slowly, don't let it pin GPU memory indefinitely. Use a bounded async queue between the inference engine and the network layer.",
          "**Cancel-on-disconnect** — if a user closes the browser tab, stop generating. Sounds obvious; most teams don't implement it.",
        ],
      },
      { t: "h3", text: "Cold start and autoscaling" },
      {
        t: "p",
        text: "LLM replicas are expensive to start. Weight loading, KV cache allocation, and warmup can add 30–90 seconds. During an autoscale event the new replica can't help for over a minute, and during that minute the remaining replicas absorb the full load spike. Two mitigations:",
      },
      {
        t: "ol",
        items: [
          "Keep `minReplicaCount: 2` at all times. Never scale to zero for production models.",
          "Scale on `vllm:num_requests_waiting` (queue depth), not CPU/GPU utilization. By the time utilization-based autoscaling triggers, users are already waiting.",
        ],
      },

      { t: "h2", text: "Layer 3 — Choosing the right inference engine" },
      {
        t: "ul",
        items: [
          "**vLLM** — best for generalist production workloads, multi-LoRA, and broad model support. The default choice for most teams. Trade-off: not quite peak throughput on narrow, well-defined workloads.",
          "**SGLang** — best for high-throughput APIs and shared-prefix workloads (RAG, few-shot prompting). Used at xAI and Microsoft Azure scale. Trade-off: multi-GPU ops less mature than TRT-LLM.",
          "**TensorRT-LLM** — best for maximum raw throughput on NVIDIA hardware and latency-SLA-bound systems. Trade-off: requires compilation (~28 min for a 70B model) and a more complex setup.",
          "**llama.cpp** — best for edge, local development, CPU, or Apple Silicon. Runs anywhere. Trade-off: not for production GPU serving at scale.",
          "**LMDeploy** — near-SGLang throughput with simpler setup. Trade-off: smaller community and fewer integrations.",
          "~~**TGI (Text Generation Inference)**~~ — fully archived on GitHub in March 2026. Read-only, no new development. If you're still building on TGI, migrate to vLLM or SGLang.",
        ],
      },
      { t: "h3", text: "The decision shortcuts" },
      {
        t: "ul",
        items: [
          "**Starting fresh?** Use **vLLM**. Broadest model support, the most production documentation, and the default choice for most teams in 2026.",
          "**Workload is primarily RAG or few-shot prompting** (many requests sharing a long system prompt or example set)? Use **SGLang**. Its RadixAttention automatically caches shared prefixes, giving roughly 29% higher throughput than vLLM on these workloads.",
          "**Need the absolute lowest latency on NVIDIA hardware?** Compile with **TensorRT-LLM**. The ~28-minute compile for a 70B model is a one-time cost, and the runtime performance is the best available on NVIDIA GPUs.",
          "**On the edge or local hardware?** **llama.cpp**. It runs on anything.",
        ],
      },

      { t: "h2", text: "The full picture — why all three layers matter together" },
      {
        t: "p",
        text: "Here's how the layers interact in a real scenario. Suppose you have a 7B model serving a chat application with 500 concurrent users:",
      },
      {
        t: "ol",
        items: [
          "**Layer 1 (model optimization):** you apply AWQ INT4 quantization. The 14 GB FP16 model shrinks to ~4 GB, VRAM is freed for KV cache, and TTFT drops from 800ms to ~250ms.",
          "**Layer 2 (serving system):** you split interactive and batch traffic into separate replicas, add admission control at depth > 20 requests, and configure KEDA to scale on `vllm:num_requests_waiting` with `minReplicaCount: 2`. P99 drops from 3.5 seconds to ~600ms.",
          "**Layer 3 (engine choice):** you're using SGLang because your chat product has a long shared system prompt, so RadixAttention caches it automatically. Every request after the first skips re-computing 500 tokens of prefill, and throughput increases by ~29%.",
        ],
      },
      {
        t: "p",
        text: "None of these three layers alone gets you there. Model optimization means nothing if the queueing system serializes every request. Serving-system tuning means nothing if the model is eating all the VRAM. Engine choice means nothing if you haven't quantized.",
      },

      { t: "h2", text: "TL;DR — the one-page cheat sheet" },
      {
        t: "ul",
        items: [
          "**Slow first token (high TTFT)?** Layer 1 + Layer 2. Quantize to INT4/AWQ, split traffic lanes, add prefix caching.",
          "**High GPU cost or low concurrency?** Layer 1. Quantize the model, enable paged KV cache, consider KV FP8 quantization.",
          "**P99 much worse than P50?** Layer 2. Switch to per-lane metrics, add admission control (HTTP 429), implement cancel-on-disconnect.",
          "**Crashing under load?** Layer 2. Add backpressure with a bounded queue, scale on queue depth rather than GPU utilization.",
          "**Not sure which engine to use?** Layer 3. Start with vLLM. Move to SGLang if your workload is RAG or few-shot heavy. Use TRT-LLM only for hard latency SLAs on NVIDIA hardware.",
          "**Model doesn't fit on one GPU?** Layer 1 + Layer 3. Quantize first — a 70B model at INT4 fits on two 40 GB A100s. Add tensor parallelism only if quantization isn't enough.",
          "**Cold starts causing latency spikes?** Layer 2. Set `minReplicaCount: 2`, send warmup prompts on startup, and scale proactively on queue depth.",
        ],
      },
      {
        t: "note",
        text: "If this was useful, the three-part series goes an order of magnitude deeper on each section.",
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
