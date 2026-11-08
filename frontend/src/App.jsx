import { useEffect, useMemo, useState } from 'react';

const navItems = [
  'Home',
  'My Courses',
  'AI Tutor',
  'CBT Practice',
  'Past Questions',
  'Assignments',
  'Performance',
  'Profile',
];

const statCards = [
  { label: 'Courses enrolled', value: '12' },
  { label: 'Assignments done', value: '28' },
  { label: 'Average score', value: '92%' },
  { label: 'Study streak', value: '18 days' },
];

const featureCards = [
  {
    title: 'AI Tutor',
    description: 'Personalized guidance, practice prompts, and quick explanations tailored to your study needs.',
  },
  {
    title: 'CBT Practice',
    description: 'Timed mock exams designed for exam readiness, confidence building, and performance tracking.',
  },
  {
    title: 'Performance Analytics',
    description: 'Monitor your strengths, weak points, and progress across subjects with actionable insights.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started and exploring core academic support.',
    features: ['Access to 10 courses', 'Basic progress tracking', 'Community forum'],
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$19',
    description: 'Unlock advanced study tools and AI-powered guidance for accelerated growth.',
    features: ['Unlimited courses', 'AI Tutor', 'Full CBT analytics', 'Priority support'],
    highlight: true,
  },
];

const courseLibrary = [
  {
    title: 'Advanced Mathematics',
    category: 'STEM',
    lessons: 12,
    duration: '4 weeks',
    level: 'Beginner to Intermediate',
    description: 'Algebra, trigonometry, functions, and exam strategies for mathematical reasoning.',
  },
  {
    title: 'Biology Essentials',
    category: 'Science',
    lessons: 9,
    duration: '3 weeks',
    level: 'Secondary to University',
    description: 'Cell biology, genetics, ecosystems, and practical lab preparation.',
  },
  {
    title: 'World History',
    category: 'Humanities',
    lessons: 11,
    duration: '5 weeks',
    level: 'All levels',
    description: 'Civilizations, revolutions, political movements, and historical analysis.',
  },
  {
    title: 'English Literature',
    category: 'Arts',
    lessons: 8,
    duration: '3 weeks',
    level: 'Intermediate',
    description: 'Poetry, essay writing, literary devices, and reading comprehension practice.',
  },
];

const defaultDashboardState = {
  user: {
    name: 'Aisha Bello',
    email: 'aisha@edusmart.edu',
    level: 'Level 300',
  },
  courses: [
    { id: 1, title: 'Advanced Mathematics', subject: 'STEM', progress: 82, lessons: '8/10 lessons', next: 'Trigonometric identities' },
    { id: 2, title: 'Biology Essentials', subject: 'Science', progress: 68, lessons: '6/9 lessons', next: 'Genetics workshop' },
    { id: 3, title: 'World History', subject: 'Humanities', progress: 91, lessons: '10/11 lessons', next: 'Civil rights timeline' },
  ],
  activities: [
    { label: 'Completed Algebra II quiz', time: '2 hours ago' },
    { label: 'Reviewed Biology chapter summary', time: 'Yesterday' },
    { label: 'Submitted Physics lab report', time: '2 days ago' },
  ],
  assignments: [
    { title: 'Economics Case Study', due: 'Due tomorrow, 5:00 PM', status: 'Pending' },
    { title: 'Chemistry Lab Write-up', due: 'Due Friday, 12:00 PM', status: 'In progress' },
    { title: 'Literature Reflection', due: 'Due next Monday', status: 'Upcoming' },
  ],
  performance: [
    { subject: 'Mathematics', score: 94 },
    { subject: 'English', score: 88 },
    { subject: 'Biology', score: 90 },
    { subject: 'Physics', score: 86 },
  ],
  exams: [
    { title: 'Mock CBT – Mathematics', date: '12 Nov 2026', status: 'Ready' },
    { title: 'AI Tutor Revision Sprint', date: '15 Nov 2026', status: 'Scheduled' },
  ],
};

