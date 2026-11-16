/* ke-b「17 项目：know-engine 知识库」第二批精读笔记（25 篇，全部逐篇读取原文后提炼）
 * 范围：mindmap.js 751–779 行 = g-ke-retrieve 检索与召回 9 篇 + g-ke-dialog 对话与提示词 16 篇。
 * 来源：课程原文。本批是 RAG 理论（rag-a/rag-b/rag-d）的落地实现，提炼抓住「为什么这么设计 / 踩了什么坑 / 效果数字」。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 *
 * 原文缺陷已如实标注（均经 read_doc + list_all_blocks 双重确认）：
 *  - 混合检索篇：MAX_RESULT / MIN_SCORE 常量值未给出，只有示例代码里的 5 / 0.5；ElasticsearchConfiguration 实现类列表为截图。
 *  - BGE 重排篇：normalize 等参数名的小标题在闪存转换中丢失；重排效果只有截图无数字；BGE 各版本 max length 对照表为空列表项。
 *  - 对话表结构篇：会话状态枚举值、ChatConversation / ChatMessage / RagReference 字段清单全部缺失（正文只剩小标题 + 4 条设计说明），业务流程为一张 SVG 图。
 *  - 标题摘要篇：「为什么选择虚拟线程？」「为什么选择 qwen3.5-flash？」两节正文为空（编号列表项 1/2/3 无内容）。
 *  - 意图提示词优化篇：无量化准确率；「车是好车就是售后服务有点慢」「车险怎么买比较划算」「我的车」三个 case 只有标题无对比输出；新旧输出未标注哪段是哪版。
 *  - 重写踩坑与 LLM 对比篇：模型对比表格与 20 轮测试结果在原文中确实不存在（block 级只有 p/code，无 table 也无 image），仅存文字结论。
 *  - 图片召回篇：结尾「提交的代码修改如下：」后无内容；提示词修改处为截图。
 *  - 多篇内嵌的 ✅ 子文档链接被闪存截断为摘要（带 LLMentor 占位），细节以本批对应单篇为准。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ==================== g-ke-retrieve 检索与召回（9 篇） ====================

  'd0301': {
    note: 'know-engine 的 RAG 骨架选型：不用 Spring AI 而围绕 LangChain4j 的 RetrievalAugmentor / DefaultRetrievalAugmentor 搭建，五大组件（QueryTransformer / QueryRouter / ContentRetriever / ContentAggregator / ContentInjector）全部自定义。原文给出 augment() 的五步执行顺序，是后面 8 篇检索文档的总纲。',
    tags: ['已精读', 'know-engine', '模块化RAG', 'LangChain4j'],
    kids: [
      { name: '前提：不配 RetrievalAugmentor 就根本不检索 ★', note: '原文判断：RetrievalAugmentor 是 LangChain4j 中 RAG 检索的核心组件，只有给一个 AIService 配置了 RetrievalAugmentor 之后，他才会做检索。项目选型理由：Spring AI 也有模块化 RAG 支持，但 LangChain4j 的「甚至功能更加强大」，所以整个项目围绕这个机制实现检索流程。', tags: ['必记'] },
      { name: '装配清单：四个检索器 + 四个自定义组件', note: 'DefaultRetrievalAugmentor.builder() 上挂：queryRouter(new DefaultQueryRouter(List.of(embeddingRetriever, fullTextRetriever, sqlRetriever, neo4jRetriever), chatModel))、queryTransformer、contentAggregator（注释写明「多层去重+RRF」）、contentInjector（自定义注入模板）。即项目一开始就规划了向量 / 全文 / Text2SQL / Text2Cypher 四路数据源，而不是只有向量一路。' },
      { name: 'augment() 五步：改写 → 路由+检索（内部并行）→ 聚合 → 注入', note: '原文代码顺序：① Query originalQuery = Query.from(queryText, augmentationRequest.metadata()) 从 UserMessage 提取原始查询；② queries = queryTransformer.transform(originalQuery)；③ queryToContents = process(queries)（注释标为「步骤2+3: 查询路由 + 内容检索（内部并行）」，返回 Map<Query, Collection<List<Content>>>）；④ contents = contentAggregator.aggregate(queryToContents)；⑤ augmentedChatMessage = contentInjector.inject(contents, chatMessage)，最后 AugmentationResult 同时带回 chatMessage 与 contents。对应 rag-b 的模块化 RAG 理论：这里 contents 被单独返回，正是后面「引用溯源」能拿到重排后参考资料的原因（推断）。' },
      { name: '如实标注：内嵌子文档被截断', note: '正文引用的《LangChain4J中的Modular RAG支持》在闪存转换中只剩摘要 + LLMentor 占位，Modular RAG 各组件的原始介绍不在本篇正文内。本篇自身内容完整（2004 字符），无缺段。' }
    ]
  },

  'd0302': {
    note: '问题改写的落地实现 KnowEngineQueryTransformer：一次 LLM 调用组合四种改写策略（简洁 / 抽象概念 / 错别字 / 车型标准化），返回「改写后 + 原始」两个 Query。本篇是纯代码文档，也正是 rag-d《解决问题重写导致的召回不准》里被判定为病灶的那个版本——硬编码拼接用户Id与当前时间。',
    tags: ['已精读', 'know-engine', '问题改写', '纯代码'],
    kids: [
      { name: '提示词四策略与「一次调用组合处理」', note: 'LG_AGENT_PROMPT 设定角色为汽车智能客服助手，目标是让改写后的问题「在查询向量数据库/关系型数据库/图数据库时有更好的结果」。四策略：① 简洁改写——删无意义语气词/修饰词/重复词，尤其是车型配置、价格政策问题里的无意义日期与编号，疑问句转陈述句；② 抽象概念改写——「我的车每次踩刹车的时候都有吱吱吱的声音很吵怎么办」→「车辆刹车异响故障排查」；③ 错别字改写——含把汽车术语打成拼音的情况，明确「大小写不一样不属于错别字」；④ 车型信息提取——「特斯拉毛豆3」→「Tesla Model 3」，「比亚迪汉」保持不变。收尾约束：逐一使用四策略后给出一个统一结果，直接输出改写结果、不输出思考过程，不需要改写就输出原问题。7 组 Input/Output few-shot（如「保险什么时候到期？」→「车辆保险到期查询」）。对应 rag-b 的分解/富化/多样化理论：项目不为每种策略各调一次 LLM，而是合并成一次调用（该取舍在《问题重写支持多轮对话》篇明确说明「那样就太慢了」）。' },
      { name: '返回两个 Query：改写后做语义检索、原始做精确匹配', note: 'transform() 最后 return List.of(compressedQuery, query)。类注释明确：返回的集合包含两个查询——改写后的查询（用于语义检索）和原始查询（用于精确匹配）。这个「一次改写产出两个 Query」的设计直接导致后面 ReRankingContentAggregator 抛「contains 2 queries, making the re-ranking ambiguous」，必须配 querySelector（见 BGE 重排篇）。' },
      { name: '坑：改写结果被硬编码业务上下文污染 ★', note: '代码在 LLM 给出干净结果后拼接：newQuery = "我的问题是：" + response + ", 我的用户Id是: 123321" + ", 现在是：" + LocalDateTime.now()，再用它构造 compressedQuery。类注释把这步写成正常流程（「构造增强查询（添加用户ID、当前时间等上下文）」），本意是让 Text2SQL 更准。但这份被污染的 Query 会流向所有 Retriever，embedding 与 BM25 全部跑偏——rag-d 已记录其后果与处方（QueryTransformer 属语义层，不应承担业务上下文注入职责，应下沉到只有 NL2SQL 才经过的 SqlDatabaseContentRetriever 内部拼接）。读本篇时要意识到：这是修复前的版本。', tags: ['必记'] },
      { name: '工程细节：进度回调 + 虚拟线程异步回写 + 静态 ApplicationContext', note: '① 方法开头 progressCallback.accept("[PROGRESS]:正在优化您的问题...")，把改写阶段暴露给前端（见「把 RAG 过程内容返回给用户」篇）。② assistantMsgId 非空时用 Thread.ofVirtual().name("query-transform-" + assistantMsgId).start(...) 异步调 chatMessageService.updateTransformContent(assistantMsgId, newQuery)，失败只 log.warn 不阻断检索。③ ChatMessageService 不是注入进来的，而是通过 static volatile ApplicationContext + setApplicationContext()（注释说由 SpringContextHolder 调用一次）再 getBean 取得，取不到就返回 null 跳过回写。推断：因为 QueryTransformer 是每次请求 new 出来的普通对象、不是 Spring bean，无法用依赖注入，只能走全局容器兜底。④ 原文自相矛盾处：类注释写「支持四种改写策略」但下面的 <ul> 只列了 3 条（漏了车型信息提取），提示词里实际是 4 条。' }
    ]
  },

  'd0303': {
    note: '查询路由的落地实现 KnowEngineQueryRouter：用 LLM 把问题判成 relational_db / graph_db / knowledge_base 三选一，再按 Retriever 的 Java 类型过滤出对应检索器。纯代码文档。关键设计是「一次只选一个数据源」，且路由失败与未知策略的降级行为完全不同。',
    tags: ['已精读', 'know-engine', '查询路由', '纯代码'],
    kids: [
      { name: '三类数据源的判定规则（提示词原文）', note: '角色设定强调「你的任务不是直接回答问题，而是分析问题语义，决定应调用哪种或哪几种数据源来获取答案」。① relational_db：结构化数据（车辆信息/保险信息/订单信息）、用户个人拥有车辆的信息（发动机号、下次保养时间、车辆里程）、明确实体属性/时间范围/数值比较/聚合（SUM、COUNT、AVG），示例「我的保险还有多少天到期？」；② graph_db：实体关系、路径、连接性、层级或网络结构，关键词「谁的发动机是…」「A和B之间有什么联系」「最短路径」「影响链」，示例「纯电车型都有哪些？」；③ knowledge_base：语义相似/模糊匹配/非结构化文本理解，「类似/相关/推荐/总结/解释某段内容」意图，汽车售前售后技术支持营销政策，示例「发动机异响怎么处理？」「如何打开零重力座椅？」。' },
      { name: '结构化输出契约：strategy 三选一 + confidence 两位小数', note: '要求严格输出 JSON、不加额外解释、不加任何 markdown 符号（原文点名 [```]）：{intent, strategy, reasoning, confidence}。约束：strategy 仅使用 "relational_db"、"graph_db"、"knowledge_base" 三个字符串值，「其一次只返回一个」（原文如此，即单路由而非多路并发）；confidence 为 0–1 小数、保留两位小数；reasoning 简洁说明判断依据。落地代码只取了 strategy 一个字段做 switch，intent / reasoning / confidence 均未参与决策（从代码读出）。原文缺陷：提示词里的 JSON 示例 "strategy": "relational_db" 后缺逗号，本身不是合法 JSON。' },
      { name: '按 instanceof 过滤 Retriever：一个容易误读的实现 ★', note: 'switch(strategy)：relational_db → filter(retriever instanceof SqlDatabaseContentRetriever)；graph_db → filter(instanceof Neo4jText2CypherRetriever)；knowledge_base → filter(instanceof AbstractElasticsearchEmbeddingStore)。第三条乍看是类型写错了（Retriever 怎么会是 EmbeddingStore），但对照《自定义基于 ElasticSearch 的向量检索器》篇可知：KnowEngineElasticsearchContentRetriever 的声明正是 extends AbstractElasticsearchEmbeddingStore implements ContentRetriever，所以这个 instanceof 是刻意生效的。代价是路由判定与「检索器继承了哪个存储基类」强耦合——全文检索器若用的是原生 ElasticsearchContentRetriever 就不会被 knowledge_base 命中（推断，原文未讨论；扩展篇另有《解决路由错误导致问答失败问题》）。', tags: ['必记'] },
      { name: '两种降级不一致：未知策略给全部、解析失败给空', note: 'switch 的 default 分支 return contentRetrievers（全部检索器都上，宁可多召回）；但 JSONException 与其他 Exception 两个 catch 块只打日志、留着 // fixme 注释，最终 return List.of()（空列表＝这一轮完全不检索）。同一类「路由不确定」的场景走了两个相反的兜底方向，原文未解释取舍。JSON 解析前先经 JsonUtil.fixJson(response) 做修复（见《如何解决模型 json 格式输出不稳定问题》篇），说明作者已知模型 JSON 输出不稳。' }
    ]
  },

  'd0304': {
    note: '混合检索落地：选 ES 做存储就是为了一份存储同时支持向量与关键词检索，但官方 ElasticsearchConfigurationHybrid 走不通——开源版 ES 不支持 RRF（license 报错），于是改用 Knn + FullText 两个独立 Retriever 交给 Router，把融合挪到应用层做。',
    tags: ['已精读', 'know-engine', '混合检索', 'ElasticSearch'],
    kids: [
      { name: '为什么必须混合：两侧短板都有具体 case ★', note: '原文加粗+下划线的两条核心问题：①「向量检索依赖语义相似度，对专有名词、精确短语、编号等缺乏精确匹配能力；且在面对极短查询时，因语义上下文有限，容易导致召回内容过于宽泛。」case 是『超级桌面』——汽车领域专有名词，近义词有 3D 桌面、手机桌面、车机桌面、桌面，纯向量检索时这些文档得分都挺高，检索效果差。②「关键词匹配是死板的字面匹配，无法理解同义词、语义表达变化或复杂的自然语言意图。」case 是「手机能否启动汽车」，实际问的是汽车启停、无钥匙进入、智能座舱功能，按分词后的关键词检索召不回、就算召回到得分也不高。这正是 rag-b 混合检索理论的项目版论证。', tags: ['必记'] },
      { name: '踩坑：开源版 ES 用不了内置 RRF ★', note: '直接用 ElasticsearchContentRetriever + ElasticsearchConfigurationHybrid 报错：[security_exception] current license is non-compliant for [Reciprocal Rank Fusion (RRF)]。根因：项目用的是 ES 开源版，开源版默认不支持 RRF 做重排序，只有企业版才支持；而 ElasticsearchContentRetriever 会默认使用内置 RRF。作者结论：「直接使用 ElasticsearchContentRetriever + ElasticsearchConfigurationHybrid 这条路走不通了」，必须自己实现混合检索。', tags: ['必记'] },
      { name: '处方：Knn 与 FullText 两个配置各建一个 Retriever', note: 'ElasticsearchConfiguration 有多个实现类（原文此处为实现类列表截图），其中 ElasticsearchConfigurationFullText 做全文、ElasticsearchConfigurationKnn 做向量。fullTextRetriever 用 FullText 配置、不传 embeddingModel；embeddingRetriever 用 Knn 配置 + openAiEmbeddingModel；两者共用 restClient、MAX_RESULT、INDEX_NAME、MIN_SCORE。再把 List.of(embeddingRetriever, fullTextRetriever) 交给 KnowEngineQueryRouter，配 contentInjector / queryTransformer / contentAggregator。即融合与重排从 ES 内部搬到了应用层的 ContentAggregator（RRF + BGE），绕开 license 限制。如实标注：MAX_RESULT / MIN_SCORE 常量值本篇未给出；同篇另一段示例代码里写的是 maxResults(5)、minScore(0.5)、indexName("know-engine")，两处索引名不一致（"know-engine" vs 常量 INDEX_NAME）。' },
      { name: '向量检索器还要再定制三件事', note: '原文结尾指出「实际的代码中，我们还需要给我们的向量检索的检索器做一些定制」，列出第 3 条：涉及到父子分段/兄弟分段时，需要把分段做替换和合并（第 1、2 条在闪存转换中为空列表项，内容缺失）。内嵌《自定义基于 ElasticSearch 的向量检索器》摘要提到 ES 支持两种 kNN 搜索方法（近似 kNN 与精确 kNN，链接 elastic.co/docs/solutions/search/vector/knn）。另需注意本篇同时引用了《解决中文分词不准确导致召回效果差的问题》：IK 装了没生效、中文被逐字切分，是全文检索这一路的前置修复条件。' }
    ]
  },

  'd0305': {
    note: '自定义 KnowEngineElasticsearchContentRetriever（纯代码文档）：一个类同时承担全文 / 混合 / 向量三种模式，并在向量模式下做兄弟分段扩展与父分段替换。它 extends AbstractElasticsearchEmbeddingStore 正是查询路由能用 instanceof 认出它的原因。父子补全的去重与丢弃逻辑都藏在这段代码里。',
    tags: ['已精读', 'know-engine', '向量检索', '父子分段', '纯代码'],
    kids: [
      { name: '三种模式一个入口，只有向量模式做父子补全 ★', note: 'retrieve(Query) 的分支：① configuration instanceof ElasticsearchConfigurationFullText → 直接 fullTextSearch(query.text())，把结果映射成 Content（只带 ContentMetadata.SCORE 与 EMBEDDING_ID）后立即 return，不做任何兄弟/父分段扩展；② 否则先 embeddingModel.embed(query.text()) 构造 EmbeddingSearchRequest（queryEmbedding / maxResults / minScore / filter）；③ instanceof ElasticsearchConfigurationHybrid → hybridSearch(request, query.text())；④ 默认走向量 this.search(request)，之后才进入兄弟扩展与父分段替换。含义（推断）：全文检索这一路拿到的永远是原始小分片、且 metadata 结构与向量路不同，这正是扩展篇《解决针对非向量检索导致重排序失败问题》的病灶来源。', tags: ['必记'] },
      { name: '兄弟分段扩展：按 brotherChunkId 过滤 + 请求内 Map 缓存', note: '取 content.textSegment().metadata().getString(BROTHER_CHUNK_ID)，非空则查 brotherDocMap；命中直接 finalContents.addAll(cachedBrotherDocs)，未命中则用 metadataKey(BROTHER_CHUNK_ID).isEqualTo(brotherChunkId) 新建 EmbeddingSearchRequest 再 search 一次并放入缓存。注意这个新 request 只带 filter，不带 queryEmbedding / maxResults / minScore——兄弟分段是纯元数据过滤捞回来的，不是相似度检索（从代码读出）。兄弟分段是「追加」，原命中分片仍保留。' },
      { name: '父分段替换：三个分支，两个都会丢掉原子分片 ★', note: '取 PARENT_CHUNK_ID 后：① parentDocMap 已缓存过该父分段 → finalContents.remove(content)，注释「说明已经用过了，这里就不用再加了，避免重复」（同一父分段只保留一份，后续子分片直接丢弃）；② 未缓存且 knowledgeSegmentService != null → getTextByChunkId(parentChunkId) 拿父分段全文，用 TextSegment.from(segmentText, content.textSegment().metadata()) 构造父 Content（沿用子分段的 metadata），remove 子分片、addAll 父分段；③ 父文本为 null → log.warn("parentChunk not found in Redis, chunkId: {}") 后同样 finalContents.remove(content)。风险（推断，原文未讨论）：Redis 与 DB 都查不到父分段时，这条本来命中的子分片被静默丢弃，等于凭空损失召回；且父 Content 沿用了子分段 metadata，所以引用溯源里记录的 chunkId 仍是子分段的 id 而非父分段 id。', tags: ['必记'] },
      { name: '排序与阈值：按文本排序而非按分数，minScore 过滤两次', note: '向量结果先 .distinct().sorted(Comparator.comparing(content -> content.textSegment().text()))——按文本内容字典序排，不是按相似度分数排；mapResultsToContentList 里又做了一次 .filter(f -> f.score() > minScore)（严格大于），而 EmbeddingSearchRequest 已经带过 minScore，等于双重过滤。对照 rag-d《解决 RRF 融合乱序和结果重复》记录的最终版「在拼装父子/兄弟补全结果后追加一道按 ES 原始 score 降序兜底」，本篇没有这道兜底——推断本篇是修复前版本。这一点很关键：RRF 得分与「列表内相对排名」强相关，输入按文本排序会让 RRF 融合失去意义。Builder 默认 configuration = ElasticsearchConfigurationKnn、indexName = "default"；另有一处命名遗留：builder 方法叫 stringRedisTemplate(...) 但参数与字段实际是 KnowledgeSegmentService。' }
    ]
  },

  'd0306': {
    note: '父子分段的切分与检索：用「Markdown 标题分段 + 父子分段」替代固定长度切分，解决完整语义单元被切两半的问题。检索用小子分片定位、展示用父分段替换，父分段打 skipEmbedding=1 不进向量库。对应 rag-a「分片长度两难」与「父子分片」的项目答案。',
    tags: ['已精读', 'know-engine', '父子分段', '分片策略'],
    kids: [
      { name: '设计动机与两阶段分工 ★', note: '原文判断：传统固定长度切分会把一个完整的语义单元（如一段说明、一个步骤）切成两半。处方是先按 Markdown 标题层级切分，保证每个分段边界在标题处；超长分段保留完整父分段用于展示时替换，检索时用小分片定位。ASCII 对比图：传统方式是「分段1(前500字) / 分段2(后500字)」，本设计是「分段1-完整内容(父分段) → 分段1a、分段1b(子分片，用于检索)」。分工写明：检索阶段小分片做向量匹配、精度高、能定位到具体知识点；展示阶段用父分段替换子分片、内容完整、用户看到完整上下文。', tags: ['必记'] },
      { name: '切分实现：splitByChunkSize 里的两条 metadata 写入', note: 'MarkdownHeaderParentTextSplitter 基于 markdown 标题层级分段并建立父子关系（原文「建立负载关系」应为笔误）。核心分支：content.length() <= chunkSize 时 result.add(segment) 直接保留；超长时 ① 生成 parentChunkId = UUID.randomUUID().toString()，fullMetadata  put CHUNK_ID = parentChunkId、SKIP_EMBEDDING = 1（注释「不生成向量」），把完整内容作为一个分片加入；② while(start < content.length()) 循环切子分片，每个子分片 subMetadata 复制父 metadata 后覆写 CHUNK_ID 为新 UUID、并 put PARENT_CHUNK_ID = parentChunkId 建立父子关系。如实标注：chunkSize 的具体取值本篇未给出；原文此处有一张切分结果截图。' },
      { name: '检索实现：父分段文本从外部服务读，替换而非追加', note: '原文说检索侧特殊处理在 KnowEngineElasticsearchHnswContentRetriever / KnowEngineElasticsearchKnnContentRetriever 中（与《自定义 ES 向量检索器》篇的 KnowEngineElasticsearchContentRetriever 类名不一致，原文未说明是改名还是两个实现）。逻辑：取 PARENT_CHUNK_ID → knowledgeSegmentService.getTextByChunkId(parentChunkId) 读父分段完整文本 → TextSegment.from(segmentText, content.textSegment().metadata()) → finalContents.remove(content) 移除子分段、finalContents.addAll(parentDocs) 加入父分段。父分段本身不向量化的意义（推断）：向量库里只有子分片，父分段只作为「展示态全文」存在于 Redis/DB，避免长文本稀释 embedding 语义。' }
    ]
  },

  'd0307': {
    note: '父子分段带来的性能问题与两级缓存处方：一次检索常命中同一父分段下的多个子分段，于是用 Redis 做跨请求缓存 + 检索器内方法级 HashMap 做请求内去重。作者明确论证了「为什么不用 Guava/Caffeine」，并给出 chunkId 天然免失效的理由。',
    tags: ['已精读', 'know-engine', '缓存设计', '性能优化'],
    kids: [
      { name: '问题成因：同父多子命中概率天然很高', note: '原文推理：父子分块检索中，一次检索可能检索到多个子分段但它们对应同一个父分段，「并且这种概率其实是比较高的，因为一般一整个段落的内容都是有关联的，这样就会导致在语义相似度检索的时候都能匹配上的概率也会更高一些」。所以要靠缓存减少对同一分段的多次数据库检索。' },
      { name: '一级 Redis：查不到回源 DB 并缓存空值', note: 'getTextByChunkId(chunkId)：先 stringRedisTemplate.opsForValue().get(chunkId)，StringUtils.hasText(text) 则直接返回；否则 super.getById(chunkId) 查 DB，命中则 set(chunkId.toString(), segment.getText()) 后返回；DB 也没有则 set(chunkId.toString(), "") 缓存空串，注释写「缓存空值，避免缓存击穿，重复查询数据库」，返回 null。术语提示（推断）：缓存不存在的 key 以防反复打 DB，业界一般称「缓存穿透」，原文用词是「缓存击穿」，此处照录原文用词。注意返回 null 会被上游检索器当作「父分段不存在」而丢弃该子分片（见 ES 检索器篇）。' },
      { name: '二级本地缓存：方法内 HashMap，用完即弃', note: '检索器里维护 Map<String, List<Content>> parentDocMap = new HashMap<>()，「这个 map 在方法执行结束后就释放了」。命中缓存的分支不再重复加父分段，而是 finalContents.remove(content) 去掉重复子分片——所以这个 Map 同时承担「少查 Redis」和「结果去重」两个职责。兄弟分段另有 brotherDocMap 同理。' },
      { name: '取舍：为什么不用 Guava Cache / Caffeine ★', note: '作者论证（原文口语但判断明确）：「其实没必要，因为我们要解决的是同一次检索的时候多个子分段对应同一个父分段的问题…多次不同的检索并不一定会有类似的情况，所以放到本地缓存其实帮助并不一定大。」并给出两侧：换成缓存框架也没问题、只要设计好淘汰策略，还能在多次不同请求间共享数据；但会带来 chunk 内容变更导致的数据不一致问题。而这个风险在本项目被天然化解：「chunk 如果变了，会生成新的 chunk，即 chunkId 也就不一样了，缓存是根据 chunkId 作为 key 存储的，所以也就会相当于失效了。」即不可变 chunk + 内容寻址式 key，让缓存一致性不需要额外机制。', tags: ['必记'] }
    ]
  },

  'd0308': {
    note: '重排落地：官方 ScoringModel 生态里没有合适的中文 rerank，于是自己把 bge-reranker-v2-m3 的 ONNX 量化版塞进 JVM，用 langchain4j 的 OnnxScoringModel + ReRankingContentAggregator 做本地 Cross-Encoder 精排。含版本选型对比、normalize 与 minScore 的关系、以及「两个 Query 导致重排歧义」的必踩坑。',
    tags: ['已精读', 'know-engine', '重排序', 'BGE', 'ONNX'],
    kids: [
      { name: '两个聚合器的差别：只融合 vs 融合+精排+过滤 ★', note: 'DefaultContentAggregator 主要工作是融合（Fusion），用 RRF；原文强调 RRF「不关心检索器返回的原始相似度分数，只关注文档在各自结果列表中的排名位置」，排名靠前权重更高、同一文档跨列表权重相加。它的关键问题（原文加粗语境）：只做融合、会把所有检索结果都给 LLM——向量检索 5 个 + 全文检索 5 个，RRF 之后保留 10 个，「这样会导致内容太多了，其实模型可能根本不需要这么多文档的」。ReRankingContentAggregator 则先 RRF 融合，再调 ScoringModel（Jina / Cohere / BGE 等）对每个片段与查询相关性精确评分，按新分数重排并可过滤低于阈值的低质量内容。这就是 rag-b/rag-d 里「重排 + minScore + topN」三件套的框架出处。', tags: ['必记'] },
      { name: '为什么自己接 BGE：三个版本的取舍', note: '官方支持的 rerank 模型可申请 API 调用（原文给了 langchain4j scoring-reranking-models 文档链接与截图），但「如果想要使用更加优质的 rerank 模型，比如比较牛逼的、适合中文的 BGE-Reranker、Qwen3-Reranker 的话，需要自己定制开发」。三版本对比：bge-reranker-v2-m3（全能首选，性价比最高，高精度同时体积小速度快，原生支持超过 100 种语言跨语言检索，大多数 RAG 应用首选）；bge-reranker-large（中文专精，精度略高但模型更大推理更慢，适合纯中文 + 极致精度 + 充足 GPU）；bge-reranker-base（轻量入门，资源占用最小，弱机器甚至 CPU 可流畅运行，适合延迟极敏感或资源受限）。项目选 v2-m3，ONNX 来自 modelscope 的 onnx-community/bge-reranker-v2-m3-ONNX。' },
      { name: 'OnnxScoringModel 四个关键配置', note: 'OnnxScoringModel 是 langchain4j 提供的本地 Reranker 评分模型，基于 ONNX Runtime 在 JVM 内直接跑 BERT 类 Cross-Encoder。原文比喻：模型是「音乐文件」，ONNX Runtime 是「万能播放器」，PyTorch/TensorFlow 训练的模型转成 ONNX 就能在任何设备高效运行。① 模型文件推荐 model_quantized.onnx（量化版，体积小推理快，精度损失极小）；有 GPU 且装了 onnxruntime_gpu 可用非量化版换更高精度。② tokenizer.json 必须是 HuggingFace 格式、且与模型配套（如 v2-m3 对应的 tokenizer），它是文件列表中最大的配置文件，含数万单词映射，用来把中文句子切成模型能看懂的数字 ID。③ modelMaxLength 定义单个文本（查询或文档）最大 Token 数，超长截断、不足填充，必须与模型支持长度一致，可在 tokenizer_config.json 的 model_max_length 字段查到，常见 512、1024。④ 归一化开关：true 把原始 Logits 经 Sigmoid 归一到 (0,1)，「便于设置统一的 minScore 阈值」；false 直接用原始输出（可能是任意实数，如 8.66 或 -11.24），必须按实际分数分布来定过滤阈值。这一条直接解释了 rag-d 里为什么会出现 -1.0304 这种负分重排结果。如实标注：normalize 等参数名的小标题在闪存转换中丢失，BGE 各版本 max length 对照表为空列表项。' },
      { name: '工程落地：依赖排除、双检锁单例、JAR 内资源转临时文件', note: '依赖 langchain4j-onnx-scoring 1.11.0-beta19 并 exclusion 掉 com.microsoft.onnxruntime:onnxruntime，再显式引入 onnxruntime 1.17.1（注释：CPU 版，兼容 macOS Monterey）——即版本冲突靠排除+锁版本解决。BgeScoringModel 用 private static volatile OnnxScoringModel instance + synchronized 双检锁做单例（模型加载昂贵，推断），路径为 classpath 下 model/bge-reranker-model/model_quantized.onnx 与 tokenizer.json。resolveClasspathToFilePath 先试 new File(resource.toURI())（IDE 或解压目录可直接用），资源在 JAR 内无法转 File 时复制到 Files.createTempFile("bge-reranker-", ...) 并 deleteOnExit；找不到资源直接抛 IllegalArgumentException 提示「请确认模型文件已放置到 resources 目录」。sessionOptions 可调 setInterOpNumThreads(2) / setIntraOpNumThreads(4) / OptLevel.ALL_OPT / setMemoryPattern(true)，GPU 用 options.addCUDA(0)；原文判断：小模型如 v2-m3 量化版默认配置就够用，不需要特别调优，未指定则默认 CPU。' },
      { name: '必踩坑：改写产出两个 Query 让重排歧义 ★', note: '报错原文：The queryToContents contains 2 queries, making the re-ranking ambiguous. Because there are multiple queries, it is unclear which one should be used for re-ranking. Please provide a querySelector in the constructor/builder. 根因：前面做过问题改写时入参是 List.of(compressedQuery, query) 两个查询，ReRankingContentAggregator 不知道该用哪个重排。处方：builder 加 querySelector。用改写后的查询 → queryToContents.keySet().iterator().next()（取第一个），原文判断「通常会使用改写后的查询做重排序效果更好，因为它更精准、噪声更少」；用原始查询 → new ArrayList<>(keySet()).get(queries.size() - 1)（取最后一个）。项目实际选前者（见引用溯源篇的 maxResults(5) + querySelector 装配）。测试入口 GET /testReranker，默认 query「什么是Java？」，用 5 条编程语言简介文档做重排，输出 ContentMetadata.RERANKED_SCORE（%.4f）。如实标注：重排效果只有截图，无前后对比数字。', tags: ['必记'] }
    ]
  },

  'd0309': {
    note: 'Chunk metadata 的字段清单与四类用途：一个 MetadataKeyConstant 常量类集中定义 15 个 key，支撑「归属扩展信息 / 父子分块 / 权限控制 / 文档引用」四件事。是 rag-a「分片要带四类信息」理论在项目里的字段级落地。',
    tags: ['已精读', 'know-engine', 'metadata', '元数据过滤'],
    kids: [
      { name: '15 个 key 的完整清单', note: 'MetadataKeyConstant（@author Hollis）：fileName（文件名称）、docId、chunkId、parentChunkId（父块ID）、brotherChunkId（同级块ID）、brotherChunkIndex、brotherChunkTotal、headerLevel（头级别）、accessibleBy（访问权限）、url（文件地址）、version（文件版本）、category（分类）、summary（摘要）、keywords（关键字）、skipEmbedding（跳过 embedding 标记）。可以看出三组设计意图：父子/兄弟关系用 4 个 key（parentChunkId + brotherChunkId + index + total）表达，兄弟分片还带序号与总数以便按原顺序拼回；headerLevel 保留标题层级；summary / keywords / category 属于「 enrich 分片语义」的预留字段（推断，本篇未展开用法）。' },
      { name: '四类用途分别对应哪条链路', note: '① 扩展信息：向量库中保存文档名称、文档地址等，「这些信息可以用来标记当前分段的归属」；② 父子分块：内嵌《父子分段的切分和检索逻辑》摘要——标题分段 + 父子分段，超长分段保留完整父分段用于展示替换；③ 权限控制：内嵌《文档检索权限体系实现》摘要——基于角色的知识库检索权限管理，权限控制贯穿「文档上传 → 切片元数据写入 → 检索过滤」全链路，在 Elasticsearch 检索层做硬过滤，无权文档不会进入后续流程（对应 accessibleBy）；④ 文档引用：内嵌《如何把引用文档内容返回给用户？》摘要——分段时记录所属文档名称与地址，用于增加回答可信度并让用户查看完整文档。' },
      { name: '原文不一致处（如实标注）', note: '① skipEmbedding 的注释写「true 表示不需要做 embedding」，但《父子分段》篇代码里实际 put 的是整数 1（fullMetadata.put(SKIP_EMBEDDING, 1)），布尔与整数两种表述并存。② 常量类包路径在本篇是 cn.hollis.llm.mentor.know.engine.ai.constant.MetadataKeyConstant，而《自定义 ES 向量检索器》篇 import 的是 ...know.engine.rag.constant.MetadataKeyConstant，两处包名不同，原文未说明。③ 本篇正文极短（2446 字符），四节用途全部靠内嵌子文档摘要承载，且这些链接在闪存中被截断为摘要 + LLMentor 占位，权限过滤与多版本的具体实现不在本篇。' }
    ]
  },

  // ==================== g-ke-dialog 对话与提示词（16 篇） ====================

  'd0310': {
    note: 'Chat 模块表结构设计：ChatConversation（会话）+ ChatMessage（消息，内含 RagReference 内部类）两个实体，四条设计决策是软删除、JSON 字段存储、改写结果落库、Token 统计。原文正文严重缺失——枚举值与字段清单都没有，只剩设计说明与一张流程图。',
    tags: ['已精读', 'know-engine', '表结构设计', '原文缺段'],
    kids: [
      { name: '四条设计决策（原文仅存的部分）', note: '① 软删除机制：删除操作仅将状态设为 DELETED，不进行物理删除（会话状态枚举名为 ChatConversationStatus，但枚举值清单在原文中缺失）；② JSON 字段存储：ragReferences 和 metadata 使用 MyBatis-Plus 的 JacksonTypeHandler 做 JSON 序列化——即引用列表与元数据不另建关联表，直接以 JSON 列存在消息行上；③ 问题改写支持：transformContent 字段存储用户问题改写后的结果，用于 RAG 优化；④ Token 统计：记录 AI 回复的 Token 消耗，便于成本分析。另有一条总纲式判断：RAG 追溯——完整记录 AI 回复引用的知识库来源，支持答案可解释性。模块职责：管理用户与 AI 的对话会话和消息记录，支持会话创建、消息存储、RAG 引用记录等完整生命周期。' },
      { name: '与其他篇的字段级对应（推断）', note: '把本篇的字段名与实现篇对照可还原出数据流：transformContent ← KnowEngineQueryTransformer 异步 updateTransformContent；ragReferences ← ProgressAwareContentAggregator 的 updateRagReferences（RagReference 含 documentId / chunkId / url / documentTitle / chunkContent / rerankScore）；content ← doOnComplete 时 updateContent 写入的流式全文；预创建的空 content assistant 占位行 ← saveAssistantMessage，并被 DatabaseChatMemoryStore.loadFromDatabase 显式过滤。以上对应关系为推断，本篇正文未给出字段清单。' },
      { name: '如实标注：原文缺陷', note: '正文仅 1074 字符。ChatConversation 小节只有「会话状态枚举（ChatConversationStatus）」一句 + 软删除一条，编号列表第 2 项为空；ChatMessage 小节只有「RAG 引用内部类（RagReference）…」一句，字段清单缺失，编号从 3 开始（1、2 项丢失）；「业务流程」节只有一张 SVG 图（无文字说明）。已用 list_all_blocks 复核：对应位置确为空段落，不是 markdown 转换丢失。故会话/消息的完整字段与状态机无法从本篇核实。' }
    ]
  },

  'd0311': {
    note: '会话标题生成：LLM 生成标题耗时 500ms–2s，为了不阻塞主对话，先用「问题前 20 字符」做临时标题同步落库，再用虚拟线程异步调轻量模型 qwen3.5-flash 生成正式标题回写，失败就保留临时标题。',
    tags: ['已精读', 'know-engine', '异步优化', '虚拟线程'],
    kids: [
      { name: '同步主流程：临时标题保证会话立即可见', note: '四步：① String tempTitle = content.substring(0, Math.min(content.length(), 20))（本地计算、快速）；② chatConversationService.createConversation(userId, tempTitle) 同步写 DB 拿到 finalConversationId；③ Thread.ofVirtual().name("title-summary-" + finalConversationId).start(...) 触发异步标题生成、不等待；④ 直接 return knowEngineApplicationService.streamingChat(...) 继续保存消息与流式对话。设计意图原文写明：临时标题截取前 20 字符，保证用户可立即看到会话。' },
      { name: '异步流程：独立轻量模型 + 关思考链 + 容错', note: '虚拟线程内单独 build 一个 OpenAiChatModel：modelName("qwen3.5-flash")（注释「轻量级模型，快速响应」）、temperature(0.7)（注释「适度创造性」）、customParameters(Map.of("enable_thinking", false))（注释「关闭思考链，加速响应」），apiKey/baseUrl 复用主配置。再用 AiServices.builder(TitleSummaryService.class) 生成代理，调 generateTitle(content) 后 chatConversationService.updateTitle(finalConversationId, aiTitle)。整个 try 块 catch Exception 只 log.warn「异步标题生成失败, 保留临时标题」——失败不影响主流程。原文「优化措施」列了三条：enable_thinking=false 减少 token 消耗与响应时间；temperature=0.7 平衡创造性与确定性、避免过度发散；独立模型实例，异步流程单独构建轻量级模型、不影响主对话模型配置。' },
      { name: '标题提示词：约束写在 SystemMessage 里', note: 'TitleSummaryService 接口用注解式提示词：@SystemMessage("你是一个对话标题生成助手。根据用户的第一句话，生成一个简洁的中文会话标题，要求：不超过20个字，不加引号，直接输出标题内容。") + @UserMessage("请根据以下用户问题生成会话标题：{{it}}")，返回 String。原文解释：SystemMessage 设定角色和约束条件（字数限制、格式要求），UserMessage 传入用户原始问题，{{it}} 为 LangChain4j 占位符。注意「不超过20个字」与临时标题的「前20字符」是两个不同口径（字 vs 字符，原文未统一）。' },
      { name: '如实标注：两个「为什么」小节正文为空', note: '原文有「为什么选择虚拟线程？」与「为什么选择 qwen3.5-flash？」两个小标题，但下面只有空的编号列表项（1. 2. 3. 4. 中前三项无内容，仅第 4 项「关闭 enable_thinking 进一步加速响应」有文字）。所以选型理由只能从代码注释与「优化措施」节读出，作者对虚拟线程 vs 线程池的完整论证不在原文中。模型名 qwen3.5-flash 按原文照录。' }
    ]
  },

  'd0312': {
    note: '意图识别的六种方案全景与适用边界（方法论篇，作者明确「项目中不一定都会用」）：提示词工程 → +槽位 → 提示词与槽位分离 → 前置 RAG 召回 → 多轮上下文关联 → 问题澄清。每种都给了优点、缺点与适用意图数量/场景，是本批最值得记的取舍表。',
    tags: ['已精读', 'know-engine', '意图识别', '方案对比'],
    kids: [
      { name: '为什么意图识别是 Agent 的命门', note: '原文判断：意图识别是很多 Agent 中的核心任务，目的是从用户输入中准确判断其背后的语义目标（如查询订单、订机票、退货申请）；很多智能体在意图识别之后会把请求路由给不同子 agent 处理，「所以意图识别至关重要，一旦意图识别识别错了，那么最终的执行结果往往也会错」。对应 know-engine 的实现：意图结果既决定走通用对话还是 RAG，又决定用哪份定制提示词（见定制提示词篇）。' },
      { name: '方案一/二：纯提示词、提示词+槽位', note: '方案一用角色定义 + few-shot + 结构化输出。示例提示词含 7 类意图分类体系（售前咨询与购买 / 售后维修与保养 / 车辆使用与技术指导 / 投诉与维权 / 客户关怀与运营 / 闲聊与通用问答 / 其他），每类给「涵盖 + 特征」，并带辨析例：「雨刮器怎么换」属技术指导（教程），「雨刮器坏了去换一下」属售后维修；闲聊类 related 必须为 false，不相关直接输出 {"related": false}。优点：简单高效，无需额外算法或模型架构，适合意图数量较少（如 10 个以内）。缺点：意图增多时要给每个意图写 few-shot、CoT，提示词迅速膨胀，模型难精准捕捉意图而识别失败；对方言、口语化等特异表达识别不稳定，出 Bad Case 只能改提示词，过程繁琐且效果难保证。方案二在此基础上加槽位抽取（如订机票需抽出发地/目的地/时间），示例给了 8 个槽位：car_model、order_id、dealer、fault_description、appointment_time、part_name、function_name、warning_light，未提到填 null。优点：后置处理更方便，意图分析节点里就把关键信息抽了；缺点：意图太多或槽位太多时要不断调整提示词，也影响输出效果。' },
      { name: '方案三：意图与槽位分离成两个节点 ★', note: '优化手段是把意图分析提示词和槽位提取提示词分离：① 意图识别节点的提示词只包含所有意图的简要描述，负责快速判断类别；② 一旦意图被识别，路由到该意图专属的槽位抽取节点，其提示词只关注当前意图需要的特定信息。优点：架构清晰易维护，新增或修改某个意图只需调整对应槽位节点、不影响其他部分；每个抽槽节点职责单一明确，避免多意图抽槽任务交叉带来的干扰与冲突，能更专注捕捉复杂文本语境中的关键要素。缺点（原文「最大的缺点」）：需要串联调用两次或多次 LLM，总响应时间变长，可能不适合对实时性要求极高的场景。适用：意图分支较多（如 10–20 个）、业务逻辑复杂但对延迟有一定容忍度，例如企业内部业务咨询系统。', tags: ['必记'] },
      { name: '方案四：前置 RAG 召回做意图泛化 ★', note: '触发条件：前几种方案用了还是不准，说明业务场景复杂——用户提问涉及大量方言、口语化或非常规表达时，依赖模型实时泛化的方案力不从心。换更大更强的模型确实能提升召回，但「成本和响应时长也扛不住。所以并不是长久之计」。处方三步：① 构建意图语料库——为每个意图预先收集和生成大量用户问法（标准问法、同义句、口语化表达、方言），形成「意图泛化知识库」；② 检索辅助识别——用户提问先与该知识库做语义相似度检索，找出最相似的几条问法及其对应意图；③ LLM 辅助决策——把检索到的相似问法当作 Few-shot 示例，连同原始问题一起交给 LLM 判断。优点：泛化能力可控，无法识别的特异表达只需加进知识库、无需反复调提示词，修 Bad Case 速度快；成本与准确率更优，有知识库辅助就能选性价比更高的小模型，同时准确率显著提升。缺点：研发成本高（要单独搞一套 RAG）；不擅处理多轮对话（主要基于单轮输入检索，难结合历史上下文）。适用：以单轮为主但存在大量特异表达的垂直领域，如地铁公交查询、地域化客服系统。这是把 RAG 用在「检索示例」而非「检索答案」上，与 rag-b 的 few-shot 检索思路一致（对应关系为推断）。', tags: ['必记'] },
      { name: '方案五/六：多轮上下文关联与问题澄清', note: '多轮：现实需求往往是多轮的，用户先说「我要打车」再补「去公司」，必须结合历史才能识别完整意图「打车去公司」。常见优化是把历史对话、近期操作的文档或数据作为辅助信息输入模型；高阶方案将意图识别与槽位抽取合并，并升级为多轮 RAG 召回，同时兼顾多轮理解与效率。澄清：当需求非常模糊或关键信息缺失时，「与其猜测，不如主动询问」——模型判断意图置信度不高或关键槽位缺失时，不直接执行或报错，而是引导式提问让用户补充，例如用户说「安排下周的会议」，系统反问「请问会议的主题和预计时长是？」。know-engine 的落地是卡片式澄清（见《RAG 问题澄清——对话卡片的实现》），把「反问」换成了「给选项」。' }
    ]
  },

  'd0313': {
    note: '意图识别提示词的实战迭代：旧版只有角色定义 + 分类体系 + 输出格式示例，实测经常识别错；作者列出 5 条根因，重写成 Role/Task/Intent Taxonomy/CoT Guidelines/Entity Rules/Output/Few-Shot 七段式，把推理过程塞进 reasoning 字段。有单测与数据集，但没有量化准确率。',
    tags: ['已精读', 'know-engine', '提示词优化', '意图识别'],
    kids: [
      { name: '旧版五条根因（作者自评） ★', note: '① 角色定义过于宽泛：「你是一个意图识别专家」没有领域针对性，模型可能用通用意图识别逻辑处理，缺乏汽车行业专业知识；② 缺乏结构化推理流程（COT），没有具体步骤，模型推理随意、容易跳过关键辨析环节；③ 易混淆场景辨析不足，维修&技术咨询、售前&优惠等未做明确辨析，导致经常识别错误；④ 没有 shot 示例，只有输出格式示例、没有输入输出配对示例，模型不知道「好」的输出长什么样，容易格式混乱或推理不充分；⑤ 输出格式不规范，宽松要求下可能输出 Markdown 代码块。注意原文说旧版「主要用到了角色定义，和 fewshot 等提示词工程的方案」，但第 4 条又说没有 shot 示例——原文自相矛盾，实际旧版只有输出格式示例。', tags: ['必记'] },
      { name: '新版七段式结构与关键约束', note: '文件名 intent-recognition-new-prompt.txt。# Role 改为「资深的汽车行业智能客服意图识别专家」，明确能力边界是「区分技术咨询与服务需求的边界」；# Task 五步（相关性判断 → 思维链推理 → 从 7 大核心意图选最匹配的一个 → 实体提取 → 格式化输出），并要求 reasoning 字段包含推理过程摘要、「严禁包含 Markdown 标记（如 ```json）或其他解释性文本」；# Intent Taxonomy 强调「请严格基于以下分类标准进行归类，不要创造新标签」，每类补上「特征：用户处于什么阶段」；# Entity Extraction Rules 8 个实体（car_model / order_id / dealer / fault_description / appointment_time / part_name / function_name / warning_light），未提及填 null；# Output JSON Structure 把 reasoning 放在第一个字段。设计要点（推断）：reasoning 前置＝用输出字段强制模型先推理再给结论，是不改模型就拿到 CoT 收益的低成本做法。' },
      { name: 'CoT 四步与三组易混淆辨析 ★', note: '# Chain of Thought Guidelines 要求按步骤思考并把简述写进 reasoning：① 相关性检测（是否含汽车、配件、服务、驾驶等关键词；不是则 related:false 且意图标为「闲聊与通用问答」）；② 场景定位（看车阶段→售前；用车阶段→技术/售后；修车阶段→售后；维权阶段→投诉）；③ 易混淆辨析（原文标为「关键步骤」）——维修 vs 技术：想「找人修/进店修」是售后，想「自己学怎么弄/了解原理」是技术指导，例「雨刮器怎么换」→技术指导、「雨刮器坏了去你们那换」→售后；咨询 vs 投诉：平静询问是咨询，强烈负面情绪并追责是投诉，例「屏幕黑屏怎么办」→技术指导、「新车屏幕就黑屏，太气人了」→投诉；售前 vs 营销：出于车辆购买考虑是售前，出于营销活动/价格考虑是营销，例「我想买一辆SUV」→售前、「能不能便宜点？」→汽车营销政策；④ 实体提取。5 组 Few-Shot 全部带 reasoning 示范：加玻璃水找不到盖子（技术指导，function_name=加玻璃水）、新车中控屏死机+订单号XYZ12345（投诉与维权，order_id=XYZ12345、fault_description=中控屏老是死机）、雨刮器去你们那换多少钱（售后维修，part_name=雨刮器）、三岁小孩子不听话能不能打（related:false，闲聊）、混动能量回收怎么工作（技术指导，car_model=混动版）。', tags: ['必记'] },
      { name: '测评方式与两个已修复 bad case', note: '作者结论：「经过实测，新版 Prompt 更适合生产环境使用，能显著提升模型输出的准确性和一致性」——但没有给出准确率数字。测评方式：运行 IntentRecognitionTest 中的单测，数据集 intent-test-dataset.json。给出输入输出配对的 case 两个：①「这车保修期多长？」——带编号 CoT 的那份输出判为「售前咨询与购买」（reasoning：询问保修期属于售前或售后政策咨询，归为售前），另一份无编号 CoT 的输出判为「售后维修与保养」；②「价格能便宜点吗？」——带编号 CoT 的判为「汽车营销政策」，另一份判为「售前咨询与购买」。推断：带编号 CoT reasoning 的是新版（与新版提示词的 reasoning 格式一致），且第②例与 CoT 辨析规则「能不能便宜点→汽车营销政策」吻合。原文缺陷：两段输出未标注新旧；「保修期多长」到底该归售前还是售后，原文没给 ground truth，无法判断这次「修复」方向是否正确。另有三个 case 只有标题无内容：「车是好车，就是售后服务有点慢」「车险怎么买比较划算？」「我的车」（最后一个仅存一句「旧版提示词：与汽车无关（related=false）」）。' }
    ]
  },

  'd0314': {
    note: '按意图定制提示词（单轮版）：6 个意图各对应 classpath 下一个提示词文件，用枚举做映射、PromptService 带缓存与兜底，最后塞进 DefaultContentInjector。核心约束是占位符只能用 {{userMessage}} 与 {{contents}}；售前要热情、技术要严谨，两者拒答话术不同。',
    tags: ['已精读', 'know-engine', '提示词工程', 'ContentInjector'],
    kids: [
      { name: '为什么要按意图分提示词', note: '原文判断：用户提问千差万别，一个固定的「检索→生成」流程无法应对所有情况，定制化提示词相当于给系统装上「大脑」。最基本的一层是把非客服相关问题路由给通用 LLM 做通用回答；客服相关问题再按分类定制，让 LLM 更专注聚焦——「比如要回答汽车的使用相关的知识，那肯定是专业性优先，而如果是回答售前问题，那肯定热情度优先」。' },
      { name: '两份提示词的实际差异：语气与拒答话术 ★', note: '售前（汽车销售顾问）：提供详尽真实的购车建议，含车型推荐、配置对比、价格区间及购车流程；「语气亲切、专业，激发用户的购买兴趣，但不得夸大或捏造产品信息」；询问具体订单/库存/优惠政策等需实时确认的信息时，引导用户通过正式销售渠道（到店咨询、官网预约）；参考资料找不到信息时同样引导正式销售渠道；关键约束里允许「或者根据你已有的通用知识进行补充说明（视你的业务需求而定）」。技术（资深汽车技术工程师）：给准确严谨的解答，含车辆系统原理、技术规格参数、故障诊断思路及操作指引；「条理清晰、术语准确，避免模糊表述」；参考资料找不到相关技术信息时直接告知「这个问题我暂时无法回答！」，且关键约束里删掉了「用通用知识补充」这一许可。两者共有的四条关键约束：严禁出现「根据参考资料」「根据文档」「根据您提供的信息」等字眼；直接把上下文知识内化为自己的知识、用自然流畅语气回答；没有相关信息就告知暂时无法回答、不要编造上下文不存在的事实；回答风格应像面对面交谈而不是引用文献。取舍很清楚：售前允许兜底引导+通用知识补充（不能冷场），技术宁可拒答也不许外推（准确性优先）。', tags: ['必记'] },
      { name: '枚举映射 + 文件缓存 + 缺失兜底', note: 'resources/prompts/ 下 6 个文件：car-before-sales-query-prompt.txt、car-complaints-query-prompt.txt、car-maintenance-query-prompt.txt、car-marketing-query-prompt.txt、car-other-query-prompt.txt、car-tech-support-query-prompt.txt。KnowEngineIntent 枚举每项绑定文件名，getIntent(IntentRecognitionResult) 用 switch 把中文意图字符串映射到枚举：售前咨询与购买→CAR_BEFORE_SALES_QUERY、投诉与维权→CAR_COMPLAINTS_QUERY、售后维修与保养→CAR_MAINTENANCE_QUERY、汽车营销政策→CAR_MARKETING_QUERY、车辆使用与技术指导→CAR_TECH_SUPPORT_QUERY、default→CAR_OTHER_QUERY（即「其他」与「闲聊」都落到 other）。PromptService 用 Map<KnowEngineIntent, String> promptCache = new ConcurrentHashMap<>() + computeIfAbsent 懒加载，PathMatchingResourcePatternResolver 读 classpath:/prompts/ + 文件名，FileCopyUtils.copyToString 以 UTF-8 读入。兜底：IOException 时若当前意图不是 CAR_OTHER_QUERY 就递归取 other 的提示词，若 other 文件也缺失则抛 RuntimeException("默认提示词文件缺失")。' },
      { name: '注入方式与占位符硬约束 ★', note: '用法：ContentInjector contentInjector = DefaultContentInjector.builder().promptTemplate(new PromptTemplate(promptService.getPrompt(intentRecognitionResult))).build()。原文强调（配图）：默认提示词支持的占位符是 {{userMessage}} 和 {{contents}}，「所以我们自定义的提示词，也需要用这两个。不能换成其他的。」测试入口 GET /ai/module/testPromptRouter?question=...：先 AiServices.builder(IntentRecognitionService.class).chatModel(chatModel).build().chat(question) 拿意图，再 return promptService.getPrompt(intentRecognitionResult) 直接返回提示词文本。注意本篇是把整份提示词（含问题与参考资料占位符）当作 ContentInjector 的 promptTemplate，这个做法在多轮对话下会出问题——见《根据不同的意图实现定制化提示词（多轮对话版本）》。', tags: ['必记'] }
    ]
  },

  'd0315': {
    note: 'ChatController.send 的四阶段全流程串讲：会话管理 → 消息持久化+意图识别 → RAG 增强检索（改写/路由/检索/聚合重排/注入）→ 流式生成。是把本批所有单篇组件串成一条链路的索引篇，正文短但信息密度高。',
    tags: ['已精读', 'know-engine', '全流程', '架构串讲'],
    kids: [
      { name: '阶段一/二：会话与分流', note: '阶段一（会话管理）：接收 userId、content、conversationId（可选）；conversationId 为空则创建新会话，用用户问题前 20 字符作临时标题同步写库，再异步（虚拟线程）调 LLM 生成摘要标题并回写；已有 conversationId 则直接使用。阶段二（消息持久化 & 意图识别）：chatMessageService.saveUserMessage 存用户消息 → IntentRecognitionService 做意图识别（基于 LLM + 结构化输出），判断是否与汽车领域相关并提取实体（车型、订单号、故障描述等）→ related=false 走 CommonChatService 通用对话分支直接返回流式结果；related=true 进入 RAG 增强检索分支。' },
      { name: '阶段三：RAG 五步与组件对应', note: 'ChatApplicationService.chat 内：① 查询改写 KnowEngineQueryTransformer（简洁/抽象/错别字纠正/车型标准化），返回改写查询 + 原始查询两个 Query，异步回写改写结果到数据库；② 查询路由 KnowEngineQueryRouter，relational_db → SqlDatabaseContentRetriever（Text2SQL）、graph_db → Neo4jText2CypherRetriever（Text2Cypher）、knowledge_base → ElasticsearchContentRetriever（ES 向量检索 + 全文检索）；③ 被路由到的 Retriever 执行检索拿 Content 列表；④ 内容聚合+重排序 ReRankingContentAggregator，用 BGE-RERANKER ONNX 模型重排，「选取第一个查询作为重排序参考」（即改写后的查询）；⑤ 内容注入 DefaultContentInjector，按意图识别结果选对应 Prompt 模板并注入检索内容。' },
      { name: '阶段四：流式输出与记忆窗口', note: '构建 KnowEngineChatAiService（含 ChatMemory，窗口 10 条），调 streamChat 流式对话，返回 Flux<String> 给前端（SSE 流式推送）。如实标注：本篇正文 1773 字符，开头「以下是 ChatController.send 方法的全流程介绍」后是一张流程图（截图），四阶段文字完整；无代码、无耗时数字。' }
    ]
  },

  'd0316': {
    note: '把 RAG 过程实时返回给用户：动机是建立信任与缓解等待焦虑（RAG 回答可能几十秒到几分钟），实现是用 [PROGRESS]: 前缀 + Reactor 的 Flux.create 把「进度回调」与「LLM token 流」桥接到同一个 SSE 流，非自有组件用装饰器代理补进度。',
    tags: ['已精读', 'know-engine', '流式输出', 'WebFlux', '可解释性'],
    kids: [
      { name: '为什么要返回过程：两条产品级理由', note: '原文判断：很多 Agent 要把执行过程返回给用户而不是直接给一个冷冰冰的最终答案，本质是因为 Agent 的工作方式已从「单次问答」进化到「多步自主执行」。① 建立信任与认知共识：普通大模型聊天像「开卷考试」，输入问题直接给答案，你不知道对错、也不知道它有没有「一本正经地胡说八道」；Agent 更像新手工程师坐在电脑前帮你干活——分析意图、问题优化、问题路由、文档检索、排序优化。② 缓解等待焦虑：RAG 回答任务可能需要几十秒甚至几分钟，界面一直转圈用户会非常焦虑甚至以为程序卡死；实时展示「正在分析意图...」「正在问题优化...」「正在文档检索...」能极大缓解焦虑，让交互更丝滑人性化。这与「引用溯源」共同构成可信 RAG 的产品化表达。' },
      { name: '协议设计：[PROGRESS]: 与 [DONE]: 前缀', note: 'ChatController#send 从意图识别处开始流式输出过程：Flux.just("[PROGRESS]:正在识别您的意图...").concatWith(Mono.fromCallable(() -> intentRecognitionService.chat(content)).subscribeOn(Schedulers.boundedElastic()).flatMapMany(result -> ...))，末尾 .concatWith(Mono.just("[DONE]:" + finalConversationId))，中间 .doOnError(e -> log.error("流式对话异常", e))。flatMapMany 内按 related 分流：false → Flux.concat(Flux.just("[PROGRESS]:正在为您生成回答..."), commonChatService.streamChat(userId, content))；true → chatApplicationService.chat(new ChatParam(userId, finalConversationId, messageId, content, intentRecognitionResult))。即前端靠字符串前缀区分「进度 / 正文 / 结束标记」，而不是另开一条通道（推断：这样只需一个 SSE 连接）。' },
      { name: '线程模型：boundedElastic 扛阻塞、parallel 推流 ★', note: 'Mono.fromCallable(...).subscribeOn(Schedulers.boundedElastic()) 的作用原文写明：把耗时的阻塞任务从 WebFlux 默认的事件循环线程（EventLoop）中剥离出来，放到专门的弹性线程池执行，「这样即使 AI 响应很慢，也不会卡住整个 Web 服务器的请求处理线程，保证了系统的高并发性能」。ChatApplicationService.chat 用 Flux.<String>create(sink -> ...) 把 RAG 各阶段进度与 LLM 流式输出桥接到同一个 Flux，末尾 .subscribeOn(Schedulers.boundedElastic()).publishOn(Schedulers.parallel())。原文对 publishOn(parallel) 的解释：引入异步边界，让 boundedElastic 线程专心执行阻塞的 RAG 操作，parallel 线程负责推送数据到前端，「确保进度消息能及时 flush」。Reactor API 逐条释义也在原文：Flux.just 创建含给定元素的流、concatWith 接到末尾、Mono.fromCallable 包装阻塞调用、flatMapMany 按意图动态切换到两条完全不同的异步管道再统一对外输出一个 Flux。', tags: ['必记'] },
      { name: '装饰器补进度：ProgressAware 系列', note: 'Flux.create 内部依次构建：带 callback 的 KnowEngineQueryTransformer、四个检索器（向量 KnowEngineElasticsearchContentRetriever / 全文 ElasticsearchContentRetriever / SqlDatabaseContentRetriever / Neo4jText2CypherRetriever，代码里都被包成 ProgressAwareContentRetriever）、ProgressAwareContentAggregator、带 callback 的 KnowEngineQueryRouter，装进 DefaultRetrievalAugmentor，再 build 出带 streamingChatModel 的 KnowEngineChatAiService，最后 streamChat(...).subscribe(token -> sink.next(token), sink::error, sink::complete)。对于「并没有直接定义一个新的」组件（ElasticsearchContentRetriever、ReRankingContentAggregator），用代理实现过程返回：ProgressAwareContentAggregator implements ContentAggregator，持有 delegate 与 Consumer<String> progressCallback，aggregate() 里先发「[PROGRESS]:正在排序筛选结果...」，调 delegate.aggregate(queryToContents)，再发「[PROGRESS]:正在生成回答...」后返回结果。QueryTransformer 侧则是 progressCallback.accept("[PROGRESS]:正在优化您的问题...")，原文说明「即执行 sink.next(msg); 将内容返回」。原文代码里每条进度都同时写了 System.out.println（照录，未解释用途）。如实标注：组件清单的编号列表有多项为空，ProgressAwareContentRetriever 的完整实现不在本篇。' }
    ]
  },

  'd0317': {
    note: '引用溯源的两步实现：分段时统一写入 DOC_ID / FILE_NAME / URL，重排精筛后在 ProgressAwareContentAggregator 里按 DOC_ID 去重构造 RagReference，一路回写 chat_message、一路以 [REFERENCE]: 前缀推给前端。这里的 Collectors.toMap 三参重载正是后来「参考资料乱序」评测事故的病灶。',
    tags: ['已精读', 'know-engine', '引用溯源', '可解释性'],
    kids: [
      { name: '第一步：分段时统一补归属 metadata', note: '动机原文：给回答增加参考来源，一方面增加回答可信度，另外也让用户直接查看完整文档获取更多信息。实现在 DocumentProcessServiceImpl#split：metadata.put(DOC_ID, document.getDocId())、put(FILE_NAME, document.getDocTitle())、put(URL, document.getDocUrl())，然后 knowledgeSegment.setMetadata(JSON.toJSONString(metadata.toMap()))。代码里留着 //todo metadata统一处理(权限相关、多版本相关）——说明权限与多版本的 metadata 注入当时尚未统一到这一处。要点：引用能力不是生成阶段让模型自己报来源，而是在索引阶段就把来源写死在分片上（推断：这样模型无法编造出处）。' },
      { name: '第二步：精排后按 DOC_ID 去重构造 RagReference ★', note: '时机选在「重排序精筛后」，代码在 ProgressAwareContentAggregator#aggregate。results.stream().collect(Collectors.toMap(content -> metadata.getInteger(DOC_ID), content -> content, (existing, replacement) -> existing)).values() 去重后 map 成 ChatMessage.RagReference，六个字段：documentId（DOC_ID + ""）、chunkId（CHUNK_ID）、url（URL）、documentTitle（FILE_NAME）、chunkContent（textSegment().text()）、rerankScore（(double) content.metadata().get(RERANKED_SCORE)）。注意去重键是 DOC_ID 而不是 chunkId——即同一篇文档只保留一条引用（合并策略取 existing，保留先遇到的那条），是文档级引用而非分段级引用。这与 rag-d 中描述的「按 chunkId 去重」不是同一版实现，读时要注意版本差异。', tags: ['必记'] },
      { name: '坑：三参 toMap 默认 HashMap，破坏重排顺序 ★', note: '本篇用的正是 Collectors.toMap 三参重载（keyMapper / valueMapper / mergeFunction），默认返回 HashMap。rag-d《解决引用信息补全导致参考资料乱序》记录的根因就是它：HashMap 不保证迭代顺序，chunkId/docId 哈希跨桶后 .values() 输出顺序偏离 Reranker 的相关度顺序，持久化引用顺序与 LLM 上下文顺序脱节，而 ragas 上下文准确率非常依赖参考资料顺序，实测掉到 0.5 左右；处方是改用四参重载显式传 LinkedHashMap::new。本篇是修复前的代码原貌。', tags: ['必记'] },
      { name: '装配与两个必须注意的细节', note: '装配：new ProgressAwareContentAggregator(ReRankingContentAggregator.builder().scoringModel(scoringModel).maxResults(5).querySelector(queryToContents -> queryToContents.keySet().iterator().next()).build(), callback, assistantMessageId, chatMessageService)——即重排后 topN=5、用第一个（改写后的）查询做重排参考。细节① 原文强调：「这里的 messageId，我们需要传入 assistantMessage 的，即模型返回的那条消息的，而不是用户提问的消息的。」细节② 回写与推送都做：chatMessageService.updateRagReferences(chatMessageId, ragReferences)（需 ragReferences 非空且 chatMessageService、chatMessageId 均非 null），以及 progressCallback.accept("[REFERENCE]:" + JSON.toJSONString(ragReferences))。原文解释用 [REFERENCE] 前缀的目的：方便前端识别这是引用相关内容，「这样就可以不在输出的正文中展示，也可以通过特殊的引用样式显示」。整个块被 try/catch 包住，失败只 log.warn「RAG 引用信息回写失败」，不影响回答生成（推断：引用是增强项而非阻塞项）。' }
    ]
  },

  'd0318': {
    note: 'AI 回复的持久化时机：对话开始就预创建一条空的 assistant 占位消息拿到 id，流式过程用 contentBuilder 累积 token，doOnComplete 时一次性 updateContent 落库；同时把内部订阅的取消传播到 sink。',
    tags: ['已精读', 'know-engine', '消息持久化', '流式输出'],
    kids: [
      { name: '为什么要预创建 assistant 消息', note: '原文起点：前面只保存了用户问题相关内容，LLM 返回的结果没保存，这个也需要保存。做法是在 ChatApplicationService#chat 对话开始时就 String assistantMessageId = chatMessageService.saveAssistantMessage(chatParam.conversationId())。推断：因为引用回写（updateRagReferences）发生在流式生成之前/之中，必须先有 assistant 消息 id 才能挂引用，所以不能等生成完再插入。这条占位记录 content 为空，会被 DatabaseChatMemoryStore.loadFromDatabase 显式过滤掉（见多轮对话篇），两处设计是配套的。' },
      { name: '累积与落库：doOnNext 攒、doOnComplete 写', note: 'knowEngineChatAiService.streamChat(conversationId, content).doOnNext(token -> { if (firstToken.compareAndSet(true, false)) { /* 标记已开始接收 token */ } contentBuilder.append(token); }).doOnComplete(() -> chatMessageService.updateContent(assistantMessageId, contentBuilder.toString())).subscribe(sink::next, sink::error, sink::complete)。原文说明：在 doOnNext 中累计流式输出的结果，在 doOnComplete 中完成更新操作。首个 token 处的注释写明兜底语义：「首个 token 到达时，如果之前没有发出正在生成回答，则补发（正常情况下由 ProgressAwareContentAggregator 已发出，此处为兜底）」——但代码块里只有注释与 compareAndSet，实际补发语句未出现（原文如此）。' },
      { name: '取消传播与风险（推断）', note: 'sink.onCancel(disposable::dispose)，注释「取消时同步取消内部订阅」——前端断开 SSE 时把上游 LLM 流一并取消，避免继续烧 token。风险（推断，原文未讨论）：内容只在 doOnComplete 落库，若流被取消或异常终止，contentBuilder 里已生成的部分不会写库，这条 assistant 消息会一直是空占位；同时 doOnError 分支也未见落库逻辑。原文另说明引用信息由 chatMessageService.updateRagReferences(chatMessageId, ragReferences) 单独更新，与正文落库是两条写入路径。' }
    ]
  },

  'd0319': {
    note: '模型 JSON 输出不稳的兜底：JsonUtil.fixJson 用七步正则修复（剥 markdown、掐头去尾、修引号、去尾逗号、补键名引号、清非法转义、验证），修不好就包装成 {"content":"原文"}。纯代码文档，无 prose、无失败率数字。这是「事后修复」路线，与提示词里「严禁 Markdown」构成两道防线。',
    tags: ['已精读', 'know-engine', '结构化输出', '纯代码'],
    kids: [
      { name: '七步修复流水线', note: 'fixJson(String)：null 或 trim 后为空直接返回 "{}"；否则 ① extractJsonFromMarkdown——正则 ```(?:json)?\\s*([\\s\\S]*?)```（CASE_INSENSITIVE）提取代码块内容；② removeLeadingTrailingGarbage——找第一个 { 或 [ 与最后一个 } 或 ]，截取其间子串（start < end 才生效）；③ fixQuotes——中文引号 “ ” 替换为英文双引号、‘ ’ 替换为单引号，再用正则 \'([^\']*?)\' → "$1" 把单引号串换成双引号（注释：只替换键名和字符串值的单引号）；④ fixTrailingCommas——正则 ,\\s*} → }、,\\s*] → ]；⑤ fixMissingQuotes——正则 ([{,]\\s*)([a-zA-Z_][a-zA-Z0-9_]*)\\s*: → $1"$2":，给无引号键名补引号；⑥ fixEscapeChars——把未被反斜杠转义的 \\n / \\r / \\t 用 (?<!\\\\) 负向后顾匹配后替换为空格（注释提醒「需要谨慎处理，避免破坏合法的转义字符」）；⑦ objectMapper.readTree(fixed) 验证，通过则返回。' },
      { name: '兜底与配套方法', note: '验证失败时 log.warn「JSON 修复后仍然无效，返回原始字符串」，然后走 wrapAsSimpleJson(jsonString)：把反斜杠、双引号、换行、回车、制表符依次转义后包成 {"content":"..."}，再异常则返回 {"error":"Invalid JSON"}。注意兜底传的是原始 jsonString 而不是修复中的 fixed。配套：fixAndParse 返回 JsonNode，解析失败返回 objectMapper.createObjectNode()（空对象而非抛异常）；isValidJson 用 readTree 判定；prettify 用 writerWithDefaultPrettyPrinter 美化，失败原样返回。调用方见查询路由篇：JSON.parseObject(JsonUtil.fixJson(response), QueryRouteResult.class)。' },
      { name: '这套修复的代价（推断，原文未讨论）', note: '正则修复是「猜模型意图」，有两处可预见的副作用：① fixEscapeChars 把字符串值内部真实换行压成空格，多行文本（如 reasoning 摘要、故障描述）会被改写；② fixQuotes 的 \'([^\']*?)\' 会把英文所有格或缩写（如 it\'s）里的单引号误配对，进而破坏 JSON 结构；③ 兜底 wrapAsSimpleJson 产出的 {"content":...} 不含 strategy/intent 字段，路由侧反序列化后 strategy 为 null，会落到 switch 的 default（返回全部检索器）——这与「路由失败返回空列表」是两条不同路径。以上均为从代码推导的风险，原文只给代码、未给修复成功率或失败案例统计。' }
    ]
  },

  'd0320': {
    note: '多轮对话的记忆落地：自定义 DatabaseChatMemoryStore 做 Redis 缓存 + MySQL 持久化两级架构，读走 Redis→DB、写只走 Redis（DB 由业务层负责），一次对话要删两次 Redis 做上下文隔离。还解释了「为什么用 String 存 JSON 而不是 Redis List」这个容易踩的设计点。',
    tags: ['已精读', 'know-engine', '多轮对话', 'ChatMemory', '上下文隔离'],
    kids: [
      { name: '两级架构与三个常量', note: '背景：LangChain4j 官方只给了内存短期记忆，持久化记忆「官方没给现成的实现，只能靠我们自己实现」，内置接口是 ChatMemoryStore。项目 @Component DatabaseChatMemoryStore implements ChatMemoryStore，依赖 ChatMessageService + StringRedisTemplate，常量 REDIS_KEY_PREFIX = "know-engine:chat-memory:"、MAX_MESSAGES = 10、CACHE_TTL_HOURS = 1。getMessages(memoryId)：先读 Redis，命中则 ChatMessageDeserializer.messagesFromJson(json) 反序列化返回；未命中 loadFromDatabase 后 saveToRedis 回写再返回。updateMessages：trimMessages 截断保留最近 10 条 → saveToRedis。evictCache(memoryId)：stringRedisTemplate.delete(buildKey(memoryId))。' },
      { name: '读写分离：updateMessages 只写 Redis 的三个理由 ★', note: '原文写明读路径 ChatMemoryStore.getMessages() → Redis → DB（只读），写路径由业务层 saveUserMessage() / updateContent() 直接写 DB。理由：① 把最终持久化交给业务层，「我们可以控制在过程中更新记忆内容，比如引用的文档、改写后的问题等」；② LangChain4j 的 updateMessages() 在一次 LLM 调用中会被调用多次（加用户消息后一次、加 AI 回复后一次），每次都写 DB 会产生不必要的频繁 IO。③ 那干脆不实现 updateMessages 行不行？原文回答「不行的，因为 langchain4j 在运行时，会调用这个方法把 systemPrompt 也放进 list 中，如果没有实现，那么会导致 @SystemPrompt 的注解失效」。loadFromDatabase 细节：chatMessageService.getRecentMessages(conversationId, MAX_MESSAGES)，content 为 null 或空的记录 continue 跳过（注释「过滤空消息（如预创建的 assistant 占位记录）」），USER → UserMessage.from、ASSISTANT → AiMessage.from。', tags: ['必记'] },
      { name: '一次对话的六步生命周期与两次清缓存', note: '原文 ASCII 图：① saveUserMessage 用户消息写 DB；② saveAssistantMessage AI 消息写 DB（占位）；③ intentRecognitionService.chat(conversationId, content)——AiServices 内部 getMessages() Redis miss 从 DB 加载 → add SystemMessage + UserMessage → 调 LLM → add AiMessage → updateMessages() 把意图识别结果写进 Redis；④ evictCache(conversationId) 清 Redis（原文标 ★，注释「隔离意图识别的 AI 响应，避免污染后续对话记忆」）；⑤ chatApplicationService.doChat()——getMessages() Redis miss 从 DB 加载干净历史 → 更新改写后的问题与检索文本到 DB 的 UserMessage → add SystemMessage + UserMessage + RAG 上下文 → 流式调 LLM 逐 token 推送 → updateMessages() 完整记忆写 Redis；⑥ doOnComplete → updateContent(assistantMsgId, fullContent) 持久化到 DB，下次对话可从 DB 加载。两个 AiService（意图识别 + RAG 对话）共享同一个 DatabaseChatMemoryStore 与同一个 conversationId，这是污染的根源。原文指出这是踩过的坑：最初只删了第一次没删第二次，详见《支持多轮对话后的问题重写踩坑与 LLM 对比》。' },
      { name: '为什么用 String 存 JSON 而不是 Redis List ★', note: '关键语义：updateMessages(memoryId, messages) 的第二个参数是 LangChain4j 经内存管理器（如 MessageWindowChatMemory）计算后「当前这一时刻应该保留的所有有效消息的全集」，语义是「请把会话状态更新为这个列表」，不是「请追加这条消息」。原文举例：窗口限制 3 条，Redis 已有 [A, B, C]，用户发来 D，框架先在内存里变 [A, B, C, D]、发现超限自动淘汰最早的 A，于是传给你的是 [B, C, D]。若不先删旧数据而直接 RPUSH 追加，Redis 会变成 [A, B, C, B, C, D]。两个备选方案：先取出内容去重再保存，或先整体删除 Redis 再更新（原文注：list 不支持覆盖保存）。作者结论：「这两个方案都很复杂，还不如直接就保存个 json 了。」即用 String + JSON 序列化把「全集覆盖」变成一次 SET，天然幂等。', tags: ['必记'] }
    ]
  },

  'd0321': {
    note: '定制提示词的多轮版修复：单轮版把整份提示词（含占位符）当用户提示词注入，多轮下因为没设 systemMessage，LangChain4j 会沿用上一轮（意图识别）的系统提示词，导致 RAG 问答竟然返回意图识别结果。处方是 .systemMessage(prompt) + 提示词文件删掉占位符 + 注入改用默认模板。',
    tags: ['已精读', 'know-engine', '多轮对话', '提示词工程', '踩坑'],
    kids: [
      { name: '症状：问 RAG 问题却返回意图识别 JSON ★', note: '原文描述：旧版实现把整个提示词当做用户提示词给到 LLM，「这么做在单轮对话中没啥问题。但是如果是在多轮对话中就会有问题了」。机制：多轮对话中如果没有给本轮指定系统提示词，langchain4j 就会默认用上一轮的系统提示词；而项目里意图识别和 RAG 问答在同一个对话中、共享同一个 conversationId，knowEngineChatAiService 构造时 .systemMessage(prompt) 是被注释掉的，于是该 conversationId 关联的历史里带着上一次意图识别的系统提示词。结果：「明明我们调用的是一次 RAG 检索和回答，但是因为系统提示词说的是你要帮我做意图识别XXXX，就会导致最终返回的竟然是一个意图识别的结果。」', tags: ['必记'] },
      { name: '处方一：显式 .systemMessage(prompt)', note: 'String prompt = promptService.getPrompt(chatParam.intentRecognitionResult())，然后 AiServices.builder(KnowEngineChatAiService.class).chatModel(chatModel).streamingChatModel(streamingChatModel).chatMemoryProvider(memoryId -> MessageWindowChatMemory.builder().id(memoryId).maxMessages(10).chatMemoryStore(databaseChatMemoryStore).build()).systemMessage(prompt).retrievalAugmentor(retrievalAugmentor).build()。即每轮都按本轮意图显式覆盖系统提示词，不再依赖记忆里的历史 SystemMessage；记忆窗口仍是 10 条、存储仍是自定义的 databaseChatMemoryStore。' },
      { name: '处方二：提示词文件删占位符，注入回归默认模板', note: '既然提示词改作系统提示词，就要把中间的「问题：{{userMessage}}」「参考资料：{{contents}}」两行移除，只保留角色设定与关键约束（原文给了删除前后两份完整汽车销售顾问提示词做对照，其余文字一字未改）。占位符替换「那就干脆用默认的就行了」，即 DefaultContentInjector 的 DEFAULT_PROMPT_TEMPLATE = PromptTemplate.from("{{userMessage}}\\nAnswer using the following information:\\n{{contents}}")。职责分离由此清晰：意图决定「系统提示词（人设与约束）」，ContentInjector 默认模板决定「用户消息 + 参考资料怎么拼」。对照单轮版可知这是一次抽象层次修正（推断）：把「本轮身份」从用户消息里挪回系统消息位，才能与多轮记忆共存。' }
    ]
  },

  'd0322': {
    note: '问题重写支持多轮：给改写提示词加第 5 条策略（结合历史对话做指代消除与上下文补全，重组为独立完整的检索问句），并用 {{chatMemory}} 占位符把 query.metadata().chatMemory() 注入。原文很短，核心是「一次 LLM 调用组合多种改写」的取舍与一条强输出约束。',
    tags: ['已精读', 'know-engine', '问题改写', '多轮对话'],
    kids: [
      { name: '取舍：不为每种改写各调一次 LLM', note: '原文判断（内嵌前篇摘要中保留的一段）：问题重写有分解、富化、多样化、回溯提示等很多方案，「但是实际在应用时，我们并不会让每一个改写都处理一遍，至少不会每一个方案都调用一次 LLM，那样就太慢了。一般是组合处理的。」本篇正文补充：前面讲的简洁改写、抽象概念改写、错别字改写「只支持单轮对话中，在多轮对话场景中就 gg 了」，所以要通过注入历史对话上下文让 LLM 在改写时理解多轮语境。' },
      { name: '第 5 条改写策略与提示词结构', note: '新增策略原文：「5、结合历史对话和最新提问，识别出所有相关的细节、术语和上下文信息。最后，将这条提问重新组织成一个清晰、简洁且独立完整的格式，以便于进行信息检索。」收尾改为「上面是5种改写策略，需要逐一使用最终给出一个统一的改写结果。直接输出改写后的结果，不需要输出思考过程及额外的多余内容。如果不需要改写，则直接输出原问题即可。」提示词尾部结构：### 历史对话内容 {{chatMemory}} / ### 用户问题：{{query}} / ### 要求：「非常重要的一点是：你只需要提供重新组织后的提问，不要包含任何其他内容！绝对不要在提问前添加任何多余的文字！」这条强约束是为了保证改写结果能直接当检索 query 用（推断）。' },
      { name: '代码接入点：从 Query.metadata 取记忆', note: 'List<ChatMessage> chatMemory = query.metadata().chatMemory(); String response = chatModel.chat(createPrompt(query, format(chatMemory)).text());。createPrompt(Query query, String chatMemory) 里 variables.put("query", query.text()) 与 variables.put("chatMemory", chatMemory) 后 promptTemplate.apply(variables)。即历史对话不是自己查库，而是复用 LangChain4j 在 AugmentationRequest.metadata 里带下来的 chatMemory（与 DatabaseChatMemoryStore 的 10 条窗口一致，推断）。format(chatMemory) 的实现本篇未给出。风险提示：这条链路对记忆内容的「干净程度」极其敏感——正是下一篇踩坑的入口。如实标注：本篇正文仅 1427 字符，内嵌《如何针对用户的问题做重写？》被截断为摘要。' }
    ]
  },

  'd0323': {
    note: '多轮问题重写的踩坑复盘：只删一次 Redis 导致意图识别的 JSON 结果混进改写提示词的「历史对话」，改写彻底跑偏。作者写了 ChatModelBenchmarkTest 横向对比模型、又对最好的模型做 20 轮测试，发现仍有 10% 出错，最终放弃换模型、改用二次删除 Redis 做上下文隔离。',
    tags: ['已精读', 'know-engine', '踩坑复盘', '上下文隔离', '模型对比'],
    kids: [
      { name: '症状与根因：脏记忆被当成历史对话注入 ★', note: '原文：项目中一次对话做了两次 Redis 记忆删除，「最开始我的实现中，只删除了第一次，没有删除第二次。这样就会有个坑」。不删第二次的后果：RAG 检索时 Redis 里的对话记忆包含前面意图识别的内容（用户问题和意图识别结果都有）；而问题重写会从 Redis 取记忆做指代消除与上下文补全，于是改写提示词的「历史对话内容」段里出现了两类垃圾：① User 消息后面跟着 langchain4j 结构化输出的强制指令「You must answer strictly in the following JSON format: {reasoning…, related…, intent…, entities…}」；② AI 消息是一整段意图识别 JSON（示例中 intent=车辆使用与技术指导、car_model=宝马 3系 2025款 325Li M运动套装、car_id=京B·M11223、fault_description=打不着火）。原文结论：「因为有这两部分内容的存在，导致我们默认用的 LLM 的改写结果会完全错误」。', tags: ['必记'] },
      { name: '模型对比与 20 轮稳定性测试', note: '作者写了 ChatModelBenchmarkTest：benchmarkDifferentModels 用上面这份被污染的提示词横向对比几个主要模型；benchmarkSameModelMultipleCalls 对效果最好的模型单独做 20 轮测试。文字结论：默认用的 qwen-max-latest 是「比较古早的模型」，速度还可以但输出不稳定，「经常会把意图识别为我要查询车辆信息，但其实我是想问这个车型的汽车无法启动怎么办」；效果最好的是 qwen3-30b-a3b-instruct-2507，但 20 轮测试显示「即使是效果最好的模型，也有 10% 的概率识别错误，错误的结果主要是输出了一个 json，就像上面的 deepseek-r1-distill-qwen-7b 模型一样，原因大家可以猜猜为啥。。」（作者留了个悬念未解答）。如实标注：原文「表格如下：」与「得到结果：」后面的表格/数据在文档中确实不存在——已用 list_all_blocks 复核，全篇只有 p 与 code 块，无 table 也无 image，故各模型的具体得分与 20 轮明细无法核实，10% 是原文文字给出的唯一数字。' },
      { name: '取舍：为什么不靠换模型解决', note: '作者判断：「到这里我发现换模型可能没办法彻底解决了，虽然换参数量更大的，更新的模型会更加稳定，但是那个耗时也太长了。」即更强模型能降低出错率但不能归零（最好模型仍 10%），而延迟代价不可接受——所以问题不该在模型侧解，而应在输入侧根治。' },
      { name: '最终处方：二次删除 Redis ＝ 多 agent 上下文隔离 ★', note: '原文（下划线强调）：「以上这个其实就是一种多 agent 之间的上下文隔离的手段。」具体做法：在意图识别之后、做 RAG 检索 + LLM 对话之前，先把 Redis 中的对话记忆删除，这样后面再读记忆就从数据库读，而数据库中的内容是干净的、不包括意图识别结果——「因为我没存，如果存了也可以过滤」。即两条可选路径：不持久化中间 agent 的输出（项目选择），或持久化后在读取时过滤。与《基于 langchain4j 的多轮对话的实现》篇的六步生命周期第 ④ 步 evictCache 完全对应。', tags: ['必记'] }
    ]
  },

  'd0324': {
    note: 'RAG 问题澄清的产品化实现：缺关键实体时不拒答也不猜测，而是返回卡片让用户点选。后端按意图判断需要 car_id 还是 car_model，用 [CARD]: / [CARD_CHOICE_MYCAR]: / [CARD_CHOICE_CAR]: 三种前缀推数据，前端渲染卡片网格，用户选完自动补一句话重新走完整流程。',
    tags: ['已精读', 'know-engine', '问题澄清', '对话卡片', 'SSE协议'],
    kids: [
      { name: '设计取向：用「给选项」代替「反问」', note: '原文功能定义：当用户问题缺少必要信息（如车辆信息）时，通过卡片式 UI 引导用户补充选择，「而非直接拒绝或猜测」。完整流程：用户发问 → 意图识别 → 信息完备性检查 → 缺信息则返回卡片 → 前端渲染卡片 → 用户选择 → 携带选择重新提问。对照《意图识别如何实现》篇的澄清方案（引导式提问「请问会议的主题和预计时长是？」），这里把开放式反问换成了封闭式点选（推断：降低用户输入成本，同时保证补进来的实体格式规范、可被意图识别稳定抽取）。' },
      { name: '后端完备性规则：两种意图、两个必需实体', note: '核心逻辑在 ChatApplicationService.chat()，先 KnowEngineIntent.getIntent(chatParam.intentRecognitionResult())。场景1：intent == CAR_MAINTENANCE || intent == CAR_TECH_SUPPORT 时需要 entities().car_id()；为 null 则 myCarService.getCarByUserId(chatParam.userId()) 查用户绑定车辆——列表为空返回 Flux.just("[WARN]:您还没有添加车辆信息，请先添加车辆信息")，非空返回 Flux.just("[CARD]:请先选择车辆").concatWith(Flux.just("[CARD_CHOICE_MYCAR]:" + JSON.toJSONString(...)))。场景2：intent == CAR_MARKETING 时需要 entities().car_model()；为 null 返回 "[CARD]:请先选择您要咨询的车辆" + "[CARD_CHOICE_CAR]:" + JSON。信息充足才 return doChat(chatParam) 走正常 RAG。即「我的车」（维保/技术）与「车型库」（营销）是两套不同数据源。意图识别侧 IntentRecognitionService 用 @SystemMessage + @AiService 注解输出结构化 IntentRecognitionResult，含 related、intent（售前/售后/技术支持/营销等）、entities（car_id、car_model 等）。' },
      { name: '前端协议解析与卡片渲染', note: 'chat.html 按 data: 前缀分发：startsWith("[CARD]:") → renderCardPrompt(el, data.substring(7).trim())；startsWith("[CARD_CHOICE_MYCAR]:") → JSON.parse(data.substring(20).trim()) 后 renderMyCarChoices；startsWith("[CARD_CHOICE_CAR]:") → JSON.parse(data.substring(18).trim()) 后 renderCarInfoChoices（三个 substring 偏移与前缀长度一致）。渲染职责：renderCardPrompt 渲染提示文字、renderMyCarChoices 渲染用户已绑定车辆的卡片网格、renderCarInfoChoices 渲染所有可选车型的卡片网格；卡片用 CSS Grid 布局（.card-choice-grid），每张展示车辆图片、名称、车牌/颜色等信息。' },
      { name: '闭环：选择后自动补一句话重走全流程', note: 'handleMyCarSelect()：用户选中自己的车辆后自动填入「我的车辆是：xxx」并携带 myCarId、carId 重新发送；handleCarInfoSelect()：选中车型后自动填入「我想咨询的车辆是：xxx」并携带 carId 重新发送。原文说明闭环原理：选择后重新走一遍完整对话流程，此时意图识别会从用户消息中提取到 car_id/car_model 实体，信息完备性检查通过，进入正常 RAG 对话。即澄清不是特殊分支状态机，而是「把缺失实体变成一句自然语言用户输入」再复用主链路（推断：这也是为什么多轮问题重写的上下文补全能力对本功能很关键）。跨篇差异（如实标注）：《项目中意图识别提示词的优化》篇的 8 个实体清单里没有 car_id，而本篇与《重写踩坑》篇的实际 JSON schema 都含 car_id，说明槽位后来又扩过，原文未交代。' }
    ]
  },

  'd0325': {
    note: '图片的召回与渲染：生成侧提示词加三条 Markdown/图片格式要求，图片描述生成侧禁止换行等特殊符号（多行描述会让 markdown 图片标签失效），前端 chat.html 补 markdown 渲染。原文很短，结尾的代码修改清单缺失。',
    tags: ['已精读', 'know-engine', '多模态', '图片召回', '提示词工程'],
    kids: [
      { name: '生成侧：三条格式要求约束图片输出', note: '在 RAG 最终生成提示词中增加「## 格式要求：1. 你的所有回答必须使用 Markdown 格式进行排版。2. 如何上下文信息中包含了图片描述标签 ![图片](URL)，则返回包含图片的内容。3. 仅在必要时包含图片，请注意千万不要输出重复的内容和图片，图片确保最终生成的 URL 不要重复。」（第 2 条「如何」为原文用词，应为「如果」）。原文说明目的：「增加这个约束的目的是让模型的输出更加稳定，并且可以正常返回图片」。第 3 条针对的是模型重复输出同一图片 URL 的问题（推断：与 rag-d 记录的「模型虚构图片 URL」幻觉属同一类图片幻觉防治）。' },
      { name: '索引侧：图片描述必须单行 ★', note: '图片描述生成提示词原文：「请描述这张图片的内容，包括场景、对象、布局、颜色、文字信息，直接输出纯文本描述，不要多余说明，不要增加任何特殊符号，特别是换行符」。追加最后那句的原因写得很具体：「因为一旦生成的图片描述中带有多行的话，会导致一个 markdown 的图片标签失效」，并给了反例 ![xxx\\nxxx\\nxxx](http://xxx.com)。即图片是以「描述文本 + URL」的 markdown 标签形式存在分片里的，描述里的换行会直接把标签语法打断。推断：图片能被召回，靠的是这段描述文本参与分片与向量化，而不是对图片本身做视觉 embedding——原文只给了描述生成提示词，未明确说明向量化路径。', tags: ['必记'] },
      { name: '前端与原文缺陷', note: '页面侧：「在 chat.html 中增加针对 markdown 的支持，这块不展开了，我也是靠 AI 写的。提交的代码修改如下：」——之后无任何内容，代码修改清单在原文中缺失。另有一张效果截图与一张「内容提示词修改」截图（截图内容未转成文字，但格式要求三条已有代码块）。故前端具体用了哪个 markdown 渲染库、如何处理图片懒加载/防盗链等细节无法核实。' }
    ]
  }

});