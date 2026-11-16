/* rag-b「07 RAG」第二批精读笔记（16 篇：g-rag-opt 优化技术 9 篇 + g-rag-modular 模块化/多模态/Agentic 7 篇）
 * 来源：课程原文，全部逐篇读取后提炼。
 * 其中《RAG 优化技术：HyDE》正文仅 463 字符且只有问题背景、无 HyDE 做法，按规范第 6 条标 '待补'。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 * 术语与已精读的 rag-01（GIGO、检索+生成）、rag-02（长度两难、三种相似度、Pgvector 四字段、
 * 「向量只是索引，模型引用原始 text」）保持一致；本批未涉及目录 478《什么是父子分片？》（属 g-rag-index）。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ==================== g-rag-opt 优化技术（9 篇） ====================

  // ---------- 元数据过滤 ----------
  'd0084': {
    note: '元数据过滤治的是「相似度检索无法表达精确条件」这个结构性缺口：在向量相似度检索之前先按 metadata 做一次关系型精确过滤，把语义检索和精确检索组合起来。原文称精确过滤是「元数据最强大最直接的功能」。三大用途：精确过滤、提供参考源、访问权限。正好落地 rag-02 里 Pgvector 四字段中那个「被低估的杠杆」metadata。',
    tags: ['已精读', 'RAG优化', '检索前过滤'],
    kids: [
      { name: '元数据是什么：chunk 的「身份证」', note: '元数据（Metadata）是附加到文本块（Chunk）上的结构化信息，是描述该文本块的「数据」，可包含文件名、页码、userid 等。原文直接回指前课：navicat 里看到的向量数据有一个 metadata 字段，当时因为没做任何存储操作所以是空的——本篇就是把这个字段填上并用起来。对应 rag-02 的 Pgvector schema：embedding_id / embedding / text / metadata，向量负责「找得到」，metadata 负责「找得准、可溯源、可鉴权」。' },
      { name: '精确过滤：三版汽车手册的启动方式 ★', note: '问题机制（原文加粗）：向量数据库检索的本质是相似度查询，但很多时候需要的是类似关系型数据库的精确检索。举例：《汽车用户手册》2023 / 2024 / 2025 三个版本对「如何启动汽车」的描述分别是钥匙启动、旋钮启动、手机启动。用户问「根据《汽车用户手册（2023年版）》，汽车应该如何启动？」——三个版本的文本块仅仅年份一个数字不一样，相似度其实都非常高，普通相似度检索很可能三版都召回，流程设计再不好就会答错。解法：把文档名称存入元数据，在相似度检索之前先做一次元数据过滤，完全滤掉 2024/2025 版，只对 2023 版做相似度检索。取舍：过滤条件必须先被正确抽取出来（见下一条），条件错了会把正确答案一起滤掉。', tags: ['必记'] },
      { name: '提供参考源与访问权限：可信与合规', note: '提供参考源：用户无法判断回答是真来自企业知识库还是模型胡编乱造，所以在切片或向量化时为每个 chunk 存元数据，答案生成后一并展示。三点价值：增加可信度（知道确实来自文档）、便于追溯（有疑问可跳到对应片段核对）、提升用户体验（文档量大内容复杂时快速定位）。访问权限：企业文档有不同安全级别/用户群体，某文档是部门「内部机密」、另一份是「公开」；若不加区分地返回机密文档内容块就会导致数据泄露。做法：向量化存储时把访问权限信息一并写入元数据，查询时先按用户身份过滤掉无权访问的 chunk，再执行相似度检索，确保 RAG 只基于用户能访问的内容生成答案。' },
      { name: '写入位置与检索配置：切片与向量化之间加一步', note: '写入：改造构建索引的方法，在文档切片和向量化之间新增一步——遍历 documents 执行 document.getMetadata().put("fileName", fileName)，再 embeddingService.embedAndStore(documents)。检索：SearchRequest.builder().query(query).topK(5).similarityThreshold(0.5f).filterExpression("fileName == \'" + fileName + "\'").build()，filterExpression 就是过滤匹配表达式。作者提醒（原文加粗）：这里把 similarityThreshold 调低，不同文档、不同提问方式这个参数都不一样，需要找到一个能最大程度过滤掉无效文本块、保留相似文本块的参数值，需要反复调试才可以。与 rag-02「长度两难」同理：阈值也是必须实测的调参点，不存在通用最优值。' },
      { name: 'Advisor 集成与参数抽取：qa_filter_expression ★', note: '用 QuestionAnswerAdvisor 做检索增强时，通过 advisorSpec.param("qa_filter_expression", "fileName == \'" + fileName + "\'") 传过滤表达式，这个参数名是 QuestionAnswerAdvisor 中规定的（原文附源码截图）。关键工程提醒（原文加粗）：演示为了方便直接把指定文件名传进去了，实际环境中这个文件名的提取工作也是需要大模型来进行参数抽取的。含义：元数据过滤把「精确条件从哪来」变成了新的前置问题——要么用户显式指定，要么加一次 LLM 参数抽取（额外调用与延迟，且抽取错误会直接导致召回为空）。原文入库结果、检索效果均以截图展示，正文未给出具体命中条数。' }
    ]
  },

  // ---------- 问题改写 ----------
  'd0085': {
    note: '原文正文只有一个 Java 类 QuestionRewriteService（约 5.5k 字符，无文字讲解），要点全部从代码与四段提示词常量读出。它把「用户不会提问」拆成四种可独立调用的改写策略：分解 decompose、富化 enrich、多样化 diversify、回退 stepBack，并给出一个组合策略 rewriteQuery。本质：用额外的大模型调用换检索召回率。',
    tags: ['已精读', 'RAG优化', '查询改写', '纯代码'],
    kids: [
      { name: '分解 decompose：拆成可独立检索的子查询', note: '提示词角色「专业的查询逻辑分析专家」，任务是把用户原始问题分解为一系列相互独立、逻辑清晰、且可单独用于检索的子查询列表。输出契约：必须是标准 JSON 数组，不强制要求数组元素个数、可根据真实情况输出、至少保留 1 个；只输出 JSON 数组，不要解释或多余文字。代码用 JSON.parseArray(result, String.class) 直接反序列化。针对的问题：一个问题里塞了多个检索意图，单次向量检索只能命中其中一个（多跳/复合问题）。风险（代码可见）：解析处没有容错兜底，模型一旦输出非 JSON 文本就会解析异常（推断）。' },
      { name: '富化 enrich：用对话历史补全代词与背景', note: '提示词角色「专业的问题重写优化器」，输入两个变量：{CHAT_HISTORY} 对话历史 + {QUESTION} 原始问题，要求重写为一个独立、完整、且包含所有必要背景信息的新查询用于 RAG 检索，只输出富化后的新问题、不含解释。针对的问题：多轮对话里用户说「他的字是什么？」，这句话单独拿去检索必然召回失败——主语和背景都在历史里。这是唯一需要对话历史入参的策略，方法签名 enrich(String chatHistory, String question)。与 Spring AI 的 CompressionQueryTransformer 是同一件事（见模块化篇）。' },
      { name: '多样化 diversify：固定 3 个措辞变体提召回', note: '提示词角色「专业的语义扩展专家」，任务是为原始问题生成 3 个语义相同但措辞完全不同、且利于检索的查询变体，以提高检索的召回率；输出标准 JSON 数组，同样用 JSON.parseArray 解析。针对的问题：rag-02 讲的向量相似度依赖用语——用户词汇与文档词汇不一致时召回率低（HyDE 篇残存正文也把「词汇不匹配」列为第一条问题）。取舍：变体数量在提示词里写死为 3，召回面扩大 3 倍，检索次数与后续去重/融合成本同步上升；变体是否真的「语义相同」完全依赖模型，无校验环节（代码可见）。' },
      { name: '回退 stepBack：从具体问题退到原理问题', note: '提示词角色「擅长抽象思维和原理推理的专家」，任务是先「后退一步」，把具体问题转化为一个更通用、更本质的问题，聚焦背后的原理、规律、概念或一般性知识，而不是具体细节。输出约束很严：只输出改写后的「后退问题」，不要解释、不要包含原始问题、也不要回答它。针对的问题：过于细节的提问在知识库里找不到字面对应内容，但上位概念/原理段落是存在的。取舍（推断）：回退提升了召回广度，却降低了 specificity——退得太远会召回一堆泛泛原理而答不到用户的具体点，所以代码把它放在组合策略的第一步、后面再接分解来收回具体性。' },
      { name: '组合策略 rewriteQuery：回退 → 分解 → 多样化 ★', note: '代码里的串联顺序：① stepBack(query) 得到回退问题；② decompose(stepBackQuery) 把回退问题拆成子查询列表；③ 对每个子查询 diversify 生成 3 个变体，全部 addAll 进 finalQueries；④ 若 finalQueries 为空则兜底 add 原始 query。注意：组合方法只接收 query，没有调用 enrich——富化需要对话历史，得单独调用。成本（从代码推算）：一次组合 = 1 次回退 + 1 次分解 + N 次多样化 = N+2 次 chatModel.call，产出最多 3N 条查询，检索侧调用量随之放大；原文未讨论延迟与 token 成本，这是执行时必须自己算的账。所有策略都走同一套骨架：PromptTemplate.add(...) → chatModel.call(promptTemplate.create()).getResult().getOutput().getText()，并用 log.info 打出改写前后文本便于调试。', tags: ['必记'] }
    ]
  },

  // ---------- 查询路由 ----------
  'd0086': {
    note: '本篇的核心判断（原文加粗反问）：外部知识库就一定是向量数据库么？不一定！这个检索就一定是向量检索么？也不一定！由此引出两类路由：数据源路由（把 query 分发给向量库/图库/关系库）与 Prompt 路由（把 query 分发给不同的系统提示词）。路由本身由一次 LLM 分类调用完成，输出固定标签供程序 switch。',
    tags: ['已精读', 'RAG优化', '路由'],
    kids: [
      { name: '为什么需要路由：企业知识不都在文档里 ★', note: '原文场景：做企业内部知识库，文档类知识可以走向量数据库；但企业的组织架构信息、服务器部署情况「可不在文档中」，只靠向量数据库肯定不行。所以 RAG 的外部知识源可以是图数据库、向量数据库、关系型数据库，Query Routing 的职责就是把用户请求转发到不同的数据库上去查询。这条判断把 rag-01「检索 + 生成」里的「检索」从向量相似度扩展成了「按数据形态选检索方式」，也是后面 Graph RAG 篇的引子（原文明确回指）。', tags: ['必记'] },
      { name: '数据源路由：三分类提示词 + 默认兜底', note: 'DATASOURCE_ROUTE_PROMPT 的规则：语义相似性搜索/文档检索/内容推荐类 → 回答 VECTOR；关系查询/知识图谱/实体关联类 → GRAPH；结构化数据查询/统计分析/精确匹配类 → RELATIONAL；无法确定 → VECTOR；只回答这三个词、不要其他内容。QueryRouteService.route(query) 用 PromptTemplate + chatModel.call 拿标签，Controller 里 databaseType.trim() 后 switch 分发，default 分支再兜底一次向量检索并提示「无法确定合适的数据库类型」。工程要点：把分类结果约束成枚举标签，是为了让下游能用 switch 而不是解析自然语言；两层兜底（提示词层 + 代码层）保证路由失败也不至于无检索可用。' },
      { name: '三个检索 Service 都是 mock：别当生产实现', note: '原文的 VectorDatabaseService / GraphDatabaseService / RelationalDatabaseService 三个类都只返回一段拼接字符串，并在文本里自述「这里模拟返回了…实际应用中会连接到…」：图库对应 Neo4j、ArangoDB、Amazon Neptune；关系库对应 MySQL、PostgreSQL、Oracle，做精确查询和统计分析；向量库对应 Chroma、Milvus、Faiss，做语义相似性匹配。也就是说本篇给的是路由骨架与选型地图，真实检索实现留到后续（Graph RAG 篇接了真 Neo4j，查询构造篇接了真 JdbcTemplate）。' },
      { name: 'Prompt 路由：医疗助手的医生 vs 药师', note: '动机（原文）：为了避免固定的提示词效果不好，提前定义好多个提示词，用户提问时先让 LLM 分析适合用哪个。示例两套系统提示词：Prompt 1「你是一个专业的医生，可以从专业的医疗角度给出患者建议」；Prompt 2「你是一个专业的药学专家，掌握丰富的药品知识，能够在用药方面给出更好的建议」。实现用 LangChain4J 的 @AiService 接口 MedicalPromptRoutingService：doctorConsultation / pharmacistConsultation 各带 @SystemMessage 并返回 Flux<String>（流式），第三个方法 determineConsultationType 做意图识别，要求只回答 DOCTOR 或 PHARMACIST。Controller 先调意图识别，trim 后 equals 判断分别调用两个方法，else 兜底走 doctorConsultation。取舍：一次问答变成两次模型调用（先分类再生成），换来的是角色/知识边界更贴合问题类型。' }
    ]
  },

  // ---------- 查询构造 ----------
  'd0087': {
    note: '原文正文只有 SqlQueryService 一个类（约 5.3k 字符，无文字讲解），要点从代码与提示词常量读出。它就是查询路由篇里 RELATIONAL 分支的落地：把自然语言问题构造成 SQL（Text2SQL），用 JdbcTemplate 真查关系库，而不是做向量相似度检索。关键设计全在提示词的硬约束和表结构注释里。',
    tags: ['已精读', 'RAG优化', 'Text2SQL', '纯代码'],
    kids: [
      { name: 'Text2SQL 提示词的四条硬约束 + 只读声明 ★', note: 'TEXT_2_SQL_PROMPT 角色「你是一个SQL专家」，任务是根据表结构信息把用户问题转换为 SQL，并特别强调「你只能查询，不能做修改、删除等操作」。四条要求：① 只返回 SQL 语句，不需要包含任何解释和说明；② 确保 SQL 语法正确；③ 使用上下文中提供的表名和字段名；④ 如果根据所提供的表无法做查询，请直接返回空字符串 ""。另有「其他说明：今天是:{today}」，代码用 SimpleDateFormat("yyyy-MM-dd") 注入当天日期。机制：③ 防模型凭空造表造字段（幻觉 schema），④ 给「查不了」一个可编程识别的信号，today 让「今年入职/最近三个月」这类相对时间问题能算出绝对日期。', tags: ['必记'] },
      { name: '表结构常量：DDL + 中文 COMMENT 一起喂给模型', note: 'TABLES 常量把两张表的完整 CREATE TABLE 与 COMMENT ON COLUMN 都塞进提示词：app.staff_info（id、emp_id 工号、name 姓名、job 岗位、entry_time 入职时间、gender 性别、birthday 出生年月日、educational_background 学历、director_id 主管id、dept_id 部门id、duty 工作职责、motto 个性签名、pic_url 头像地址）与 app.dept_info（id 部门id、name 部门名称、owner_id 主管工号、parent_dept_id 父级部门id、desc 部门描述）。关键做法：字段语义靠中文注释传达，枚举值也写进注释（学历：junior、undergraduate、master、doctor），模型才知道「硕士」要映射成 master。注意原文注释写的是「性别：M表示女性，F表示男性」，与常见 M/F 约定相反——照抄这份 schema 会让模型把性别条件写反，复用前必须核对（原文如此，非笔误修正）。' },
      { name: '执行链路：双重空值短路 + queryForObject', note: 'text2sql(query)：PromptTemplate.create(Map.of("user_query", query, "tables", TABLES, "today", ...)) → chatClient.prompt(prompt).call().content()，并 System.out.println("sql:" + sql) 便于人工核对。sqlQuery(query, clazz)：query 为 blank 直接 return null；生成的 sql 为 blank 也 return null（对应提示词第 ④ 条）；否则 jdbcTemplate.queryForObject(sql, clazz)。含义：只有「恰好一行一列」的结果能被接住，多行聚合结果需要另写接口（从 queryForObject 语义推断）。ChatClient 在 @PostConstruct init() 里用 ChatClient.builder(chatModel).build() 构建，chatModel 由构造器注入 OpenAiChatModel。' },
      { name: '代价与风险：只读靠提示词约束，不靠代码校验', note: '从代码可直接看出：模型生成的 SQL 字符串被原样交给 jdbcTemplate 执行，除了提示词里那句「只能查询」之外，没有 SQL 白名单、语句类型校验或只读账号等防线；空字符串判断只解决「查不了」，不解决「查错了/查多了」。执行推论（推断，非原文结论）：生产落地至少要补只读数据库账号、语句类型校验（只允许 SELECT）、超时与行数上限，并把表结构裁剪到当前问题相关的表，否则 TABLES 常量会随表数量线性撑大提示词。原文未讨论这些，属于本篇留白。' }
    ]
  },

  // ---------- 问题澄清 ----------
  'd0088': {
    note: '问题澄清是「问题改写/查询优化」之外的另一条路：当用户问题模糊、不完整、有歧义或需要额外上下文时，不猜、不硬检索，而是主动与用户交互收集信息、确认真实意图。原文用旅行规划助手演示，落地关键是两阶段系统提示词 + 对话记忆 + 一个强制出方案的兜底接口。',
    tags: ['已精读', 'RAG优化', '交互澄清'],
    kids: [
      { name: '定位：改写不是万能的，缺信息就要问 ★', note: '原文开篇判断：虽然介绍了问题重写、查询优化等方案来解决用户不会提问的问题，但并不代表一定就能把用户的问题给回答好。当问题存在模糊、不完整、歧义或需要额外上下文才能被准确回答时，还有一种简单直接的优化手段——主动与用户交互以获取更多信息或确认其真实意图，这个过程就叫问题澄清。旅行规划例子：要做行程规划必须知道什么时间、去哪里、几个人、行程偏好，而很多用户一开始不会提供足够信息。与查询改写的分工（推断）：改写治「表达不好」，澄清治「信息不存在」——历史里也没有的信息，改写只能编，澄清才能补。', tags: ['必记'] },
      { name: '两阶段提示词：每次最多问 1-2 个问题 ★', note: 'TravelPlanningAiService 的 @SystemMessage 把对话切成两阶段。【信息收集阶段】用「听起来很棒！具体想…」了解细节；通过建议来引出问题，如「这个地方我很推荐！大概预算多少合适？」；每次最多问 1-2 个相关问题。【规划生成阶段】当掌握了目的地、时间、预算、人员等核心信息时，生成包含具体日程、住宿、交通、活动的详细规划，并提供实用建议与注意事项。四条对话原则：热情友好像朋友一样自然对话、基于已有信息给建议、如需更多信息自然地询问细节（明确避免「我需要更多信息」这样的表达）、信息足够时生成详细规划。收尾一句是体验红线（原文加粗语气）：始终提供有价值的内容，避免让用户感觉在被「审问」。取舍：澄清提升信息完整度，但每问一轮就多一次往返，问太多会流失用户——所以用「每次 1-2 问 + 边给建议边问」压住摩擦。', tags: ['必记'] },
      { name: '必须支持对话记忆：@MemoryId', note: '原文特别提醒：chatWithTraveler(@MemoryId String memoryId, @UserMessage String userInput) 这个方法需要支持对话记忆，因为用户可能是多轮对话汇总之后才是他的所有要求和基本信息，这些都是 LLM 做规划的重要依据。机制：澄清收集到的信息分散在多轮里，没有记忆就等于每轮都从零开始，前面问出来的目的地/预算/人数全部丢失，澄清也就白做。这与问题改写篇的 enrich 需要 {CHAT_HISTORY} 是同一个依赖。' },
      { name: '三个接口与 force-plan 兜底', note: 'SmartTravelPlanningController 提供三个方法：① /travelPlan/start 用 UUID.randomUUID() 生成 memoryId 作为 sessionId 返回，并附一段欢迎语，一次性列出待收集的 5 项信息（去哪里、什么时候出发、预算范围、和谁一起、兴趣爱好）；② /travelPlan/chat 带 memoryId + message 调 chatWithTraveler，可能要求澄清也可能给行程建议；③ /travelPlan/force-plan 只带 memoryId，注入一句「请基于我们到目前为止的所有对话，生成完整详细的行程规划方案」强制收敛出方案。工程含义：澄清不能无限进行，必须给用户一个「别再问了，先出方案」的出口。原文缺陷：正文「提供了三个方法」的列表里有一个空列表项、只写出 chatWithPlanner 一条说明，start 与 force-plan 的文字说明缺失，但代码中三个方法齐全。' }
    ]
  },

  // ---------- HyDE（正文残缺） ----------
  'd0089': {
    note: '原文未能读取完整正文：read_doc() 成功但全文仅 463 字符，只有两条「问题背景」要点（词汇不匹配、问题过于简短或模糊），且列表中存在空项、示例只给了用户提问一侧，没有任何 HyDE 的做法、流程或代码（疑似闪存抓取不全，正文可能在图片/视频里）。read_doc_blocks() 复核时接口报错「所有授权均无法完成请求：未知错误」，无法进一步确认。HyDE 的机制与取舍待对照原文链接补读，本节点不臆造内容。',
    tags: ['待补', 'RAG优化', '查询改写'],
    kids: [
      { name: '残存正文：HyDE 要解决的两个检索问题', note: '原文可读到的全部内容只有两条：① 词汇不匹配——用户的查询用语和知识库中文档的用语可能完全不同，尽管它们语义相似；示例用户问「感觉心情持续低落，对什么都提不起兴趣，怎么办？」，原文紧接着写「虽然两者高度相关，但直接基于字面相似度的检索可能无法匹配」，但与之对照的知识库文档原文缺失（该处是一个空列表项）。② 问题过于简短或模糊——用户的问题可能很短，缺乏足够的上下文信息，导致检索系统难以理解其真实意图。这两条与问题改写篇的 diversify（多样化）、stepBack（回退）针对的是同一类问题；HyDE 具体如何用「假设性文档」来解，原文未给出，标记待补。' }
    ]
  },

  // ---------- 混合检索 ----------
  'd0090': {
    note: '原文正文只有两段代码（Python + LlamaIndex 版、Java + Spring AI/ES 版，约 7k 字符，无文字讲解），机制从代码读出：稠密向量检索负责语义、稀疏 BM25/ES 关键词检索负责字面，两路结果按 id 去重后用 RRF（reciprocal_rerank）融合成一份 topK 上下文再交给 LLM。RRF 的实现与公式在《重排序》篇展开。',
    tags: ['已精读', 'RAG优化', '混合检索', '纯代码'],
    kids: [
      { name: '两路检索的分工：语义 vs 关键词', note: 'Python 版把两个检索器并列：dense_retriever = VectorIndexRetriever(index=vector_index, similarity_top_k=4)，走 DashScopeEmbedding 的语义相似度；sparse_retriever = CustomBM25Retriever(nodes, bm25, similarity_top_k=4)，走 BM25Okapi 的词项打分。打印时作者自己标注了三组结果的性质：「稠密检索结果 (语义理解)」「稀疏检索结果 (关键词匹配)」「混合检索结果 (语义+关键词融合)」。针对的问题：纯向量检索对专有名词、型号、代号这类字面强信号不敏感，纯关键词检索对同义改写不敏感——两路互补。自定义 BM25 检索器还兼容 str 与 QueryBundle 两种入参，并实现了 aretrieve 异步方法（直接复用同步 retrieve）。' },
      { name: '中文稀疏检索的前置：jieba 分词 + 去标点 ★', note: 'BM25 是词袋模型，中文不分词就等于按字切，所以代码先做 tokenize_zh：re.sub(r"[^\\w\\s]", "", text) 去掉标点，再 jieba.lcut(text)，最后过滤空白 token；语料与查询用同一个分词函数（corpus 与 query 都过 tokenize_zh），否则词项对不上。关键参数：SentenceSplitter(chunk_size=120, chunk_overlap=20)（原文未标单位）；embed 模型 text-embedding-v2；Settings.llm = DashScope(model_name="qwen-max")；QueryFusionRetriever(retrievers=[dense, sparse], similarity_top_k=4, num_queries=1, mode="reciprocal_rerank")——num_queries=1 表示不额外生成扩展查询，只用原问题；融合模式即 RRF。对照 rag-02「长度两难」：这里给的是一份可复现的小 chunk 基线（120 + 20 重叠），重叠比例约 1/6，明显高于常见的 10%，属于短 chunk + 高重叠的取法（单位与动机原文未说明）。', tags: ['必记'] },
      { name: '语料设计：同一厂商的多种写法', note: '演示语料是 12 条科技公司产品/服务描述（CloudEngine 16800 数据中心交换机、HuaWei Cloud 全栈云、阿里云 ECS/OSS/RDS、达摩院通义千问、腾讯云游戏云、微信支付、字节推荐算法与火山引擎、百度 Apollo 与文心一言、小米 IoT 与澎湃芯片等），查询是「华为的人工智能芯片和云AI服务」。可观察到的事实：语料里同一厂商出现了「花为」「HuaWei」等不同写法，而查询用的是「华为」。推断（原文未解释意图）：这是刻意构造的词汇不匹配样例，用来暴露字面检索与语义检索各自的盲区，从而显出融合的价值。原文没有给出三组检索的具体命中文本与分数，运行结果需自己跑代码看。' },
      { name: 'Java 版链路：向量 + ES → 去重 → RRF → 拼 prompt', note: 'hybridchat(query) 七步：① embeddingService.similarSearch(query) 拿向量结果；② esRagService.searchByKeyword(query, 5, true) 拿 ES 关键词结果（topK=5）；③ 用 LinkedHashMap<String,String> idToContent 以 putIfAbsent 按文档 id 去重合并（向量结果先入，ES 结果后入）；④ rrfFusion(vectorDocs, keywordDocs, 5) 得到融合后的 topK=5 内容列表（《重排序》篇可见：原本直接用 idToContent.values() 的那行被注释掉，换成了 RRF）；⑤ 提示词模板要求「参考文档中没有相关信息就直接说明没有找到相关信息，不要编造内容」，同时要求有内容时尽量回答、可猜测用户实际需求；⑥ 文档之间用 "\\n\\n=========文档分隔线===========\\n\\n" 拼接；⑦ chatClient.prompt(realPrompt).call() 生成。全过程用 log.info 打出两路各自的 chunkId 列表与融合后条数，便于对比排序变化。取舍：召回面变大（两路各 5 条）但上下文窗口没变大，所以必须靠融合/重排把 topK 收回来——这正是 rag-01「chunk 注入上下文」埋的伏笔。代价（推断）：要同时维护向量库与 ES 两套索引及写入一致性。' }
    ]
  },

  // ---------- 重排序 ----------
  'd0091': {
    note: '重排序（Reranking）= 拿到初筛候选后，用更强的模型（Cross-Encoder 或专用 Reranker）对「查询 + 文档」重新打分排序。原文给出两条实现路径：轻量级的 RRF 排名融合（k=60，无需原始分数）与调用 qwen3-rerank 的语义重排。作者判断：重排序能显著提升 RAG 的可靠性和最终回答质量，是 Advanced RAG 系统的关键环节；目标是在响应速度与回答质量之间找最佳平衡。',
    tags: ['已精读', 'RAG优化', '重排序', 'RRF'],
    kids: [
      { name: '三个作用：滤噪声、提精度、省上下文 ★', note: '原文列的三条价值：① 过滤噪声——初步检索往往召回数十条文档，其中混杂相关性较低的噪声内容；② 提升答案精度——重排序模型能更细致地评估「查询和文档对」之间的相关性，比初次检索使用的相似度查询更准确；③ 优化上下文窗口利用率——把最相关的少数文档（通常是 3-5 个）置于最前端，确保 LLM 有限的输入窗口被最高质量的上下文填充，让生成基于相对更正确、更有依据的上下文。机制关键：初筛是「query 向量 vs doc 向量」的近似比较（rag-02 的余弦相似度），重排是「query+doc 一起进模型」的交互式打分，精度更高但更贵——所以只能作用在少量候选上，不能全库重排。', tags: ['必记'] },
      { name: 'RRF 公式与 k=60：只看排名，不看分数 ★', note: 'RRF（Reciprocal Rank Fusion，倒数排名融合）：Score(d) = Σ 1/(K + rank_i)，rank_i 是文档 d 在第 i 个结果列表中的排名（从 1 开始），d 不在某列表里就忽略该项（或视为无穷大、不加分），K 是常数、通常取 60，用于控制低排名文档的权重、避免低排名文档对总分影响过大。原文加粗强调两遍的判据：一个文档在多个排序列表中排名越靠前、出现次数越多，其融合得分就越高。数值感：第 1 名贡献 1/(1+60) ≈ 0.016，第 10 名只有 1/(10+60) ≈ 0.014，差别虽小但有意义。优势：不依赖原始得分（BM25 分数、神经网络打分），只用 rank，因此无需对不同检索系统做复杂分数归一化，通用性与鲁棒性好、对低排名/噪声项不敏感，特别适合向量 + 关键词的异构混合检索；原文还提到在 TREC 等标准评测中表现优异、适合多阶段检索架构。', tags: ['必记'] },
      { name: 'rrfFusion 实现与实测排序变化', note: '代码要点：final int K = 60；两个 Map——rrfScores 按 docId 累加 1.0/(K+rank)、idToChunkId 记录 metadata 里的 chunkId（缺省 "unknown"）；向量列表与关键词列表分别遍历，rank = i + 1；累加天然完成了「同一文档出现在两路就加两次分」的融合与去重；再按 value 降序 sorted、limit(topK) 取前 K，日志打出每个 chunkId 与 %.4f 的 RRF 分数；最后用 idToContent（putIfAbsent 建）按排序后的 id 取回文本，filter(Objects::nonNull)。原文给出的实测例子：向量检索的文本块排序是 0、5、25、15、4，ES 检索的排序是 15、25、0、26、3，RRF 融合之后是 0、15、25、5、26——两路都靠前的 0/15/25 被顶到最前，只出现在单路靠后的 4 被挤出 topK。这就是「排名共识」的具体效果。' },
      { name: 'qwen3-rerank 接入：端点、参数与超时', note: 'rerankFusion 先按 id 去重合并两路候选（LinkedHashMap 保序）并记录 chunkId，候选为空直接返回 emptyList；然后 POST https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank，Header 带 Authorization: Bearer <apikey>、Content-Type: application/json。请求体：model="qwen3-rerank"；input.query=用户问题、input.documents=候选文本列表；parameters.return_documents=true、parameters.top_n=topK、parameters.instruct="Given a web search query, retrieve relevant passages that answer the query."。RestTemplate 设 connectTimeout=5000、readTimeout=10000（重排是同步串行环节，超时直接卡住整条问答）。响应处理：非 2xx 抛异常、缺 output 字段抛异常、results 为空则 warn 并返回空；逐项取 document.text 与 relevance_score（无则退回 score），再用文本内容等值匹配回查 chunkId 打排名日志。注意 instruct 是可自定义的排序指令，原文用的是通用 web 搜索指令，换业务场景应改写（推断）。' },
      { name: '取舍：语义重排会弱化关键词强命中 ★', note: '原文加粗提醒的副作用：ReRank 模型通常基于专门训练的语义匹配模型（如 Cross-Encoder 或特化语义排序模型），同时输入「查询 + 文本」进行相关性评分，本质上更偏向语义层面的匹配。因此在混合检索场景下，ReRank 可能更倾向于提升语义相似度高的文档排序，从而弱化那些关键词匹配度高但语义表达不强的结果（例如型号、编号、专有名词精确命中）。执行推论：RRF 与 ReRank 不是替代关系——RRF 保留两路的排名共识、对关键词命中友好且零额外模型成本；ReRank 精度更高但引入一次网络调用与语义偏置。总结段的判据：重排序可灵活部署在各种 RAG 架构的最终环节，按业务需求调整，归根结底是在响应速度与回答质量之间找到最佳平衡。', tags: ['必记'] }
    ]
  },

  // ---------- Graph RAG ----------
  'd0092': {
    note: 'Graph RAG = 图结构 + RAG：把非结构化文本转成结构化的图，在图上做检索与推理，用图的拓扑结构定位相关信息，而不是只靠向量相似度。它直接回应查询路由篇「图库也是知识源」和问题改写篇「分解只能解决部分多跳」两处伏笔。原文以 Neo4j + Spring Data Neo4j 演示两跳查询：「电影《十面埋伏》的导演，还导演过什么电影？」',
    tags: ['已精读', 'RAG优化', 'GraphRAG', 'Neo4j'],
    kids: [
      { name: '传统 RAG 的四个结构性缺陷 ★', note: '原文先复述传统 RAG 两步（向量相似度检索若干段落 → 与问题一起输入 LLM 生成），再列出四个缺陷：① 上下文碎片化——检索到的段落彼此孤立，缺乏语义关联；② 难以处理多跳推理——例如「爱因斯坦在哪所大学工作过？该校位于哪个国家？」需要两步推理，传统 RAG 难以有效支持，并特别补充：虽然问题改写可以解决一部分，但跳数过多或逻辑过于复杂的未必能解决；③ 重复/冗余信息——不同文档可能包含相同事实，导致信息冗余或冲突；④ 缺乏全局知识结构——无法利用实体之间的关系进行推理。这四条都不是「检索不够准」，而是「chunk 这种数据形态本身不承载关系」，所以调阈值/换 embedding 治不了。', tags: ['必记'] },
      { name: '核心思想与图模型三要素', note: '核心思想（原文加粗）：将非结构化文本转化为结构化的图，并在图上进行智能检索与推理。与传统 RAG 的主要区别：借助图数据库和知识图谱技术，抽取文档中实体之间的关系构建图结构，不再依赖相似度检索，改用图的拓扑结构定位相关信息。知识图谱 = 以图结构表示实体及其关系的知识库，事物（人、地点、事件、概念）建模为节点（实体），语义关系建模为边（关系）。图数据库 = 专门存储/查询/管理图结构数据的 NoSQL 数据库，三个核心模型：节点 Node（用户、商品、城市）、边 Edge/Relationship（购买、关注、位于；有方向、可选，可携带属性）、属性 Property（键值对，如 {name: "张三", age: 30}），天然适合高度互联的数据。' },
      { name: 'Neo4j 部署与接入配置', note: '部署：docker run --name neo4j -p 7474:7474 -p 7687:7687，挂载 $HOME/neo4j/data:/data、logs:/logs、conf:/conf，-e NEO4J_AUTH=neo4j/neo4j666，-e NEO4JLABS_PLUGINS=\'["apoc"]\'，镜像 neo4j:5.22-community；成功后用 http://localhost:7474 访问（7474 是 HTTP 浏览器端口，7687 是 Bolt 端口）。接入：依赖 spring-boot-starter-data-neo4j；配置 spring.neo4j.uri=bolt://localhost:7687 与 authentication.username/password。实体映射：@Node("Movie") 类 Movie（@Id private String title; private int year;）、@Node("Director") 类 Director（private String director; @Id private String name;）——注意主键直接用业务字段 title/name，不是自增 id。' },
      { name: '两跳 Cypher：一条查询走完「导演→其他作品」 ★', note: 'MovieGraphRepository extends Neo4jRepository<Movie, String>，@Query 内容：MATCH (m:Movie {title: $title}) <-[:DIRECTED]- (d:Director) -[:DIRECTED]-> (other:Movie) WHERE other.title <> $title RETURN d.name AS director, collect(other.title + \' (\' + other.year + \')\') AS otherMovies，返回 List<DirectorMoviesDto>（director + List<String> otherMovies）。机制：一次 MATCH里走两条 DIRECTED 边即完成两跳，WHERE 排除原片本身，collect 把多部作品聚成一个列表——这正是向量检索做不到的「沿关系走」。数据初始化的分工（原文明确指出）：neo4jTemplate.save 可以直接保存节点（张艺谋、陈思诚；十面埋伏 2004、影 2016、英雄 2002、误杀 2019），但关系必须用 neo4jClient.query("MATCH (p:Director {name:$name}), (m:Movie {title:$title}) MERGE (p)-[:DIRECTED]->(m)").bind(...).to(...).run()，即用 Cypher 语言建边。', tags: ['必记'] },
      { name: '图检索结果如何进 prompt，以及本例的边界', note: 'GraphService.retrieveContext(movieName) 把查询结果拼成自然语言上下文（「- 导演 %s 还执导了：%s」），查不到时返回「未找到导演过《X》的导演的其他作品。」；GraphRagController.ask 再把上下文塞进提示词：「你是一个电影知识助手，请根据以下上下文回答问题。如果上下文没有足够信息，请回答我不知道。」——与 rag-02 的分工完全一致：图数据库负责「找得到关系」，交给 LLM 引用的仍是文本化后的结果，图本身不能用来生成。边界（原文可见事实）：本例的实体与关系是手工初始化的 4 部电影 + 2 位导演，正文讲了「抽取文档中实体之间的关系构建图结构」是 Graph RAG 的核心，但没有给出自动抽取（实体识别/关系抽取/Text2Cypher）的实现，这部分留到后续项目。代价（推断）：建图与维护成本远高于切片向量化，且图覆盖不到的知识仍需向量检索兜底——这也解释了为什么查询路由要把 GRAPH 与 VECTOR 并列而非互斥。' }
    ]
  },

  // ==================== g-rag-modular 模块化 / 多模态 / Agentic（7 篇） ====================

  // ---------- Spring AI Modular RAG ----------
  'd0093': {
    note: 'Spring AI 的 Modular RAG 支持核心是 RetrievalAugmentationAdvisor：把前面手写的 Advanced RAG 流程拆成五个可插拔阶段（QueryTransformer → QueryExpander → DocumentRetriever → DocumentJoiner → QueryAugmenter）。作者评价原文照录：「虽然比较弱，聊胜于无吧」；对复杂业务或定制要求更高的场景更推荐使用它。文末判据：这些步骤并非必须全部启用，应按实际需求、性能和成本灵活选择与组合。',
    tags: ['已精读', 'ModularRAG', 'SpringAI'],
    kids: [
      { name: '五段流水线与必需/可选关系 ★', note: 'RetrievalAugmentationAdvisor.builder() 的五个挂载点：queryTransformers（查询预处理：转换查询，可选）、queryExpander（查询预处理：扩展查询，可选）、documentRetriever（检索阶段：从向量库检索文档，必需）、documentJoiner（后处理：合并文档，使用查询扩展时推荐）、queryAugmenter（生成阶段：构建增强提示词，可选、有默认实现）。用法与其他 Advisor 一致：chatClient.prompt().advisors(retrievalAugmentationAdvisor).user("用户的问题").call().content()。原文总结的标准流程：提问 → 问题重写 → 文档整合 → 提示增强 → 生成回答。必需项只有检索器——「没有他，也就一切都没必要了」。注意：Advisor 封装的完整 RAG 流程图在原文截图里，正文未逐条列出图中内容。', tags: ['必记'] },
      { name: 'VectorStoreDocumentRetriever：四个参数', note: '主要实现是 VectorStoreDocumentRetriever，基于向量相似度从 VectorStore 检索文档。builder 参数：vectorStore（必需，绑定向量存储）、topK(5)（返回最相似的 5 个文档）、similarityThreshold(0.6)（相似度低于 0.6 的过滤掉）、filterExpression("source == \'docs.spring.io\'")（元数据过滤表达式）。运行时动态传过滤条件：.advisors(a -> a.param(VectorStoreDocumentRetriever.FILTER_EXPRESSION, "fileName == \'" + fileName + "\'"))，原文实战用的阈值是 similarityThreshold(0.50)。与元数据过滤篇的 SearchRequest.filterExpression 是同一能力的 Advisor 版；阈值 0.5 / 0.6 与 LangChain4J 篇的 minScore 0.7 各不相同，印证「阈值必须按库和问法实测」。' },
      { name: 'QueryTransformer 三实现：富化 / 改写 / 翻译 ★', note: '原文先给本质判断：不论哪种 QueryTransformer 实现，从源码看本质上都是发起一次大模型 API 调用——所以每挂一个就多一次延迟与 token 成本。三个实现：① CompressionQueryTransformer：多轮对话时把当前问题压缩成一个完整且独立的查询，避免丢失上下文，等价于问题改写篇的「富化」，能补全代词主语；② RewriteQueryTransformer：把原始问题改写成更利于检索的关键词问法，去掉冗余表达、口语化连接词、介词，使问题更具体，但没有上下文关联，多轮会话中无法替换代词；③ TranslationQueryTransformer：把问题翻译成文档库使用的语言（默认英文），文档库是英文而用户问中文就很可能检索不到，用 targetLanguage("zh") 指定目标语言。三者都用 chatClientBuilder(ChatClient.builder(chatModel).build().mutate()) 构建。取舍：富化与改写不可互相替代——一个补历史、一个去噪声。', tags: ['必记'] },
      { name: '《三国演义》实测：三种改写各自的能与不能', note: '知识库用《三国演义》第三章节构建。① 富化实测：Query.builder().text("他的字是什么？").history(new UserMessage("刘备是谁的后人？"), new AssistantMessage("中山靖王刘胜之后，汉景帝阁下玄孙。"))，CompressionQueryTransformer.transform(query) 后日志显示代词已换成明确主语，作者确认与问题重写篇描述一致。② 改写实测：text 换成「我正在看三国演义，我很喜欢他，你告诉我他的字到底是什么？」，RewriteQueryTransformer 确实去掉了冗余信息，但由于没有上下文历史，无法替换问题中的代词（原文附前后日志截图）。③ 翻译实测：库里存中文，故用英文 Query "What is Liu Bei\'s courtesy name?" + targetLanguage("zh") 演示。代码细节：日志打印的是 transform 后的 Query，而 chatClient 调用传的仍是 query.text()，历史通过 Query.history 承载；改写效果本身在截图里，正文未给出改写后的完整文本。' },
      { name: 'Expander / Joiner / Augmenter：召回、去重、注入', note: 'MultiQueryExpander（QueryExpander 的默认实现）：把一个查询扩展成多个语义不同但相关的查询以提升命中率，等价于问题改写篇的「多样化」；参数 numberOfQueries(3) 扩展条数、includeOriginal(true) 是否包含原始问题，原文实测扩展结果为 4 条 = 3 条扩展 + 1 条原始，「这样就可以一定程度上增加命中文本块的概率」。ConcatenationDocumentJoiner（DocumentJoiner 默认实现）：把多路检索返回的文本块拼成统一文档列表，按文档 ID 去重、再按 score 降序排序——即 rag-01 埋的「排序、截断、去重」伏笔的框架实现。ContextualQueryAugmenter（QueryAugmenter 默认实现）：allowEmptyContext(true) 允许空上下文；原文加粗区分时机——QueryTransformer 作用于检索前，QueryAugmenter 专注于生成前增强上下文。debug 打出的默认模板是英文：Context information is below. --- 检索文本 --- Given the context information and no prior knowledge, answer the query. 两条规则：答案不在上下文里就说不知道；避免「Based on the context...」「The provided information...」这类表述；末尾 Query: / Answer:。中文业务通常需要自定义这个模板（推断）。' }
    ]
  },

  // ---------- LangChain4J Modular RAG ----------
  'd0094': {
    note: 'LangChain4J 的模块化 RAG 由 RetrievalAugmentor 接口的默认实现 DefaultRetrievalAugmentor 承载，五个组件：ContentRetriever（必需）、QueryTransformer、QueryRouter、ContentAggregator、ContentInjector。作者结论（原文加粗）：在 RAG 这块，langchain4j 的能力更强一些，实现更加丰富一点——尤其是查询路由、内容聚合（重排序）和 Web 搜索检索器是 Spring AI 没有的。',
    tags: ['已精读', 'ModularRAG', 'LangChain4J'],
    kids: [
      { name: '五组件与 AiServices 装配', note: 'DefaultRetrievalAugmentor.builder()：contentRetriever（从向量库或其他数据源检索内容，必需）、queryTransformer（查询转换器，可选）、queryRouter（查询路由器，可选）、contentAggregator（内容聚合器，可选）、contentInjector（内容注入器，可选）。装配：AiServices.builder(LangChainAiService.class).chatModel(chatModel).chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10)).retrievalAugmentor(augmentor).build()。QueryTransformer 默认只给了两个实现：CompressingQueryTransformer（等价「富化」，看提示词即知）与 ExpandingQueryTransformer（把单个查询扩展为多个语义相关查询、从不同角度检索以提高召回率，等价「分解/多样化」）——原文指出官方文档提到的改写方式并没有全部实现。组件与 Spring AI 的对应：ContentRetriever↔DocumentRetriever、ContentInjector↔QueryAugmenter、ContentAggregator↔（Spring AI 缺失的重排环节）。' },
      { name: '坑：ContentRetriever 与 QueryRouter 只能传一个 ★', note: '原文引用块强调（并加粗复述）：ContentRetriever 和 QueryRouter 在构造的时候传入一个即可，因为他们最终都是设置 QueryRouter，如果一起用，会被互相覆盖。机制：DefaultRetrievalAugmentor 的成员变量里其实没有 ContentRetriever——从 DefaultRetrievalAugmentorBuilder 源码可见，传 contentRetriever 时框架是构造了一个对应的 QueryRouter（DefaultQueryRouter）把它包起来。所以只传 contentRetriever 也能跑，但一旦同时显式传 queryRouter，前者就被覆盖失效。这是「框架把检索器藏在路由器里」这一设计带来的隐性陷阱。', tags: ['必记'] },
      { name: 'EmbeddingStoreContentRetriever 与 PgVector 配置', note: 'EmbeddingStoreContentRetriever 实现 ContentRetriever，功能类似 Spring AI 的 VectorStoreDocumentRetriever。必需参数：embeddingStore（向量数据库实例）、embeddingModel（用于查询向量化）；可选：maxResults(5)（Top-K，默认 3）、minScore(0.7)（最小相似度阈值 0.0–1.0，低于此分数的结果被过滤）。EmbeddingStore 默认只有 InMemoryEmbeddingStore，其余靠加依赖扩展（官方 integrations/embedding-stores 目录）；示例用 langchain4j-pgvector 1.10.0-beta18 + PgVectorEmbeddingStore.builder()，必填 host、port(5432)、database、user、password、table、dimension(embeddingModel.dimension())——维度必须与向量模型一致，这与 rag-02 的 384/768/1536 维讨论直接相关。EmbeddingModel 同样可扩展（integrations/embedding-models），示例 OpenAiEmbeddingModel.builder().apiKey(System.getenv("OPENAI_API_KEY")).modelName("text-embedding-3-small")（或 text-embedding-3-large）。' },
      { name: 'WebSearchContentRetriever + 两种 QueryRouter', note: 'WebSearchContentRetriever 从互联网搜索引擎检索实时信息，让应用不只依赖预先存储的向量库；必需参数是 webSearchEngine，maxResults(5)。两种引擎示例：GoogleCustomSearchEngine（apiKey + csi 即 Custom Search Engine ID）；TavilyWebSearchEngine（apiKey + includeAnswer(true) + searchDepth("advanced")，依赖 langchain4j-web-search-engine-tavily 1.8.0-beta15 并 exclusions 掉 dev.langchain4j:*，tavily 账号可用 google 登录直接拿 key）。QueryRouter 入参是用户查询、出参是 ContentRetriever 列表，两个实现：DefaultQueryRouter 无脑把所有查询路由给提前配置好的一批检索器；LanguageModelQueryRouter 用 LLM 按查询类型/意图分发，builder 里 retriever("VECTOR", vectorRetriever)、retriever("GRAPH", graphRetriever)、retriever("RELATIONAL", relationalRetriever)、retriever("WEB", webRetriever) + defaultRetriever(vectorRetriever) 兜底，示例问题分别覆盖「RAG 技术的优势」「刘备和张飞是什么关系」「2024年第一季度销售额」「今天北京的天气」。也可手写 lambda 路由：query.text().toLowerCase() 含「最新/今天/现在/当前」就返回 webRetriever，否则 vectorRetriever——零模型成本的规则路由 vs 一次 LLM 调用的语义路由，是明确的取舍。' },
      { name: 'ContentAggregator：Spring AI 没有的重排环节 ★', note: '原文指出 ContentAggregator 这个功能是 Spring AI 中没有的，就是重排序篇讲的那一环，且官方直接提供了 RRF 与 ReRank 模型两种实现：① DefaultContentAggregator 是默认实现，用的就是 RRF 重排序；② ReRankingContentAggregator 用更精细的模型（如 Cross-Encoder）对候选文档与查询的相关性重新评分排序，需要传入 scoringModel，可选模型见官方 integrations/scoring-reranking-models 目录；示例依赖 langchain4j-jina 1.10.0-beta18 + JinaScoringModel.builder().apiKey(System.getenv("JINA_API_KEY")).modelName("jina-reranker-v2-base-multilingual")，再 ReRankingContentAggregator.builder().scoringModel(scoringModel).build() 挂到 contentAggregator。ContentInjector 就是上下文融合：把检索文档与用户消息融进一个提示词，默认 DefaultContentInjector 代码很简单，就是把 userMessage 和文档内容拼到一起。总结：这些组件可任意组装、可用官方默认与扩展、也可自己重写（自定义问题改写器、查询路由器等）。', tags: ['必记'] }
    ]
  },

  // ---------- 基于 LangChain4J 实现简单的 RAG 检索 ----------
  'd0095': {
    note: '用 DefaultRetrievalAugmentor 跑通一条最小 RAG：Tika 加载 → 段落分片(300,50) → text-embedding-v4/768 维分批向量化 → InMemoryEmbeddingStore → 自定义 DefaultContentInjector 模板 → EmbeddingStoreContentRetriever(maxResults 5, minScore 0.7) → AiServices + 10 条窗口记忆。原文正文以代码为主，最有价值的是 6 条踩坑记录与 EmbeddingStoreIngestor 简化写法。',
    tags: ['已精读', 'LangChain4J', 'RAG实现', '踩坑'],
    kids: [
      { name: '八步最小链路与关键参数', note: '① loadDocument(filePath, new ApacheTikaDocumentParser()) 加载；② DocumentByParagraphSplitter(300, 50) 按段落分片（最大 300 字符、重叠 50）；③ OpenAiEmbeddingModel.builder().modelName("text-embedding-v4").dimensions(768).baseUrl("https://dashscope.aliyuncs.com/compatible-mode/v1") 生成 embedding，for 循环以 i = i + 9 分批 embedAll；④ new InMemoryEmbeddingStore<TextSegment>() + addAll(allEmbeddings, textSegments)；⑤ DefaultContentInjector(new PromptTemplate(...)) 自定义上下文融合模板；⑥ DefaultRetrievalAugmentor.builder().contentRetriever(EmbeddingStoreContentRetriever...maxResults(5).minScore(0.7)).contentInjector(...)；⑦ AiServices.builder(LangChainAiService.class).chatModel(chatModel).retrievalAugmentor(...).chatMemory(MessageWindowChatMemory.withMaxMessages(10))；⑧ langChainAiService.chat(query)。对照 rag-02「长度两难」：这里给的是段落优先、300 字符 + 50 重叠（约 1/6）的具体基线，可与混合检索篇的 120/20 一起当实测起点；本批未涉及父子分片（目录 478 属 g-rag-index，仍未精读）。' },
      { name: '坑①②：addAll 必须带 textSegments、embedAll 必须分批 ★', note: '坑 1：embeddingStore.addAll(allEmbeddings, textSegments) 需要同时传入 embeddings 和 segments，一定要注意 textSegments 记得传入，否则报错 java.lang.IllegalArgumentException: textSegment cannot be null。机制：向量库存的是「向量 + 原文」两份，只给向量就丢了 rag-02 强调的「模型引用原始 text」那一半。坑 2：embeddingModel.embedAll(segmentList).content() 需要先分批，否则报错；除了手写 i += 9 的循环，也可以直接在模型上设 maxSegmentsPerBatch(9)（原文第二段示例代码就是这么做的）。原文该处示例把真实 API Key 明文写在代码里，复用时务必换成自己的 key / 环境变量。', tags: ['必记'] },
      { name: '坑③：解析器选型与 Word 报错 ★', note: '如果是 word 文档需要使用 ApacheTikaDocumentParser，否则无法解析；依赖 dev.langchain4j:langchain4j-document-parser-apache-tika:1.8.0-beta15。四种解析器对照：TextDocumentParser（langchain4j 默认，解析纯文本 TXT、HTML、MD 等）、ApachePdfBoxDocumentParser（依赖 langchain4j-document-parser-apache-pdfbox，解析 PDF）、ApachePoiDocumentParser（依赖 langchain4j-document-parser-apache-poi，解析 MS Office：DOC、DOCX、PPT、PPTX、XLS、XLSX 等）、ApacheTikaDocumentParser（自动检测并解析几乎所有现有文件格式）。用 TextDocumentParser 处理 word 的真实报错（原文照录）：java.lang.RuntimeException: The text "..." (1 characters long) doesn\'t fit into the maximum segment size (300 characters), and there is no subSplitter defined to split it further.——解析失败后整篇被当成 1 个字符的文本，进而触发分片器的长度校验，报错信息与真实原因（格式不支持）相距很远，这是典型的误导性异常。', tags: ['必记'] },
      { name: '坑⑤：模板占位符名字不能改 ★', note: '提示词模板中的占位符名字不能随便改，需要和默认模板保持一致：{{contents}} 表示检索到的文档内容，{{userMessage}} 表示用户的问题。机制：DefaultContentInjector 是按固定变量名渲染的，改名等于让检索结果无法注入，模型会在「没有上下文」的情况下作答。自定义模板本身可以大改，原文示例模板包含：角色定位（专业 RAG 问答助手，参考文档没内容务必不要胡编乱造、直接说明「没有找到相关信息」）、三条任务要求（基于参考文档回答；无相关信息就说没有找到、不要编造；有内容则尽量回答，用户输入随意时可先猜测其实际需求给出回复）、四条格式要求（全部用 Markdown 排版；上下文含图片描述标签 <image src="URL" description="多模态描述"></image>；图片与提问高度相关时把该标签转成标准 Markdown 图片 ![图片](URL)；仅在必要时包含图片、千万不要输出重复的内容和图片、确保最终 URL 不重复），末尾再次强调参考文档为空就直接回答「没有找到相关信息」。这套图片标签约定正是多模态 RAG 的输出出口。', tags: ['必记'] },
      { name: '简化写法：EmbeddingStoreIngestor 一行完成分片+向量化+入库', note: '原文第 6 条：文档的分片 + 向量化 + 入库可以简化，用 EmbeddingStoreIngestor.builder().documentSplitter(DocumentSplitters.recursive(300, 50)).embeddingModel(embeddingModel).embeddingStore(embeddingStore).build().ingest(document)。第二个接口 /retrieve1 就是这条链路：InMemoryEmbeddingStore + EmbeddingStoreIngestor 递归分片(300,50) → DefaultRetrievalAugmentor（同样 maxResults 5 / minScore 0.7 + 同一套自定义注入模板）→ AiServices 链式 build().chat(query)。对照可见：手写版用 DocumentByParagraphSplitter（段落优先），简化版用 DocumentSplitters.recursive（递归分片），两者都取 300/50——正好对应 rag-02 五种分片方式里的「递归分片」与「文档分片」，参数一致但切分策略不同，效果需实测。原文序号从 3 直接跳到 5（缺第 4 条），解析器清单以无序列表插在第 3 条之后。' }
    ]
  },

  // ---------- Spring AI 与 LangChain4J 模块化 RAG 功能对比 ----------
  'd0096': {
    note: '两框架模块化 RAG 的能力对照短文（正文仅 634 字符，无代码）。结论（原文加粗）：在 RAG 的支持上，如果要使用模块化 RAG 来自由组装这些 RAG 流程，LangChain4j 要比 Spring AI 的功能更强大一些。',
    tags: ['已精读', 'ModularRAG', '框架对比'],
    kids: [
      { name: '能力对照：谁有谁没有 ★', note: '同样都支持：查询富化、查询重写、查询扩展，以及提示增强部分的功能。Spring AI 支持但 LangChain4j 不支持：主要是查询翻译（TranslationQueryTransformer）。LangChain4j 支持但 Spring AI 不支持：查询路由、内容聚合（重排序）、混合检索这 3 个；另外虽然都支持内容检索，但 LangChain4J 除了向量数据库检索外还内置了搜索引擎的 web 检索（WebSearchContentRetriever）。选型含义：需要多数据源路由 / 重排 / 联网实时检索 → LangChain4J；需要跨语言检索（中文提问查英文库）→ Spring AI 有现成组件，LangChain4J 需自己写 QueryTransformer。', tags: ['必记'] },
      { name: '结论的适用边界', note: '原文结论限定在「要使用模块化 RAG、自由组装这些 RAG 流程」这个前提下——比的是可组装的组件覆盖面，不是模型调用、记忆、工具等其他能力，也不是性能或稳定性。与前两篇的作者口径一致：Spring AI 篇说自己的 Modular RAG 支持「比较弱，聊胜于无」，LangChain4J 篇说「langchain4j 的能力更强一些，实现更加丰富一点」。本篇正文没有给出对照表格或版本信息，逐项依据来自前两篇的组件清单。' }
    ]
  },

  // ---------- 多模态 RAG ----------
  'd0097': {
    note: '多模态 RAG 扩展传统 RAG 只处理文本的能力，让文本、图片、表格、公式都能被检索到。本篇的实现思路是「把非文本降维成文本」：用 PDFBox 逐页提取文字与图片并记录坐标，图片转 Base64 交多模态大模型生成纯文本描述，再按坐标还原阅读顺序，图片描述用 <image>...</image> 包裹，之后丝滑衔接标准 RAG 流程。核心难点是保持图文原始阅读顺序。',
    tags: ['已精读', '多模态RAG', 'PDFBox'],
    kids: [
      { name: '传统 RAG 的缺口：图片里的关键知识被直接跳过 ★', note: '原文问题陈述：实际开发中 PDF 经常包含纯文本、图片、表格，传统 RAG 对图片、复杂表格或公式无法直接处理非文本信息；当图片中包含关键数据图表、流程图或重要文字截图时，传统流程会直接跳过或忽略这部分内容，导致问答或信息提取时检索不到文档中的全部关键知识，最终生成不完整的答案。这与 rag-01 的 GIGO 原则同源：不是检索算法不行，而是索引里压根没有这部分知识。多模态 RAG 的目标（原文加粗）：结合多模态大模型和精细化内容提取，确保检索到文档中所有相关内容，无论文本还是图片。', tags: ['必记'] },
      { name: '四步前置处理：提取定位 → 识别描述 → 排序整合 → 结构化输出', note: '① 内容提取与定位：用 PDFBox 逐页处理，同时提取页面的文本元素和图片元素，并记录它们在页面上的精确坐标；② 多模态识别与描述：每个图片转成 Base64，调多模态大模型 API 识别其中的文字、图表、公式，生成详细的纯文本描述；③ 内容元素排序与整合：把文本片段与图片描述（此时已是文本）汇成一个列表，按原始坐标位置精确排序，还原 PDF 原始阅读顺序；④ 结构化输出：输出统一文本流，原始文本直接输出，图片描述用特殊的 <image>...</image> 标签包裹。作者强调：得到「纯文本 + 图文含义」的高质量输入源后，就可以丝滑衔接之前学过的标准 RAG 流程（预处理、切片、向量化、检索增强生成），后续 RAG 流程本篇不再赘述。取舍（推断）：图片语义被压成一段描述文本，描述质量成为新的天花板——描述漏掉的数据，后面检索再强也找不回来。' },
      { name: '怎么调多模态模型：ImageModel 不行，要用 ChatModel ★', note: '原文澄清：Spring AI 提供的 ImageModel 主要是用来生图的，无法用来做图像识别；做图像识别本质上还是生文，即「文 + 图生文」。做法一：new OpenAiChatModel，OpenAiChatOptions.builder().temperature(0.2d).model("qwen3-vl-plus")，OpenAiApi 的 baseUrl 为 https://dashscope.aliyuncs.com/compatible-mode/；UserMessage.builder().text("请非常简要的描述一下你看到的这个图片?").media(List.of(new Media(MimeTypeUtils.IMAGE_PNG, 图片URL.toURI())))，再 multimodalChatModel.call(new Prompt(List.of(userMessage)))。作者点破：Spring AI 其实就是构建了标准 API 请求，甚至用 httpclient 也一样——等价 curl 的 messages[0].content 是数组，含 {"type":"image_url","image_url":{"url":...}} 与 {"type":"text","text":"图中描绘的是什么景象?"}，model=qwen3-vl-plus、stream=false、temperature=0.4。做法二（代码更少）：Spring AI Alibaba 的 DashScopeChatModel，用 DashScopeChatOptions.builder().withModel("qwen3-vl-plus").withMultiModel(true)。坑（原文加粗提醒）：用这个 chatModel 必须加 withMultiModel(true)，否则会报错，并给了百炼 error-code 文档链接。', tags: ['必记'] },
      { name: 'UnifiedContentStripper：靠重写两个方法同时抓文字和图片', note: '实现关键在内部类 UnifiedContentStripper 继承 PDFBox 的 PDFTextStripper：① 拦截文字——重写 writeString 捕获文本及其坐标；② 拦截图片——重写 processOperator 拦截 PDF 的 "Do" 指令（图片绘制命令），从 CTM 变换矩阵中获取图片位置和尺寸；③ 统一坐标系——PDF 原点在左下角，用 page.getMediaBox().getHeight() 把底部坐标转换为阅读坐标系，使文字和图片可以统一排序。主流程 processPdf：Loader.loadPDF(pdfFile) → getNumberOfPages() 逐页 → new UnifiedContentStripper(pageHeight)，setStartPage/setEndPage 都设为 pageNum+1（PDFBox 页码从 1 开始）→ stripper.getText(document) 触发内部 processOperator 与 writeString → getElements() 拿全部元素。排序规则（具体阈值）：若 |e1.y0 - e2.y0| > 5 像素则认为不在同一行，按 Y 轴从上到下（Integer.compare(e2.y0, e1.y0)）；否则视为同一行，按 X 轴从左到右。每页拼完加一个空行分隔，最后 trim。图片对象来源：从 PDResources 遍历 XObject，筛出 PDImageXObject 类型。依赖 org.apache.pdfbox:pdfbox:3.0.5（原文说明：因为之前依赖过 spring-ai-pdf-document-reader，这个依赖其实已默认有了）。' },
      { name: 'processImage 与本篇的未落地处', note: 'processImage(PDImageXObject)：image.getImage() 转 BufferedImage → ImageIO.write(..., "png", baos) → Base64.getEncoder().encodeToString(imageBytes) → image2Text(base64Image) 拿描述；catch 到异常时 log.error 并返回字符串 "[图片处理错误]"（失败降级为一句话，而不是让整篇解析中断）。但 image2Text 在本篇原文里是 TODO 桩：注释「TODO: 接入真实的AI图片识别服务」，直接 return "图片介绍吧啦啦啦"。验证方式：拿事先准备的文档（里面随便放了 3 张网上的汽车图片）跑一遍，截图显示文档中的图片部分已替换成 mock 的描述内容。也就是说本篇打通的是「提取 + 坐标排序 + 标签包裹」的骨架，真实图片识别与端到端问答在下一篇实战里接入。' }
    ]
  },

  // ---------- 实战：多模态 RAG 智能问答系统 ----------
  'd0098': {
    note: '把多模态处理与模块化 RAG 串成一个可问答的小系统：MinIO 存图片 → PdfMultimodalProcessor 用真实多模态识别替换 mock 描述 → RetrievalAugmentationAdvisor 做检索增强 → 构建索引接口生成语义文本块和关键词文本块存入 PGvector → 问答时同时返回文本与相关图片。作者明确定位这是初级方案，且本实战不涉及问题改写、元数据过滤、重排序、混合检索等优化。',
    tags: ['已精读', '多模态RAG', '实战', 'MinIO'],
    kids: [
      { name: '作者自陈的能力边界：Java 文档处理生态短板 ★', note: '原文引用块加粗强调：其实在 rag 的文档处理这方面，Java 和 Python 相比，差的不是一点半点，python 有非常丰富的处理文件的库。本实战 case 只针对 pdf 中的图片做了处理，表格是没有的，PDF 中的数据公式也无法处理；如果是扫描件，现在的处理方式也不 work。作者结论：这里讲的方案还是初级，课程后面会搞一个 RAG 项目遇到这些问题，那时会采用 Python + Java 结合的方式来解决。另一处加粗下划线声明：这个小实战暂时不涉及一些优化流程，比如问题改写、元数据过滤、重排序、混合检索这些，后面有个 RAG 项目会综合利用这些技术来做优化。执行含义：本篇是「多模态能不能跑通」的验证，不是生产级文档解析方案。', tags: ['必记'] },
      { name: '四段实现流程与关键组件', note: '① MinIO 接入：MinIO 是高性能开源对象存储系统，兼容 Amazon S3 接口，专为大规模 AI/ML、数据湖、备份归档设计，轻量、易部署、高可扩展、强一致——用来存从 PDF 抽出的图片并给出可访问 URL；② 多模态文档处理：把前一篇 PdfMultimodalProcessor 里 mock 的「吧啦啦啦」图片描述改写成真实的多模态识别；③ 检索增强生成：用 Spring AI 的 modular RAG 方式，即 RetrievalAugmentationAdvisor，因为不涉及更多优化内容，只需定制 documentRetriever 和 queryAugmenter（原文该句在引用卡片摘要处被截断为「只需要定制documentRetriever和qu…」）；④ 效果演示：先调构建索引接口，生成语义文本块和关键词文本块存入 PGvector，再调检索接口看问答效果。原文缺陷：MinIO 接入、多模态文档处理、检索增强生成三节的正文都是指向其他文档的引用卡片，只带一段被截断的摘要，具体代码不在本篇；安装与接入细节需顺着卡片读原文。' },
      { name: '效果：图片以 Markdown 链接回到答案里', note: '原文贴出的演示回答是一份《紧急情况处理指南（根据《汽车用户手册（2023年版）》）》，Markdown 排版，含启动故障排查、轮胎更换流程、电子怀挡卡滞、驾驶辅助系统失效等小节，并在对应位置插入图片：> ![图片](http://192.168.112.222:9000/rag-test/pdf-image-e608a689-f6c0-4dac-937b-ac61df3c7881.png)，配「图示：启动故障应急处理流程」及对图中两条处理路径的文字解读。图片 URL 指向 MinIO（9000 端口）中按 uuid 命名的抽取图片，说明「抽图 → 对象存储 → 描述入索引 → 回答时回链原图」这条链路是通的。回答里还带出了手册细节（钥匙电池型号 CR2032、三角警示牌 50-150 米/高速 150 米外、千斤顶顶起 2-3 厘米、每 1 万公里交叉换位、胎纹深度低于 1.6 毫米必须更换、禁止连续三次尝试启动）——这些是样例文档经模型生成的回答内容，不是课程给出的技术结论。' },
      { name: '多模态到底多了什么能力 ★', note: '原文结论（加粗）：系统不仅能够返回文本内容，还能高效地检索并返回相关的图片；更关键的是，它不只是匹配图片，而是理解了图像中的具体内容和潜在含义，并将这些语义信息纳入到检索范围中，从而实现对多模态的深度理解和精确召回。机制拆解：图片先被多模态模型翻译成文本描述 → 描述与正文一起切片向量化 → 检索时图片语义参与相似度计算 → 生成时按 <image> 标签约定把描述转回 Markdown 图片（该约定见《基于 LangChain4J 实现简单的 RAG 检索》的注入模板）。所以「多模态」在索引侧其实是单模态（全文本），多模态能力发生在解析侧与输出侧——这是本方案与「直接存图片向量」路线的关键区别（后半句为推断，原文未对比其他路线）。' }
    ]
  },

  // ---------- Agentic RAG ----------
  'd0099': {
    note: '短文的分类判据：按 RAG 的执行时机、或者说由谁来决定执行，RAG 系统分两类——Generic RAG（AgentScope 框架的叫法）固定先检索后生成；Agentic RAG 把 RAG 当作 Agent 的一个工具，是否检索、何时检索由 Agent 决定。原文正文仅 903 字符，无代码。',
    tags: ['已精读', 'AgenticRAG', '范式'],
    kids: [
      { name: 'Generic RAG：固定流程，检索是必经步骤', note: '特点：每次执行的顺序是固定的，即先做知识库的检索，然后再把检索到的内容交给 LLM，由 LLM 总结后输出。原文对应项目：项目 2 用的就是这种，因为项目 2 做的是智能客服，主要职责就是基于知识库回答用户问题，所以检索是个固定流程。这正是本分支前面所有章节（索引构建、检索生成、各种优化技术、模块化 RAG）默认的形态——流程由开发者编排，模型只负责最后生成。' },
      { name: 'Agentic RAG：检索决策权交给 Agent ★', note: '特点：把 RAG 当做 Agent 的一个工具，什么时候要做知识库的检索由 Agent 决定；如果 Agent 认为当前问题需要知识检索，就会去使用 RAG 检索和生成，整个过程都由 Agent 决定。原文对应项目：项目三用到了，会由 Agent 决定什么时候去查询知识库。相比传统 RAG 多出的能力：检索从「每次必做的固定前置步骤」变成「按需调用的工具」，因此可以跳过无关检索、也可以在一次任务里多次/组合检索（后半句为推断，原文只说「由 Agent 决定」）。原文另附一张引用卡片《接入RAG 知识库，让 Agent 拥有领域知识》（标注「本期无视频，内容前面也都讲过，文档再总结一下」），卡片摘要可读到的部分：大模型参数里装着「世界的常识」，但装不下三类东西（三类具体内容被截断）；硬办法是把所有制度文档塞进 system prompt，但这样既撑爆上下文窗口，又无法按问题动态取用——这正是 RAG 的存在理由，与 rag-01 的三大局限一致。卡片正文未在本篇展开。', tags: ['必记'] }
    ]
  }

});