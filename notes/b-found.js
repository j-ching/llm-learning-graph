/* b-found「00 开篇与基础认知」分支精读笔记（12 篇：11 篇正文精读 + 1 篇重复件）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- 行业与岗位 ----------
  'd0001': {
    note: '开篇行业分析：大模型应用开发岗位多、薪资高，AI 能力已成普通研发岗的必备项；Java 在大模型岗位需求中排第三，仅次于算法工程师和产品经理。',
    tags: ['已精读', '行业认知'],
    kids: [
      { name: '岗位结构：工程岗是主力，AI 成普通研发必备项', note: '除算法岗外，还有大量 AI Agent 开发工程师、大模型应用开发工程师等工程岗位，本质是后端岗，职责是用 AI 技术做应用开发。作者强调：不想找 AI 岗位也不能不学 AI——无论大厂中小厂、校招社招，普通研发岗对 AI 能力的要求已像分布式、MySQL 等基础技能一样成为必备项；面试常问是否做过 AI 相关工作、是否用过 AI Coding 工具。' },
      { name: '语言格局：Python 最多，Java 第二 ★', note: 'AI 开发领域 Python 岗位最多（机器学习/算法方向多年积累）。但占比最多的岗位要求是「Python 和 Java 熟悉一个就行」，也有专门招 Java 做 AI 开发的岗位。作者判断：编程语言只是工具，Java 在 AI 方向机会很多，「除了 Python，可能 Java 就是排第二的」。脉脉《大模型人才报告》（2024 版）统计：大模型相关岗位招聘排名第三的是 Java，仅次于算法工程师和产品经理（原文加粗强调）。', tags: ['必记'] },
      { name: '两份行业报告：薪资、年限、学历门槛', note: '中关村智用人工智能研究院《大模型人才发展报告》：薪资普遍在 40–60，20–40 占比也较高（原文未标注单位）；工作年限要求不高，大部分 1–5 年，应届生占比不算少，大部分要求本科即可。脉脉《大模型人才报告》为 2024 年数据（2025 版未出），作者认为差别不大。作者总结（原文加粗）：大模型应用开发薪资高、岗位多，除算法岗外学历要求不特别高，Java 占比非常高，「绝对有搞头」。' }
    ]
  },

  // ---------- 大模型基础 ----------
  'd0002': {
    note: '大模型一般指 LLM（Large Language Model）：用于自然语言任务的深度学习模型，基于海量文本训练、能理解和生成人类语言；与传统「小模型」的差异在参数、数据、算力三个「大」。',
    tags: ['已精读', '大模型基础'],
    kids: [
      { name: '定义与边界：LLM 与小模型', note: 'ChatGPT、DeepSeek、通义千问都是 LLM。本质是「用于做和自然语言相关任务的深度学习模型」，基于海量文本数据训练。大模型出现后，以前的专业模型（搜索、广告、营销、OCR 等）被称为小模型/专业模型——差异主要在「大」。' },
      { name: '「大」的三层含义：参数、数据、算力 ★', note: '作者称参数量是「大」最直接、最核心的含义：参数是训练中学到的知识/规则的内部表示，参数越多能存储和表达的信息越复杂精细；模型名 xxB 即 Billion，如 Qwen3-72B 是 720 亿参数、LLaMA2-13B。训练数据量大：海量多样化文本与代码（网页、书籍、文章、代码仓库、对话记录），TB 甚至 PB 级，原文以 GPT-3 训练集 WebText2 含数百 GB 文本为例。算力需求大：训练需成千上万块高性能 GPU（NVIDIA A100/H100）或 TPU 组成的集群，运行数周甚至数月——这是「显卡贵了、英伟达股价涨了」的背景。', tags: ['必记'] },
      { name: '参数 vs 训练数据：材料 vs 能力', note: '训练数据是外部学习材料，参数是内化后的规则与能力。作者类比：背了 100 首唐诗（训练数据），脑子里存的不是这 100 首诗的复印件，而是学会了押韵、对仗、意境表达（参数）。' },
      { name: '数据耗尽与合成数据方向', note: '原文引用研究：2026 年后可能没有高质量数据可用于训练。应对方向是合成数据——把模型自己生成的文本、代码、问答、推理过程反过来作为训练数据，扩充样本规模、强化推理与任务泛化能力。作者判断：大模型进化重点正从「有没有更多数据」转向「如何更高效地利用和生成数据」。' }
    ]
  },

  'd0003': {
    note: 'LLM 的核心任务是「给定上下文，猜下一个最可能出现的词」：训练是海量完形填空式练习，生成是按概率猜词的循环；Transformer 用自注意力取代 RNN 的顺序阅读，成为 GPT/BERT/T5 的基石。',
    tags: ['已精读', '大模型基础'],
    kids: [
      { name: '本质：猜下一个词 + 完形填空式训练 ★', note: '作者称之为「LLM 最核心、最基础的任务」：输入「Hollis是个好」，模型给出「人/东西/家伙/男人」等候选词及概率。训练方式：吞下 TB–PB 级文本，不是去「理解」，而是寻找词语搭配模式和统计规律；随机截取句子、遮住一个词（[MASK]）让它猜，揭晓答案后调整参数和权重，在超级计算机上重复亿万次、历时数天到数月，逐渐学会特定上下文里哪些词常一起出现。', tags: ['必记'] },
      { name: '生成循环：按概率采样，不是永远选最高', note: '以 Prompt 为初始上下文 → 计算所有候选下一个词的概率 → 按概率随机选一个（不是永远选概率最高的词，那样太死板；可用 temperature 参数控制随机性）→ 把选中的词追加进上下文 → 继续猜下一个词，循环直到生成完整句子或达到长度限制。猜词看的是整句上下文而非只看前一个词：「苹果很好吃」vs「苹果发布了新手机」，自注意力能分辨两个「苹果」分别是水果和公司。' },
      { name: 'Transformer 取代 RNN：并行 + 长距离依赖', note: '2017 年 Google 论文《Attention Is All You Need》提出 Transformer，被称为大语言模型的开山之作；GPT（Generative Pre-trained Transformer）的 T 就是它，最初为提升翻译质量而设计。前身 RNN 逐词顺序阅读：读长文容易忘开头（长期依赖问题），且只能按顺序读、难以并行。Transformer 一眼扫过整段话，同时分析每个词与其他所有词的关系，不按顺序读，可并行计算、适合 GPU 训练。' },
      { name: '自注意力：给词间关系打分，多头多视角', note: '对句子里每个词问「其他所有词对我理解这个词有多重要」，并打重要性分数。例：「亮哥不仅出了个八股文，他还出了新的项目课，它一定能大卖」，处理「它」时「八股文」「项目课」分数很高，模型由此知道「它」指「项目课」。这个过程同时做多次、每次关注不同方面的关系（如一次关注「谁在做什么」、一次关注「描述了什么属性」），即多头注意力（Multi-Head Attention）。' },
      { name: 'Transformer 流程与四大优势', note: '每层流程：输入嵌入（词→数字向量）→ 位置编码（同时看所有词会丢失顺序，需补「座位号」，否则分不清「猫追老鼠」和「老鼠追猫」）→ 多头自注意力层 → 前馈神经网络层 → 残差连接 & 层归一化（Add & Norm，让训练更稳定），编码器层堆叠 12/24 层；解码器另有编码器-解码器注意力层，生成时回看编码器对输入的理解。四大优势：并行计算能力强、直接处理任意距离的长距离依赖、各类 NLP 任务效果大幅超越旧模型、成为几乎所有现代顶尖语言模型的基石（ChatGPT 的核心就是 Transformer 的解码器部分）。' }
    ]
  },

  'd0004': {
    note: 'LLM 擅长文本/代码/多模态任务，但有幻觉、不擅长精确计算、缺少实时性、私有知识盲区四大局限；应用开发的本质是拿模型当「大脑」、组装工具与知识库等「四肢」解决现实问题。',
    tags: ['已精读', '大模型基础'],
    kids: [
      { name: '擅长清单：擅长不等于完美', note: '文本理解与生成、机器翻译、信息提取、代码生成/调试/解释（GitHub Copilot、Cursor、Claude Code、Qoder、TRAE）、广泛知识问答、图像识别与生成（DALL·E、Stable Diffusion、NanoBanana）、语音识别与合成（Whisper、VALL-E）、视频生成（Sora）、非结构化文本转表格/JSON。作者提醒：这些方向都存在共性问题，擅长不代表完美。' },
      { name: '幻觉与精确计算：根因都是猜词', note: '幻觉：LLM 本质是根据上一个词预测下一个词，只输出概率高的字，本身不知道内容对不对，缺乏事实保障机制——让它写「基于中医理论实现星际穿行的论文」也会一本正经写很多；所以产品都提示「AI 生成内容仅供参考，注意核查」。不擅长精确计算：问「3.9 和 3.11 哪个大」很多模型答错，因为它不具备数值计算能力，只是基于海量训练做文字预测。' },
      { name: '实时性与知识边界：训练截止 + 私有数据没见过', note: '知识有滞后：作者 2025 年 10 月问 ChatGPT，其训练数据只到 2024 年 6 月，之后的事不知道（例：2025-10-18 杨振宁逝世的消息）；ChatGPT 能答是因为用了网页检索工具，关闭 DeepSeek 联网功能就答不出。知识局限性：训练集只覆盖公开数据，公司内部规章制度、产品文档、内部代码等非公网资料模型从未见过。' },
      { name: '解决方案路线与课程核心判断 ★', note: '对应技术方案即课程主线：提示词工程、RAG、MCP、Function Call、微调等；性能、算力要求高等其他问题正在逐步解决，原文不展开。作者核心判断（原文加粗）：「大模型应用开发的本质，其实就是借助大模型这个『大脑』搭积木，组装『四肢』（工具、知识库等），解决现实世界的问题。」', tags: ['必记'] }
    ]
  },

  'd0005': {
    note: '环境与代码第一课：用 UV 搭 Python 环境，再用 OpenAI SDK 的兼容模式接百炼 DashScope 调 qwen-plus，跑通 LLM HelloWorld。',
    tags: ['已精读', '环境搭建'],
    kids: [
      { name: 'UV：Rust 写的 Python 包与项目管理工具', note: '速度比 pip 快 10–100 倍，一个工具替代 pip、pip-tools、pipx、poetry、pyenv、virtualenv；支持 Python 版本管理、直接运行/安装 Python 应用、提供 pip 兼容接口、跨平台 macOS/Linux/Windows。安装：macOS/Linux 用 curl -LsSf https://astral.sh/uv/install.sh | sh；Windows 用 powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.10.5/install.ps1 | iex"。提示 pip: command not found 时先自行安装 Python 环境；装完命令行输入 uv 验证。' },
      { name: '创建项目与虚拟环境', note: 'UV 创建项目会初始化文件结构（含 .python-version 等），创建虚拟环境会在项目目录下生成 .venv。激活：Linux/macOS 用 source .venv/bin/activate，Windows 用 .venv\\Scripts\\activate。注意：原文中创建项目与虚拟环境的具体命令在截图里，正文未给出命令文本。' },
      { name: 'HelloWorld：OpenAI 兼容模式接 DashScope', note: '用 openai 库的 OpenAI 客户端：api_key 填自己的 AK，base_url 设为 https://dashscope.aliyuncs.com/compatible-mode/v1，model="qwen-plus"，messages 传 system 与 user 两条角色消息，取 completion.choices[0].message.content 打印。提示缺少 openai 模块时先安装该模块。' },
      { name: '安装慢就换国内镜像 ★', note: '作者特别强调（原文加粗下划线）：安装过程很慢或卡住时，把 UV_INDEX_URL 改成国内镜像源，原文示例（阿里云服务器）：echo \'export UV_INDEX_URL="https://mirrors.aliyun.com/pypi/simple/"\' >> ~/.bashrc；其他系统可自行搜索「pip 加速」的配置方法。', tags: ['必记'] }
    ]
  },

  // ---------- 平台与部署 ----------
  'd0006': {
    note: 'Python 赢在模型训练与算法生态，Java 赢在企业级应用落地：国内企业应用多为 Java 构建，大模型落地是在存量系统上加 AI，而应用开发的主要工作内容恰是 Java 的强项。',
    tags: ['已精读', '技术选型'],
    kids: [
      { name: '分工：Python 做训练与 PoC，Java 做生产系统', note: 'Python 在模型训练、实验、快速构建 PoC 上有无可比拟的生态（PyTorch、TensorFlow、Hugging Face Transformers、LangChain、LlamaIndex）。但要把 LLM 能力集成到稳定、高性能、可扩展、易维护的企业级生产系统时，Java 凭借成熟的企业级生态、卓越的性能、坚如磐石的稳定性和强大的集成能力展现巨大优势（原文加粗强调）。' },
      { name: '现实：企业存量是 Java，框架已就绪 ★', note: '国内很多企业的 web 应用用 Java 构建，做大模型落地不可能完全重新开发一套，而是在原有 Java 应用基础上做 AI 尝试；Java 体系庞大，「在应用层的开发上有着绝对的优势」（原文加粗）。可用框架：Spring AI（Alibaba）、Langchain4j。在 Boss 上搜大模型应用开发工程师岗位，很多都要求 Java 背景。', tags: ['必记'] },
      { name: '工作内容决定语言优势', note: '作者指出：现在大模型应用开发的主要工作是 AI 模型对接、知识库搭建、提示词调优、Agent 开发，并不是模型开发及调优，很少涉及预训练，偶尔有些微调——从这些工作内容看，Java 反而更有优势。' }
    ]
  },

  'd0007': {
    note: '平台地图：官方模型站、HuggingFace/ModelScope 模型社区、Ollama 本地部署、百炼/硅基流动模型服务、Dify/n8n 等工作流平台、Coze 面向普通用户——定位各不相同。',
    tags: ['已精读', '平台工具'],
    kids: [
      { name: '模型社区：HuggingFace 与 ModelScope', note: 'ChatGPT、DeepSeek、通义千问可直接在官网使用。HuggingFace 像「AI 界的 GitHub」，是集模型库、数据集、协作工具与社区于一体的开源平台；国内存在无法访问、访问慢的问题，ModelScope（modelscope.cn）是阿里达摩院推出的国内大模型社区，功能与 HuggingFace 差不多。作者类比：HuggingFace 和 ModelScope 就像 GitHub 和 Gitee，是开源模型的汇聚地。' },
      { name: 'Ollama：CPU 也能跑量化模型', note: '轻量级开源的本地 LLM 服务框架，支持 Llama、Qwen、ChatGLM 等主流模型，提供命令行工具和 API 接口。关键特性：不强依赖 GPU，可基于 CPU 直接运行经过优化和量化的大模型，个人开发者在普通硬件上也能较低成本完成本地推理。' },
      { name: '百炼与硅基流动：一站式 vs 模型中介', note: '百炼（bailian.console.aliyun.com）= 大模型服务（百余款通义系列和国内优质开源第三方模型）+ 应用开发平台（MCP、智能体搭建、工作流等全链路工具），作者将其定位为 LLMaaS 一站式服务平台。硅基流动是 AI 模型能力提供商，可理解为「中介」，聚合了很多模型，通过 API 调用，好处是快速接入第三方模型并可无缝切换。' },
      { name: '工作流平台：Dify/n8n/FastGPT/RAGFlow', note: '都是知名的 RAG/LLM 工作流平台，可做 RAG 检索、搭 workflow；作者认为功能大差不差，AI 发展迅猛、工具之间互相「对齐」，差别真不太大。目前用得较多的是 Dify 和 n8n，很多公司内部工作流基于 Dify 搭建。取舍：n8n 的知识库能力比 Dify 稍弱，强项是流程编排。' },
      { name: 'Coze：面向普通用户，不开源', note: '字节推出的智能体搭建平台，受众不是开发者而是普通用户，可快速做小应用。两面性：低代码做得很好；但不是开源的，是字节的商业化产品。' }
    ]
  },

  'd0008': {
    note: '百炼 = 模型服务 + 应用开发的一站式平台；申请 API Key 后即可经 DashScope 兼容端点调 qwen-plus，注意 Coding Plan 的 Key 与 Base URL 和按量计费不互通。',
    tags: ['已精读', '平台工具'],
    kids: [
      { name: '一站式闭环：从模型到应用', note: '模型服务提供百余款通义系列和国内优质开源第三方模型，按文本/语音/视觉分入口，可直接体验、调用内置模型；工作台覆盖推理、微调、评测、部署、观测，形成「训练/微调 → 部署 → 使用 → 评测 → 观测」闭环。应用开发含工具、MCP、Agent、workflow，常用应用类型是 Agent（智能体应用）和 workflow（工作流应用）；另有 MCP 市场，官方 MCP 服务可直接用。作者评价：大大降低大模型应用开发门槛，模型对接/使用/训练/部署/评测/观测/应用开发全部集成。' },
      { name: '获取 API Key 与 curl 调用', note: '前往「我的 API-KEY」页面 → 单击创建我的 API-KEY → 在操作列单击查看获取；后续课程用 Spring AI 调百炼，这个 Key 是必须的。调用示例：curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions，Header 带 Authorization: Bearer $DASHSCOPE_API_KEY，body 指定 model: qwen-plus 与 messages。更换模型、流式输出、对话记忆等功能后续用 Spring AI 实现。' },
      { name: '坑：Windows curl 单引号 JSON 报错 ★', note: '报错 "Required body invalid, please check the request body format." 的常见原因：Windows 系统执行 curl 不支持用单引号包裹 JSON，导致请求体格式解析失败；改成双引号 + 转义即可解决。', tags: ['必记'] },
      { name: 'Coding Plan：更优惠但与按量计费不互通 ★', note: '百炼后来推出 Coding Plan 套餐，价格更优惠。作者特别提醒：除 API Key 获取路径不同外，base_url 也不同，代码中要一起改；Coding Plan 专属 API Key 和 Base URL 与百炼按量计费的（sk-xxxxx / https://dashscope.aliyuncs.com/xxxxxx）不互通，请勿混用。专属端点：OpenAI 兼容协议 https://coding.dashscope.aliyuncs.com/v1，Anthropic 兼容协议 https://coding.dashscope.aliyuncs.com/apps/anthropic。', tags: ['必记'] }
    ]
  },

  'd0009': {
    note: '大模型用法分两种：调别人部署好的 API，或自己部署；Ollama 让 CPU 也能低成本跑量化模型，pull + run 两条命令即可本地部署 deepseek-r1:7b，11434 端口对外提供 API。',
    tags: ['已精读', '平台工具'],
    kids: [
      { name: '定位：本地部署的轻量选择', note: '自己部署一般用显卡（如英伟达 A100）提供算力，但搞卡成本太高；对参数量不太大的模型，用自己的机器本地跑也可以。Ollama 不强依赖 GPU，可基于 CPU 直接运行经过优化和量化的大模型，个人开发者在普通硬件条件下也能较低成本完成本地推理；轻量级开源，支持 Llama、Qwen、ChatGLM 等，提供命令行与 API。' },
      { name: '安装与启动：11434 端口', note: '官方下载页 https://ollama.com/download；开源仓库 https://github.com/ollama/ollama，支持 Docker 一键部署：docker pull ollama/ollama 后 docker run -p 11434:11434 ollama/ollama；Linux 也可 curl -L https://ollama.ai/install.sh | bash。运行成功后本地打开 11434 端口。常用命令：serve/create/show/run/stop/pull/push/list/ps/cp/rm，ollama --version 查看版本与配置状态。' },
      { name: '部署 deepseek-r1:7b：pull → run → API', note: '到 https://ollama.com/library/deepseek-r1 可看到各参数量的版本，按硬件要求选择（原文硬件参考表在截图中）。ollama pull deepseek-r1:7b 拉取模型，ollama run deepseek-r1:7b 运行后即可在控制台对话；也可走 API：curl http://localhost:11434/api/generate -d {"model": "deepseek-r1:7b", "prompt": "你是谁?"}。' },
      { name: 'Web 访问与关闭 think', note: 'Web 端访问可用 OpenWebUI（github.com/open-webui/open-webui）或 Chrome 插件 PageAssist。deepseek R1 等模型默认 think，回答前先输出一堆思考内容，影响输出效率；可用 /set nothink 命令关闭思考模式。作者的取舍观点：R1 本来就是 think 模型，如果不想开启 think，「干脆直接用 deepseek-v3 就好了」。' }
    ]
  },

  // ---------- 课程元信息 ----------
  'd0010': {
    note: '课程更新记录表（非技术正文）：按时间倒序记录 2026-02-22 至 2026-06-27 每条更新的内容、时间、方式（视频/文档/代码），可用来追溯各主题的更新时间线与配套形式。',
    tags: ['已精读', '课程元信息'],
    kids: [
      { name: '表结构与时间范围', note: '三列：更新内容 / 更新时间 / 更新方式。条目从 2026-02-22（LangChain4J 中的 Modular RAG 支持）到 2026-06-27（接入登录、graph rag、text2cypher 等），新的在上、旧的在下。' },
      { name: '三种更新方式与 ✅ 标记', note: '更新方式分视频、文档、代码，也有「文档+视频」「文档+代码」组合；不少条目带 ✅ 前缀（原文未解释其含义）。同一主题常以视频、文档、代码成对或成组出现，如「AgentScope Java 进阶：Skill」既有视频又有文档。' },
      { name: '内容覆盖：可当课程索引使用', note: '覆盖 know-engine 知识库项目（MinerU 解析、文档切分、混合检索、BGE-ReRanker 重排序、RAGAS 评测、权限体系、多轮对话）、AgentScope Java 特性与进阶、微调与评测、Agent Skills、上下文工程、Harness/Loop Engineering、dodo-agent、PPT 生成智能体、DeepResearch、模拟面试与简历模板等。可用此表查某个主题何时更新、以什么形式配套。' }
    ]
  },

  'd0011': {
    note: 'Agent 开发不必纯手撸（手撸章节是为理解原理）：Python 侧有 LangChain/LangGraph、AutoGen、CrewAI；Java 侧 LangChain4j/Spring AI 只提供基础能力，Spring AI Alibaba 与 AgentScope 提供生产级 Agent 实现。',
    tags: ['已精读', 'Agent框架'],
    kids: [
      { name: 'LangChain & LangGraph：最流行的 LLM 应用框架', note: 'LangChain 简化基于 LLM 构建应用的过程，提供模块化、可组合的工具和抽象，把 LLM 与外部数据源、记忆机制、工具调用结合；内置 ReAct、Plan-and-Execute 等 Agent 架构开箱即用（示例：github.com/langchain-ai/langgraph/tree/main/examples）。LangGraph 是 LangChain 团队推出的库，用于构建状态化（stateful）、多参与者（multi-actor）、循环式（cyclic）智能体工作流，基于有向图模型、以声明式定义复杂执行流程，适合规划、反思、协作、人类干预等高级场景。' },
      { name: 'AutoGen & CrewAI：多智能体协作', note: 'AutoGen 是微软开源框架，简化构建多智能体系统和复杂 LLM 工作流，提供可组合、可对话的 Agent 抽象，让多个不同角色和能力的 Agent 对话协作完成任务。CrewAI 受 AutoGen 启发，核心理念是角色驱动（Role-Driven）的多智能体协作，API 更简洁、更高层次，适合「市场分析团队」「内容创作流水线」「软件开发小组」等场景。' },
      { name: 'LangChain4j & Spring AI：只有基础能力，Agent 要自己实现', note: '两者都没有直接提供 Agent 支持，只提供记忆、工具调用等 Agent 基本能力，需要自己通过底层 API 实现——课程中几个手撸 Agent 的实现就是用 Spring AI 做的。这是它们与下面两个框架的关键差别。' },
      { name: 'Spring AI Alibaba：生产级 ReactAgent', note: '提供基于 ReactAgent 的生产级 Agent 实现，可直接构建 agent，使用内置的模型、工具、记忆、钩子等能力；底层核心实现基于 Spring AI。其中 Model（大模型）作为 Agent 的大脑，负责推理、生成文本、决定下一步行动（是否调用工具/输出答案）。' },
      { name: 'AgentScope：阿里开源，比 Spring AI Alibaba 更强大', note: '与 Spring AI Alibaba 同为阿里开源，用于构建 LLM 驱动的应用，提供 ReAct 推理、工具调用、内存管理、多智能体协作；有 Java 版 AgentScope-Java（java.agentscope.io）。作者对比：功能比 Spring AI Alibaba 中的 agent 更强大，除钩子、工具、记忆外还集成长期记忆、多模态、结构化输出、MCP、RAG 等，是比较强大的生产级 AI 智能体构建工具。作者补充：它刚出来没多久（备课时还没推出），现在挺火、有很多落地应用，课程会找单独章节介绍。' }
    ]
  },

  'd0012': {
    note: '内容与《常用的 Agent 开发框架》一致，见该篇。',
    tags: ['重复件']
  }
});