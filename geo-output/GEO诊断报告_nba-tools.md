# GEO 诊断报告 · 127.0.0.1:8765

> 规则版本：geo-29-v2.0 | 生成时间：2026-11-20 10:46 | 诊断页数：5
> 目标市场：国内为主 | 业务类型：通用 | 页面角色：homepage
> 目标 URL：http://127.0.0.1:8765/

## 一、结论摘要

**总分 57.41 / 100（等级 C）** — 本次 29 项中已评估 29 项，0 项待判定或无法评估。

1. **抓取层正常**：未发现 AI 爬虫阻断，抓取层无阻塞。
2. **高危短板**：内容中有权威来源/研究/报告引用、作者/品牌/机构信息透明、结构化数据合规且覆盖到位、段落可引用性均值（等 9 项，见第三节）。
3. **段落可引用性均分 25.3/100**（分析了 7 个内容块），AI 会优先摘走的段落质量仍有提升空间。

## 二、评分总表

| 维度 | 得分 | 满分（已评估） | 得分率 | 判定 |
|---|---|---|---|---|
| 一、网页内容结构 | 13.6 | 20/20 | 68% | ⚠️ |
| 二、语义可理解性 | 13.1 | 16/16 | 82% | ✅ |
| 三、权威性与可信度 | 5.1 | 16/16 | 32% | 🔴 |
| 四、结构化与机器可读性 | 3.35 | 12/12 | 28% | 🔴 |
| 五、覆盖度与用户价值 | 7.1 | 12/12 | 59% | ⚠️ |
| 六、技术体验 | 5.0 | 6/6 | 83% | ✅ |
| 七、AI 平台适配与可引用性 | 10.16 | 18/18 | 56% | ⚠️ |
| **合计** | **57.41** | **100/100** | **57%** | **C** |

### 抓取层明细

| 爬虫 | 运营方 | Tier | 市场 | 状态 |
|---|---|---|---|---|
| Bytespider | 字节跳动 | 1 | 通用 | ✅ 放行（显式 Allow） |
| Baiduspider | 百度 | 1 | 通用 | ✅ 放行（显式 Allow） |
| Sogou web spider | 搜狗 | 1 | 国内 | ✅ 放行（显式 Allow） |
| YisouSpider | 神马搜索（阿里） | 1 | 国内 | ✅ 放行（显式 Allow） |
| 360Spider | 360 | 2 | 国内 | ✅ 放行（显式 Allow） |
| ToutiaoSpider | 今日头条 | 2 | 国内 | ✅ 放行（显式 Allow） |
| Baiduspider-image | 百度 | 2 | 国内 | ✅ 放行（未被规则覆盖） |
| Baiduspider-news | 百度 | 2 | 国内 | ✅ 放行（未被规则覆盖） |
| Baiduspider-video | 百度 | 2 | 国内 | ✅ 放行（未被规则覆盖） |
| Sogou inst spider | 搜狗 | 2 | 国内 | ✅ 放行（未被规则覆盖） |
| Sogou Pic Spider | 搜狗 | 2 | 国内 | ✅ 放行（未被规则覆盖） |
| EasouSpider | 宜搜 | 3 | 国内 | ✅ 放行（未被规则覆盖） |
| Bingbot | 微软 | 1 | 通用 | ✅ 放行（显式 Allow） |
| Googlebot | Google | 2 | 通用 | ✅ 放行（显式 Allow） |
| CCBot | Common Crawl | 3 | 通用 | ✅ 放行（未被规则覆盖） |
| anthropic-ai | Anthropic | 3 | 通用 | ✅ 放行（未被规则覆盖） |
| cohere-ai | Cohere | 3 | 通用 | ✅ 放行（未被规则覆盖） |
| Timpibot | Timpi | 3 | 通用 | ✅ 放行（未被规则覆盖） |
| ImagesiftBot | Imagesift | 3 | 通用 | ✅ 放行（未被规则覆盖） |
| Diffbot | Diffbot | 3 | 通用 | ✅ 放行（未被规则覆盖） |

robots.txt：存在 ｜ llms.txt：有 ｜ ai.txt：无 ｜ noindex：无 ｜ noai：无


### 国内 AI 平台链路可达性

