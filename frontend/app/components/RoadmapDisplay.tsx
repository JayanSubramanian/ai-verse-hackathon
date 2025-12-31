"use client";

interface CareerPathSuggestion {
  role: string;
  match_score: number;
  reasoning: string;
  missing_skills: string[];
}

interface LearningResource {
  title: string;
  type: string;
  url?: string;
  estimated_time: string;
}

interface Milestone {
  title: string;
  description: string;
  resources: LearningResource[];
  duration: string;
}

interface Roadmap {
  target_role: string;
  summary: string;
  milestones: Milestone[];
}

interface AgentResponse {
  analysis: string;
  suggested_paths: CareerPathSuggestion[];
  roadmap?: Roadmap;
}

export default function RoadmapDisplay({ data }: { data: AgentResponse }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Analysis Section */}
      <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Career Analysis
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {data.analysis}
        </p>
      </section>

      {/* Suggested Paths */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
          Recommended Roles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.suggested_paths.map((path, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {path.role}
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  {path.match_score}% Match
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                {path.reasoning}
              </p>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {path.missing_skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      {data.roadmap && (
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Personalized Roadmap: {data.roadmap.target_role}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {data.roadmap.summary}
            </p>
          </div>

          <div className="relative border-l border-zinc-300 dark:border-zinc-700 ml-3 space-y-8">
            {data.roadmap.milestones.map((milestone, idx) => (
              <div key={idx} className="mb-8 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-zinc-900 dark:bg-blue-900">
                  <span className="text-xs text-blue-800 dark:text-blue-300">
                    {idx + 1}
                  </span>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {milestone.title}
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">
                    {milestone.duration}
                  </span>
                </h3>
                <p className="mb-4 text-base font-normal text-zinc-500 dark:text-zinc-400">
                  {milestone.description}
                </p>
                
                <div className="space-y-2">
                  {milestone.resources.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-center p-3 text-base font-bold text-zinc-900 rounded-lg bg-zinc-50 hover:bg-zinc-100 group hover:shadow dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
                    >
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        {res.title}
                        <span className="block text-xs font-normal text-zinc-500">
                           {res.type} • {res.estimated_time}
                        </span>
                      </span>
                      {res.url && (
                          <a href={res.url} target="_blank" className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-zinc-500 bg-zinc-200 rounded dark:bg-zinc-700 dark:text-zinc-400">
                              Link
                          </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
