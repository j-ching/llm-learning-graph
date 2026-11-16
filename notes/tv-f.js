/* tv-f「18 项目：智能差旅 Agent」第六批精读笔记（mindmap.js 第 940–960 行，16 篇）
 * 覆盖两个分组：g-tv-harness「Harness 工程实战」5 篇 / g-tv-infra「生产化基础设施」11 篇。
 * 来源：课程原文，全部逐篇读取后提炼；
 *   超 6000 字符的 6 篇（SSE 6727 / 集群打断 6915 / MCP 与 Skill 6346 / RAG 7451 /
 *   HIL 结构化 11756 / 脱敏 7538）分段读取，无漏读；HIL 结构化为本批最长。
 *   另用 read_doc_blocks() 对 4 篇做 block 级复核（分层记忆 / 安全护栏 / RAG / HIL 结构化），
 *   确认截断与缺失是原文自身状态，不是本地转换丢的。
 * 读取结果：13 篇读到正文；3 篇为空壳占位（沙箱 / 可观测性 / A2A），正文仅「已同步…无内容」
 *   一句 + 一张 100×100 头像图标（已下载核实非内容截图），其 内部文档平台 原文链接
 *   302 跳登录页无法核实，按规范第 6 条标 ['待补']，不凭标题猜内容。
 * 结构（标题/层级）只在 mindmap.js 里，本文件只往已有节点挂核心点。
 *
 * 本批原文缺陷（已逐篇标注）：
 *   ① 空壳占位 3 篇（沙箱 / 可观测性 / A2A），Harness 三件套缺了两件的落地正文；
 *   ② 嵌入引用卡片摘要截断：分层记忆 4 张卡片全部断在半句（L3 实现类名缺失）、
 *      安全护栏 2 张、MCP 与 Skill 1 张（折叠方案自警缓存失效处断）、脱敏 1 张；
 *   ③ 清单缺失：安全护栏「其余 4 个 Agent 完全没有 Shell 访问权：」后无名单、
 *      RAG「政策查询双通道路由规则…最精彩的一笔：」后无规则正文、
 *      HIL「取 toolUse.getInput() 的逻辑在这里：」「这条记录长这样」后无代码/示例、
 *      本地模拟集群配置步骤第 4 条空 bullet；
 *   ④ 自相矛盾 / 编号可疑：集群打断先后给两版 onMessage（带时间戳解析版与仅 sessionId 版）
 *      未说明关系；执行闭环提示词规则 6「否则进入规则 5」与七步编号对不上；
 *      HIL 说 resume「分四步」正文只标了三步；
 *   ⑤ 代码块空格被吞（publicSseEmitterchat / newConcurrentHashMap<> / exportfunctiongetApiBase），
 *      直接复制无法编译；多篇关键实现只有截图未读取。
 * 凡属我的推断 / 解读 / 跨篇归纳而非原文结论处，均显式标注「我的推断 / 我的解读 / 我的归纳」。
 * 安全：天气 MCP endpoint 内嵌 AppCode token、application.yml 的 api-key 默认值疑似密钥片段、
 *   各篇配图为带签名的 OSS URL，一律不抄进笔记；只保留配置项名与非敏感示例值。
 * 术语与 b-harness / da-b 保持一致：执行闭环、分层记忆、安全护栏、沙箱、可观测性、
 *   安全点 / 快照 / 幂等是工具方的责任（Data Agent 分支）；本项目原文用 TOOL_SUSPENDED /
 *   ask_user / pending tool 等词，照原文保留。
 */
