import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import heroFallback from './assets/hero.png'

const trialDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const trialTimes = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
]

const storageKey = 'shooting-acad-workflow-v1'
const flowActions = ['trial', 'registration', 'enroll']
const academyName = 'Trinetra Sports Shooting Acadmey'
const trialNotificationEmail = 'trinetrasports26@gmail.com'
const coaches = [
  {
    name: 'Coach Hemant Choudhary',
    label: 'Meet Our Mentor',
    photo: '/gallery/shot-7.jpeg',
    highlights: [
      'Renowned competitive shooter',
      'National Qualified Shooter in 10m & 25m pistol shooting',
      'Experienced in national-level shooting competitions',
      'Specialized in 10m Air Pistol & 25m Pistol',
      'Strong focus on technique, concentration & mental strength',
      'Expertise in precision, accuracy & consistency development',
      'Dedicated to shooter training & athlete development',
      'Focused on performance, match readiness & competitive skills',
      'Committed to developing disciplined, confident shooters with a winning mindset',
      'Passionate about nurturing the next generation of competitive shooters',
    ],
  },
  {
    name: 'Coach Himanshu Singh',
    label: 'Meet the Coach',
    photo: '/gallery/shot-6.jpeg',
    highlights: [
      '7+ years of competitive 10m Air Pistol shooting experience',
      '5-Time National Qualified shooter',
      'Selected for India Team Trials',
      'Competed in national-level shooting competitions',
      '2+ years of professional coaching experience',
      'Coaching experience at reputed schools in Noida & Greater Noida',
      'Specialized in 10m Air Pistol & precision shooting',
      'Expertise in mental conditioning & match strategy',
      'Focus on performance analysis & athlete development',
      'Dedicated to developing shooters from fundamentals to competitive level',
      'Committed to discipline, consistency & high-performance training',
    ],
  },
]
const academyUpdates = [
  {
    keyword: 'Blog',
    link: 'https://www.gunforglory.in/rifle-vs-pistol/',
    summary: 'Rifle vs Pistol: 7 Ways to Know Which Is Right for You\n\nOne of the first questions every beginner asks before starting...',
    image: '/gallery/shot-9.jpeg',
    content: [
      {
        paragraphs: [
          'Choosing between rifle and pistol is one of the first decisions many new shooters consider. Both are precision sports that reward patience, discipline and repeatable technique, but they create very different shooting experiences.',
          'The best starting point is not to look for a universally “better” discipline. Instead, understand the differences, try both under qualified supervision and choose the event that best fits your interests and development goals.',
        ],
      },
      {
        heading: '1. How the Equipment Is Held',
        paragraphs: ['A rifle is supported by both hands and rests against the shoulder, giving the shooter several points of contact. A pistol is normally held in one extended hand, so small movements in the wrist, arm or body can have a more visible effect on the shot.'],
      },
      {
        heading: '2. Stability and Learning Feel',
        paragraphs: ['Rifle beginners often experience a more supported shooting position. Pistol shooting can feel less stable at first because it requires the shooter to develop control through one arm and a precise grip. Both paths become highly technical as the athlete progresses.'],
      },
      {
        heading: '3. Physical Demands',
        paragraphs: ['Rifle training places strong emphasis on posture, core control and holding aligned positions. Pistol training develops shoulder endurance, arm stability and fine wrist control. Structured conditioning helps athletes stay steady throughout a full session.'],
      },
      {
        heading: '4. Focus and Mental Control',
        paragraphs: ['Both disciplines demand concentration, but the routine can feel different. Rifle shooters work on stillness, alignment and consistent execution over long sequences. Pistol shooters must manage movement and maintain calm control through every release.'],
      },
      {
        heading: '5. Equipment and Training Setup',
        paragraphs: ['The equipment, clothing and accessories vary between the disciplines. At the academy, coaches can introduce beginners to suitable equipment and explain how each setup supports safe, responsible practice.'],
      },
      {
        heading: '6. Competition Pathway',
        paragraphs: ['Both rifle and pistol offer structured opportunities to progress from introductory training to recognised competitions. As skills grow, athletes can explore events that match their strengths, interests and long-term competitive goals.'],
      },
      {
        heading: '7. The Best Way to Choose',
        paragraphs: ['The most useful answer comes from guided experience. A supervised trial allows a beginner to understand the feel of each discipline, receive coach feedback and begin with the fundamentals that suit them best.'],
      },
      {
        heading: 'Start With Safe, Structured Training',
        paragraphs: ['Whichever discipline you choose, progress comes from safe practice, good coaching and a consistent process. Focus on learning the basics well, then build confidence and performance one shot at a time.'],
      },
    ],
  },
  {
    keyword: 'Blog',
    summary: 'Understanding Air Pistols: A Beginner’s Guide to Shooting, Safety & Precision',
    image: '/gallery/shot-10.jpeg',
    content: [
      {
        paragraphs: [
          'Shooting is a sport built on precision, concentration and discipline. Among the different shooting disciplines, 10-metre air pistol is one of the most technically demanding events, requiring the shooter to maintain excellent body control, consistent technique and strong mental focus.',
          'At Trinetra Sports Shooting Academy, we believe that understanding the equipment and fundamentals of shooting is an important part of becoming a better athlete.',
        ],
      },
      {
        heading: 'What Is an Air Pistol?',
        paragraphs: [
          'An air pistol is a sporting firearm designed for target shooting using compressed air or another gas system to propel a pellet. In competitive 10-metre air pistol, athletes shoot at a standardized target from a distance of 10 metres.',
          'Unlike many other shooting disciplines, the objective is not simply to fire quickly. The shooter must carefully control their body, breathing, aiming process and trigger release to produce a precise shot.',
        ],
      },
      {
        heading: 'The Five Important Elements of a Good Shot',
        points: [
          ['1. Stance', 'A stable stance provides the foundation for accurate shooting. The shooter should develop a comfortable and repeatable position that allows the body to remain balanced while the pistol is held steadily. Consistency is more important than trying to copy someone else’s exact stance.'],
          ['2. Grip', 'A consistent grip helps the shooter control the pistol and maintain a repeatable shooting position. The grip should be stable without unnecessary tension. Excessive pressure can create unwanted movement and make it difficult to reproduce the same shot process.'],
          ['3. Aiming', 'Aiming requires the shooter to align the sights correctly while maintaining concentration. Competitive shooters learn to focus on their sight alignment and develop a consistent visual routine before every shot.'],
          ['4. Breathing', 'Breathing can influence stability. Shooters generally develop a controlled breathing routine and learn to establish a comfortable moment of stability before executing the shot.'],
          ['5. Trigger Control', 'Trigger control is one of the most important aspects of precision shooting. A smooth and consistent trigger action helps prevent unnecessary movement of the pistol during the final stage of the shot. Developing this skill requires patience and structured practice.'],
        ],
      },
      {
        heading: 'The Importance of Mental Strength',
        paragraphs: ['Shooting is not only a physical sport. Mental control can be just as important as technical ability.', 'A shooter may have excellent technique but still struggle if they become anxious after a poor shot or lose concentration during competition.'],
        list: ['Stay focused on the current shot', 'Avoid overthinking previous shots', 'Maintain a consistent pre-shot routine', 'Control competition pressure', 'Accept mistakes and recover quickly', 'Focus on the process rather than only the score'],
      },
      {
        heading: 'Why Safety Comes First',
        paragraphs: ['Shooting sports must always be practiced under proper supervision and established range-safety procedures.', 'At Trinetra Sports Shooting Academy, safety and discipline are fundamental parts of training. Shooters should follow the instructions of qualified coaches and range officials, use equipment responsibly and never handle a sporting firearm outside the permitted conditions of the range.', 'Safety is not separate from shooting—it is an essential part of being a responsible shooter.'],
      },
      {
        heading: 'From Technique to Performance',
        paragraphs: ['Improvement in shooting does not happen overnight. It comes from developing a repeatable process and practising it consistently.', 'Instead of focusing only on the score, shooters should understand why a particular shot happened. This approach helps develop consistency and creates a stronger foundation for competitive performance.'],
        cycle: 'Learn → Practise → Analyse → Correct → Repeat',
      },
    ],
  },
]