| 平台 | 判定 | 主爬虫 | 依赖爬虫 | 被挡 |
|---|---|---|---|---|
| 豆包 Doubao | ✅ 可达 | Bytespider | Bytespider、ToutiaoSpider | 无 |
| 文心一言 Ernie | ✅ 可达 | Baiduspider | Baiduspider、Baiduspider-news | 无 |
| 腾讯元宝 Yuanbao | ✅ 可达 | Sogou web spider | Sogou web spider、Sogou inst spider | 无 |
| 通义千问 Qwen | ✅ 可达 | YisouSpider | YisouSpider、360Spider | 无 |
| Kimi / DeepSeek | ✅ 可达 | Bingbot | Bingbot、Googlebot | 无 |

> 判定逻辑：国内多数大模型的联网检索调搜索引擎索引而非自建爬虫，所以「豆包能不能引用你」取决于 Bytespider 有没有被挡、「文心」取决于百度系爬虫。主爬虫被挡即判阻断。


### 多页抽样一致性（5 页有效，请求 5 页）

- JSON-LD 覆盖率 **80%**（4 页有结构化数据）
- title 唯一率 **100%**
- 正文 ≥300 字占比 **100%**
- 抽样页可引用性均值 **34.9/100**（最差 25.3）
- 结论：抽样页平均可引用性 34.9/100，整站内容写法需要统一改

**最值得先改的页面（可引用性最低）**

| URL | 可引用性 | 正文字数 |
|---|---|---|
| https://xushoulin.github.io/nba-tools | 25.3 | 2364 |
| https://xushoulin.github.io/nba-tools/players/james-harden | 35 | 2566 |

**写得最好的页面（照着这个改其余页）**

| URL | 可引用性 | 正文字数 |
|---|---|---|
| https://xushoulin.github.io/nba-tools/teams/sac | 43 | 2107 |
| https://xushoulin.github.io/nba-tools/players/brayden-burries | 36 | 1581 |
| https://xushoulin.github.io/nba-tools/players/james-wiseman | 35 | 1866 |


## 三、高危问题

> 直接影响 AI 是否采信页面，优先处理。

### 1. 内容中有权威来源/研究/报告引用（C3.1，失分 4.0）

- 证据：全文 0 个外部链接，没有任何引用来源
- 整改：至少补 2 条可核实的权威来源；没有就说明哪些数字来自自家实测
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 2. 作者/品牌/机构信息透明（C3.3，失分 4.0）

- 证据：主体透明命中 0 项：无
- 整改：页脚补：企业工商全称 + 详细地址 + ICP 备案号 + 更新时间；文章加作者署名
- 验证：页脚可见企业全称、地址、ICP 备案号、更新时间四项

### 3. 结构化数据合规且覆盖到位（C4.1，失分 4.0）

- 证据：只有 microdata/RDFa，没有 JSON-LD
- 整改：额外补一份 JSON-LD；大模型解析 JSON-LD 的成本最低
- 验证：跑 inspect-schema.py，看 w3c_validation.findings 里 error 级是否清零

### 4. 段落可引用性均值（C7.1，失分 3.2）

- 证据：7 个段落块平均可引用性 25.3/100，等级分布 F级 7块
- 证据：落在 150–300 字理想区间的段落 0 个
- 整改：按 45/30/12 的顺序改：先把每个二级标题下的第一段写成「定义 + 数字 + 适用边界」，再砍掉依赖上文的代词，最后补数据来源
- 验证：重跑 fetch-page.py 后看 citability.average，目标 ≥65

### 5. 明确满足用户意图（FAQ）（C5.3，失分 2.5）

- 证据：无 FAQ 模块
- 整改：整理 6–10 条高频问题，用客户原话提问，配 FAQPage Schema
- 验证：页面出现 FAQ 区块，且与 FAQPage Schema 内容一致

### 6. 提供数据或事实支撑观点（C3.2，失分 2.4）

- 证据：带语境数据点 1 处（百分比 0、金额 0、年份 1）
- 整改：把「提升明显」改成「响应耗时从 820ms 降到 210ms」这类可核对表述
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 7. 提供摘要/总结（C4.2，失分 2.4）

- 证据：摘要信号命中 1 项：meta_description
- 证据：meta description：A growing collection of free basketball tools for fans and fantasy managers: salary cap, luxury tax, trade analyzer, adv
- 整改：正文开头加 3–5 条要点摘要，结尾加一段结论
- 验证：页首出现要点摘要，页尾出现结论段

