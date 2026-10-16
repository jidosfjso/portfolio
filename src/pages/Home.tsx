import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Starfield from '@/components/Starfield';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import Skills from '@/components/Skills';
import ContactForm from '@/features/contact/ContactForm';
import { profileApi, skillApi, projectApi } from '@/api';
import type { Profile, Skill, Project } from '@/types';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

// 首页：Hero + 时间线 + 技能 + 项目预览 + 联系表单。

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      profileApi.getProfile(),
      skillApi.listSkills(),
      projectApi.listProjects(),
    ]).then(([p, s, pr]) => {
      if (cancelled) return;
      if (p.data) setProfile(p.data);
      if (s.data) setSkills(s.data);
      if (pr.data) setProjects(pr.data.slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Starfield />
      <Hero />

      {/* 时间线 */}
      <section id="timeline" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-ink">个人经历</h2>
        {profile && <Timeline items={profile.timeline} />}
      </section>

      {/* 技能 */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-ink">技能</h2>
        <Skills skills={skills} />
      </section>

      {/* 项目预览 */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink">项目</h2>
          <Link to="/projects" className="text-sm text-accent hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-colors hover:border-accent">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-ink group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{project.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 联系 */}
      <section id="contact" className="mx-auto max-w-2xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-ink">联系我</h2>
        <ContactForm />
      </section>
    </>
  );
}
