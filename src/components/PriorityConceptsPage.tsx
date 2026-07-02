const concepts = [
  {
    title: '01 Clinical Scan',
    description: '偏医学扫描：结构分析、网格、深蓝判断区，适合强调专业诊断。',
    src: '/priority-concept-01-clinical-scan.svg'
  },
  {
    title: '02 Glass Console',
    description: '偏冷灰控制台：更像系统面板，适合保留侧滑交互和流程感。',
    src: '/priority-concept-02-glass-console.svg'
  },
  {
    title: '03 Editorial Layer',
    description: '偏高级编辑视觉：图片更强，适合做品牌感更强的页面段落。',
    src: '/priority-concept-03-editorial-layer.svg'
  }
];

export default function PriorityConceptsPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-8 md:px-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <p className="text-xs tracking-[0.32em] mb-4" style={{ color: '#6F8998' }}>YANORA DESIGN CONCEPTS</p>
          <h1 className="text-2xl md:text-4xl font-light leading-tight" style={{ color: '#1C2B3A' }}>
            Priority section visual directions
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {concepts.map((concept) => (
            <section key={concept.title} className="border bg-white" style={{ borderColor: '#DDE5EC' }}>
              <div className="p-4 md:p-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-2" style={{ borderColor: '#DDE5EC' }}>
                <div>
                  <h2 className="text-lg md:text-xl font-light" style={{ color: '#1C2B3A' }}>{concept.title}</h2>
                  <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{concept.description}</p>
                </div>
              </div>
              <img src={concept.src} alt={concept.title} className="w-full h-auto block" />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