### 8. 专业性 & 原创性明显（C3.4，失分 0.5）

- 证据：有一手数据：页面写明 "real 2026-27 cap hits"、30 teams、355 player career pages，这些数字来自项目自有数据集而非通用描述
- 证据：有独有产品组合：salary-cap + trade simulator + honours comparison 的组合不是常见模板站内容
- 证据：与站内其他页面不重复：首页是索引页，正文为各工具的一句话定位，未见整段复制模板痕迹
- 证据：缺少作者/维护者署名与独立观点，因此未给满分
- 整改：在 About 页补维护者身份与数据来源说明，并在首页加一句本站独有的数据口径（如官方 cap 与仅列前 12 份合同的差别）。
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 9. 多页一致性（抽样页结构/schema 不打架）（C7.4，失分 0.2）

- 证据：抽样 5 页（请求 5，失败 0）
- 证据：JSON-LD 覆盖率 80%（4 页有）
- 证据：标题去重后唯一率 100%
- 证据：正文 ≥300 字占比 100%
- 整改：—
- 验证：跑 fetch-page.py sample --pages 5，看 jsonld_coverage 是否为 100%


---

#### 中优先级（8 项）

> 非高危项，列出供参考；完整整改清单见第六节与整改清单文件。

### 10. 使用列表、表格、加粗强调（C1.5，失分 4.0）

- 证据：无 ul/ol/table/strong/b 元素，全是大段纯文字
- 整改：把长文改写成「小标题 + 列表 + 表格」结构
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 11. 答案块质量（给可直接摘走的结论）（C7.2，失分 3.2）

- 证据：抽样段落的「答案块质量」均值 5.8/30（定义句、首句带数字、问句式标题、来源声明合计）
- 整改：每个二级标题下的首段直接给结论：用「X 是指…」「实测 …ms」开头，把标题改成客户会问的原话（带问号）
- 验证：随机抽 3 个二级标题的首段，遮住上下文能独立读懂即为达标

### 12. 首段有结论/答案（C1.4，失分 2.4）

- 证据：首段无结论信号
- 证据：首段：Salary cap math, fantasy trade analysis, advanced stats, playoff simulations — all in your browser. No signup, no data c
- 整改：把结论提到前 150 字内：X 是…，适用于…，核心参数…
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 13. 实体明确（人名、地名、数字、品牌）（C2.3，失分 2.4）

- 证据：实体类别命中 2 类：numbers、brand_mentions
- 证据：数字 6、百分比 0、年份 1、机构名 0、地名 0
- 整改：把「效果好」改写成具体数字；补品牌全称、服务地区、适用行业、负责人署名
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 14. 提供案例、图表、对比（C5.2，失分 2.4）

- 证据：深度素材命中 1 类（表格 0 个、模块 []、图片 30 张）
- 整改：加一张参数对比表 + 一个真实案例（背景/做法/结果）
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 15. 页面 HTML 结构简洁，少广告干扰（C4.3，失分 2.2）

- 证据：正文/HTML 字符比仅 0.0112，静态 HTML 里几乎抓不到正文
- 整改：改成服务端渲染或预渲染，否则 AI 爬虫读不到内容
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass

### 16. 段落自包含性（脱离上下文也读得懂）（C7.3，失分 1.2）

- 证据：抽样段落的「自包含性」均值 14.5/25（理想长度 150–300 字、代词密度、专有名词数合计）
- 证据：0 个段落落在 150–300 字区间
- 整改：把「它/这个/该」换成主语名词；单段控制在 150–300 字；每段至少出现 3 个专有名词（品牌全称、地名、机构名）
- 验证：数一遍每个段落里的「它/这个/该」，单段不超过 2 个

### 17. 语义多样性（C2.2，失分 0.5）

- 证据：覆盖「是什么」：All tools 区块逐个说明 10 个工具（如 "Calculate your NBA luxury tax bill with the league's progressive tax brackets"）
- 证据：覆盖「为什么」：Why use NBA Tools? 小节给出 Instant / Private / Always free 三条理由
- 证据：覆盖「场景/人群」：首段与页脚都点明 fans and fantasy managers
- 证据：未覆盖「怎么做」和「有什么坑」：首页没有步骤说明，也没有数据时效或误差提示
- 整改：在首页补一段「How to start」三步说明，并在数据区加一句「2026-27 快照会随交易变化，仅供估算」。
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass


---

