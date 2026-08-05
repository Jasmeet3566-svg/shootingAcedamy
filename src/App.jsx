import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import heroFallback from './assets/hero.png'

const trialSlots = [
  {
    id: 'slot-mon-beginner',
    label: 'Mon 6:00 PM - Beginner Marksmanship',
    day: 'Monday',
    time: '6:00 PM - 7:00 PM',
    program: 'Beginner Marksmanship',
    capacity: 6,
  },
  {
    id: 'slot-wed-tactical',
    label: 'Wed 6:30 PM - Tactical Pistol Track',
    day: 'Wednesday',
    time: '6:30 PM - 7:30 PM',
    program: 'Tactical Pistol Track',
    capacity: 5,
  },
  {
    id: 'slot-sat-competition',
    label: 'Sat 9:00 AM - Competition Prep Lab',
    day: 'Saturday',
    time: '9:00 AM - 10:00 AM',
    program: 'Competition Prep Lab',
    capacity: 4,
  },
]

const storageKey = 'shooting-acad-workflow-v1'
const flowActions = ['trial', 'registration', 'enroll']

function App() {
  const carouselImages = [
    '/gallery/shot-4.jpeg',
    '/gallery/shot-3.jpeg',
    '/gallery/shot-2.jpeg',
    '/gallery/shot-1.jpeg',
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    registrations: [],
    enrollments: [],
  })

  const [trialForm, setTrialForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    slotId: trialSlots[0].id,
  })

  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    emergencyContact: '',
    waiverAccepted: false,
  })

  const [enrollmentForm, setEnrollmentForm] = useState({
    fullName: '',
    email: '',
    batch: 'Batch A - Evening',
    plan: '8 Weeks Foundation',
    paymentStatus: 'pending',
  })

  const [feedback, setFeedback] = useState({
    trial: '',
    registration: '',
    enrollment: '',
  })

  const [activeFlow, setActiveFlow] = useState('trial')
  const trialFormRef = useRef(null)
  const registrationFormRef = useRef(null)
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

  const slotStats = useMemo(() => {
    return trialSlots.map((slot) => {
      const confirmed = workflowData.trialBookings.filter(
        (booking) => booking.slotId === slot.id && booking.status === 'Trial Confirmed',
      ).length
      const waitlisted = workflowData.trialBookings.filter(
        (booking) => booking.slotId === slot.id && booking.status === 'Waitlisted',
      ).length

      return {
        ...slot,
        confirmed,
        waitlisted,
        seatsLeft: Math.max(slot.capacity - confirmed, 0),
      }
    })
  }, [workflowData.trialBookings])

  const registrationCount = workflowData.registrations.length
  const enrolledCount = workflowData.enrollments.filter((item) => item.status === 'Enrolled').length
  const pendingPaymentCount = workflowData.enrollments.filter(
    (item) => item.status === 'Enrollment Pending Payment',
  ).length

  const currentStep = useMemo(() => {
    if (enrolledCount > 0 || pendingPaymentCount > 0) {
      return 3
    }

    if (registrationCount > 0) {
      return 2
    }

    return 1
  }, [enrolledCount, pendingPaymentCount, registrationCount])

  const stepperItems = [
    { id: 1, title: 'Trial' },
    { id: 2, title: 'Registration' },
    { id: 3, title: 'Enrollment' },
  ]

  const selectedTrialSlot = slotStats.find((slot) => slot.id === trialForm.slotId)
  const liveCandidateName =
    enrollmentForm.fullName || registrationForm.fullName || trialForm.fullName || 'Not provided yet'
  const liveCandidateEmail =
    enrollmentForm.email || registrationForm.email || trialForm.email || 'Not provided yet'

  function updateFlowUrl(flow) {
    const url = new URL(window.location.href)
    url.searchParams.set('action', flow)
    window.history.replaceState({}, '', url)
  }

  function scrollToFlow(flow) {
    const flowRefMap = {
      trial: trialFormRef,
      registration: registrationFormRef,
      enroll: enrollmentFormRef,
    }

    const targetRef = flowRefMap[flow]
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleFlowSelect(flow) {
    setActiveFlow(flow)
    updateFlowUrl(flow)
    scrollToFlow(flow)
  }

  function handleTrialBooking(event) {
    event.preventDefault()

    const selectedSlot = slotStats.find((slot) => slot.id === trialForm.slotId)
    if (!selectedSlot) {
      setFeedback((prev) => ({ ...prev, trial: 'Selected slot not found. Please try again.' }))
      return
    }

    const status = selectedSlot.seatsLeft > 0 ? 'Trial Confirmed' : 'Waitlisted'
    const trialId = `TRIAL-${Date.now()}`

    setWorkflowData((prev) => ({
      ...prev,
      trialBookings: [
        ...prev.trialBookings,
        {
          trialId,
          fullName: trialForm.fullName,
          email: trialForm.email,
          phone: trialForm.phone,
          slotId: selectedSlot.id,
          slotLabel: selectedSlot.label,
          status,
        },
      ],
    }))

    setFeedback((prev) => ({
      ...prev,
      trial:
        status === 'Trial Confirmed'
          ? `Booked successfully. Your trial ID is ${trialId}.`
          : `Slot is full. You are added to waitlist with ID ${trialId}.`,
    }))
    handleFlowSelect('registration')

    setRegistrationForm((prev) => ({
      ...prev,
      fullName: trialForm.fullName,
      email: trialForm.email,
    }))

    setEnrollmentForm((prev) => ({
      ...prev,
      fullName: trialForm.fullName,
      email: trialForm.email,
    }))

    setTrialForm((prev) => ({
      ...prev,
      fullName: '',
      email: '',
      phone: '',
    }))
  }

  function handleRegistration(event) {
    event.preventDefault()

    if (!registrationForm.waiverAccepted) {
      setFeedback((prev) => ({
        ...prev,
        registration: 'Please accept the safety waiver before registration.',
      }))
      return
    }

    const hasTrial = workflowData.trialBookings.some(
      (booking) => booking.email.toLowerCase() === registrationForm.email.toLowerCase(),
    )

    if (!hasTrial) {
      setFeedback((prev) => ({
        ...prev,
        registration: 'No trial record found for this email. Book a trial first.',
      }))
      return
    }

    setWorkflowData((prev) => ({
      ...prev,
      registrations: [
        ...prev.registrations,
        {
          registrationId: `REG-${Date.now()}`,
          fullName: registrationForm.fullName,
          email: registrationForm.email,
          emergencyContact: registrationForm.emergencyContact,
          status: 'Registered',
        },
      ],
    }))

    setFeedback((prev) => ({
      ...prev,
      registration: 'Registration completed. Candidate moved to Registered stage.',
    }))
    handleFlowSelect('enroll')
  }

  function handleEnrollment(event) {
    event.preventDefault()

    const hasRegistration = workflowData.registrations.some(
      (item) => item.email.toLowerCase() === enrollmentForm.email.toLowerCase(),
    )

    if (!hasRegistration) {
      setFeedback((prev) => ({
        ...prev,
        enrollment: 'No registration found for this email. Complete registration first.',
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
          email: enrollmentForm.email,
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
          <p className="brand">IRON SIGHT ACADEMY</p>
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
          <p className="muted">Phone: +1 (555) 014-8899 | Email: admissions@ironsightacademy.com</p>
        </div>
        <a className="btn btn-primary" href="#admissions">
          Reserve Your Spot
        </a>
      </section>

      <section className="section qr-actions" aria-label="Admissions quick actions">
        <p className="kicker">Scan And Choose</p>
        <h2>Open The Right Flow Instantly</h2>
        <p className="muted">Use one QR link and let each person pick Trial, Registration, or Enrollment.</p>
        <div className="flow-actions">
          <button
            type="button"
            className={activeFlow === 'trial' ? 'flow-chip is-active' : 'flow-chip'}
            onClick={() => handleFlowSelect('trial')}
          >
            Schedule Trial
          </button>
          <button
            type="button"
            className={activeFlow === 'registration' ? 'flow-chip is-active' : 'flow-chip'}
            onClick={() => handleFlowSelect('registration')}
          >
            Registration
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
            <h2>Trial Scheduling, Registration, and Enrollment</h2>
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

          <div className="slot-grid">
            {slotStats.map((slot) => (
              <article key={slot.id} className="slot-card">
                <p className="level">{slot.day}</p>
                <h3>{slot.program}</h3>
                <p>{slot.time}</p>
                <strong>{slot.seatsLeft} seats left</strong>
                <span>{slot.waitlisted} on waitlist</span>
              </article>
            ))}
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
                  <h3>Schedule Trial</h3>
                  <p className="workflow-help">Choose a slot and reserve your trial attempt.</p>
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
                  Email
                  <input
                    required
                    type="email"
                    placeholder="name@email.com"
                    value={trialForm.email}
                    onChange={(event) =>
                      setTrialForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Trial Slot
                  <select
                    value={trialForm.slotId}
                    onChange={(event) =>
                      setTrialForm((prev) => ({ ...prev, slotId: event.target.value }))
                    }
                  >
                    {slotStats.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label} ({slot.seatsLeft} seats)
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn btn-primary" type="submit">
                  Confirm Trial
                </button>
                {feedback.trial ? <p className="form-note">{feedback.trial}</p> : null}
              </form>

              <form
                ref={registrationFormRef}
                id="registration-flow"
                className={activeFlow === 'registration' ? 'workflow-card is-focused' : 'workflow-card'}
                onSubmit={handleRegistration}
              >
                <div className="workflow-card-head">
                  <p className="workflow-step">Step 2</p>
                  <h3>Registration</h3>
                  <p className="workflow-help">Capture safety and contact details after trial booking.</p>
                </div>
                <label>
                  Full Name
                  <input
                    required
                    placeholder="Enter candidate name"
                    value={registrationForm.fullName}
                    onChange={(event) =>
                      setRegistrationForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    placeholder="name@email.com"
                    value={registrationForm.email}
                    onChange={(event) =>
                      setRegistrationForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Emergency Contact
                  <input
                    required
                    placeholder="Emergency phone number"
                    value={registrationForm.emergencyContact}
                    onChange={(event) =>
                      setRegistrationForm((prev) => ({ ...prev, emergencyContact: event.target.value }))
                    }
                  />
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={registrationForm.waiverAccepted}
                    onChange={(event) =>
                      setRegistrationForm((prev) => ({
                        ...prev,
                        waiverAccepted: event.target.checked,
                      }))
                    }
                  />
                  I accept the range safety waiver.
                </label>
                <button className="btn btn-primary" type="submit">
                  Complete Registration
                </button>
                {feedback.registration ? <p className="form-note">{feedback.registration}</p> : null}
              </form>

              <form
                ref={enrollmentFormRef}
                id="enroll-flow"
                className={activeFlow === 'enroll' ? 'workflow-card is-focused' : 'workflow-card'}
                onSubmit={handleEnrollment}
              >
                <div className="workflow-card-head">
                  <p className="workflow-step">Step 3</p>
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
                  Email
                  <input
                    required
                    type="email"
                    placeholder="name@email.com"
                    value={enrollmentForm.email}
                    onChange={(event) =>
                      setEnrollmentForm((prev) => ({ ...prev, email: event.target.value }))
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
                  <span>Email</span>
                  <strong>{liveCandidateEmail}</strong>
                </div>
                <div>
                  <span>Selected Slot</span>
                  <strong>{selectedTrialSlot ? selectedTrialSlot.label : 'No slot selected'}</strong>
                </div>
                <div>
                  <span>Seat Availability</span>
                  <strong>
                    {selectedTrialSlot
                      ? `${selectedTrialSlot.seatsLeft} seats left / ${selectedTrialSlot.waitlisted} waitlisted`
                      : 'Not available'}
                  </strong>
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

    </div>
  )
}

export default App
