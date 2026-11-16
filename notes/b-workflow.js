/* b-workflow「09 AI Workflow 与 Dify / N8N」分支精读笔记（19 篇，4 组）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 读取情况：19 篇全部读取成功，无权限失败。原文缺陷：
 *   - 《基于 Dify 实现 Ai Workflow》正文仅 331 字且与标题不符（只剩一句 Sectioning）；
 *   - 《Dify & N8N & Coze & FastGPT 对比》正文仅 347 字、只有一句结论，无对比内容；
 *   - 《Dify 进阶：插件开发》正文实为一份脱敏插件 PRD（代码块），无开发步骤；
 *   - 《微博内容提取》《数据保存与更新》原文仅代码（JS / SQL DDL），要点从代码读出；
 *   - 《整体流程》正文仅 767 字，流程图在截图里；多篇存在转换丢失的空 bullet。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ==================== g-wf-basic 概念辨析（4 篇） ====================
  'd0151': {
    note: 'AI Workflow 不是新发明：传统工作流（BPMN/activiti、审批流）由来已久，AI 工作流只是把 LLM 当作一个节点编排进预定义流程。作者加粗定义：「所谓的 AI 工作流，无非就是在传统的工作流引入了 LLM 的能力，把 LLM 当做其中的一个节点编排到流程中。」原文 1365 字，两张流程示例图。',
    tags: ['已精读', '概念', 'Workflow'],
    kids: [
      { name: '传统工作流：预定义 + 可视化编排，灵活性低', note: '工作流不是 AI 专有概念，审批就是典型工作流；以前对应 BPMN、activiti 等技术框架。本质是一系列预定义的、结构化的任务或步骤，按特定顺序执行，可含条件分支、并行处理、人工审批。特点：针对相对固定的流程做预定义、按规定步骤执行，配合可视化工具做可视化编排；缺点：提前预设好，灵活性较低、没啥自主性。' },
      { name: 'AI 工作流 = 传统工作流 + LLM 节点 ★', note: 'AI 时代工作流重新火起来，是因为构建智能体的典型方式之一就是工作流：完成一个工作时大模型调用只是其中一个步骤，前后还有其他事情要做，这些步骤流程固定就可以用工作流实现。作者加粗核心定义：AI 工作流就是在传统工作流中引入 LLM 能力，把 LLM 当作其中一个节点编排到流程中。', tags: ['必记'] },
      { name: '示例节点清单：移除 LLM 就是普通工作流', note: '原文示例工作流（截图）包含的节点类型：开始、条件分支、文档提取器、变量赋值、意图识别、LLM、回复。作者点破本质：如果移除其中的 LLM 节点，它其实就是个普通的工作流而已——这正是「AI 工作流 = 传统工作流 + LLM 节点」的直观验证。' }
    ]
  },

  'd0152': {
    note: 'Workflow 与 Agent 的权威判据来自 Anthropic《Building Effective Agents》：Workflow 是 LLM 和工具沿预定义代码路径编排的系统，Agent 是 LLM 动态决定自身流程与工具使用的系统；两者都属于更广义的 Agentic Systems。原文 2182 字，完整引用英文原文。',
    tags: ['已精读', '概念', 'Anthropic'],
    kids: [
      { name: 'Anthropic 判据：谁决定下一步 ★', note: '作者明确表示「比较认可 Anthropic 在《Building Effective Agents》中给出的说法」并全文引用：Workflows are systems where LLMs and tools are orchestrated through predefined code paths（LLM 与工具通过预定义代码路径编排）；Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks（LLM 动态主导自己的流程和工具使用，掌控完成任务的方式）。Anthropic 把各种变体统称为 agentic systems，但在架构上区分 workflow 与 agent。这是本分支「流程由谁决定」判据的出处。', tags: ['必记'] },
      { name: '两类 Agent 与作者结论：都是智能体系统的实现方式 ★', note: '按系统控制方式，Agent 分两类：Workflow Agent / 编排型智能体（即 AI Workflow）、Autonomous Agent / 自主型智能体。取舍：Workflow 确定性、可预测，适合结构化任务；Agent 自主、适应性强，适合开放性任务。作者加粗结论：不管 Workflow 还是 Agent，都是实现智能体系统的一种方式，只不过一种偏提前预定义好流程做编排，一种基于 LLM 做动态决策。两者都属于「利用 LLM 的推理能力来完成多步骤任务」的 Agentic Systems。', tags: ['必记'] }
    ]
  },

  'd0153': {
    note: 'Agentic Workflow（智能化工作流）概念较新、暂无精确定义，参考吴恩达演讲的四种设计模式：Planning / Tool Use / Reflection / Multiagent Collaboration。核心区别：流程由 LLM 实时生成而非人工预设。原文 2178 字；缺陷：中段 AI Workflow 与 Agentic Workflow 对比列表有多条空 bullet（小标题丢失），以下对比按剩余文字还原。',
    tags: ['已精读', '概念', 'AgenticWorkflow', '吴恩达'],
    kids: [
      { name: '吴恩达四模式：规划 / 工具 / 反思 / 多智能体协同', note: '原文引吴恩达演讲描述的 Agentic Workflow 四种模式（范式），各配一张图：① Planning（规划）——让 Agent 分解复杂任务并按计划执行；② Tool Use（工具）——LLM 生成代码、调用 API 等工具进行操作；③ Reflection（反思）——让 Agent 审视和修正自己生成的输出；④ Multiagent Collaboration（多智能体协同）——多个 Agent 扮演不同角色合作完成任务。作者判断：相比人工提前定义好的流程，Agentic 更看重 AI 的规划能力，流程由 LLM 实时生成，才能实现动态决策和自主优化。' },
      { name: 'AI Workflow vs Agentic Workflow：平台与框架分野', note: '原文对比列表有空 bullet、标签丢失，按剩余文字还原两侧：AI Workflow——预设的、线性的或简单分支的自动化流程，通常由 LLM 调用、工具执行、数据转换等步骤组成，可用 Dify、Coze 等 AI 工作流平台构建；Agentic Workflow——由具有目标导向、记忆、规划、反思、协作等能力的智能体（Agent）驱动的动态流程，具有适应性和自我演化能力，可用 LangGraph 这类框架支持（原文注明后面单独介绍 LangGraph）。执行判据：流程写死选平台，流程要模型实时生成选框架。' },
      { name: 'ReAct Agent 只是 Agentic Workflow 的子集', note: '原文「Agent VS Agentic Workflow」小节澄清：提到规划、反思、记忆，很多人会发现 ReAct Agent 也有类似概念，但两者不是一个层面的东西——ReAct Agent 只能算 Agentic Workflow 的一个子集，或者说其中某一个节点可以用 ReAct Agent 来实现而已。即 Agentic Workflow 是更大的流程范畴，ReAct 是其中一种节点实现。' }
    ]
  },

  'd0154': {
    note: '三个概念的一句话定义与包含关系：Agent 会用工具/记忆/规划，AI Workflow 是引入 LLM 节点的固定流程，Agentic Workflow 是关键步骤由 Agent 驱动的动态流程。作者加粗强调三者可以互相包含：AI Workflow 也可以是 Agent，Agentic Workflow 也是 Agent，Agent 可以用来构建 Agentic Workflow。原文 872 字，短小完整。',
    tags: ['已精读', '概念', '辨析'],
    kids: [
      { name: '三个一句话定义', note: 'Agent：基于 LLM，会用工具、能做记忆，有规划和行动能力的智能体。AI Workflow：在工作流中引入 LLM 节点，实现流程编排，流程实现固定的功能。Agentic Workflow：在工作流中引入 Agent，关键步骤由 Agent 驱动的一个动态工作流。' },
      { name: '包含关系：Workflow 也是实现 Agent 的一种方式 ★', note: '原文三处加粗判断：① AI Workflow 也可以是 Agent——如果一个工作流引入了 LLM 节点、提供了记忆能力、还能用上工具，那么它就是一个 Agent，所以工作流也是实现 Agent 的一种方式；② 同理 Agentic Workflow 也是 Agent；③ Agent 可以用来构建 Agentic Workflow——工作流中用到 Agent（单 Agent 或多 Agent），这个工作流就是 Agentic Workflow。执行视角：三者不是互斥分类，而是按「谁驱动流程」和「具备什么能力」互相嵌套。', tags: ['必记'] },
      { name: '取舍：确定性 vs 灵活性，兼得用 Agentic Workflow', note: '两侧都写清楚：Workflow 优势是确定性高，缺点是对复杂场景提前构造工作流比较复杂；Agent 优势是灵活性好，缺点是确定性可能没那么高。作者判断：没有好坏之分——步骤固定的场景用 Workflow 就够了，需要更多灵活性的场景 Agent 更好；想兼得，比较好的办法是用 Agentic Workflow，把 Workflow 和 Agent 结合起来用。' }
    ]
  },

  // ==================== g-wf-dify Dify（7 篇） ====================
  'd0155': {
    note: 'Dify 是开源 LLM 应用开发平台（内置数百模型支持、Prompt 编排、RAG 引擎、Agent 框架、流程编排 + 界面和 API），本地用 Docker 部署后接 Ollama 跑本地模型。关键坑：Docker 部署时 localhost 要换成 host.docker.internal；服务器部署要改 .env 里的 URL 配置。原文 3891 字；缺陷：部署步骤编号只有 1、3（第 2 步缺失），docker 启动命令与模型配置界面均在截图里，正文未给出；「Dify 能力」小节多条空 bullet。',
    tags: ['已精读', 'Dify', '部署', 'Ollama'],
    kids: [
      { name: '定位与本地部署：cp .env.example .env → localhost/install', note: 'Dify 内置构建 LLM 应用的关键技术栈：数百个模型支持、Prompt 编排界面、RAG 引擎、Agent 框架、灵活的流程编排，并提供易用界面和 API，省去重复造轮子。项目 github.com/langgenius/dify，教程 docs.dify.ai/zh-hans/introduction，在线版 cloud.dify.ai/apps。部署：下载项目 → 执行 cp .env.example .env → 启动后访问 http://localhost/install 初始化。注意原文步骤编号为 1、3，第 2 步（docker 启动）在截图中，正文未给出命令文本；模型配置一节也全是截图。附录给了 DSL 工作流模板库 github.com/svcvit/Awesome-Dify-Workflow。' },
      { name: '接 Ollama：host.docker.internal 替代 localhost ★', note: '启动 Ollama 后在 Dify 后台配置 Ollama 模型。作者特别提醒：因为 Dify 是用 Docker 部署的，localhost 需要使用 host.docker.internal 代替（容器内 localhost 指向容器自身，访问不到宿主机的 Ollama）。配套坑：配置 Ollama 本地模型后页面不显示模型列表，查 docker 日志报 dify runtime error: invalid memory address or nil pointer dereference，原文给了 CSDN 排查链接（blog.csdn.net/haosu123/article/details/149121351）。', tags: ['必记'] },
      { name: '两类应用：ChatFlow 面向对话，Workflow 面向自动化', note: '「Dify 能力」小节列表有空 bullet（分类名丢失），按剩余文字提炼：工具可扩展 LLM 能力（联网搜索、科学计算、绘制图片）；知识库支持多种数据源（文本、Notion 以及一些站点）。应用类型两种：ChatFlow 面向对话类情景——客户服务、语义搜索、以及其他需要在构建响应时进行多步逻辑的对话式应用；Workflow 面向自动化和批处理情景——高质量翻译、数据分析、内容生成、电子邮件自动化等。节点能力：代码节点、IF/ELSE 节点、模板转换、迭代节点等，提供定时和事件触发的能力。' },
      { name: '服务器部署坑：发布跳转默认 127.0.0.1，改 .env 八个 URL', note: '服务器部署（如 192.168.113.52）时，点击应用发布跳转默认跳到 127.0.0.1。解法：修改 docker 目录下 .env 并重启（sudo docker-compose up -d），把 CONSOLE_API_URL、CONSOLE_WEB_URL、SERVICE_API_URL、APP_WEB_URL、TRIGGER_URL、ENDPOINT_URL_TEMPLATE（http://IP/e/{hook_id}）、NEXT_PUBLIC_SOCKET_URL（ws://IP）全部指向服务器地址，另设 SSRF_PROXY_ALLOW_PRIVATE_IPS=192.168.113.0/24。原文 .env 示例中还含一个 sandbox auth token 明文，按规范不抄录。' }
    ]
  },

  'd0156': {
    note: 'Dify 工作流 11 个常用组件逐一说明：开始、LLM、条件分支、代码执行、HTTP 请求、问题分类器、直接回复、变量赋值、循环、知识检索、工具。编排方式是拖拽节点构建从用户输入到最终输出的完整流程。原文 5687 字；缺陷：「直接回复」「变量赋值」两个组件只有截图、无文字说明，不展开。',
    tags: ['已精读', 'Dify', '节点', '编排'],
    kids: [
      { name: '编排骨架：开始 / LLM / 条件分支', note: '① 开始：工作流入口节点，自动创建、必须要有，接收用户输入（文本、变量等），可在其中定义变量如 query、user_id。② LLM：调用大模型生成文本，可配置提示词（Prompt）、模型类型（qwen、Claude、本地模型等）、温度、开启记忆等参数，并支持配置失败重试、异常处理。③ 条件分支：类似编程 if-else，根据条件走不同路径，支持分别为 if 和 else 配置条件，条件类型包括字符串比较、数值比较、包含判断、为空判断等。' },
      { name: '数据与集成：代码执行 / HTTP 请求 / 循环', note: '④ 代码执行：运行自定义 Python 代码处理数据或调用外部服务，输入/输出变量可配置，支持标准库及部分第三方库（如 requests、json）。⑤ HTTP 请求：发送 GET/POST 请求，对接外部系统。⑨ 循环：对列表或数组迭代处理，里面可以配子工作流，循环可配置退出条件及循环内的变量。这三个节点对应「数据转换 + 外部集成 + 批量处理」，是工作流里除 LLM 外的工程能力。' },
      { name: 'AI 特有：问题分类器 / 知识检索 / 工具', note: '⑥ 问题分类器：本质是 LLM 节点 + 条件分支的组合，专门用作意图识别，可配置多个问题分类（意图），每个意图可单独配置后续流程。⑩ 知识检索：基于向量相似度从已上传的知识库检索相关文档片段，可在节点中配置指定知识库（RAG 的在线入口）。⑪ 工具：除节点外可单独配置工具，工具可以是插件、MCP、甚至是另外一个工作流。执行视角：问题分类器做路由、知识检索做 RAG、工具做能力扩展，三者是 Dify 区别于传统 BPM 工作流的核心。' }
    ]
  },

  'd0157': {
    note: '原文缺陷（标题与正文不符）：题为《基于 Dify 实现 Ai Workflow》，但正文仅 331 字，只有一句「分段 Sectioning：将任务分解为并行运行的独立子任务」，没有任何 Dify 实现步骤。该句疑似 Anthropic 工作流模式（并行化/分段）的残留片段，闪存转换出错。已完整读取，不存在漏读；Dify 实现工作流的内容需参考本组《常用组件》《本地部署》等篇。',
    tags: ['已精读', '原文残缺', 'Dify'],
    kids: [
      { name: '仅存的一句：Sectioning 定义', note: '正文唯一内容：「分段 Sectioning：将任务分解为并行运行的独立子任务。」这是原文全部实质内容，与标题「基于 Dify 实现 Ai Workflow」无关，未做任何 Dify 操作讲解。按规范如实标注，不凭标题补写。' }
    ]
  },

  'd0158': {
    note: 'Dify 知识库就是一个 RAG：创建三步（数据源 → 分段清洗 → 处理完成），分段有通用/父子两种，索引有高质量（Embedding）/经济（关键词倒排）两种，作者推荐高质量 + 向量或混合检索。实测父子分段 + 高质量索引明显优于通用 + 经济。结尾给出 8 条局限与加粗选型结论：Dify 适合原型与中小规模，高要求生产场景自建 RAG 才是终极方案。原文 6494 字，问答效果在截图里。',
    tags: ['已精读', 'Dify', 'RAG', '知识库'],
    kids: [
      { name: '知识库创建：三种数据源 + 15M 限制', note: 'Dify 的[知识库]就是 RAG，能做向量检索。创建三步：选择数据源 → 文本分段与清洗 → 处理并完成。数据源三种：导入文件（最常用）、从 Notion 同步、从 web 站点同步——后者支持 Jina Reader 和 Firecrawl 两种工具，都能把网页转成 LLM 友好的 Markdown（去冗余 HTML 标签、保留核心文本）；Firecrawl 是爬虫工具，实战篇还会用到。文档大小默认限制 15M，自部署 Dify 可改配置突破（原文给了知乎参考链接）。' },
      { name: '分段与索引的取舍：父子双层 + 高质量向量 ★', note: '分段两种：通用模式按自定义规则拆成独立分段；父子模式用双层结构平衡精确度与上下文——父块（Parent Chunk）保持较大文本单元（整节/整段）保留完整上下文，子块（Child Chunk）切成更小语义单元（句子/短段落）用于向量化和检索；执行时先用子块精确检索保证相关性，再取对应父块补充上下文，分隔符和最大长度可自定义。原文举例：AI 客服把用户问题定位到解决方案文档的某个句子，再把该句子所在段落/章节一并送 LLM。索引两种：高质量用 Embedding 把文本块转数字向量、匹配更精准；经济模式每个区块用 10 个关键词检索、仅倒排索引、无费用但准确度低。检索设置：高质量下支持向量/全文/混合检索，经济下仅倒排索引（只支持 TopK 设置项）。作者推荐：高质量 + 向量检索，或高质量 + 混合检索。', tags: ['必记'] },
      { name: '使用与实测：防编造提示词 + 父子高质量胜出', note: '知识库处理完即可用（Embedding 方式较慢需等待）。创建聊天助手应用，指定 LLM、提示词和知识库。原文提示词两条硬约束：① 只能基于知识库回答，无法回答时告知用户无法回答；② 不能编造任何内容和回答。实验语料是 Mavic Air 2 用户手册 PDF（原文给了 OSS 下载链接），对比『通用分段 + 经济索引』与『父子分段 + 高质量索引』两组问答（效果在截图）：作者结论是父子 + 高质量效果很好，通用 + 经济差很多。' },
      { name: '八条局限：为什么很多团队自建 RAG', note: '原文逐条（两侧对照）：① 知识库是封装模块，对分块策略、嵌入模型、检索逻辑定制能力有限；② 默认固定向量库（Weaviate 或内置存储），缺乏对索引类型（HNSW、IVF_FLAT）、相似度度量（cosine、L2、IP）的调优能力；③ 旧版本无法做多路召回、混合检索、重排序，后来支持了但有些功能要付费；④ 文档 15M 限制可绕过，但知识库过大时出现无法检索等问题，内置向量存储面临性能/扩展性问题——自建可横向扩展向量库集群；⑤ 文档更新后重新嵌入索引不灵活，难支持增量更新/实时同步——自建可设计 CDC + 流式处理管道实现近实时更新；⑥ 企业级私有化部署、细粒度权限、审计日志支持有限——自建可完全掌控数据生命周期，满足 GDPR、等保合规；⑦ 难以查看检索命中了哪些 chunk、相似度分数、上下文拼接效果，不利迭代——自建可集成日志、监控、A/B 测试。' },
      { name: '选型结论：原型用 Dify，高要求生产自建 ★', note: '作者加粗总结：Dify 更适合做快速原型验证、内部知识问答、中小规模非关键业务；而对于准确性、性能、安全性、可维护性有高要求的生产场景，自建 RAG 可能才是终极方案。这与本分支「低代码平台适合确定性流程」的总判断一致：平台换速度，自建换控制力。', tags: ['必记'] }
    ]
  },

  'd0159': {
    note: 'Dify 1.6 起官方支持双向 MCP（无需插件）：既能把工作流发布为 MCP Server 供 Cursor 等调用，也能在工具→MCP 中配置外部 MCP Server（如高德地图）供工作流/Agent 调用。作者加粗：最重要的就是拿到一个端点 URL 和一个 api key。原文 8805 字，配置界面均在截图。',
    tags: ['已精读', 'Dify', 'MCP', 'Cursor'],
    kids: [
      { name: '版本边界：1.6 起双向 MCP，旧版要插件', note: 'Dify 对 MCP 的支持分两个方向：① 把 Dify 上的工作流作为 MCP Server 发布；② 在 Dify 中调用外部 MCP Server。旧版本用 MCP 比较麻烦、需要各种插件（如 mcp 插件），从 Dify 1.6 开始官方内置双向支持，本文基于官方内置能力介绍。' },
      { name: '发布为 MCP Server：mermaid 渲染工作流案例', note: '需求：Cursor 看代码时想生成 UML 图（时序图/类图），但 Cursor 默认只生成 mermaid 文本不渲染图。mermaid 是基于 JavaScript 的开源工具，用类 Markdown 文本语法生成流程图、时序图、甘特图、类图。做法：在 Dify 搭工作流，两个节点——参数提取器（从用户输入提取符合 mermaid 语法的片段）+ MERMAID 转换器（mermaid 文本转图片）；MCP 默认不开启，在应用程序配置界面开启后，Dify 生成唯一的 MCP 服务器地址（端点 URL）作为外部工具连接点；在 Cursor 中配置该 URL 即可调用，运行时多一个生成图片步骤，按文件名找到图片。' },
      { name: '调外部 MCP：高德 key 申请 + Dify 配置 ★', note: '案例用高德地图 MCP 做路径规划。百炼提供高德等 MCP 接入，首次开通需填高德开放平台 key：登录 lbs.amap.com 注册（个人开发者 + 支付宝实名认证）→ 控制台创建应用 → 创建 key → 复制到百炼开通；也可不经百炼中转，直接用高德官方 MCP（lbs.amap.com/api/mcp-server/gettingstarted，支持 Cursor/代码调用）。其他 MCP 市场接入方案基本相同。作者加粗：最重要的就是拿到一个端点 URL 和一个 api key（key 一般通过开放平台获取）。Dify 侧操作：工具→MCP 页面新增配置 → 保存 → 右上角授权 → 看到工具列表 → 在工作流或 Agent 中调用。', tags: ['必记'] },
      { name: '两种用法：工具节点 vs Agent 节点 ★', note: '原文强调这种方式不能算 function call，而是把注册的工具当成工作流的一个节点：① 工具节点——LLM 节点后接工具节点（可选 MCP），工具节点后再接 LLM 节点做输出总结；② Agent 节点——Agent 策略需自行去 Marketplace 安装，作者选 React Agent 并配置 MCP 工具。作者提醒（原文「这里需要注意」）：建议在提示词中告知 LLM 使用工具，如「你擅长使用工具帮用户做路线规划」，LLM 会优先考虑使用工具。实测问「如何从西溪湿地骑行到西湖」，执行过程三次调用 MCP 工具完成骑行路线规划。', tags: ['必记'] }
    ]
  },

  'd0160': {
    note: '原文缺陷（标题与正文不符）：题为《Dify 进阶：插件开发》，但正文 2679 字全部是一个代码块，内容为「Dify 敏感数据脱敏插件需求文档（PRD）」，开头一句「我要开发一个 dify 插件，以下是我的需求文档」——像是交给 AI 辅助开发的需求提示词，没有任何插件开发步骤、SDK 或脚手架讲解。以下核心点严格从 PRD 本身读出。',
    tags: ['已精读', '原文仅代码', 'Dify', '脱敏插件'],
    kids: [
      { name: '插件定位：工具调用 → LLM 输入之间的脱敏卡点', note: 'PRD 背景：Dify 应用调用外部系统（CRM/ERP/数据库 API）返回的数据常含 PII（身份证号、手机号、银行卡号、家庭住址、医疗记录编号），按《个人信息保护法》《GDPR》《金融行业数据安全规范》原始敏感数据不得未经处理直接传入 LLM。当前 Dify 缺乏在「工具调用 → LLM 输入」之间对结构化数据自动脱敏的能力，必须通过插件扩展实现该安全控制点。目标：LLM 接收外部工具返回数据前自动识别并脱敏，不破坏原始数据结构，可复用、可配置、低侵入，适用多租户 SaaS。' },
      { name: '脱敏规则：字段关键词匹配 + 掩码，姓名默认关', note: '核心功能：按预定义字段名关键词（不区分大小写）匹配敏感字段，对 JSON 对象/字符串/数组递归遍历脱敏，掩码方式保留部分可见字符（正文策略示例 138*5678），输入输出结构不变。初始字段表：手机号（phone, mobile, telephone）、身份证号（id_card, identity_card, citizen_id，示例 110101199003072316 → 110101**2316）、银行卡号（bank_card, card_number, account_no，示例 6222081234567890123 → 6222******0123）、姓名（name, full_name，默认关闭，因可能影响语义理解，需配置开关）。原文疑点：表中手机号脱敏示例写作 1385678，疑似转换丢失星号（正文策略示例为 138*5678），以策略描述为准。未来扩展：参数动态开关、自定义正则匹配字段值、租户级策略（v2.0）。' },
      { name: '非功能指标与接口：≤50ms / ≥100 QPS / main(input_string)', note: '非功能需求：单次脱敏延迟 ≤ 50ms（95% 分位）、并发 ≥ 100 QPS；脱敏失败 fallback 返回原始数据（或可配置报错），不得中断工作流；插件本身不得记录/缓存/传输原始敏感数据，全部内存处理；输入必须为字符串，非法输入原样返回并记警告日志；提供脱敏字段数量、异常次数等基础日志。接口设计：YAML 元信息 name: sensitive_data_masker、type: function、input_params 为 input_string（string, required）、output 为 string；Python 签名 def main(input_string: str) -> str。使用场景：客户问「我的账户绑定手机号是多少」，API 返回含 phone/id_card 的 JSON → 插件脱敏 → LLM 基于脱敏数据回答，全程无原始敏感数据进 LLM。' }
    ]
  },

  'd0161': {
    note: 'Dify 提供完善的 RESTful API，可把构建的应用集成到自己的系统：在应用页面获取 API Key，按页面文档替换 key 发 HTTP 请求即可；不同应用不同 key，key 就是路由到具体应用的凭证。原文 1312 字，操作步骤全在截图里，正文只给流程与官方文档链接（发送对话消息）。',
    tags: ['已精读', 'Dify', 'API', '集成'],
    kids: [
      { name: 'Key 即应用路由：获取 → 替换 → 发请求', note: '三步：① 在 Dify 应用页面获取 API Key（截图）；② 按页面给出的 API 文档替换 key；③ 发送 HTTP 请求。关键机制（原文明确）：不同的应用是不同的 api key，Dify 通过这个 key 路由到具体的应用做调用——即 key 同时承担鉴权与应用定位。原文给了官方参考 docs.dify.ai/api-reference（发送对话消息接口）。正文未展开请求体字段与返回结构，具体参数需查官方文档。' }
    ]
  },

  // ==================== g-wf-n8n N8N 与平台选型（2 篇） ====================
  'd0162': {
    note: 'n8n 是企业级开源可视化工作流自动化平台，比 Dify 历史悠久：AI 只是它的能力之一，第三方集成「甩 Dify 几条街」（300+ 官方节点、数百种服务集成），是企业级工作流搭建首选。Docker 部署（5678 端口），8 种触发方式，节点分 AI/应用集成/数据转换/人工介入等类。原文 9902 字；缺陷：节点分类小节多条空 bullet（部分分类名丢失），以下按剩余文字还原。',
    tags: ['已精读', 'n8n', '部署', '触发器'],
    kids: [
      { name: '定位：工作流老将，AI 只是能力之一 ★', note: '作者加粗判断：在 AI 工作流概念出现之前 n8n 就在做工作流自动化，AI 出来后顺理成章转变；工作流本身能力比 Dify 更强，尤其第三方集成「甩 Dify 几条街」（官方支持数百种服务集成，长时间积累）。加粗结论：在 n8n 中 AI 只是它的能力之一、不仅局限于 AI，所以也是很多企业级工作流搭建的首选。内置 300+ 官方节点，集成 SaaS（Slack、Google Sheets、Notion、Airtable、Shopify、Discord、Telegram、Zapier Webhooks）、数据库（PostgreSQL、MySQL、MongoDB）、消息队列（RabbitMQ、Kafka）和自定义 HTTP。github.com/n8n-io/n8n；官网 n8n.io 云服务新用户免费 14 天。', tags: ['必记'] },
      { name: 'Docker 部署：5678 端口 + 国内镜像', note: '基础命令：docker volume create n8n_data；docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n。拉取不下来时换国内镜像 docker.m.daocloud.io/n8nio/n8n:2.46.6，并配环境变量：TZ/GENERIC_TIMEZONE=Asia/Shanghai、N8N_HOST=服务器IP、N8N_WEBHOOK_URL=http://IP:5678/、N8N_SECURE_COOKIE=false、N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true、N8N_RUNNERS_TASK_TIMEOUT=300、N8N_COMPRESSION_NODE_MAX_DECOMPRESSED_SIZE_BYTES=2147483648、N8N_COMPRESSION_NODE_MAX_ZIP_ENTRIES=5000、N8N_UNVERIFIED_PACKAGES_ENABLED=true（可写 /data/n8n/.env 用 --env-file 传入）。部署成功后 localhost:5678 访问。模板库：github.com/Zie619/n8n-workflows。' },
      { name: '八种触发方式：比 Dify 多，webhook 可集成进自有系统', note: '① Trigger manually 手动触发——点运行按钮，适合调试测试；② On app event 应用事件——Telegram 收到消息、Airtable 新行插入等；③ On a schedule 定时——支持 cron 表达式，如每天凌晨 2 点；④ On webhook call——接收 HTTP POST/GET，暴露 URL 让外部系统推数据，可把工作流集成到自己系统中调用；⑤ On form submission 表单提交——n8n 内建 Web 表单，无需额外前端；⑥ When executed by another workflow——用 Execute Workflow 节点调用另一个工作流，实现流程嵌套；⑦ On chat message 聊天消息——Slack/Telegram/Discord 消息触发，常用于 AI 助手/客服，类似 Dify 的 chatflow；⑧ Other ways——插件扩展更多触发源（如 Google Drive 新文件上传）。' },
      { name: '节点四类与模型边界：国内只支持 deepseek', note: '节点分类（部分分类名在转换中丢失，按剩余文字还原）：AI 类——集成 OpenAI、Claude、Anthropic、Google Gemini 等主流大模型，AI Agent 节点把 agent 需要的 llm、memory、tool 集成在一起分别配置；应用集成类——数百种应用（Google Drive、Slack、Zapier、Airtable、GitHub、Zoom），如 Google Sheets 创建行/读取数据/更新单元格；Data transformation 数据转换——Function（JavaScript 处理数据）、Switch（多条件选择，类似 switch-case）、HTTP Request（GET/POST/PUT）、Code（自定义 JavaScript/TypeScript）、Webhook（接收外部请求，常作触发器）、Set（设置变量）；Human in the loop 人工介入——Human Review 显示任务给指定人员审核。模型边界（原文明确）：n8n 目前只支持国外模型，国内只支持 deepseek，qwen 不支持；想用开源模型需本地部署、通过 Ollama 方式接入。' },
      { name: '踩坑：服务器部署组件默认 localhost，N8N_HOST 修复 ★', note: '服务器部署的 n8n，打开组件的默认域名依然是 localhost：如表单触发点测试，打开的无头浏览器是 localhost，虽可另开页面改 IP 访问，但没法调试节点、也没法在后续流程中引用表单数据——作者强调这个场景下问题一定要解决。解法：启动命令增加 N8N_HOST 指定前端识别的公开主机地址（用于前端生成请求链接），配套 N8N_PUBLIC_URL=http://IP:5678、N8N_LISTEN_ADDRESS=0.0.0.0、N8N_SECURE_COOKIE=false。修复后表单触发 Test step 自动打开的 URL 变成服务器 IP，节点成功拿到 Output。', tags: ['必记'] }
    ]
  },

  'd0163': {
    note: '原文缺陷（标题与正文严重不符）：题为《Dify & N8N & Coze & FastGPT 对比》，但正文仅 347 字，只有一句加粗选型结论，没有任何四平台对比表或分析，且该句提到的是 FastGPT/RAGFlow 而非标题中的四个平台。已完整读取，不存在漏读；四平台对比内容缺失，需另找出处（可参考本分支《什么是 n8n》与 00 分支平台地图篇的零散判断）。',
    tags: ['已精读', '原文残缺', '平台选型'],
    kids: [
      { name: '仅存的一句选型结论 ★', note: '正文唯一内容（加粗）：「要做知识库、重准确率、需私有化？→ 选 FastGPT（轻量）或 RAGFlow（重度）」。这是原文全部实质内容：按「知识库 + 准确率 + 私有化」三个条件给出 FastGPT（轻量）/RAGFlow（重度）的取舍，但没有展开判据，也没有 Dify/N8N/Coze 的任何对比。按规范如实标注，不凭标题补写对比表。', tags: ['必记'] }
    ]
  },

  // ==================== g-wf-case 实战：舆情分析助手（6 篇） ====================
  'd0164': {
    note: '实战总纲：做一个舆情监控分析助手，从微博、小红书等社交媒体自动爬取帖子，分析是否有大量吐槽、产品不可用反馈等舆情。原文仅 767 字：整体流程图在截图里，正文只有目标描述 + 一句「数据格式转换：Python/Javascript 代码」+ n8n 工作流导出文件链接（舆情分析.json，OSS 地址）。具体编排见后续 5 篇分步展开。',
    tags: ['已精读', '实战', 'n8n', '舆情'],
    kids: [
      { name: '目标与材料入口：流程图在截图，json 可导入 n8n', note: '目标：从社交媒体（微博、小红书等）自动爬取帖子，分析舆情信息（如是否有大量吐槽、反馈产品不可用等问题）。正文唯一的技术提示：数据格式转换用 Python/Javascript 代码（对应 n8n Code 节点）。整体流程图在截图中、正文未展开节点清单；原文附 n8n 工作流导出文件 舆情分析.json 的 OSS 下载链接，可导入 n8n 复现整条流水线。后续 5 篇按 firecrawl 爬取 → 微博内容提取 → LLM 舆情分析 → 数据保存更新分步讲解。' }
    ]
  },

  'd0165': {
    note: 'Firecrawl 是开源网页爬取与数据提取工具：浏览器自动化（Puppeteer/Playwright）+ LLM 语义提取，输出 JSON/Markdown，API 优先、可自托管。四个核心 API（scrape/crawl/map/search），Bearer 认证，新用户 500 免费额度。微博爬取案例给出 URL、cookie、LLM 提取提示词；作者实测发现 JSON 提取会丢帖，改用 markdown 自行解析。原文 7693 字，返回示例完整。',
    tags: ['已精读', 'firecrawl', '爬虫', '实战'],
    kids: [
      { name: '定位与能力：LLM 理解页面，输出结构化数据', note: 'Firecrawl 专为把网页内容转成结构化、可编程格式设计，结合现代浏览器自动化（Puppeteer 或 Playwright）与 LLM 能力：智能内容提取——不只抓 HTML，还用 LLM 理解页面语义，自动识别正文/标题/元数据，过滤广告、导航栏噪声；批量爬取——从 sitemap.xml 自动发现页面或按 URL 列表递归爬取；输出 JSON（clean_content 清洗后正文、metadata 标题/描述/URL、可选 LLM 总结）；RESTful API 优先，便于集成 AI 应用/RAG/知识库；开源可自托管（github.com/mendableai/firecrawl，docs.firecrawl.dev）。key 获取：注册 → dashboard（firecrawl.dev/app）→ api keys 创建，新用户 500 免费额度。' },
      { name: '四个 API 与参数：scrape / crawl / map / search', note: '所有 API 在 Header 带 Authorization: Bearer YOUR_API_KEY。① POST /v1/scrape 单页抓取：formats（markdown/html/raw/extract）、onlyMainContent（默认 true 只留正文）、waitFor（等待毫秒数，动态内容）、extract.schema（LLM 按指定 schema 提取结构化字段，高级功能）；② POST /v1/crawl 整站递归：limit（最大页数）、maxDepth（链接深度）、excludePaths/includePaths、scrapeOptions、webhook（异步回调）；③ POST /v1/map 只发现 URL 不抓内容（站点地图生成器，limit）；④ POST /v1/search 联网搜索 + 抓取（需 Search 插件，通常另配搜索 API 密钥如 SerpAPI）。场景建议：构建知识库先 /map 再批量 /scrape；大型站点 /crawl + webhook 异步；RAG 优先 markdown + onlyMainContent:true 便于分块嵌入。' },
      { name: '微博爬取案例：URL + cookie + LLM 提取提示词', note: '目标 URL：https://s.weibo.com/realtime?q=CSDN&rd=realtime&tw=realtime&Refer=weibo_realtime，其中 q=CSDN 是舆情关键词，可替换成任意监控词。前置：提前在网页登录微博，从请求中获取 cookie（详见视频演示），header 中配置 cookie 和 user-agent（浏览器开发者工具获取）。Firecrawl 支持 LLM 提取，原文提示词：「查询最近 1 天内发布的微博，从返回值中提取所有用户发布的微博内容、图片、用户名、发布时间、唯一 id 等」——自动筛选最近一天并提取目标字段。返回 metadata 含 creditsUsed: 5，json.weibo_posts 数组含 content/images/username/post_time/unique_id（原文给了 6 条真实帖子示例）。' },
      { name: '坑：JSON 提取丢帖，改 markdown 自行解析 ★', note: '作者实测发现：JSON 返回值的内容会比 markdown 少——如一页 10 条微博，JSON 中只保留 4-5 条；试过调整提示词，该丢还是丢。所以后面放弃 JSON 格式，直接取 markdown，再从 markdown 中自己解析出想要的东西（对应下一篇的 Code 节点正则提取）。执行教训：LLM 结构化提取不保证完整性，做数据采集时要以原始 markdown 为准、自己解析，不能依赖 LLM 提取的 JSON 做全量数据源。', tags: ['必记'] }
    ]
  },

  'd0166': {
    note: 'n8n 内置 firecrawl 插件，用 scrape a url and get its content 操作爬微博；作者实测只能用 custom body 方式（表单方式设不了 header）。分页爬取的关键认知：n8n 节点是数据驱动而非命令式，用 Code 节点返回 page 数组、每条 item 触发一次爬虫节点实现多页。原文 3130 字，配置界面在截图。',
    tags: ['已精读', 'n8n', 'firecrawl', '分页'],
    kids: [
      { name: '插件两种配置：只有 custom body 能跑通 ★', note: 'n8n 内置 firecrawl 插件，提供前面介绍的常用 API。使用 scrape a url and get its content 操作，有两种配置方式：基于表单填参数，或自定义 Body。作者试了很多办法后确认：想跑通只能用 custom body 方式，因为表单方式 header 没办法设置（都设置不成功）；custom 方式把整个请求体放到 custom properties 中即可。', tags: ['必记'] },
      { name: '参数复制坑：milliseconds 与 selector 互斥', note: '直接从 firecrawl 调试工具复制参数会报 BAD_REQUEST：Either \'milliseconds\' or \'selector\' must be provided, but not both.（path: actions[0]）。原因：复制来的参数默认带 actions: [{type: wait, milliseconds: 2, selector: #my-element}]，两个字段同时存在违反互斥约束。解法：删除其中一个或干脆都删掉（本案例没用上这个 action）。' },
      { name: '数据驱动分页：Code 节点数组 → 逐 item 触发 ★', note: '作者加粗核心认知：n8n 的节点是「数据驱动」的，不是「命令式执行」的——不会先执行 A 再执行 B 再回到 A，而是输入一批数据 → 每条数据独立流过所有节点；所以没有「循环回去」的概念，也没有跨 item 的共享变量。分页解法：先建一个 Code 节点返回 JSON 数组（如 [{page:1},{page:2},...]），n8n 会把每个 {page:xx} 当作一次循环、调用一次后续节点；在 firecrawl 爬虫节点中指定 page 的解析方式（引用上游 item 的 page 字段），即可逐页爬取。这是 n8n 做循环/分页的通用范式，与 Dify 的迭代节点思路不同。', tags: ['必记'] }
    ]
  },

  'd0167': {
    note: '原文仅代码：正文 5399 字全部是一个 JavaScript 代码块（n8n Code 节点），无文字讲解；顶部注释还是 n8n 模板默认的「add myNewField」，与实际逻辑无关。以下核心点全部从代码本身读出：把 firecrawl 返回的 markdown 解析成结构化微博帖子数组（时间标准化 + 正则提取 + 去重）。',
    tags: ['已精读', '原文仅代码', 'n8n', '数据提取'],
    kids: [
      { name: '时间标准化 parseWeiboTime：六种格式 → YYYY-MM-DD HH:mm:ss', note: '代码以 offsetHours=8 构造 UTC+8 的当前时间 NOW，把微博的相对/绝对时间统一成 YYYY-MM-DD HH:mm:ss：① 已是标准格式（YYYY-MM-DD HH:mm）直接补 :00；② X秒前 / ③ X分钟前 / ④ X小时前——用 NOW 减去对应毫秒数；⑤ 今天HH:mm——取当天日期拼时分；⑥ MM月DD日 HH:mm——JS 月份从 0 开始故 month-1，若解析出的日期比 NOW 还晚（如 12 月 1 日看到「12月2日」）则年份减 1，处理跨年；无法识别时保守返回原样或补 :00。代码阅读推断（非原文断言）：多处手动 +8 小时后又用 toISOString()（UTC）输出，时区基准存在混用，复用时需自行验证时间正确性。' },
      { name: 'markdown 拆帖与字段提取：正则 + 噪声清洗', note: '主逻辑遍历 $input.all()（n8n Code 节点输入 API），对 item.json.data.markdown 按 /\\n-\\s*转发\\s*\\n/（转发分隔线）split 成帖子块。每块用正则提取用户名、用户主页链接、发帖时间、帖子链接（markdown 链接嵌套格式）；正文在遇到图片/数字/转发/评论/赞标记处截断；清洗「展开 _c_」「收起 _d_」「来自[...]」等噪声并压缩空白；用内联图片正则与列表图片正则分别提取图片 URL，Set 去重合并；提取 #话题# 标签（Set 去重）；weiboId 从帖子链接去掉查询参数后取最后一段路径。' },
      { name: '输出结构：posts 数组八字段', note: '每条帖子 push 一个对象：{weiboId, username, userLink, postTime（已标准化）, postTimeLink, content, imageUrls, hashtags}，最终 return posts 交给下游节点。这正好接上 firecrawl 篇「放弃 JSON、取 markdown 自己解析」的决定：LLM 提取丢帖，改用确定性正则解析保证全量。字段与最后一篇 MySQL 表的 username/post_id/post_time/content/media_urls 等列一一对应。' }
    ]
  },

  'd0168': {
    note: '用 n8n AI Agent 节点做舆情分析：提示词先判断帖子主体是否目标产品（腾讯地图），不是则直接 neutral，再判情感极性 + 置信度 + 触发词，严格 JSON Schema 输出；LLM 用本地 Ollama 的 deepseek，必须开启 output format 否则输出不稳定。原文 1993 字；缺陷：「几个地方需要注意」列表只剩第 2 条，第 1 条缺失（疑似转换丢失）。',
    tags: ['已精读', 'n8n', 'LLM', '舆情分析'],
    kids: [
      { name: '两步判定提示词：先过滤主体，再判情感', note: 'AI Agent 节点提示词设角色「顶尖的数字舆情分析师」（社会学/传播学/消费者行为学/NLP 复合背景），工作流程两步：① 先分析原始发帖内容讨论的主体是不是目标产品「腾讯地图」，是则继续，不是则本条情感分析直接标记 neutral；② 判定整体情感极性（正面/中性/负面）、给出置信度（0–100%）、指出关键情感触发词或语句。上游变量用 n8n 表达式引用：{{ $(\'微博内容拆分\').item.json.content }}——即按节点名取上游 Code 节点输出的 content 字段。执行视角：主体过滤放在情感判定之前，避免无关帖子污染舆情统计。' },
      { name: '输出约束：JSON Schema + 防臆测 + 信息不足兜底', note: '提示词三条注意事项：不臆测未在文本中体现的信息；避免主观情绪化语言、保持专业中立；若发帖内容模糊或信息不足，明确说明「信息不足，无法准确判断」并指出缺失的关键要素。输出要求：严格按 JSON Schema，不得包含任何额外文本、解释、Markdown 或注释；schema 为 sentiment: {polarity: positive|neutral|negative, confidence: 0.0, trigger_phrases: [string], summary: [string]}。' },
      { name: '配置要点：Ollama deepseek + output format 必开 ★', note: '给 Agent 节点配置 LLM：作者选本地 Ollama 部署的 deepseek。原文明确强调：需要开启 output format，否则输出结果不稳定——这是让 LLM 稳定产出上述 JSON 的关键开关。配置完成后即实现舆情分析，输出结果在截图中。', tags: ['必记'] }
    ]
  },

  'd0169': {
    note: '原文仅代码：正文 2172 字全部是一段 MySQL CREATE TABLE DDL（ai_db.user_sentiment_posts，用户舆情发帖记录表），没有保存/更新节点的配置或 SQL 讲解。去重与更新机制可从唯一键读出：uk_platform_postid(platform, post_id) 保证同平台同帖唯一，支撑幂等写入。以下核心点从 DDL 本身读出。',
    tags: ['已精读', '原文仅代码', 'n8n', 'MySQL'],
    kids: [
      { name: '表结构：平台枚举 + 情感字段 + 互动计数', note: 'InnoDB / utf8mb4_unicode_ci。关键列：id（bigint unsigned 自增主键）、username varchar(128)、platform enum(weibo, douyin, zhihu, bilibili, xiaohongshu, tieba, wechat, other) 八平台、post_id varchar(128) NOT NULL（平台唯一 ID）、post_url varchar(512)、content text NOT NULL、post_time datetime（原始发帖时间）、crawl_time datetime DEFAULT CURRENT_TIMESTAMP（入库时间）、confidence decimal(10,0)（置信分数）、sentiment_label enum(positive, neutral, negative)、keywords varchar(1024)（JSON 字符串关键词列表）、summary varchar(2048)、media_urls json（图片/视频链接数组）、repost_count/like_count/comment_count int unsigned DEFAULT 0。DDL 中 AUTO_INCREMENT=76，说明导出时已入库约 75 条。字段与上游提取/LLM 分析输出一一对应。' },
      { name: '去重键与索引：platform + post_id 唯一', note: 'UNIQUE KEY uk_platform_postid(platform, post_id)：同一平台同一帖子只允许一条——这就是「数据保存与更新」的去重基础，重复爬取时可按该键做幂等 upsert（原文未给出具体 SQL，此为从唯一键读出的机制推断）。另有 idx_post_time、idx_crawl_time、idx_sentiment_label 三个查询索引，以及 idx_platform_postid——从 DDL 可见它与唯一键列完全相同，属冗余索引（代码观察，原文未说明）。' }
    ]
  }

});