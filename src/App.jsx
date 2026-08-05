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
const trialNotificationEmail = 'jasmeetdahiya3566@gmail.com'

function App() {
  const carouselImages = [
    '/gallery/shot-5.jpeg',
    '/gallery/shot-3.jpeg',
    '/gallery/shot-2.jpeg',
    '/gallery/shot-4.jpeg',
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false)

  const programs = [
    {
      title: 'Beginner Marksmanship',
      level: 'Level 01',
      detail: 'Safety-first training, grip, stance, and controlled trigger drills for new shooters.',
    },
    {
      title: 'Tactical Pistol Track',
      level: 'Level 02',
      detail: 'Holster work, movement, reload speed, and pressure-tested decision exercises.',
    },
    {
      title: 'Competition Prep Lab',
      level: 'Level 03',
      detail: 'Stage planning, split-time improvement, and match-day routines for serious athletes.',
    },
  ]

  const schedule = [
    { day: 'Monday', slot: '6:00 PM - 8:00 PM', focus: 'Fundamentals + Safety' },
    { day: 'Wednesday', slot: '6:00 PM - 8:30 PM', focus: 'Dynamic Range Drills' },
    { day: 'Saturday', slot: '8:00 AM - 11:00 AM', focus: 'Scenario & Competition Blocks' },
  ]

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
  const liveCandidateName =
    enrollmentForm.fullName || trialForm.fullName || 'Not provided yet'
  const liveCandidatePhone = enrollmentForm.phone || trialForm.phone || 'Not provided yet'

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
              <a href="#schedule" onClick={() => setIsMenuOpen(false)}>
                Schedule
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
                Explore Programs
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
          <p className="muted">Phone: +1 (555) 014-8899 | Email: admissions@trinetrasportsacademy.com</p>
        </div>
        <a className="btn btn-primary" href="#admissions">
          Reserve Your Spot
        </a>
      </section>

      <section className="section qr-actions" aria-label="Admissions quick actions">
        <p className="kicker">Scan And Choose</p>
        <h2>Open The Right Flow Instantly</h2>
        <p className="muted">Use one QR link and let each person pick Trial Registration or Enrollment.</p>
        <div className="flow-actions">
          <button
            type="button"
            className={activeFlow === 'trial' ? 'flow-chip is-active' : 'flow-chip'}
            onClick={() => handleFlowSelect('trial')}
          >
            Trial Registration
          </button>
          <button
            type="button"
            className={activeFlow === 'enroll' ? 'flow-chip is-active' : 'flow-chip'}
            onClick={() => handleFlowSelect('enroll')}
          >
            Enrollment
          </button>
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

      <main>
        <section className="section" id="coaches">
          <div className="section-head">
            <p className="kicker">Instruction Team</p>
            <h2>Meet Your Coaches</h2>
          </div>
          <div className="coach-grid">
            <article>
              <h3>Coach Aarav Singh</h3>
              <p>Former national-level competitor focused on speed + accuracy under pressure.</p>
            </article>
            <article>
              <h3>Coach Maya Thompson</h3>
              <p>Specialist in first-time shooter confidence and defensive fundamentals.</p>
            </article>
            <article>
              <h3>Coach Daniel Cruz</h3>
              <p>Range safety lead and tactical movement instructor with 12+ years experience.</p>
            </article>
          </div>
        </section>

        <section className="section" id="programs">
          <div className="section-head">
            <p className="kicker">Training Paths</p>
            <h2>Programs Built For Real Progress</h2>
          </div>
          <div className="card-grid">
            {programs.map((program) => (
              <article key={program.title} className="program-card">
                <p className="level">{program.level}</p>
                <h3>{program.title}</h3>
                <p>{program.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="schedule">
          <div>
            <p className="kicker">Weekly Rhythm</p>
            <h2>Consistent Schedule, Serious Results</h2>
            <p className="muted">
              Every class mixes technical fundamentals with practical drills. Small groups ensure
              direct instructor feedback for each shooter.
            </p>
          </div>
          <div className="schedule-board">
            {schedule.map((item) => (
              <div key={item.day} className="schedule-item">
                <p>{item.day}</p>
                <span>{item.slot}</span>
                <strong>{item.focus}</strong>
              </div>
            ))}
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

          <div className="admissions-layout">
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
                      placeholder="+1 000 000 0000"
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
                    placeholder="+1 000 000 0000"
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

            <aside className="summary-card" aria-label="Live admissions summary">
              <h3>Live Summary</h3>
              <p className="summary-tag">Current flow status</p>

              <div className="summary-list">
                <div>
                  <span>Candidate</span>
                  <strong>{liveCandidateName}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{liveCandidatePhone}</strong>
                </div>
                <div>
                  <span>Trial Day</span>
                  <strong>{trialForm.trialDay}</strong>
                </div>
                <div>
                  <span>Trial Time</span>
                  <strong>{trialForm.trialTime}</strong>
                </div>
                <div>
                  <span>Batch Plan</span>
                  <strong>{enrollmentForm.batch}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>
                    {enrollmentForm.paymentStatus === 'paid' ? 'Paid - Ready to Enroll' : 'Pending Payment'}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

      </main>

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

    </div>
  )
}

export default App