#### 低优先级（1 项）

> 非高危项，列出供参考；完整整改清单见第六节与整改清单文件。

### 18. 多模块内容（C6.3，失分 1.0）

- 证据：识别到 0 个内容模块：无
- 整改：按「是什么—怎么做—案例—FAQ—联系」重排页面骨架
- 验证：改动后重跑本脚本，该项状态应从 fail/partial 变 pass


## 四、逐项诊断

### 一、网页内容结构（13.6 / 20，满分 20）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C1.1 | 标题清晰且包含核心关键词 | 4/4 | pass | auto | <title>「NBA Tools — Free NBA & Fantasy Basketball Tools」，14 字，长度合适 | — |
| C1.2 | H1/H2/H3 层次分明 | 4/4 | pass | auto | 1 个 H1、3 个 H2，层级无跳级 | — |
| C1.3 | 段落简洁、避免过长 | 4/4 | pass | auto | 18 段，平均 34.2 字，最长 68 字，无超长段 | — |
| C1.4 | 首段有结论/答案 | 1.6/4 | partial | hybrid | 首段无结论信号 首段：Salary cap math, fantasy trade analysis, advanced stats, playoff simulations — all in your browser. No signup, no data c | 把结论提到前 150 字内：X 是…，适用于…，核心参数… |
| C1.5 | 使用列表、表格、加粗强调 | 0/4 | fail | auto | 无 ul/ol/table/strong/b 元素，全是大段纯文字 | 把长文改写成「小标题 + 列表 + 表格」结构 |

### 二、语义可理解性（13.1 / 16，满分 16）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C2.1 | 语言自然流畅，无明显关键词堆砌 | 4/4 | pass | auto | 词频最高的是「nba」，出现 9 次、密度 1.34%（作为主关键词密度的代理指标） | — |
| C2.2 | 语义多样性 | 3.5/4 | pass | hybrid | 覆盖「是什么」：All tools 区块逐个说明 10 个工具（如 "Calculate your NBA luxury tax bill with the league's progressive tax brackets"） 覆盖「为什么」：Why use NBA Tools? 小节给出 Instant / Private / Always free 三条理由 覆盖「场景/人群」：首段与页脚都点明 fans and fantasy  | 在首页补一段「How to start」三步说明，并在数据区加一句「2026-27 快照会随交易变化，仅供估算」。 |
| C2.3 | 实体明确（人名、地名、数字、品牌） | 1.6/4 | partial | auto | 实体类别命中 2 类：numbers、brand_mentions 数字 6、百分比 0、年份 1、机构名 0、地名 0 | 把「效果好」改写成具体数字；补品牌全称、服务地区、适用行业、负责人署名 |
| C2.4 | 减少冗余废话，信息密度高 | 4/4 | pass | auto | 营销套话占比 0.0% | — |

### 三、权威性与可信度（5.1 / 16，满分 16）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C3.1 | 内容中有权威来源/研究/报告引用 | 0/4 | fail | auto | 全文 0 个外部链接，没有任何引用来源 | 至少补 2 条可核实的权威来源；没有就说明哪些数字来自自家实测 |
| C3.2 | 提供数据或事实支撑观点 | 1.6/4 | partial | auto | 带语境数据点 1 处（百分比 0、金额 0、年份 1） | 把「提升明显」改成「响应耗时从 820ms 降到 210ms」这类可核对表述 |
| C3.3 | 作者/品牌/机构信息透明 | 0/4 | fail | auto | 主体透明命中 0 项：无 | 页脚补：企业工商全称 + 详细地址 + ICP 备案号 + 更新时间；文章加作者署名 |
| C3.4 | 专业性 & 原创性明显 | 3.5/4 | pass | manual | 有一手数据：页面写明 "real 2026-27 cap hits"、30 teams、355 player career pages，这些数字来自项目自有数据集而非通用描述 有独有产品组合：salary-cap + trade simulator + honours comparison 的组合不是常见模板站内容 与站内其他页面不重复：首页是索引页，正文为各工具的一句话定位，未见整段复制模板痕迹 缺少作者/维护者署名与独立观点，因此未 | 在 About 页补维护者身份与数据来源说明，并在首页加一句本站独有的数据口径（如官方 cap 与仅列前 12 份合同的差别）。 |

