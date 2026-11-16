/* b-api「02 大模型调用与流式输出」分支精读笔记（4 篇：3 篇正文精读 + 1 篇重复件）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 * 特别说明：《基于 SSE 实现大模型流式输出》可读正文仅为一段 SSE 响应样例数据（无文字讲解），
 * 其核心点均从样例本身直接观察得出，未编造实现细节。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- OpenAI API ----------
  'd0019': {
    note: 'OpenAI API 是大模型应用开发的底层基础与事实上的行业标准接口：一切框架封装最终归结为格式化 HTTP 请求；智能体开发主要围绕输出里的 content 与 tool_calls 两个核心字段展开。',
    tags: ['已精读', 'API调用'],
    kids: [
      { name: '行业标准接口：框架只是 HTTP 封装 ★', note: '作者加粗强调：OpenAI API 几乎是所有基于大模型应用开发的「底层基础」，目前主流大模型几乎都已完全兼容其接口规范，已成为事实上的「行业标准接口」（部分模型有自己的标准，如早期 Azure 的大模型与 OpenAI 并不兼容）。SpringAI、Langchain、Autogen 等智能体框架都对该 API 做了深度封装，但不论如何封装，最终都归结为向大模型 API 接口发送一个格式化的 HTTP 请求——甚至只用一个 httpclient 即可开展智能体应用开发。作者判断：只有先了解清楚 OpenAI API 的调用方式、入参、出参、流式/非流式输出，才能算真正理解大模型应用开发的底层原理。参考：platform.openai.com/docs/overview 与百炼 API 文档。', tags: ['必记'] },
      { name: 'base_url 配置差异：Spring AI 只配到 v1 之前 ★', note: '完整 API 接口路径通常是 https://域名地址（或 ip+port）/v1/chat/completions。大多数智能体框架（LangChain、Autogen 等）默认拼接 /chat/completions，因此只需配置到 https://域名地址/v1/；而课程用得最多的 SpringAI 默认拼接的是 /v1/chat/completions（作者加粗标出这一差异），所以 SpringAI 中只配置到 v1 之前。各家端点示例：ChatGPT https://api.openai.com/v1；通义千问 https://dashscope.aliyuncs.com/compatible-mode/v1；DeepSeek https://api.deepseek.com/v1；本地模型 http://<IP或域名>:<端口>/v1（如 ollama http://localhost:11434/v1）。', tags: ['必记'] },
      { name: '关键入参：stream 与 temperature，其余用默认值', note: 'Python SDK 标准调用：OpenAI(api_key=..., base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")，client.chat.completions.create(model="qwen-plus", messages=[system/user 两条角色消息])，取 completion.choices[0].message.content。HTTP 调用示例 body：model、messages、stream: false（非流式，true 即流式输出）、temperature: 0.7。作者在代码注释中建议：temperature 默认 0.7，要求结果更稳定可设 0.3，太低则可能触发某些模型的死循环输出；其他字段基本不用设置，设置不好非常可能导致模型输出的不确定性，用默认值即可。Postman 调用：在请求头存放 api_key（具体操作步骤在截图里，正文未给出）。注意：完整入参字段表及「加粗标记的标准字段」在可读取正文中未呈现（应为截图/表格），正文仅点名上述字段。' },
      { name: '核心出参：content + tool_calls ★', note: '非流式输出最关注 choices[i].message.content 和 choices[i].message.tool_calls；流式输出最关注 choices[i].delta.content 和 choices[i].tool_calls（原文如此，流式 tool_calls 未带 delta 前缀）。作者两处加粗强调同一判断：「一切的智能体开发主要都是围绕这两个核心参数进行的。」注意：完整输出字段表同样未在可读取正文中呈现，正文仅点名这些核心字段。', tags: ['必记'] }
    ]
  },

  // ---------- Java 调用方式 ----------
  'd0020': {
    note: 'Java 调大模型的四条路线：手写 HttpClient（能跑通但无复用性）、Spring AI（生产级全栈框架）、Spring AI Alibaba（1.0 GA 后企业级 Agent 增强 + Graph 编排）、LangChain4j（LangChain 的 Java 版，双层抽象）；作者加粗提醒项目 JDK 最低 17、建议 21，并给出按场景选型的明确结论。',
    tags: ['已精读', 'Java框架'],
    kids: [
      { name: 'HttpClient 直调：最直接，但代码爆炸', note: '作者加粗注意：项目 JDK 要求最低 JDK17，建议用 JDK 21。用 https://start.spring.io/ 创建空 SpringBoot 应用导入 IDEA。示例用 java.net.http.HttpClient / HttpRequest / HttpResponse：HttpRequest.newBuilder() 构造 POST 到 https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions，header 带 Content-Type: application/json、Authorization: Bearer + API_KEY、X-DashScope-SSE: enable，body 为 JSON 文本块（model: qwen-plus、messages、stream），client.send(request, HttpResponse.BodyHandlers.ofString()) 同步取完整响应；用任意 HTTP 客户端框架都可以。缺点（作者原话）：代码太复杂、不是结构化的、纯组装 http 请求、没啥复用性——简单对话尚可，要做 RAG、工具调用、MCP「代码就爆炸了」，因此引出框架。作者还指出模型返回比较慢、归因于没用流式输出（注意：示例代码实际写了 stream: true 且带 X-DashScope-SSE: enable 头，与正文说法不一致，原文如此）。' },
      { name: 'Spring AI：不只是调用封装，是生产级全栈框架 ★', note: 'Spring 为降低 Java 人员开发 AI 应用成本推出的组件；作者写作时版本 1.0.3，1.0.0 正式版 2025 年 5 月才发布（作者插话：在 Java 支持 AI 这方面「Spring 比 Oracle 要靠谱！！！」）。很多人认为它只是对模型调用做了简单封装，作者认为这么想太简单了：它提供面向 Spring 开发者的编程模型，让 AI 功能像使用 JDBC 或 REST Client 一样自然；解决多模型适配、提示工程、结构化输出、RAG 架构、对话记忆、可观测性等实际工程问题；鼓励最佳实践（提示词外置、POJO 映射输出、支持单元测试）。结论（原文加粗）：Spring AI 是一个面向生产级 AI 应用的全栈式开发框架，提供从提示管理、输出解析、向量存储到可观测性的一整套解决方案。功能清单在官方文档目录截图里，正文未逐项列出。', tags: ['必记'] },
      { name: 'Spring AI Alibaba：1.0 GA 后深度增强，Graph 是最大创新 ★', note: '基于 Spring AI 构建，是阿里云通义系列模型及服务在 Java AI 应用开发领域的最佳实践，提供高层次 AI API 抽象与云原生基础设施集成。1.0 GA 之前：可理解为在 Spring AI 上再封装一层，更方便接入各种模型（尤其自家百炼）及 MCP、RAG 等。1.0 GA 之后（原文加粗）：面向企业级智能体（Agent）应用开发场景深度增强和架构升级，保留 Spring AI 所有能力，构建完整的 AI 原生应用开发平台，适合复杂流程编排、多智能体协作、高可靠性和阿里云生态集成的生产环境。最大创新（原文加粗）：受 Python 社区 LangGraph 启发，提供基于有向图（DAG + 循环）的工作流编排能力 Graph，开发者可快速构建工作流、多智能体应用，无需关心流程编排、上下文记忆管理等底层实现；结合低代码、自规划智能体，提供低代码/高代码/零代码的灵活选择。生态集成：与百炼深度集成（模型接入、RAG 知识库）；ARMS、Langfuse 等可观测产品无缝接入；企业级 MCP 集成（Nacos MCP Registry 分布式注册与发现、自动 Router 路由）；开箱即用智能体产品 JManus、DeepResearch。作者评价：Java 大模型应用开发领域非常强有力的框架。注意：正文写了「对比下 Spring AI 和 Spring AI Alibaba」，但对比内容未在可读取正文中呈现。', tags: ['必记'] },
      { name: 'LangChain4j：对标 LangChain 而非 Spring AI，双层抽象', note: '作用与 Spring AI 差不多：提示词工程、提示词模板、对话记忆、结构化输出、RAG、Agent、MCP——「Spring AI 中有的东西，LangChain4J 也几乎都有」。但作者指出与其说对标 Spring AI，不如说对标 LangChain：它就是 LangChain 的 Java 版，出现时间比 Spring AI 还早。两层抽象接口：低层次提供 Basics（大模型、提示词模版、模型记忆等）和 RAG（向量模型、向量数据库、文本载入分割工具）两类接口，开发者灵活实现、按需组合定制；高层次提供 Chains（源于 LangChain，把低层次模块组合成固定处理流程并协调交互）和 AI Services（为 Java 量身定制，类似 Spring Data JPA：只需显式定义接口，可自定义加入 Memory、Tools 或 RAG，具体调用逻辑由 LangChain4j 代理完成），让开发者更关注业务逻辑。' },
      { name: '选型结论：按场景对号入座 ★', note: '作者给出的选型规则（原文全部加粗）：非 Spring 的纯 Java 项目 → LangChain4j；需要快速原型验证且熟悉 LangChain 概念 → LangChain4j；已有 Spring Boot 项目、只需简单 LLM 调用或 RAG → Spring AI；构建企业级、多步骤、多角色协作的 AI 应用 → Spring AI Alibaba；想用 Java 但又想要接近 Python LangChain 的体验 → LangChain4j 是最佳选择。', tags: ['必记'] }
    ]
  },

  // ---------- 重复件 ----------
  'd0021': {
    note: '内容与《Java 中大模型调用的多种方式》一致，见该篇。',
    tags: ['重复件']
  },

  // ---------- SSE 流式输出 ----------
  'd0022': {
    note: '可读取正文仅有一段 qwen-plus 的 SSE 流式响应样例数据，没有任何文字讲解；流式实现要点与前后端配合不在可读正文中。以下核心点均为从样例数据直接观察到的事实，未做推测补充。',
    tags: ['已精读', '流式输出'],
    kids: [
      { name: 'SSE 报文形态：data: 前缀 + chat.completion.chunk', note: '样例中每条消息以 data: 开头，后接一个 JSON 分块；object 字段为 chat.completion.chunk（流式分块对象）。同一次响应的所有 chunk 共享同一个 id（样例为 chatcmpl-4bbf022b-e68c-9848-8328-dc401165051d）和 created 时间戳（1768391649），model 为 qwen-plus——可据此把多个分块归属到同一次生成。' },
      { name: '增量内容在 choices[0].delta.content，样例未见结束块', note: '首个 chunk 的 delta 只有 role: "assistant"、content 为空串；后续 chunk 由 delta.content 携带文本增量（样例依次为「我是」「通义千」「问（Q」「wen），是」「阿里巴巴集团旗下的通义实验室」），增量粒度是词片段级、并非严格一字一条。样例中各 chunk 的 finish_reason、logprobs、usage 均为 null，即只展示了生成中的分块，未出现结束块（finish_reason 置位）或 [DONE] 标记。该字段与《理解 OpenAI API》点名的流式核心字段 choices[i].delta.content 一致。' }
    ]
  }
});