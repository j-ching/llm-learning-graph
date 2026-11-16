/* rag-c「RAG 评测体系」分支精读笔记（14 篇：13 篇正文精读 + 1 篇近乎空文档待补）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 * 原文缺陷如实标注：第 8 篇正文仅一句话；第 3/6 篇的对比表在嵌入卡片/截图里；
 * 第 11/12 篇为纯代码文档；第 14 篇正文仅一个要点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- 评测方法论 ----------
  'd0100': {
    note: '搭 RAG 不难（Dify/Coze 上传文档就能跑），但效果没人知道；RAG 有问题、答案、检索资料三要素，必须两两组合评测。作者判断：有了评测才能对客使用，评测的本质是确保系统不是「碰运气」，而是真正稳定、可靠且可用。',
    tags: ['已精读', 'RAG评测'],
    kids: [
      { name: '三要素两两评测，评测是对客门槛 ★', note: '普通 LLM 问答只需关心问题与答案是否相关、答案是否有帮助；RAG 系统有三个要素——问题、答案、检索资料，需要一套方法论对「问题×答案」「问题×检索资料」「检索资料×答案」三种组合做全面评估。作者核心判断（原文加粗）：评测本质上是为了解决「如何确保你的 AI 系统不是在碰运气，而是真正稳定、可靠且可用」；一个 RAG 系统只有有了评测之后，才能对客使用。', tags: ['必记'] },
      { name: '链路错误是乘法关系：80% × 80% = 64%', note: 'RAG 是「检索 + 生成」的链路系统，错误在流水线中是乘法关系而非加法关系：检索准确率 80% × 生成准确率 80% = 端到端准确率仅 64%。不评测只知道「答错了」，不知道错在哪。评测把问题定位到具体环节对症下药：检索层失败（没召回关键证据、排序把正确答案压得太靠后）→ 优化向量数据库、切分策略或重排序模型；生成层失败（检索到正确文档但模型无视上下文瞎编）→ 调整提示词约束、降低模型温度或优化引用机制。' },
      { name: '打破「能用」幻觉 + 质量闭环防倒退', note: 'Demo 阶段问几个简单问题往往答案看似不错，让人误以为系统可用；进入真实业务（企业知识库、客服问答）问题才暴露，原文还列出「回答本身没错，但速度太慢或成本太高」的工程性能缺陷（该节 markdown 中有两条 bullet 为空，内容疑在头图里，未能读取）。评测体系（特别是离线回归测试集）建立质量闭环：版本对比——更换嵌入模型或调参后整体变好还是变差；回归测试——确保新迭代不重新引入已修复的问题，防止「按下葫芦浮起瓢」。' },
      { name: '高危行业生命线 + 质量成本体验平衡', note: '客服闲聊答错只是体验不佳，但医疗场景遗漏关键病症信息、编造药物剂量可能导致误诊；金融/法律引用过期旧政策、虚构法律条款会引发合规风险与法律纠纷——科学评估体系是这些高风险场景可靠性的「生命线」。同时评测不止看准确性（忠实度、相关性），还要看端到端工程指标：P95 延迟、吞吐量、每千次查询成本；准确但响应极慢或单次查询成本极高的系统在生产环境无法落地，要保证商业上的可持续性。' }
    ]
  },

  'd0101': {
    note: 'RAG Triad（TruLens 提出）：不需要人工标注的 Ground Truth，通过分析 Query、Context、Response 三要素的两两关系做自动化体检——上下文相关性、忠实度/依据性、答案相关性。',
    tags: ['已精读', 'RAG评测', '评测指标'],
    kids: [
      { name: '方法论定位：无需 Ground Truth 的自动体检 ★', note: 'RAG Triad（RAG 三元组）是专门评估 RAG 应用质量的核心方法论，由 TruLens 提出。最大特点（原文加粗）：不需要人工标注的标准答案（Ground-truth），只分析 RAG 流程中三个最关键元素——用户提问（Query）、检索到的上下文（Context）、模型生成的回答（Response）——之间的两两关系，即可对系统做全方位自动化体检。三元组关系图在原文截图里，正文已完整给出三组关系。', tags: ['必记'] },
      { name: 'Context Relevance：检索器找资料准不准', note: '评估关系：检索到的材料（Context）× 用户提问（Query）。衡量检索器「找资料」的精准度：召回的文档片段中有多少真正能支持回答用户问题。低分意味着检索器捞回大量与问题无关的噪声内容——冗余信息不仅浪费计算资源，还可能干扰大模型，导致最终回答质量下降。' },
      { name: 'Faithfulness / Groundedness：模型写答案老不老实', note: '评估关系：模型生成的回答（Response）× 检索到的材料（Context）。衡量大模型是否严格基于检索资料作答。低分意味着出现幻觉（Hallucination）：回答中包含检索资料中完全不存在、甚至与资料相矛盾的信息。命名差异：TruLens 中称 Groundedness，RAGAS 或 DeepEval 中常称 Faithfulness，两者本质相同。' },
      { name: 'Answer Relevance：是否完整解决原始诉求', note: '评估关系：模型生成的回答（Response）× 用户提问（Query）。衡量最终回答是否准确、完整地解决用户原始诉求。低分意味着答非所问。原文例子：用户问「A 在哪里，它的首都是什么？」，模型只回答「A 在哪里」——虽然信息正确且基于上下文，但没有完整回答问题，得分就会较低。即「正确但不完整」也会被判低分。' }
    ]
  },

  'd0102': {
    note: 'RAG Triad 是评估体系/方法论，本篇给出具体度量尺子：检索层 Context Recall / Context Precision / F1 + MRR / NDCG，生成层 Faithfulness / Answer Relevancy（有标准答案时加 Answer Correctness），外加端到端与工程化指标。',
    tags: ['已精读', 'RAG评测', '评测指标'],
    kids: [
      { name: '检索层三指标：查全、查准、调和平均 ★', note: 'Context Recall（召回率）= 查全率：所有与问题相关的文档中，系统成功检索出的比例；Context Precision（精准率）= 查准率：检索回来的所有文档块中真正与问题相关的比例；F1 Score 是精确率和召回率的调和平均数，只有两者都高 F1 才高。作者口诀（原文加粗）：召回率讲求「宁可错杀一千，不可放过一个」，准确率讲求「宁缺毋滥」。原文还提到可用 BLEU、ROUGE、METEOR 等方法评测。', tags: ['必记'] },
      { name: '传统 P/R vs Context P/R：数学统计 vs 语义评估 ★', note: '传统 Precision/Recall 是「死板」的数学统计：需要人工提前标注 Ground Truth，机械对比检索回来的文档 ID 对不对；Context Precision/Context Recall 是「灵活」的语义评估：利用 LLM 作为裁判直接阅读文档内容，从语义层面判断检索回来的信息到底有没有用。这是 RAG 评测尤其是各评测框架的常用手段——LLM-as-a-Judge（原文加粗）。', tags: ['必记'] },
      { name: 'MRR / NDCG：不仅找到，还要靠前', note: 'MRR（平均倒数排名）/ NDCG（归一化折损累计增益）衡量相关文档的排名位置：正确答案排得越靠前得分越高，不仅关心「有没有找到」，更关心「找得靠不靠前」。定位关系：上下文相关性（Context Relevance）是最终目标（找到的资料准不准），Recall、Precision、MRR、NDCG 是从不同维度衡量目标达成情况的「具体尺子」。注意：原文只给文字定义，未给出 MRR/NDCG 的数学公式。' },
      { name: '生成层：Faithfulness、Answer Relevancy、Answer Correctness', note: 'Faithfulness（忠实度）：答案是否严格基于检索上下文，是否编造了上下文中不存在或与之矛盾的信息；Answer Relevancy（答案相关性）：答案是否直接、准确回答原始问题。有标准答案时可用 Answer Correctness（答案正确性）——衡量最终答案质量的「金标准」，综合事实准确度与语义相似度两个维度，需要人工标注 Ground Truth 作参照：不仅语义表达相近（像不像），核心事实（数据、人名、结论）必须完全一致（对不对）；主流框架中事实准确度权重通常更高，避免 AI 用「正确的废话」掩盖事实错误。原文「Answer Correctness 与 Answer Relevancy 对比」处为嵌入卡片/截图，对比明细正文读不到；文中还嵌有《RAG 测评之 RAG Triad》《Prompt 评测方法》两张文档卡片。' },
      { name: '端到端与工程化评估', note: '工业级 RAG 还关注：端到端质量（End-to-end Score）——A/B 测试或黄金测试集综合评估从提问到获取答案的整体体验；鲁棒性与安全性——面对噪声文档、错误信息、恶意攻击时的稳定性，是否产生有害、偏见或侵犯版权内容；性能与成本——检索延迟（Embedding 生成耗时、数据库查询耗时）、QPS、GPU/CPU 利用率、大模型 API 调用成本。Answer Correctness 有时也被当作端到端评测指标。' }
    ]
  },

  'd0103': {
    note: 'LLM-as-a-Judge：用更强的 LLM（通常是闭源模型）当裁判给被测模型打分，解决「人工评估太慢太贵」与「传统自动指标太死板」的矛盾；分无参考/有参考两种模式；最大缺点是成本高，RAGAS、DeepEval 等框架已把手搓环节封装好。',
    tags: ['已精读', 'RAG评测', 'LLM-as-a-Judge'],
    kids: [
      { name: '三种传统手段各卡在哪', note: '传统自动指标（BLEU、ROUGE）靠计算生成文本与标准答案的「字面重叠度」打分，但 RAG 答案措辞灵活，语义完全正确字面重合度也可能很低，搞不定复杂语义和逻辑评估；人工评估是最准确的「金标准」，但贵、慢、难规模化（原文加粗），成千上万条测试数据逐一人工打分不现实；基于规则的评估（正则匹配、关键词检测）快但太死板，应付不了开放域自然语言问答。' },
      { name: '核心机制与两种运作模式 ★', note: '将一个大语言模型（通常是能力更强的闭源模型）当作「裁判员」，根据预设规则自动给被测模型的答案打分，既解决规模化难题，又能像人类一样从语义层面理解复杂上下文。两种模式：无参考评估——只给 Query + Answer，不需要标准答案，适合主观标准（语气是否专业、是否含偏见、回答是否流畅）；有参考评估——额外提供 Ground Truth 或检索到的 Context，裁判对比生成答案与参考内容的一致性，适合事实准确性、忠实度等客观标准。', tags: ['必记'] },
      { name: '在 RAG 中的价值：规模化 + 多维度诊断', note: 'RAG Triad 中上下文相关性和答案相关性涉及复杂语义理解，人工准但难规模化，LLM-as-a-Judge 起「放大器」作用：规模化——24*7 全天候不知疲倦，「只要给够 Token 就能一直干活」；多维度诊断——不仅给总分，还能指出具体是「事实错误」「逻辑混乱」还是「废话太多」，精准定位瓶颈到底是检索没找对资料，还是生成端产生了幻觉。' },
      { name: '坑：成本高，手搓环节多 ★', note: '作者明确「最重要的就是成本高」：全部自己手搓需要构建数据集、生成答案（问题-答案对、问题-文档-答案对）、设计 LLM 评判 prompt、设计评分维度、设计评分量表（总分多少分、评分标准）、以及最终的数据统计，比较麻烦。现在已有成熟框架把这些事做了，比如 ragas、DeepEval。', tags: ['必记'] }
    ]
  },

  // ---------- 评测框架 ----------
  'd0104': {
    note: '四大主流评测框架选型：TruLens 强在全链路可观测（RAG Triad 提出者）、RAGAS 是专为 RAG 设计的轻量首选（支持无参考答案评估）、DeepEval 像 Pytest 单测适合 CI/CD、Phoenix 离线评测 + 生产监控 + Bad Case 数据闭环。',
    tags: ['已精读', 'RAG评测', '评测框架'],
    kids: [
      { name: 'TruLens：RAG Triad + 插桩式全链路追踪', note: 'TruEra 开发（现被 Snowflake 收购），提出 RAG 三元组评估体系，主要指标 Context Relevance、Groundedness（Faithfulness）、Answer Relevance。亮点是可观测性：无侵入式「插桩（Instrumentation）」自动记录应用执行每一步（提示词构建、检索器调用、大模型流式输出），效果变差时可像查「慢 SQL 日志」一样回溯到具体哪个环节、哪条数据出了问题。自动化评估靠「反馈函数（Feedback Functions）」：LLM 裁判按精心设计的提示词对输入、输出和中间结果打分（通常 0–10 分）。可视化 Dashboard 支持并行跑多版本实验（换 Embedding 模型、改 Prompt 模板后对比三元组各项得分），数据驱动选最优版本。对 LangChain/LangGraph 和 LlamaIndex 集成好；适合评估复杂智能体、「不仅关心输出是否好，更关心流程中哪里出错」的场景。' },
      { name: 'RAGAS：RAG 首选，无参考答案评估 ★', note: '专为 RAG 设计的开源轻量评估框架，核心优势是指标设计非常贴合 RAG 运作机理，支持 Faithfulness、Answer Relevancy、Context Precision、Context Recall、Answer Correctness；核心工作原理就是 LLM-as-a-Judge。最大亮点：支持无参考答案评估（Reference-free）——真实业务中很多问题（如「这个合同条款有什么风险？」）很难提前写出唯一标准答案，Faithfulness、Context Precision 等指标不需要标准答案，只要「问题 + 检索到的上下文 + 模型生成的回答」即可自动打分，极大降低评测门槛。独立评估库，不强绑定 RAG 开发框架：LangChain、LlamaIndex、手写管道都能直接接入。作者定位（标题即「RAG 首选」）：无需依赖 Ground Truth（也可以依赖），适合评估纯 RAG 系统。', tags: ['必记'] },
      { name: 'DeepEval：像写单测一样测 LLM，进 CI/CD', note: '设计理念像 Pytest 等单元测试框架，主张用写代码测试用例的方式测试 LLM，适合集成到企业 CI/CD 流程防止模型上线后质量回退。内置 30+ 种标准化指标：RAG 常用指标之外，还涵盖安全性检测（毒性、偏见、PII 隐私泄露）、格式验证（JSON 正确性）、Agent 指标（任务完成度、工具使用正确率）。工程化落地强：支持本地化部署确保敏感数据不出境，支持异步处理和分布式评测，适合企业级大规模高并发评测；内置红队测试，用多种攻击增强策略主动挖掘安全漏洞。' },
      { name: 'Phoenix：生产监控 + 告警根因 + 数据闭环', note: '集离线评测与应用可观测性于一身。生产级监控：除检索与生成质量评估外，实时监控线上效果指标（幻觉率、用户满意度）和系统指标（P99 延迟、Token 消耗成本）。告警与根因分析：幻觉率飙升或延迟超标触发告警，可通过用户反馈（点「踩」的回答）快速定位完整执行链路，排查是知识库更新导致还是模型接口瓶颈。数据闭环：把生产环境发现的坏案例（Bad Cases）直接转化为测试数据集，用于下一轮优化，形成持续迭代闭环。（原文该节有一条 bullet 在 markdown 中为空。）' }
    ]
  },

  'd0105': {
    note: '基于 ragas 0.4.3 逐个演示五大指标的计算原理与代码：Context Precision（Precision@k 加权平均）、Context Recall（参考答案声明支持率）、Answer Relevancy（反向重构问题 + 向量相似度）、Faithfulness（回答声明支持率）、Answer Correctness（语义相似度 + 事实 F1 加权）。',
    tags: ['已精读', 'RAG评测', 'RAGAS'],
    kids: [
      { name: '版本与裁判模型坑：锁定 ragas 0.4.3 ★', note: '作者强调（原文下划线）：演示基于 ragas 0.4.3，「低了肯定不行，高了也不一定」，ragas 版本变化比较大，网上示例包括直接让 AI 写的代码在这个版本下基本都跑不通，必须和作者版本保持一致。裁判模型建议 qwen3.6-plus：作者实测 qwen3.7-max 效果反而不如 qwen3.6-plus，具体原因不明（猜测刚出来；演示代码里用的仍是 qwen3.7-max）。环境：uv init ragas_demo + uv venv；.env 配 OPENAI_API_KEY 与 OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1；依赖 ragas>=0.4.3、openai>=1.0.0、langchain / langchain-openai / langchain-community 均 <0.1.0、datasets>=2.0.0、python-dotenv>=1.0.0。', tags: ['必记'] },
      { name: '评估流程：四输入 + 三引擎，输出 0–1 分', note: '输入四要素：Question（user_input）、Answer（response）、Context（retrieved_contexts）、Ground Truth（reference）。评估处理引擎：LLM 做语义分析和相关性判断，Embedding 做文本向量化和相似度计算，计算引擎执行 MAP 计算、F1 分数统计等数学度量；输出多维度评分，通常 0 到 1 之间（流程图在截图里）。代码模式：llm_factory 创建 LLM，从 ragas.metrics.collections 取指标评分器，await scorer.ascore(...) 异步打分。篇末「指标依赖对比」小节在 markdown 中为空（表格疑在截图里）；各指标实际输入依赖可见本批《评测脚本准备 & 开始运行评测》的 ascore 调用。' },
      { name: 'Context Precision：Precision@k 加权平均，排序敏感', note: '评估检索内容里有多少真正相关、且相关内容是否排在前面。核心计算逻辑是 Precision@k 的加权平均（完整公式在配图里，正文给出符号定义与算例）：K = 检索上下文总数（retrieved_contexts 列表长度）；Vk = 第 k 个位置的相关性标志，相关 Vk=1、不相关 Vk=0，由 LLM 评判。算例：问「杭州西湖有哪些著名景点」，3 条相关 + 1 条干扰（北京故宫）：相关排前时分子 (1.0×1)+(1.0×1)+(1.0×1)+(0.75×0)=3.0，得分趋近 1（实测 0.99999999995）——不会恰好等于 1，因为打分 LLM 的「幻觉」或严苛判断可能觉得某句没完整回答「有哪些」而稍微扣分；把干扰项换到第一位，得分掉到约 0.64（实测 0.6388888888675925）。同一批资料仅排序不同，分数差异巨大。' },
      { name: 'Context Recall 与 Faithfulness：方向相反的两个声明支持率', note: 'Context Recall = 参考答案中能被检索上下文支持的声明数量 / 参考答案中的总声明数量，关注「不要遗漏重要结果」。LLM 先把 Reference 拆成若干独立、不可再分的客观事实「声明」（Claims），再逐条到检索上下文中找证据：能推断出来标 Attributed（支持），找不到标 Not Attributed，支持数/总数即得分（0–1）。ragas 还提供 BLEU/ROUGE 字符串比较、文档 ID 重合度等方式，重点是基于 LLM 的。算例：标准答案拆出 3 个声明全部被支持 → 1.0；标准答案加入「三潭映月」（上下文里没有）→ 0.8。Faithfulness 方向相反：拆的是 Response 而非 Reference，忠实度得分 = 回答中能被检索上下文支持的声明数量 / 回答中的总声明数量。算例：回答「爱因斯坦 1879 年 3 月 20 日在德国出生」，上下文写 born 14 March 1879 → 日期声明不被支持，得分 0.5。' },
      { name: 'Answer Relevancy 反向重构 与 Answer Correctness 加权 F1', note: 'Answer Relevancy 用「反向重构」：如果回答高质量且相关，一定能根据回答反推出用户原问题。LLM 根据 response 反向生成 N 个可能的用户问题，计算它们与原始问题的语义相似度（需 Embedding，演示用 text-embedding-v4），取平均即得分，全程无需 Ground Truth。算例：「法国在哪里？首都是什么？」答「法国在西欧，首都是巴黎」→ 0.957；答「法国的著名作家是雨果」→ 0.568。实测分数不固定（有时 0.9xx 有时 0.7xx），主因模型幻觉，可在 llm_factory 传 temperature=0.1、seed=42 抑制。Answer Correctness = 语义相似度 + 事实正确性（F1）的加权平均：F1 Score = |TP| / (|TP| + 0.5 × (|FP| + |FN|))；TP = 标准答案和生成答案中都存在的事实，FP = 仅生成答案有（多出/编造），FN = 仅标准答案有（缺失）；weights 参数调两维权重，分数 0–1，可设 threshold 把分数二值化（达标 1、未达标 0）。算例：答「1879 年出生在西班牙」vs 标准「1879 年出生在德国」→ 0.586。' }
    ]
  },

  'd0106': {
    note: 'answer_relevancy 偶发反直觉打分（不完整答案反而比完整答案分高）：根因是「反向生成变体问题 + 平均余弦相似度」机制叠加裁判模型随机性；对策四类——上测试集、换更强裁判模型（人工打标兜底）、多次评估取平均、temperature=0 + seed 固定。',
    tags: ['已精读', 'RAG评测', 'RAGAS'],
    kids: [
      { name: '反直觉现象与指标机制', note: '「法国在西欧,首都是巴黎」理论上应比「法国在西欧」分高（后者缺失首都这一关键信息），但实测偶尔相反。机制：Answer Relevancy 依赖 LLM 为答案逆向生成多个「变体问题」，再计算变体问题与用户原始问题的平均余弦相似度——分数取决于裁判模型的语义判断，并不直接比较答案完整性。' },
      { name: '三个原因（原文标注重要性从高到低）★', note: '① 短文本语义向量拉不开：两个答案核心语义都集中在「法国」「西欧」等关键词，多出「首都是巴黎」几个字不足以在多维向量空间彻底拉开距离；逆向生成的「法国在哪里？首都是哪里？」与「法国在哪里？」和原问题的余弦相似度也非常接近。② 指标侧重「回答是否切题」而非「回答是否完整」：只要不偏题、没说无关废话就能拿很高基础分，「法国在西欧」不完整但完全没偏题，所以基准分极高。③ 裁判模型自身幻觉/不稳定：LLM 本质是按概率预测下一个词，裁判状态波动时逆向问题质量参差不齐，评分违背直觉。', tags: ['必记'] },
      { name: '数据与模型侧对策：测试集 + 更强裁判 + 人工兜底 ★', note: '单问题小样本的单次评估极易受偶然因素干扰，实际评测用测试集（少则几十、多则数百个问题），数据多样性增加可稀释单个极端 case 的极端分数；也可把对照 case 换成完全偏题的答案（「法国的著名作家是雨果」）拉开差距。裁判模型一般参数量更大效果更好、闭源可能比开源好（GPT-4 不行换 GPT-5）；少见反例：qwen3.7-max 评测效果反而不如 qwen3.6-plus——这时靠人工评估（标注）兜底（原文加粗），打标选出合适模型；一般在大厂中会用经过微调的专门裁判模型来做评测（原文加粗）。', tags: ['必记'] },
      { name: '参数与重复评估对策：temperature=0 + seed=42', note: '单次评估有随机性：可对同一组数据多次重复评估，取各项指标平均值作最终得分，大幅降低波动；也可结合多模型多次评估，再投票或取平均。最直接的参数手段：把裁判 LLM 的温度严格设为 0 消除生成随机性，固定 seed=42 实现可复现输出（llm_factory 传 temperature=0, seed=42）。作者对之前的 case 实测有效：「设置了这两个参数以后，确实结果会更加稳定了」。（上一篇演示用 temperature=0.1，本篇建议严格设 0。）' }
    ]
  },

  // ---------- 评测数据集 ----------
  'd0107': {
    note: '原文未能读取（近乎空文档）：正文仅一句「标准答案（作为评估基准的groud truth）。」，无任何展开内容，疑为占位或未完成，无法提炼核心点。',
    tags: ['待补']
  },

  'd0108': {
    note: '好评测集 = 给系统准备的高质量「期末考卷」，四个核心特征：题型丰富、严格贴合业务、高质量 Ground Truth（必须人工审核）、能支撑检索与生成多维度指标评估。',
    tags: ['已精读', 'RAG评测', '评测数据集'],
    kids: [
      { name: '题型丰富：不能全是关键词查找题', note: '全是「某公司的年假是多少天」这种简单关键词查找题，系统容易拿高分但完全无法反映真实业务复杂情况。应包含不同难度和意图：多跳推理问题——答案需跨越多个文档片段综合归纳（如「对比 A 产品和 B 产品在保修政策上的区别」）；模糊或对抗性提问——表述不清、或故意问文档里没有的内容，测试系统是否幻觉（胡编乱造）、能否优雅回答「我不知道」；长文本/综合类问题——需要对大段上下文深度总结提炼。（原文该节第一条 bullet 在 markdown 中为空，简单题型的举例疑缺失。）' },
      { name: '严格贴合业务，公开通用集往往偏题', note: '直接用网上公开通用评测集（HotpotQA、Natural Questions 等）往往效果不佳，因为它们和业务文档风马牛不相及。真实场景化：必须基于自己真实的知识文档生成，问题和答案措辞符合所在行业（金融、医疗、法律或企业内部 IT）的专业术语和表达习惯。与业务目标对齐：客服场景重点考察回复的准确性和礼貌性；科研辅助重点考察信息的全面性和深度。' },
      { name: '高质量 Ground Truth：人工审核必不可少 ★', note: '评测集的「真实答案」是阅卷的标尺，「如果标尺本身是歪的，评测结果就毫无意义」。无论是 LLM 自动生成还是 RAGAS 工具跑出来的 QA 对，必须（原文加粗）经过领域专家或熟悉业务的人员人工抽查和校准，确保每一个真实答案精准、无歧义且完全正确。', tags: ['必记'] },
      { name: '支撑多维度指标评估的完整输入', note: '好评测集不仅要测出「系统回答得对不对」，还要能诊断「到底哪个环节出了问题」：应支撑检索和生成多个阶段的评估，意味着要包含足够输入给到 LLM——用户问题、AI 回答、参考答案以及参考资料等。' }
    ]
  },

  'd0109': {
    note: '原文是对「基于文档生成评测数据集」运行日志的逐条解读（无代码、无参数配置）：标题提取/切分 → 摘要 → 节点过滤 → 向量化 → 主题/实体提取 → 相似度构建 → 用户画像/场景/样本生成。组件名与 RAGAS 测试集生成流水线一致（推断，原文未直接点名框架）。',
    tags: ['已精读', 'RAG评测', '评测数据集'],
    kids: [
      { name: '文档理解与过滤：五个 Extractor', note: 'HeadlinesExtractor（提取标题）& HeadlineSplitter（按标题切分）：通读 Markdown 文件，识别各级标题，理清文档整体骨架；SummaryExtractor（提取摘要）：对各部分总结概括，供后续基于摘要设计问题；CustomNodeFilter（节点过滤）：筛选最有价值、信息密度最高的文本片段（Nodes），剔除无关紧要内容；EmbeddingExtractor（向量化）：把筛选出的片段转成数学向量，方便后续评估检索准确度；ThemesExtractor（提取主题）& NERExtractor（提取命名实体）：分析核心话题与专有名词（人名、产品名、地名等）。' },
      { name: '关联构建与样本生成：Builder + 三步 Generation', note: 'CosineSimilarityBuilder & OverlapScoreBuilder：计算各文本片段之间的相似度与重叠度，为生成需要跨段落推理的复杂问题建立关联。Generating personas（生成用户画像）：虚拟不同类型提问者角色（「新手小白」「资深专家」），让问题更贴近真实用户提问习惯；Generating Scenarios（生成应用场景）：结合提取的知识点和用户画像构思具体提问背景；Generating Samples（生成最终样本）：综合以上所有信息生成高质量测试数据。' }
    ]
  },

  'd0110': {
    note: '纯代码篇（Java，无正文讲解）：DatasetController 提供 GET /dataset/generate，复用生产 RAG 流式对话流程为评测问题生成回答，输出 question / answer / references 三元组 JSON——保证评的是真实系统链路。',
    tags: ['已精读', 'RAG评测', '评测数据集'],
    kids: [
      { name: '接口设计：复用真实 RAG 管道生成答案', note: '@RestController + @RequestMapping("/dataset")，GET /generate?question=…。固定用户 DATASET_USER_ID="dataset-generator"；临时会话标题取问题前 20 字符（TITLE_MAX_LENGTH=20）。流程：创建临时会话 → 保存用户消息与 assistant 消息 → 意图识别 → 构造 ChatParam（仅依赖用户问题，其他业务字段置空）→ 调 chatApplicationService.doChat 走流式对话。评测答案由生产同一条 RAG 链路生成，而非另起简化流程。' },
      { name: '答案收集：过滤控制事件，引用从库里取', note: 'doOnNext 逐事件收集回答 token 到 StringBuilder，blockLast() 等流结束；isAnswerToken 过滤以 [PROGRESS]、[REFERENCE]、[CARD_、[DONE] 开头的事件，只保留最终答案文本。参考资料不从流事件拿，而是查库：chatMessageService.getByMessageId(assistantMessageId).getRagReferences() 取每条 RagReference 的 chunkContent 组成列表——即评测要的 retrieved_contexts。' },
      { name: '输出结构与依赖组件', note: 'DatasetResult{question, answer, references(List<String>)}，正好对应评测三要素「问题-回答-检索资料」。意图识别 IntentRecognitionService 用 LangChain4J 的 AiServices.builder 构建，chatMemoryProvider 用 MessageWindowChatMemory.builder().maxMessages(10)。该接口即下一篇脚本调用的 /dataset/generate（端口 8009）。以上要点从代码与注释读出，原文无正文解释。' }
    ]
  },

  'd0111': {
    note: '纯代码篇（Python，无正文讲解）：用 15 条人工编写的「问题 + 标准答案」QA 对（智界 R7 汽车知识库）逐条调本地 http://localhost:8009/dataset/generate，收集 RAG 回答与参考资料，写成四列 CSV 评测集 generated_dataset.csv。',
    tags: ['已精读', 'RAG评测', '评测数据集'],
    kids: [
      { name: '评测集构成：15 条人工 QA 对', note: 'qa_pairs 每条含 question + reference（人工写的标准答案全文），主题覆盖智界 R7：性价比、超级桌面开启、手机/手表车钥匙、小艺自定义唤醒词、行车记录仪查看导出、内置 ETC 开通、迎宾模式、维修保养与改装保修、客服电话、自定义壁纸等。其中「没带钥匙，如何启动车辆？」的 reference 为字符串 "null"——一条没有标准答案的样本。' },
      { name: '问题样本含口语化/英文/错别字变体', note: '同一行车记录仪知识点写了 3 种问法：规范问法、「平时怎么调出来看啊？想导出来又该咋整？」口语问法、「支持直接发到手机上吗？还是必须得拔卡用电脑读？」侧面问法，reference 相同；另有英文问题 "Does the Luxeed R7 have a welcome mode?"（reference 仍为中文）和错别字问题「智届R7客服电话多少？」。这些变体客观上覆盖改写、跨语言、错别字场景（由样本内容归纳，原文未单独说明设计意图）。' },
      { name: '脚本流程与 CSV 四列格式', note: 'urllib.parse.quote 对问题 URL 编码防特殊字符导致请求失败；requests.get 调接口，raise_for_status() 非 200 抛异常；answer 取 data["answer"]，references 列表用 "\\n\\n".join 拼成一个长字符串存入单格；csv.DictWriter 写 generated_dataset.csv，表头固定四列 user_input / response / retrieved_contexts / reference，编码 utf-8-sig；单条失败只打印错误不中断整批。这四列正是下一篇评测脚本的输入格式。' }
    ]
  },

  // ---------- 评测执行 ----------
  'd0112': {
    note: '完整 eval.py：用 ragas 五大指标并发评测 generated_dataset.csv，输出 evaluation_results.csv；裁判 qwen3.6-plus 配 temperature=0、seed=42、关闭思考、max_tokens=10240；最大的坑是思考模式吃掉 token 导致评估输出被截断。',
    tags: ['已精读', 'RAG评测', 'RAGAS'],
    kids: [
      { name: '裁判模型与 Embedding 配置', note: 'eval_llm = llm_factory("qwen3.6-plus", client=openai_client, temperature=0, seed=42, extra_body={"chat_template_kwargs": {"enable_thinking": False}}, max_tokens=10240)：温度 0 + 固定种子保证稳定可复现，关闭思考模式避免 token 超限，max_tokens 放宽到 10240。embeddings = embedding_factory("openai", model="text-embedding-v4", client=openai_client)，Answer Relevancy 与 Answer Correctness 需要向量相似度。五个评分器均取自 ragas.metrics.collections。' },
      { name: '五大指标的输入依赖（代码级对照）', note: 'ascore 调用给出明确依赖：ContextPrecision 与 ContextRecall 需 user_input + reference + retrieved_contexts；AnswerRelevancy 只需 user_input + response；Faithfulness 需 user_input + response + retrieved_contexts；AnswerCorrectness 需 user_input + response + reference。这正好补上《RAGAS 框架初探》篇末缺失的「指标依赖对比」表：检索侧两指标靠 reference，生成侧 Faithfulness 靠 contexts，Answer Relevancy 谁都不靠。' },
      { name: 'CSV 解析与两级并发', note: 'retrieved_contexts 在 CSV 里是用 "\\n\\n" 拼接的长字符串：先判空/NaN（pd.isna）防报错置 []，再 split(\'\\n\\n\')、逐段 strip 并过滤空串还原成列表。并发两级：单行内 asyncio.gather 同时跑五个指标的 ascore；main 里对所有行再 gather 批量并发。注释提醒：可根据 API QPS 限制调整并发数量（例如用 asyncio.Semaphore）。失败行返回 None 并被过滤。输入 generated_dataset.csv（utf-8 读），输出 evaluation_results.csv（utf-8-sig 写），列为 user_input + 五个指标分；uv run eval.py 运行，输入文件须在脚本同级目录。' },
      { name: '坑：max_tokens 截断，思考模式是元凶 ★', note: '报错 "The output is incomplete due to a max_tokens length limit"（finish_reason=\'length\'）：模型生成评估结果时达到 max_tokens 上限被强制截断。原文错误示例：qwen3.7-max 做 Faithfulness 评估开着思考，reasoning_tokens=8844、completion_tokens=11928、total_tokens=20406，大量 token 耗在思考上。修复两步：先关思考（示例传 extra_body={"enable_thinking": False}）→ reasoning_tokens 降为 0，但仍报错（completion_tokens=2048 仍被截断）；再把 max_tokens 加大到 10240。注意原文关闭思考的传参写法前后不一（extra_body 直传 enable_thinking / 顶层 chat_template_kwargs / 主脚本 extra_body 嵌套 chat_template_kwargs 三种都出现过），主脚本最终用 extra_body={"chat_template_kwargs": {"enable_thinking": False}}。', tags: ['必记'] },
      { name: '裁判严苛性误判实例（来自报错日志）', note: '报错日志里裁判对 24 条 statement 全部给 verdict 0：理由是上下文没有出现「智界R7」「原厂配件」「保修」等实体，按「能否直接从上下文推断」的严格标准，即使语义接近也判不支持（如上下文说「磨损的制动衬片」、陈述说「不符合规格的制动衬片」，判 0；上下文有「更换指定规格车轮否则影响胎压监测」但因未提「智界R7」仍判 0）。说明 Faithfulness 裁判存在实体级严格匹配倾向，上下文缺少显式实体时可能系统性打低分。（该例出自原文粘贴的失败日志，作者未单独展开点评。）' }
    ]
  },

  'd0113': {
    note: '原文正文极短，只给一个加速要点：批量并发调度——asyncio.gather 让成百上千条数据同时向 API 发起评测请求，把线性排队等待压缩到极限。',
    tags: ['已精读', 'RAG评测', 'RAGAS'],
    kids: [
      { name: '批量并发调度 ★', note: '在 main() 中用列表推导式创建所有评测任务，await asyncio.gather(*tasks) 同时并发执行：成百上千条数据的评测同时向 API 发起请求，而不是排队等待，「将原本线性的等待时间压缩到了极限」。与《评测脚本准备 & 开始运行评测》中两级 gather 的写法对应。原文仅此一个要点（加粗），未给出其他加速手段、代码或并发上限建议。', tags: ['必记'] }
    ]
  }
});