function App() {
  const carouselImages = [
    '/gallery/shot-5.jpeg',
    '/gallery/shot-3.jpeg',
    '/gallery/shot-2.jpeg',
    '/gallery/shot-4.jpeg',
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  const [expandedCoach, setExpandedCoach] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false)

  const [workflowData, setWorkflowData] = useState({
    trialBookings: [],
    enrollments: [],
  })

  const [trialForm, setTrialForm] = useState({
    fullName: '',
    phone: '',
    age: '',
    trialDay: trialDays[0],
    trialTime: trialTimes[0],
  })

  const [enrollmentForm, setEnrollmentForm] = useState({
    fullName: '',
    phone: '',
    batch: 'Batch A - Evening',
    plan: '8 Weeks Foundation',
    paymentStatus: 'pending',
  })

  const [feedback, setFeedback] = useState({
    trial: '',
    enrollment: '',
  })

  const [activeFlow, setActiveFlow] = useState('trial')
  const trialFormRef = useRef(null)
  const enrollmentFormRef = useRef(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved) {
      setWorkflowData(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(workflowData))
  }, [workflowData])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')
    if (action && flowActions.includes(action)) {
      setActiveFlow(action)
      window.setTimeout(() => {
        scrollToFlow(action)
      }, 120)
      clearFlowUrlParam()
    }
  }, [])

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselImages.length)
    }, 3200)

    return () => {
      window.clearInterval(sliderTimer)
    }
  }, [carouselImages.length])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('action')) {
      return undefined
    }

    const popupTimer = window.setTimeout(() => {
      setIsTrialPopupOpen(true)
    }, 750)

    return () => {
      window.clearTimeout(popupTimer)
    }
  }, [])

  const trialRegistrationCount = workflowData.trialBookings.length
  const enrolledCount = workflowData.enrollments.filter((item) => item.status === 'Enrolled').length
  const pendingPaymentCount = workflowData.enrollments.filter(
    (item) => item.status === 'Enrollment Pending Payment',
  ).length

  const currentStep = useMemo(() => {
    if (enrolledCount > 0 || pendingPaymentCount > 0) {
      return 2
    }

    if (trialRegistrationCount > 0) {
      return 1
    }

    return 1
  }, [enrolledCount, pendingPaymentCount, trialRegistrationCount])

  const stepperItems = [
    { id: 1, title: 'Trial + Registration' },
    { id: 2, title: 'Enrollment' },
  ]

  function clearFlowUrlParam() {
    const url = new URL(window.location.href)
    url.searchParams.delete('action')
    window.history.replaceState({}, '', url)
  }

  function scrollToFlow(flow) {
    const flowRefMap = {
      trial: trialFormRef,
      registration: trialFormRef,
      enroll: enrollmentFormRef,
    }

    const targetRef = flowRefMap[flow]
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleFlowSelect(flow) {
    const normalizedFlow = flow === 'registration' ? 'trial' : flow
    setActiveFlow(normalizedFlow)
    scrollToFlow(normalizedFlow)
  }

  function openTrialFlowFromCta() {
    setIsTrialPopupOpen(false)
    handleFlowSelect('trial')
  }

  async function sendTrialRegistrationEmail(trialId, trialDetails) {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${trialNotificationEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Free Trial Registration - ${trialId}`,
          _template: 'table',
          _captcha: 'false',
          bookingId: trialId,
          fullName: trialDetails.fullName,
          phone: trialDetails.phone,
          age: trialDetails.age,
          trialDay: trialDetails.trialDay,
          trialTime: trialDetails.trialTime,
          source: window.location.origin,
        }),
      })

      return response.ok
    } catch {
      return false
    }
  }

  async function handleTrialBooking(event) {
    event.preventDefault()
    const trialId = `TRIAL-${Date.now()}`
    const submittedTrial = {
      fullName: trialForm.fullName,
      phone: trialForm.phone,
      age: trialForm.age,
      trialDay: trialForm.trialDay,
      trialTime: trialForm.trialTime,
    }

    setWorkflowData((prev) => ({
      ...prev,
      trialBookings: [
        ...prev.trialBookings,
        {
          trialId,
          ...submittedTrial,
          status: 'Trial Scheduled + Registered',
        },
      ],
    }))

    const emailSent = await sendTrialRegistrationEmail(trialId, submittedTrial)

    setFeedback((prev) => ({
      ...prev,
      trial: emailSent
        ? `Trial and registration completed. Your booking ID is ${trialId}. Confirmation mail sent.`
        : `Trial and registration completed. Your booking ID is ${trialId}. Email send failed, please retry.`,
    }))

    handleFlowSelect('enroll')

    setEnrollmentForm((prev) => ({
      ...prev,
      fullName: trialForm.fullName,
      phone: trialForm.phone,
    }))

    setTrialForm((prev) => ({
      ...prev,
      fullName: '',
      phone: '',
      age: '',
      trialDay: trialDays[0],
      trialTime: trialTimes[0],
    }))
  }

  function handleEnrollment(event) {
    event.preventDefault()

    const hasTrialRegistration = workflowData.trialBookings.some(
      (item) => item.phone.trim() === enrollmentForm.phone.trim(),
    )

    if (!hasTrialRegistration) {
      setFeedback((prev) => ({
        ...prev,
        enrollment: 'No trial registration found for this phone number. Complete trial booking first.',
      }))
      return
    }

    const status =
      enrollmentForm.paymentStatus === 'paid' ? 'Enrolled' : 'Enrollment Pending Payment'

    setWorkflowData((prev) => ({
      ...prev,
      enrollments: [
        ...prev.enrollments,
        {
          enrollmentId: `ENR-${Date.now()}`,
          fullName: enrollmentForm.fullName,
          phone: enrollmentForm.phone,
          batch: enrollmentForm.batch,
          plan: enrollmentForm.plan,
          status,
        },
      ],
    }))

    setFeedback((prev) => ({
      ...prev,
      enrollment:
        status === 'Enrolled'
          ? 'Enrollment complete. Payment received and seat secured.'
          : 'Enrollment recorded with pending payment status.',
    }))
  }

  return (
    <div className="site-shell">
      <header className="hero" id="home">
        <nav className="topbar" aria-label="Main navigation">
          <div className="brand-wrap">
            <img
              className="brand-logo"
              src="/trinetra-logo.jpeg"
              alt="Trinetra Sports Shooting Acadmey logo"
              onError={(event) => {
                if (!event.currentTarget.src.includes('hero.png')) {
                  event.currentTarget.src = heroFallback
                }
              }}
            />
            <p className="brand">{academyName.toUpperCase()}</p>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={isMenuOpen}
              aria-controls="primary-nav-links"
              aria-label="Toggle navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div
              id="primary-nav-links"
              className={isMenuOpen ? 'links links-open' : 'links'}
            >
              <a href="#programs" onClick={() => setIsMenuOpen(false)}>
                Programs
              </a>
              <a href="#updates" onClick={() => setIsMenuOpen(false)}>
                Blogs &amp; News
              </a>
              <a href="#admissions" onClick={() => setIsMenuOpen(false)}>
                Admissions
              </a>
              <a href="#coaches" onClick={() => setIsMenuOpen(false)}>
                Coaches
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Precision. Discipline. Confidence.</p>
            <h1>Train Like Every Shot Counts.</h1>
            <p>
              Build elite marksmanship with certified instructors, structured range sessions,
              and measurable performance tracking.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#admissions">
                Book Intro Session
              </a>
              <a className="btn btn-ghost" href="#programs">
                Show Program Details
              </a>
            </div>
          </div>

          <aside className="hero-carousel" aria-label="Academy image gallery">
            <img
              className="hero-carousel-image"
              src={carouselImages[activeSlide]}
              alt={`Academy moment ${activeSlide + 1}`}
              onError={(event) => {
                if (!event.currentTarget.src.includes('hero.png')) {
                  event.currentTarget.src = heroFallback
                }
              }}
            />
            <div className="carousel-dots" aria-label="Gallery slides">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === activeSlide ? 'carousel-dot is-active' : 'carousel-dot'}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </aside>
        </div>
      </header>

      <section className="section cta" id="contact">
        <div>
          <p className="kicker">Ready To Start?</p>
          <h2>Join The Next Intro Batch</h2>
          <p className="muted">Phone: 9971764244 & 9058914312 | Email: trinetrasports26@gmail.com </p>
        </div>
        <a className="btn btn-primary" href="#admissions">
          Reserve Your Spot
        </a>
      </section>

      <section className="section programs-overview" id="programs" aria-label="Our programs">
        <div className="section-head">
          <p className="kicker">Our Programs</p>
          <h2>Find The Right Training Path</h2>
        </div>
        <div className="programs-overview-grid">
          <article className="program-card">
            <h3>Beginner Program</h3>
            <p>Learn the basics of shooting in a safe &amp; fun environment.</p>
          </article>
          <article className="program-card">
            <h3>Intermediate Program</h3>
            <p>Improve your skills, accuracy &amp; consistency.</p>
          </article>
          <article className="program-card">
            <h3>Advanced &amp; Competition Program</h3>
            <p>High performance training for competitions &amp; championships.</p>
          </article>
          <article className="program-card">
            <h3>Special Programs</h3>
            <p>School programs, holiday camps, corporate &amp; group sessions.</p>
          </article>
        </div>
      </section>

      <main>
        <section className="section" id="coaches">
          <div className="section-head">
            <p className="kicker">Instruction Team</p>
            <h2>Meet Your Coaches</h2>
          </div>
          <div className="coach-list">
            {coaches.map((coach) => (
              <article key={coach.name} className="coach-slide">
                <div className="coach-photo">
                  <img src={coach.photo} alt={coach.name} />
                </div>
                <div className="coach-about">
                  <p className="coach-eyebrow">{coach.label}</p>
                  <h3>{coach.name}</h3>
                  <ul className="coach-highlights">
                    {coach.highlights.slice(0, expandedCoach === coach.name ? coach.highlights.length : 4).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="coach-read-more"
                    aria-expanded={expandedCoach === coach.name}
                    onClick={() => setExpandedCoach((current) => (current === coach.name ? null : coach.name))}
                  >
                    {expandedCoach === coach.name ? 'Show less' : 'Read more'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section video-feature" aria-label="Academy intro video">
          <div className="section-head">
            <p className="kicker">Watch Academy Story</p>
            <h2>See The Training Spirit In Action</h2>
          </div>
          <div className="video-frame">
            <iframe
              src="https://www.youtube.com/embed/Zw4XRD3hoNg"
              title="Shooting academy intro video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className="section" id="why-join">
          <div className="section-head">
            <p className="kicker">The Trinetra Difference</p>
            <h2>Why Join Trinetra Sports Shooting Academy?</h2>
          </div>
          <div className="why-join">
            <img
              className="why-join-image"
              src="/gallery/shot-8.jpeg"
              alt="Trinetra Sports Shooting Academy training space"
            />
            <div className="why-join-list">
              <p>World-class range with 8 premium lanes</p>
              <p>Expert &amp; certified coaches with proven track record</p>
              <p>Safe, modern &amp; technology-driven environment</p>
              <p>Personalized training for every shooter</p>
              <p>Structured programs for all age groups</p>
              <p>Pathway to competitions, national &amp; international exposure</p>
              <p>Focus on all-round development — mind, body &amp; character</p>
            </div>
          </div>
        </section>

        <section className="section" id="updates">
          <div className="section-head">
            <p className="kicker">Stay Informed</p>
            <h2>Blogs &amp; News</h2>
          </div>
          <div className="updates-grid">
            {academyUpdates.map((item) => {
              const [headline, ...excerpt] = item.summary.split(/\n\s*\n/)

              return (
                <article key={item.link ?? item.summary} className="update-card">
                  <img
                    src={item.image}
                    alt="Shooting academy blog article"
                    onError={(event) => {
                      event.currentTarget.src = '/gallery/shot-5.jpeg'
                    }}
                  />
                  <div className="update-card-content">
                    <p className="update-keyword">{item.keyword}</p>
                    <h3>{headline}</h3>
                    {excerpt.length ? <p>{excerpt.join(' ')}</p> : null}
                    {item.content ? (
                      <button type="button" className="update-read-more" onClick={() => setSelectedArticle(item)}>
                        Read {item.keyword.toLowerCase()} <span aria-hidden="true">&rarr;</span>
                      </button>
                    ) : (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        Read {item.keyword.toLowerCase()} <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="section" id="admissions">
          <div className="section-head">
            <p className="kicker">Admissions Workflow</p>
            <h2>Trial Registration and Enrollment</h2>
          </div>

          <div className="workflow-stepper" aria-label="Admissions progress">
            {stepperItems.map((item, index) => {
              const status = item.id < currentStep ? 'done' : item.id === currentStep ? 'active' : 'todo'

              return (
                <div key={item.id} className={`stepper-item stepper-${status}`}>
                  <div className="stepper-node">{item.id}</div>
                  <p>{item.title}</p>
                  {index < stepperItems.length - 1 ? <span className="stepper-line" /> : null}
                </div>
              )
            })}
          </div>

          <div className="admissions-grid">
              <form
                ref={trialFormRef}
                id="trial-flow"
                className={activeFlow === 'trial' ? 'workflow-card is-focused' : 'workflow-card'}
                onSubmit={handleTrialBooking}
              >
                <div className="workflow-card-head">
                  <p className="workflow-step">Step 1</p>
                  <h3>Schedule Trial and Register</h3>
                  <p className="workflow-help">Complete trial registration with day and one-hour time slot.</p>
                </div>
                <div className="field-grid field-grid-two">
                  <label>
                    Full Name
                    <input
                      required
                      placeholder="Enter candidate name"
                      value={trialForm.fullName}
                      onChange={(event) =>
                        setTrialForm((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      required
                      placeholder="+91 000 000 0000"
                      value={trialForm.phone}
                      onChange={(event) =>
                        setTrialForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                    />
                  </label>
                </div>
                <label>
                  Age
                  <input
                    required
                    type="number"
                    min="7"
                    max="99"
                    placeholder="Enter age"
                    value={trialForm.age}
                    onChange={(event) =>
                      setTrialForm((prev) => ({ ...prev, age: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Trial Day
                  <select
                    value={trialForm.trialDay}
                    onChange={(event) =>
                      setTrialForm((prev) => ({ ...prev, trialDay: event.target.value }))
                    }
                  >
                    {trialDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Trial Time
                  <select
                    value={trialForm.trialTime}
                    onChange={(event) =>
                      setTrialForm((prev) => ({ ...prev, trialTime: event.target.value }))
                    }
                  >
                    {trialTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn btn-primary" type="submit">
                  Confirm Trial Registration
                </button>
                {feedback.trial ? <p className="form-note">{feedback.trial}</p> : null}
              </form>

              <form
                ref={enrollmentFormRef}
                id="enroll-flow"
                className={activeFlow === 'enroll' ? 'workflow-card is-focused' : 'workflow-card'}
                onSubmit={handleEnrollment}
              >
                <div className="workflow-card-head">
                  <p className="workflow-step">Step 2</p>
                  <h3>Enrollment</h3>
                  <p className="workflow-help">Select batch and payment state to finalize enrollment.</p>
                </div>
                <label>
                  Full Name
                  <input
                    required
                    placeholder="Enter candidate name"
                    value={enrollmentForm.fullName}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Phone
                  <input
                    required
                    placeholder="+91 000 000 0000"
                    value={enrollmentForm.phone}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Batch
                  <select
                    value={enrollmentForm.batch}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, batch: event.target.value }))
                    }
                  >
                    <option>Batch A - Evening</option>
                    <option>Batch B - Weekend</option>
                    <option>Batch C - Advanced Tactical</option>
                  </select>
                </label>
                <label>
                  Plan
                  <select
                    value={enrollmentForm.plan}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, plan: event.target.value }))
                    }
                  >
                    <option>8 Weeks Foundation</option>
                    <option>12 Weeks Tactical Track</option>
                    <option>16 Weeks Competition Pro</option>
                  </select>
                </label>
                <label>
                  Payment Status
                  <select
                    value={enrollmentForm.paymentStatus}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, paymentStatus: event.target.value }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </label>
                <button className="btn btn-primary" type="submit">
                  Finalize Enrollment
                </button>
                {feedback.enrollment ? <p className="form-note">{feedback.enrollment}</p> : null}
              </form>
          </div>
        </section>

      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-newsletter">
            <p className="footer-brand">Trinetra Sports Shooting Academy</p>
            <p className="footer-intro">
              Get training updates, upcoming batch details, and academy news in your inbox.
            </p>
            <form className="newsletter-form" action={`mailto:${trialNotificationEmail}`} method="get">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <span className="newsletter-icon" aria-hidden="true">✉</span>
              <input id="footer-email" name="subject" type="email" placeholder="Enter your email address" required />
              <button type="submit" aria-label="Subscribe by email">→</button>
            </form>
            <p className="newsletter-note">By subscribing, you agree to receive academy updates.</p>
          </div>

          <div className="footer-links-group">
            <div>
              <h3>Quick Links</h3>
              <nav aria-label="Footer navigation">
                <a href="#programs">Programs</a>
                <a href="#coaches">Our Coaches</a>
                <a href="#updates">Blogs &amp; News</a>
                <a href="#admissions">Admissions</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>
            <div>
              <h3>Connect</h3>
              <div className="footer-socials">
                <a href={`mailto:${trialNotificationEmail}`}>Email Us</a>
                <a href="tel:+919971764244">Call Academy</a>
                <a href="https://wa.me/919971764244" target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </div>
            <div>
              <h3>Socials</h3>
              <div className="footer-socials">
                <a href="https://www.instagram.com/trinetrashootingacademy26" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a>
              </div>
            </div>
          </div>

          <address className="footer-contact">
            <h3>Contact Us</h3>
            <a href="tel:+919971764244"><span aria-hidden="true">☎</span> +91 99717 64244</a>
            <a href="tel:+919058914312"><span aria-hidden="true">☎</span> +91 90589 14312</a>
            <a href={`mailto:${trialNotificationEmail}`}><span aria-hidden="true">✉</span> {trialNotificationEmail}</a>
            <a
              className="footer-location"
              href="https://www.google.com/maps/place/Trinetra+sports+shooting+academy/@28.6021499,77.348953,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce520ecf60613:0xa5c0e9b7899f51dc!8m2!3d28.6021499!4d77.348953!16s%2Fg%2F11zh9hr_tz!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">⌖</span>
              <span>D-94B, Sector 55, Noida<br />Green Ribbon International School</span>
            </a>
          </address>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Trinetra Sports Shooting Academy. All rights reserved.</p>
          <a className="back-to-top" href="#home" aria-label="Back to top">↑</a>
        </div>
      </footer>

      <button
        type="button"
        className="trial-float-btn"
        onClick={() => setIsTrialPopupOpen(true)}
        aria-label="Open free trial popup"
      >
        Book Free Trial
      </button>

      {isTrialPopupOpen ? (
        <div className="trial-popup-overlay" role="dialog" aria-modal="true" aria-label="Book free trial">
          <div className="trial-popup-card">
            <p className="kicker">Free Trial Available</p>
            <h3>Book Your First Session</h3>
            <p>
              Start with a guided trial session and meet our instructors before full registration.
            </p>
            <div className="trial-popup-actions">
              <button type="button" className="btn btn-primary" onClick={openTrialFlowFromCta}>
                Book Free Trial
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsTrialPopupOpen(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedArticle ? (
        <div className="article-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="article-popup-title">
          <article className="article-popup-card">
            <button type="button" className="article-popup-close" onClick={() => setSelectedArticle(null)} aria-label="Close article">×</button>
            <img src={selectedArticle.image} alt="Shooting academy blog article" />
            <div className="article-popup-content">
              <p className="update-keyword">{selectedArticle.keyword}</p>
              <h2 id="article-popup-title">{selectedArticle.summary.split(/\n\s*\n/)[0]}</h2>
              {selectedArticle.content.map((section, index) => (
                <section key={section.heading ?? index} className="article-content-section">
                  {section.heading ? <h3>{section.heading}</h3> : null}
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.points ? (
                    <div className="article-points">
                      {section.points.map(([title, detail]) => (
                        <div key={title}>
                          <h4>{title}</h4>
                          <p>{detail}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                  {section.cycle ? <p className="training-cycle">{section.cycle}</p> : null}
                </section>
              ))}
              {selectedArticle.link ? (
                <a className="article-source-link" href={selectedArticle.link} target="_blank" rel="noreferrer">
                  View the original article source &rarr;
                </a>
              ) : null}
            </div>
          </article>
        </div>
      ) : null}

    </div>
  )
}

export default App
