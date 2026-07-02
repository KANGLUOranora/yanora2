import {
  ArrowRight,
  Brain,
  CalendarCheck,
  Globe2,
  HeartPulse,
  Home,
  Building2,
  MapPinned,
  Monitor,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

const hospitalImages = [
  '/Gemini_Generated_Image_pf7kappf7kappf7k.png',
  '/Gemini_Generated_Image_lv6nndlv6nndlv6n.png',
  '/Gemini_Generated_Image_a16ssqa16ssqa16s.png'
];

function HospitalPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const copy = {
    heroTitle: isZh ? 'YANORA 医院网络' : 'YANORA Medical Network',
    heroSub: isZh ? 'Medical Network' : '医院网络',
    heroLead: isZh
      ? '以面部结构分析为入口，连接适合的医生、机构与术后服务。每一次推荐都先回到问题本身，再匹配真正擅长处理该问题的人。'
      : 'A structured medical network that connects facial analysis, suitable specialists, institutions, and recovery support. Every recommendation starts with the concern itself.',
    principle: isZh
      ? '医院不是一张名单，而是一套判断系统。我们先拆解结构问题，再把它交给更适合的专项经验。'
      : 'A hospital network is not a list. It is a judgment system that separates structural concerns before matching them with focused medical experience.',
    principleEn: isZh
      ? 'Not a directory, but a clinical matching logic.'
      : '不是目录，而是临床匹配逻辑。',
    matrixTitle: isZh ? '先判断问题，再选择机构。' : 'Define the concern before choosing the institution.',
    networkTitle: isZh ? '三类机构节点，组成一个连续医疗路径。' : 'Three institution nodes, one continuous medical pathway.',
    academicTitle: isZh
      ? '通过病例复盘、国际交流和数据化分析，让审美判断保持稳定。'
      : 'Case review, international exchange, and data analysis keep aesthetic judgment consistent.',
    journeyTitle: isZh
      ? '从线上评估到术后恢复，行程由同一个团队持续协调。'
      : 'From online assessment to recovery, one team coordinates the full journey.'
  };

  const specialties = [
    {
      icon: Sparkles,
      number: '01',
      zh: '拉提与抗衰策略',
      en: 'Lift & Aging Strategy',
      descZh: '围绕筋膜层次、软组织下移和皮肤松弛程度，判断是否需要拉皮、微创或联合方案。',
      descEn: 'SMAS layers, tissue descent, and laxity are reviewed before lift or combined planning.'
    },
    {
      icon: ShieldCheck,
      number: '02',
      zh: '轮廓与比例设计',
      en: 'Proportion Planning',
      descZh: '把鼻部、下颌、中面部支撑和五官关系放在同一结构里评估，避免单点改变破坏整体。',
      descEn: 'Nose, jawline, midface support, and feature balance are considered as one structure.'
    },
    {
      icon: Stethoscope,
      number: '03',
      zh: '修复与复杂重建',
      en: 'Revision Medicine',
      descZh: '面向疑难修复、二次调整和复杂结构重建，采用多专项联合会诊路径。',
      descEn: 'Difficult revisions and complex reconstruction cases move through multi-specialist review.'
    }
  ];

  const hospitals = [
    {
      number: '01',
      nameZh: '奇美医疗中心',
      nameEn: 'Qimei Medical Center',
      quoteZh: '专注拉提、筋膜层次与长期抗衰管理，适合需要稳定年轻化路径的顾客。',
      quoteEn: 'Focused on lifting, SMAS structure, and long-term aging management.',
      tagsZh: ['拉提', '筋膜', '抗衰'],
      tagsEn: ['Lift', 'SMAS', 'Aging care'],
      locationZh: '上海静安区',
      locationEn: "Jing'an District, Shanghai",
      image: hospitalImages[0]
    },
    {
      number: '02',
      nameZh: '兴国际美学中心',
      nameEn: 'Xing International Aesthetic Center',
      quoteZh: '擅长自然风格的面部比例与精细化多部位协同，强调保留个人特征。',
      quoteEn: 'Specialized in natural proportion design and refined multi-area planning.',
      tagsZh: ['鼻部', '轮廓', '比例'],
      tagsEn: ['Nose', 'Contour', 'Proportion'],
      locationZh: '上海黄浦区',
      locationEn: 'Huangpu District, Shanghai',
      image: hospitalImages[1]
    },
    {
      number: '03',
      nameZh: '上海修复医学研究所',
      nameEn: 'Shanghai Reconstructive Medical Institute',
      quoteZh: '针对疑难修复和复杂结构问题建立多专项路径，适合需要二次判断的个案。',
      quoteEn: 'Building multi-specialist pathways for difficult revision and complex structure cases.',
      tagsZh: ['修复', '重建', '疑难'],
      tagsEn: ['Revision', 'Rebuild', 'Complex'],
      locationZh: '上海徐汇区',
      locationEn: 'Xuhui District, Shanghai',
      image: hospitalImages[2]
    }
  ];

  const journeySteps = [
    { icon: Monitor, zh: '线上咨询', en: 'Online Consultation', descZh: '安全视频初步评估', descEn: 'Initial assessment via secure video' },
    { icon: Brain, zh: 'AI 面部分析', en: 'AI Analysis', descZh: '结构映射与优先级判断', descEn: 'Structure mapping and priority scoring' },
    { icon: Users, zh: '医生匹配', en: 'Doctor Matching', descZh: '多专项医生联合审阅', descEn: 'Multi-specialist review and assignment' },
    { icon: Home, zh: '抵达服务', en: 'Arrival Service', descZh: '接机与行程协调', descEn: 'Transfer and concierge coordination' },
    { icon: HeartPulse, zh: '医院协同', en: 'Hospital Coordination', descZh: '跨机构预约和沟通', descEn: 'Inter-hospital scheduling and communication' },
    { icon: CalendarCheck, zh: '恢复跟踪', en: 'Recovery Support', descZh: '术后恢复与复诊安排', descEn: 'Post-op monitoring and follow-up care' }
  ];

  return (
    <div className="yanora-hospital-page yanora-hospital-page-v4">
      <Navbar />

      <main>
        <section className="yanora-hospital-v4-hero">
          <div className="yanora-hospital-v4-hero-bg" aria-hidden="true">
            <img src="/Gemini_Generated_Image_bo54dwbo54dwbo54.png" alt="" />
          </div>
          <div className="yanora-hospital-v4-hero-inner">
            <div className="yanora-hospital-v4-hero-copy yanora-hospital-v4-reveal">
              <p className="yanora-hospital-v4-kicker">
                {isZh ? '专项医疗协同系统' : 'Specialist Medical Coordination'}
                <span>{isZh ? 'Specialist Medical Coordination' : '专项医疗协同系统'}</span>
              </p>
              <h1>
                {copy.heroTitle}
                <span>{copy.heroSub}</span>
              </h1>
              <p className="yanora-hospital-v4-lead">{copy.heroLead}</p>
              <div className="yanora-hospital-v4-hero-metrics" aria-label="YANORA medical network metrics">
                <article>
                  <strong>03</strong>
                  <span>{isZh ? '专项机构节点' : 'Specialist nodes'}</span>
                </article>
                <article>
                  <strong>50+</strong>
                  <span>{isZh ? '合作医生' : 'Partner doctors'}</span>
                </article>
                <article>
                  <strong>20k+</strong>
                  <span>{isZh ? '分析案例' : 'Analysis cases'}</span>
                </article>
              </div>
            </div>

            <aside className="yanora-hospital-v4-map yanora-hospital-v4-reveal" aria-label="YANORA clinical network">
              <div className="yanora-hospital-v4-map-top">
                <span>{isZh ? '上海 / 全球协作' : 'Shanghai / Global Partners'}</span>
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="yanora-hospital-v4-map-core">
                <span>YANORA</span>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="yanora-hospital-v4-map-node yanora-hospital-v4-map-node-a">
                <Building2 className="w-4 h-4" />
                <span>{isZh ? '拉提抗衰' : 'Lift Care'}</span>
              </div>
              <div className="yanora-hospital-v4-map-node yanora-hospital-v4-map-node-b">
                <MapPinned className="w-4 h-4" />
                <span>{isZh ? '比例轮廓' : 'Proportion'}</span>
              </div>
              <div className="yanora-hospital-v4-map-node yanora-hospital-v4-map-node-c">
                <ShieldCheck className="w-4 h-4" />
                <span>{isZh ? '修复重建' : 'Revision'}</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="yanora-hospital-v4-principle">
          <div className="yanora-hospital-v4-index">02</div>
          <div className="yanora-hospital-v4-principle-copy yanora-hospital-v4-reveal">
            <span>{isZh ? '选医逻辑' : 'Selection Logic'}</span>
            <h2>{copy.principle}</h2>
            <p>{copy.principleEn}</p>
          </div>
        </section>

        <section className="yanora-hospital-v4-matrix">
          <div className="yanora-hospital-v4-section-head yanora-hospital-v4-reveal">
            <span>03 / {isZh ? '专项矩阵' : 'Specialist Matrix'}</span>
            <h2>{copy.matrixTitle}</h2>
          </div>
          <div className="yanora-hospital-v4-matrix-grid">
            {specialties.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.number} className="yanora-hospital-v4-reveal">
                  <div>
                    <span>{item.number}</span>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3>{isZh ? item.zh : item.en}</h3>
                  <em>{isZh ? item.en : item.zh}</em>
                  <p>{isZh ? item.descZh : item.descEn}</p>
                  <small>{isZh ? item.descEn : item.descZh}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="yanora-hospital-v4-network">
          <div className="yanora-hospital-v4-section-head yanora-hospital-v4-reveal">
            <span>04 / {isZh ? '机构网络' : 'Institution Network'}</span>
            <h2>{copy.networkTitle}</h2>
          </div>

          <div className="yanora-hospital-v4-institutions">
            {hospitals.map((hospital) => (
              <article key={hospital.number} className="yanora-hospital-v4-institution yanora-hospital-v4-reveal">
                <div className="yanora-hospital-v4-institution-media">
                  <img src={hospital.image} alt={isZh ? hospital.nameZh : hospital.nameEn} />
                  <span>{hospital.number}</span>
                </div>
                <div className="yanora-hospital-v4-institution-copy">
                  <small>{isZh ? hospital.locationZh : hospital.locationEn}</small>
                  <h3>{isZh ? hospital.nameZh : hospital.nameEn}</h3>
                  <em>{isZh ? hospital.nameEn : hospital.nameZh}</em>
                  <p>{isZh ? hospital.quoteZh : hospital.quoteEn}</p>
                  <p className="yanora-hospital-v4-secondary">{isZh ? hospital.quoteEn : hospital.quoteZh}</p>
                  <div>
                    {(isZh ? hospital.tagsZh : hospital.tagsEn).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="yanora-hospital-v4-academic">
          <div className="yanora-hospital-v4-academic-copy yanora-hospital-v4-reveal">
            <span>05 / {isZh ? '学术联动' : 'Academic Exchange'}</span>
            <h2>{copy.academicTitle}</h2>
            <p>
              {isZh
                ? '每个合作机构被放进统一的病例语言、审阅标准和术后反馈系统里，形成可追踪的医疗协同。'
                : 'Every partner institution works within shared case language, review standards, and recovery feedback.'}
            </p>
          </div>
          <div className="yanora-hospital-v4-academic-media yanora-hospital-v4-reveal">
            <img src="/map.png" alt="YANORA partner network map" />
          </div>
          <div className="yanora-hospital-v4-metrics">
            {[
              ['12', isZh ? '来源国家' : 'Source countries'],
              ['98%', isZh ? '满意度' : 'Satisfaction'],
              ['24h', isZh ? '协调响应' : 'Coordination response']
            ].map(([value, label]) => (
              <article key={label} className="yanora-hospital-v4-reveal">
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="yanora-hospital-v4-journey">
          <div className="yanora-hospital-v4-section-head yanora-hospital-v4-reveal">
            <span>06 / {isZh ? '完整行程' : 'Complete Journey'}</span>
            <h2>{copy.journeyTitle}</h2>
          </div>
          <div className="yanora-hospital-v4-journey-line">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.en} className="yanora-hospital-v4-reveal">
                  <Icon className="w-5 h-5" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{isZh ? step.zh : step.en}</h3>
                  <em>{isZh ? step.en : step.zh}</em>
                  <p>{isZh ? step.descZh : step.descEn}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HospitalPage;