### 四、结构化与机器可读性（3.35 / 12，满分 12）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C4.1 | 结构化数据合规且覆盖到位 | 1/5 | fail | auto | 只有 microdata/RDFa，没有 JSON-LD | 额外补一份 JSON-LD；大模型解析 JSON-LD 的成本最低 |
| C4.2 | 提供摘要/总结 | 1.6/4 | partial | hybrid | 摘要信号命中 1 项：meta_description meta description：A growing collection of free basketball tools for fans and fantasy managers: salary cap, luxury tax, trade analyzer, adv | 正文开头加 3–5 条要点摘要，结尾加一段结论 |
| C4.3 | 页面 HTML 结构简洁，少广告干扰 | 0.75/3 | fail | auto | 正文/HTML 字符比仅 0.0112，静态 HTML 里几乎抓不到正文 | 改成服务端渲染或预渲染，否则 AI 爬虫读不到内容 |

### 五、覆盖度与用户价值（7.1 / 12，满分 12）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C5.1 | 回答覆盖多个角度 | 4/4 | pass | hybrid | 是什么：10 个工具逐项列出用途 适合谁：fans and fantasy managers 为什么：Instant / Private / Always free 三条理由 多少钱：明确写 "No paywalls, no trials, no credit card" 未覆盖「怎么做」与「有什么坑」两个角度 | 按疑问链补两个 H2：「How to get started」与「Things to know」，分别写三步用法和数据时效/非官方声明。 |
| C5.2 | 提供案例、图表、对比 | 1.6/4 | partial | auto | 深度素材命中 1 类（表格 0 个、模块 []、图片 30 张） | 加一张参数对比表 + 一个真实案例（背景/做法/结果） |
| C5.3 | 明确满足用户意图（FAQ） | 1.5/4 | partial | auto | 无 FAQ 模块 | 整理 6–10 条高频问题，用客户原话提问，配 FAQPage Schema |

### 六、技术体验（5.0 / 6，满分 6）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C6.1 | 页面加载速度快 | 1/1 | pass | auto | TTFB 475.8ms，HTML 60266 字节 | — |
| C6.2 | 移动端体验良好 | 1/1 | pass | auto | viewport：width=device-width, initial-scale=1 | — |
| C6.3 | 多模块内容 | 0/1 | fail | hybrid | 识别到 0 个内容模块：无 | 按「是什么—怎么做—案例—FAQ—联系」重排页面骨架 |
| C6.4 | 爬虫可抓取性 | 2/2 | pass | auto | 未发现 AI 爬虫阻断，抓取层无阻塞 | — |
| C6.5 | 网页可索引性 | 1/1 | pass | auto | 无 noindex；canonical https://xushoulin.github.io/nba-tools/；robots.txt 声明 sitemap 1 条 sitemap.xml 声明了 50 条 URL，但全部指向其他域名（xushoulin.github.io 等），跨域声明无效，本页等于没提交 | — |

### 七、AI 平台适配与可引用性（10.16 / 18，满分 18）

| id | 检查项 | 得分 | 状态 | 判定来源 | 证据 | 整改 |
|---|---|---|---|---|---|---|
| C7.1 | 段落可引用性均值 | 0.8/4 | fail | auto | 7 个段落块平均可引用性 25.3/100，等级分布 F级 7块 落在 150–300 字理想区间的段落 0 个 | 按 45/30/12 的顺序改：先把每个二级标题下的第一段写成「定义 + 数字 + 适用边界」，再砍掉依赖上文的代词，最后补数据来源 |
| C7.2 | 答案块质量（给可直接摘走的结论） | 0.8/4 | fail | auto | 抽样段落的「答案块质量」均值 5.8/30（定义句、首句带数字、问句式标题、来源声明合计） | 每个二级标题下的首段直接给结论：用「X 是指…」「实测 …ms」开头，把标题改成客户会问的原话（带问号） |
| C7.3 | 段落自包含性（脱离上下文也读得懂） | 1.8/3 | partial | auto | 抽样段落的「自包含性」均值 14.5/25（理想长度 150–300 字、代词密度、专有名词数合计） 0 个段落落在 150–300 字区间 | 把「它/这个/该」换成主语名词；单段控制在 150–300 字；每段至少出现 3 个专有名词（品牌全称、地名、机构名） |
| C7.4 | 多页一致性（抽样页结构/schema 不打架） | 2.76/3 | pass | auto | 抽样 5 页（请求 5，失败 0） JSON-LD 覆盖率 80%（4 页有） 标题去重后唯一率 100% 正文 ≥300 字占比 100% 抽样页平均可引用性 34.9/100，整站内容写法需要统一改 | — |
| C7.5 | 国内 AI 平台链路可达性 | 4/4 | pass | auto | 已映射 5 条 AI 链路：ok 5、部分可达 0、阻断 0 可达：豆包 Doubao、文心一言 Ernie、腾讯元宝 Yuanbao、通义千问 Qwen、Kimi / DeepSeek | — |


