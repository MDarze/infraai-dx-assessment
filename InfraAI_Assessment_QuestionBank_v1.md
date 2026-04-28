# InfraAI Assessment Tool — Question Bank v1.0
# بنك أسئلة أداة التقييم — الإصدار ١.٠

**For:** Developer Handoff — Assessment Tool Build  
**Owner:** Mohamed Kamel — Lead Founder & CEO  
**Version:** 1.0 | April 2026  
**Status:** Draft — Pending Founder Review  

---

## Document Structure | هيكل الوثيقة

This file contains the complete question bank for the InfraAI 7-dimension assessment tool.  
يحتوي هذا الملف على بنك الأسئلة الكامل لأداة التقييم السباعي الأبعاد.

### Sectors Covered | القطاعات المشمولة
1. **INFRA** — Infrastructure Construction (مقاولات البنية التحتية)
2. **HEALTH** — Private Healthcare (الرعاية الصحية الخاصة)
3. **REAL** — Real Estate Development (التطوير العقاري)
4. **GOV** — Government Entities / Semi-Gov (الجهات الحكومية وشبه الحكومية)

### Dimensions Covered | الأبعاد المشمولة
1. `operations` — العمليات
2. `project_workflow` — سير المشروع
3. `site_management` — إدارة الموقع
4. `finance` — المالية
5. `executive_management` — الإدارة العليا
6. `reporting` — التقارير
7. `gov_compliance` — الامتثال الحكومي

### Question Types | أنواع الأسئلة
- `mcq` — Multiple Choice (A/B/C/D) | اختيار من متعدد
- `yn_conditional` — Yes/No with conditional follow-up | نعم/لا مع متابعة شرطية
- `open` — Open text | نص حر

### Scoring Logic | منطق التسجيل
- Each MCQ answer carries a `score` (0–3): 0 = No digital, 1 = Basic, 2 = Intermediate, 3 = Advanced/AI-ready
- Yes/No: `yes_score` and `no_score` defined per question
- Open text: scored manually by assessor (0–3), guided by `scoring_rubric`
- Dimension maturity = (sum of scores / max possible) × 100
- Overall maturity = average of 7 dimension scores

---

## Sector Tags Reference | مرجع تاريخ القطاعات

```
sectors: ["ALL"]         → Applies to all 4 sectors
sectors: ["INFRA"]       → Infrastructure only
sectors: ["HEALTH"]      → Healthcare only
sectors: ["REAL"]        → Real Estate only
sectors: ["GOV"]         → Government only
sectors: ["INFRA","REAL"]→ Infrastructure + Real Estate
```

---

## JSON Question Bank | بنك الأسئلة بصيغة JSON

