/* 大模型学习执行图谱 —— 数据源（公开脱敏版）
 *
 * 节点字段：
 *   id       唯一标识（文档叶子为脱敏后的顺序编号 d0001…d0549），用于折叠记忆与搜索定位
 *   name     节点标题（导图上显示的文字）
 *   note     核心点详解，点节点后在右侧面板展示
 *   doc      true 表示这是一个课程文档叶子，用于统计篇数
 *   tags     分类标签数组
 *   children 子节点数组
 *
 * 目录来源：549 篇大模型应用开发课程文档，按 23 个主题分支组织。
 * 本文件只存结构：标题与层级。精读笔记在 notes/ 下按分支分文件，
 * 由 notes/manifest.js 登记、index.html 加载后按节点 id 合并（note / tags / kids）。
 *
 * 脱敏说明：原始原文出处链接与原始文档 id 已全部移除，不可反推。
 */
window.GRAPH_DATA = {
  "title": "大模型学习执行图谱",
  "updated": "2026-11-15",
  "root": {
    "id": "root",
    "name": "大模型学习",
    "note": "累积式知识图谱。\n\n已挂载 549 篇大模型应用开发课程文档目录，按 23 个主题分支组织。\n\n精读进度看顶部统计行。已精读的文档挂分层核心点（★ 为必记），未精读的只挂标题——不假装读过。原文本身有缺陷（纯代码 / 纯截图 / 空文档）的会如实标注，要点只从可读部分提炼。\n\n结构在 mindmap.js，精读笔记在 notes/ 下按分支分文件，由 notes/manifest.js 登记后合并。\n\n点节点看详解，点 ± 折叠展开，按 / 搜索。\n\n公开版说明：为保护原始文档地址，本版已移除全部原文出处链接，文档节点 id 换成脱敏后的顺序编号，不可反推原文位置。",
    "tags": [
      "总根"
    ],
    "children": [
      {
        "id": "b-found",
        "name": "00 开篇与基础认知",
        "note": "课程起点（目录 535–549）。先建立「大模型是什么、能做什么、局限在哪」的认知，再看 Java 技术栈的落地位置。",
        "children": [
          {
            "id": "g-found-industry",
            "name": "行业与岗位",
            "children": [
              {
                "id": "d0001",
                "name": "行业趋势与岗位需求分析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-found-llm",
            "name": "大模型基础",
            "children": [
              {
                "id": "d0002",
                "name": "什么是大模型？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0003",
                "name": "大模型的工作原理？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0004",
                "name": "大模型的局限性以及常见解决方案",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0005",
                "name": "LLM HelloWorld",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-found-platform",
            "name": "平台与部署",
            "children": [
              {
                "id": "d0006",
                "name": "Java 在大模型应用开发中的优势",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0007",
                "name": "大模型应用开发常用的平台",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0008",
                "name": "百炼介绍与基本使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0009",
                "name": "基于 Ollama 部署本地模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-found-meta",
            "name": "课程元信息",
            "note": "544 / 546 是同一篇的两个副本，看其一即可。",
            "children": [
              {
                "id": "d0010",
                "name": "更新记录",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0011",
                "name": "常用的 Agent 开发框架",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0012",
                "name": "常用的 Agent 开发框架（重复件）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-prompt",
        "name": "01 Prompt 工程",
        "note": "与模型对话的接口层。设计 → 优化 → 结构化 → 评测是一条闭环，别只停在「写提示词」。差旅项目里另有 10 篇提示词工程实战，见 18 分支。",
        "children": [
          {
            "id": "d0013",
            "name": "什么是 Prompt?",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0014",
            "name": "如何设计 Prompt？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0015",
            "name": "高阶 Prompt 优化方法",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0016",
            "name": "结构化 Prompt 框架",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0017",
            "name": "Prompt 评测方法",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0018",
            "name": "nof1 提示词工程案例",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      },
      {
        "id": "b-api",
        "name": "02 大模型调用与流式输出",
        "note": "527 / 547 是同一篇的两个副本。SSE 是后面所有流式 Agent 的传输底座。",
        "children": [
          {
            "id": "d0019",
            "name": "理解 OpenAI API",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0020",
            "name": "Java 中大模型调用的多种方式",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0021",
            "name": "Java 中大模型调用的多种方式（重复件）",
            "tags": [
              "未精读",
              "重复件"
            ],
            "doc": true
          },
          {
            "id": "d0022",
            "name": "基于 SSE 实现大模型流式输出",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      },
      {
        "id": "b-springai",
        "name": "03 Spring AI",
        "note": "Java 侧主力框架。这份特性清单就是后续 Agent / RAG / MCP 各章的能力底座。",
        "children": [
          {
            "id": "g-springai-start",
            "name": "接入与核心概念",
            "children": [
              {
                "id": "d0023",
                "name": "接入 Spring AI 与 Spring AI Alibaba",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0024",
                "name": "开发必备的 Spring AI 核心概念",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0025",
                "name": "Spring AI 2.0.0 更新了啥？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-springai-feature",
            "name": "核心特性",
            "children": [
              {
                "id": "d0026",
                "name": "Spring AI 核心特性：提示词工程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0027",
                "name": "Spring AI 核心特性：流式输出",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0028",
                "name": "Spring AI 核心特性：提示词模板管理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0029",
                "name": "Spring AI 核心特性：结构化输出",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0030",
                "name": "Spring AI 核心特性：对话记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0031",
                "name": "Spring AI 核心特性：Advisor",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0032",
                "name": "Spring AI 核心特性：调用本地模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-springai-memory",
            "name": "记忆管理",
            "children": [
              {
                "id": "d0033",
                "name": "Spring AI 记忆管理技术：持久化记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-lc4j",
        "name": "04 LangChain4J",
        "note": "与 Spring AI 并列的另一条 Java 路线。know-engine 项目用的就是 LangChain4J。",
        "children": [
          {
            "id": "g-lc4j-api",
            "name": "API 分层",
            "children": [
              {
                "id": "d0034",
                "name": "初识 LangChain4j",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0035",
                "name": "LangChain4J 低层次 API 使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0036",
                "name": "LangChain4J 高层次 API 使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0037",
                "name": "@AIService 实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0038",
                "name": "LangChain4J 中实现持久化记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc4j-compare",
            "name": "框架选型对比",
            "note": "原标题在目录中被截断，完整标题见原文链接。",
            "children": [
              {
                "id": "d0039",
                "name": "LLM 应用开发框架：LangChain",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0040",
                "name": "Spring AI & Spring AI Alibaba & Langcha…",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-fc",
        "name": "05 Function Call 与工具",
        "note": "Agent 的手脚。工具定义质量直接决定 Agent 能不能把事办对——差旅项目里反复踩的坑都在这。",
        "children": [
          {
            "id": "d0041",
            "name": "什么是 Function Call?",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0042",
            "name": "如何定义一个好的 Function（Tool）？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0043",
            "name": "使用 Spring AI 做 Function Call",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0044",
            "name": "Spring AI 中的 Tool Calling 怎么实现的",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0045",
            "name": "实战：仿 PDD 自动帮买家申请退款",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      },
      {
        "id": "b-mcp",
        "name": "06 MCP 协议",
        "note": "16 篇，从协议原理一路到认证、重连、工具过滤的生产化细节。",
        "children": [
          {
            "id": "g-mcp-theory",
            "name": "原理",
            "children": [
              {
                "id": "d0046",
                "name": "什么是 MCP？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0047",
                "name": "深入理解 MCP 技术原理（上）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0048",
                "name": "深入理解 MCP 技术原理（中）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0049",
                "name": "深入理解 MCP 技术原理（下）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0050",
                "name": "MCP 与其他协议的区别",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-mcp-dev",
            "name": "开发与接入",
            "children": [
              {
                "id": "d0051",
                "name": "如何接入 MCP Server？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0052",
                "name": "实战：使用 Spring AI 开发 MCP Server",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0053",
                "name": "实战：使用 Spring AI 开发 MCP Client",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0054",
                "name": "Spring AI MCP 调用实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-mcp-prod",
            "name": "生产化改造",
            "children": [
              {
                "id": "d0055",
                "name": "SSE MCP Server 如何实现重连？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0056",
                "name": "将 MCP 改造为 HTTPS",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0057",
                "name": "MCP 如何实现认证鉴权",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0058",
                "name": "神奇的 context-path",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0059",
                "name": "MCP 调试工具",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0060",
                "name": "如何跳过 MCP 的模型总结",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0061",
                "name": "如何实现 MCP 工具过滤",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "rag",
        "name": "07 RAG 检索增强生成",
        "note": "全图谱最大分支之一（65 篇）。前两章已精读并保留逐层核心点；其余按「总览 → 索引展开 → 优化 → 模块化 → 评测 → 评测驱动优化」组织。\n\n主线判断：索引质量是天花板（GIGO），评测是可信度的唯一来源。",
        "children": [
          {
            "id": "d0062",
            "name": "01 什么是 RAG",
            "note": "本章回答三个问题：\n① 为什么需要 RAG（大模型缺什么）\n② RAG 是什么（检索 + 生成）\n③ 怎么跑起来（离线建索引 + 在线检索生成）\n\n全章最该记住的一句：垃圾进，垃圾出。\n\n目录中 549 与 486 是同一篇的两个副本，本节点已合并两者，核心点基于 549 正文精读。",
            "tags": [
              "概念",
              "入门",
              "已精读"
            ],
            "children": [
              {
                "id": "rag-01-why",
                "name": "为什么需要 RAG",
                "note": "逻辑链（本章的推理起点）：\n\n大模型 = 训练语料 + 概率统计 + 用户 prompt → 预测下一个 token 的出现概率。\n\n关键推论：模型输出的是「语言上最合理」的文本，未必是「事实上正确」的文本。\n\n这两件事的落差，就是幻觉的根源。RAG 的全部价值都建立在补上这个落差。",
                "tags": [
                  "原理",
                  "逻辑链"
                ],
                "children": [
                  {
                    "id": "rag-01-why-hallucination",
                    "name": "局限① 幻觉",
                    "note": "模型会一本正经地编造不存在的事实。\n\n根因：它优化的是「下一个 token 的概率」，不是「事实真值」。语言流畅 ≠ 内容正确。\n\nRAG 的解法：给出可依据的原文，让回答有据可查，而不是靠参数记忆瞎猜。",
                    "tags": [
                      "幻觉"
                    ]
                  },
                  {
                    "id": "rag-01-why-stale",
                    "name": "局限② 知识滞后",
                    "note": "训练数据有时间窗口，模型不知道训练之后发生的事。\n\n重训代价极高，不可能天天更新权重。\n\nRAG 的解法：知识库随时可更新，模型不用动。这是 RAG 相对微调最大的成本优势。",
                    "tags": [
                      "时效性"
                    ]
                  },
                  {
                    "id": "rag-01-why-scope",
                    "name": "局限③ 知识局限",
                    "note": "企业私有资料、行业内部文档根本不在公开训练语料里，模型压根没见过。\n\nRAG 的解法：把私有知识建成索引注入上下文，实现「领域专精」。\n\n注意：这一条是微调也能解决的，但 RAG 更便宜、可溯源、易更新。",
                    "tags": [
                      "私有知识"
                    ]
                  }
                ]
              },
              {
                "id": "rag-01-def",
                "name": "RAG 是什么",
                "note": "RAG = Retrieval-Augmented Generation，检索增强生成。\n\n定义：让大模型在生成回答前，先从外部知识库检索相关信息，再结合检索到的内容生成答案。\n\n目标：解决幻觉、提升专业领域回答的准确性。",
                "tags": [
                  "定义"
                ],
                "children": [
                  {
                    "id": "rag-01-def-core",
                    "name": "核心 = 检索 + 生成",
                    "note": "两个动作，缺一不可：\n\n· 检索 —— 从外部知识库找出与问题最相关的材料\n· 生成 —— 把材料塞进上下文，让模型基于材料作答\n\n执行视角的关键区别：RAG 不改模型权重，是「知识外挂」而非「重新训练」。所以它便宜、可溯源、可随时更新知识库。",
                    "tags": [
                      "核心",
                      "外挂"
                    ]
                  },
                  {
                    "id": "rag-01-def-ability",
                    "name": "换来两种新能力",
                    "note": "① 知识更新 —— 突破训练数据的时间窗口\n② 领域专精 —— 突破公开语料的覆盖范围\n\n这两条正好一对一治「知识滞后」和「知识局限」，而「有据可依」治幻觉。三大局限全部覆盖。",
                    "tags": [
                      "能力"
                    ]
                  }
                ]
              },
              {
                "id": "rag-01-scene",
                "name": "三类使用场景",
                "note": "选型判据：凡是同时需要「事实性 + 专业性 + 时效性」知识支撑的场景，都适合 RAG。\n\n反过来，纯创意写作、通用闲聊这类不依赖外部事实的任务，RAG 收益很低。",
                "tags": [
                  "选型"
                ],
                "children": [
                  {
                    "id": "rag-01-scene-qa",
                    "name": "企业知识问答 / 智能客服",
                    "note": "痛点：企业知识私有、不对外公布，训练集里没有。\n\n做法：把产品说明书、员工行为规范、业绩报告等建成知识库，客服智能体答题时实时检索内部知识。\n\n价值：回答基于事实而非编造，且能随文档更新自动跟进。",
                    "tags": [
                      "落地",
                      "私有库"
                    ]
                  },
                  {
                    "id": "rag-01-scene-security",
                    "name": "安全分析与情报检索",
                    "note": "知识源：威胁情报、漏洞数据、安全日志。\n\n三类典型任务：\n· APT 攻击链分析\n· 威胁情报分析\n· CVE 安全漏洞解读\n\n价值：安全分析师用自然语言就能检索、分析、生成报告，大幅提升威胁处置效率。\n\n（这一条与你自建的安全数据分析平台方向直接相关，可作为「告警研判」楔子的技术底座。）",
                    "tags": [
                      "落地",
                      "安全"
                    ]
                  },
                  {
                    "id": "rag-01-scene-pro",
                    "name": "法律 / 医疗 / 金融",
                    "note": "行业共性：知识更新快、术语多、错误代价高。\n\n传统模型受训练时间窗口和覆盖范围限制，无法反映最新法规、指南、政策。\n\n做法：把新知识持续灌进知识库，当作「知识外挂」，实现持续更新 + 高质量领域问答。",
                    "tags": [
                      "落地",
                      "高代价"
                    ]
                  }
                ]
              },
              {
                "id": "rag-01-flow",
                "name": "两步流程",
                "note": "分界线是「用户提问的时机」：\n\n· 提问前 → 离线构建索引（一次性 / 周期性）\n· 提问时 → 在线检索生成（每次请求实时）\n\n工程含义：这两步的优化目标完全不同。索引侧追求数据质量与覆盖率，检索侧追求召回精度与延迟。别混在一起调。",
                "tags": [
                  "流程",
                  "架构"
                ],
                "children": [
                  {
                    "id": "rag-01-flow-index",
                    "name": "① 构建索引（离线）",
                    "note": "在用户提问前完成，是后续检索生成的基础。\n\n索引质量直接决定检索效果的天花板 —— 这是全章最重要的一句工程判断。",
                    "tags": [
                      "离线"
                    ],
                    "children": [
                      {
                        "id": "rag-01-flow-index-steps",
                        "name": "四个环节",
                        "note": "文档预处理 → 文档分片 → 向量化 → 生成索引\n\n· 预处理：清洗格式、去噪、统一编码\n· 分片（chunk）：切成可检索的文本块，粒度影响召回\n· 向量化：用 embedding 模型把 chunk 转成向量\n· 生成索引：写入向量库，供在线检索\n\n执行要点：分片粒度是最容易被低估的调参点 —— 太大则噪声多、太小则语义断裂。\n\n→ 四个环节已在 02 章《索引构建》逐一展开，点该章节点看细节。",
                        "tags": [
                          "pipeline",
                          "chunk"
                        ]
                      },
                      {
                        "id": "rag-01-flow-index-gigo",
                        "name": "GIGO 原则 ★",
                        "note": "Garbage In, Garbage Out —— 垃圾进，垃圾出。\n\n原文称这是「非常经典、非常核心的警示性原则」。\n\n含义：无论后续检索环节做了多高深的优化和方案，数据源头的质量才是影响最终检索效果的最重要因素。\n\n执行推论：索引质量是天花板，检索算法只能逼近它、不能突破它。所以先治数据，再调算法；顺序反了就是白干。",
                        "tags": [
                          "核心原则",
                          "天花板",
                          "必记"
                        ]
                      }
                    ]
                  },
                  {
                    "id": "rag-01-flow-retrieve",
                    "name": "② 检索生成（在线）",
                    "note": "用户提问时实时处理：\n\n从知识库匹配出与问题最相似的文本块（chunk）→ 注入大模型上下文 → 作为知识参考生成回答。\n\n注意「最相似」是向量相似度，不是关键词匹配 —— 这也是为什么向量化质量决定召回质量。",
                    "tags": [
                      "在线"
                    ],
                    "children": [
                      {
                        "id": "rag-01-flow-retrieve-inject",
                        "name": "chunk 注入上下文",
                        "note": "检索到的 chunk 不是直接返回给用户，而是拼进 prompt 作为参考材料。\n\n由此产生两个后续章节必然要处理的问题：\n① 上下文窗口有限 → 检索结果要排序、截断、去重\n② 材料可能不相关 → 需要 rerank 与相关性过滤\n\n（本章只点到流程，这两点是后续优化章节的伏笔。目录 484《检索生成》即第 3 章，已精读：Top-K 截断 + 混合检索补精确匹配 + cross-encoder 精筛选，正是这两个伏笔的落点。）",
                        "tags": [
                          "上下文",
                          "伏笔"
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            "doc": true
          },
          {
            "id": "d0063",
            "name": "02 索引构建",
            "note": "起点是文档，终点是索引。\n\n四个环节串行：预处理 → 分片 → 向量化 → 生成索引。\n\n关键工程判断：这是一条误差向下游传递且不可逆的流水线。分片切坏了，后面再好的 embedding 模型也救不回来 —— 这正是 01 章 GIGO 原则的具体展开。\n\n目录中 548 与 485 是同一篇的两个副本，本节点已合并两者，核心点基于 548 正文精读。",
            "tags": [
              "原理",
              "离线",
              "pipeline",
              "已精读"
            ],
            "children": [
              {
                "id": "rag-02-preprocess",
                "name": "① 文档预处理",
                "note": "把原始文档加载、解析，转换成能统一处理的标准化格式。\n\n定位：GIGO 的第一道防线。这一步偷懒，后面三个环节全部替你还债。",
                "tags": [
                  "清洗"
                ],
                "children": [
                  {
                    "id": "rag-02-preprocess-steps",
                    "name": "三个动作",
                    "note": "① 加载解析 —— 按文档类型加载，统一转成 document 格式\n② 去噪 —— 删多余空格、换行符、无意义特殊符号、重复内容\n③ 规范化 —— 统一编码格式、统一大小写\n\n执行要点：PDF 表格、扫描件 OCR 残留、HTML 导航栏这类「结构性噪声」最容易被漏掉，而它们恰恰最污染向量。",
                    "tags": [
                      "加载",
                      "去噪",
                      "规范化"
                    ]
                  },
                  {
                    "id": "rag-02-preprocess-goal",
                    "name": "目标：干净数据",
                    "note": "让后续「分片」和「向量化」在干净数据上进行，从源头保证索引质量。\n\n注意因果方向：不是「预处理做得好 → 检索一定好」，而是「预处理做不好 → 检索一定差」。它是必要条件，不是充分条件。",
                    "tags": [
                      "GIGO",
                      "源头"
                    ]
                  }
                ]
              },
              {
                "id": "rag-02-chunk",
                "name": "② 文档分片",
                "note": "把大文档按规则切成较小的文本片段（chunk）。\n\n检索时返回的是与问题最相关的 chunk，而不是整篇文档 —— 这是 RAG 精准度的物理基础。",
                "tags": [
                  "chunk"
                ],
                "children": [
                  {
                    "id": "rag-02-chunk-why",
                    "name": "为什么必须分片",
                    "note": "两个硬约束：\n① LLM 有 token / 上下文上限，几十上百 M 的整篇文档塞不进去，也太费 token\n② 文档越大无关信息越多，回答越不精准\n\n所以分片不是优化项，是必需项。",
                    "tags": [
                      "token",
                      "上下文"
                    ]
                  },
                  {
                    "id": "rag-02-chunk-methods",
                    "name": "五种分片方式",
                    "note": "· 固定大小分片 —— 按字符/token 数硬切，最简单\n· 递归分片 —— 按特殊符号（段落、句号）分层切\n· 文档分片 —— 按文档天然结构（标题、章节）切\n· 语义分片 —— 按语义边界切，相邻句向量相似度突变处下刀\n· 智能分片 —— 用模型判断语义完整性\n\n选型直觉：结构规整的文档用文档分片，长篇散文用语义分片，日志类用固定大小。没有通用最优解。",
                    "tags": [
                      "策略",
                      "选型"
                    ]
                  },
                  {
                    "id": "rag-02-chunk-tradeoff",
                    "name": "长度两难 ★",
                    "note": "chunk 长度是 RAG 最容易被低估的调参点，本质是「检索精度」与「语义完整性」的权衡。\n\n太长 → 检索得分被稀释 + 上下文被浪费\n太短 → 语义被切断 + 模型误解甚至幻觉\n\n执行推论：不存在通用最优长度，必须按文档类型和查询模式实测。先定基线（如 512 token + 10% overlap），再用检索命中率反向调。\n\n→ 目录 478《什么是父子分片？》给出了这个两难的标准解法（已精读）：不是找一个折中长度，而是把两个目标拆到两种块上分别满足——子块小、语义聚焦，负责检索；父块大、上下文完整，负责生成。父块存关系库，子块存向量库并在 metadata 带 parentChunkId。作者另补两条比两难更硬的理由：embedding 有 token 上限（text-embedding-v4 为 8192），以及 overlap 只对文本有效、救不了表格和图片。代价是 langchain / spring ai / langchain4j 均无原生实现，需自研。",
                    "tags": [
                      "核心权衡",
                      "必记",
                      "调参"
                    ],
                    "children": [
                      {
                        "id": "rag-02-chunk-long",
                        "name": "太长的两个代价",
                        "note": "① 一个 chunk 塞进多个主题，与查询相关的部分被无关内容「淹没」，检索相关性得分被拉低\n② 生成阶段整个 chunk 灌进 LLM，大部分内容无用，挤占有效上下文空间\n\n注意这是双重损失：检索侧和生成侧同时受损。",
                        "tags": [
                          "检索稀释",
                          "上下文挤占"
                        ]
                      },
                      {
                        "id": "rag-02-chunk-short",
                        "name": "太短的两个代价",
                        "note": "① 关键信息被切断 —— 前半句在 chunk A、后半句在 chunk B，单个 chunk 语义不完整\n② LLM 缺乏足够上下文，误解片段含义，甚至产生幻觉\n\n补救手段：chunk 之间留 overlap（重叠窗口），让边界句同时出现在相邻两片里。代价是索引体积和冗余上升。",
                        "tags": [
                          "语义断裂",
                          "overlap"
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "id": "rag-02-embedding",
                "name": "③ 向量化",
                "note": "清洗 + 分片完成后，把每个文本块转成高维数值向量。\n\n目的：让文本语义可以被「机器理解」和「相似度比较」。\n\n这一步把「语义相似」这个模糊概念，变成了可计算的几何距离。",
                "tags": [
                  "embedding"
                ],
                "children": [
                  {
                    "id": "rag-02-embedding-what",
                    "name": "向量是什么",
                    "note": "数学定义：具有大小（magnitude）和方向的多维数值数组，可形象化为带箭头的线段。\n\n· 一维 [3]、二维 [3,4]、三维 [3,4,5] —— 物理坐标\n· 384 / 768 / 1536 维 —— 高维向量，每一维不再是坐标，而是一种「语义特征」\n\n核心性质：语义相似的句子，向量在高维空间中距离更近。\n\n维度越高 → 能表达的语义特征越多 → 自由度更高 → 更细致区分语义。但维度也直接推高存储和计算成本，不是越高越好。",
                    "tags": [
                      "高维",
                      "语义特征"
                    ]
                  },
                  {
                    "id": "rag-02-embedding-how",
                    "name": "Embedding 怎么做",
                    "note": "用一个向量模型把文本「投影」到高维向量空间。\n\n每个维度代表文本在某个语义方向上的权重，例如：\n第 1 维：是否包含「人物」\n第 2 维：是否涉及「动作」\n第 3 维：是否包含「时间」\n……\n\n最终每段文字变成一个高维坐标点，就可以做数学比较了。\n\n（澄清：真实模型的维度不是人工指定的语义标签，而是训练出来的分布式表示，上面的例子只是直觉类比。）",
                    "tags": [
                      "投影",
                      "模型"
                    ]
                  },
                  {
                    "id": "rag-02-embedding-sim",
                    "name": "三种相似度 ★",
                    "note": "向量存下来之后，靠什么判断「相关」？三种度量，各有适用场景。\n\n文本语义检索的默认答案是余弦相似度。",
                    "tags": [
                      "度量",
                      "必记"
                    ],
                    "children": [
                      {
                        "id": "rag-02-embedding-sim-cos",
                        "name": "余弦相似度（默认）",
                        "note": "看两个向量的夹角，不管长度。\n\n取值 [−1, 1]：1 = 完全同向（高度相似），0 = 正交（无语义相关），−1 = 完全反向（语义相反）。\n\n为什么适合文本：向量长度不影响结果，只关心方向。所以一篇很短、一篇很长的文章，只要关键词比例相似，余弦值就很高 —— 长度差异被天然消除。\n\nMilvus / Pinecone / FAISS / Pgvector 都支持并默认使用。\n\n直觉例子（二维演示）：库里有「小明爱吃西瓜」「小明喜欢打篮球」「今天天气真好」，Query 是「小明爱吃什么」。\n· 西瓜 vs 天气：语义无关，余弦 ≈ 0\n· 篮球 vs Query：夹角大，余弦低\n· 西瓜 vs Query：夹角很小，余弦 ≈ 1 → 命中",
                        "tags": [
                          "夹角",
                          "长度无关",
                          "默认"
                        ]
                      },
                      {
                        "id": "rag-02-embedding-sim-euc",
                        "name": "欧几里得距离",
                        "note": "空间中两点的直线距离，距离越小越相似。\n\n适用：具有几何意义的场景，如图像相似度分析。\n\n文本检索里较少用 —— 它同时受方向和模长影响，长文档向量模长天然更大，会引入与语义无关的偏差。",
                        "tags": [
                          "直线距离",
                          "几何"
                        ]
                      },
                      {
                        "id": "rag-02-embedding-sim-dot",
                        "name": "点积",
                        "note": "两个向量在同一方向上的重叠程度，直接算内积。\n\n· 又长又同向 → 值很大\n· 方向相反 → 负数\n· 垂直 → 0\n\n最简单、最高效。Transformer 的注意力机制就是用它算权重。\n\n关键区别：点积同时受方向和模长影响，未归一化时会被向量长度干扰 —— 这正是文本检索默认选余弦而非点积的原因。\n\n（另有皮尔逊相关系数、杰卡德相似系数，文本场景用得少。）",
                        "tags": [
                          "内积",
                          "高效",
                          "注意力"
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "id": "rag-02-index",
                "name": "④ 生成索引",
                "note": "向量化后每个 chunk 都对应一个高维向量，但只存在内存里无法快速查询比较。\n\n这一步把文本内容和向量持久化，用向量数据库构建索引结构，为检索生成提供相似度查询能力。\n\n至此「文档 → 索引」的离线链路走完。",
                "tags": [
                  "持久化"
                ],
                "children": [
                  {
                    "id": "rag-02-index-vdb",
                    "name": "向量数据库",
                    "note": "专门存储、管理、检索高维向量的数据库。\n\n与 MySQL 的本质区别：不是「精确匹配」，而是计算向量相似度做「语义检索」。\n\n常见实现：Milvus、Pinecone、FAISS、Pgvector（PostgreSQL 的向量扩展）。\n\n选型直觉：已有 PG 栈 → Pgvector 零新增运维；纯向量大规模 → Milvus；托管省事 → Pinecone。",
                    "tags": [
                      "语义检索",
                      "选型"
                    ]
                  },
                  {
                    "id": "rag-02-index-schema",
                    "name": "存了哪四类信息 ★",
                    "note": "以 Pgvector 为例，一行记录包含：\n\n· embedding_id —— 主键\n· embedding —— 高维向量，用于相似度匹配查询\n· text —— 原始文本块\n· metadata —— 元数据\n\n最关键的分工（容易混淆）：向量只负责「找得到」，text 才负责「答得对」。检索命中靠 embedding，但注入给大模型引用参考的是原始 text —— 模型只有基于原文才能增强回答，向量本身不能用来生成。\n\nmetadata 是被低估的杠杆：支持文件名过滤、时间戳过滤、分组、溯源。把「语义检索 + 精确过滤」组合起来，是低成本提升检索精准度的手段。",
                    "tags": [
                      "schema",
                      "分工",
                      "必记"
                    ]
                  }
                ]
              }
            ],
            "doc": true
          },
          {
            "id": "g-rag-dup",
            "name": "已精读两章的重复件",
            "note": "目录 486 / 485 与 549 / 548 内容一致。核心点已合并进上面两个「已精读」章节点，这里只保留链接以便追溯，不必重复学习。",
            "children": [
              {
                "id": "d0064",
                "name": "什么是 RAG？（重复件）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              },
              {
                "id": "d0065",
                "name": "深入理解 RAG 技术原理——索引构建（重复件）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-03",
            "name": "03 检索生成",
            "note": "第 1、2 章的下一站，已精读。在线四步链路：用户提问 → 内容召回 → 上下文融合 → 内容生成，全部发生在实时侧。作者强调内容召回是「整个 RAG 系统回答准确性的直接因素」。",
            "children": [
              {
                "id": "d0066",
                "name": "深入理解 RAG 技术原理——检索生成",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-overview",
            "name": "总览与范式演进",
            "note": "「检索增强生成」在目录里有三个副本（469 / 3 / 5），内容一致。",
            "children": [
              {
                "id": "d0067",
                "name": "检索增强生成",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0068",
                "name": "检索增强生成（重复件 2）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              },
              {
                "id": "d0069",
                "name": "检索增强生成（重复件 3）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              },
              {
                "id": "d0070",
                "name": "RAG 的范式演进",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0071",
                "name": "使用 LlamaIndex 构建一个简单的 RAG 系统",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-index",
            "name": "索引构建展开（12 篇）",
            "note": "02 章四个环节的逐一展开。其中「父子分片」正是 chunk 长度两难的标准解法，优先读。",
            "children": [
              {
                "id": "d0072",
                "name": "文档预处理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0073",
                "name": "常见文档分片方式",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0074",
                "name": "文档分片的代码实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0075",
                "name": "什么是父子分片？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0076",
                "name": "（选学）自定义支持父子分片的基于 Markdown 标题的分片器",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0077",
                "name": "（选学）自定义支持父子分片的基于 Word 标题的分片器",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0078",
                "name": "向量模型 & 向量数据库 & 向量存储",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0079",
                "name": "向量数据库如何选型？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0080",
                "name": "如何使用离线向量模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0081",
                "name": "相似度搜索的常见算法",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0082",
                "name": "索引构建流程（ETL）总结与查缺补漏",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0083",
                "name": "Spring AI 和 LangChain4J 中文档处理功能对比",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-opt",
            "name": "优化技术（9 篇）",
            "note": "正好接上 01 章「chunk 注入上下文」埋的两个伏笔：排序截断去重、rerank 与相关性过滤。",
            "children": [
              {
                "id": "d0084",
                "name": "RAG 优化技术：元数据过滤",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0085",
                "name": "RAG 优化技术：问题改写",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0086",
                "name": "RAG 优化技术：查询路由",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0087",
                "name": "RAG 优化技术：查询构造",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0088",
                "name": "RAG 优化技术：问题澄清",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0089",
                "name": "RAG 优化技术：HyDE",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0090",
                "name": "RAG 优化技术：混合检索",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0091",
                "name": "RAG 优化技术：重排序",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0092",
                "name": "RAG 优化技术：Graph RAG",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-modular",
            "name": "模块化 / 多模态 / Agentic（7 篇）",
            "children": [
              {
                "id": "d0093",
                "name": "Spring AI 中的 Modular RAG 支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0094",
                "name": "LangChain4J 中的 Modular RAG 支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0095",
                "name": "基于 LangChain4J 实现简单的 RAG 检索",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0096",
                "name": "Spring AI 和 LangChain4J 的模块化 RAG 功能对比",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0097",
                "name": "多模态 RAG",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0098",
                "name": "实战：多模态 RAG 智能问答系统",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0099",
                "name": "Agentic RAG",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-eval",
            "name": "RAG 评测体系（14 篇）",
            "note": "评测是 RAG 从「能跑」到「可信」的分水岭，也直接对应你安全数据平台「可信」那条主张。",
            "children": [
              {
                "id": "d0100",
                "name": "为什么需要对 RAG 做评测？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0101",
                "name": "RAG 测评之 RAG Triad",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0102",
                "name": "RAG 的核心评测指标有哪些？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0103",
                "name": "LLM-as-a-Judge",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0104",
                "name": "主流 RAG 评测框架：RAGAS、TruLens、DeepEval、Phoeni…",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0105",
                "name": "RAGAS 框架初探 & 实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0106",
                "name": "RAGAS 评测时，如何抑制模型幻觉导致的结果不稳定问题？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0107",
                "name": "RAG 的评测数据集该如何准备？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0108",
                "name": "怎样的评测集算是好的评测集？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0109",
                "name": "基于文档生成用于评测的数据集",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0110",
                "name": "针对问题生成 RAG 系统的回答",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0111",
                "name": "如何获取 know-engine 的评测集",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0112",
                "name": "评测脚本准备 & 开始运行评测",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0113",
                "name": "RAGAS 评测时，如何加速评测速度",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rag-eval-fix",
            "name": "评测驱动的优化（13 篇）",
            "note": "一组完整的 bad case → 定位 → 修复闭环，比单讲理论更有参考价值。",
            "children": [
              {
                "id": "d0114",
                "name": "know-engine 评测问题与优化（bad case）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0115",
                "name": "解决 mineru 不支持多级标题解析的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0116",
                "name": "解决中文分词不准确导致召回效果差的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0117",
                "name": "解决问题重写导致的召回不准问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0118",
                "name": "解决 RRF 融合乱序和结果重复的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0119",
                "name": "解决引用信息补全导致参考资料乱序问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0120",
                "name": "通过 minScore 解决召回准确率低的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0121",
                "name": "通过优化系统提示词，提升答案正确性",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0122",
                "name": "通过修改 ground truth，解决召回率低和答案准确率低的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0123",
                "name": "通过换模型解决忠诚度低的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0124",
                "name": "增加分层拒答能力，减少错误回答发生",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0125",
                "name": "自定义评测指标解决答案相关性的偏差问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0126",
                "name": "RAG 评测总结",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-agent",
        "name": "08 AI Agent 原理与架构",
        "note": "24 篇。架构清单 → 框架实现 → 手搓复现，三段递进。",
        "children": [
          {
            "id": "g-agent-what",
            "name": "什么是 Agent",
            "children": [
              {
                "id": "d0127",
                "name": "什么是 AI Agent？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0128",
                "name": "AI Agent 落地的常见误区",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-agent-react",
            "name": "ReAct 架构",
            "children": [
              {
                "id": "d0129",
                "name": "Agent 常用架构：ReAct Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0130",
                "name": "React Agent 的实现方式？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0131",
                "name": "Alibaba-React Agent 初探",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0132",
                "name": "Alibaba-React Agent 核心组件",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0133",
                "name": "如何给 Agent 增加持久化记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0134",
                "name": "深入理解 Alibaba-React Agent 原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-agent-patterns",
            "name": "其他常用架构",
            "note": "这六种架构在差旅项目里被逐个「为什么用 / 为什么不用」地拷问过，见 18 分支。",
            "children": [
              {
                "id": "d0135",
                "name": "Agent 常用架构：Plan and Execute Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0136",
                "name": "Agent 常用架构：ReWOO & LLMCompiler（选学）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0137",
                "name": "Agent 常用架构：Reflection Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0138",
                "name": "Agent 常用架构：Human in the Loop",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0139",
                "name": "Agent 常用架构：Multi Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0140",
                "name": "Agent 常用架构：AgentTeam",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-agent-multi",
            "name": "多智能体与协议",
            "children": [
              {
                "id": "d0141",
                "name": "使用 AutoGen 构建一个代码生成器",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0142",
                "name": "Spring AI Alibaba 中的多智能体支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0143",
                "name": "多智能体协议——A2A",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-agent-handmade",
            "name": "手搓实战（7 篇）",
            "note": "不用框架、从零实现一遍，是理解 Agent 循环最快的路径。",
            "children": [
              {
                "id": "d0144",
                "name": "实战一：手搓 ReactAgent（非流式）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0145",
                "name": "实战一：手搓 ReactAgent（流式）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0146",
                "name": "ReAct Agent 流式输出后续问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0147",
                "name": "实战二：手搓 ReflectionAgent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0148",
                "name": "实战三：手搓 PlanExecuteAgent（上）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0149",
                "name": "实战三：手搓 PlanExecuteAgent（下）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0150",
                "name": "实战四：手搓 Human in the Loop",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-workflow",
        "name": "09 AI Workflow 与 Dify / N8N",
        "note": "19 篇。低代码平台适合确定性流程，别拿它硬做需要自主决策的 Agent。",
        "children": [
          {
            "id": "g-wf-basic",
            "name": "概念辨析",
            "note": "核心判据：流程由谁决定。写死的是 Workflow，模型自主决定的是 Agent，两者混合是 Agentic Workflow。",
            "children": [
              {
                "id": "d0151",
                "name": "初识 Ai Workflow",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0152",
                "name": "Workflow VS Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0153",
                "name": "Agentic Workflow",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0154",
                "name": "Agent、AI Workflow、Agentic Workflow 傻傻分不清",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-wf-dify",
            "name": "Dify（7 篇）",
            "children": [
              {
                "id": "d0155",
                "name": "本地部署 Dify 做工作流搭建",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0156",
                "name": "工作流平台（Dify 为例）中的常用组件",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0157",
                "name": "基于 Dify 实现 Ai Workflow",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0158",
                "name": "Dify 进阶：RAG 的使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0159",
                "name": "Dify 进阶：MCP 的使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0160",
                "name": "Dify 进阶：插件开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0161",
                "name": "Dify 进阶：API 调用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-wf-n8n",
            "name": "N8N 与平台选型",
            "children": [
              {
                "id": "d0162",
                "name": "什么是 n8n？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0163",
                "name": "Dify & N8N & Coze & FastGPT 对比",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-wf-case",
            "name": "实战：舆情分析助手（6 篇）",
            "note": "爬取 → 提取 → 分析 → 落库，一条完整的数据采集分析流水线。与你安全数据平台的「数据接入」环节同构。",
            "children": [
              {
                "id": "d0164",
                "name": "工作流实战：舆情分析助手——整体流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0165",
                "name": "工作流实战：舆情分析助手——爬虫工具 firecrawl 介绍",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0166",
                "name": "工作流实战：舆情分析助手——N8N 配置 firecrawl 实现分页爬取",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0167",
                "name": "工作流实战：舆情分析助手——微博内容提取",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0168",
                "name": "工作流实战：舆情分析助手——LLM 节点做舆情分析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0169",
                "name": "工作流实战：舆情分析助手——数据保存与更新",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-context",
        "name": "10 上下文工程与记忆",
        "note": "8 篇。上下文是 Agent 的「工作内存」，长上下文不是免费的——差旅项目另有 11 篇上下文工程实战，见 18 分支。",
        "children": [
          {
            "id": "d0170",
            "name": "什么是 Context，和 Memory、Prompt、Token 之间的区别？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0171",
            "name": "上下文太长会带来什么问题？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0172",
            "name": "什么是上下文工程？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0173",
            "name": "实战：Manus 的上下文工程实践",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0174",
            "name": "什么是长期记忆",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0175",
            "name": "长期记忆实现方案——Mem0",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0176",
            "name": "Mem0 的实现原理",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0177",
            "name": "Spring AI Alibaba 接入 Mem0 做长期记忆",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      },
      {
        "id": "b-harness",
        "name": "11 Harness 与 Loop Engineering",
        "note": "5 篇。Harness = 模型之外的那层脚手架（工具、记忆、护栏、可观测性）。差旅项目有 5 篇落地实现，见 18 分支。",
        "children": [
          {
            "id": "d0178",
            "name": "什么是 Harness Engineering？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0179",
            "name": "以 AI Coding 为例说明 Harness Engineering",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0180",
            "name": "如何实现 Harness Engineering",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0181",
            "name": "什么是 Loop Engineering",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0182",
            "name": "Loop Engineering 是不是新瓶装旧酒？",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      },
      {
        "id": "b-skills",
        "name": "12 Agent Skills",
        "note": "13 篇。Skill 与 Tool 的分工、与 SubAgent 的取舍，在差旅项目里有大量实战辨析。",
        "children": [
          {
            "id": "g-skills-basic",
            "name": "概念与使用",
            "note": "渐进式披露是 Skill 省 token 的关键：先给目录，用到才加载正文。",
            "children": [
              {
                "id": "d0183",
                "name": "什么是 Agent Skills，为什么需要他？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0184",
                "name": "Skill 的渐进式披露",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0185",
                "name": "Claude Code 中如何使用 Skills",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0186",
                "name": "一些好用的 Skills 推荐",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-skills-case",
            "name": "实战：简历评估",
            "children": [
              {
                "id": "d0187",
                "name": "实战：开发一个简历评估的 Skill",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0188",
                "name": "简历评估 Skills 讲解",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-skills-framework",
            "name": "框架集成",
            "children": [
              {
                "id": "d0189",
                "name": "SpringAI 中如何使用 Skill？（Agent）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0190",
                "name": "SpringAI 中如何使用 Skill？（ChatClient）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-skills-impl",
            "name": "实现原理",
            "children": [
              {
                "id": "d0191",
                "name": "OpenCode（CC 的开源版）中的 Skills 的实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0192",
                "name": "Spring AI 中 Skill 集成的实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0193",
                "name": "Claude Code 中的 Skills 实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-skills-advanced",
            "name": "安全与自进化",
            "note": "Skill 是可执行的外部指令，安全边界必须显式设计——这一条对你的安全数据平台尤其重要。",
            "children": [
              {
                "id": "d0194",
                "name": "Agent Skills 的安全问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0195",
                "name": "Hermes Agent 的 Skill 自进化机制",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-agentscope",
        "name": "13 AgentScope Java",
        "note": "28 篇，是目录里最成体系的一个框架专题。差旅项目基于 AgentScope Java 构建。",
        "children": [
          {
            "id": "g-as-basic",
            "name": "初探与核心特性（11 篇）",
            "children": [
              {
                "id": "d0196",
                "name": "AgentScope 初探",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0197",
                "name": "AgentScope Java 特性：流式输出、结构化输出、超时与重试、执行控制",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0198",
                "name": "AgentScope Java 特性：多轮会话 & 会话持久化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0199",
                "name": "AgentScope Java 特性：长期记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0200",
                "name": "AgentScope Java 特性：智能上下文压缩",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0201",
                "name": "实战：实现 AgentScope 的三层记忆体系",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0202",
                "name": "AgentScope Java 特性：Hook",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0203",
                "name": "AgentScope Java 中 ReactAgent 的实现原理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0204",
                "name": "AgentScope Java 特性：工具集成",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0205",
                "name": "AgentScope Java 特性：MCP 接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0206",
                "name": "AgentScope Java 特性：RAG",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-as-advanced",
            "name": "进阶能力",
            "children": [
              {
                "id": "d0207",
                "name": "AgentScope Java 进阶：Skill",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0208",
                "name": "AgentScope Java 进阶：Human-in-the-Loop",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0209",
                "name": "AgentScope Java 进阶：Plan-and-Execute",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-as-2",
            "name": "2.0 新特性（14 篇）",
            "note": "2.0 把 Harness 那套（Workspace / Sandbox / Filesystem / Middleware）做进了框架，与 11 分支互为印证。",
            "children": [
              {
                "id": "d0210",
                "name": "AgentScope Java 2.0 中的 HarnessAgent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0211",
                "name": "AgentScope Java 2.0 中的 Workspace",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0212",
                "name": "AgentScope Java 2.0 中的记忆（单机）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0213",
                "name": "AgentScope Java 2.0 中的 Middleware",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0214",
                "name": "AgentScope Java 2.0 中的长期记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0215",
                "name": "AgentScope Java 2.0 中的持久化与多租户",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0216",
                "name": "AgentScope Java 2.0 中的记忆（分布式）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0217",
                "name": "AgentScope Java 2.0 中的上下文压缩",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0218",
                "name": "AgentScope Java 2.0 中的 Skill",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0219",
                "name": "AgentScope Java 2.0 中的 Filesystem",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0220",
                "name": "AgentScope Java 2.0 中 DistributedStore 和 St…",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0221",
                "name": "AgentScope Java 2.0 中的 Sandbox",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0222",
                "name": "AgentScope Java 2.0 中的知识库",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0223",
                "name": "AgentScope Java 2.0 中的多智能体",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-finetune",
        "name": "14 大模型微调与训练",
        "note": "13 篇。训练 → 判断 → 部署 → 评测，闭环完整。",
        "children": [
          {
            "id": "g-ft-why",
            "name": "原理与动机",
            "note": "与 RAG 的分工：微调改「能力与风格」，RAG 改「知识与时效」。01 章三大局限里只有「知识局限」两者都能治。",
            "children": [
              {
                "id": "d0224",
                "name": "大模型是怎么训练出来的？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0225",
                "name": "为什么需要大模型微调？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0226",
                "name": "大模型微调的方法",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ft-env",
            "name": "环境与数据",
            "children": [
              {
                "id": "d0227",
                "name": "训练服务器准备",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0228",
                "name": "训练框架选择",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0229",
                "name": "训练环境配置 & 踩坑记录",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0230",
                "name": "数据集如何准备？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ft-run",
            "name": "训练与部署",
            "children": [
              {
                "id": "d0231",
                "name": "启动模型训练（上）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0232",
                "name": "启动模型训练（下）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0233",
                "name": "如何判断训练的好坏？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0234",
                "name": "如何部署大模型服务？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ft-eval",
            "name": "效果评测",
            "children": [
              {
                "id": "d0235",
                "name": "训练效果如何评测",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0236",
                "name": "评测我们的模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-lcgraph",
        "name": "15 LangChain 与 LangGraph",
        "note": "23 篇。Python 侧生态，与 03 / 04 的 Java 路线互为参照。",
        "children": [
          {
            "id": "g-lc-compare",
            "name": "框架对比",
            "note": "原标题在目录中被截断，完整标题见原文链接。",
            "children": [
              {
                "id": "d0237",
                "name": "LangChain & LlamaIndex & LangGraph & Au…",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc-langchain",
            "name": "LangChain（6 篇）",
            "children": [
              {
                "id": "d0238",
                "name": "LangChain——大模型调用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0239",
                "name": "LangChain——LCEL 链式编排",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0240",
                "name": "LangChain——对话记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0241",
                "name": "LangChain——RAG",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0242",
                "name": "LangChain——Agent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0243",
                "name": "LangChain——多智能体",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc-langgraph",
            "name": "LangGraph（7 篇）",
            "note": "Checkpointer 是「暂停 / 恢复 / 人工介入」的底座，与差旅项目的中断恢复、Data Agent 的断点续传同源。",
            "children": [
              {
                "id": "d0244",
                "name": "LangGraph——核心思想",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0245",
                "name": "LangGraph——Checkpointer",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0246",
                "name": "LangGraph——Human-in-the-Loop",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0247",
                "name": "LangGraph——构建一个 Ai Workflow",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0248",
                "name": "LangGraph——多智能体（Handoff）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0249",
                "name": "LangGraph——多智能体（Router）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0250",
                "name": "LangGraph——构建 Agentic Workflow",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc-graph",
            "name": "Spring AI Alibaba Graph",
            "children": [
              {
                "id": "d0251",
                "name": "Spring AI Alibaba Graph 的使用（选学）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc-deep",
            "name": "Deep Agents 与可观测性",
            "children": [
              {
                "id": "d0252",
                "name": "Deep Agents",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0253",
                "name": "LangSmith & Langfuse",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-lc-project",
            "name": "项目实战：Graph 编排（6 篇）",
            "note": "「哪些交给模型，哪些必须确定」是整个 Agent 工程最该先回答的问题。",
            "children": [
              {
                "id": "d0254",
                "name": "项目介绍",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0255",
                "name": "快速启动与使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0256",
                "name": "哪些交给模型，哪些必须确定",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0257",
                "name": "Graph 流程编排",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0258",
                "name": "使用 State 在 Graph 中传递上下文",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0259",
                "name": "使用 Checkpointer 实现 Graph 暂停恢复",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-eval",
        "name": "16 Agent 评测与 BIRD",
        "note": "17 篇。评测是你安全数据平台「可信」主张的通用方法论，值得优先精读。",
        "children": [
          {
            "id": "g-eval-agent",
            "name": "Agent 评测体系",
            "note": "与 RAG 评测的区别：RAG 评「答得对不对」，Agent 还要评「过程走对没有」——多步、有工具、有副作用。",
            "children": [
              {
                "id": "d0260",
                "name": "Agent 评测：Agent 评测为什么这么难？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0261",
                "name": "Agent 评测：如何构建评测体系（Agent 执行）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0262",
                "name": "Agent 评测：如何构建评测体系（怎么评判）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0263",
                "name": "Agent 评测：如何构建评测体系（问题定位）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-eval-agent-do",
            "name": "Agent 评测实操（7 篇）",
            "children": [
              {
                "id": "d0264",
                "name": "Agent 评测实操：评测数据集的构建",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0265",
                "name": "Agent 评测实操：LLM-as-Judge 判分",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0266",
                "name": "Agent 评测实操：评分脚本运行与报告解读",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0267",
                "name": "Agent 评测实操：问题诊断流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0268",
                "name": "Agent 评测实操：trace 查询工具",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0269",
                "name": "Agent 评测实操：诊断运行",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0270",
                "name": "GogoAgent 评测方案设计",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-eval-bird",
            "name": "BIRD 评测（6 篇）",
            "note": "BIRD 是 text2sql 的公开基准，直接对应 19 分支的 Data Agent。",
            "children": [
              {
                "id": "d0271",
                "name": "BIRD 评测：DataAgent 如何做公开数据评测？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0272",
                "name": "BIRD 评测：如何改造我们的 DataAgent？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0273",
                "name": "BIRD 评测：评测数据的 Schema 改造",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0274",
                "name": "BIRD 评测：执行验证工具",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0275",
                "name": "BIRD 评测：如何跑一次完整的评测？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0276",
                "name": "BIRD 评测：如何和 BaseLine 进行对比？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-knowengine",
        "name": "17 项目：know-engine 知识库",
        "note": "61 篇，目录里第二大的项目。RAG 全链路的生产级实现，建议作为 07 分支读完理论后的第一个精读项目。",
        "children": [
          {
            "id": "g-ke-start",
            "name": "项目概览",
            "note": "基于 LangChain4J 的企业知识库问答系统，是 07 分支 RAG 理论的完整落地样本。",
            "children": [
              {
                "id": "d0277",
                "name": "项目中用到的文件",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0278",
                "name": "项目整体架构与核心功能",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0279",
                "name": "项目亮点与设计原则",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0280",
                "name": "项目如何启动 & 快速开始",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0281",
                "name": "技术选型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-parse",
            "name": "文档解析（9 篇）",
            "note": "GIGO 的第一道防线在真实项目里长什么样：PDF / Excel / 表格 / 图片各有坑。",
            "children": [
              {
                "id": "d0282",
                "name": "为什么不用 Java 解析 PDF 文档",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0283",
                "name": "为什么选择 MinerU 解析文档？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0284",
                "name": "MinerU 文档处理功能实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0285",
                "name": "文档索引构建流程——文档上传",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0286",
                "name": "在 Java 代码中把 MinerU 解析文档功能集成进来",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0287",
                "name": "解决 MinerU 解析无法获取图片的问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0288",
                "name": "Excel 文件如何处理？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0289",
                "name": "项目中多种格式的文档处理？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0290",
                "name": "表格 & 图片被拆分到多个分块如何解决？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-index",
            "name": "索引构建（10 篇）",
            "note": "02 章「长度两难」在这里有了实测答案，事件驱动 + 分布式锁是生产化的关键。",
            "children": [
              {
                "id": "d0291",
                "name": "文档索引构建流程——文档切分",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0292",
                "name": "chunkSize 和 overlap 设置成多少比较合适？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0293",
                "name": "接入 ElasticSearch 做向量存储",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0294",
                "name": "文档索引构建流程——向量存储",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0295",
                "name": "向量维度如何设置？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0296",
                "name": "文档预处理阶段全流程讲解（事件驱动）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0297",
                "name": "XXL-JOB 部署及用任务驱动文档处理流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0298",
                "name": "引入分布式锁解决文档处理的并发问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0299",
                "name": "分段批量插入性能优化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0300",
                "name": "基于雪花算法生成唯一的 chunkId",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-retrieve",
            "name": "检索与召回（9 篇）",
            "note": "07 分支九种优化技术在这里几乎全部落地，metadata 设计尤其值得对照 02 章的「四类信息」。",
            "children": [
              {
                "id": "d0301",
                "name": "LangChain4J 中的 RAG 执行流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0302",
                "name": "如何针对用户的问题做重写？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0303",
                "name": "如何实现查询路由——检索器路由？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0304",
                "name": "混合检索如何实现？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0305",
                "name": "自定义基于 ElasticSearch 的向量检索器",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0306",
                "name": "父子分段的切分和检索逻辑",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0307",
                "name": "多级缓存实现 chunk 的快速检索",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0308",
                "name": "使用 BGE-ReRanker 针对检索结果做重排序",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0309",
                "name": "Chunk 的 metadata 怎么设计的？怎么用？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-dialog",
            "name": "对话与提示词（16 篇）",
            "note": "「把过程内容和引用返回给用户」正是可信与可溯源的产品化表达。",
            "children": [
              {
                "id": "d0310",
                "name": "对话相关表结构设计",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0311",
                "name": "虚拟线程 + flash 模型生成对话标题摘要",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0312",
                "name": "意图识别如何实现？如何优化？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0313",
                "name": "项目中意图识别提示词的优化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0314",
                "name": "根据不同的意图实现定制化提示词（单轮对话中版本）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0315",
                "name": "项目中问题回答全流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0316",
                "name": "如何把 RAG 的过程内容返回给用户",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0317",
                "name": "如何把引用文档内容返回给用户？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0318",
                "name": "将模型返回的对话内容，保存在数据库中",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0319",
                "name": "如何解决模型 json 格式输出不稳定问题？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0320",
                "name": "基于 langchain4j 的多轮对话的实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0321",
                "name": "根据不同的意图实现定制化提示词（多轮对话版本）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0322",
                "name": "问题重写支持多轮对话",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0323",
                "name": "支持多轮对话后的问题重写踩坑与 LLM 对比",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0324",
                "name": "RAG 问题澄清——对话卡片的实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0325",
                "name": "支持图片的召回和渲染",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-extend",
            "name": "扩展能力（9 篇）",
            "note": "权限体系 + 用户级隔离，与你安全数据平台的多租户诉求直接相关。",
            "children": [
              {
                "id": "d0326",
                "name": "如何基于 text2sql 实现关系型数据查询?",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0327",
                "name": "如何基于 text2cypher 实现图数据库的查询",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0328",
                "name": "文档如何做多版本管理？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0329",
                "name": "文档如何实现不停机更新",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0330",
                "name": "钉钉机器人接入做客服答疑",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0331",
                "name": "文档检索权限体系实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0332",
                "name": "接入登录，实现用户级对话隔离",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0333",
                "name": "解决路由错误导致问答失败问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0334",
                "name": "解决针对非向量检索导致重排序失败问题",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-ke-cache",
            "name": "问题缓存加速（3 篇）",
            "children": [
              {
                "id": "d0335",
                "name": "问题缓存加速——缓存构建",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0336",
                "name": "问题缓存加速——缓存使用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0337",
                "name": "问题缓存加速——缓存失效",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-travel",
        "name": "18 项目：智能差旅 Agent",
        "note": "133 篇，全图谱最大分支。它把 05–13 分支的所有概念在一个真实系统里全部用了一遍，并且保留了推翻重来的过程。\n\n建议读法：先读架构与意图识别，再按智能体逐个读，最后读提示词 / 上下文 / Harness 三组工程实战。",
        "children": [
          {
            "id": "g-tv-meta",
            "name": "项目概览",
            "note": "目录里最大的项目（133 篇），基于 AgentScope Java + Spring AI 的多智能体系统。",
            "children": [
              {
                "id": "d0338",
                "name": "spring-ai-agentx",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0339",
                "name": "整体功能演示",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0340",
                "name": "会话与消息的持久化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0341",
                "name": "登录体系开发及介绍",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0342",
                "name": "项目整体架构与核心功能",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0343",
                "name": "项目功能介绍与演示",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0344",
                "name": "项目如何启动 & 快速开始",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0345",
                "name": "什么是废弃方案？还用看吗？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-deprecated",
            "name": "废弃方案（6 篇）",
            "note": "作者保留了被推翻的方案。读废弃理由比读结论更能学到判断力——但别照着实现。",
            "children": [
              {
                "id": "d0346",
                "name": "行程方案最终审核工具定义及开发（废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0347",
                "name": "行程审核智能体的功能介绍及开发（废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0348",
                "name": "使用 TTL 实现多智能体之间的上下文传递（已废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0349",
                "name": "用户意图很明确时，直接路由给子智能体还是主智能体？（已废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0350",
                "name": "通过问题改写融合多轮对话（已废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0351",
                "name": "非 ReActAgent 如何做 Session 持久化（已废弃）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-arch",
            "name": "多智能体架构（8 篇）",
            "children": [
              {
                "id": "d0352",
                "name": "为什么要用多智能体架构？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0353",
                "name": "项目中有哪些智能体，各自职责是什么？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0354",
                "name": "主智能体功能介绍与开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0355",
                "name": "用了哪几种模型，分别用在哪？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0356",
                "name": "我给 Agent 加了哪些关键配置",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0357",
                "name": "多智能体之间的上下文传递方式",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0358",
                "name": "基于 Reactor Context 实现多智能体之间的会话上下文传递",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0359",
                "name": "各个 Agent 配置对比一览",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-intent",
            "name": "意图识别与问题改写（16 篇）",
            "note": "规则 → RAG → LLM 三层递进，是「哪些交给模型、哪些必须确定」的最佳实例。95 / 204 是同一篇的两个副本。",
            "children": [
              {
                "id": "d0360",
                "name": "什么是意图识别 / 问题改写，为什么要做？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0361",
                "name": "为什么意图识别 / 问题改写不放在主智能体或者做成 Skill？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0362",
                "name": "为什么问题改写 / 意图识别不用 ReAct Agent？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0363",
                "name": "通过问题改写融合多轮对话",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0364",
                "name": "基于规则 + RAG + LLM 构建三层意图识别",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0365",
                "name": "基于规则的 L0/L1 意图识别详解",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0366",
                "name": "基于规则的 L0/L1 意图识别详解（重复件）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              },
              {
                "id": "d0367",
                "name": "基于 RAG 的 L2 意图识别详解",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0368",
                "name": "L1/L2 意图识别针对多意图的支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0369",
                "name": "单次对话多意图识别与执行",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0370",
                "name": "意图识别与问题改写的流水线编排",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0371",
                "name": "引入 L1/L2 之后意图识别不准确问题修复",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0372",
                "name": "用户意图很明确时，直接路由给子智能体还是主智能体？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0373",
                "name": "问题改写、意图识别、MasterAgent、SubAgent 的执行顺序",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0374",
                "name": "多意图识别后的处理流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0375",
                "name": "意图识别 / 问题改写的打断支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-itinerary",
            "name": "行程管理智能体（13 篇）",
            "note": "「模型幻觉导致用户 id 传错」是权限与数据安全的典型坑，你的平台会遇到同类问题。",
            "children": [
              {
                "id": "d0376",
                "name": "行程管理智能体的功能介绍及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0377",
                "name": "行程管理相关业务数据模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0378",
                "name": "快速路由到上次执行的子智能体",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0379",
                "name": "如果定义一个好的工具",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0380",
                "name": "差旅单管理工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0381",
                "name": "行程冲突检测工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0382",
                "name": "如何避免模型幻觉导致用户 id 传错？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0383",
                "name": "多智能体上下文参数传递遇到的坑",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0384",
                "name": "用户联系信息工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0385",
                "name": "使用缓存减少工具重复调用",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0386",
                "name": "预订管理工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0387",
                "name": "行程审批及管理功能介绍及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0388",
                "name": "如何基于回答更好的问题推荐？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-plan",
            "name": "行程规划智能体（21 篇）",
            "note": "全项目最厚的一块。Skill / Tool / SubAgent 的取舍、第三方鉴权、API KEY 脱敏都在这里。",
            "children": [
              {
                "id": "d0389",
                "name": "为什么行程规划智能体要用 Plan-and-Exucute？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0390",
                "name": "行程规划智能体的功能介绍及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0391",
                "name": "为什么行程方案设计不用 Skill 要用工具？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0392",
                "name": "行程方案设计工具设计细节",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0393",
                "name": "价格和时间的分数归一化和加权分计算",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0394",
                "name": "搜索结果自动捕获与持久化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0395",
                "name": "行程方案设计工具重构与优化",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0396",
                "name": "差旅政策工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0397",
                "name": "行程规划的前置拦截",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0398",
                "name": "出差目的地实时联网查询工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0399",
                "name": "天气查询工具 / MCP 的接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0400",
                "name": "市面上可用的旅行相关 skill/mcp 工具对比",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0401",
                "name": "途牛 Skill 介绍及接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0402",
                "name": "航班管家 Skill 介绍及接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0403",
                "name": "Rolling Go Skill 介绍及接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0404",
                "name": "Agent 中如何实现第三方鉴权？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0405",
                "name": "基于 Token 直接配置方式做鉴权",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0406",
                "name": "基于 OAuth PKCE + 本地回调做鉴权",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0407",
                "name": "改造外部 Skill 使其具备生产环境可用性",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0408",
                "name": "如何实现 API KEY 的动态管理与加密、脱敏",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0409",
                "name": "PlanAgent 不把完整方案展示给用户问题修复",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-audit",
            "name": "行程审核（5 篇）",
            "note": "Reflection 架构的真实落地：审核 → 建议 → 重新规划，形成闭环。",
            "children": [
              {
                "id": "d0410",
                "name": "为什么行程审核不用 Skill？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0411",
                "name": "方案审核为什么要做成工具而不是单独的子智能体",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0412",
                "name": "多维行程审核架构的方案设计",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0413",
                "name": "行程审核时如何获取到 PlanAgent 的规划结果？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0414",
                "name": "审核建议给出后如何优化给出新方案？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-booking",
            "name": "行程预订智能体（10 篇）",
            "children": [
              {
                "id": "d0415",
                "name": "为什么单独搞一个 BookingAgent？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0416",
                "name": "行程预订智能体的功能介绍及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0417",
                "name": "差旅单查询工具重构",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0418",
                "name": "行程预定相关业务数据模型",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0419",
                "name": "查询预订记录工具定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0420",
                "name": "预订 Agent 如何获取方案做预订？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0421",
                "name": "行程预订的下单结果持久化方案",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0422",
                "name": "预定时，为什么下单用 skill，取消用工具？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0423",
                "name": "取消预订工具的定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0424",
                "name": "什么时候用 Skill，什么时候用 SubAgent",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-info",
            "name": "信息查询智能体（6 篇）",
            "children": [
              {
                "id": "d0425",
                "name": "信息查询 Agent 的功能介绍与开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0426",
                "name": "差旅政策的双通道支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0427",
                "name": "差旅政策知识库定义及开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0428",
                "name": "定义知识库 chunsize 并修复 agentscope 的 bug",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0429",
                "name": "签证 MCP 的接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0430",
                "name": "景点 RAG & 差旅指南 RAG 的接入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-tool",
            "name": "工具治理（3 篇）",
            "note": "134 / 135 是同一篇的两个副本。熔断 + 重试 + 并行是工具层的可靠性三件套。",
            "children": [
              {
                "id": "d0431",
                "name": "引入工具级熔断机制避免重复失败",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0432",
                "name": "工具并行执行 & 失败重试",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0433",
                "name": "工具并行执行 & 失败重试（重复件）",
                "tags": [
                  "未精读",
                  "重复件"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-prompt",
            "name": "提示词工程实战（10 篇）",
            "note": "01 分支的理论在这里变成 10 个具体手法。「职责边界与拒绝策略」对安全场景尤其关键。",
            "children": [
              {
                "id": "d0434",
                "name": "提示词工程——注意力引导",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0435",
                "name": "提示词工程——要不要在 prompt 中写清楚工具该怎么用？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0436",
                "name": "提示词工程——角色与人格设定",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0437",
                "name": "提示词工程——结构化输出约束",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0438",
                "name": "提示词工程——Few Shot",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0439",
                "name": "提示词工程——Step-back Prompting",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0440",
                "name": "提示词工程——Reflexion",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0441",
                "name": "提示词工程——决策表 / 路由表",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0442",
                "name": "提示词工程——动态变量注入",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0443",
                "name": "提示词工程——职责边界与拒绝策略",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-context",
            "name": "上下文工程实战（11 篇）",
            "note": "10 分支的理论在这里落地。核心思路一致：能压缩的压缩，能外置的外置，能缓存的缓存。",
            "children": [
              {
                "id": "d0444",
                "name": "为什么要做上下文工程？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0445",
                "name": "上下文工程——记忆自动压缩",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0446",
                "name": "上下文工程——如何对第三方 Skill 瘦身",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0447",
                "name": "上下文工程——工具返回内容裁剪",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0448",
                "name": "上下文工程——Skill 正文折叠（选学）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0449",
                "name": "上下文工程——利用中间文件减少 token 消耗",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0450",
                "name": "上下文工程——长期记忆",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0451",
                "name": "上下文工程——工具返回用摘要代替完整内容",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0452",
                "name": "上下文工程——优化系统提示词利用 KV 缓存",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0453",
                "name": "上下文缓存相关场景介绍",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0454",
                "name": "上下文工程——上下文缓存（选学）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-harness",
            "name": "Harness 工程实战（5 篇）",
            "note": "11 分支概念的落地版。安全护栏 + 沙箱 + 可观测性，正是你平台「可信」主张需要的三件套。",
            "children": [
              {
                "id": "d0455",
                "name": "Harness 工程——行程规划的执行闭环",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0456",
                "name": "Harness 工程——分层记忆体系",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0457",
                "name": "Harness 工程——命令执行的安全护栏",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0458",
                "name": "Harness 工程——沙箱",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0459",
                "name": "Harness 工程——可观测性",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-tv-infra",
            "name": "生产化基础设施（11 篇）",
            "note": "从单机 demo 到集群生产的完整跨越：打断恢复、HIL、A2A、脱敏。",
            "children": [
              {
                "id": "d0460",
                "name": "为什么要关闭模型的深度思考？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0461",
                "name": "为什么不用 AgentScope-Java 中的 SequentialPipelin…",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0462",
                "name": "引入 A2A 实现跨域 Agent 通信",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0463",
                "name": "实时通信 — SSE 流式推送架构",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0464",
                "name": "集群架构下的 Agent 打断与恢复",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0465",
                "name": "Human-in-the-Loop 在集群模式下的支持",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0466",
                "name": "如何在本地模拟集群服务",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0467",
                "name": "外部能力集成 — MCP 与 Skill",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0468",
                "name": "接入 RAG 知识库，让 Agent 拥有领域知识",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0469",
                "name": "Human-in-the-Loop — Agent 与用户的结构化交互",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0470",
                "name": "隐私保护——全链路敏感信息脱敏",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-dataagent",
        "name": "19 项目：Data Agent",
        "note": "28 篇。对你的安全数据分析平台参考价值最高的一个项目——语义层、数据权限、脱敏、归因四件事都有现成实现。",
        "children": [
          {
            "id": "g-da-start",
            "name": "项目概览",
            "note": "与你自建的安全数据分析平台最接近的一个项目：自然语言 → SQL → 结果 → 图表 → 归因。",
            "children": [
              {
                "id": "d0471",
                "name": "项目结构与安装部署",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0472",
                "name": "文件与联网搜索的重构",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0473",
                "name": "Skills 管理（单机版）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0474",
                "name": "data-agent 整体流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-schema",
            "name": "Schema 与业务消歧",
            "note": "这就是你平台「语义层」主张的现成参照：M-Schema 把库表结构 + 业务口径喂给模型，消歧解决同义词与口径歧义。",
            "children": [
              {
                "id": "d0475",
                "name": "什么是 M-Schema？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0476",
                "name": "M-Schema 的 Java 实现",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0477",
                "name": "Yaml Schema 方式",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0478",
                "name": "Schema 工具的封装",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0479",
                "name": "业务消歧怎么做？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-sql",
            "name": "SQL 执行与数据安全",
            "note": "六篇连着读就是一条完整的数据安全链路：校验 → 执行 → 权限计算 → 权限改写 → 脱敏。安全数据平台可直接借鉴。",
            "children": [
              {
                "id": "d0480",
                "name": "SQL 安全校验",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0481",
                "name": "执行 SQL 的完整流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0482",
                "name": "权限模型的改造",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0483",
                "name": "如何计算数据权限？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0484",
                "name": "如何改写数据权限？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0485",
                "name": "敏感字段如何脱敏",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-agent",
            "name": "智能体能力",
            "children": [
              {
                "id": "d0486",
                "name": "复杂计算与图表生成",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0487",
                "name": "如何实现动态工具参数？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0488",
                "name": "如何按需披露工具",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0489",
                "name": "如何让智能体自主规划",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0490",
                "name": "如何实现流式断点续传？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-interrupt",
            "name": "中断与恢复",
            "note": "与 15 分支 LangGraph Checkpointer 同源，长任务分析必须可中断可恢复。",
            "children": [
              {
                "id": "d0491",
                "name": "中断与恢复：如何安全地中断？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0492",
                "name": "中断与恢复：从断点恢复执行",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0493",
                "name": "中断与恢复：中断功能源码分析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0494",
                "name": "中断与恢复：恢复功能源码分析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-cluster",
            "name": "多节点部署改造",
            "children": [
              {
                "id": "d0495",
                "name": "多节点部署改造：中断与会话并发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0496",
                "name": "多节点部署改造：Skills 管理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0497",
                "name": "多节点部署改造：流式断点续传",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-da-insight",
            "name": "数据归因",
            "note": "从「查数」升级到「解释为什么」，正是你平台从报表走向研判的关键一跳。",
            "children": [
              {
                "id": "d0498",
                "name": "数据归因：指标涨跌到底什么原因",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-reimburse",
        "name": "20 项目：智能报销",
        "note": "13 篇。多模态抽取 + 合规校验 + A2A 跨项目协作。",
        "children": [
          {
            "id": "g-rb-overview",
            "name": "单据与生命周期",
            "children": [
              {
                "id": "d0499",
                "name": "报销核心单据",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0500",
                "name": "发票进入系统后的完整生命周期",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rb-extract",
            "name": "票据抽取",
            "note": "双路并行 + 交叉校验是提升抽取可信度的通用手法，可直接迁移到安全日志的字段抽取。",
            "children": [
              {
                "id": "d0501",
                "name": "多模态票据抽取",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0502",
                "name": "票据提取的双路并行与交叉校验",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0503",
                "name": "接入外部服务做 OCR & 发票验真",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0504",
                "name": "使用 LLM 做兜底费用归类",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rb-compliance",
            "name": "合规校验",
            "note": "分层校验 + 人工确认，是「模型定下限、规则与人工定上限」的又一实例。",
            "children": [
              {
                "id": "d0505",
                "name": "分层报销合规校验设计",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0506",
                "name": "发票拉黑及剔除机制",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0507",
                "name": "使用 HILP 做人工确认",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-rb-infra",
            "name": "工程支撑",
            "note": "通过 A2A 与 18 分支的差旅 Agent 打通，是两个项目之间的真实集成案例。",
            "children": [
              {
                "id": "d0508",
                "name": "在 Python 中使用 Redis 分布式锁",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0509",
                "name": "缓存",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0510",
                "name": "A2A Client 开发",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0511",
                "name": "智能差旅 A2A 连通",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-projects",
        "name": "21 项目：Wiki / 多模态问答 / PPT / DeepResearch",
        "note": "31 篇，四个中小型项目合集。适合在啃完大项目后用来补齐具体场景的实现手法。",
        "children": [
          {
            "id": "g-pj-wiki",
            "name": "LLM Wiki（4 篇）",
            "note": "与你正在用的 Obsidian vault、以及这张学习图谱本身，是同一类「知识累积」实践。",
            "children": [
              {
                "id": "d0512",
                "name": "什么是 LLM Wiki？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0513",
                "name": "Obsidian 环境安装",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0514",
                "name": "如何构建 LLM Wiki？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0515",
                "name": "一次完整的 wiki 流程",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-pj-multimodal",
            "name": "多模态问答助手（9 篇）",
            "children": [
              {
                "id": "d0516",
                "name": "整体架构与功能点介绍",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0517",
                "name": "项目运行说明",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0518",
                "name": "智能对话：从需求分析到技术落地",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0519",
                "name": "流式控制与任务管理",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0520",
                "name": "流式响应的一些重要概念",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0521",
                "name": "文件问答助手如何实现？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0522",
                "name": "大文件如何处理？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0523",
                "name": "音视频文本的抓取",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0524",
                "name": "如何实现多模态回答",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-pj-ppt",
            "name": "PPT 生成智能体（6 篇）",
            "note": "「如何输出稳定」+「失败策略与断点恢复」是生成类 Agent 的通用可靠性课题。",
            "children": [
              {
                "id": "d0525",
                "name": "智能体生成 PPT 的几种方式",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0526",
                "name": "模板填充 PPT 需求分析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0527",
                "name": "PPT 生成智能体",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0528",
                "name": "如何输出稳定的 PPT？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0529",
                "name": "用 Python-PPTX 渲染出 PPT",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0530",
                "name": "PPT 生成失败策略与断点恢复",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          },
          {
            "id": "g-pj-deep",
            "name": "DeepResearch 与 Skills 实现（12 篇）",
            "note": "micro_compact / auto_compact 两级压缩，与 18 分支的上下文工程实战互为补充。",
            "children": [
              {
                "id": "d0531",
                "name": "实现 DeepResearch（上）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0532",
                "name": "实现 DeepResearch（下）",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0533",
                "name": "前端的一些相关工作",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0534",
                "name": "多实例 Agent 任务管理改造",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0535",
                "name": "Agent Skills 到底是如何实现的？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0536",
                "name": "智能体如何拥有操作系统的能力？",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0537",
                "name": "spring-ai-agent-utils 中的 skills",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0538",
                "name": "Think 模型与输出解析",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0539",
                "name": "分阶段流式输出",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0540",
                "name": "重写 PPTX Skill",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0541",
                "name": "上下文压缩：micro_compact",
                "tags": [
                  "未精读"
                ],
                "doc": true
              },
              {
                "id": "d0542",
                "name": "上下文压缩：auto_compact",
                "tags": [
                  "未精读"
                ],
                "doc": true
              }
            ]
          }
        ]
      },
      {
        "id": "b-frontier",
        "name": "22 前沿专题",
        "note": "目录最前面的 7 篇（3 / 5「检索增强生成」已归入 07 分支）。\n\n「本体论」与 Super Agent 的持续运行，是下一步值得优先精读的两篇——前者对应你平台的语义层建模，后者对应长任务研判。",
        "children": [
          {
            "id": "d0543",
            "name": "Super Agent 实现原理：让 Agent 从\"一次会话\"变成\"持续运行",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0544",
            "name": "什么是本体论？",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0545",
            "name": "MultiAgent & AgentTeam & SuperAgent",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0546",
            "name": "多模态文档处理",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0547",
            "name": "MinIO 接入",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0548",
            "name": "使用 ElasticSearch 做关键词检索",
            "tags": [
              "未精读"
            ],
            "doc": true
          },
          {
            "id": "d0549",
            "name": "（选学）PostgresMlEmbeddingModel",
            "tags": [
              "未精读"
            ],
            "doc": true
          }
        ]
      }
    ]
  }
};