window.GRAPH_NOTES = window.GRAPH_NOTES || {};
Object.assign(window.GRAPH_NOTES, {

  // ==================== g-tv-harness Harness 工程实战 ====================

  // ---------- Harness 工程——行程规划的执行闭环 ----------
  'd0455': {
    note: 'ItineraryPlanAgent 的「必走不可跳过的七步结构化流水线」就是执行闭环的落地：搜候选 → LLM 偏好打分 → plan_itinerary 客观计算 → itinerary_review_agent 五维审核 → 按 fail/warning 判断修复 → 重跑修复（最多 2 轮）→ 最终输出 + 强制停止等待用户确认；由提示词硬约束 + 代码级护栏联合保证。原文 5285 字符。缺陷：提示词规则 6「否则进入规则 5」与七步编号对不上（疑似笔误，原文未改正）；小节标题「Plan Execute Relection」拼写错误；架构配图为带签名 OSS 图未读取。',
    tags: ['已精读', 'Harness', '执行闭环', '行程规划'],
    kids: [
      { name: '为什么必须闭环：400 种组合 + 逐条合规 + 主观打分 ★', note: '原文开场算账：去程与返程组合爆炸（10 去 × 4 酒店 × 10 返 = 400 方案），政策合规必须逐条核验，偏好打分带有强主观性，一次 plan 几乎不可能首轮全 pass；如果 Agent 只是「搜→生成→展示」，低质量甚至违规方案就会直达用户。七步流水线任何一步缺失都可能导致虚构方案、token 爆炸或用户无法感知进度。对应 b-harness 执行闭环定义：实现「规划-执行-观察-反思」完整循环，把复杂任务拆解为可验证的步骤、每一步观察结果引导自我纠正，而不是「一锤子买卖」。', tags: ['必记'] },
      { name: 'Plan-Execute-Reflect：PlanAgent 规划+执行，ReviewAgent 反思 ★', note: 'gogo-agent 把 Plan-and-Execute 与 Reflection 两种架构结合成 Plan-Execute-Reflect，引 OpenSearch ml-commons 的定义三阶段：Planning（规划器 LLM 利用可用工具生成初始分步计划）、Execution（对话代理按顺序执行每步）、Re-evaluation（每步执行后规划器 LLM 用中间结果重新评估计划，可跳过、添加或更改步骤）。落地分工（原文加粗句）：PlanAgent 负责规划和执行，ReviewAgent（后来改成了工具编排）负责反思。注意原文括号里「后来改成了工具编排」与下文仍调 itinerary_review_agent 子智能体并存，原文未解释两者关系。', tags: ['必记'] },
      { name: 'Step 1–3：懒加载搜索、direction 字段、偏好分只认真实记忆 ★', note: 'Step 1 收集 candidates：搜索类 skill（tuniu-cli）必须在本步骤开始时才通过 load_skill_through_path 加载，严禁在最初查审批单/常驻地/偏好/政策那一批调用里提前加载——技能正文加载后若长时间不用会被上下文折叠，等真正搜索时说明已丢失，导致搜错命令或工具名；加载后立即连续执行搜索命令，中途不插 create_plan、update_subtask_state/finish_subtask 等无关调用。去程与返程交通放进同一个 transport_options 列表，每条正确填 direction（outbound/return）与 origin/destination（返程 origin=目的地），方向填反或缺失会导致返程交通无法正确生成；每条交通/酒店唯一 id（T1/H1）。Step 2 参数：origin/destination/departure_date/return_date（YYYY-MM-DD，来自审批单或上下文）、preferences 须来自 retrieve_from_memory、policy 为 query_travel_policy 透传 JSON；三维权重由后端固定，无需也无法传入。Step 3 偏好打分：每条交通、每间酒店打 0–100 分 + 1–3 条中文理由组装 scores JSON，key 与 candidates 的 id 完全一致；偏好分只能依据 retrieve_from_memory 的真实偏好，不得编造；preferences 为空统一中性分、basis 写「无偏好设置，使用中性分」。', tags: ['必记'] },
      { name: 'Step 4 plan_itinerary：客观计算引擎，权重 0.3/0.2/0.5 ★', note: '工具在内存中完成：去×住×返笛卡尔积 → 过滤非法组合（返程早于去程到达）→ 算总价/总耗时并 min-max 归一化 → 按 (去+住+返)/3 合成偏好分 → 按三维权重（时间 0.3 / 价格 0.2 / 偏好 0.5）算综合分 → 选出 4 类代表方案（时间最短 / 价格最低 / 最符合偏好 / 综合最佳）→ 存入 Redis 后返回摘要。LLM 只负责主观偏好分，客观组合与排序交给计算引擎——这是「偏好打分强主观」与「结果必须可验证」之间的分工。调用后读 ok/result_file 确认成功；ok:false 时把 error 原样告知用户并停止。', tags: ['必记'] },
      { name: 'Step 5–7：五维审核 + 最多 2 轮真实重跑，严禁幻觉修复 ★', note: 'Step 5 调 itinerary_review_agent 子智能体，自动读取上一步存入 Redis 的规划结果做五维结构化审核：完整性 / 时间合理性 / 出发目的地核实 / 预算合规性 / 路径合理性；返回每方案 overall_status/issues/suggestions 与整体 summary（fail_count、warning_count、best_proposal_id）。Step 6 判断：summary.fail_count > 0 或 warning_count > 0 进入修复。Step 7 修复方式是按审核建议调整输入后重新调用 plan_itinerary：从 candidates 剔除导致失败的选项（超预算酒店、超政策舱位），重新打分后重复第 2–5 步，最多 2 轮。原文加粗硬约束：严禁跳过工具、直接在文案里虚构「修复版」方案——每一个「修复版」都必须是某次真实 plan_itinerary 重跑并经 itinerary_review_agent 审核后的结果；作者点明这是针对 LLM「幻觉修复」问题的硬性防线。闭环终点是最终输出 + 强制停止等待用户确认。', tags: ['必记'] }
    ]
  },

  // ---------- Harness 工程——分层记忆体系 ----------
  'd0456': {
    note: '按「记忆半径」把记忆拆三层：L1 请求级缓存 AgentSessionContext、L2 会话级短期记忆（AgentMemoryFactory 创建带压缩能力的记忆 + AutoContextMemory 自动压缩 + SessionPersistenceHook 落 MySQL）、L3 用户级长期记忆；全塞一份聊天记录要么 token 爆炸、要么长期偏好被短期噪声淹没。原文仅 1348 字符。缺陷：四节内容全是嵌入引用卡片的摘要且全部断在半句（block 级复核确认：「重复=」「应用侧无需手动管理何时压缩、」「gogo-ag」「它由 AgentScope 框架的 」均不完整），L1 缓存实现与 L3 实现类名缺失，本篇只能读到分层骨架与各层职责定位。',
    tags: ['已精读', 'Harness', '分层记忆', '原文缺陷'],
    kids: [
      { name: '三种记忆半径决定三层拆分 ★', note: '原文三个例子：同一次请求内——查询用户去上海的住宿标准，同一个会话里可能反复用到这个结果，没必要每次都查业务库；同一会话内——先问「帮我规划北京行程」再问「刚才说的酒店太贵了」，模型必须记得前面对话；跨会话长期——用户偏好「always 选国航、靠窗座位、不早于 8 点起飞」，应在每次规划时自动召回。混在一起的后果（原文）：要么 token 爆炸，要么长期偏好被短期噪声淹没。与 b-harness 分层记忆（工作记忆/会话记忆/长期记忆）对应，本项目按请求/会话/用户三个半径落地。', tags: ['必记'] },
      { name: 'L1 请求级缓存：重复代价分三档，越靠后越该缓存', note: 'AgentSessionContext 承担请求级缓存。原文判断：在 ReActAgent「推理→调工具→再推理」循环里重复调用几乎是必然的；重复的代价分三档、越靠后越该缓存：查库（便宜但累积可观）→ 跨网络慢调用（百炼召回、外部 API，几百 ms 起）→ 外部配额（按次计费的第三方接口，重复=……原文在此截断）。缓存的 key 设计、失效时机原文未展开（卡片摘要截断），不做猜测。' },
      { name: 'L2 压缩 + 落盘、L3 跨会话偏好（正文截断处如实标注）', note: 'L2：AgentMemoryFactory 创建带压缩能力的短期记忆；压缩引擎是 AgentScope 的 AutoContextMemory——在 LLM 推理前自动检测 token 膨胀、按六级策略递进压缩、且保留原文可召回，应用侧无需手动管理何时压缩（后文截断）；SessionPersistenceHook 把短期记忆落盘到 MySQL。嵌入卡片的关键提醒：初学者最容易把「聊天记录持久化」理解成「往一张 message 表里插数据」，但 Agent 系统里「会话」同时对应两种完全不同的东西，两者的消费者、数据格式、生命周期、一致性要求都不一样（两种东西的清单在原文中截断缺失）。L3：长期记忆让 Agent 跨会话记住「你是谁、你喜欢什么」——说过一次「我出差只坐高铁一等座、不订红眼航班」，下个月规划自动带上；原文说它由 AgentScope 框架的某个组件提供，类名在截断处缺失，不猜。' }
    ]
  },

  // ---------- Harness 工程——命令执行的安全护栏 ----------
  'd0457': {
    note: '保留 Shell 能力的前提下画安全边界：ShellCommandTool 可执行文件白名单（仅 2 个 Agent 持有 Shell、白名单严格不同）+ UnixCommandValidator 两道检查（首 token 白名单 + 引号外链式字符拦截）+ 拒绝消息回喂 LLM 引导改用白名单工具。原文 2972 字符。缺陷：「其余 4 个 Agent 完全没有 Shell 访问权：」后的名单缺失（block 级复核无列表块）；「Hook 秘钥注入」「用户级隔离」两节只有截断的引用卡片摘要；第一份白名单所属 Agent 本篇未点名（跨篇对照《外部能力集成 — MCP 与 Skill》的 buildPlanningSkillBox 代码应为 ItineraryPlanAgent，属跨篇互证）。',
    tags: ['已精读', 'Harness', '安全护栏', 'Shell白名单'],
    kids: [
      { name: '为什么不能一禁了之：业务只有 CLI 没有 SDK ★', note: '原文把两侧都写了：给 Agent 配 Shell 是双刃剑——一方面第三方服务（搜机票、订酒店、查火车票）只有 CLI 接口没有原生 SDK（tuniu-cli / rgh-cli / flight-cli 都是命令行工具），另一方面 LLM 不可控、可能生成任何命令（原文举例 rm -rf /、带数据外传的 curl、pip install malware-package）。传统方案「完全禁止 Shell」与业务冲突，于是问题变成：如何在保留 Shell 能力的同时，把 LLM 能做的事限定在一个安全边界内。', tags: ['必记'] },
      { name: '两份白名单：规划宽、预订窄，其余 4 个 Agent 无 Shell ★', note: '第一份（14 个）：Set.of("curl","npm","tuniu","rgh","nohup","sleep","cat","grep","node","date","env","which","bash","ls")；第二份 BookingAgent（8 个）：Set.of("tuniu","env","bash","cat","grep","date","which","ls")。对比（原文）：BookingAgent 没有 curl（不需要直接请求外部 API）、没有 rgh（不操作酒店 CLI）、没有 npm/node/nohup/sleep（不需要运行 Node.js 脚本或后台进程）。构造参数：baseDir 传 null、由 SkillBox 在 enable() 时覆盖为工作目录；approvalCallback 传 null、无用户审批回调。其余 4 个 Agent 完全没有 Shell 访问权（名单原文缺失）。与《外部能力集成》篇互证：宽白名单即 ItineraryPlanAgent 的 buildPlanningSkillBox，最小权限贯穿到 shell 命令粒度。', tags: ['必记'] },
      { name: 'UnixCommandValidator 四步验证 + 拒绝即反馈 ★', note: 'validate() 关键逻辑：① 从命令字符串提取第一个 token 作为可执行文件名（去引号、去 .sh/.py/.rb 后缀）② 白名单为空/null → 允许所有（向后兼容，gogo-agent 不使用此模式）③ 检查可执行文件名是否在 allowedCommands 集合中 ④ 不在 → ValidationResult.rejected("Command not in allowed list")。被拒绝后 executeShellCommand() 返回 returncode: -1、stdout 空、stderr 为 SecurityError: Command \'python\' is not allowed. Allowed commands: [tuniu, env, bash, ...]。设计点：LLM 会看到这个错误消息——告知该命令被禁止、引导它使用白名单内的工具；拒绝不是静默失败，而是回喂模型的纠正信号（对应 Harness「错误即信号」）。', tags: ['必记'] },
      { name: '链式命令拦截：白名单只验第一个 token ★', note: '威胁模型（原文）：tuniu search; rm -rf / 的第一个 token 是 tuniu（白名单内），但分号后的 rm -rf / 会被 shell 执行。第二道检查专门应对：扫描命令字符串，检测引号外的 &、|、;、换行字符，一旦发现立即拒绝，报 SecurityError: Multiple commands detected (contains \'&\' or \'|\' or \';\' or newline outside quotes)。原文四个反例全拒：分号链接 curl 外传、管道接 nc evil.com 4444、& 后台链接 rm -rf /、换行注入。白名单 + 多命令检测两道合起来才阻断组合攻击。', tags: ['必记'] },
      { name: '两节截断的延伸：Hook 秘钥注入与 OAuth PKCE 用户级隔离', note: '「Hook 秘钥注入」节只留引用卡片《如何实现API KEY的动态管理与加密、脱敏》的开头（作者注明与脱敏篇有重合但侧重点不同，建议结合看），注入实现本篇无正文。「用户级隔离——多租户安全」节卡片摘要：集成了 rolling go 的工具、CLI 命令 rgh（源码 npmjs.com/package/@rollinggo/hotel），rgh 实现了一个非常标准的 OAuth 2.0 + PKCE 登……（截断）。多租户隔离的完整机制需读被引用的两篇原文，本批范围外。' }
    ]
  },

  // ---------- Harness 工程——沙箱（空壳占位） ----------
  'd0458': {
    note: '原文未能读取：原文为空壳，正文仅「项目实战3（gogo-agent）Harness工程——沙箱已同步…无内容」占位句与一张 100×100 头像图标（已下载核实，非内容截图）；原文链接 内部文档平台 302 跳登录页无法核实。沙箱隔离边界的落地实现本批缺失，待补。',
    tags: ['待补', 'Harness', '沙箱']
  },

  // ---------- Harness 工程——可观测性（空壳占位） ----------
  'd0459': {
    note: '原文未能读取：原文为空壳，正文仅「项目实战3（gogo-agent）Harness工程——可观测性已同步…无内容」占位句与一张 100×100 头像图标（已下载核实，非内容截图）；原文链接 内部文档平台 302 跳登录页无法核实。可观测性采集什么的落地实现本批缺失，待补（理论侧见 b-harness：决策/工具调用/消耗全留痕）。',
    tags: ['待补', 'Harness', '可观测性']
  },

  // ==================== g-tv-infra 生产化基础设施 ====================

  // ---------- 为什么要关闭模型的深度思考？ ----------
  'd0460': {
    note: '默认关 thinking：ReAct 已把思考拆成多轮显式调用，再开 thinking 是「思考中套思考」；只给需要「不可分解的复合推理」的 Agent 开（行程规划、预订两个），并加两道限制——thinkingBudget=2048 与 PlanAwareThinkingHook 阶段感知切换（规划前思考、规划后不思考、总结再思考），15 轮任务省 60~70% thinking tokens 而推理质量不降。原文 4066 字符，正文完整、代码齐全。',
    tags: ['已精读', '生产化', '深度思考', '成本'],
    kids: [
      { name: '思考中套思考的三笔账：延迟、成本、收益递减 ★', note: '原文推理：ReAct 的 Reason→Act→Observe 循环本质已把思考拆成多轮显式 LLM 调用，每轮看完整 history 再决定下一步，框架替模型做了「分步思考」的调度；同时开 thinking mode 等于每轮内部再嵌套一层隐式 CoT。三笔账：① 延迟叠加——一个垂直 agent 完成请求通常 3-8 轮 tool call，thinking 每轮额外 2-10 秒（取决于 thinking budget），总延迟可能从 10 秒膨胀到 40-60 秒，对交互体验致命；② 成本倍增——thinking tokens 虽然通常半价计费但量大，每轮多 1000-3000 tokens，8 轮就是上万额外 tokens；③ 收益递减——ReAct 每轮决策是「看当前状态→选一个 tool→填参数」的浅单步决策，thinking 擅长的深度多步推理用不上。', tags: ['必记'] },
      { name: '开关判据：这一轮是否需要「不可分解的复合推理」 ★', note: '原文加粗判据：这一轮调用中，模型是否需要做「不可分解的复合推理」。该开的三种：Planning 阶段（独立 planner 节点一次性生成完整多步计划，要分析约束、处理冲突、排列步骤）、复杂结果解读（工具返回一大段非结构化数据如合同文本/报错日志，单轮内「观察→深度理解→决策」）、最终回答生成（综合所有观察结果，只发生一次、延迟可接受）。该关的三种：纯路由/分发（意图识别、选 tool、填参数是浅层决策，thinking 纯粹浪费）、简单工具链（schema 清晰、参数映射直接）、高频循环（loop 里反复调同一 API 翻页，每轮开 thinking 是灾难）。', tags: ['必记'] },
      { name: 'gogo 做法：同模型双 Bean，只给规划与预订开思考 ★', note: '百炼上的 qwen3.7-max 等模型支持 enableThinking、默认开启（开启时正式输出前先生成一段不返回给用户的内部推理链 thinking tokens）。ModelConfig.java 把同一个模型分两个 Bean 注册、唯一区别是 thinking 开关：@Bean("strongModel") .enableThinking(false) 与 @Bean("strongModelWithThinking") .enableThinking(true)。原文加粗取舍：只有针对「需要在多个候选里做权衡」或「多步有状态编排、错一步不可逆」的 Agent 才开思考，比如行程规划和预定两个智能体（原文「形成规划」为笔误）；路由型、检索型、CRUD 型全部关掉。', tags: ['必记'] },
      { name: 'thinkingBudget=2048：截断与开销之间的取值 ★', note: 'thinkingBudget 是百炼支持的参数，含义「你最多想 2048 个 token 就必须开始输出」，避免模型陷入冗长自我论证循环；BaseSubAgent.getEnableThinkingGenerateOptions(Integer thinkingBudget) 里 GenerateOptions.builder().cacheControl(true).thinkingBudget(thinkingBudget).build()。原文三档对比：太小（如 512）模型还没想清楚就被截断、反而产出更差结果；太大（如 8192）每轮多 8K token 的延迟和费用、对一个 Agent 任务不划算；2048 token 大约等于 1000~1500 汉字，够把一个中等复杂决策的推理链走完，同时把单轮额外开销控制在约 0.024 元以内。', tags: ['必记'] },
      { name: 'PlanAwareThinkingHook：规划前思考、规划后不思考 ★', note: '即使开了思考的 ItineraryPlanAgent 也不是每轮都烧 thinking tokens。Hook 实现阶段感知动态切换：handleReasoning(PreReasoningEvent) 里 isPlanning() = planNotebook.getCurrentPlan() == null（没有 plan = 还在规划）——Planning 阶段保持思考（从零设计方案最需要深度推理）；Execute 阶段 disableThinking：event.setGenerateOptions(GenerateOptions.builder().cacheControl(true).additionalBodyParam("enable_thinking", false).build())，cacheControl(true) 是为了保住百炼隐式缓存；PreSummaryEvent 时 enableThinking 重新开启（带 thinkingBudget），让模型综合全部结果做一次深度整理。效果（原文）：一个 15 轮的规划任务里只有开头 2~3 轮（制定计划）和最后 1 轮（总结）在思考，中间 10+ 轮工具执行全部关闭，省了 60~70% 的 thinking tokens 而推理质量不降——执行阶段只是按既定计划照做，不需要全局推理。', tags: ['必记'] }
    ]
  },

  // ---------- 为什么不用 AgentScope-Java 中的 SequentialPipeline ----------
  'd0461': {
    note: 'AgentScope-Java 的 Pipeline 两个实现都是固定拓扑：SequentialPipeline 串行一进一出、FanoutPipeline 并行一进多出；没有条件分支、没有循环、没有重试、没有中间态注入，Sequential 连 stream() 都没有，承载不了 gogo-agent AgentPipelineService 的编排逻辑。原文 1697 字符。缺陷：以一句结论收尾，未展开 AgentPipelineService 的具体编排需求与替代实现长什么样。',
    tags: ['已精读', '生产化', '编排', 'AgentScope'],
    kids: [
      { name: 'Pipeline 契约与两个实现的语义', note: '接口 Pipeline<T>：Mono<T> execute(Msg input)、Mono<T> execute(Msg input, Class<?> structuredOutputClass)、default execute()/execute(Class)、default getDescription() 返回类简名。SequentialPipeline implements Pipeline<Msg>：构造器收 List<AgentBase>，串行链式 Input → Agent1 → Agent2 → ... → AgentN → Output，上一个的输出 Msg 直接作为下一个的输入（注意单个 Msg）。FanoutPipeline implements Pipeline<List<Msg>>：构造器 (List<AgentBase> agents, boolean enableConcurrent, Scheduler scheduler)，同一个输入广播给 N 个 agent、聚合成 List<Msg>（一进多出）。' },
      { name: '不用的理由：固定拓扑「四没有」+ 无 stream ★', note: '原文加粗判断：这两个实现是固定拓扑的——没有条件分支、没有循环、没有重试、没有中间态注入，SequentialPipeline 连 stream() 都没有；而「我们的 AgentPipelineService 里面的编排逻辑显然不适合」。我的推断（原文未逐条列需求）：本项目编排需要按意图分支、审核-修复循环、HITL 挂起这类中间态注入以及流式输出，固定拓扑的两种 Pipeline 都表达不了，故自研 AgentPipelineService；替代实现细节本篇未给，需结合 SSE 篇与执行闭环篇看。', tags: ['必记'] }
    ]
  },

  // ---------- 引入 A2A 实现跨域 Agent 通信（空壳占位） ----------
  'd0462': {
    note: '原文未能读取：原文为空壳，正文仅「项目实战3（gogo-agent）引入A2A实现跨域Agent通信已同步…无内容」占位句与一张 100×100 头像图标（已下载核实，非内容截图）；原文链接 内部文档平台 302 跳登录页无法核实。A2A 跨域通信的落地实现本批缺失，待补。',
    tags: ['待补', '生产化', 'A2A']
  },

  // ---------- 实时通信 — SSE 流式推送架构 ----------
  'd0463': {
    note: 'SSE 单向推送契合 Agent「请求→流式回复」模型：前端 fetch + ReadableStream 手动解析 event/data 进 Zustand；后端瘦 ChatController 三端点 + SseEmitterRegistry（sessionId→Emitter、30 分钟超时、三回调自动清理）+ 两层事件（ProgressNotifierHook 四类过程事件、ChatSseNotifier 六类结果事件）；集群三件套：Redis Pub/Sub 中断广播、Caffeine 本地 ask_user 缓存、共享 Session 存 pending tool 元数据，SSE 连接本身刻意保持节点本地。原文 6727 字符分两段读完。缺陷：代码块空格被吞（publicSseEmitterchat、newConcurrentHashMap<>）；前端实现只在架构图里、无代码；SSE_EMITTER_TIMEOUT_MILLIS 常量值未直接给出（注释说 30 分钟）。',
    tags: ['已精读', '生产化', 'SSE', '流式推送'],
    kids: [
      { name: '为什么选 SSE 而不是 WebSocket ★', note: 'SSE 是 HTML5 规范定义的服务器向客户端单向推送协议，基于标准 HTTP 长连接、在一个持久响应中持续发文本流、无需客户端反复轮询；与 WebSocket 双向通信不同，天然适合「服务器→客户端」单向场景。协议细节：Content-Type 为 text/event-stream，纯文本，每条消息由若干字段组成、以空行分隔（event: message / data: {...}）；关键规则：一个事件可以有多行 data: 字段、客户端需用换行拼接，空行标志一个事件的结束边界。选型核心原因（原文加粗）：AI Agent 的响应本质上是「请求→流式回复」的单向推送模型，SSE 在 HTTP 层面即可实现，无需引入额外的协议升级和连接管理复杂度。', tags: ['必记'] },
      { name: '后端：瘦 Controller + Emitter 注册表 + continuation 判断 ★', note: 'ChatController 只做 HTTP 解析与参数校验（@SaCheckLogin、StpUtil.getLoginIdAsString 取 userId），编排全委托 ChatAgentExecutor。三端点：POST /api/chat/{sessionId} → SseEmitter；POST /api/chat/respond → SseEmitter（HITL 恢复）；POST /api/chat/{sessionId}/interrupt → JSON（中断）。chat 流程四步：① chatHistoryService.saveUserMessage 先持久化用户消息 ② agentExecutor.interruptPrevious(sessionId) 优雅中断残留的同一 session 执行流（本地 + 集群广播）③ createEmitter()（30 分钟超时，统一超时配置常量）④ 判断 continuation：activeAgentSessionStore.getActiveAgent(sessionId) 非空且 isContinuation(message) 时复用上一轮 Agent（agentRegistry.getAgent），否则走 MasterAgent 全新协调。SseEmitterRegistry 用 ConcurrentHashMap 维护 sessionId→SseEmitter，register 时绑定 onCompletion/onTimeout/onError 三个回调、emitters.remove(sessionId, emitter) 双参匹配自动清理，供 ProgressNotifierHook 执行中实时取 emitter 推进度。', tags: ['必记'] },
      { name: '两层事件分类：过程播报 vs 结果通知', note: 'ProgressNotifierHook（Hook 链）推四类过程事件：progress（agent_start/done、tool_call/done）、thinking（推理增量/分析结果）、plan_update（任务列表变化）、travel_data（机票/酒店搜索结果）。ChatSseNotifier 推六类：message（最终回复文本）、message_id（持久化消息 ID）、error（异常信息）、interrupted（中断通知）、user_interaction（HITL 用户交互）、suggestions（推荐问题）。前端链路：ChatWindow → sendChatMessageSSE() → fetch() + ReadableStream → SSE 协议手动解析（event/data 逐行解码）→ handleEvent/onEvent → chatStore（Zustand：messages、timeline、thinking、planTasks、travelData...）→ UI 渲染。' },
      { name: '集群支持：广播 + 两级状态，SSE 刻意节点本地 ★', note: '架构图「集群支持」三行：AgentInterruptBroadcast ─ Redis Pub/Sub → 跨节点中断协调；AgentSessionManager ─ Caffeine 本地缓存 → ask_user 恢复；PendingToolSessionStore ─ ASJ Session (MySQL/Redis) → 跨节点。即连接不共享、状态共享：emitter 只活在发起 chat 请求的节点，跨节点恢复靠共享存储里的元数据与记忆重建实例。我的归纳（与《集群架构下的 Agent 打断与恢复》分工一致）：这与 Data Agent 分支把 replay 缓存搬进 Redis Stream 的路线不同——gogo 选择 SSE 与执行同节点、不做跨节点流重放，打断靠广播、HITL 恢复靠重建，代价是节点故障时正在输出的流接不回来（原文未讨论该失败场景，属我的推断）。', tags: ['必记'] }
    ]
  },

  // ---------- 集群架构下的 Agent 打断与恢复 ----------
  'd0464': {
    note: '集群打断的分工结论：运行时协调用 Redis Pub/Sub 广播、持久状态用 MySQL 共享、SSE 流刻意保持节点本地与执行同节点；打断 = 本地优先广播兜底 + 广播时间戳防误杀新执行流 + 优雅中断后手动记忆补偿（优雅中断跳过 PostCallEvent）。原文 6915 字符分两段读完。缺陷：先后给出两版 onMessage（sessionId|timestamp 解析版与仅 sessionId 版）未说明关系（我的推断：后者为简化示意或旧版）；恢复侧本篇未展开（见《Human-in-the-Loop 在集群模式下的支持》）；Pub/Sub 广播丢失的兜底未讨论。',
    tags: ['已精读', '生产化', '集群', '中断恢复', 'Redis'],
    kids: [
      { name: '两个难题与三样分工 ★', note: '单机时代打断和恢复都简单：一个内存变量标记「停」、一个内存对象存「待恢复状态」。上集群后两个难题：① 打断请求和运行中的 Agent 可能不在同一节点——用户点停止经负载均衡打到节点 B，Agent 正跑在节点 A，B 内存里根本没有这个实例；② 恢复请求可能落到任意节点甚至重启之后——HITL 挂起状态原在节点 A 内存，/respond 可能落到节点 C，期间滚动重启 A 的内存也没了。gogo-agent 的答案（原文加粗级分工）：运行时协调用 Redis Pub/Sub 广播，持久状态用 MySQL 共享，SSE 流则刻意保持节点本地、与执行同节点。', tags: ['必记'] },
      { name: 'interrupt：本地优先、广播兜底、四步幂等清理 ★', note: '入口 POST /api/chat/{sessionId}/interrupt → ChatAgentExecutor.interrupt：① 先试本地 interruptBroadcast.interruptLocalSession(sessionId)，Agent 在本节点就直接优雅中断；② 本地没命中 → interruptBroadcast.broadcastInterrupt(sessionId) 广播出去并返回 true。interruptLocalSession(sessionId, broadcastTime) 四步（注释明确所有操作幂等、状态不存在自动跳过）：executionRegistry.interruptLocal（带时序校验）→ agentSessionManager.remove（清本地 Caffeine 的 ask_user suspended 状态）→ pendingToolSessionStore.clear（清共享 Session 的 pending tool 状态）→ 仅当本地确实中断了运行中 Agent 时才经 emitterRegistry 取 emitter 发 sendInterrupted 通知前端「已停止生成」——否则 Redis Pub/Sub 回环可能在新请求注册新 emitter 后误发停止通知。', tags: ['必记'] },
      { name: 'AgentExecutionRegistry：Set<Agent> + 注册时间防误杀 ★', note: '每节点独立维护的本地注册表 Map<sessionId, Set<Agent>>——用 Set 是因为 MasterAgent 会通过 SubAgentTool 嵌套调子智能体，同一 session 同时可能有多个 Agent 在跑。interruptLocal 先查 registerTimeMap：若 registerTime > broadcastTime 则跳过并记日志「Agent 注册时间晚于广播时间，跳过中断（新执行流）」；否则 localAgents.remove(sessionId)、registerTimeMap.remove，逐个 agent.interrupt() 优雅中断，单个失败只记 error 不影响其余。一致性含义（我的解读）：时间戳比较把「广播发出后才启动的新执行」排除在中断范围外，是异步广播回环场景下保护新请求的关键不变式。', tags: ['必记'] },
      { name: '广播协议 sessionId|timestamp 与回环问题 ★', note: 'AgentInterruptBroadcast 在 @PostConstruct 里 listenerContainer.addMessageListener 订阅统一频道（日志为 agent:interrupt）；broadcastInterrupt 发 payload = sessionId + 分隔符 + System.currentTimeMillis()。onMessage 用 lastIndexOf 分隔符解析：有分隔符且时间戳可解析 → 带时序过滤；NumberFormatException 或无分隔符（兼容旧格式、整个 body 视为 sessionId）→ broadcastTime = Long.MAX_VALUE 表示不做时序过滤；sessionId 为空直接返回。持有该 Agent 的节点收到后执行自己的 interruptLocalSession 命中并真正中断，其他节点 interruptLocal 返回 false 什么也不做。信息缺口（我的疑问）：Redis Pub/Sub 不保证送达，原文未讨论持有节点恰好错过广播时的兜底与用户体验（对比 Data Agent 分支《Skills 管理》广播有 3 分钟定时兜底），需核实代码。', tags: ['必记'] },
      { name: '记忆补偿：优雅中断跳过 PostCallEvent，必须手动落 memory ★', note: '坑（原文注释）：AgentScope 优雅中断路径会跳过 PostCallEvent，SessionPersistenceHook 无法自动保存；所以 interruptLocal 里紧跟 persistInterruptedMemory(agent, sessionId)：sessionKey = sessionId + ":" + agent.getName()，resolveMemory(agent) 只有 ReActAgent 有 memory、无状态识别器跳过（memory == null 直接 return），memory.saveTo(agentSession, sessionKey) 立即把当前 memory 写入 MySQL Session，避免子智能体被打断后记忆丢失、被打断那一轮的用户输入丢失。收尾：框架优雅中断返回的是一条英文恢复消息，AgentPipelineService.isInterruptRecovery 会识别它（或 GenerateReason.INTERRUPTED），短路整个 pipeline，返回中文「已停止生成。请告诉我接下来有什么可以帮您的？」。', tags: ['必记'] }
    ]
  },

  // ---------- Human-in-the-Loop 在集群模式下的支持 ----------
  'd0465': {
    note: '集群 HITL = 暂停时双写（本地 Caffeine 存 Agent 实例 + 共享 Session 只存轻量元数据）+ 恢复时两级查找（同节点复用实例 / 跨节点按名字重建并从共享 Session 加载记忆）；关键澄清：节点 A 上被挂起的 Agent 其实已经返回结束、不是在内存里等，本地缓存只是零开销快路径。前提：对话记录/session/过程数据/api key 均已落 MySQL/Redis，无单机本地内存与磁盘依赖。原文 3115 字符，正文完整。',
    tags: ['已精读', '生产化', '集群', 'HITL', '一致性'],
    kids: [
      { name: '前提与问题：状态已入库，只剩挂起实例在内存 ★', note: '原文先交代项目已支持集群：对话记录和 session 都持久化到数据库，过程数据（比如规划的方案）、用户的 api key 存在 Redis 或 MySQL，没有针对单机的本地内存和磁盘的依赖；但仍有两处要特别注意：HITL 支持与 Agent 打断恢复支持。问题场景：Agent 调 ask_user 向用户提问（如「请选择出发日期」）进入 TOOL_SUSPENDED 暂停状态，暂停的 Agent 实例（含完整对话上下文）活在节点 A 内存里，用户的回复请求却可能落在节点 B。', tags: ['必记'] },
      { name: '暂停时双写：实例留本地、元数据进共享 ★', note: 'ChatAgentExecutor.handleAgentResult 里 result.getGenerateReason() == GenerateReason.TOOL_SUSPENDED 时双写：① 本地缓存 agentSessionManager.register(new AgentSession(sessionId, resumableAgent, toolUse.getId()))——Agent 实例留在本节点内存，同节点恢复零开销；② 共享存储 pendingToolSessionStore.save(sessionId, agentName, toolUse.getId(), "ask_user")——只持久化轻量元数据（agentName / toolUseId / toolName），不存完整上下文。分工含义（我的解读）：完整上下文的共享靠 Session 记忆持久化（见下条 loadIfExists），共享 pending 表只回答「是谁在等、等的是哪一次调用」。', tags: ['必记'] },
      { name: '恢复两级查找 + resuming 标记决定要不要加载记忆 ★', note: 'ChatAgentExecutor.resume：L1 agentSessionManager.getBySessionId(sessionId)（本地 Caffeine）命中 → 直接复用实例；否则 L2 pendingToolSessionStore.get(sessionId) 查共享 Session 有无 pending 工具 → agentRegistry.getAgent(pending.agentName(), ReActAgent.class) 按名字重建实例；跨节点重建的实例内存为空 → 从共享 Session 加载历史 memory 后续跑：agent.call(List.of(toolResultMsg)).contextWrite(SessionReactorContext.of(sessionCtx, !recoveredFromSession))。SessionPersistenceHook.persistReActAgent 在 PreCallEvent 分支：resuming 为真 → 记日志「恢复暂停 Agent，跳过历史记忆加载」；否则 reActAgent.loadIfExists(session, sessionKey) 加载上一轮历史记忆（首次请求 Session 不存在时直接跳过）；非 PreCallEvent 一律 reActAgent.saveTo(session, sessionKey)。我的解读：contextWrite 第二参即 resuming = !recoveredFromSession——同节点复用实例自带记忆故跳过加载，跨节点重建必走 loadIfExists 把记忆装回去，两条路径靠这一个布尔量分流。', tags: ['必记'] },
      { name: '澄清与一致性边界：实例 1 没有在等，它已经结束了 ★', note: '原文专门纠正一个错误理解：Step 1 在实例 1 触发 HITL、Step 2 用户补充信息落到实例 2 恢复后，「实例 1 里面还有一个处于中间状态的 Agent？」——不是，实例 1 中的 Agent 并没有在等，它其实已经返回了、结束了（TOOL_SUSPENDED 是本轮的正常返回）。我的归纳（失败场景，原文未逐条讨论）：节点 A 重启丢掉 Caffeine 只损失同节点零开销快路径，L2 元数据 + Session 记忆仍在、任意节点可重建，故本地缓存丢失不影响正确性；信息缺口：原文未讨论双写不一致（本地 register 成功但共享 save 失败）、Session 记忆落库失败或滞后时恢复会读到什么，也未在本篇写恢复成功后 pending 元数据的清理时机（《集群架构下的 Agent 打断与恢复》的 interruptLocalSession 里有 pendingToolSessionStore.clear，可互证清理存在）。对照 Data Agent 分支：那边快照「恢复成功即删除」，这边 pending 元数据生命周期原文交代不全。', tags: ['必记'] }
    ]
  },

  // ---------- 如何在本地模拟集群服务 ----------
  'd0466': {
    note: '不部署 nginx 在本地验证集群：IDEA 复制三份运行配置、仅 --server.port 不同（8080/8081/8082），共用远程 Redis + MySQL 模拟生产拓扑；前端把硬编码 API_BASE 改成每次请求 getApiBase() 轮询取址（VITE_CLUSTER_URLS + 侧边栏开关），用前端轮询替代 Nginx round-robin。原文 4461 字符。缺陷：配置步骤第 4 条为空 bullet；两张 IDEA 配置截图未读取；代码块空格被吞（exportfunctiongetApiBase）。',
    tags: ['已精读', '生产化', '集群', '本地调试'],
    kids: [
      { name: '为什么可行：唯一冲突是端口，存储天然共享 ★', note: '生产集群一般经 nginx 负载均衡分发请求，本地部署 nginx 太麻烦但仍要验证集群功能。项目天然具备多实例启动条件，唯一冲突点是 server.port：日志 logback-spring.xml 无文件输出（纯控制台），多实例不会争抢日志文件；Redis / MySQL 使用远程共享实例，多节点连同一套存储正好模拟生产拓扑；外部依赖 DashScope、MCP 均为无状态 HTTP/stdio 调用，各实例独立访问。拓扑：前端轮询分发 → Gogo-8080/8081/8082 三个 IDEA 实例（同一套配置仅 server.port 不同）→ 共享 Redis + MySQL（会话/中断广播/持久化）。', tags: ['必记'] },
      { name: '后端：⌘+D 复制配置 + 命令行参数覆盖端口 ★', note: '步骤：顶部运行配置下拉框 → Edit Configurations... → 选中 GogoTravelApplication → 左上角复制（⌘+D）复制两份 → 分别命名 Gogo-8080 / Gogo-8081 / Gogo-8082 并填 Program arguments：--server.port=8080 / 8081 / 8082。原理：Spring Boot 命令行参数优先级高于 application.yml，会覆盖其中的 server.port: 8080，其余配置全部复用，零代码改动。', tags: ['必记'] },
      { name: '前端：求值时机在每次请求，轮询替代 round-robin ★', note: '原来各 API 模块硬编码 API_BASE 常量，改造为每次请求动态取址：VITE_CLUSTER_URLS 逗号分隔解析地址列表，未配置降级为单地址 [VITE_API_BASE || http://localhost:8080]；模块级游标 cursor 跨请求持续递增；getApiBase()：clusterMode（useUiStore.getState()）关或地址数 ≤1 → 固定第一个地址（与改造前体验完全一致），开 → clusterUrls[cursor % len] 并 cursor 前进。关键点（原文加粗）：${getApiBase()} 写在 fetch 模板字符串内，求值时机是每次请求发起时，因此轮询游标每次请求都会前进；SSE 长连接、打断、确认、历史加载等所有接口一视同仁。开关仅在 isClusterAvailable()（配置了多个地址）时渲染，日常单后端开发完全不可见，开启后额外展示地址标签。使用：IDEA 起三实例 → frontend/.env.local 写 VITE_CLUSTER_URLS=http://localhost:8080,http://localhost:8081,http://localhost:8082 → npm run dev → 侧边栏底部「⚡ 集群轮询」开关；验证看 DevTools Network 每个请求的端口与 IDEA Services 三实例控制台日志轮流出现。', tags: ['必记'] }
    ]
  },

  // ---------- 外部能力集成 — MCP 与 Skill ----------
  'd0467': {
    note: '外部能力两条路径的取舍：MCP = 协议化、强类型、框架托管连接（McpClientWrapper，stdio / Streamable HTTP 两种传输，失败返回 null 优雅降级）；Skill = 文档化、灵活、模型自主 shell-out（SkillBox + 受限 ShellCommandTool）。能拿到标准 MCP 服务器且工具集稳定走 MCP，复杂多步骤/依赖成熟 CLI/看着手册干活走 Skill。原文 6346 字符分两段读完。缺陷：天气 MCP endpoint 内嵌 AppCode token、yml 的 api-key 默认值疑似密钥片段，均未抄录；嵌入《Skill正文折叠》卡片正文截断且自警该方案可能使上下文缓存失效。',
    tags: ['已精读', '生产化', 'MCP', 'Skill', '最小权限'],
    kids: [
      { name: '两条路径的取舍判据 ★', note: 'MCP：把外部服务包装成标准协议的「工具服务器」，框架用 McpClientWrapper 直接对话（启动子进程走 stdio 或走 HTTP），工具名字、入参 schema 由 MCP 服务器自己声明、框架自动变成 LLM 可直接调用的原生工具——协议化、强类型、框架托管连接。Skill：把「如何使用某个外部能力」写成 Markdown 操作手册（含参考文档、脚本）放进技能仓库，运行期模型按需加载手册、再通过受限 ShellCommandTool 执行 CLI 或 curl——文档化、灵活、模型自主 shell-out。原文加粗取舍句：能拿到标准 MCP 服务器、且工具集稳定的，走 MCP；需要复杂多步骤操作、依赖成熟 CLI、或想让模型「看着手册干活」的，走 Skill。', tags: ['必记'] },
      { name: '两个 MCP 客户端两种传输 + null 降级 ★', note: 'stdio：oriznVisaMcpClient 接开源 orizn-visa-mcp，McpClientBuilder.create(...).stdioTransport(command, args, env) 拉起 npx -y orizn-visa-mcp 子进程；认证靠环境变量注入 ORIZN_API_KEY（不配走免费模式、只暴露两个工具）；timeout 30s、initializationTimeout 20s；buildAsync().block() 在 Spring 启动阶段完成进程拉起 + 协议握手、Bean 就绪即可用。Streamable HTTP：weather-mcp 走阿里云市场 MCP 网关，streamableHttpTransport(endpoint)，timeout 30s、init 15s；endpoint 里嵌 AppCode token（Base64 段）、认证信息直接编码在 URL 里（敏感，未抄录）。两者失败都返回 null + Agent 侧 @Autowired(required = false) @Nullable 优雅降级——签证退回内部 RAG 知识库；原文称这是本工程 MCP 接入最值得学的一点：绝不让一个外部服务挂掉拖垮整个应用启动（npx 不在 PATH、握手超时都可能发生）。', tags: ['必记'] },
      { name: 'enableTools 白名单：MCP 的安全阀门 ★', note: 'MCP 客户端由具体 Agent 在 build() 里注册到 Toolkit：toolkit.registration().mcpClient(weatherMcpClient).enableTools(weatherMcpEnabledTools).apply()。enableTools 是工具白名单：一个 MCP 服务器可能暴露几十个工具、只放开其中几个——application.yml 的 app.weather-mcp.enabled-tools 列六项（城市天气实况,城市15日预报,城市天气预警,城市空气实况,城市24小时预报,城市40日预报），orizn-mcp.enabled-tools 默认 quick_visa_check,check_visa_requirement；白名单从 BaseSubAgent 的 @Value 字段读入、Spring 自动按逗号切成 List<String>。注册范围：只有 InfoAgent 和 ItineraryPlanAgent 两个 Agent 注册 MCP 客户端，BookingAgent 不注册任何 MCP。', tags: ['必记'] },
      { name: 'SkillBox：一本手册 + 一把受限的 Shell 钥匙 ★', note: '技能仓库 TravelAgentConfig 装配：travel.skill.path 默认 classpath:skills → ClasspathSkillRepository（加载 src/main/resources/skills/），否则 FileSystemSkillRepository；仓库以 skillRepository 字段注入所有 Agent。ItineraryPlanAgent.buildPlanningSkillBox：new SkillBox(toolkit) → registerSkill(skillRepository.getSkill("tuniu-cli")) → ShellCommandTool 14 命令白名单 → skillBox.codeExecution().withShell(shellTool).withRead().withWrite().enable()；BookingAgent 也注册 tuniu-cli 但白名单更窄（tuniu, env, bash, cat, grep, date, which, ls，去掉 curl/npm/node/rgh）。设计信号（原文加粗）：规划阶段要搜航班/酒店/搜网页、命令面宽，下单阶段只跟途牛 CLI 打交道、命令面收窄——最小权限原则贯穿到 shell 命令粒度，这是 Skill 路径的核心安全边界，因为一旦给了 shell 就等于给了执行能力，白名单是唯一的护栏。SkillBox 经 .skillBox(skillBox) 挂到 ReActAgent。与《命令执行的安全护栏》篇的两份白名单完全互证。', tags: ['必记'] },
      { name: '懒加载 + SkillContentCollapseHook 内容折叠 ★', note: '技能手册往往很长（一个 SKILL.md 加若干 references/*.md），全塞上下文是浪费；SkillBox 内置工具 load_skill_through_path 让模型用到时才加载对应参考文档，system prompt 强制纪律（itinerary-plan-agent-system.md：必须在本步骤开始时才加载）。更进一步 SkillContentCollapseHook（priority 6）在 PreReasoningEvent 做内容折叠：当某个 load_skill_through_path 的结果已经是 6 条消息以前的旧内容时，就在这一轮的 LLM 输入里把冗长 SKILL.md 正文替换成一句占位提示（告诉模型怎么重新加载）；只改当轮输入、不动 memory，是无状态的——既省 token 又保证需要时能重新拉回全文。嵌入卡片自警（正文在此截断）：这个方案在多轮对话场景下可能会在某种程度上导致上下文缓存失效，需要结合业务场景综合来看。与执行闭环篇「技能加载后长时间不用会被折叠」是同一机制的两面。', tags: ['必记'] }
    ]
  },

  // ---------- 接入 RAG 知识库，让 Agent 拥有领域知识 ----------
  'd0468': {
    note: 'InfoAgent 的领域知识 = 三个 Knowledge Bean、两种 VDB 策略：景点库 BailianKnowledge 托管索引（控制台离线灌库），政策/指南库 SimpleKnowledge + InMemoryStore + text-embedding-v4（启动时 Word 摄取、fail-fast）；RAGMode.AGENTIC 把知识库包装成工具交给模型按需检索；同一套 RAG 抽象复用到三层意图识别的 L2 向量路由（Top-1 相似度 ≥0.75 直接判定）。原文 7451 字符分两段读完。缺陷：「政策查询双通道的路由规则…最精彩的一笔：」之后规则正文缺失（block 级复核两段之间无块）；百炼 accessKeyId/Secret 原文只给变量名、无明文。',
    tags: ['已精读', '生产化', 'RAG', '意图路由'],
    kids: [
      { name: '模型装不下的三类东西与 RAG 分工 ★', note: '① 私域知识：公司差旅报销制度、住宿超标规则、差旅行为准则，从来没进过任何预训练语料；② 长尾/时效知识：小众景点开放时间、某国最新签证政策，模型要么不知道要么记的是两年前旧版本；③ 可追溯的事实：企业场景问「差旅制度对超标住宿怎么规定」必须给出有出处、可复核的答案，不能让模型自由发挥。硬塞 system prompt 既撑爆上下文窗口又无法按问题动态取用；RAG 思路：领域文档切片、向量化、存向量库，提问时先语义检索取回最相关几段作为参考资料再喂模型。分工句（原文加粗）：模型负责语言组织和推理，知识库负责事实供给，二者解耦。真正吃到红利的是 InfoAgent（景点、差旅政策、注意事项、行为准则查询）。', tags: ['必记'] },
      { name: '两种 VDB 取舍：托管 vs 内存，fail-fast 不静默 ★', note: '景点库 attractionKnowledge：BailianKnowledge 托管型，切片/embedding/存储/检索全在百炼云端，工程侧只持有一个 indexId（zcupxosihd），灌库在百炼控制台离线做（对应资源目录 tourist_attraction.xlsx），代码里没有 addDocuments——托管型知识库的写入不走应用代码。政策库/指南库：SimpleKnowledge + InMemoryStore + DashScopeTextEmbedding(text-embedding-v4)，WordReader.read(ReaderInput.fromPath(...)) 解析 business_travel_policy.docx / business_travel_guidelines.docx 切片成 List<Document>，knowledge.addDocuments(docs).block()。三个工程细节：摄取三步走（Reader 解析切片 → addDocuments 做 embedding 写库，分块策略由 AgentScope Reader 内部完成）；.block() 刻意阻塞保证 Bean 返回时知识库已灌好、否则第一个请求检索到空库；fail-fast——语料缺失直接抛 IllegalStateException 让应用起不来而不是静默降级，知识库是 InfoAgent 的立身之本。取舍句（原文）：数据量大、独立于发版生命周期 → 托管；数据量小、随代码走、要求零外部依赖 → 内存；Knowledge 抽象让上层 Agent 根本不关心底层是云端还是内存。', tags: ['必记'] },
      { name: 'AGENTIC vs GENERIC：检索决定权交给模型 ★', note: 'RAGMode.GENERIC（自动注入）：框架用 Hook 拦截每一轮推理、取最后一条 user 消息当 query、无条件先检索把结果拼进上下文再让模型回答；好处简单，坏处是用户随口问句「谢谢」也会触发一次向量检索、浪费 token 和延迟。RAGMode.AGENTIC（按需检索）：框架把每个 Knowledge 包装成一个可调用的 @Tool 检索工具交给模型，模型在 ReAct 循环里自己决定要不要检索、检索哪个库、用什么 query。InfoAgent 装配：@Scope("prototype")、model(stableModel)、三个 .knowledge() 链式挂载支持 fan-out 多库并行检索、.ragMode(RAGMode.AGENTIC)、.maxIters(MAX_ITERATIONS) 即 5、sysPrompt 加载 info-agent-system.md；选 AGENTIC 是因为同时挂三个库外加天气/签证 MCP 工具，让模型自主路由「该查哪个库还是该调哪个工具」远比无脑全量检索精准；system prompt 专写一段「RAG 说明」教模型什么时候该检索。', tags: ['必记'] },
      { name: '双通道哲学与防幻觉红线 ★', note: '设计哲学（原文加粗）：RAG 擅长「语义模糊、答案在非结构化文档里」的问题；确定性工具擅长「精确、结构化、需与身份/实时状态绑定」的问题。两者冲突时（比如「我的差旅标准」既像政策问题又要精确数字）prompt 明确规定以工具结果为准。并反复叮嘱模型：召回内容是参考，不要复述为权威标准；召回为空就说「暂未收录」，绝不编造——作者称这是企业级 RAG 防幻觉的红线。缺陷标注：原文说 system prompt 还定义了「政策查询双通道」的路由规则、是「本工程 RAG 设计里最精彩的一笔」，但闪存版在冒号后直接接哲学段，规则正文缺失（block 级复核确认），不补猜。', tags: ['必记'] },
      { name: '同一套 RAG 抽象复用到意图路由 L2 ★', note: 'io.agentscope.core.rag.* 不只服务领域知识，还复用在三层意图识别的 L2 层（向量相似度路由）：IntentRouterKnowledgeConfig 用同样的 SimpleKnowledge + InMemoryStore（dimensions(1024)）+ text-embedding-v4，灌进去的不是政策文档而是 15 类意图的代表问句（buildSeedDocuments）。运行期 IntentVectorMatcher.match() 拿用户问句做 Top-1 检索：RetrieveConfig.builder().limit(1).scoreThreshold(0.0).build()（先不过滤、自己拿原始 score 判阈值），score >= 0.75 命中、从 payload 取出 intent 分类，省掉一次完整的 LLM 推理。作者结论：一个知识库抽象、两种用途，说明 RAG 的本质是「语义检索」，凡是能转化成「找最相似的那条」的问题都能套用同一套基础设施；顺带演示 RetrieveConfig：limit 控制 Top-K、scoreThreshold 控制相似度过滤门槛。', tags: ['必记'] }
    ]
  },

  // ---------- Human-in-the-Loop — Agent 与用户的结构化交互 ----------
  'd0469': {
    note: 'HITL = 把「问用户」塞进工具契约：ask_user 方法体必定抛 ToolSuspendException，框架标记 TOOL_SUSPENDED、pending 状态落盘、SSE 推卡片；用户回复经 /respond 以那次调用的 ToolResultBlock（MsgRole.TOOL）进入对话，toolUseId 与 memory 里悬空的 ToolUseBlock 精确配对、从暂停点续跑。提问权收归 MasterAgent 一处。原文 11756 字符分两段读完，本批最长。缺陷：说 resume「分四步」正文只标了三步（第四步我的理解是 agent.call 续跑）；「取 toolUse.getInput() 的逻辑在这里：」「这条记录长这样」后无代码/记录示例（疑似截图缺失）；「UserInterationTools」「新的 bea」笔误。',
    tags: ['已精读', '生产化', 'HITL', '工具契约'],
    kids: [
      { name: 'HITL 本质与两条硬约束 ★', note: 'ReAct 契约：模型发 ToolUseBlock（调 X、参数、编号 toolUseId），框架执行完塞回 ToolResultBlock（同编号的结果），循环继续。HITL 把「问用户」也塞进契约——问用户就是一次工具调用，只不过执行者是人；工人举手停机、等人递零件、编号一对上原地继续，前面想过的东西一点没丢。两条最难的约束：① 停机不能是线程阻塞——用户可能三十秒回、三十分钟不回甚至永远不回，用 CountDownLatch 挂住 Tomcat 线程几十个并发就把线程池吃干净，所以必须是「响应式流正常结束 + 状态外置」：本轮 HTTP 请求干干净净结束，等待这件事由外部存储记着；② 递零件的请求未必落在同一进程——集群下提问在 A 节点、/respond 可能打到 B，B 必须能从共享存储知道「是谁在等、等的是哪一次调用」，再把 Agent 重新造出来、历史记忆装回去、续跑。', tags: ['必记'] },
      { name: '正文提问三宗罪（且它是子智能体默认做法） ★', note: '朴素路径确实存在且是默认：itinerary-manage-agent-system.md 规则 4「信息不完整时直接在回复中向用户提问，每次只追问最关键的一到两个问题」。三个问题：① 用户要打字且打得对不对全凭运气——差旅大量提问是封闭的（日期、几城选一、是/否），手打慢且易给解析不了的答案（「下下周吧，具体哪天你看着办」）；② 上下文整轮丢弃再重建——「上海」两个字要重走问题改写、意图识别、主智能体路由，主智能体还得从历史推断这是在回答出发城市，费 token 又易推错，尤其「确认」这种脱离上下文零信息量的词；③ 最关键：主智能体没法表达「我在等一个具体答案」——前端不知道该渲染输入框还是单选框、该不该锁输入框防岔开话题。HITL 的解法：把提问变成带结构（问题 + 控件类型 + 选项）、有编号、可被精确回填的工具调用；用户看到可点的卡片，系统拿到能对上 toolUseId 的答案，Agent 从暂停点继续而不是从头再来。', tags: ['必记'] },
      { name: 'ask_user：必抛异常的工具与六参渲染契约 ★', note: 'UserInteractionTools.TOOL_NAME = "ask_user"；方法体只有两行且必定抛异常：throw new ToolSuspendException(question != null ? question : "Waiting for user input")。ToolSuspendException 是 AgentScope 为「由外部执行的工具」提供的标准信号；框架接住后把这次调用转成 pending 状态的 ToolResultBlock、本轮 Msg 带 GenerateReason.TOOL_SUSPENDED。六个 @ToolParam：question、ui_type（text/select/multi_select/confirm/form/date/number，默认 text）、options（select/multi_select 的字符串数组）、fields（form 的字段定义：name/label/type(text/number/date/select/textarea)/placeholder/required/options/min/max/step）、default_value、allow_other（加「Other」自由输入项）。ui_type 不是后端枚举而是给前端看的渲染指令。参数在方法体里没被用到但起作用的四步：LLM 看到并传递 → 框架在调 Java 方法前把参数存进 ToolUseBlock.input 再反序列化传入 → 抛异常后 ReActAgent 把带 input 的 ToolUseBlock 一起返回 → toolUse.getInput() 取出推给前端渲染。', tags: ['必记'] },
      { name: '提问权收归 Master + 提示词三条约束 ★', note: '装配：只有主智能体 toolkit.registration().tool(new UserInteractionTools()).apply()；ItineraryPlanAgent / BookingAgent / InfoAgent / ItineraryManageAgent 全都没有注册——不是遗漏是刻意分工：主智能体是「用户与系统交互的唯一总入口」（master-agent-system.md:38），子智能体想问就在回复正文里问，由主智能体决定要不要升级成卡片。提示词约束：① 前提约束——规则仅适用于自身直接处理 greeting/unknown 意图、或子智能体返回后需要用户确认时，绝不适用于路由阶段（意图识别结果中的 overall_reason/required_info/reason 不构成触发 ask_user 的理由，必须先路由到子智能体）；缺必要信息/歧义/需选择时必须调 ask_user 而不是自行假设或反复推理；② 情况一：子智能体返回完整方案/最终结果（即使末尾附带确认问题）→ 直接透传、禁止 ask_user；③ 情况二：子智能体缺必要信息无法生成方案 → ask_user 且把子智能体原始提问完整放入 question（禁止改写或概括），单一是/否→confirm、选择类→select 并提取 options、其他→text；用户回复后再次调用同一个子智能体、把回复完整传达让它继续处理。', tags: ['必记'] },
      { name: '/respond 续跑：回答是工具返回值，不是新消息 ★', note: 'ChatRespondRequest{sessionId, toolUseId, response:Object}——response 用 Object 因为控件形状不同：text/date/confirm 是字符串（确认卡片回字面量 yes / no，UserInteractionCard.tsx:178-183）、number 是数字、multi_select 是字符串数组、form 是对象。resume 步骤：① 解析实例——本地 AgentSession 命中复用（recoveredFromSession=false），否则 pendingToolSessionStore.get：null → 报「会话已过期或不存在，请重新开始对话」，agentRegistry.getAgent(pending.agentName(), ReActAgent.class) 为 null → 报「无法恢复会话：未知的 Agent 类型」，重建则 recoveredFromSession=true；② 用户回复落库——非字符串统一 JSON.toJSONString 存一条用户消息，保证刷新后历史里能看到「我当时选了什么」（失败仅 warn）；③ 构造 ToolResultBlock(toolUseId, "ask_user", List.of(TextBlock(responseText))) 包进 Msg role=MsgRole.TOOL、name="user"——用户的回答不是新用户消息而是那次 ask_user 调用的返回值，toolUseId 与 memory 里悬空的 ToolUseBlock 精确配对，模型看到的是「我刚才调了 ask_user，它返回了『上海』」；原文加粗：它省掉的不是一次网络往返，而是一次重新理解上下文的推理；随后 agent.call(List.of(toolResultMsg)).contextWrite(SessionReactorContext.of(sessionCtx, !recoveredFromSession))。配套：Controller 在 finally 里 AgentSessionContextHolder.clear()（Tomcat 线程复用防残留上下文被后续请求继承）；所有 ReActAgent（Master + 四个子）挂框架自带 PendingToolRecoveryHook——用户输入不含 ToolResultBlock 却存在孤儿 pending 调用时补一个错误结果免得上下文残缺，不会误伤 /respond（该路径带合法 ToolResultBlock）；handleAgentResult 推卡片时还需 ProgressNotifierHook 对 HITL 情况做排除避免重复推送。', tags: ['必记'] }
    ]
  },

  // ---------- 隐私保护——全链路敏感信息脱敏 ----------
  'd0470': {
    note: '全链路脱敏 = 一个 SensitiveMasker（基于开源 houbb/sensitive）+ 三个入口：logback 转换词 %sensitive 覆盖全工程日志、ProgressNotifierHook「七入口一出口」sendRawEvent 先序列化后脱敏、ChatAgentExecutor 最终答案先脱敏再落库与下发；一致性只覆盖一半——AI 回复落库是脱敏版，用户消息完全不脱敏入库。原文 7538 字符分两段读完。缺陷：正文引用「第 2.5 节和第六节」展示漏斗被绕开的缺口但闪存版无对应章节；用户消息不脱敏的代码之后戛然而止、无后续讨论；脱敏示例图与嵌入 API KEY 卡片未读取/截断。',
    tags: ['已精读', '生产化', '脱敏', '隐私'],
    kids: [
      { name: 'SensitiveMasker：顺序有讲究 ★', note: '借助开源脱敏框架 houbb/sensitive（github.com/houbb/sensitive）实现统一脱敏工具类 SensitiveMasker，手机号、身份证号、apikey 等都包含。mask(text)：null/空原样返回；顺序（原文注释点明）：先 ID_CARD 再 BANK_CARD——避免 18 位身份证被银行卡规则重复处理——再 PHONE、EMAIL、SK_KEY（MASK_ALL_STRATEGY 全掩）、最后 maskKvSecrets 处理 KV 形式秘钥。ApiKey 的加密与脱敏前文已讲过（嵌入卡片《如何实现API KEY的动态管理与加密、脱敏》，作者注明有重合但侧重点不同），本篇补其余敏感信息。', tags: ['必记'] },
      { name: '入口一 日志：%msg → %sensitive 一个字符的改动 ★', note: 'SensitiveMaskingConverter extends MessageConverter（logback），convert(ILoggingEvent) 返回 SensitiveMasker.mask(super.convert(event))。挂载：logback-spring.xml 用 conversionRule 注册自定义转换词 conversionWord="sensitive"、converterClass 指向该类，pattern 里用 %sensitive 替换默认 %msg（注释：统一日志脱敏，手机号/身份证/银行卡/邮箱/地址走 houbb 内置 + 秘钥走自定义扩展）。效果：一个字符的改动让全工程所有 logger.xxx() 调用自动过脱敏，业务代码一行都不用改——作者称这是「横切关注点」最标准的落地方式。', tags: ['必记'] },
      { name: '入口二 SSE：漏斗形状，先序列化后脱敏 ★', note: 'ProgressNotifierHook 推 progress/thinking/plan_update/travel_data 四类事件、七个业务发送方法，但物理上的 emitter.send 只有一处 sendRawEvent：String masked = SensitiveMasker.mask(JSON.toJSONString(data)); emitter.send(SseEmitter.event().name(eventName).data(masked))。脱敏发生在 JSON.toJSONString 之后——对整个 JSON 文本做文本级脱敏；隐含前提（原文点破并写进注释）：脱敏结果必须仍是合法 JSON，掩码字符只有 *、不引入引号/反斜杠/花括号，前提天然成立。writeMaskedEvent 统一出口吞掉常见断连异常：IllegalStateException（emitter 已完成/客户端断开/超时）与 IOException 都降为 debug。plan_update 注释「计划/任务名理论上不含敏感字段，但仍走统一脱敏出口，防御性覆盖」；travel_data 卡片可能有联系人电话、证件号。设计精华（原文）：七个入口、一个出口、一行 mask，新增第八个事件类型只要复用 writeMaskedEvent 就自动获得脱敏、不需要知道脱敏存在；唯一脆弱点：有人绕开 writeMaskedEvent 自己写 emitter.send 防线就有缺口——原文说第 2.5 节和第六节会看到缺口真实存在，但闪存版缺这两节。', tags: ['必记'] },
      { name: '入口三 最终答案：先脱敏再落库，一致性只覆盖一半 ★', note: 'ChatAgentExecutor：String text = SensitiveMasker.mask(result.getTextContent()) 之后同时用于 saveAssistantMessage 落库与 sseNotifier.sendMessage 下发，messageId 在正文之后发（前端回填到刚渲染的消息上）。关键细节（原文加粗）：text 先脱敏、再同时用于落库和下发——chat_message 表里 AI 说的话存的就是脱敏版本，刷新页面拉历史前后一致，不会「刚才看到 138****000、刷新后变成完整号码」。但一致性只覆盖一半：用户自己说的话完全不脱敏入库——ChatController 直接 saveUserMessage(sessionId, userId, message) 原文，ChatHistoryService.saveUserMessage 还原样 content 建 ChatMessage，并且 updateTitleFromFirstUserMessage 用原文首条用户消息更新会话标题（我的推断：会话标题因此可能带敏感信息，原文未讨论）。原文在这段代码后结束，对这半缺口的后果与补救没有展开。', tags: ['必记'] }
    ]
  }
});