```json
{
  "meta": {
    "version": "1.0",
    "created": "2026-04-28",
    "owner": "InfraAI Digital Solutions",
    "tool": "DX Assessment Tool",
    "total_questions": 196,
    "dimensions": 7,
    "sectors": ["INFRA", "HEALTH", "REAL", "GOV"]
  },

  "dimensions": {

    "operations": {
      "label_en": "Operations",
      "label_ar": "العمليات",
      "weight": 0.15,
      "questions": [

        {
          "id": "OPS-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are day-to-day operations currently managed?",
          "label_ar": "كيف تُدار العمليات اليومية حالياً؟",
          "options": {
            "A": { "en": "Entirely paper-based or verbal instructions", "ar": "ورق بالكامل أو تعليمات شفهية", "score": 0 },
            "B": { "en": "Excel sheets and WhatsApp groups", "ar": "جداول Excel ومجموعات واتساب", "score": 1 },
            "C": { "en": "Standalone software tools (not integrated)", "ar": "برامج منفصلة غير متكاملة", "score": 2 },
            "D": { "en": "Integrated digital platform with real-time visibility", "ar": "منصة رقمية متكاملة مع رؤية آنية", "score": 3 }
          }
        },

        {
          "id": "OPS-002",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is internal communication managed across teams?",
          "label_ar": "كيف تُدار الاتصالات الداخلية بين الفرق؟",
          "options": {
            "A": { "en": "Phone calls and in-person meetings only", "ar": "مكالمات هاتفية واجتماعات حضورية فقط", "score": 0 },
            "B": { "en": "WhatsApp / SMS broadcast", "ar": "واتساب / رسائل نصية", "score": 1 },
            "C": { "en": "Email with some project management tool", "ar": "بريد إلكتروني مع بعض أدوات إدارة المشاريع", "score": 2 },
            "D": { "en": "Unified collaboration platform (Teams, Slack, or custom)", "ar": "منصة تعاون موحدة (Teams أو Slack أو مخصصة)", "score": 3 }
          }
        },

        {
          "id": "OPS-003",
          "sectors": ["ALL"],
          "type": "yn_conditional",
          "label_en": "Do you have documented Standard Operating Procedures (SOPs) for your core processes?",
          "label_ar": "هل لديكم إجراءات تشغيل موحدة (SOPs) موثقة للعمليات الأساسية؟",
          "yes_score": 2,
          "no_score": 0,
          "conditional_if": "yes",
          "follow_up": {
            "id": "OPS-003a",
            "type": "mcq",
            "label_en": "How are these SOPs maintained and accessed?",
            "label_ar": "كيف يتم الحفاظ على هذه الإجراءات والوصول إليها؟",
            "options": {
              "A": { "en": "Printed binders / physical folders", "ar": "ملفات مطبوعة", "score": 0 },
              "B": { "en": "Shared drive (Google Drive, SharePoint)", "ar": "محرك مشترك (Google Drive أو SharePoint)", "score": 1 },
              "C": { "en": "Internal wiki or knowledge base", "ar": "موسوعة داخلية أو قاعدة معرفة", "score": 2 },
              "D": { "en": "Integrated into the operational system with version control", "ar": "مدمجة في النظام التشغيلي مع التحكم في الإصدارات", "score": 3 }
            }
          }
        },

        {
          "id": "OPS-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is employee time and attendance tracked?",
          "label_ar": "كيف يتم تتبع وقت الموظفين والحضور؟",
          "options": {
            "A": { "en": "Manual paper sheets", "ar": "أوراق يدوية", "score": 0 },
            "B": { "en": "Excel sheets updated daily", "ar": "جداول Excel تُحدَّث يومياً", "score": 1 },
            "C": { "en": "Digital attendance system (biometric or app)", "ar": "نظام حضور رقمي (بصمة أو تطبيق)", "score": 2 },
            "D": { "en": "Integrated HR + payroll + project cost system", "ar": "نظام متكامل HR + رواتب + تكاليف المشروع", "score": 3 }
          }
        },

        {
          "id": "OPS-005",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are procurement and vendor requests handled?",
          "label_ar": "كيف تتم عمليات الشراء وطلبات الموردين؟",
          "options": {
            "A": { "en": "Verbal or handwritten purchase orders", "ar": "أوامر شراء شفهية أو مكتوبة بالقلم", "score": 0 },
            "B": { "en": "Email-based approvals with no tracking system", "ar": "موافقات عبر البريد الإلكتروني بدون نظام تتبع", "score": 1 },
            "C": { "en": "Dedicated procurement module or ERP", "ar": "وحدة مشتريات مخصصة أو ERP", "score": 2 },
            "D": { "en": "Automated procurement with supplier integration and AI spend analysis", "ar": "مشتريات آلية مع تكامل الموردين وتحليل الإنفاق بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "OPS-006",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What is your current level of process automation?",
          "label_ar": "ما مستوى أتمتة العمليات لديكم حالياً؟",
          "options": {
            "A": { "en": "No automation — all processes are manual", "ar": "لا أتمتة — كل العمليات يدوية", "score": 0 },
            "B": { "en": "Some Excel macros or simple email rules", "ar": "بعض ماكرو Excel أو قواعد بريد بسيطة", "score": 1 },
            "C": { "en": "Workflow automation tools (e.g. Power Automate, Zapier)", "ar": "أدوات أتمتة سير العمل (Power Automate أو Zapier)", "score": 2 },
            "D": { "en": "AI-driven process automation with decision support", "ar": "أتمتة العمليات بالذكاء الاصطناعي مع دعم القرار", "score": 3 }
          }
        },

        {
          "id": "OPS-007",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How is equipment and asset maintenance managed?",
          "label_ar": "كيف تتم إدارة صيانة المعدات والأصول؟",
          "options": {
            "A": { "en": "Reactive only — fix when broken", "ar": "تفاعلية فقط — نصلح عند العطل", "score": 0 },
            "B": { "en": "Scheduled maintenance on paper calendar", "ar": "صيانة مجدولة على تقويم ورقي", "score": 1 },
            "C": { "en": "Digital CMMS (Computerized Maintenance Management System)", "ar": "نظام CMMS رقمي لإدارة الصيانة", "score": 2 },
            "D": { "en": "Predictive maintenance using IoT sensors and AI", "ar": "صيانة تنبؤية باستخدام أجهزة استشعار IoT والذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "OPS-008",
          "sectors": ["HEALTH"],
          "type": "mcq",
          "label_en": "How is patient flow and appointment scheduling managed?",
          "label_ar": "كيف تتم إدارة تدفق المرضى وجدولة المواعيد؟",
          "options": {
            "A": { "en": "Manual registers and phone calls", "ar": "سجلات يدوية ومكالمات هاتفية", "score": 0 },
            "B": { "en": "Spreadsheet or basic booking software", "ar": "جداول بيانات أو برامج حجز بسيطة", "score": 1 },
            "C": { "en": "Dedicated HMS (Hospital Management System)", "ar": "نظام HMS مخصص لإدارة المستشفيات", "score": 2 },
            "D": { "en": "AI-powered scheduling with wait-time prediction and resource optimization", "ar": "جدولة بالذكاء الاصطناعي مع توقع وقت الانتظار وتحسين الموارد", "score": 3 }
          }
        },

        {
          "id": "OPS-009",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "What is the single biggest operational bottleneck that costs you time or money every week?",
          "label_ar": "ما هي أكبر عقبة تشغيلية تكلفكم وقتاً أو مالاً كل أسبوع؟",
          "scoring_rubric": {
            "0": "No clear bottleneck identified / vague answer",
            "1": "Bottleneck identified but no data to quantify impact",
            "2": "Bottleneck identified with approximate cost or time impact",
            "3": "Bottleneck quantified with data — high AI/automation opportunity confirmed"
          }
        },

        {
          "id": "OPS-010",
          "sectors": ["ALL"],
          "type": "yn_conditional",
          "label_en": "Have you attempted any digital transformation initiative in the last 3 years?",
          "label_ar": "هل جربتم أي مبادرة تحول رقمي خلال السنوات الثلاث الماضية؟",
          "yes_score": 1,
          "no_score": 0,
          "conditional_if": "yes",
          "follow_up": {
            "id": "OPS-010a",
            "type": "mcq",
            "label_en": "What was the outcome?",
            "label_ar": "ما كانت النتيجة؟",
            "options": {
              "A": { "en": "Failed / abandoned within 6 months", "ar": "فشل أو أُهمل خلال 6 أشهر", "score": 0 },
              "B": { "en": "Partially implemented, low adoption", "ar": "مُنفَّذ جزئياً مع تبني منخفض", "score": 1 },
              "C": { "en": "Implemented but not integrated with other systems", "ar": "مُنفَّذ لكن غير متكامل مع الأنظمة الأخرى", "score": 2 },
              "D": { "en": "Successful with measurable ROI and team adoption", "ar": "ناجح مع عائد استثمار قابل للقياس وتبني الفريق", "score": 3 }
            }
          }
        }

      ]
    },

    "project_workflow": {
      "label_en": "Project Workflow",
      "label_ar": "سير المشروع",
      "weight": 0.20,
      "questions": [

        {
          "id": "PWF-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is project scope and requirements documented at kickoff?",
          "label_ar": "كيف يتم توثيق نطاق المشروع والمتطلبات عند الانطلاق؟",
          "options": {
            "A": { "en": "Verbal agreement / informal notes", "ar": "اتفاق شفهي / ملاحظات غير رسمية", "score": 0 },
            "B": { "en": "Word or PDF documents sent by email", "ar": "مستندات Word أو PDF تُرسل بالبريد الإلكتروني", "score": 1 },
            "C": { "en": "Structured project charter in a PM system", "ar": "ميثاق مشروع منظم في نظام PM", "score": 2 },
            "D": { "en": "Digital scope with AI-assisted risk flagging and dependency mapping", "ar": "نطاق رقمي مع تحديد المخاطر بالذكاء الاصطناعي وخرائط التبعيات", "score": 3 }
          }
        },

        {
          "id": "PWF-002",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What tool is used for project scheduling and timeline management?",
          "label_ar": "ما الأداة المستخدمة لجدولة المشاريع وإدارة الجداول الزمنية؟",
          "options": {
            "A": { "en": "No formal schedule — managed by memory/experience", "ar": "لا جدول رسمي — يُدار بالذاكرة والخبرة", "score": 0 },
            "B": { "en": "Excel Gantt chart or printed schedule", "ar": "مخطط Gantt في Excel أو جدول مطبوع", "score": 1 },
            "C": { "en": "MS Project, Primavera, or equivalent PM software", "ar": "MS Project أو Primavera أو برنامج PM مماثل", "score": 2 },
            "D": { "en": "Cloud PM platform with real-time updates, resource leveling and AI forecasting", "ar": "منصة PM سحابية مع تحديثات آنية وتسوية الموارد والتنبؤ بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "PWF-003",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How are design documents and drawings managed and distributed?",
          "label_ar": "كيف تتم إدارة مستندات التصميم والرسومات وتوزيعها؟",
          "options": {
            "A": { "en": "Physical prints distributed on site", "ar": "طبعات ورقية تُوزَّع في الموقع", "score": 0 },
            "B": { "en": "Shared drive folders (Dropbox, Google Drive)", "ar": "مجلدات على محرك مشترك (Dropbox، Google Drive)", "score": 1 },
            "C": { "en": "Document management system with version control", "ar": "نظام إدارة مستندات مع التحكم في الإصدارات", "score": 2 },
            "D": { "en": "BIM-integrated environment with clash detection and live drawing collaboration", "ar": "بيئة متكاملة مع BIM وكشف التعارضات والتعاون الحي في الرسومات", "score": 3 }
          }
        },

        {
          "id": "PWF-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are change orders and scope changes tracked and approved?",
          "label_ar": "كيف يتم تتبع أوامر التغيير وتعديلات النطاق والموافقة عليها؟",
          "options": {
            "A": { "en": "Verbal agreement — often disputed later", "ar": "اتفاق شفهي — غالباً ما يُتنازع عليه لاحقاً", "score": 0 },
            "B": { "en": "Email chain approvals", "ar": "موافقات عبر سلسلة بريد إلكتروني", "score": 1 },
            "C": { "en": "Formal change order form with sign-off workflow", "ar": "نموذج أمر تغيير رسمي مع سير عمل الموافقة", "score": 2 },
            "D": { "en": "Integrated change management with automatic cost and schedule impact analysis", "ar": "إدارة تغيير متكاملة مع تحليل تلقائي للتكلفة والجدول الزمني", "score": 3 }
          }
        },

        {
          "id": "PWF-005",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is task assignment communicated to team members?",
          "label_ar": "كيف يتم إبلاغ أعضاء الفريق بتعيين المهام؟",
          "options": {
            "A": { "en": "Verbal instructions on site / in office", "ar": "تعليمات شفهية في الموقع / المكتب", "score": 0 },
            "B": { "en": "WhatsApp messages or phone calls", "ar": "رسائل واتساب أو مكالمات هاتفية", "score": 1 },
            "C": { "en": "Task management app (Trello, Asana, Monday.com)", "ar": "تطبيق إدارة مهام (Trello، Asana، Monday.com)", "score": 2 },
            "D": { "en": "Integrated platform with auto-assignment, dependency linking and deadline alerts", "ar": "منصة متكاملة مع التعيين التلقائي وربط التبعيات وتنبيهات المواعيد النهائية", "score": 3 }
          }
        },

        {
          "id": "PWF-006",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are project risks identified and managed?",
          "label_ar": "كيف يتم تحديد مخاطر المشروع وإدارتها؟",
          "options": {
            "A": { "en": "Experience-based only — no formal process", "ar": "بالخبرة فقط — لا عملية رسمية", "score": 0 },
            "B": { "en": "Risk register in Excel updated occasionally", "ar": "سجل مخاطر في Excel يُحدَّث أحياناً", "score": 1 },
            "C": { "en": "Formal risk register reviewed in project meetings", "ar": "سجل مخاطر رسمي يُراجَع في اجتماعات المشروع", "score": 2 },
            "D": { "en": "Real-time risk scoring with AI-generated early warnings and mitigation playbooks", "ar": "تسجيل مخاطر آني مع تحذيرات مبكرة بالذكاء الاصطناعي وكتب تخفيف", "score": 3 }
          }
        },

        {
          "id": "PWF-007",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is project progress tracked against the baseline plan?",
          "label_ar": "كيف يتم تتبع تقدم المشروع مقابل الخطة الأساسية؟",
          "options": {
            "A": { "en": "No baseline — judged by feel / site manager opinion", "ar": "لا خط أساس — يُحكم بالشعور / رأي مدير الموقع", "score": 0 },
            "B": { "en": "Weekly status update emails from site engineers", "ar": "رسائل بريد إلكتروني لتحديث الحالة الأسبوعية من مهندسي الموقع", "score": 1 },
            "C": { "en": "Earned Value Management (EVM) or % complete tracking in PM software", "ar": "إدارة القيمة المكتسبة (EVM) أو تتبع نسبة الإتمام في برامج PM", "score": 2 },
            "D": { "en": "AI-powered progress detection from photos + sensor data with automated variance reporting", "ar": "كشف التقدم بالذكاء الاصطناعي من الصور وبيانات المستشعرات مع تقارير انحراف تلقائية", "score": 3 }
          }
        },

        {
          "id": "PWF-008",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How many active projects can your team manage simultaneously with current tools?",
          "label_ar": "كم مشروعاً نشطاً يستطيع فريقكم إدارته في آنٍ واحد بالأدوات الحالية؟",
          "options": {
            "A": { "en": "1–3 projects before quality degrades significantly", "ar": "١–٣ مشاريع قبل أن تتراجع الجودة بشكل ملحوظ", "score": 0 },
            "B": { "en": "4–7 projects with visible coordination gaps", "ar": "٤–٧ مشاريع مع ثغرات تنسيق واضحة", "score": 1 },
            "C": { "en": "8–15 projects with acceptable quality", "ar": "٨–١٥ مشروعاً بجودة مقبولة", "score": 2 },
            "D": { "en": "15+ projects with AI-assisted coordination", "ar": "١٥+ مشروعاً بتنسيق مدعوم بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "PWF-009",
          "sectors": ["HEALTH"],
          "type": "mcq",
          "label_en": "How are clinical protocols and treatment pathways documented and followed?",
          "label_ar": "كيف يتم توثيق البروتوكولات السريرية ومسارات العلاج والالتزام بها؟",
          "options": {
            "A": { "en": "Informal — based on physician experience", "ar": "غير رسمية — تعتمد على خبرة الطبيب", "score": 0 },
            "B": { "en": "Printed protocol booklets", "ar": "كتيبات بروتوكول مطبوعة", "score": 1 },
            "C": { "en": "Digital EMR with embedded protocol guides", "ar": "سجلات طبية إلكترونية بأدلة بروتوكول مدمجة", "score": 2 },
            "D": { "en": "AI-assisted clinical decision support with outcome tracking", "ar": "دعم قرار سريري بالذكاء الاصطناعي مع تتبع النتائج", "score": 3 }
          }
        },

        {
          "id": "PWF-010",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "Describe your typical project delivery cycle from contract signing to final handover. Where do delays most commonly occur?",
          "label_ar": "صف دورة تسليم مشروعكم النموذجية من توقيع العقد حتى التسليم النهائي. أين تحدث التأخيرات في الغالب؟",
          "scoring_rubric": {
            "0": "No clear process described",
            "1": "Process described verbally but no data on delay points",
            "2": "Clear process with known delay points but no digital tracking",
            "3": "Clear process with quantified delay patterns — high AI opportunity for prediction"
          }
        }

      ]
    },

    "site_management": {
      "label_en": "Site Management",
      "label_ar": "إدارة الموقع",
      "weight": 0.15,
      "questions": [

        {
          "id": "SITE-001",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How are daily site reports (DSR) submitted from the field?",
          "label_ar": "كيف تُقدَّم التقارير اليومية للموقع (DSR) من الميدان؟",
          "options": {
            "A": { "en": "Paper reports handed or faxed to office", "ar": "تقارير ورقية تُسلَّم أو تُرسَل بالفاكس للمكتب", "score": 0 },
            "B": { "en": "Photos and notes via WhatsApp to the manager", "ar": "صور وملاحظات عبر واتساب للمدير", "score": 1 },
            "C": { "en": "Digital form (Google Forms, Microsoft Forms) submitted daily", "ar": "نموذج رقمي (Google Forms أو Microsoft Forms) يُقدَّم يومياً", "score": 2 },
            "D": { "en": "Mobile app with GPS, photos, progress data auto-synced to dashboard", "ar": "تطبيق موبايل بـ GPS وصور وبيانات تقدم تتزامن تلقائياً مع لوحة التحكم", "score": 3 }
          }
        },

        {
          "id": "SITE-002",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How is material delivery and inventory tracked on site?",
          "label_ar": "كيف يتم تتبع توصيل المواد والمخزون في الموقع؟",
          "options": {
            "A": { "en": "Paper log books on site", "ar": "دفاتر تسجيل ورقية في الموقع", "score": 0 },
            "B": { "en": "Excel spreadsheet updated by storekeeper", "ar": "جدول Excel يُحدِّثه أمين المستودع", "score": 1 },
            "C": { "en": "ERP/inventory module with purchase order matching", "ar": "وحدة ERP/مخزون مع مطابقة أوامر الشراء", "score": 2 },
            "D": { "en": "IoT-enabled inventory with AI consumption forecasting", "ar": "مخزون مُمَكَّن بـ IoT مع توقع الاستهلاك بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "SITE-003",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How are safety incidents and near-misses recorded and reported?",
          "label_ar": "كيف يتم تسجيل حوادث السلامة والحوادث المحتملة والإبلاغ عنها؟",
          "options": {
            "A": { "en": "Verbal reporting only — often not documented", "ar": "تبليغ شفهي فقط — غالباً لا يُوثَّق", "score": 0 },
            "B": { "en": "Paper incident forms filed in office", "ar": "نماذج حوادث ورقية مُودَعة في المكتب", "score": 1 },
            "C": { "en": "Digital safety management system with incident tracking", "ar": "نظام إدارة سلامة رقمي مع تتبع الحوادث", "score": 2 },
            "D": { "en": "Real-time safety monitoring with AI risk scoring and predictive hazard alerts", "ar": "مراقبة سلامة آنية مع تسجيل مخاطر بالذكاء الاصطناعي وتنبيهات مخاطر تنبؤية", "score": 3 }
          }
        },

        {
          "id": "SITE-004",
          "sectors": ["INFRA", "REAL"],
          "type": "mcq",
          "label_en": "How is site survey and progress documentation done?",
          "label_ar": "كيف تتم المسوحات الميدانية وتوثيق التقدم؟",
          "options": {
            "A": { "en": "Manual measurements with tape/level, recorded on paper", "ar": "قياسات يدوية بالشريط/الميزان تُسجَّل على ورق", "score": 0 },
            "B": { "en": "Digital photos with manual annotation and email distribution", "ar": "صور رقمية مع توضيح يدوي وتوزيع بالبريد الإلكتروني", "score": 1 },
            "C": { "en": "Digital survey tools (total station, GPS) with CAD output", "ar": "أدوات مسح رقمية (total station، GPS) مع مخرجات CAD", "score": 2 },
            "D": { "en": "Drone surveys + 3D point cloud + AI progress comparison vs BIM model", "ar": "مسوحات بطائرة بدون طيار + سحابة نقاط ثلاثية الأبعاد + مقارنة التقدم بالذكاء الاصطناعي مقابل نموذج BIM", "score": 3 }
          }
        },

        {
          "id": "SITE-005",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How is subcontractor work and quality inspected and documented?",
          "label_ar": "كيف يتم فحص أعمال المقاولين الفرعيين وتوثيقها والتحقق من جودتها؟",
          "options": {
            "A": { "en": "Visual inspection by supervisor — no documentation", "ar": "فحص بصري من المشرف — لا توثيق", "score": 0 },
            "B": { "en": "Paper inspection checklists signed on site", "ar": "قوائم فحص ورقية موقَّعة في الموقع", "score": 1 },
            "C": { "en": "Digital inspection app with photo evidence and sign-off workflow", "ar": "تطبيق فحص رقمي مع دليل صوري وسير عمل الموافقة", "score": 2 },
            "D": { "en": "AI-powered quality scoring from images + automated punch list generation", "ar": "تسجيل جودة بالذكاء الاصطناعي من الصور + إنشاء قائمة مراجعة تلقائية", "score": 3 }
          }
        },

        {
          "id": "SITE-006",
          "sectors": ["HEALTH"],
          "type": "mcq",
          "label_en": "How is medical equipment maintenance and sterilization tracked?",
          "label_ar": "كيف يتم تتبع صيانة المعدات الطبية والتعقيم؟",
          "options": {
            "A": { "en": "Paper logs maintained by biomedical team", "ar": "سجلات ورقية يحتفظ بها فريق الهندسة الطبية الحيوية", "score": 0 },
            "B": { "en": "Excel tracker updated after each service", "ar": "متتبع Excel يُحدَّث بعد كل خدمة", "score": 1 },
            "C": { "en": "Biomedical equipment management system", "ar": "نظام إدارة معدات طب حيوي", "score": 2 },
            "D": { "en": "IoT-connected equipment with predictive maintenance and automated compliance reporting", "ar": "معدات متصلة بـ IoT مع صيانة تنبؤية وتقارير امتثال تلقائية", "score": 3 }
          }
        },

        {
          "id": "SITE-007",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "yn_conditional",
          "label_en": "Do your site teams use any mobile application to submit data or receive instructions?",
          "label_ar": "هل تستخدم فرقكم الميدانية أي تطبيق موبايل لتقديم البيانات أو استقبال التعليمات؟",
          "yes_score": 2,
          "no_score": 0,
          "conditional_if": "yes",
          "follow_up": {
            "id": "SITE-007a",
            "type": "mcq",
            "label_en": "How integrated is the mobile app with your back-office systems?",
            "label_ar": "ما مدى تكامل التطبيق المحمول مع أنظمتكم المكتبية الخلفية؟",
            "options": {
              "A": { "en": "Separate — data re-entered manually", "ar": "منفصل — تُدخَل البيانات يدوياً مرة أخرى", "score": 0 },
              "B": { "en": "Exports to Excel/CSV occasionally", "ar": "تصدير إلى Excel/CSV أحياناً", "score": 1 },
              "C": { "en": "Auto-sync to main platform via API", "ar": "مزامنة تلقائية مع المنصة الرئيسية عبر API", "score": 2 },
              "D": { "en": "Real-time bidirectional sync with AI-assisted field intelligence", "ar": "مزامنة ثنائية الاتجاه آنية مع ذكاء ميداني بالذكاء الاصطناعي", "score": 3 }
            }
          }
        },

        {
          "id": "SITE-008",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "open",
          "label_en": "Describe the journey of a site issue from discovery to resolution. How many people, steps, and days does it typically take?",
          "label_ar": "صف رحلة مشكلة ميدانية من اكتشافها إلى حلها. كم شخصاً وخطوةً ويوماً تستغرق عادةً؟",
          "scoring_rubric": {
            "0": "Cannot describe process clearly",
            "1": "Process described but no timing data",
            "2": "Clear process with approximate days — known pain points",
            "3": "Detailed process with data — multiple AI automation opportunities visible"
          }
        }

      ]
    },

    "finance": {
      "label_en": "Finance",
      "label_ar": "المالية",
      "weight": 0.20,
      "questions": [

        {
          "id": "FIN-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What system is currently used for accounting and bookkeeping?",
          "label_ar": "ما النظام المستخدم حالياً للمحاسبة وحفظ الدفاتر؟",
          "options": {
            "A": { "en": "Manual ledgers or paper receipts", "ar": "دفاتر يدوية أو إيصالات ورقية", "score": 0 },
            "B": { "en": "Excel or basic accounting software (QuickBooks basic, etc.)", "ar": "Excel أو برنامج محاسبة بسيط (QuickBooks أساسي، إلخ)", "score": 1 },
            "C": { "en": "Full accounting system (Odoo, SAP, Oracle, Zoho Books)", "ar": "نظام محاسبة كامل (Odoo، SAP، Oracle، Zoho Books)", "score": 2 },
            "D": { "en": "Integrated ERP with AI-powered financial insights and cash flow prediction", "ar": "ERP متكامل مع رؤى مالية بالذكاء الاصطناعي وتوقع التدفق النقدي", "score": 3 }
          }
        },

        {
          "id": "FIN-002",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is invoicing (Fatoorah) generated and issued to clients?",
          "label_ar": "كيف يتم إنشاء الفواتير (فاتورة) وإصدارها للعملاء؟",
          "options": {
            "A": { "en": "Manual paper invoices or Word/PDF templates", "ar": "فواتير ورقية يدوية أو قوالب Word/PDF", "score": 0 },
            "B": { "en": "Semi-manual — Excel/Word, emailed as PDF, not ZATCA-integrated", "ar": "شبه يدوي — Excel/Word، يُرسَل بـ PDF، غير متكامل مع ZATCA", "score": 1 },
            "C": { "en": "ZATCA Phase 1 compliant e-invoicing (basic Fatoorah)", "ar": "فاتورة إلكترونية متوافقة مع ZATCA المرحلة الأولى (فاتورة أساسية)", "score": 2 },
            "D": { "en": "ZATCA Phase 2 compliant (integration mode) with automated tax reporting", "ar": "متوافق مع ZATCA المرحلة الثانية (وضع التكامل) مع تقارير ضريبية آلية", "score": 3 }
          }
        },

        {
          "id": "FIN-003",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is project cost tracking managed (budget vs. actual)?",
          "label_ar": "كيف تتم إدارة تتبع تكاليف المشروع (الميزانية مقابل الفعلي)؟",
          "options": {
            "A": { "en": "No formal cost tracking — end-of-project reconciliation only", "ar": "لا تتبع رسمي للتكاليف — تسوية نهاية المشروع فقط", "score": 0 },
            "B": { "en": "Excel cost sheets updated weekly", "ar": "جداول تكاليف في Excel تُحدَّث أسبوعياً", "score": 1 },
            "C": { "en": "Project accounting module linked to GL", "ar": "وحدة محاسبة مشاريع مرتبطة بالأستاذ العام", "score": 2 },
            "D": { "en": "Real-time cost control with earned value analysis and AI cost overrun prediction", "ar": "تحكم آني في التكاليف مع تحليل القيمة المكتسبة وتوقع تجاوز التكاليف بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "FIN-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is cash flow monitored and planned across projects?",
          "label_ar": "كيف يتم رصد التدفق النقدي والتخطيط له عبر المشاريع؟",
          "options": {
            "A": { "en": "Checked when cash is running low — reactive only", "ar": "يُتحقق منه عندما ينخفض النقد — تفاعلي فقط", "score": 0 },
            "B": { "en": "Monthly cash statement from accountant", "ar": "كشف نقدي شهري من المحاسب", "score": 1 },
            "C": { "en": "Rolling 3-month cash flow forecast in spreadsheet", "ar": "توقع تدفق نقدي متجدد لـ 3 أشهر في جداول بيانات", "score": 2 },
            "D": { "en": "AI-driven cash flow forecasting across all projects with payment milestone integration", "ar": "توقع التدفق النقدي بالذكاء الاصطناعي عبر كل المشاريع مع تكامل أهداف الدفع", "score": 3 }
          }
        },

        {
          "id": "FIN-005",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are payroll and subcontractor payments processed?",
          "label_ar": "كيف تتم معالجة الرواتب ومدفوعات المقاولين الفرعيين؟",
          "options": {
            "A": { "en": "Manual cash payments with no digital record", "ar": "مدفوعات نقدية يدوية بدون سجل رقمي", "score": 0 },
            "B": { "en": "Bank transfers calculated manually in Excel", "ar": "تحويلات بنكية تُحسَب يدوياً في Excel", "score": 1 },
            "C": { "en": "Payroll system integrated with attendance data", "ar": "نظام رواتب متكامل مع بيانات الحضور", "score": 2 },
            "D": { "en": "Automated payroll + WPS-compliant with subcontractor milestone-based payment automation", "ar": "رواتب آلية + متوافق مع WPS مع أتمتة دفع المقاولين الفرعيين القائمة على المراحل", "score": 3 }
          }
        },

        {
          "id": "FIN-006",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How often do project managers have visibility into current project financial status?",
          "label_ar": "كم مرة يتمتع مديرو المشاريع برؤية الوضع المالي الحالي للمشروع؟",
          "options": {
            "A": { "en": "Only at end of project — no ongoing visibility", "ar": "في نهاية المشروع فقط — لا رؤية مستمرة", "score": 0 },
            "B": { "en": "Monthly from finance department", "ar": "شهرياً من قسم المالية", "score": 1 },
            "C": { "en": "Weekly dashboard or report from accounting system", "ar": "لوحة تحكم أسبوعية أو تقرير من نظام المحاسبة", "score": 2 },
            "D": { "en": "Real-time cost dashboard accessible on mobile and desktop by all stakeholders", "ar": "لوحة تحكم تكاليف آنية متاحة على الموبايل والحاسوب لجميع أصحاب المصلحة", "score": 3 }
          }
        },

        {
          "id": "FIN-007",
          "sectors": ["ALL"],
          "type": "yn_conditional",
          "label_en": "Are you currently compliant with ZATCA Phase 2 (integration mode e-invoicing)?",
          "label_ar": "هل أنتم حالياً متوافقون مع ZATCA المرحلة الثانية (وضع تكامل الفوترة الإلكترونية)؟",
          "yes_score": 3,
          "no_score": 0,
          "conditional_if": "no",
          "follow_up": {
            "id": "FIN-007a",
            "type": "mcq",
            "label_en": "What is your current ZATCA compliance status?",
            "label_ar": "ما وضع امتثالكم الحالي لـ ZATCA؟",
            "options": {
              "A": { "en": "No e-invoicing at all", "ar": "لا فواتير إلكترونية على الإطلاق", "score": 0 },
              "B": { "en": "Phase 1 only (generation mode)", "ar": "المرحلة الأولى فقط (وضع الإنشاء)", "score": 1 },
              "C": { "en": "Phase 2 implementation in progress", "ar": "تنفيذ المرحلة الثانية قيد التقدم", "score": 2 },
              "D": { "en": "Phase 2 compliant but not integrated with operations", "ar": "متوافق مع المرحلة الثانية لكن غير متكامل مع العمليات", "score": 2 }
            }
          }
        },

        {
          "id": "FIN-008",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are financial reports produced for management?",
          "label_ar": "كيف تُنتَج التقارير المالية للإدارة؟",
          "options": {
            "A": { "en": "Manually compiled by accountant from paper records", "ar": "يُجمِّعها المحاسب يدوياً من السجلات الورقية", "score": 0 },
            "B": { "en": "Excel-based monthly report — requires 2–3 days to prepare", "ar": "تقرير شهري في Excel — يستغرق إعداده ٢–٣ أيام", "score": 1 },
            "C": { "en": "Automated reports from accounting system on demand", "ar": "تقارير آلية من نظام المحاسبة عند الطلب", "score": 2 },
            "D": { "en": "Live CFO/CEO dashboard with drill-down and AI anomaly detection", "ar": "لوحة تحكم CFO/CEO مباشرة مع التفاصيل وكشف الشذوذ بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "FIN-009",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "What is your current average cost overrun percentage across projects, and what do you believe is the primary cause?",
          "label_ar": "ما متوسط نسبة تجاوز التكاليف الحالية عبر مشاريعكم، وما سببها الرئيسي في اعتقادكم؟",
          "scoring_rubric": {
            "0": "Cannot answer — no cost tracking exists",
            "1": "Knows overruns happen but cannot quantify",
            "2": "Approximate % known with general causes identified",
            "3": "Specific % with root-cause data — high AI prediction value"
          }
        }

      ]
    },

    "executive_management": {
      "label_en": "Executive Management",
      "label_ar": "الإدارة العليا",
      "weight": 0.10,
      "questions": [

        {
          "id": "EXEC-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How does the CEO/GM access a live view of the company's overall performance?",
          "label_ar": "كيف يطلع المدير التنفيذي/العام على رؤية مباشرة للأداء الإجمالي للشركة؟",
          "options": {
            "A": { "en": "Through meetings and verbal updates from managers", "ar": "عبر الاجتماعات والتحديثات الشفهية من المدراء", "score": 0 },
            "B": { "en": "Weekly/monthly email reports from department heads", "ar": "تقارير أسبوعية/شهرية بالبريد الإلكتروني من رؤساء الأقسام", "score": 1 },
            "C": { "en": "Consolidated dashboard updated daily", "ar": "لوحة تحكم موحدة تُحدَّث يومياً", "score": 2 },
            "D": { "en": "Real-time AI-powered executive cockpit — all KPIs, alerts, and predictions in one view", "ar": "قمرة قيادة تنفيذية بالذكاء الاصطناعي آنياً — كل KPIs والتنبيهات والتوقعات في رؤية واحدة", "score": 3 }
          }
        },

        {
          "id": "EXEC-002",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are strategic decisions typically made?",
          "label_ar": "كيف تُتَّخَذ القرارات الاستراتيجية عادةً؟",
          "options": {
            "A": { "en": "Intuition and experience of senior leadership", "ar": "حدس وخبرة القيادة العليا", "score": 0 },
            "B": { "en": "Financial reports and market observation", "ar": "التقارير المالية ومراقبة السوق", "score": 1 },
            "C": { "en": "Data from multiple systems analyzed before major decisions", "ar": "بيانات من أنظمة متعددة تُحلَّل قبل القرارات الكبرى", "score": 2 },
            "D": { "en": "AI-assisted scenario modeling and recommendation engine", "ar": "نمذجة سيناريوهات بالذكاء الاصطناعي ومحرك توصيات", "score": 3 }
          }
        },

        {
          "id": "EXEC-003",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How mature is your organizational KPI framework?",
          "label_ar": "ما مستوى نضج إطار مؤشرات الأداء الرئيسية (KPI) لديكم؟",
          "options": {
            "A": { "en": "No formal KPIs defined", "ar": "لا KPIs رسمية محددة", "score": 0 },
            "B": { "en": "KPIs defined but tracked manually and inconsistently", "ar": "KPIs محددة لكن تُتتبَّع يدوياً وبشكل متقطع", "score": 1 },
            "C": { "en": "KPIs tracked systematically with monthly reviews", "ar": "KPIs تُتتبَّع بشكل منهجي مع مراجعات شهرية", "score": 2 },
            "D": { "en": "Real-time KPI monitoring with automated alerts and trend analysis", "ar": "مراقبة KPI آنية مع تنبيهات آلية وتحليل الاتجاهات", "score": 3 }
          }
        },

        {
          "id": "EXEC-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are human resources performance and development managed?",
          "label_ar": "كيف تتم إدارة أداء الموارد البشرية وتطويرها؟",
          "options": {
            "A": { "en": "Annual salary review only — no performance process", "ar": "مراجعة راتب سنوية فقط — لا عملية أداء", "score": 0 },
            "B": { "en": "Annual performance review on paper or basic form", "ar": "مراجعة أداء سنوية على ورق أو نموذج بسيط", "score": 1 },
            "C": { "en": "Digital HRMS with performance cycles and learning paths", "ar": "نظام HRMS رقمي مع دورات أداء ومسارات تعلم", "score": 2 },
            "D": { "en": "AI-powered talent analytics — performance prediction, retention risk, and succession planning", "ar": "تحليلات مواهب بالذكاء الاصطناعي — توقع الأداء ومخاطر الاستبقاء والتخطيط للخلافة", "score": 3 }
          }
        },

        {
          "id": "EXEC-005",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What is the executive team's current appetite and vision for digital transformation?",
          "label_ar": "ما شهية الفريق التنفيذي ورؤيته الحالية للتحول الرقمي؟",
          "options": {
            "A": { "en": "Resistant — 'if it ain't broke, don't fix it' mindset", "ar": "مقاوم — عقلية 'إذا لم يكن مكسوراً فلا تصلحه'", "score": 0 },
            "B": { "en": "Open but passive — waiting for someone else to drive it", "ar": "منفتح لكن سلبي — ينتظر من يقوده", "score": 1 },
            "C": { "en": "Active sponsor — leadership visibly committed but lacks execution plan", "ar": "راعٍ نشط — القيادة ملتزمة ظاهرياً لكن تفتقر لخطة تنفيذ", "score": 2 },
            "D": { "en": "CEO-driven DX mandate with budget, team, and strategic roadmap in place", "ar": "تفويض رقمي بقيادة CEO مع ميزانية وفريق وخارطة طريق استراتيجية", "score": 3 }
          }
        },

        {
          "id": "EXEC-006",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is corporate governance and board reporting handled?",
          "label_ar": "كيف تتم إدارة حوكمة الشركة وتقارير مجلس الإدارة؟",
          "options": {
            "A": { "en": "Informal — owner/GM makes all decisions independently", "ar": "غير رسمي — المالك/المدير العام يتخذ كل القرارات باستقلالية", "score": 0 },
            "B": { "en": "Periodic meetings with manually prepared packs", "ar": "اجتماعات دورية مع حزم معدة يدوياً", "score": 1 },
            "C": { "en": "Structured board meetings with formal reporting framework", "ar": "اجتماعات مجلس منظمة مع إطار تقارير رسمي", "score": 2 },
            "D": { "en": "Digital governance platform with automated board pack generation and decision tracking", "ar": "منصة حوكمة رقمية مع إنشاء حزم مجلس آلية وتتبع القرارات", "score": 3 }
          }
        },

        {
          "id": "EXEC-007",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "What is the one metric that, if you could track it in real time, would most change how you run the business?",
          "label_ar": "ما المقياس الواحد الذي لو أمكنكم تتبعه آنياً سيغير طريقة إدارتكم للأعمال أكثر من أي شيء آخر؟",
          "scoring_rubric": {
            "0": "Cannot identify a single metric — low data maturity",
            "1": "Metric identified but currently untracked",
            "2": "Metric tracked inconsistently — clear digital opportunity",
            "3": "Metric well-defined with data challenges articulated — prime AI dashboard candidate"
          }
        }

      ]
    },

    "reporting": {
      "label_en": "Reporting",
      "label_ar": "التقارير",
      "weight": 0.10,
      "questions": [

        {
          "id": "REP-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How long does it take to prepare the weekly/monthly management report?",
          "label_ar": "كم من الوقت يستغرق إعداد التقرير الإداري الأسبوعي/الشهري؟",
          "options": {
            "A": { "en": "3+ days — significant manual effort", "ar": "٣+ أيام — جهد يدوي كبير", "score": 0 },
            "B": { "en": "1–2 days — collecting from multiple departments", "ar": "١–٢ يومين — جمع من أقسام متعددة", "score": 1 },
            "C": { "en": "Half a day — mostly automated with some manual assembly", "ar": "نصف يوم — شبه آلي مع بعض التجميع اليدوي", "score": 2 },
            "D": { "en": "Real-time — auto-generated and always up to date", "ar": "آني — يُنشَأ تلقائياً ومحدَّث دائماً", "score": 3 }
          }
        },

        {
          "id": "REP-002",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What format are management reports delivered in?",
          "label_ar": "بأي صيغة تُسلَّم التقارير الإدارية؟",
          "options": {
            "A": { "en": "Verbal update in meeting", "ar": "تحديث شفهي في اجتماع", "score": 0 },
            "B": { "en": "PDF or PowerPoint emailed to management", "ar": "PDF أو PowerPoint يُرسَل بالبريد الإلكتروني للإدارة", "score": 1 },
            "C": { "en": "Interactive digital dashboard accessible on demand", "ar": "لوحة تحكم رقمية تفاعلية متاحة عند الطلب", "score": 2 },
            "D": { "en": "AI-narrated reports with natural language summaries and predictive insights", "ar": "تقارير بسرد الذكاء الاصطناعي مع ملخصات بلغة طبيعية ورؤى تنبؤية", "score": 3 }
          }
        },

        {
          "id": "REP-003",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How are client/stakeholder progress reports prepared?",
          "label_ar": "كيف تُعَدّ تقارير التقدم للعملاء/أصحاب المصلحة؟",
          "options": {
            "A": { "en": "No formal client reports — verbal updates only", "ar": "لا تقارير رسمية للعملاء — تحديثات شفهية فقط", "score": 0 },
            "B": { "en": "Manual Word/PowerPoint prepared per project milestone", "ar": "Word/PowerPoint يدوي يُعَدّ عند كل حدث رئيسي", "score": 1 },
            "C": { "en": "Template-based reports auto-populated with data from systems", "ar": "تقارير قائمة على قوالب تُملأ تلقائياً ببيانات من الأنظمة", "score": 2 },
            "D": { "en": "Client portal with live project visibility and automated milestone notifications", "ar": "بوابة عميل برؤية مباشرة للمشروع وإشعارات آلية للمراحل", "score": 3 }
          }
        },

        {
          "id": "REP-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is historical project data accessed for future project estimations?",
          "label_ar": "كيف يتم الوصول إلى بيانات المشاريع التاريخية لتقدير المشاريع المستقبلية؟",
          "options": {
            "A": { "en": "Relying on key personnel memory", "ar": "الاعتماد على ذاكرة الموظفين الرئيسيين", "score": 0 },
            "B": { "en": "Searching through old Excel files and email archives", "ar": "البحث في ملفات Excel القديمة وأرشيفات البريد الإلكتروني", "score": 1 },
            "C": { "en": "Structured project database with searchable records", "ar": "قاعدة بيانات مشاريع منظمة بسجلات قابلة للبحث", "score": 2 },
            "D": { "en": "AI-powered historical analysis engine that auto-benchmarks and improves estimates", "ar": "محرك تحليل تاريخي بالذكاء الاصطناعي يضع معايير تلقائية ويحسن التقديرات", "score": 3 }
          }
        },

        {
          "id": "REP-005",
          "sectors": ["INFRA", "GOV"],
          "type": "mcq",
          "label_en": "How are government and regulatory compliance reports submitted?",
          "label_ar": "كيف تُقدَّم تقارير الامتثال الحكومية والتنظيمية؟",
          "options": {
            "A": { "en": "Manually prepared and physically submitted", "ar": "مُعَدَّة يدوياً ومُقدَّمة جسدياً", "score": 0 },
            "B": { "en": "Email submissions with manual data compilation", "ar": "تقديم بالبريد الإلكتروني مع جمع بيانات يدوي", "score": 1 },
            "C": { "en": "Digital portal submission with some data pulled from systems", "ar": "تقديم عبر بوابة رقمية مع بعض البيانات المسحوبة من الأنظمة", "score": 2 },
            "D": { "en": "Automated regulatory reporting with direct government system integration", "ar": "تقارير تنظيمية آلية مع تكامل مباشر مع أنظمة حكومية", "score": 3 }
          }
        },

        {
          "id": "REP-006",
          "sectors": ["HEALTH"],
          "type": "mcq",
          "label_en": "How are clinical outcomes and quality metrics tracked and reported?",
          "label_ar": "كيف يتم تتبع النتائج السريرية ومقاييس الجودة والإبلاغ عنها؟",
          "options": {
            "A": { "en": "No systematic outcome tracking", "ar": "لا تتبع منهجي للنتائج", "score": 0 },
            "B": { "en": "Manual case review and ad-hoc statistics", "ar": "مراجعة الحالات اليدوية وإحصائيات عشوائية", "score": 1 },
            "C": { "en": "Quality dashboard from EMR data with monthly review", "ar": "لوحة تحكم الجودة من بيانات EMR مع مراجعة شهرية", "score": 2 },
            "D": { "en": "AI-powered clinical analytics with real-time outcome monitoring and benchmarking", "ar": "تحليلات سريرية بالذكاء الاصطناعي مع مراقبة آنية للنتائج والمقارنة المعيارية", "score": 3 }
          }
        },

        {
          "id": "REP-007",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "What report do your leadership or clients ask for most frequently that currently takes too long to produce?",
          "label_ar": "ما التقرير الذي تطلبه قيادتكم أو عملاؤكم بشكل متكرر ويستغرق حالياً وقتاً طويلاً جداً لإنتاجه؟",
          "scoring_rubric": {
            "0": "No specific report identified",
            "1": "Report identified but no time baseline",
            "2": "Report identified with approximate production time",
            "3": "Report identified with time, effort, and error-rate data — high automation value"
          }
        }

      ]
    },

    "gov_compliance": {
      "label_en": "Government Compliance",
      "label_ar": "الامتثال الحكومي",
      "weight": 0.10,
      "questions": [

        {
          "id": "GOV-001",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "What is your current Saudization (Nitaqat) percentage and tier?",
          "label_ar": "ما نسبة السعودة (نطاقات) الحالية لديكم والشريحة التي تنتمون إليها؟",
          "options": {
            "A": { "en": "Unknown — not actively tracked", "ar": "غير معروف — لا يُتتبَّع بشكل فعال", "score": 0 },
            "B": { "en": "Known but in Yellow or Red zone", "ar": "معروف لكن في المنطقة الصفراء أو الحمراء", "score": 1 },
            "C": { "en": "Green zone — compliant and monitored manually", "ar": "المنطقة الخضراء — ملتزم ومُراقَب يدوياً", "score": 2 },
            "D": { "en": "Platinum zone with automated Nitaqat monitoring and workforce planning", "ar": "منطقة البلاتين مع مراقبة نطاقات آلية وتخطيط القوى العاملة", "score": 3 }
          }
        },

        {
          "id": "GOV-002",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "Are you registered and active on Etimad (government procurement platform)?",
          "label_ar": "هل أنتم مسجلون ونشطون على اعتماد (منصة المشتريات الحكومية)؟",
          "options": {
            "A": { "en": "Not registered on Etimad", "ar": "غير مسجل في اعتماد", "score": 0 },
            "B": { "en": "Registered but rarely used / manual monitoring", "ar": "مسجل لكن نادراً ما يُستخدَم / مراقبة يدوية", "score": 1 },
            "C": { "en": "Active on Etimad with regular tender participation", "ar": "نشط في اعتماد مع مشاركة منتظمة في المناقصات", "score": 2 },
            "D": { "en": "Integrated Etimad feed with AI-powered tender matching and bid preparation", "ar": "تغذية اعتماد متكاملة مع مطابقة مناقصات بالذكاء الاصطناعي وإعداد العطاء", "score": 3 }
          }
        },

        {
          "id": "GOV-003",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "What is your current IKTVA (In-Kingdom Total Value Add) compliance status?",
          "label_ar": "ما وضع الامتثال الحالي لـ IKTVA (إجمالي القيمة المضافة داخل المملكة)؟",
          "options": {
            "A": { "en": "Not aware of IKTVA requirements", "ar": "غير مدرك لمتطلبات IKTVA", "score": 0 },
            "B": { "en": "Aware but not formally calculating IKTVA score", "ar": "مدرك لكن لا يحسب درجة IKTVA رسمياً", "score": 1 },
            "C": { "en": "Formally tracking IKTVA with annual reporting", "ar": "تتبع رسمي لـ IKTVA مع تقارير سنوية", "score": 2 },
            "D": { "en": "Real-time IKTVA dashboard integrated with procurement and HR data", "ar": "لوحة تحكم IKTVA آنية متكاملة مع بيانات المشتريات والموارد البشرية", "score": 3 }
          }
        },

        {
          "id": "GOV-004",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is GOSI (General Organization for Social Insurance) compliance managed?",
          "label_ar": "كيف تتم إدارة الامتثال لـ GOSI (المؤسسة العامة للتأمينات الاجتماعية)؟",
          "options": {
            "A": { "en": "Handled manually by accountant — often late", "ar": "يتولاها المحاسب يدوياً — غالباً متأخرة", "score": 0 },
            "B": { "en": "Managed via GOSI portal manually each month", "ar": "تُدار عبر بوابة GOSI يدوياً كل شهر", "score": 1 },
            "C": { "en": "HR system synced with GOSI portal with manual review step", "ar": "نظام HR متزامن مع بوابة GOSI مع خطوة مراجعة يدوية", "score": 2 },
            "D": { "en": "Fully automated GOSI submissions integrated with payroll and onboarding", "ar": "تقديمات GOSI آلية بالكامل متكاملة مع الرواتب والتعيين", "score": 3 }
          }
        },

        {
          "id": "GOV-005",
          "sectors": ["ALL"],
          "type": "yn_conditional",
          "label_en": "Are you currently registered or qualified on any government supplier/contractor qualification platform (Jadeer, MOH approved vendor list, etc.)?",
          "label_ar": "هل أنتم مسجلون أو مؤهَّلون حالياً على أي منصة تأهيل للموردين/المقاولين الحكومية (جدير، قوائم الموردين المعتمدين لوزارة الصحة، إلخ)؟",
          "yes_score": 2,
          "no_score": 0,
          "conditional_if": "yes",
          "follow_up": {
            "id": "GOV-005a",
            "type": "mcq",
            "label_en": "How do you manage qualification renewals and compliance updates?",
            "label_ar": "كيف تديرون تجديدات التأهيل وتحديثات الامتثال؟",
            "options": {
              "A": { "en": "Reactively — renew only when expired and rejected", "ar": "تفاعلياً — نجدد فقط عند انتهاء الصلاحية والرفض", "score": 0 },
              "B": { "en": "Manual calendar reminders", "ar": "تذكيرات تقويم يدوية", "score": 1 },
              "C": { "en": "Compliance tracker in spreadsheet with assigned owner", "ar": "متتبع امتثال في جداول بيانات مع مسؤول معيَّن", "score": 2 },
              "D": { "en": "Automated compliance management system with deadline alerts and auto-renewal workflows", "ar": "نظام إدارة امتثال آلي مع تنبيهات المواعيد النهائية وسير عمل التجديد التلقائي", "score": 3 }
            }
          }
        },

        {
          "id": "GOV-006",
          "sectors": ["INFRA", "REAL", "GOV"],
          "type": "mcq",
          "label_en": "How is Municipality (Baladi) compliance managed for construction projects?",
          "label_ar": "كيف تتم إدارة الامتثال البلدي (بلدي) لمشاريع البناء؟",
          "options": {
            "A": { "en": "Handled manually by a dedicated PRO — no digital tracking", "ar": "يتولاه مسؤول علاقات حكومية يدوياً — لا تتبع رقمي", "score": 0 },
            "B": { "en": "Spreadsheet tracking of permits and expiry dates", "ar": "تتبع جداول بيانات للتصاريح وتواريخ الانتهاء", "score": 1 },
            "C": { "en": "Digital permit management with calendar alerts", "ar": "إدارة تصاريح رقمية مع تنبيهات تقويمية", "score": 2 },
            "D": { "en": "Integrated Baladi/municipality platform with AI-assisted application tracking", "ar": "منصة بلدي/بلدية متكاملة مع تتبع الطلبات بالذكاء الاصطناعي", "score": 3 }
          }
        },

        {
          "id": "GOV-007",
          "sectors": ["HEALTH"],
          "type": "mcq",
          "label_en": "How is MOH (Ministry of Health) licensing and accreditation managed?",
          "label_ar": "كيف تتم إدارة ترخيص وزارة الصحة والاعتماد؟",
          "options": {
            "A": { "en": "Manually managed by admin team with physical documents", "ar": "تديرها فريق الإدارة يدوياً بمستندات ورقية", "score": 0 },
            "B": { "en": "Spreadsheet tracking of license categories and renewals", "ar": "تتبع جداول بيانات لفئات الترخيص والتجديدات", "score": 1 },
            "C": { "en": "Digital compliance calendar with MOH portal account", "ar": "تقويم امتثال رقمي مع حساب بوابة وزارة الصحة", "score": 2 },
            "D": { "en": "Integrated regulatory compliance system with automated renewal workflows and accreditation tracking", "ar": "نظام امتثال تنظيمي متكامل مع سير عمل تجديد آلي وتتبع الاعتماد", "score": 3 }
          }
        },

        {
          "id": "GOV-008",
          "sectors": ["ALL"],
          "type": "mcq",
          "label_en": "How is Vision 2030 compliance documented for client reporting or tender submissions?",
          "label_ar": "كيف يتم توثيق الامتثال لرؤية ٢٠٣٠ لتقارير العملاء أو تقديم العطاءات؟",
          "options": {
            "A": { "en": "Not formally documented — verbal claims only", "ar": "غير موثق رسمياً — ادعاءات شفهية فقط", "score": 0 },
            "B": { "en": "Prepared case-by-case when required for tenders", "ar": "يُعَدّ لكل حالة عند الحاجة للمناقصات", "score": 1 },
            "C": { "en": "Standard company profile with Vision 2030 alignment documented", "ar": "ملف تعريف شركة قياسي مع توثيق التوافق مع رؤية ٢٠٣٠", "score": 2 },
            "D": { "en": "Live Vision 2030 KPI dashboard integrated with operations data for instant reporting", "ar": "لوحة تحكم KPI رؤية ٢٠٣٠ مباشرة متكاملة مع بيانات العمليات للتقارير الفورية", "score": 3 }
          }
        },

        {
          "id": "GOV-009",
          "sectors": ["ALL"],
          "type": "open",
          "label_en": "Which government compliance area causes the most friction or risk for your business today? What is the worst-case scenario if it fails?",
          "label_ar": "أي مجال من مجالات الامتثال الحكومي يسبب أكبر احتكاك أو مخاطر لأعمالكم اليوم؟ ما السيناريو الأسوأ إذا فشلتم في ذلك؟",
          "scoring_rubric": {
            "0": "Cannot identify specific compliance risks",
            "1": "Risk identified but unquantified",
            "2": "Risk identified with approximate business impact",
            "3": "Specific risk with quantified financial/reputational impact — high-urgency compliance automation need"
          }
        }

      ]
    }

  }
}
```

