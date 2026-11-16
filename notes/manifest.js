/* 精读笔记清单 —— 每完成一个批次，在这里追加一个文件名（不带 .js）
 *
 * index.html 会按顺序加载 notes/<名字>.js，把笔记合并进图谱。
 * 结构（标题 / 层级）永远只在 mindmap.js 里改；
 * 笔记文件只负责往已有节点上挂核心点，不要动结构。
 *
 * ============ 笔记文件格式（每个批次一个文件） ============
 *
 * window.GRAPH_NOTES = window.GRAPH_NOTES || {};
 * Object.assign(window.GRAPH_NOTES, {
 *   '<mindmap.js 里的节点 id，文档叶子为脱敏后的顺序 id>': {
 *     note: '一句话主旨 + 最重要的结论',
 *     tags: ['已精读', '<主题标签>'],
 *     kids: [
 *       { name: '核心点短标题', note: '详解', tags: ['必记'] },
 *       { name: '另一个核心点', note: '详解' }
 *     ]
 *   }
 * });
 *
 * ============ 提炼要求 ============
 *
 * 1. 必须真的读原文。逐篇读取原文，不要凭标题猜内容。
 * 2. 提炼核心点，不是复述目录、不是泛泛而谈。保留原文的关键术语、数字、
 *    阈值、配置项、代码要点、结论性判断。
 * 3. kids 给 2~5 个，每个对应原文一个真正独立的要点；内容单薄的文档给 1~2 个
 *    甚至不给。不要为了凑数拆分。
 * 4. 原文里作者明确强调「重点 / 核心 / 必须记住 / 坑」的地方，tags 加 '必记'，
 *    name 末尾加 ' ★'。
 * 5. 有取舍 / 对比 / 权衡的，把两侧都写出来，不要只写结论。
 * 6. 严禁编造原文没有的内容。读不到正文（权限失败 / 空文档 / 纯视频 / 纯目录）
 *    就如实写 note: '原文未能读取：<原因>'，tags 用 ['待补']，不要假装读过。
 * 7. 重复件（tags 含 '重复件'）不用重复读，note 写 '内容与《XXX》一致，见该篇。'
 *    并保留 '重复件' 标签。
 * 8. 全部用中文。代码 / 标识符 / 命令 / 路径 / 配置项保持英文原样。
 */
window.GRAPH_NOTE_FILES = [
  'b-found',
  'b-prompt',
  'b-api',
  'b-springai',
  'b-lc4j',
  'b-fc',
  'b-mcp',
  'rag-a',
  'rag-b',
  'rag-c',
  'rag-d',
  'b-agent',
  'b-workflow',
  'b-context',
  'b-harness',
  'b-skills',
  'as-a',
  'as-b',
  'b-finetune',
  'lc-a',
  'lc-b',
  'b-eval',
  'ke-a',
  'ke-b',
  'ke-c',
  'da-a',
  'da-b',
  'b-reimburse',
  'b-frontier',
  'tv-a',
  'tv-b',
  'tv-c',
  'tv-d',
  'tv-e',
  'tv-f',
  'pj-a',
  'pj-b',
];