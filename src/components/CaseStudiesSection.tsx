import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface CaseStudy {
  id: string;
  before_image_url: string;
  after_image_url: string;
  title?: string;
  category?: string;
}

interface CaseTile {
  id: string;
  before: string;
  after: string;
  title: string;
  category: string;
}

const fallbackCases: CaseTile[] = [
  {
    id: 'local-1',
    before: '/yourface/before.png',
    after: '/yourface/after.png',
    title: 'Facial Proportion',
    category: 'Contour refinement'
  },
  {
    id: 'local-2',
    before: '/choose/1.jpg',
    after: '/choose/2.jpg',
    title: 'Facial Balance',
    category: 'Face-first planning'
  },
  {
    id: 'local-3',
    before: '/nose/00afd0b54910a9b6108263ef92983555.jpg',
    after: '/nose/075396851531cb3d8f8820559f7c29e8.jpg',
    title: 'Nasal Structure',
    category: 'Profile harmony'
  },
  {
    id: 'local-4',
    before: '/smaslift/SaveClip.App_641219921_17878533450489633_7614637556120391857_n.jpg',
    after: '/smaslift/SaveClip.App_641364754_17878533462489633_5350058254477572837_n.jpg',
    title: 'Soft Tissue Lift',
    category: 'Youthful support'
  },
  {
    id: 'local-5',
    before: '/nose/2ac0b0e6dad8f9b7fe78a012030f3c42.jpg',
    after: '/nose/9283f8549223b7615dc96b4db3382b81.jpg',
    title: 'Profile Line',
    category: 'Natural transition'
  },
  {
    id: 'local-6',
    before: '/smaslift/SaveClip.App_650752583_17881010850489633_7566611613369091503_n.jpg',
    after: '/smaslift/SaveClip.App_651175478_17881010841489633_1195500437334573805_n.jpg',
    title: 'Lift Result',
    category: 'Structural tightening'
  }
];

function CaseStudiesSection() {
  const { t } = useLanguage();
  const [cases, setCases] = useState<CaseStudy[]>([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('id, before_image_url, after_image_url, title, category')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  const caseTiles = useMemo<CaseTile[]>(() => {
    if (cases.length === 0) return fallbackCases;

    return cases.map((caseStudy, index) => ({
      id: caseStudy.id,
      before: caseStudy.before_image_url,
      after: caseStudy.after_image_url,
      title: caseStudy.title || `Case ${String(index + 1).padStart(2, '0')}`,
      category: caseStudy.category || 'YANORA case'
    }));
  }, [cases]);

  const firstRow = caseTiles.filter((_, index) => index % 2 === 0);
  const secondRow = caseTiles.filter((_, index) => index % 2 === 1);
  const rows = [firstRow.length ? firstRow : caseTiles, secondRow.length ? secondRow : caseTiles];

  return (
    <section className="yanora-confidence-marquee-section">
      <div className="yanora-confidence-marquee-head">
        <p>YANORA CASES</p>
        <h2>{t('caseStudies.confidenceTitle')}</h2>
      </div>

      <div className="yanora-confidence-marquee-shell">
        {rows.map((row, rowIndex) => {
          const loopItems = [...row, ...row, ...row];

          return (
            <div key={rowIndex} className="yanora-confidence-marquee-row">
              <div className={`yanora-confidence-marquee-track ${rowIndex === 1 ? 'is-reverse' : ''}`}>
                {loopItems.map((item, index) => (
                  <article key={`${item.id}-${rowIndex}-${index}`} className="yanora-confidence-case-card">
                    <div className="yanora-confidence-case-images">
                      <img src={item.before} alt={`${item.title} before`} />
                      <img src={item.after} alt={`${item.title} after`} />
                    </div>
                    <div className="yanora-confidence-case-meta">
                      <span>{String((index % row.length) + 1).padStart(2, '0')}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.category}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CaseStudiesSection;
