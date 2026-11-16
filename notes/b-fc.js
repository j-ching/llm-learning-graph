/* b-fc「05 Function Call 与工具」分支精读笔记（5 篇，全部逐篇读取原文）
 * 来源：课程原文。个别文档正文缺失/在截图里的情况已在对应 note 中如实标注。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ---------- 概念与协议 ----------
  'd0041': {
    note: '如实标注：标题是《什么是 Function Call?》，但闪存正文只有一段 ChatML 风格（im_start / im_end 标记）的 Jinja chat template 代码，没有任何文字讲解（全文仅 2 个块：来源 callout + 代码块），概念讲解需看配套视频或外链原文。以下要点均由代码本身读出：工具定义以文本注入 system prompt，模型只输出 tool_call 标签里的 name + arguments，工具结果以 tool_response 标签回灌。',
    tags: ['已精读', 'Function Call', '原文仅代码'],
    kids: [
      { name: '工具定义注入 system prompt：tools XML 标签', note: '模板 if tools 分支：先输出 system 轮，拼上原 system 消息内容，再拼固定文案 "# Tools / You may call one or more functions to assist with the user query." 和 "You are provided with function signatures within tools XML tags"，然后 for tool in tools 逐个 tool | tojson 输出工具签名，最后闭合 tools 标签。没有 tools 时走 else 分支，只渲染普通 system 消息。可见工具是靠文本进入上下文的，不是模型内置能力。' },
      { name: '模型侧输出协议：tool_call 里的 name + arguments', note: '模板要求 "For each function call, return a json object with function name and arguments within tool_call XML tags"，格式为 {"name": 函数名, "arguments": 参数 JSON 对象}。渲染 assistant 历史消息时，message.tool_calls 也按同样格式回写：arguments 是字符串就原样输出，否则 tojson。也就是说模型产出的只是「调哪个函数、参数是什么」的 JSON，不含任何执行动作。' },
      { name: '工具结果回灌：tool 角色消息包成 tool_response 放进 user 轮', note: 'message.role == "tool" 时：若它是第一条或前一条不是 tool，就补一个 user 轮开头；内容包进 tool_response 开闭标签；连续的 tool 消息合并进同一个 user 轮，直到最后一条或下一条不再是 tool 才补 im_end。这就是「工具执行结果作为新一轮输入交回模型」的落地方式。' },
      { name: '多步工具与 thinking 的模板处理', note: '模板用 ns.multi_step_tool 与 ns.last_query_index：从后往前遍历 messages，找到最后一条「内容不是被 tool_response 包裹」的 user 消息作为 last_query_index；assistant 历史消息只有在该索引之后、且是最后一条或带 reasoning_content 时，才保留 think 段（reasoning_content 缺失时从 content 里按 think 开闭标签切分）。add_generation_prompt 时追加 assistant 轮开头；若 enable_thinking 定义为 false，则插入一对空 think 标签。' }
    ]
  },

  // ---------- 工具定义规范 ----------
  'd0042': {
    note: '工具定义质量的 8 条经验（作者：按这个标准定义工具会少踩很多坑）：名称/描述/参数描述清晰、参数扁平化、参数不超过 3-4 个、用 enum 把问答题变选择题、适当给 few shot、错误提示要让模型读懂、返回值要让模型看懂、不要做复杂工具调用链。',
    tags: ['已精读', '工具定义'],
    kids: [
      { name: '描述清晰：注释是写给模型看的，不是写给自己 ★', note: '以前自己写代码定义接口不太关注注释，方法作用、入参出参很少描述清楚，因为是自己写代码自己调用，自己清楚就行。但交给大模型决策调用时，方法名称、参数描述不写清楚，模型肯定不知道它的具体作用。所以一定要描述清楚这个方法是干什么的，每一个参数的作用和格式都要写清楚。', tags: ['必记'] },
      { name: '参数结构：扁平化 + 数量不超过 3-4 个 + 鉴权不交给模型 ★', note: '尽量避免参数多层嵌套——参数是用 JSON 描述的，层级多了很容易搞错，所以尽可能扁平化平铺。但扁平化不等于堆参数：数量千万不要特别多，最好不超过 3-4 个。默认参数不要定义在接口中，服务端自己补全即可；和鉴权有关的参数也不要让模型传递，应该自己做好鉴权事宜，而不是依赖模型。', tags: ['必记'] },
      { name: 'enum 限定取值：把问答题变选择题，防模型捏造参数 ★', note: '为了防止模型捏造参数值，用 enum 关键字明确列出所有可能值。原文示例 search_restaurants（description "提供餐馆搜索功能"）：location 为 string、描述 "The location to search."、列入 required；good_for 为 string、描述 "What the restaurant is well-suited for."、enum ["families", "romantic_dating", "business_meeting", "large_groups", "solo_dining"]，代码注释标明 "families" 明确对应「带孩子」。效果：模型会成功地把「能带孩子」映射到 good_for: "families"。', tags: ['必记'] },
      { name: 'few shot + 友好错误提示 + 可读返回值', note: '参数描述可以用 few shot 辅助模型理解该如何传参，工具定义完之后也可以给一些工具调用示例。方法内部出现异常和错误时，要尽可能给出友好提示，让模型能读懂错误原因（尤其参数格式错误之类），方便模型调整和优化——而不是像以前做前置参数检查那样简单抛个异常。返回值一定要清晰明了，包括返回值参数的定义，模型看懂返回内容才知道这些东西怎么用。' },
      { name: '不要做复杂工具调用链：结果不会自动传到下一轮 ★', note: '多轮对话时，工具的调用结果不会自动传递到下一轮，需要我们自己传递，这就要求不要做很复杂的工具链。如果确实有很多事情要做，可以把几个相关的工具封装到一个工具中，这样也更方便模型调用。', tags: ['必记'] }
    ]
  },

  // ---------- Spring AI 用法 ----------
  'd0043': {
    note: 'Spring AI 做工具调用两条路：把已有服务包成 Function<T,R> 类型的 Bean（@Description + @JsonPropertyDescription 写描述），或用 @Tool / @ToolParam 声明新方法；再用 chatClient.prompt().tools(...) 挂载。默认由 Spring AI 自动执行工具，internalToolExecutionEnabled=false 可把执行权交回开发者（后续 ReAct Agent 用）。',
    tags: ['已精读', 'Spring AI'],
    kids: [
      { name: '已有方法转工具：Function Bean + @Description', note: '在 @Configuration 类里定义 @Bean @Description("根据用户输入的时区获取该时区的当前时间") public Function<TimeService.Request, TimeService.Response> getTimeFunction(TimeService timeService)，方法体直接 return timeService::getTimeByZoneId。即：Bean 返回值是 Function 类型，构造参数是已有的 Spring 服务，方法中直接调用已有方法。Function 是 @FunctionalInterface（since 1.8），两个泛型 T 表示入参、R 表示出参，函数式方法是 apply(Object)。作者提醒：记得增加清晰描述，讲清楚这个 Function 是干什么的，模型才知道什么时候可以调用它。' },
      { name: '入参出参用 record + Jackson 注解描述', note: 'TimeService.Request 是 record，字段上标 @JsonProperty(required = true, value = "zoneId") 与 @JsonPropertyDescription("时区，比如 Asia/Shanghai")；Response 是 record(String time)。实现：ZoneId.of(request.zoneId) → ZonedDateTime.now(zid) → DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z") 格式化后返回。入参里加说明同样是为了让模型更清晰了解参数是什么，它才知道怎么调用。' },
      { name: '定义新工具：@Tool + @ToolParam，tools() 直接挂', note: '没有现成服务时，用 @Tool(description = "Get time by zone id") 把方法声明为工具，每个参数用 @ToolParam(description = "Time zone id, such as Asia/Shanghai") 描述（示例 TimeTools.getTimeByZoneId(String zoneId) 返回格式化时间字符串）。挂载：Controller 里 chatClient.prompt().tools(new TimeTools()).user(city + "现在几点了？").stream().content()，返回 Flux<String>，并先 response.setCharacterEncoding("UTF-8")。' },
      { name: '默认自动执行；internalToolExecutionEnabled=false 自己接管 ★', note: '默认情况下，模型决策需要调用工具时，Spring AI 就会直接调用具体工具。如果想自己控制工具调用（比如后续要讲的 ReAct Agent），把 internalToolExecutionEnabled 设置为 false，Spring AI 就不再自动调用工具，需要开发者自己控制。原文说「后续会展开，这里了解即可」。注意：该小节标题写作「工具不自动执行」，但正文说明默认是自动执行的，标题与正文表述不一致，以正文为准。', tags: ['必记'] },
      { name: '复用 Spring AI Alibaba 已集成的第三方工具', note: 'Spring AI Alibaba 提供了一些集成的第三方工具，可以方便调用、避免重复开发。原文给出的已有工具列表地址：https://java2ai.com/docs/1.0.0.2/practices/integrations/tool-calling/（具体工具清单在该外链页面，正文未列出）。' }
    ]
  },

  // ---------- Spring AI 实现原理 ----------
  'd0044': {
    note: '核心边界：大模型自己不会调用工具，只决策「什么时候、调用哪个工具、参数是什么」，执行由应用侧完成——这里的「用户」就是 Spring AI。最终抽象是 ToolCallback：FunctionToolCallback 靠函数式接口回调，MethodToolCallback 靠反射。命名上 Spring AI 正式版已废弃 Function Calling API，统一改叫 Tool Calling。',
    tags: ['已精读', 'Spring AI', '实现原理'],
    kids: [
      { name: '为什么改叫 Tool Calling', note: '工具使用最开始由 OpenAI 提出时就叫 Function Calling，所以这个叫法更多，前面几节也沿用。Spring AI 一开始提供了一套 Function Calling 的 API，但在正式版发布时废弃了，都改成 Tool Calling——这是本篇改名的原因。' },
      { name: '模型只决策、不执行；执行方是 Spring AI ★', note: '原文原话：「大模型自己不会调用工具，他只是决策什么时候、调用哪个工具、参数是什么」，工具的调用交由用户进行，而这里的「用户」是 Spring AI 帮我们做了。Spring AI 官方流程图给出的步骤：① 想让工具对模型可用，就在聊天请求中包含其定义，每个工具定义包括名称、描述和输入参数的架构；② 模型决定调用工具时，发送一个包含工具名称和按定义架构建模的输入参数的响应；③ 应用程序负责用工具名称识别并执行工具、传入提供的参数。如实标注：原文该编号列表的第 4、5、6 项是空项，后续步骤内容在配图里、正文未给出。作者的 debug 证据：模型输出告知要调用的工具和具体参数 → Spring AI 通过反射调用具体方法 → 把结果组装到一起再给到模型（带 debug 的讲解在配套视频中，正文只有截图）。', tags: ['必记'] },
      { name: 'tools() 的落地链路：ToolCallbacks.from → ToolCallback[]', note: 'ChatClient 的 tools(Object... toolObjects) 实现：先 Assert.notNull(toolObjects, "toolObjects cannot be null") 与 Assert.noNullElements(...) 校验，关键一行是 this.toolCallbacks.addAll(Arrays.asList(ToolCallbacks.from(toolObjects)))。ToolCallbacks 只是个工具类（私有构造），from(Object... sources) 返回 MethodToolCallbackProvider.builder().toolObjects(sources).build().getToolCallbacks()，作用就是把一个 Object 转成 ToolCallback[]。' },
      { name: 'ToolCallback 接口：Spring AI 中 Tool 的最终定义', note: '接口注释「表示一个可由 AI 模型触发执行的工具」，@author Thomas Vitale、@since 1.0.0。四个方法：getToolDefinition() 返回由 AI 模型使用的工具定义，用于确定何时以及如何调用；getToolMetadata() 是 default 方法，返回 ToolMetadata.builder().build()，提供如何处理的额外元数据；String call(String toolInput) 用给定输入执行工具并把结果返回给模型；default String call(String toolInput, @Nullable ToolContext toolContext) 的默认实现里，若 toolContext 非 null 且 getContext() 非空就抛 UnsupportedOperationException("不支持工具上下文！")，否则退化为 call(toolInput)。' },
      { name: '两个实现的真实差别：函数式接口回调 vs 反射 ★', note: 'ToolCallback 共两个实现：FunctionToolCallback 与 MethodToolCallback（作者吐槽「函数不就是方法，方法不就是函数吗」）。在 org.springframework.ai.model.tool.DefaultToolCallingManager#executeToolCall 打断点可验证：chatClient.prompt().toolNames("getTimeFunction") 这种走 FunctionToolCallback；chatClient.prompt().tools(new TimeTools()) 这种走 MethodToolCallback。FunctionToolCallback 的几个 builder 构造方法都需要接受一个函数式接口（Consumer、Function、Supplier、BiFunction），toolNames 方式注册的 @Bean Function 也是函数式接口，所以它的具体调用依赖函数式接口回调；MethodToolCallback 针对非函数式接口（比如普通的一个方法），一定是通过反射调用。差别在调用机制，不在语义。', tags: ['必记'] }
    ]
  },

  // ---------- 实战 ----------
  'd0045': {
    note: '实战：仿 PDD 售后客服，目标是针对商品质量问题自动帮买家发起退款，其他问题作为客服安抚。四件套：提示词模板（Role + 三步 COT + Limit）、对话记忆 Advisor、newChat 结构化输出、@Tool apply_refund。最大的坑是流式输出下 tool_call 分片导致工具调用失败，换 DashScopeChatModel 解决。',
    tags: ['已精读', '实战', 'Function Call'],
    kids: [
      { name: '提示词模板：Role + FewShot + 三步 COT + Limit', note: '角色是「专业的电商平台客户体验专家」，首要任务是识别对商品质量的严重不满并立即主动申请退款。FewShot 关键词：根本没法用、是坏的、有瑕疵、质量太差了、和描述完全不符、严重色差、尺寸根本不对、一用就坏了、有安全隐患、我要投诉、这简直是欺诈。第一步识别与共情后，必须用封闭式问题确认问题性质（正确示范「您是说刚收到的这件衣服袖口已经完全开线了，对吗？」；避免「您有什么问题？」过于开放）。第二步触发条件是用户确认了具体质量问题（如「对的，就是开线了」），即视为满足严重质量标准，无需用户主动提出就直接告知将发起退款，标准话术含「款项将按原路径在 1-7 个工作日内退回」。第三步再次致歉 + 提供确定性（告知流程已启动、无需再做其他操作）。Limit 两条：仅对明确的商品质量问题执行此流程，「不喜欢」「尺寸不合适（非描述不符）」「物流慢」走常规客诉（换货、补偿优惠券等），不要直接退款；默认系统已有订单信息，不向用户索要订单号、手机号等隐私信息。' },
      { name: '对话记忆：MessageChatMemoryAdvisor + 同一个 CONVERSATION_ID', note: '作者理由：这是对话功能，必须有记忆，否则用户前面问了某个订单、后面模型不知道是哪个订单就尴尬了。构建：ChatClient.builder(chatModel).defaultAdvisors(new SimpleLoggerAdvisor(), MessageChatMemoryAdvisor.builder(chatmemory).build()).defaultSystem(systemText).build()，其中 chatmemory 是直接 @Autowired 进来的。每次请求都带 .advisors(spec -> spec.param(CONVERSATION_ID, chatId).param("chat_memory_retrieve_size", 100))，newChat 与 ask 用同一个 chatId 作为 CONVERSATION_ID。' },
      { name: '结构化输出：newChat 初始化订单/用户/对话状态', note: '用户第一次开始对话时调 /newChat，初始化用户与订单基本信息并做结构化输出，确保输出固定内容，前端才能解析出关键信息。返回体是 record OrderChat，四个字段各带 @JsonPropertyDescription：订单号 orderId、用户 Id userId、对话 Id chatId、对话状态 ChatStatus status；其中对话 id 和对话状态由后端新生成后返回前端。实现：先 String chatId = UUID.randomUUID().toString()（注释说明是模拟数据库创建 chat 记录取唯一 id），再把 userId、orderId、chatId、ChatStatus.CHAT_START.name() 拼进 user prompt 告知模型让它存进记忆，最后 .call().entity(OrderChat.class)。' },
      { name: '退款工具：@Tool(name = "apply_refund") 与 mock 服务', note: 'OrderTools 是 @Component，@Autowired OrderManageService；工具方法标 @Tool(name = "apply_refund", description = "根据用户传入的订单信息发起退款")，三个参数分别是 @ToolParam(description = "订单编号，为数字类型") String orderId、@ToolParam(description = "商品名称") String name、@ToolParam(description = "退款原因") String reason；内部打印后调 orderManageService.refund(orderId, reason)，返回「已为商品：… 订单号：… 申请退款，退款原因：…」的文本。OrderManageService 是演示用 mock：getOrderById 返回「订单号：」+ orderId，refund 打印「退款成功」并返回一个 UUID。/ask 接口用 .user(question).tools(orderTools) 挂载工具，同样带 CONVERSATION_ID 与 chat_memory_retrieve_size=100，.stream().content() 返回 Flux<String>。作者验证：控制台可见最后一轮对话调用了工具申请退款，并把记忆中的商品、订单、退款原因都带上了（对话效果与日志均为原文截图，正文未给出文本）。' },
      { name: '坑：流式 tool_call 分片，Spring AI 不拼接 arguments ★', note: '现象：作者最初用 openai 的 chatmodel，工具调用总失败——模型生成两次工具调用，一次有工具名但没参数，一次有参数但没工具名，两次都失败；换成 DashScopeChatModel 就解决了。根因：流式输出时 function 字段是一次性返回还是分段返回，与不同模型的特点、工具参数的复杂度有关；正确逻辑应当是检测到 tool_call 后汇聚并拼接 arguments，直到没有 tool_call 了再调用，但 Spring AI 是检测到 tool_call 就执行、没有拼接 arguments 的操作，于是执行时要么工具名称 chunk 还没到为空、要么工具参数还没到为空（源码证据在截图里）。解决方向：自己接管流式输出的调用时机，关闭 internalToolExecutionEnabled 自动调用工具。如实标注：原文「具体的解决方式可以参考：」后面的链接为空、未给出参考地址；后续小节「✅ReAct Agent 流式输出后续问题」提到不同模型 tool_call 出现时机有差异（举例公司自己微调量化的 qwen32b 模型），但该段正文在「那么第一块 chunk 确实是直」处截断，其余内容在截图里，无法读到完整结论。', tags: ['必记'] }
    ]
  }
});