function App() {
  const [view, setView] = useState('home');
  const [authMode, setAuthMode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboard, setDashboard] = useState(defaultDashboardState);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const API_URL = useMemo(() => import.meta.env.VITE_API_URL || '/api', []);

  useEffect(() => {
    const token = localStorage.getItem('edusmart-token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboard(token);
    }
  }, []);

  const fetchDashboard = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Unable to load dashboard');
      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setError('');

    try {
      const endpoint = authMode === 'login' ? 'login' : 'signup';
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Authentication failed');
      }

      localStorage.setItem('edusmart-token', payload.token);
      setIsAuthenticated(true);
      setAuthMode('');
      setForm({ name: '', email: '', password: '' });
      setView('My Courses');
      fetchDashboard(payload.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edusmart-token');
    setIsAuthenticated(false);
    setView('home');
    setDashboard(defaultDashboardState);
    setAuthMode('');
    setError('');
  };

  const renderNavActions = () => (
    <div className="nav-actions">
      <button className="btn btn-ghost" type="button" onClick={() => setAuthMode('login')}>
        Login
      </button>
      <button className="btn btn-primary" type="button" onClick={() => setAuthMode('signup')}>
        Sign up
      </button>
    </div>
  );

  const renderLanding = () => (
    <>
      <header className="topbar">
        <div className="container nav">
          <div className="brand">
            <div className="brand-mark">E</div>
            <span>EduSmart</span>
          </div>

          <nav className="nav-links">
            {navItems.slice(0, 4).map((item) => (
              <button key={item} className="nav-link" type="button" onClick={() => setView('home')}>{item}</button>
            ))}
          </nav>

          {renderNavActions()}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Learn Smarter. Achieve More.</span>
              <h1>Build confidence with smart learning tools for every stage.</h1>
              <p>
                EduSmart helps secondary school and university students learn faster, track performance,
                and prepare for life-changing exams with modern academic support.
              </p>
              <div className="cta-row">
                <button className="btn btn-primary" type="button" onClick={() => setAuthMode('signup')}>
                  Get started
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setAuthMode('login')}>
                  View dashboard
                </button>
              </div>

              <div className="stats-row">
                {statCards.map((card) => (
                  <div className="stat-card" key={card.label}>
                    <strong>{card.value}</strong>
                    <span>{card.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-card card-top">
                <span className="mini-tag">Today’s focus</span>
                <h3>Mathematics Revision</h3>
                <div className="progress-pill">
                  <span>82%</span>
                  <div className="track">
                    <div className="fill" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>

              <div className="panel-card card-bottom">
                <div className="mini-row">
                  <span>AI Tutor</span>
                  <strong>Live</strong>
                </div>
                <div className="mini-row">
                  <span>CBT mock</span>
                  <strong>3 sessions</strong>
                </div>
                <div className="mini-row">
                  <span>Assignment due</span>
                  <strong>Tomorrow</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Why students choose us</span>
              <h2>Everything you need to stay on track</h2>
            </div>

            <div className="feature-grid">
              {featureCards.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">✦</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing section alt-bg">
          <div className="container">
            <div className="section-heading center">
              <span className="eyebrow">Simple plans</span>
              <h2>Choose the learning plan that fits your goals</h2>
            </div>

            <div className="pricing-grid">
              {pricingPlans.map((plan) => (
                <div className={`pricing-card ${plan.highlight ? 'featured' : ''}`} key={plan.name}>
                  <span className="plan-name">{plan.name}</span>
                  <div className="plan-price">{plan.price}<small>/month</small></div>
                  <p>{plan.description}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`} type="button">
                    {plan.highlight ? 'Start premium' : 'Get started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className={`auth-modal ${authMode ? 'active' : ''}`}>
        <div className="auth-card">
          <button type="button" className="close-btn" onClick={() => setAuthMode('')}>×</button>
          <div className="auth-head">
            <span className="eyebrow">Welcome back</span>
            <h3>{authMode === 'login' ? 'Login to EduSmart' : 'Create your account'}</h3>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            {authMode === 'signup' && (
              <label>
                Full name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your full name"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="student@email.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter a secure password"
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="btn btn-primary full" type="submit" disabled={authLoading}>
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <button type="button" className="text-link" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
            {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </>
  );

  const renderPageContent = () => {
    switch (view) {
      case 'My Courses':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Learning hub</span>
                <h2>My Courses</h2>
              </div>
              <button className="btn btn-primary" type="button">Browse catalog</button>
            </div>

            <div className="library-grid">
              {courseLibrary.map((course) => (
                <article key={course.title} className="library-card">
                  <div className="library-badge">{course.category}</div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="meta-row">
                    <span>{course.lessons} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-row muted">
                    <span>{course.level}</span>
                  </div>
                  <button className="btn btn-secondary full" type="button">Open course</button>
                </article>
              ))}
            </div>
          </div>
        );
      case 'AI Tutor':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Study support</span>
                <h2>AI Tutor</h2>
              </div>
            </div>
            <div className="ai-layout">
              <div className="prompt-box">
                <h3>Ask your tutor</h3>
                <textarea rows={6} defaultValue="Explain how to solve quadratic equations using factorization and the quadratic formula." />
                <button className="btn btn-primary" type="button">Generate answer</button>
              </div>
              <div className="answer-box">
                <h3>Suggested response</h3>
                <ul>
                  <li>First, rewrite the equation in standard form: ax² + bx + c = 0.</li>
                  <li>Factor the expression when possible and set each factor equal to zero.</li>
                  <li>If it cannot be factored, use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a.</li>
                  <li>Check both roots in the original equation to verify accuracy.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'CBT Practice':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Exam readiness</span>
                <h2>CBT Practice</h2>
              </div>
              <button className="btn btn-primary" type="button">Start timed mock</button>
            </div>
            <div className="practice-grid">
              <div className="practice-card">
                <h3>Mathematics Mock</h3>
                <p>30 questions • 45 minutes</p>
                <div className="progress-row"><span>Readiness</span><strong>87%</strong></div>
                <div className="track"><div className="fill" style={{ width: '87%' }} /></div>
              </div>
              <div className="practice-card">
                <h3>Physics Mock</h3>
                <p>25 questions • 30 minutes</p>
                <div className="progress-row"><span>Readiness</span><strong>74%</strong></div>
                <div className="track"><div className="fill" style={{ width: '74%' }} /></div>
              </div>
            </div>
          </div>
        );
      case 'Past Questions':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Revision archive</span>
                <h2>Past Questions</h2>
              </div>
            </div>
            <div className="question-list">
              <div className="question-item">
                <strong>WAEC Mathematics 2023</strong>
                <small>40 questions • Paper 1</small>
              </div>
              <div className="question-item">
                <strong>JAMB English 2022</strong>
                <small>40 questions • Comprehension & vocabulary</small>
              </div>
              <div className="question-item">
                <strong>NECO Biology 2021</strong>
                <small>50 questions • Theory and objective</small>
              </div>
            </div>
          </div>
        );
      case 'Assignments':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Submission tracker</span>
                <h2>Assignments</h2>
              </div>
            </div>
            <ul className="assignment-list big">
              {dashboard.assignments.map((assignment) => (
                <li key={assignment.title}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <small>{assignment.due}</small>
                  </div>
                  <span className="status-badge">{assignment.status}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'Performance':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Academic tracker</span>
                <h2>Performance</h2>
              </div>
            </div>
            <div className="score-list big">
              {dashboard.performance.map((item) => (
                <div className="score-row" key={item.subject}>
                  <span>{item.subject}</span>
                  <div className="mini-track">
                    <div className="fill" style={{ width: `${item.score}%` }} />
                  </div>
                  <strong>{item.score}%</strong>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Profile':
        return (
          <div className="page-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Student account</span>
                <h2>Profile</h2>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">AB</div>
              <div>
                <h3>{dashboard.user?.name}</h3>
                <p>{dashboard.user?.email}</p>
                <p>{dashboard.user?.level}</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="dashboard-main">
            <header className="dashboard-header">
              <div>
                <span className="eyebrow">Welcome back</span>
                <h1>{dashboard.user?.name || 'Student'}</h1>
              </div>
              <button className="btn btn-primary" type="button">+ New study session</button>
            </header>

            <section className="overview-grid">
              <div className="overview-card large">
                <div className="card-header-row">
                  <h3>Learning progress</h3>
                  <span className="chip">This week</span>
                </div>

                <div className="progress-panel">
                  <div>
                    <strong>76%</strong>
                    <small>Completion rate</small>
                  </div>
                  <div className="track large-track">
                    <div className="fill" style={{ width: '76%' }} />
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-header-row">
                  <h3>Upcoming exams</h3>
                </div>
                <ul className="list-stack">
                  {dashboard.exams.map((exam) => (
                    <li key={exam.title}>
                      <span>{exam.title}</span>
                      <strong>{exam.status}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="content-grid">
              <div className="overview-card">
                <div className="card-header-row">
                  <h3>Available courses</h3>
                  <span className="chip">{dashboard.courses.length} active</span>
                </div>

                <div className="course-grid">
                  {dashboard.courses.map((course) => (
                    <div className="course-tile" key={course.id}>
                      <div className="course-topline">
                        <span>{course.subject}</span>
                        <strong>{course.progress}%</strong>
                      </div>
                      <h4>{course.title}</h4>
                      <div className="track">
                        <div className="fill" style={{ width: `${course.progress}%` }} />
                      </div>
                      <small>{course.lessons}</small>
                      <p>Next: {course.next}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <div className="card-header-row">
                  <h3>Recent activity</h3>
                </div>
                <ul className="activity-list">
                  {dashboard.activities.map((activity) => (
                    <li key={activity.label}>
                      <span className="dot" />
                      <div>
                        <strong>{activity.label}</strong>
                        <small>{activity.time}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="overview-card">
                <div className="card-header-row">
                  <h3>Assignments</h3>
                </div>
                <ul className="assignment-list">
                  {dashboard.assignments.map((assignment) => (
                    <li key={assignment.title}>
                      <div>
                        <strong>{assignment.title}</strong>
                        <small>{assignment.due}</small>
                      </div>
                      <span className="status-badge">{assignment.status}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overview-card">
                <div className="card-header-row">
                  <h3>Performance</h3>
                </div>
                <div className="score-list">
                  {dashboard.performance.map((item) => (
                    <div className="score-row" key={item.subject}>
                      <span>{item.subject}</span>
                      <div className="mini-track">
                        <div className="fill" style={{ width: `${item.score}%` }} />
                      </div>
                      <strong>{item.score}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="brand-mark">E</div>
          <span>EduSmart</span>
        </div>

        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item}>
              <button type="button" className={view === item ? 'active' : ''} onClick={() => setView(item)}>
                {item}
              </button>
            </li>
          ))}
        </ul>

        <button className="btn btn-secondary full" type="button" onClick={handleLogout}>Log out</button>
      </aside>

      {renderPageContent()}
    </div>
  );

  return (
    <div className="app-shell">
      {isAuthenticated ? renderDashboard() : renderLanding()}
      {loading && <div className="loader">Loading dashboard…</div>}
    </div>
  );
}

export default App;
