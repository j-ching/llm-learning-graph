/* b-lc4j「04 LangChain4J」分支精读笔记（7 篇：6 篇正文精读 + 1 篇内容异常）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- API 分层 ----------
  'd0034': {
    note: 'LangChain4j 入门：LangChain 之于 LLM 应用如同 JDBC 之于数据库（统一接口解耦「模型-数据-业务」），LangChain4j 是其 Java 版，能力与 Spring AI 几乎对齐；提供低层次（Basics+RAG）与高层次（Chains+AI Services）两级抽象。',
    tags: ['已精读', 'LangChain4J'],
    kids: [
      { name: '定位：LangChain≈JDBC，LangChain4j=Java 版', note: 'LangChain 是简化 LLM 应用开发的开源框架，作者类比它像数据库领域的 JDBC：用统一接口连接不同 LLM（GPT-4、ChatGLM）与外部工具（数据库、API），实现「模型-数据-业务」解耦；提示词、记忆、RAG、链式调用、Agent 都可借它实现。官方只有 Python/JS 版，Java 开发者用着不便，LangChain4j 就是 Java 版。作者判断：LangChain4J 作用与 Spring AI 差不多，「Spring AI 中有的东西，LangChain4J 也几乎都有的」（提示词工程/模板、对话记忆、结构化输出、RAG、Agent、MCP）。' },
      { name: '两级抽象：低层次 Basics+RAG vs 高层次 Chains+AI Services', note: '低层次提供两类接口：Basics（大模型、提示词模版、模型记忆）与 RAG（向量模型、向量数据库、文本载入分割工具），开发者可灵活组合、定制自己的应用。高层次让 Java 开发者专注业务而非底层，含两种：Chains（源于 LangChain，把低层模块组合成固定处理流程并协调交互）与 AI Services（为 Java 量身定制，类似 Spring Data JPA——只需显式定义接口，可自定义加入 Memory/Tools/RAG，具体调用逻辑由 LangChain4j 代理完成）。' },
      { name: '接入：两个依赖坐标 + 五项配置 + 注入 OpenAiChatModel', note: '依赖 dev.langchain4j:langchain4j:1.8.0（核心包）与 dev.langchain4j:langchain4j-open-ai-spring-boot-starter:1.8.0-beta15（starter，内部初始化了一些 bean 定义）。application.properties 配 langchain4j.open-ai.chat-model.api-key={YOUR_KEY}、model-name=qwen-max-latest、base-url=https://dashscope.aliyuncs.com/compatible-mode/v1、log-requests=true、log-responses=true（后两项开启日志，方便查看与模型交互的提示词和响应）。代码里 @Autowired OpenAiChatModel chatModel，直接 chatModel.chat("你好,你是谁？") 即可对话；OpenAiChatModel 由该 starter 定义并自动读取 langchain4j.open-ai 配置。' }
    ]
  },

  'd0035': {
    note: '原文正文异常：标题为「低层次 API 使用」，但读取到的全文仅一段 HttpException 400 异常堆栈，没有任何低层次 API 的教程讲解（疑似闪存抓取不全或原文以截图为主）。堆栈中的报错与版本信息已提炼如下；低层次 API 正文待对照原文链接补读。',
    tags: ['内容异常', '待补'],
    kids: [
      { name: '唯一正文：结构化输出触发 400 的异常堆栈', note: '全文是一个代码块，内容为 dev.langchain4j.exception.HttpException: 400 Bad Request，错误码 invalid_parameter_error，消息：<400> InternalError.Algo.InvalidParameter: \'messages\' must contain the word \'json\' in some form, to use \'response_format\' of type \'json_object\'。含义：用 response_format=json_object 做结构化输出时，messages 里必须以某种形式出现 json 字样，否则 DashScope 兼容端点拒绝并返回 400。异常抛自 LangChainController.structure(LangChainController.java:156)。原文没有围绕它的低层次 API 用法说明。' },
      { name: '堆栈附带信息：调用链与依赖版本', note: '从堆栈可读出低层次调用链：ChatModel.chat → OpenAiChatModel.doChat → SyncRequestExecutor/RequestExecutor → SpringRestClient.execute。涉及版本：langchain4j-open-ai 与 langchain4j-core 1.8.0、langchain4j-http-client-spring-restclient 1.8.0-beta15，运行于 spring-web 6.2.6 + tomcat-embed-core 10.1.40。这些只是堆栈附带信息，不能替代缺失的低层次 API 教程正文。' }
    ]
  },

  'd0036': {
    note: 'LangChain4J 高层次 API 实战：以 @AiService 注解 + AiServices 构建器为核心，覆盖声明式对话、Flux 流式、提示词注解、结构化输出、@MemoryId 记忆隔离、工具调用与 ToolProvider 按需加载；最大坑是带记忆的 AiService 必须单例初始化。',
    tags: ['已精读', 'LangChain4J'],
    kids: [
      { name: '@AiService 声明式对话：依赖与自动装配', note: '需引入 dev.langchain4j:langchain4j-spring-boot-starter:1.8.0-beta15 才能用 @AiService 注解（注意与入门篇的 open-ai-spring-boot-starter 不是同一个）。高层 API 以 dev.langchain4j.service.AiServices（编程式构建入口）与 dev.langchain4j.service.spring.AiService（@AiService 注解）为核心。定义接口并标 @AiService、写 String chat(String userMessage)，该接口会被暴露成 Spring Bean，@Autowired 注入后调用即可；方法内部自动调用 ChatModel#chat(ChatRequest) 实现对话。方法名不必叫 chat，改成 hollis666 一样能调通。' },
      { name: '流式输出：返回 Flux<String> 必须加 langchain4j-reactor', note: '把方法返回值声明为 Flux<String> 即流式输出，但必须再引入 dev.langchain4j:langchain4j-reactor:1.8.0-beta15，否则抛 IllegalConfigurationException: Please import langchain4j-reactor module if you wish to use Flux<String> as a method return type。' },
      { name: '提示词注解 + 结构化输出（List 不支持）', note: '用 @SystemMessage、@UserMessage 在方法上加默认提示词；模板变量用双花括号 {{topic}} 表示；也支持 @UserMessage(fromResource = "your-prompt-template.txt") 从配置文件读模板。结构化输出直接让方法返回 POJO（如 Book getBooks()，实测返回 Book[title=Effective Java, author=Joshua Bloch, price=54.99]）。坑：返回 List 不支持，见 github.com/langchain4j/langchain4j/issues/3264。' },
      { name: '@MemoryId 记忆隔离 + 单例初始化坑 ★', note: '接口方法用 @MemoryId String memoryId + @UserMessage String userMessage，按 memoryId 隔离不同会话记忆。用了 @MemoryId 就必须提供 ChatMemoryProvider，否则报错 In order to use @MemoryId, please configure the ChatMemoryProvider on ...。两种装配：AiServices.builder(...).chatModel(...).streamingChatModel(...).chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10)).build()，或直接声明一个 ChatMemoryProvider 的 bean 再正常 autowire。作者踩的坑（原文强调「怎么搞都无法记忆」）：若在每个请求里都 AiServices.builder(...).build() 新建实例，chatMemoryProvider 每次都是新的，记忆永远存不住；必须只初始化一次（如让 Controller 实现 InitializingBean，在 afterPropertiesSet 里 build 一次）。HTTP 日志验证：同一 memoryId=1234 时后续请求会把之前的提问+响应一起拼进 messages，换 memoryId 则不带历史——记忆是内存维护的，靠把历史对话追加进上下文实现。', tags: ['必记'] },
      { name: '工具调用：.tools() 自动编排 + ToolProvider 按需加载', note: '相比低层次 API 手写调用流程的繁琐，高层次只需 AiServices.builder(...).tools(new TemperatureTools()).chatModel(chatModel).build()，框架自动完成「模型返回 tool_calls → 本地执行工具 → 把 role:tool 结果回传 → 生成最终答案」整个循环（和 Spring AI 一样，不用自己写一堆调用方法）。工具太多会占上下文，可用 ToolProvider 按需加载：官方示例在 lambda 里判断 userMessage 含 "booking" 才返回 ToolSpecification（get_booking_details，JsonObjectSchema.addStringProperty("bookingNumber")）经 ToolProviderResult.builder().add(spec, executor) 组装，否则返回 null，再通过 .toolProvider(toolProvider) 配置。' }
    ]
  },

  'd0037': {
    note: '@AiService 实现原理三步：启动时由 AiServicesAutoConfig 把接口 Bean 定义替换为 AiServiceFactory；运行时经 DefaultAiServices#build 用 JDK 动态代理生成实例；调用时代理 invoke 经 ChatExecutor 最终落到 chatModel/streamingChatModel。',
    tags: ['已精读', 'LangChain4J'],
    kids: [
      { name: '启动期：动态替换 Bean 定义为 AiServiceFactory', note: '接口被 @AiService 标注后，应用启动时在 dev.langchain4j.service.spring.AiServicesAutoConfig#aiServicesRegisteringBeanFactoryPostProcessor 这个 bean 的生命过程中被扫到。对每个标注接口动态替换其 Bean 定义：先 new GenericBeanDefinition 并 setBeanClass(AiServiceFactory.class)、把 aiServiceClass 作为构造参数，再通过一系列 addBeanReference 为其配置依赖组件（ChatModel、ChatMemory），最后 registry.removeBeanDefinition(aiService) + registerBeanDefinition(lowercaseFirstLetter(aiService), 新定义)，确保 Spring 初始化时用 AiServiceFactory 动态生成实现。' },
      { name: '运行期：DefaultAiServices#build 生成 JDK 动态代理 ★', note: '当用到该 bean 时调用 AiServiceFactory#getObject，进而调 dev.langchain4j.service.DefaultAiServices#build 构造代理对象。作者强调这个 build「就很重要了，主要干了两件事」，但正文未列出这两件事（疑似在截图中），随即说明：创建代理用到 java.lang.reflect.Proxy#newProxyInstance，传入一个 InvocationHandler，让代理拦截所有方法调用、进入自定义 invoke。', tags: ['必记'] },
      { name: '调用链：invoke → ChatExecutor → 最终 chatModel', note: '调用如 LangChainAiService#hollis666 时，代理的 invoke 被触发，通过一个 ChatExecutor 调用具体方法（示例走到 dev.langchain4j.guardrail.SynchronousChatExecutor#execute），作者点破「这不就是我们的 chatModel 么」——最终还是调 chatModel 实现。流式输出原理相同，只是在 InvocationHandler#invoke 里判断返回值类型，若为流式则走另一条调用链，最终调 streamingChatModel 的 chat 方法。' }
    ]
  },

  'd0038': {
    note: 'LangChain4J 持久化记忆：官方没有现成实现，需自行扩展内置 ChatMemoryStore 接口（如 Redis）；记忆由 AiServices→ChatMemory→ChatMemoryStore 三层抽象管理，每次调用按 7 步加载/追加/持久化历史，配合 @MemoryId 实现多会话隔离。',
    tags: ['已精读', 'LangChain4J'],
    kids: [
      { name: 'ChatMemoryStore 三方法 + Redis 持久化示例', note: '之前讲的是基于内存的短期记忆；持久化记忆官方没给现成实现，只能自己扩展内置接口 ChatMemoryStore：getMessages(Object memoryId)、updateMessages(Object memoryId, List<ChatMessage>)、deleteMessages(Object memoryId)。示例 RedisChatMemoryStore（@Component，注入 RedisTemplate<String,String>）：key 用 "langchain4j:chat-memory:" + memoryId，读时 ChatMessageDeserializer.messagesFromJson、写时 ChatMessageSerializer.messagesToJson，空值返回 Collections.emptyList()。可换 MySQL/Redis 等任意存储。' },
      { name: '三层抽象：AiServices → ChatMemory → ChatMemoryStore', note: 'AiServices 是代理层，自动管理消息 add/messages 生命周期；ChatMemory 是接口（实现类 MessageWindowChatMemory），负责控制记忆窗口大小与消息淘汰策略，核心方法 add(message)/messages()；ChatMemoryStore 是持久化层接口，负责消息存储读取，核心方法 getMessages()/updateMessages()。上层委托下层完成持久化。' },
      { name: '每次调用 7 步流程 + 两条实现约束 ★', note: 'AiServices 每次 LLM 调用内部按伪代码执行：1 getMessages 加载历史 → 2 加 SystemMessage → 3 加当前 userMessage → 4 updateMessages 持久化（含新用户消息）→ 5 llm.chat(history) → 6 加 AI 回复 → 7 再次 updateMessages 持久化。作者强调（原文「必须保证」）：getMessages() 返回的列表在同一次调用内必须可变且一致；updateMessages() 必须真正保存状态，否则下一次请求会丢失历史。', tags: ['必记'] },
      { name: '装配 + @MemoryId 多会话隔离 + 与 Spring AI 对比', note: '装配：AiServices.builder(...).chatMemoryProvider(memoryId -> MessageWindowChatMemory.builder().id(memoryId).maxMessages(10).chatMemoryStore(redisChatMemoryStore).build()).build()；id(memoryId) 即 conversationId，maxMessages(10) 是滑动窗口最多留 10 条，配合接口上的 @MemoryId 注解，LangChain4j 自动把 conversationId 作为 memoryId 传给 ChatMemoryStore，实现每会话独立记忆。作者对比判断：用法和 Spring AI 差不多，「应该是 Spring AI 参考了 LangChain4j，只不过自己做了些实现的扩展，更好用了」。' }
    ]
  },

  // ---------- 框架选型对比 ----------
  'd0039': {
    note: 'LangChain（Python）框架综述 + 翻译系统实战：模块化可组合地简化 LLM 应用开发，用 LCEL 的 | 操作符把「提示模板|模型|解析器」串成 Runnable Chain，再经 LangServe 一键暴露 REST API。',
    tags: ['已精读', '框架选型'],
    kids: [
      { name: '定位与三大优势', note: '作者开篇加粗：LangChain 是非常知名的开源框架，主要作用是简化基于 LLM 构建应用的过程，提供模块化、可组合的工具与抽象，把 LLM 与外部数据源、记忆、工具调用结合，构建问答系统/Agent/文档分析/聊天机器人。三大优势（原文加粗）：降低开发复杂度（避免重复造轮子、快速搭原型）、支持 RAG 架构（轻松接私有知识库提升准确性）、生态丰富（支持数十种 LLM、向量数据库、文档格式）。' },
      { name: '核心功能清单', note: '封装主流 LLM（OpenAI、Anthropic、Hugging Face）统一接口；提示模板 PromptTemplate + 输出解析 OutputParser；把提示+模型+解析器串联成工作流；文档加载器 Document Loaders、文本分割器 Text Splitters；向量存储 Vector Stores + 检索器 Retrievers 实现 RAG；ConversationBufferMemory 保留对话上下文；让 LLM 动态调用工具（搜索/计算器/数据库查询）；支持 ReAct、Plan-and-Execute 推理策略；可追踪执行过程便于调试/日志/监控。' },
      { name: '翻译系统实战：LCEL 流水线与依赖', note: '环境用 uv init langchain_test → uv venv → source .venv/bin/activate。组件：ChatPromptTemplate.from_messages([system "Translate the following into {language}:", user "{text}"])（模板变量动态注入）；ChatOpenAI(model="deepseek-v3", base_url=DashScope 兼容端点, temperature=0.7)（OpenAI 兼容模式调阿里云 DashScope 的 DeepSeek）；StrOutputParser() 把 AIMessage 转纯字符串。核心 chain = prompt_template | model | parser 即 LCEL（LangChain Expression Language）的 | 操作符，构成 Runnable Chain：输入→提示模板→模型调用→输出解析。依赖 uv add langserve fastapi langchain_openai sse_starlette uvicorn，uvicorn 起在 localhost:8000。' },
      { name: 'LangServe：把 chain 自动变成 REST API', note: 'add_routes(app, chain, path="/chain") 基于 FastAPI 自动为 chain 生成 RESTful 端点（/chain/invoke、/chain/stream 等），支持异步、OpenAPI 文档、自动请求/响应验证；运行后经 http://localhost:8000/chain/playground/ 访问调试页。' }
    ]
  },

  'd0040': {
    note: '框架选型速查表：正文仅 5 条加粗选择规则，按项目类型/团队熟悉度/应用复杂度在 LangChain4j、Spring AI、Spring AI Alibaba 间取舍（原文标题在目录中被截断，正文没有展开论证，只有这 5 条结论）。',
    tags: ['已精读', '框架选型'],
    kids: [
      { name: '选 LangChain4j 的三种场景', note: '原文加粗规则：① 非 Spring、或 Spring Boot 版本低于 3.0 的纯 Java 项目 → 选 LangChain4j；② 需要快速原型验证、且熟悉 LangChain 概念 → 选 LangChain4j；③ 想用 Java 但又想要接近 Python LangChain 的体验 → LangChain4j 是最佳选择。判断维度落在「是否 Spring 生态 / Boot 版本 / 团队对 LangChain 概念的熟悉度 / 想要的开发体验」。' },
      { name: 'Spring AI vs Spring AI Alibaba 的分工', note: '原文加粗规则：④ 已有 Spring Boot 项目、只需简单 LLM 调用 → 选 Spring AI；⑤ 构建企业级、多步骤、多角色协作的 AI 应用/Agent → 选 Spring AI Alibaba。即同为 Spring 路线，简单调用用 Spring AI，复杂多角色 Agent 用 Spring AI Alibaba；与 LangChain4j 的分界主要在「是否 Spring 生态」和「应用复杂度」。' }
    ]
  }
});