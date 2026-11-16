/* b-mcp「06 MCP 协议」分支精读笔记（16 篇，全部逐篇读取原文）
 * 来源：课程原文。个别文档正文极短/纯代码/疑似缺失的情况已在对应 note 中如实标注。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- 原理（g-mcp-theory） ----------
  'd0046': {
    note: 'MCP（Model Context Protocol，模型上下文协议）是 Anthropic 开源的通用开源标准协议，不是框架或具体技术——智能体连接外部工具的「USB 接口」；相对 Function Call 的硬编码式集成，它用 Client–Server 分层把工具解耦成独立 MCP Server，实现即插即用与功能解耦。',
    tags: ['已精读', 'MCP 概念'],
    kids: [
      { name: '定位：通用开源标准协议，USB 接口比喻', note: '旨在解决大模型与外部世界「沟通不畅」的问题，用于安全、高效地连接智能体应用与外部工具。以前让大模型读数据库，必须为特定智能体写专门的 function call 代码，换一个智能体就得重写；现在把数据库操作包装成 MCP Server，任何支持 MCP 的客户端（Claude Desktop、Cursor、Cline 等）都能直接连接使用，无需重复造轮子。社区已公开大量 MCP Server，其功能能力直接决定智能体实际任务的执行效果。官网架构图：MCP 协议层作为「枢纽」，左侧智能体客户端、右侧工具（数据库、文件系统等），把原本没有复用性的点对点连接简化为统一接口调用，只要支持 MCP 标准，任意客户端都能即插即用连接任意工具。' },
      { name: '与 Function Call 的区别：硬编码集成 vs 标准化服务 ★', note: 'Function Call 本质是「硬编码式集成」：每次工具集成都是一次完整开发，所有环节由开发者自己实现、逻辑全部在智能体内部写死；智能体数量增加则每个都要重复写接入代码，工具规模扩大则耦合度越来越高、扩展成本急剧上升。MCP 通过 Client–Server 分层解决「强耦合、难扩展、难管理」：工具以独立 MCP Server 暴露能力，Client 负责通过 JSON-RPC 与 Server 能力协商与通信，智能体统一管理权限、上下文整合与大模型调用。作者通俗类比（加粗）：Function Call 是「智能体直接带着自制的工具去工作」，MCP 是「在工具商店，挑选专业制造商制造的工具去工作」——智能体只需通过协议查询和调用，无需了解工具内部实现。', tags: ['必记'] },
      { name: '四阶段工作流程：初始化 → 决策 → 调用 → 总结', note: '① 初始化（工具说明获取）：智能体通过 MCP 协议向所有连接的 Server 用 JSON-RPC 请求工具说明书，Server 保证说明书是标准化 JSON 格式；② 决策（大模型规划）：把用户原始问题 + 所有标准化工具说明一同发给大模型，模型规划后返回清晰的工具调用指令；③ 调用（执行与结果回传）：智能体通过 MCP 协议请求对应 Server 执行工具操作（如数据库查询），Server 返回原始执行结果；④ 总结（生成最终回复）：把用户原始问题 + 工具最终结果 + 完整对话历史再次发回大模型，生成自然语言回复输出给用户。初始化和调用两个阶段都用到 MCP 协议：前者解决工具说明书获取的可读性，后者把模型指令转发给 Server 执行。' },
      { name: '工具调用的本质：模型只决策，智能体执行 ★', note: '作者界定职责（加粗）：大模型在工具调用中始终是决策者和规划者，只负责输出「调用哪个工具、传入什么参数」的指令；实际执行者是智能体本身（智能体框架基本都封装好了），大模型自身并不参与服务的实际调用。不论 Function Call 还是 MCP，底层与大模型的交互本质相同：向模型发送带工具定义（schema）的对话请求，让模型基于标准化描述返回结构化指令。两者唯一区别：Function Call 需要应用自行构造工具说明并封装工具实现逻辑，MCP 把工具说明与执行逻辑都封装成独立的外部服务。原文示例：POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions，model 为 qwen-plus，functions 里定义 getWeather（description「获取某个城市的实时天气」，参数 city 为 string 且 required）。', tags: ['必记'] }
    ]
  },

  'd0047': {
    note: '回答「为什么 MCP 必须是协议而不是框架」：本质是能力协商标准而非调用技术（「HTTP 之于 Web」，不是「Mybatis 之于数据库」）；用 client–server 结构把工具从智能体里拆出来，Host/Client/Server 三角色中 Client 与 Server 一对一、Host 可接多个 Client；标准化分数据层（JSON-RPC）与传输层两层。',
    tags: ['已精读', 'MCP 原理'],
    kids: [
      { name: '为什么必须是协议，而不是框架 ★', note: '它不是一个 SDK，也不是一个框架，而是一种协议约定（加粗）。只要工具被绑定在某个 SDK 或框架内部，就无法脱离该框架供其他智能体使用——你写一个 Java SDK，Python 智能体怎么用？因此必须把工具做成任何人、任何语言、任何框架都能访问的「独立能力端点」。作者核心判断（加粗）：MCP 的本质是一种能力协商标准，而不是一种调用技术；它更像是「HTTP 之于 Web」，而不是「Mybatis 之于数据库」。回顾上节：Function Call 的问题在于工具被硬编码绑定在智能体内部，每个智能体都得自己背着一整套自定义工具箱，换环境、换智能体都得重写接入逻辑。', tags: ['必记'] },
      { name: '三角色边界：Host / Client / Server，一对一与一对多 ★', note: 'MCP Host 就是我们的智能体应用；MCP Client 是安装在 Host 中的一段代码，用于与 MCP Server 交互获取工具信息的组件；MCP Server 是独立的工具服务，用于提供说明书和具体执行逻辑。关键关系（加粗）：client 和 server 是一对一的，而 host 中可以接入多个 client 用于实现智能体的能力扩展。工具代码不再放在智能体内部、不再依赖智能体的开发语言和运行环境，而是被包装为能独立运行的能力端点；智能体只与它通信，不用关心工具是 Java 写的、Python 写的还是运行在什么平台上。', tags: ['必记'] },
      { name: '两层标准化：数据层 + 传输层', note: '工具被拆出智能体后，没有标准就不可能复用、组合，也无法让不同智能体理解工具的使用方式。数据层：定义基于 JSON-RPC 的客户端-服务器通信协议，包括生命周期管理和核心原语——工具、资源、提示；传输层：定义客户端和服务器之间数据交换的通信机制和通道，包括特定于传输的连接建立、消息帧和授权。原文说这两层标准在后续章节（中、下篇）分别详细介绍。如实标注：正文开头有两处空列表项，个别过渡内容缺失。' }
    ]
  },

  'd0048': {
    note: '数据层标准化：所有交互都是 JSON-RPC 2.0 数据包（请求 method+params+id，响应 result 或 error）；生命周期四阶段——initialize 能力协商后必须发 notifications/initialized，tools/list 发现工具，tools/call 执行，工具变更靠 notifications/tools/list_changed 推送后重新拉取列表。',
    tags: ['已精读', 'MCP 原理', 'JSON-RPC'],
    kids: [
      { name: 'JSON-RPC：比 RESTful 更简单的「通用语言」', note: '所有工具必须用统一格式描述自己——工具名、使用说明、参数结构、返回格式，采用严格 JSON；智能体连接 Server 第一步就是索要所有工具说明书（即「初始化」，对应一次标准 JSON-RPC 请求），工具执行返回也遵循同样标准，无需为不同工具写适配逻辑。JSON-RPC 三要素：RPC（远程过程调用）= 在 A 服务调函数、实际在 B 服务运行再传回结果；JSON = 最通用的数据格式，任何语言都能看懂；无状态（Stateless）= 每次请求独立，像寄信一样协议本身不记忆之前的状态。相比 RESTful API 要关心 HTTP 方法、URL 路径、Header，JSON-RPC 极其简单粗暴：只关心「需要调用的方法名」和「参数」，与大模型调用工具的逻辑完美契合。三种包结构：请求 {jsonrpc:"2.0", method:"tools/call", params:{name:"get_weather", arguments:{city:"Beijing"}}, id:1}；成功响应 {jsonrpc:"2.0", result:{content:[{type:"text", text:"北京今天晴，气温 25 度"}]}, id:1}；错误响应 {jsonrpc:"2.0", error:{code:-32601, message:"Method not found"}, id:1}，id 用于匹配请求与回信。' },
      { name: '初始化：能力协商 + 必须发 initialized 通知 ★', note: 'Host 启动时 Client 向 Server 发起 initialize 请求做能力协商：确认协议版本、功能支持等。示例 params：protocolVersion 为 "2024-11-05"，capabilities 含 roots.listChanged:true、sampling:{}、elicitation:{}，clientInfo 含 name/title/version。初始化成功后，客户端必须发送 notifications/initialized 通知（纯通知、无 id）表明已准备好开始正常运行。作者强调（加粗）：如果没有这步，服务端会认为客户端并未准备好，所以将禁止后续的其他操作。这一阶段保证双方在同一协议下通信，为后续工具发现和调用做好准备。', tags: ['必记'] },
      { name: '工具发现与调用：tools/list → tools/call', note: '工具发现：客户端发 tools/list（示例 id=100），响应返回所有工具的说明信息——每个工具以 JSON 描述方法名、参数类型、返回格式和使用说明；智能体无需理解内部逻辑，只需知道工具能做什么、需要哪些参数、返回什么；工具可能随时变化，每次获取的都是最新列表（动态发现）。调用：大模型决策后，Client 构建 tools/call 请求（示例 id=101，params.name=get_weather、arguments={city:"Beijing"}）发给 Server；Server 解析工具名和参数 → 独立运行工具逻辑（无需 Host 参与内部过程）→ 按 JSON-RPC 的 result 或 error 返回；智能体可直接处理输出、组合多个工具结果或继续下一步决策。原文此处对两类原语给了一句话定义：Resources（资源）= 可供客户端直接读取的外部数据，如文件内容、API 返回结果；Tools（工具）= 具体执行的工具服务（核心能力）。Prompts 仅在上篇数据层原语列表中出现，本篇未展开定义。' },
      { name: '工具变更：list_changed 通知 → 重新拉取列表', note: '运行过程中服务器上的工具可能新增、下线或修改，MCP 支持客户端实时获知变更：服务端通过 notifications/tools/list_changed 通知客户端工具列表已更新；客户端收到通知后重新请求 tools/list，更新内部工具注册表；保证智能体始终知道最新的可用工具，实现动态适应和高可扩展性。至此 MCP 通过 JSON-RPC 各阶段调用实现了工具数据层的标准化、模块化和动态扩展能力。' }
    ]
  },

  'd0049': {
    note: '如实标注：标题为「技术原理（下）」，但正文极短（仅约 300 字符）且含空列表项，只覆盖 Stdio 传输的父子进程原理，SSE/Streamable HTTP 等其他传输方式未展开，疑似闪存缺失内容。核心：Stdio 不涉及任何网络协议，本质是进程间通信——Host fork 子进程，请求写 stdin、响应读 stdout、日志走 stderr，Server 生命周期完全由 Host 管理。',
    tags: ['已精读', 'MCP 原理', 'Stdio', '原文内容不全'],
    kids: [
      { name: 'Stdio = 父子进程 IPC，三条通道', note: 'Stdio 传输不涉及任何网络协议（TCP/HTTP），本质是进程间通信：MCP Host（如 Cursor）启动 MCP Server 时，实际是在操作系统中 fork 了一个子进程。下行通道（Host → Server）：Host 将 JSON-RPC 请求序列化为字符串，写入子进程的 stdin（标准输入流）；上行通道（Server → Host）：Server 处理完后将结果写入自己的 stdout（标准输出流），Host 监听这个流获取响应；错误通道：日志信息通常写入 stderr，这样不会干扰正常的 JSON 数据流。' },
      { name: '生命周期绑定：Host 关闭，Server 随之销毁 ★', note: 'Server 的生命周期完全由 Host 管理：Host 关闭，Server 进程随之销毁。如实标注：原文仅此两点（另有两处空列表项），未覆盖其他传输方式，与标题「（下）」的预期内容量不符。', tags: ['必记'] }
    ]
  },

  'd0050': {
    note: '两组对比：MCP vs RPC——RPC 是执行引擎（同步执行、命令式控制、聚焦「如何执行」），MCP 是上下文与能力的抽象（结构化上下文 + 工具指引，实现从「执行」到「决策」）；MCP vs A2A——MCP 解决单个智能体用工具的垂直集成，A2A 解决多智能体水平协作，二者互补而非竞争。',
    tags: ['已精读', 'MCP 概念', '协议对比'],
    kids: [
      { name: 'MCP vs RPC：执行引擎 vs 上下文与能力抽象 ★', note: 'RPC 是历史悠久的通信范式，设计初衷是让程序像调用本地函数一样透明地调用远程服务，核心在于过程的同步执行和命令式控制；要求调用方与被调用方有严格预定义的接口、函数签名和数据类型，通信语义聚焦「如何执行」一个特定操作并期待确定结果。MCP 诞生是为了服务具有推理能力的大模型，核心在于提供结构化的上下文和工具使用指引，实现从「执行」到「决策」的转变：大模型通过 MCP 理解外部工具和数据，把用户自然语言意图（如「帮我查询下周的天气」）转换为对 MCP 工具的调用，这种交互是意图驱动的、声明式的，屏蔽了底层 API 复杂性。作者判断（加粗）：RPC 解决执行问题，是一个执行引擎；MCP 解决「提供哪些信息和工具，让 AI 决定如何使用」的问题，是一个上下文与能力的抽象。', tags: ['必记'] },
      { name: '澄清：JSON-RPC 只是消息封装，不是 RPC 架构', note: '作者强调（加粗）：MCP 虽然在消息结构上采用了 JSON-RPC 的格式规范，但这并不意味着它建立在传统 RPC 架构之上。MCP 的通信本质是基于标准的 STDIO 或 HTTP 传输机制（SSE、Streamable HTTP），JSON-RPC 在其中仅作为消息封装和结构约定使用，而非远程过程调用语义。RPC 框架（如 Dubbo、gRPC、Feign）并不是 MCP 的技术基础；RPC 或 MCP 都有可能是基于 HTTP 协议实现的通信。' },
      { name: 'MCP vs A2A：垂直工具集成 vs 水平智能体协作 ★', note: 'A2A（Agent-to-Agent Protocol，智能体通信协议）是近年来由 Google 等厂商推动的开放标准，专门解决多智能体系统中的智能体协作问题。作者核心判断（加粗）：若说 MCP 是解决单个智能体如何使用工具的问题，那么 A2A 解决的就是多个智能体如何协同工作的问题。MCP 专注垂直能力集成：把大模型/智能体与所需外部资源（数据库、企业内部 API、第三方工具）安全且标准化地连接，是智能体获取工具能力的桥梁；A2A 专注水平协作通信：定义智能体之间如何发现、协商任务、传递上下文、交换成果和管理任务生命周期，让「财务智能体」「营销智能体」「分析智能体」像团队成员一样协调，共同解决超出单一智能体能力范围的复杂任务。结论（加粗）：MCP 和 A2A 完全是互补关系，复杂应用场景中分工明确、相互依赖。', tags: ['必记'] },
      { name: '互补示例：南京两日游的多智能体分工', note: '① 用户提出复杂需求「帮我规划一下本周末要去南京旅游两天的行程」；② A2A 协议开始工作，协调「行程编排代理」「机票预订代理」「酒店查询代理」等多个专业智能体；③ 机票预订代理执行子任务时需要调用外部航班查询 API，通过 MCP 协议连接已暴露的「航班工具」，安全地传递查询上下文并获取结果；④ 各代理通过各自的 MCP 完成对外部工具的操作，再通过 A2A 把成果（航班信息、酒店预订状态）反馈给行程编排代理汇总。总结（加粗）：A2A 提供智能体之间的对话和协作规范，MCP 提供智能体获取外部世界工具能力的规范；两者结合构建既有强大工具调用能力（MCP）又有高效复杂任务处理能力（A2A）的多智能体应用架构。' }
    ]
  },

  // ---------- 开发与接入（g-mcp-dev） ----------
  'd0051': {
    note: '用 VS Code Cline 实操接入 MCP Server：先装 Node.js（大部分 stdio Server 基于 nodejs），再在 Configure MCP Servers 里编辑 mcpServers JSON；Windows 必须用 cmd /c 包装 npx 命令；filesystem + tavily-search 两个示例完成「搜南京天气并存到桌面」的组合任务。',
    tags: ['已精读', 'MCP 接入', 'Cline'],
    kids: [
      { name: '三款主流 Host 与 Cline 配置', note: 'Cursor：面向开发者的智能编程编辑器，原生支持 MCP，能自动从外部系统获取上下文（代码库、API、数据库等）并在对话/编辑中调用工具，「几乎是目前最完整的 MCP 客户端」；Cline：VS Code 中的智能体工作流扩展，内部基于 MCP 与外部工具交互，作者强调（加粗）「最重要的是完全免费」；Claude Desktop：官方桌面客户端已内置 MCP 支持，能读取资源、执行工具、调用注册的服务，不再只是聊天助手。配置步骤：安装 VS Code → 插件管理搜索安装 Cline → 点左边机器人图标进入 → 右上角齿轮配置大模型（作者用 OpenAI Compatible 接千问）→ 此时智能体「只有大脑，没有四肢」，没法调用工具。' },
      { name: '前置条件：Node.js 环境与内置仓库', note: '安装前需要 Node.js 环境，因为大部分的 stdio 传输的 MCP Server 都是基于 nodejs 开发的（官网下载，装完执行命令验证版本）。Cline 内置了一个 MCP Server 仓库（点三条杠图标可见），可以搜索安装现成工具，例如搜「FILE SYSTEM」安装操作本地文件的工具。' },
      { name: '坑：自动安装命令在 Windows 不可靠 ★', note: 'Cline 仓库安装时会请求同意执行脚本，但生成的命令有问题，例如 cd C:\\Users\\Lenovo\\Documents\\Cline\\MCP\\filesystem-server && npx @modelcontextprotocol/create-server filesystem——Windows 不允许这种 && 操作，直接同意执行会报错。作者判断：这种方式需要自己判断命令是否正确再选择执行，既浪费大模型的 token，稳定性也比较差。正确做法：点 Installed → Configure MCP Servers，右侧出现可编辑的 JSON 文件；从官方仓库（https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem）选择 npx 接入方式，copy 到 settings.json 再略作修改。', tags: ['必记'] },
      { name: 'mcpServers JSON 配置与 Windows cmd /c 包装 ★', note: 'filesystem 配置：{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","C:/Users/Lenovo/Desktop"]}}}，最后一个参数把可操作目录限定为本地桌面。Windows 环境必须调整命令格式：command 固定改为 "cmd"，args 固定增加 "/c"、"npx"，后面与原版一致。tavily-search（联网搜索）：command 同样 cmd /c npx -y tavily-mcp，env 里配 TAVILY_API_KEY（去 https://app.tavily.com/home 申请），autoApprove:[]。配置成功后 Server 后面的小圆灯变绿色，filesystem 下面的红色告警文字不用管。验证提问：「帮我搜索下今天南京的天气如何，并将结果保存在桌面上」，搜索 + 写文件两个工具协作完成任务。', tags: ['必记'] },
      { name: 'MCP Server 仓库 = Java 的 Maven 仓库', note: 'MCP Server 仓库可理解为集中管理的工具插件库，收录各种已实现好的能力模块（文件操作、数据库访问、搜索引擎等），智能体接入某个 Server 就立刻获得对应能力，无需重复造轮子。作者类比：就像 Java 的 Maven 仓库——开发者不必从头实现工具，而是像引入依赖一样直接接入即可用，让智能体的能力扩展变得标准化、模块化、可插拔。市面上已有大量 MCP 工具拿来即用，不需要再像以前一样自己写文件操作或联网查询的 function。' }
    ]
  },

  'd0052': {
    note: 'Spring AI 开发 MCP Server 三种传输模式完整代码：Stdio（控制台必须纯 JSON，关 web/banner/日志）、SSE（双端点 /sse 监听 + /mcp/messages 发消息）、Streamable HTTP（2025-03-26 提出的单端点标准，支持重连与消息重发，官方推荐替代 SSE）；工具用 @Tool 声明 + MethodToolCallbackProvider 注册，POJO 参数务必加 @ToolParam 描述。',
    tags: ['已精读', 'Spring AI', 'MCP Server'],
    kids: [
      { name: '依赖选择与 Stdio 的「纯 JSON」硬要求 ★', note: '引包 spring-ai-starter-mcp-server-webmvc；响应式项目用 spring-ai-starter-mcp-server-webflux，作者警告（加粗）：不要和 mvc 混用，在 IO 密集的接口调用时会发生阻塞卡死。Stdio 模式通过标准输入输出与客户端通信，适合本地轻量化工具或无需网络的场景；要求程序运行时控制台输出必须是纯 JSON（JSON-RPC）、不能有任何多余字符，否则智能体解析 stdout 就会报错（加粗），所以必须关闭 web、关闭 banner、关闭所有日志输出：spring.main.web-application-type: none、banner-mode: off、ai.mcp.server.stdio: true、type: SYNC、logging.level.root: OFF。工具代码：@Service WeatherService 里 @Tool(description="根据城市名称查询天气信息") getWeather(city)，switch 返回北京/上海/深圳天气；注册 Bean：MethodToolCallbackProvider.builder().toolObjects(weatherService).build()，自动扫描带 @Tool 注解的方法。Cline 接入：type:"stdio"、command:"java"、args:["-jar", ".../mcp-server-stdio-1.0.0-SNAPSHOT.jar"]，无需单独启动 SpringBoot，直接在 Cline 中配置 java jar 启动即可。', tags: ['必记'] },
      { name: 'SSE 双端点架构：「听收音机」+「写信发消息」', note: 'SSE（Server-Sent Events）基于 HTTP，采用双端点架构：sse-endpoint（/sse）是 MCP Client 监听服务器主动推送消息的通道（工具列表更新、状态变更等），作者比喻「听收音机」；sse-message-endpoint（/mcp/messages）是 Client 向服务器发送请求、调用工具的接口，通过约定的 JSON-RPC 协议传参获取响应，比喻「写信发消息」。二者配合使客户端既能主动发起操作也能实时接收推送。配置：server.port 8003，capabilities 里 tool:true、resource:false、prompt:false、completion:false。浏览器访问 /sse 即建立长连接，返回的 data:/mcp/messages?sessionId=ef851aab-... 就是带会话 ID 的消息端点；作者用 postman 调用端点走完 initialize → notifications/initialized → tools/list 整个生命周期。坑：监听信息里中文乱码，因为浏览器默认当成 ISO-8859-1 编码，加 server.servlet.encoding: charset UTF-8、force true、enabled true 强制输出 utf-8 解决。Cline 接入：type:"sse"、url:"http://127.0.0.1:8003/sse"。' },
      { name: 'Streamable HTTP：单端点 + 重连重发 + STATELESS 取舍 ★', note: 'StreamableHTTP 是 MCP 在 2025 年 3 月 26 日正式提出的最新官方传输标准，改进传统 SSE 在长连接、大数据流和双端点管理上的局限：通过单一 HTTP 端点实现请求发送与流式响应接收，支持断续重连和未确认消息重发，保证长时间任务或增量输出的稳定可靠，是官方推荐替代 SSE 的方案。配置：protocol: STREAMABLE、streamable-http.mcp-endpoint: /api/mcp（一个端点即可双向通信）、keep-alive-interval: 30s（HTTP 连接心跳间隔）、instructions 定义 Server 提示词指导模型行为、resource/tool/prompt-change-notification 三个变更通知开关。protocol 还可切换 STATELESS：无状态模式下 Server 不在内存保存客户端会话、不分配或要求 Mcp-Session-Id，每个请求独立处理，不记录多轮对话历史或流式事件状态；适合单次调用、无历史依赖的工具或 API（一次性计算、查询数据库、获取即时信息），优势是简单、易扩展、适合 serverless 或微服务架构；代价是无法保留上下文或中途恢复，不适合依赖会话连续性的多轮交互、长连接流式推送或复杂工具链操作。', tags: ['必记'] },
      { name: 'Streamable 请求头与会话坑：Accept 双格式 + Mcp-Session-Id ★', note: '作者强调（加粗）：请求头必须按规定设置才能访问——MCP 的 Streamable HTTP 协议规定服务端可能根据情况返回 SSE 流（Server-Sent Events）或普通 JSON 响应，因此规范要求客户端必须在 Header 里声明它能同时处理这两种格式（具体 Header 值在原文截图中，正文未给出文本）。初始化成功后从响应头获取重要参数 Mcp-Session-Id，后续请求必须在请求头里带上它才可以正常访问。另外如果是无状态模式，需要使用纯 POST 请求而不是 SSE 请求来调用才能获取结果。Cline 接入：type:"streamableHttp"、url:"http://127.0.0.1:8004/api/mcp"。', tags: ['必记'] },
      { name: 'POJO 入参出参 + @ToolParam 必须写描述 ★', note: 'Spring AI 的 MCP Server 同样支持 POJO 类作为入参和出参：@Tool(name="query_weather_by_city&date", description="根据城市和日期获取天气信息") queryWeather(WeatherRequest) 返回 WeatherResponse（内部 Thread.sleep(10000) 模拟调用 api，随机温度 Math.random()*15+10）；WeatherRequest 是 @Data 类，字段 city/date/i/s 各标 @ToolParam(description=...)。作者强调（加粗）：请尽量使用 @ToolParam 来说明参数的值——不加的话字段名比较简单时大模型也能识别，但业务比较复杂时大模型不一定理解你的业务字段，这就会有问题。作者故意用两个含糊字段 i（区县）和 s（街道）验证：大模型通过 ToolParam 的描述也能识别出字段的真实含义。', tags: ['必记'] }
    ]
  },

  'd0053': {
    note: 'Spring AI 开发 MCP Client 两条路：配置文件自动注入（stdio/sse/streamable-http 三种 connections，注入为 List<McpSyncClient>）或手动构建三种 Transport；调用也两条路：McpSyncClient.callTool 直调，或 SyncMcpToolCallbackProvider 注入 ChatClient 交给智能体。最大的坑：endpoint 与 baseUri 必须分开写，否则 404。',
    tags: ['已精读', 'Spring AI', 'MCP Client'],
    kids: [
      { name: '依赖与自动注入配置；JSON 方式只支持 stdio ★', note: '引包二选一：传统 web 项目用 spring-ai-starter-mcp-client，追求响应式用 spring-ai-starter-mcp-client-webflux。配置 spring.ai.mcp.client：enabled:true、name、version、request-timeout: 60s、type: SYNC；三种连接并列配置——stdio.connections.weather-stdio（command: java + args -jar 路径）、sse.connections.weather-sse（url: http://127.0.0.1:8003 + sse-endpoint: /sse）、streamable-http.connections.weather-streamable（url: http://127.0.0.1:8004/stream/test/ + endpoint: api/mcp）。另一种类似 Cline 的 JSON 配置方式：resources 下放 mcp-servers.json，再配 stdio.servers-configuration: classpath:/mcp-servers.json；作者明确不推荐（加粗）：因为目前只支持 stdio。', tags: ['必记'] },
      { name: '直接调用：List<McpSyncClient> + callTool', note: '上面的配置会被自动注入到 List<McpSyncClient> 之中，这个 list 包含所有在配置文件注册的 mcp server。clientInfo 表示当前客户端的信息，serverInfo 表示对应服务端的信息，两者一一对应，与前面学的 Host/Client 概念一致。调用代码：遍历 mcpSyncClients，按 clientInfo.title().contains(type) 匹配目标 server，构建 McpSchema.CallToolRequest.builder().name("getWeather").arguments(param).build()（param 是 Map，city=北京），client.callTool(request) 返回 McpSchema.CallToolResult。如实标注：原文本节代码块在闪存复制时丢失了空格与换行（如 publicMcpSchema.CallToolResultcallTool），以上要点由可辨认的代码读出。' },
      { name: '智能体调用：SyncMcpToolCallbackProvider → ChatClient', note: '将 SyncMcpToolCallbackProvider 注入到 ChatClient 即可实现智能体对 mcp server 的接入：@Autowired SyncMcpToolCallbackProvider toolCallbackProvider 与 OpenAiChatModel chatModel；@PostConstruct init() 里 ToolCallback[] toolCallbacks = toolCallbackProvider.getToolCallbacks()，再 ChatClient.builder(chatModel).defaultToolCallbacks(toolCallbacks).build()。之后 chat(userMessage) 直接 chatClient.prompt().user(userMessage).call().content()，由大模型自主决策调用 MCP 工具。' },
      { name: '手动构建：三种 Transport + initialize()', note: 'Stdio：ServerParameters.builder("java").args("-jar", jar路径).build() → new StdioClientTransport(parameters, McpJsonMapper.createDefault())；SSE：HttpClientSseClientTransport.builder("http://127.0.0.1:8003").sseEndpoint("/sse").build()；Streamable：HttpClientStreamableHttpTransport.builder("http://127.0.0.1:8004/stream/test/").endpoint("api/mcp").build()。三者统一用 McpClient.sync(transport).clientInfo(new McpSchema.Implementation("xx-client","1.0")).requestTimeout(Duration.ofSeconds(10)).build() 构建，且都必须调用 initialize()。最后 SyncMcpToolCallbackProvider.builder().mcpClients(clients).build() 取 getToolCallbacks() 注入 ChatClient，调用方式与自动注入完全相同。' },
      { name: '坑：endpoint 与 baseUri 一定要分开写 ★', note: '作者强调（加粗）：手动配置 HttpClientSseClientTransport 和 HttpClientStreamableHttpTransport 的时候，endpoint 要和 baseuri 建议一定要分开写——这跟 Spring AI 的 URI 解析方式有关，如果融合在一起，会导致解析错误，报错 404。（具体斜杠规则见本分支《神奇的 context-path》一篇。）', tags: ['必记'] }
    ]
  },

  'd0054': {
    note: '源码级拆解两条链路：注入链（type=SYNC 触发自动配置 → NamedClientMcpTransport 构建通道 → McpSyncClient → SyncMcpToolCallbackProvider 包装成 SyncMcpToolCallback）与调用链（ChatClient → Advisor 链末端 ChatModelCallAdvisor → OpenAiChatModel.internalCall 判断 tool_calls → executeToolCalls → toolCallback.call → mcpClient.callTool，递归总结直到不再输出 tool_calls）。',
    tags: ['已精读', 'Spring AI', '实现原理'],
    kids: [
      { name: '注入链：自动配置 → Transport → Client → Callback ★', note: '作者结论（加粗）：设置 spring.ai.mcp.client 的 type=SYNC（异步就是 ASYNC）就可以触发自动注入的逻辑。SyncMcpToolCallbackProvider 的初始化在 McpToolCallbackAutoConfiguration 之中；入参 McpSyncClient 同样来自一个 autoconfiguration，核心是 NamedClientMcpTransport——它是一个 record，从调用类可见包含 stdio、sse、streamable 三种，各自的自动配置类读取 properties 构建 transport 通道；McpClientAutoConfiguration 还对 mcpclient 进行初始化并加入 List<McpSyncClient>，提供给 SyncMcpToolCallbackProvider 供后续 chatclient 使用。版本差异（加粗）：Spring AI 1.1.0-M4 版本这部分逻辑变化较大；1.1.0 之前是通过 event 机制触发初始化——实现 McpToolsChangedEvent 事件 listener，事件由 McpSyncToolsChangeEventEmmiter 发布，而这个类又是从 McpClientAutoConfiguration 中 new 出来的。', tags: ['必记'] },
      { name: 'SyncMcpToolCallback.call：模型参数到 MCP 请求的桥', note: 'getToolCallbacks 对 McpSyncClient 做转换处理，包装成 SyncMcpToolCallback——将概念的工具转换成具有可执行能力的工具，具备工具的定义、元数据、执行逻辑。call(String toolCallInput, @Nullable ToolContext toolContext) 流程（作者加了中文注释）：① 兜底——参数为空就用 "{}" 并 logger.warn；② ModelOptionsUtils.jsonToMap 把模型传来的 JSON 字符串参数转成 Map；③ toolContext 非空时用 toolContextToMcpMetaConverter 转换元数据；④ CallToolRequest.builder().name(this.tool.name()).arguments(arguments).meta(mcpMeta).build()；⑤ this.mcpClient.callTool(request)；异常或 response.isError() 为 true 都抛 ToolExecutionException；成功则 ModelOptionsUtils.toJsonString(response.content()) 把工具返回内容序列化成 JSON 字符串返回给模型。' },
      { name: '调用链：Advisor 链末端才调大模型 ★', note: '从 chatClient 的 call 方法进入默认实现类 DefaultChatClient，其中 buildAdvisorChain 方法（加粗）：将你在 chatclient 中设置的 advisor 构建成一个链，而 ChatModelCallAdvisor（非流式）和 ChatModelStreamAdvisor（流式）位于这个链的末端，也就是最后执行调用大模型。作者演示未设置任何 advisor，以非流式为例进入 ChatModelCallAdvisor，再跟进到 OpenAiChatModel 的 internalCall：① createRequest 构造请求；② 设置 ChatModelObservationContext 监控上下文记录请求响应；③ retryTemplate.execute 调 openAiApi.chatCompletionEntity；④ 解析 choices 映射成 generations；⑤ UsageCalculator 汇总 token 使用量；⑥ 包装成 ChatResponse 返回。', tags: ['必记'] },
      { name: '工具循环：tool_calls 判断 + returnDirect + 递归 ★', note: 'internalCall 第 7 步核心重点（代码注释加粗）：toolExecutionEligibilityPredicate.isToolExecutionRequired(prompt.getOptions(), response) 判断是否要求调用工具；是则 toolCallingManager.executeToolCalls(prompt, response) 执行；若 toolExecutionResult.returnDirect() 为 true（仅仅调用工具不需要总结），直接构建结果返回、终止循环；否则把 toolExecutionResult.conversationHistory() 拼成新 Prompt 递归调用 internalCall，直到模型不再输出 tool_calls 才停止。conversationHistory 是拼接的上下文信息（加粗）：包括用户的原始问题、大模型返回的 tool_calls、工具返回的结果，一起拼接成新的 prompt 传递给下次模型调用。具体执行落在 DefaultToolCallingManager.executeToolCalls → executeToolCall → toolCallback.call——正是注入的 SyncMcpToolCallback，闭环回到 mcpClient.callTool。总结：chatclient 利用默认的 ChatModelAdvisor 执行工具调用，先调大模型、判断 tool_calls、调 SyncMcpToolCallback，再根据 returnDirect 决定直接返回还是再次抛给大模型总结输出。', tags: ['必记'] }
    ]
  },

  // ---------- 生产化改造（g-mcp-prod） ----------
  'd0055': {
    note: '如实标注：原文仅代码——一个完整的 RetrySSEMcpServer 类，没有任何文字讲解。以下要点均由代码读出：每 5 秒定时 ping 探活，失败则单线程循环重建 SSE Client 并重新 initialize（间隔 10 秒），成功后必须连同 ChatClient 一起重建；AtomicBoolean 保证只有一个重试线程。',
    tags: ['已精读', 'MCP 生产化', 'SSE 重连', '原文仅代码'],
    kids: [
      { name: '探活：@Scheduled 每 5 秒 ping 一次', note: '@Service RetrySSEMcpServer 中 pingSse() 标注 @Scheduled(fixedDelay = 5000)，调用 sseClient.ping()；sseClient 为 null（尚未初始化）或 ping 抛异常，都会触发 startRetryInitialize()。客户端构建：HttpClientSseClientTransport.builder("http://127.0.0.1:8003").sseEndpoint("/sse")，McpClient.sync(transport).clientInfo(Implementation("sse-client","1.0")).requestTimeout(Duration.ofSeconds(10))。@PostConstruct init() 里先 buildClient() + initialize()，首次初始化失败不阻塞启动，而是 log.error 后启动重试线程（注释：will rely on retry thread），随后照常构建 SyncMcpToolCallbackProvider 与 ChatClient。' },
      { name: '重连：单线程循环重建，ChatClient 也要重建 ★', note: 'startRetryInitialize() 用 AtomicBoolean retrying.compareAndSet(false, true) 保证只启动一个重试线程（Executors.newSingleThreadExecutor()）。循环体：buildClient() 重建 sseClient → initialize() → 用新 client 重建 SyncMcpToolCallbackProvider 和 ChatClient（代码注释明确写着「chatclient 也同样需要重建」，即重连不只是恢复传输层，工具注入链要整体重建）；成功则 retrying.set(false) 并 return，失败则 log.warn 后 Thread.sleep(10000) 再重试。对外 chat(userMessage) 仍是 chatClient.prompt().user(...).call().content()。', tags: ['必记'] }
    ]
  },

  'd0056': {
    note: 'HTTP 明文 MCP 在金融/运营商/政府等行业被直接判定不合规，必须升级 HTTPS/TLS；服务端用 keytool 自签 p12 证书 + Spring Boot ssl 配置（生产应改用合法域名证书 + Nginx 反向代理）；客户端两条路：内网/开发/应付合规用「信任所有证书」，生产用「加载 CA 证书」正规校验。',
    tags: ['已精读', 'MCP 生产化', 'HTTPS'],
    kids: [
      { name: '为什么必须 HTTPS：中间人攻击与合规判定 ★', note: 'MCP 是连接大模型与企业数据、业务系统、外部工具的关键协议，安全性重要程度不亚于传统 API。HTTP 属于明文传输协议（加粗），无论公司内网还是跨服务调用都容易遭受中间人攻击（MITM）：攻击者只需监听网络流量，就能轻易获取 MCP 请求内容、上下文数据、模型输出甚至用户敏感信息。作者判断（加粗）：在对安全性要求严格的企业环境，尤其是金融、运营商、政府、网络安全厂商中，HTTP 版 MCP Server 通常被直接判定为不合规，必须强制升级为 HTTPS/TLS 加密传输才能上线，确保所有 SSE/Streamable HTTP 通道都在受保护的链路上运行。', tags: ['必记'] },
      { name: '服务端：keytool 自签证书 + ssl 配置', note: '改造流程与普通 Web 服务一致：准备证书、配置 TLS、暴露 HTTPS 端点。演示命令：keytool -genkeypair -alias local-ssl -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 3650 -storepass 123456 -keypass 123456 -dname "CN=localhost, OU=Dev, O=Demo, L=Local, ST=Local, C=CN" -ext "SAN=IP:127.0.0.1,DNS:localhost" -ext "BasicConstraints=ca:true"（如有重复生成先 keytool -delete 旧 alias）。生成的 keystore.p12 放入 resources，配置 server.port: 8443、ssl.key-store: classpath:keystore.p12、key-store-password: 123456、key-store-type: PKCS12、key-alias: local-ssl、enabled: true。作者明确：实际生产环境肯定不是这样做，应当用合法方式申请域名证书，并使用 nginx 进行反向代理，这里为演示方便才用自签证书。' },
      { name: '客户端路 A：信任所有证书（内网/开发/合规） ★', note: '作者定位（加粗）：如果你是纯公司内网环境或者开发环境，甚至说白了就是为了应付公司的合规性检查，可以使用跳过 https 的方式，也就是信任所有证书。实现 createInsecureHttpsClient：① 自定义 X509TrustManager，getAcceptedIssuers 返回空数组、checkClientTrusted/checkServerTrusted 空实现；② SSLContext.getInstance("TLS").init(null, trustAllCerts, new SecureRandom()) 绕过校验；③ SSLParameters.setEndpointIdentificationAlgorithm(null) 禁用主机名验证；④ HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).sslContext(...).sslParameters(...) 重建 httpClient，再 HttpClientSseClientTransport.builder(baseUrl).sseEndpoint(endpoint).clientBuilder(httpClient).build() → McpClient.sync(transport).build() → initialize()。', tags: ['必记'] },
      { name: '客户端路 B：加载 CA 证书（生产环境）', note: 'createSecureHttpsClient：① CertificateFactory.getInstance("X.509") 从 caCertPath 加载 CA 证书；② KeyStore.getInstance(默认类型) 空加载后 setCertificateEntry("caCert", caCert)；③ TrustManagerFactory 用该 KeyStore init；④ SSLContext.getInstance("TLS").init(null, tmf.getTrustManagers(), new SecureRandom())；⑤ 使用默认 Hostname 验证（不禁用），HttpClient 同样 connectTimeout 30s；⑥ 构建 SSE Transport 并 initialize，成功打印「生产环境 MCP Client 初始化成功」。配套下发公钥证书命令：keytool -exportcert -alias local-ssl -keystore keystore.p12 -storetype PKCS12 -storepass 123456 -rfc -file mcp-server.crt，从 p12 服务器证书导出 crt 给客户端使用。' },
      { name: '本地测试坑：证书没配 SAN 要禁用主机名校验', note: '如果在本地测试环境中证书没有配置 SAN，需要注意忽略主机名校验，启动时添加 JVM 参数：-Djdk.internal.httpclient.disableHostnameVerification=true。作者通过 main 函数直接测试，验证已能正常连接到 HTTPS 服务（连接效果为原文截图）。' }
    ]
  },

  'd0057': {
    note: '生产级 MCP 必须同时解决传输安全（HTTPS）与访问控制（认证鉴权）；Stdio 本地服务靠 env 传 KEY 只适合单人，企业多用户场景 KEY 会被覆盖、必须按用户传 token；远端 SSE/Streamable 统一用请求头 Bearer Token——服务端 Interceptor 校验，客户端 requestBuilder 注入 Authorization 头。',
    tags: ['已精读', 'MCP 生产化', '认证鉴权'],
    kids: [
      { name: '两个安全支柱：传输安全 + 访问控制', note: 'MCP 本质上允许客户端调用各种工具，这些工具可能访问数据库或内部系统 API；一旦缺乏认证和访问控制，非授权客户端就可能冒充合法用户，通过 MCP 调用敏感功能，导致数据泄露、系统滥用甚至破坏性操作。真正可用于生产环境的 MCP Server 至少需要解决两个安全问题：传输安全——通过 HTTPS 确保数据在传输过程中不被窃取或篡改；访问控制——通过认证和鉴权机制（如请求头携带 Bearer Token）防止工具被任意调用。只有同时保障这两点，MCP 服务才具备生产环境下的安全能力。MCP Server 分本地服务（Stdio）和远端服务（SSE、Streamable），两类服务的认证方式有所区别。' },
      { name: 'Stdio 本地认证：env KEY，多用户场景失效 ★', note: '去 MCP Server 市场随便找几个公开 Server，都是通过设置 env 环境变量来控制权限的——本质是在本地环境设置一个环境变量 KEY 区分访问权限，对个人使用的智能体环境可行（使用者只有你自己）。但企业场景中 MCP Server 通常不是单人使用：不同用户访问的数据范围可能不同，就必须通过传入 token 来区分每个用户的数据权限（加粗）；而如果 MCP Server 是 stdio 类型，本地环境变量 KEY 会被覆盖（加粗），无法实现按用户区分的数据权限控制，因此不适合企业级多用户场景。代码示例 initializeTavilyMcp()：env.put("TAVILY_API_KEY", "tvly-dev-xxx")，按 System.getProperty("os.name") 判断 Windows 用 ServerParameters.builder("cmd").args("/c","npx","-y","tavily-mcp") 否则 builder("npx").args("-y","tavily-mcp")，.env(env) 传认证 key；StdioClientTransport + loggingConsumer 打印日志 + clientInfo("SEARCH ENGINE","v1.0") + requestTimeout 10s，最后 initialize()。', tags: ['必记'] },
      { name: '远端认证：服务端拦截器校验 Bearer Token', note: 'SSE 与 Streamable 尽管交互模式不同，认证机制一致：客户端通过在请求头中加入 token 进行身份验证。服务端可沿用传统 Web 服务的认证方式，通过拦截器对请求头 token 校验即可，实现方式与常规 Web 应用完全相同（如基于 OAuth、Filter、Interceptor 等）。演示 AuthInterceptor implements HandlerInterceptor：FIXED_TOKEN="abc123456789"（演示写死）、AUTH_HEADER="Authorization"、PREFIX="Bearer "；preHandle 里 header 缺失或不以 Bearer 开头 → 401 "Missing Authorization header"，token 不等于固定值 → 401 "Invalid token"，校验成功返回 true。WebConfig implements WebMvcConfigurer 注册拦截器：addPathPatterns("/**").excludePathPatterns("/health")。启动后直接访问 SSE 端点报认证不通过，说明拦截器已生效；用之前的客户端代码跑会报 401。' },
      { name: '客户端传 token：requestBuilder 设置 Authorization ★', note: '作者点出关键（加粗）：「重点在 31 行，设置请求头」——构造 HttpRequest.newBuilder().uri(URI.create(baseUrl)).header("Authorization", "Bearer abc123456789")，然后 HttpClientSseClientTransport.builder(baseUrl).sseEndpoint(endpoint).clientBuilder(httpClient).requestBuilder(requestBuilder).build()，通过 requestBuilder 的 header 注入 Authorization 即可。其余部分复用上一篇 HTTPS 改造的信任所有证书逻辑（X509TrustManager + SSLContext + 禁用主机名验证），合起来完成 HTTPS + 认证的双重改造，再 McpClient.sync(transport).build() + initialize()。', tags: ['必记'] }
    ]
  },

  'd0058': {
    note: '作者亲身经历 + Spring AI issues #4168/#2512：context-path 是 MCP SSE/Streamable 的隐蔽 404 深坑。根因是 URI 解析规则——endpoint 带前导 / 会覆盖 baseUrl 路径，正确写法是 baseUrl 以 / 结尾 + endpoint 不带前导 /；新旧 Spring AI 版本对 SSE 消息端点前缀处理不同，混用必不兼容。结论：尽量不要给 MCP Server 配 context-path。',
    tags: ['已精读', 'MCP 生产化', 'context-path'],
    kids: [
      { name: 'Streamable 404 根因：URI 解析两条规则 ★', note: 'server.servlet.context-path 在微服务/多模块 Web 应用中很常见（给每个服务分配独立路由前缀），但对 MCP 的 SSE 机制来说可能成为让系统无法通信的关键因素，尤其 Server 与 Client 版本混用时容易掉进兼容性深坑（原文引用 spring-ai issues #4168、#2512）。Streamable Server 加 context-path: /stream/test 后，实际地址变为 http://127.0.0.1:8004/stream/test/api/mcp；客户端想当然把 context-path 拼进 baseUri、endpoint 仍写 "/api/mcp"，会报错 404。根源（加粗）在 HttpClientStreamableHttpTransport 解析 uri 和 endpoint 的工具类：如果 endpoint 以 / 开头，baseUrl.resolve("/xxx") 会把 baseUrl 的 path 覆盖掉（得到 http://host/xxx），也就是抹掉 context-path；如果 endpoint 不以 / 开头，解析会把它当作相对路径附加到 baseUrl 的路径上。', tags: ['必记'] },
      { name: '推荐写法：baseUrl 尾斜杠 + endpoint 无前导斜杠 ★', note: '正确组合（加粗推荐写法）：builder("http://127.0.0.1:8004/stream/test/")（注意尾斜杠）+ .endpoint("api/mcp")（注意没有前导 /）→ 解析为 http://127.0.0.1:8004/stream/test/api/mcp。两个常见错误：① baseUrl 无尾 / + endpoint "api/mcp" → 解析成 http://127.0.0.1:8004/stream/api/mcp（丢了 /test），404；② endpoint 以 / 开头（"/api/mcp"）→ http://127.0.0.1:8004/api/mcp，context-path 被抹掉，404。也可以 endpoint 暴力设置绝对路径（builder("http://127.0.0.1:8004").endpoint("http://127.0.0.1:8004/stream/test/api/mcp")），但作者不推荐：逻辑混乱、违背 URI 拼接逻辑，baseUri 仅剩 scheme 和 ip 地址的校验作用。', tags: ['必记'] },
      { name: 'SSE：base-url 配置 + 新旧版本前缀不兼容 ★', note: 'SSE Server 增加 context-path: /test 的同时还要增加重要参数 base-url: /test；改完后浏览器访问 SSE 监听地址，返回的 data（message 端点）前面也多了前缀根路径 /test。版本差异（加粗）：旧版本（如 Spring AI 1.0.0-M7）返回的 data 不带这个前缀，框架默认去发消息的时候会添加前缀；新版本（Spring AI 1.1.0）处理方式完全变了——假如用旧版本做 MCP Server、新版本 MCP Client 来连接，就会连接不通，这就是所谓的兼容性问题。SSE Client 与 Streamable 规则一致：builder("http://127.0.0.1:8003/test/").sseEndpoint("sse")，多一个斜杠少一个斜杠都会 404。', tags: ['必记'] },
      { name: '作者结论：能不配 context-path 就不配 ★', note: '作者总结（加粗）：如果可以的话，尽量不要为 MCP Server 配置 context-path——无论 Streamable 还是 SSE 都对路径的精确匹配高度敏感，一旦存在多余前缀就会导致客户端无法连接、消息端点错位、版本兼容性混乱等问题。如果确实必须使用：严格按推荐方式配置（尾斜杠 + 无前导斜杠），并保证客户端与服务端框架版本的一致性（Spring AI 新旧版本 SSE 不兼容的问题，同样是因为对 context-path 的解析方式的问题）、路径规范保持统一，才能避免实际生产中连接失败、协议不兼容等隐蔽且难排查的问题。', tags: ['必记'] }
    ]
  },

  'd0059': {
    note: 'MCP 官方可视化调试工具 MCP Inspector：npx @modelcontextprotocol/inspector@latest 启动（作者当时最新 0.17.5），浏览器访问 http://localhost:6274/，支持 Stdio/SSE/Streamable 三种传输，Tools 页可在线填参 Run Tool；两个坑：旧版 0.7.0 不支持带 context-path 前缀的 SSE、不认自签名证书。',
    tags: ['已精读', 'MCP 调试', 'Inspector'],
    kids: [
      { name: '定位与启动：官方 Web UI 调测工具', note: 'MCP Inspector 是 MCP 官方推出的可视化调测与调试工具，帮助开发者快速验证 MCP 服务器实现是否符合规范，便捷查看工具（tools）、资源（resources）、事件（events）等内容；以独立 Web UI 运行，能与本地或远程 MCP Server 建立连接、实时展示通信内容，是目前最方便的 MCP 开发辅助工具之一。安装要求本地有 Node.js 环境；启动命令 npx @modelcontextprotocol/inspector@latest（不指定版本默认下载最新，作者当时最新版本 0.17.5）；浏览器访问 http://localhost:6274/，右上角 Transport Type 包含 3 种类型：Stdio、SSE、Streamable。' },
      { name: '三种传输的接入与在线调试', note: 'Streamable：URL 输入框填 http://127.0.0.1:8004/stream/test/api/mcp，连接成功后点 Tools 页签看到所有工具列表，还可在线调试——点击工具名称 → 填写参数 → Run Tool → 获取结果。SSE：URL 输入 http://localhost:8003/test/sse。Stdio：命令填 java -jar D:/LLMentor/LLMentor/mcp/mcp-server-stdio/target/mcp-server-stdio-1.0.0-SNAPSHOT.jar。' },
      { name: '两个坑：旧版前缀 SSE + 自签名证书 ★', note: '作者实测：使用旧版本 inspector 0.7.0 时不支持带前缀（context-path）的 SSE，新版本已经解决了这个 BUG。并且这个工具也不认自签名证书，所以本地调试时需要改成 HTTP 来调试。作者补充：正常情况下也不会在 springboot 项目里直接使用 https，生产上更常见的方式其实是用 nginx 来转发 https 的。', tags: ['必记'] }
    ]
  },

  'd0060': {
    note: '默认工具结果会回灌大模型做迭代总结，但多 Agent 中间结果、结构化业务数据、已经过模型推理的 AI 工具（如 LightRAG）不需要也不该再总结。Spring AI 的 @Tool(returnDirect=true) 对 MCP 不生效——SyncMcpToolCallback 没实现元数据；解法：继承 SyncMcpToolCallback 与 Provider，重写 getToolMetadata 把 returnDirect 透传进去。',
    tags: ['已精读', 'MCP 生产化', 'returnDirect'],
    kids: [
      { name: '为什么要跳过模型总结：三类场景 ★', note: '默认机制：大模型决策选择工具、框架调用工具结束后，会将工具执行结果再次丢给大模型做迭代总结（加粗），好处是回答更自然贴近需求，但不是所有场景都合适，有时甚至成为性能瓶颈。① 多智能体协作（Multi-Agent）：多个 Agent 持续调用工具、互相传递结果，中间过程只需要获取结果，不必每步都让模型总结一遍，最终把中间结果一起抛给最后一个总结智能体流式输出，体验更好；② 工具本身输出就是最终答案：很多 MCP 工具职责是提供业务结果而不是给模型做二次润色的素材（加粗），返回的通常是结构化、可直接使用的业务数据（JSON、对象、列表等），再总结不但增加延迟、提高 token 成本，模型的主观性还可能破坏结构化数据、把数据重新组织甚至失真；③ AI 工具本身已经过模型推理：如 LightRAG 内部已走完「检索 → 推理 → 生成」全流程，返回的往往是经过模型深度处理的最终结果，强行再总结不仅没有价值，还可能把原本严谨的推理结果变得混乱。作者总结：当只需要模型负责工具决策与参数生成、不需要它对结果改写时，跳过模型总结不仅是优化，更是工程上最合理的选择。如实标注：原文多处举例列表为空项（内容在截图里），正文未给出完整示例文本。', tags: ['必记'] },
      { name: 'returnDirect 对 MCP 不生效：源码定位 ★', note: 'Spring AI 提供 returnDirect 参数选择是否跳过模型迭代总结：@Tool(description="根据城市名称查询天气信息", returnDirect=true)。但实测完全没作用，还是二次总结了。源码链：DefaultToolCallingManager 的 executeToolCall 会从 toolcallback 的 toolmetadata 中获取 returnDirect；ToolCallback 接口提供的默认 getToolMetadata 方法返回其实就是 false；而 MCP 方式用的 SyncMcpToolCallback 完全没有对这个元数据进行实现——也就是说在 MCP Server 中设置的参数没传过来、没有生效，作者吐槽「天塌了，这不就是不支持嘛」。对比验证：FunctionToolCallback（传统 Function-Call，本地调用）有元数据的相关操作，把注入方式改为 .defaultTools(new WeatherService())（注意不是远程调用，function call 是本地调用，需在同项目重建 WeatherService），断点处 returnDirect 已读取到 true，跳过生效。结论：这个参数功能对于 MCP 而言就是 Spring AI 没有帮我们实现。', tags: ['必记'] },
      { name: '解法：继承两个类，把 returnDirect 透传 ★', note: '核心问题在于如何接管 SyncMcpToolCallback（加粗），而它是在注入工具时由 SyncMcpToolCallbackProvider 内部初始化的——用继承修改获取元数据的方式即可动态传入 returnDirect。① ReturnDirectSyncMcpToolCallback extends SyncMcpToolCallback：构造器接收 (McpSyncClient client, McpSchema.Tool tool, boolean returnDirect)，只需重写 getToolMetadata() 返回 ToolMetadata.builder().returnDirect(returnDirect).build()；② DirectReturnMcpToolCallbackProvider extends SyncMcpToolCallbackProvider：重写 getToolCallbacks()，遍历 mcpClients 调 listTools().tools()（异常则跳过该 MCP 继续处理其它的），每个 tool 包装成带 returnDirect 的自定义 Callback，validateToolCallbacks 用 ToolUtils.getDuplicateToolNames 查重名、有重复抛 IllegalStateException("Multiple tools with the same name")；③ 注入改为 new DirectReturnMcpToolCallbackProvider(clients, true) → ChatClient.builder(chatModel).defaultToolCallbacks(callbackProvider).build()。实测成功跳过模型的迭代总结。如实标注：原文 provider 代码里 new 的是 CustomSyncMcpToolCallback，与上文定义的类名 ReturnDirectSyncMcpToolCallback 不一致，应为作者笔误。', tags: ['必记'] },
      { name: '延伸：重写 call 做定制化处理', note: '作者指出（加粗）：通过继承的方式重写了 provider 和 toolcallback 类成功跳过 MCP 模型总结，甚至还可以重写 SyncMcpToolCallback 的 call 方法，在调用 MCP 工具时做一些定制化的处理，留给大家自己尝试。另外原文提到「为什么跳过后结果里会有 text」需要去看 SyncMcpToolCallback 的 call 方法的返回值（具体解释在截图里，正文未给出文本；结合《Spring AI MCP 调用实现原理》篇可知 call 会把 response.content() 序列化成 JSON 字符串返回）。' }
    ]
  },

  'd0061': {
    note: '企业级 MCP Server 工具多时必须在 Client 侧过滤：降上下文/Token 负担、提升模型选择准确性、保证多智能体角色原子性。Spring AI 提供 McpToolFilter（本质 BiPredicate<McpConnectionInfo, McpTool>），在 SyncMcpToolCallbackProvider.builder().toolFilter(...) 传 lambda，只把需要的工具注入智能体。',
    tags: ['已精读', 'MCP 生产化', '工具过滤'],
    kids: [
      { name: '为什么要过滤：三个理由 ★', note: '企业级复杂场景中 MCP Server 往往包含大量工具，不加区分全部交给大模型会带来明显的性能与准确性问题（加粗），在 Client 侧引入工具过滤机制是非常有必要的操作（加粗）。① 降低上下文压力与 Token 成本：每个工具都带结构化 Schema 和详细描述，会被放入系统提示词、同样占用大模型上下文；Server 有几十个工具而当前任务仅需少量，其余描述都是无意义的上下文负担，浪费 Token 还减少模型可处理的有效信息空间；② 提升模型工具选择的准确性：工具过多时模型在更大候选集合中判断，干扰项越多，选错工具或产生幻觉的概率越高，过滤后模型在更干净有用的列表中决策，显著提高调用成功率和推理质量；③ 多智能体角色划分：如网络安全领域，告警分析智能体只需要告警查询工具、资产分析智能体只需要资产查询工具，不过滤则所有智能体看到全部接口，增加复杂度还可能误调用甚至越权；过滤为每个智能体提供精确的工具可见性，确保单智能体的功能原子性（加粗），更安全、职责更清晰。', tags: ['必记'] },
      { name: '原理：McpToolFilter = BiPredicate<McpConnectionInfo, McpTool> ★', note: '在 SyncMcpToolCallbackProvider 的 getToolCallbacks 方法中（将 McpSyncClient 转换成 toolcallback 时），会用 McpToolFilter 对 MCP Server 中的工具进行 test 过滤，控制要不要构建 SyncMcpToolCallback。McpToolFilter 继承于 BiPredicate（加粗）——Java 8 引入在 java.util.function 包下的函数式接口，抽象方法 boolean test(T t, U u)，接收两个输入返回 boolean，可用 Lambda 或方法引用构造（示例 BiPredicate<String,Integer> myCheck = (s,i) -> s.length() > i）。两个入参：McpConnectionInfo（连接的 Server 信息）+ McpTool（连接中的工具本身）；本质是 BiPredicate<McpConnectionInfo, McpTool>（加粗），以 (MCP 连接信息, 单个工具) 为输入逐个判断，返回 true 表示保留该工具、false 表示丢弃该工具。', tags: ['必记'] },
      { name: '实战：toolFilter 只保留 weather 前缀工具', note: 'Server 端 WeatherService 定义 4 个 @Tool 并显式给 name：weatherQueryByCity（根据城市名称查询天气信息）、weatherForecast（查询未来天气预报）、weatherAlert（获取城市天气预警信息）三个以 weather 打头，另一个 climateIndex（查询城市气候指数）不是，用于区分过滤效果。Client 端构建 Provider 时传入过滤表达式：SyncMcpToolCallbackProvider.builder().mcpClients(clients).toolFilter((conn, tool) -> tool.name().startsWith("weather")).build()——只有工具名称 weather 开头的才返回 true、才能被注入使用。运行验证：生成的 toolcallback 不是 4 个而是 3 个 weather 开头的工具。作者：大家可以根据业务实际情况选择合适的过滤方式，只要去设置 BiPredicate 表达式即可。' }
    ]
  }
});