### 内容可引用性（段落级）

- 分析 7 个内容块，均分 **25.3/100**
- 等级分布：F 7 个
- 长度落在 150–300 字（最易被摘走）的块：0 个

**最容易被 AI 引用的段落**

| 小节 | 得分 | 预处理 |
|---|---|---|
| NBA Salary Cap Calculator | 30 | Free NBA salary cap calculator. Add player contracts and instantly see your total payroll, |
| Free NBA tools that just work. | 27 | Salary cap math, fantasy trade analysis, advanced stats, playoff simulations — all in your |
| NBA Player Comparison Tool | 27 | Compare two NBA players side by side across every stat. See who has the edge in points, re |
| NBA Salary & Trade Simulator | 27 | Explore every team's payroll, cap space and tax status, then simulate trades between two t |
| Team payrolls & rosters | 26 | All 30 teams split by conference, with real 2026-27 cap hits, cap space and apron status.  |

**最该重写的段落**

| 小节 | 得分 | 预处理 |
|---|---|---|
| Always free | 19 | No paywalls, no trials, no credit card. Just free tools. Free basketball tools for fans an |
| NBA Player Honours Comparison | 21 | Compare the trophy cases of up to four NBA players side by side — MVP awards, Finals MVPs, |
| Team payrolls & rosters | 26 | All 30 teams split by conference, with real 2026-27 cap hits, cap space and apron status.  |
| Free NBA tools that just work. | 27 | Salary cap math, fantasy trade analysis, advanced stats, playoff simulations — all in your |
| NBA Player Comparison Tool | 27 | Compare two NBA players side by side across every stat. See who has the edge in points, re |

> 重写方向：把每个小节写成能脱离上下文独立成立的 150–300 字段落——先给结论，再给数据，代词少用，专有名词写全。


## 五、未评估项

本次 29 项全部完成评估。

## 六、整改清单

完整整改清单见 `127.0.0.1:8765-remediation-20261120.md`（按 templates/remediation-plan.md 生成，共 18 项）。

生成命令：`generate-report.py <audit.json> --remediation -o 127.0.0.1:8765-remediation-20261120.md`

## 七、本周三件事

| # | 做什么 | 级别 | 怎么验证 |
|---|---|---|---|
| 1 | 内容中有权威来源/研究/报告引用：至少补 2 条可核实的权威来源；没有就说明哪些数字来自自家实测 | 高危 | 改动后重跑本脚本，该项状态应从 fail/partial 变 pass |
| 2 | 作者/品牌/机构信息透明：页脚补：企业工商全称 + 详细地址 + ICP 备案号 + 更新时间；文章加作者署名 | 高危 | 页脚可见企业全称、地址、ICP 备案号、更新时间四项 |
| 3 | 结构化数据合规且覆盖到位：额外补一份 JSON-LD；大模型解析 JSON-LD 的成本最低 | 高危 | 跑 inspect-schema.py，看 w3c_validation.findings 里 error 级是否清零 |

## 八、口径与限制

- 本次结论来自**规则检测**（脚本可复现），不含模型实测，因此不包含「AI 是否推荐你」的判断
- 官方 AI 可见度数据（Google Search Console 生成式 AI 性能报告 / Bing 网站管理员工具 AI 性能报告）：**未连接**，本次未评估。这两个报告分别只有曝光与引用数据，且 Google 侧无点击与提示词数据
- 分数为**页面级**结论，同站其他页面需单独诊断
- 抓不到、无法访问、需登录的页面对应项标注为无法评估，不计入分母，未用默认值补分
- 改完后需等 AI 爬虫重新抓取才生效，本次不承诺任何时间点的收录或推荐结果
- 规则版本不同时的两次诊断**不做分数对比**，只做逐项对比
- 规则版本：geo-29-v2.0（在线甲戟GEO 报告与本地输出共用同一版本）