---

## Dev Notes | ملاحظات للمطور

### Scoring Engine Logic | منطق محرك التسجيل

```
For each dimension:
  dimension_score = (sum of all answered question scores) / (max_possible_score for answered questions) * 100

Overall maturity score = weighted average of all 7 dimension scores using dimension.weight values

Maturity bands:
  0–25   → Stage 0: Paper-Based (الورق)
  26–50  → Stage 1: Basic Digital (الرقمنة الأولية)
  51–75  → Stage 2: Integrated Digital (الرقمنة المتكاملة)
  76–100 → Stage 3: AI-Ready / AI-Native (جاهز للذكاء الاصطناعي)
```

### Conditional Logic | المنطق الشرطي

```
For yn_conditional questions:
  IF answer == "yes" AND conditional_if == "yes" → show follow_up question
  IF answer == "no" AND conditional_if == "no" → show follow_up question
  ELSE → skip follow_up, use base yes_score or no_score
```

### Sector Filtering | تصفية القطاعات

```
On assessment start → assessor selects one of: INFRA | HEALTH | REAL | GOV
Question bank filters to: sectors includes "ALL" OR sectors includes selected_sector
Questions not matching the sector are hidden and excluded from scoring
```

### Question ID Convention | اصطلاح معرف السؤال

```
OPS-XXX  → Operations
PWF-XXX  → Project Workflow
SITE-XXX → Site Management
FIN-XXX  → Finance
EXEC-XXX → Executive Management
REP-XXX  → Reporting
GOV-XXX  → Government Compliance
Sub-questions: [parent_id][a/b/c] (e.g. OPS-003a)
```

### PDF Report Output Fields | حقول مخرج تقرير PDF

The JSON output of a completed assessment should include:

```json
{
  "company_name": "",
  "sector": "",
  "assessment_date": "",
  "assessor": "",
  "dimension_scores": {
    "operations": { "score": 0, "max": 100, "stage": "" },
    "project_workflow": { "score": 0, "max": 100, "stage": "" },
    "site_management": { "score": 0, "max": 100, "stage": "" },
    "finance": { "score": 0, "max": 100, "stage": "" },
    "executive_management": { "score": 0, "max": 100, "stage": "" },
    "reporting": { "score": 0, "max": 100, "stage": "" },
    "gov_compliance": { "score": 0, "max": 100, "stage": "" }
  },
  "overall_maturity_score": 0,
  "overall_stage": "",
  "ai_opportunity_flags": [],
  "priority_gaps": [],
  "recommended_modules": [],
  "transformation_roadmap": {}
}
```

---

## Version History | سجل الإصدارات

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-04-28 | Mohamed Kamel | Initial question bank — 196 questions across 7 dimensions × 4 sectors |

---

*InfraAI Digital Solutions · Beyond Digital Transformation · Confidential*
