import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import ShopApp from "./ShopApp";
import PublicSite from "./PublicSite";

const A = "https://ext.same-assets.com/112859462/";
const hero = "https://cdn.prod.website-files.com/67630d23fb8afbdf78cb8447/6aa18b21f8065644cb474f00_6a9b2b772d5043d7a5ab5a31_1.%20Hero%20image%20v9A.webp";
const storyImages = [
  "https://cdn.prod.website-files.com/678cca1dba65076a9fd94f2d/678fd231073615318a9ab2e1_646d375d23b571cd5e48a289_hero.webp",
  "https://cdn.prod.website-files.com/678cca1dba65076a9fd94f2d/678fd2319c8e6148abf0486c_64d1322c5aabdaa695580587_rush-automotive.webp",
];

const productGroups = [
  { title: "Run your shop", links: [["Shop Management", "/feature/shop-management"], ["Digital Vehicle Inspections", "/feature/digital-vehicle-inspection"], ["Estimate Building", "/feature/estimate-building"], ["Parts & Inventory", "/feature/inventory"], ["Real-time Reporting", "/feature/real-time-reporting"], ["Multi-Shop Management", "/feature/multi-shop"], ["Tire Management", "/feature/tire-suite"]] },
  { title: "Secure payments", links: [["My Car Care Payments", "/feature/payments"], ["Payment Processing", "/feature/payment-processing"], ["Digital Invoicing", "/feature/invoices"], ["Text-to-Pay", "/feature/text-to-pay"], ["Buy Now, Pay Later", "/feature/buy-now-pay-later"], ["Capital Financing", "/feature/capital-financing"]] },
  { title: "Engage customers", links: [["My Car Care Marketing", "/feature/crm-marketing"], ["Online Booking", "/feature/scheduling"], ["Automated Reminders", "/feature/automated-reminders"], ["Scheduled Campaigns", "/feature/scheduled-campaigns"], ["Two-Way Texting", "/feature/two-way-texting"], ["Google Reviews", "/feature/google-reviews"], ["Websites", "/feature/websites"]] },
];
const resourceLinks = [["Blog", "/blog"], ["Webinars", "/webinars"], ["Live Events", "/events"], ["Customer Stories", "/success-stories"], ["Downloads", "/downloads"], ["Under The Lift", "/under-the-lift"], ["Integrations", "/integrations"], ["Support", "/support"], ["Refer a Friend", "/refer-a-friend"], ["Partners", "/partners"]];
const companyLinks = [["About Us", "/about"], ["Leadership", "/leadership"], ["Customer Reviews", "/customer-reviews"], ["Press", "/press"], ["Careers", "/careers"], ["Contact Us", "/contact"]];

const featureMap: Record<string, { label: string; title: string; text: string; image: string; stat: string }> = {
  "shop-management": { label: "AUTOMOTIVE SHOP MANAGEMENT SOFTWARE", title: "Fewer bottlenecks. Fuller bays. Happier customers.", text: "Bring estimates, repair orders, inspections, inventory, and reporting into one connected workspace—so your team can move faster and customers always know what comes next.", image: `${A}1709013283.png`, stat: "15,000+ shops trust My Car Care" },
  "digital-vehicle-inspection": { label: "DIGITAL VEHICLE INSPECTIONS", title: "Show customers exactly what you see.", text: "Build clear, visual inspections with photos, videos, and technician notes. Send results by text or email and get approvals while the vehicle is still on the lift.", image: `${A}1709013283.png`, stat: "More transparency. Faster approvals." },
  "estimate-building": { label: "ESTIMATE BUILDING SOFTWARE", title: "A complete estimate in under 30 seconds.", text: "Smart Jobs brings vehicle-specific labor times, canned jobs, and parts into each estimate, helping service advisors quote accurately and confidently.", image: `${A}3439154894.png`, stat: "Quote faster, without cutting corners." },
  inventory: { label: "PARTS & INVENTORY", title: "The right part. Right when you need it.", text: "Order parts from the repair order, compare vendors, track inventory automatically, and get low-stock alerts before a technician reaches for an empty shelf.", image: `${A}2120123393.png`, stat: "Keep every bay moving." },
  "real-time-reporting": { label: "REAL-TIME REPORTING", title: "Know your numbers. Grow with confidence.", text: "See car count, average repair order, close ratios, labor margins, and technician efficiency in real time—from the counter, couch, or road.", image: `${A}2453205694.png`, stat: "One view of every shop metric." },
  "tire-suite": { label: "MY CAR CARE TIRE SUITE", title: "Tire sales without the extra systems.", text: "Handle fitment, ordering, inventory, pricing, and DOT registration inside the same platform your team already uses for every repair order.", image: `${A}3219406714.png`, stat: "Built for complete tire workflows." },
  "multi-shop": { label: "MULTI-SHOP MANAGEMENT", title: "Every location can run like your best one.", text: "Standardize inspections, pricing, permissions, and workflows. Compare performance across your organization and make your next acquisition easier to onboard.", image: `${A}2807810208.png`, stat: "One login. Every location." },
  payments: { label: "MY CAR CARE PAYMENTS", title: "Faster invoices. Faster approvals. Faster payments.", text: "Simplify checkout, accelerate cash flow, and keep reconciliation automatic with payments built directly into your shop management system.", image: `${A}3333699680.png`, stat: "Payments that stay in sync." },
  "payment-processing": { label: "PAYMENT PROCESSING", title: "Make every checkout fast and flexible.", text: "Accept cards, Apple Pay, Google Pay, and remote payments from one fully integrated point-of-sale experience.", image: `${A}3333699680.png`, stat: "A smoother finish to every visit." },
  invoices: { label: "DIGITAL INVOICING", title: "Send the invoice. Get paid anywhere.", text: "Share secure invoices by text or email. Customers can review work and pay from any device, while every transaction reconciles automatically.", image: `${A}2667721802.png`, stat: "Clear invoices. Quicker cash flow." },
  "text-to-pay": { label: "TEXT-TO-PAY", title: "Payment is one text away.", text: "Send a secure payment link as soon as work is complete and stop chasing customers who planned to call back with a card number.", image: `${A}3907715698.png`, stat: "Remove friction from payment." },
  "buy-now-pay-later": { label: "BUY NOW, PAY LATER", title: "Make unexpected repairs manageable.", text: "Give qualified customers flexible payment options while your shop gets paid—turning deferred work into approved work.", image: `${A}2647870422.png`, stat: "More approvals. Less sticker shock." },
  "capital-financing": { label: "CAPITAL FINANCING", title: "Invest in your shop on your timeline.", text: "Access financing for parts, equipment, hiring, and expansion directly through My Car Care Payments.", image: `${A}2160666871.png`, stat: "Fuel the next stage of growth." },
  "crm-marketing": { label: "AUTO REPAIR MARKETING SOFTWARE", title: "Turn great service into repeat business.", text: "Keep your bays full with booking, reminders, reviews, texting, campaigns, and a high-performing website—all connected to your customer history.", image: `${A}3332097680.png`, stat: "Marketing that works while you work." },
  scheduling: { label: "ONLINE SCHEDULING", title: "Let customers book around the clock.", text: "Turn website visits into appointments. Availability updates in real time and every booking lands directly on your shop calendar.", image: `${A}3332097680.png`, stat: "Open for appointments 24/7." },
  "automated-reminders": { label: "AUTOMATED REMINDERS", title: "Fewer no-shows. No extra effort.", text: "Send timely, personalized appointment and service reminders automatically from the platform your team already uses.", image: `${A}4110022391.png`, stat: "Stay helpful without staying busy." },
  "scheduled-campaigns": { label: "SCHEDULED CAMPAIGNS", title: "Fill the calendar before bays go quiet.", text: "Reach the customers most likely to book with targeted text and email campaigns built from real service history.", image: `${A}1450829501.png`, stat: "Right message. Right customer." },
  "two-way-texting": { label: "TWO-WAY TEXTING", title: "Keep every conversation moving.", text: "Approvals, questions, photos, and updates flow through a shared inbox, so your whole team has the context to respond.", image: `${A}2935920627.png`, stat: "One inbox for the whole shop." },
  "google-reviews": { label: "GOOGLE REVIEWS", title: "Let great service build your reputation.", text: "Automatically ask happy customers for a review after checkout and track your growing reputation without adding another task.", image: `${A}768822782.png`, stat: "More trust where customers search." },
  websites: { label: "AUTO REPAIR WEBSITES", title: "A website built to bring cars through the door.", text: "Get a professional, search-optimized shop website with online scheduling, mobile performance, and expert support.", image: `${A}498165145.png`, stat: "Look sharp. Get found. Book work." },
};

function go(path: string) { history.pushState({}, "", path); window.dispatchEvent(new PopStateEvent("popstate")); }
function Link({ to, children, className = "", onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const external = to.startsWith("http");
  return <a href={to} className={className} onClick={external ? onClick : (e) => { e.preventDefault(); onClick?.(); go(to); }}>{children}</a>;
}
function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }
function CTA({ light = false, children = "Get started", to = "/book-a-demo-my-car-care" }: { light?: boolean; children?: ReactNode; to?: string }) {
  return <Link to={to} className={`button ${light ? "button-light" : ""}`}>{children}<Arrow /></Link>;
}

function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const close = () => { setOpen(null); setMobile(false); };
  return <header className="header">
    <div className="nav-shell">
      <Link to="/" onClick={close} className="brand"><img src="/MY_CAR_CARE_LOGO_Png-FIle-Without-background.png" alt="My Car Care Auto Service Center" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <button onClick={() => setOpen(open === "product" ? null : "product")}>Product <span>⌄</span></button>
        <Link to="/pricing">Pricing</Link>
        <button onClick={() => setOpen(open === "resources" ? null : "resources")}>Resources <span>⌄</span></button>
        <button onClick={() => setOpen(open === "about" ? null : "about")}>About <span>⌄</span></button>
      </nav>
      <div className="nav-actions"><Link to="/app/dashboard">Shop app</Link><CTA /></div>
      <button className="menu-button" aria-label="Toggle menu" onClick={() => setMobile(!mobile)}>{mobile ? "Close" : "Menu"}</button>
    </div>
    {open && <div className="mega" onMouseLeave={() => setOpen(null)}>
      {open === "product" && <div className="mega-grid product-grid">
        {productGroups.map(g => <div key={g.title}><p className="eyebrow">{g.title}</p>{g.links.map(([n, p]) => <Link key={p} to={p} onClick={close}>{n}<span>↗</span></Link>)}</div>)}
        <div className="mega-side"><p className="eyebrow">Shop tools</p><Link to="/mobile-app">Mobile app</Link><Link to="/integrations">Integrations</Link><Link to="/roi-calculator">ROI calculator</Link><p className="eyebrow shop-type">Shop types</p><Link to="/independent-auto-repair">Independent auto repair</Link><Link to="/multi-location">Multi-location</Link></div>
      </div>}
      {open === "resources" && <div className="mega-grid link-grid">{resourceLinks.map(([n, p]) => <Link key={p} to={p} onClick={close}><b>{n}</b><small>Insights and tools for better shops.</small></Link>)}</div>}
      {open === "about" && <div className="mega-grid link-grid">{companyLinks.map(([n, p]) => <Link key={p} to={p} onClick={close}><b>{n}</b><small>Learn more about My Car Care.</small></Link>)}</div>}
    </div>}
    {mobile && <div className="mobile-nav">
      <p className="eyebrow">Product</p>{productGroups.flatMap(g => g.links).slice(0, 10).map(([n, p]) => <Link key={p} to={p} onClick={close}>{n}</Link>)}
      <p className="eyebrow">Explore</p><Link to="/pricing" onClick={close}>Pricing</Link><Link to="/blog" onClick={close}>Resources</Link><Link to="/about" onClick={close}>About us</Link><Link to="/contact" onClick={close}>Contact</Link>
      <CTA>Book a demo</CTA>
    </div>}
  </header>;
}

const shopCards = [
  ["Digital vehicle inspections", "Send visual inspection results and get approvals while the vehicle is still on the lift.", "1709013283.png", "/feature/digital-vehicle-inspection"],
  ["Estimate building", "Build accurate estimates fast with vehicle-specific labor times and parts.", "3439154894.png", "/feature/estimate-building"],
  ["Parts & inventory", "Order parts from the repair order and let inventory update itself.", "2120123393.png", "/feature/inventory"],
  ["Real-time reporting", "See the numbers that matter as work moves through the shop.", "2453205694.png", "/feature/real-time-reporting"],
  ["Tire suite", "Handle fitment, ordering, inventory, and registration in one place.", "3219406714.png", "/feature/tire-suite"],
  ["Multi-shop management", "Standardize your operation and scale your best processes.", "2807810208.png", "/feature/multi-shop"],
];
const payCards = [["Payment processing", "Cards, digital wallets, and remote payments in one flow.", "3333699680.png", "/feature/payment-processing"], ["Digital invoicing", "Secure invoices delivered by text or email.", "2667721802.png", "/feature/invoices"], ["Text-to-Pay", "Send a payment link the minute work is done.", "3907715698.png", "/feature/text-to-pay"], ["Buy now, pay later", "Make an unexpected repair easier to manage.", "2647870422.png", "/feature/buy-now-pay-later"], ["Capital financing", "Fund equipment, parts, and your next stage of growth.", "2160666871.png", "/feature/capital-financing"]];
const marketCards = [["Online scheduling", "Customers book online day or night.", "3332097680.png", "/feature/scheduling"], ["Automated reminders", "Reduce no-shows without adding work.", "4110022391.png", "/feature/automated-reminders"], ["Scheduled campaigns", "Send the right message to the right list.", "1450829501.png", "/feature/scheduled-campaigns"], ["Two-way texting", "Keep customer communication in one inbox.", "2935920627.png", "/feature/two-way-texting"], ["Google reviews", "Turn a great visit into a stronger reputation.", "768822782.png", "/feature/google-reviews"], ["Website development", "A fast, professional website built to book.", "498165145.png", "/feature/websites"]];

function CardRow({ cards }: { cards: string[][] }) {
  return <div className="card-row">{cards.map(([title, text, img, path]) => <Link to={path} className="feature-card" key={title}><div className="card-image"><img src={A + img} alt="" /></div><h3>{title}</h3><p>{text}</p><span className="text-link">Learn more <Arrow /></span></Link>)}</div>;
}
function ProductBand({ label, title, text, cards, image, dark = false, to }: { label: string; title: string; text: string; cards: string[][]; image: string; dark?: boolean; to: string }) {
  return <section className={`product-band ${dark ? "dark" : ""}`}>
    <div className="section-head"><div><p className="eyebrow">{label}</p><h2>{title}</h2></div><div><p>{text}</p><CTA light={dark} to={to}>Explore {label.toLowerCase()}</CTA></div></div>
    <CardRow cards={cards} /><div className="wide-image"><img src={image} alt="My Car Care in an auto repair shop" /></div>
  </section>;
}

function Home() {
  return <main>
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow">All-in-one auto repair software</p><h1>Bring every part<br />of your shop <em>together.</em></h1><p>Run your shop, get paid, and keep customers coming back—all from one connected platform.</p><CTA>Book your free demo</CTA></div>
      <div className="hero-photo"><img src={hero} alt="Automotive mechanic using My Car Care" /><div className="photo-tag"><b>One login.</b><span>One lifelong partner.</span></div></div>
    </section>
    <section className="manifesto"><p className="eyebrow">Built for the people behind the bays</p><h2>Auto repair.<br /><em>Done right.</em></h2><div className="manifesto-copy"><p>Auto repair shops deserve more than disconnected tools. That’s why we built the industry-leading platform trusted by more than 15,000 shops nationwide.</p><CTA>Get started</CTA></div></section>
    <section className="three-pillars"><div><span>01</span><h3>Run your shop</h3></div><div><span>02</span><h3>Secure payments</h3></div><div><span>03</span><h3>Engage customers</h3></div></section>
    <ProductBand label="Shop management" title="Fewer bottlenecks. Fuller bays. Happier customers." text="Bring your operations into one place so your team can move faster, serve customers better, and keep bays full." cards={shopCards} image="https://cdn.prod.website-files.com/67630d23fb8afbdf78cb8447/6aa18c07cfda8959498e7a06_2.%20Shop%20management%20image%20v4.webp" to="/feature/shop-management" />
    <ProductBand dark label="My Car Care payments" title="Faster invoices. Faster approvals. Faster payments." text="Protect your revenue with a smarter way to collect, reconcile, and keep cash flowing." cards={payCards} image="https://cdn.prod.website-files.com/67630d23fb8afbdf78cb8447/6aa18c07be72b234d5ab57c5_3.%20Payments%20image%20v4-2.webp" to="/feature/payments" />
    <ProductBand label="My Car Care marketing" title="Turn great service into repeat business." text="Booking, reminders, reviews, and campaigns work around the clock, right from My Car Care." cards={marketCards} image="https://cdn.prod.website-files.com/67630d23fb8afbdf78cb8447/6aa18c082d124b066681e072_4.%20Marketing%20image%20v3.webp" to="/feature/crm-marketing" />
    <Stories />
  </main>;
}

function Stories() { return <section className="stories"><p className="eyebrow">Customer stories</p><div className="section-title-row"><h2>Shop owners know<br />what works.</h2><Link to="/success-stories" className="text-link">See every story <Arrow /></Link></div><div className="story-grid">{[["Garagisti", "A customer experience built for the next generation."], ["Rush Automotive", "How a growing enterprise accelerated performance."]].map((s, i) => <Link to="/success-stories" className="story" key={s[0]}><img src={storyImages[i]} alt=""/><div><p className="eyebrow">{s[0]}</p><h3>{s[1]}</h3><span>Read story <Arrow /></span></div></Link>)}</div></section>; }

function FeaturePage({ data }: { data: (typeof featureMap)[string] }) {
  return <main><section className="inner-hero"><div><p className="eyebrow">{data.label}</p><h1>{data.title}</h1><p>{data.text}</p><CTA>See My Car Care in action</CTA></div><div className="product-frame"><img src={data.image} alt="My Car Care product interface" /></div></section>
    <section className="stat-strip"><p>{data.stat}</p><div><b>15,000+</b><span>shops nationwide</span></div><div><b>4.8/5</b><span>customer rating</span></div></section>
    <section className="benefits"><p className="eyebrow">Built to move work forward</p><h2>Less busywork.<br />More business.</h2><div className="benefit-grid">{[["Connected by design", "Every action updates the same system, so your team always works from current information."], ["Easy for the whole team", "A fast, intuitive workflow helps new hires contribute sooner and experienced staff move quicker."], ["Support that knows shops", "Real people are ready to help, backed by deep experience with the auto repair industry."]].map((b, i) => <div key={b[0]}><span>0{i + 1}</span><h3>{b[0]}</h3><p>{b[1]}</p></div>)}</div></section><CTASection /></main>;
}

const pageInfo: Record<string, [string, string, string]> = {
  "/mobile-app": ["MY CAR CARE MOBILE", "Your shop goes wherever you do.", "Check performance, follow repair orders, and stay connected to your business from the palm of your hand."],
  "/independent-auto-repair": ["INDEPENDENT AUTO REPAIR", "Built for your shop. Backed for your future.", "Get the tools and lifelong partnership to build a healthier, more valuable auto repair business."],
  "/multi-location": ["MULTI-LOCATION SHOPS", "Grow without losing what makes you great.", "Create consistency across locations, compare performance, and scale your operating playbook."],
  "/under-the-lift": ["UNDER THE LIFT", "Stories from the automotive frontier.", "Meet the people, ideas, and shops moving the repair industry forward."],
  "/support": ["MY CAR CARE SUPPORT", "Real people. Ready when you need us.", "Find answers, learn the platform, and get help from a support team that understands auto repair."],
  "/refer-a-friend": ["REFER A FRIEND", "Great shops know great shops.", "Share My Car Care with another shop owner and unlock rewards when they join the community."],
  "/partners": ["PARTNER PROGRAM", "Better together, by design.", "Partner with My Car Care to create more value for auto repair shops and the customers they serve."],
  "/about": ["ABOUT MY CAR CARE", "Building a brighter future for auto repair.", "We help shop owners create exceptional experiences, stronger businesses, and lasting relationships."],
  "/leadership": ["OUR LEADERSHIP", "Driven by people who believe in shops.", "Our leadership team brings technology, automotive, and customer experience together around one mission."],
  "/customer-reviews": ["CUSTOMER REVIEWS", "Fueled by happy customers.", "Hear directly from the shop owners, service advisors, and technicians who use My Car Care every day."],
  "/press": ["MY CAR CARE NEWSROOM", "The latest from My Car Care.", "Company news, industry coverage, product announcements, and media resources."],
  "/careers": ["CAREERS AT MY CAR CARE", "Build work that moves an industry.", "Join a team that loves building people, products, and lifelong relationships."],
};
function GeneralPage({ info, path }: { info: [string, string, string]; path: string }) {
  const isAbout = path === "/about" || path === "/careers";
  return <main><section className={`editorial-hero ${isAbout ? "orange-hero" : ""}`}><p className="eyebrow">{info[0]}</p><h1>{info[1]}</h1><p>{info[2]}</p><CTA light={isAbout}>{path === "/careers" ? "View open roles" : "Get started"}</CTA></section><section className="editorial-body"><div><p className="eyebrow">Why My Car Care</p><h2>Helping good shops become great businesses.</h2></div><div><p>We started by listening to the people who know auto repair best. That shop-first approach still shapes every product, partnership, and conversation.</p><p>Today, thousands of shops use My Car Care to spend less time wrestling with systems and more time serving customers, developing teams, and planning what comes next.</p></div></section><Stories /><CTASection /></main>;
}

const resources = [
  ["GUIDE", "The modern shop owner's guide to profitable growth", "Practical benchmarks and a clear plan for building a stronger operation."],
  ["WEBINAR", "Make every repair order more efficient", "See the workflows high-performing service teams use every day."],
  ["SHOP STORY", "How leading operators turn trust into growth", "An honest look at customer experience, team adoption, and better data."],
  ["REPORT", "The state of auto repair", "Fresh performance trends from thousands of repair shops nationwide."],
  ["ARTICLE", "Five numbers every shop owner should know", "Turn daily reporting into decisions your whole team understands."],
  ["EVENT", "Meet My Car Care on the road", "Connect with our team and the automotive community at an event near you."],
];
function ResourcePage({ kind }: { kind: string }) {
  const [filter, setFilter] = useState("All");
  const title = kind === "Blog" ? "Ideas for shops that keep moving." : kind === "Customer Stories" ? "Built by innovators. Proven by shops." : `Explore ${kind.toLowerCase()}.`;
  return <main><section className="listing-hero"><p className="eyebrow">MY CAR CARE {kind.toUpperCase()}</p><h1>{title}</h1><p>Insights, practical ideas, and real stories created for the people shaping auto repair.</p></section><section className="listing"><div className="filters">{["All", "Guide", "Webinar", "Story"].map(f => <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div><div className="resource-grid">{resources.filter(r => filter === "All" || r[0].includes(filter.toUpperCase())).map((r, i) => <article key={r[1]} className="resource-card"><div className={`resource-art art-${i}`}><span>{String(i + 1).padStart(2, "0")}</span></div><p className="eyebrow">{r[0]}</p><h2>{r[1]}</h2><p>{r[2]}</p><Link to={`/post/${r[1].toLowerCase().replace(/ /g, "-")}`} className="text-link">Read more <Arrow /></Link></article>)}</div></section></main>;
}

function Integrations() { const names = ["PartsTech", "CARFAX", "QuickBooks", "NAPA TRACS", "AutoZone", "Mitchell 1", "Kukui", "MyShopManager", "TireConnect"]; return <main><section className="editorial-hero"><p className="eyebrow">INTEGRATIONS</p><h1>Your favorite tools.<br />One connected shop.</h1><p>My Car Care works with the partners you already trust, connecting data and reducing repetitive work.</p><CTA>Explore My Car Care</CTA></section><section className="logo-cloud"><p className="eyebrow">Connected partners</p><div>{names.map(n => <span key={n}>{n}</span>)}</div></section><CTASection /></main>; }

function Pricing() {
  const [annual, setAnnual] = useState(true);
  const plans = [["Start", 179, "Essential shop management for teams ready to move beyond legacy systems."], ["Grow", 299, "Advanced tools for shops focused on performance and customer experience."], ["Scale", 399, "The complete platform for high-growth and multi-location operations."]];
  return <main><section className="listing-hero pricing-hero"><p className="eyebrow">SIMPLE, TRANSPARENT PRICING</p><h1>Choose the plan<br />that moves you forward.</h1><p>No contracts. No hidden fees. Just the tools your team needs and support you can count on.</p><div className="toggle"><button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>Annual <small>save 15%</small></button></div></section><section className="plans">{plans.map((p, i) => <div className={`plan ${i === 1 ? "featured" : ""}`} key={p[0]}>{i === 1 && <span className="popular">MOST POPULAR</span>}<p className="eyebrow">{p[0]}</p><p className="price"><sup>$</sup>{annual ? Math.round(Number(p[1]) * .85) : p[1]}<small>/month</small></p><p>{p[2]}</p><CTA light={i === 1}>Choose {p[0]}</CTA><ul><li>Unlimited users</li><li>Cloud-based shop management</li><li>Data migration support</li><li>Live customer support</li><li>Reporting and insights</li></ul></div>)}</section><FAQ /></main>;
}
function FAQ() { const [open, setOpen] = useState(0); const faqs = [["Is there a long-term contract?", "No. My Car Care plans are designed to earn your business every month, without a long-term software contract."], ["Can you move data from my current system?", "Yes. Our onboarding specialists guide your migration and help your team get comfortable before launch."], ["Does every user cost extra?", "No. Plans include unlimited users, so advisors, technicians, and managers can all work together."], ["What kind of support is included?", "Every customer gets access to a real support team and an extensive learning center."]]; return <section className="faq"><p className="eyebrow">Frequently asked questions</p><h2>Good questions.<br />Straight answers.</h2><div>{faqs.map((f, i) => <article className={open === i ? "open" : ""} key={f[0]}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{f[0]}</span><b>{open === i ? "−" : "+"}</b></button>{open === i && <p>{f[1]}</p>}</article>)}</div></section>; }

function ROI() { const [cars, setCars] = useState(300); const [aro, setAro] = useState(550); const lift = Math.round(cars * aro * .08); return <main><section className="calculator"><div><p className="eyebrow">ROI CALCULATOR</p><h1>What could a better workflow do for your shop?</h1><p>Adjust the numbers to see one estimate of the revenue opportunity from stronger approvals and efficiency.</p></div><div className="calc-card"><label>Cars per month <b>{cars}</b><input type="range" min="50" max="1000" value={cars} onChange={e => setCars(+e.target.value)} /></label><label>Average repair order <b>${aro}</b><input type="range" min="150" max="1500" step="25" value={aro} onChange={e => setAro(+e.target.value)} /></label><div className="result"><span>Estimated monthly opportunity</span><strong>${lift.toLocaleString()}</strong><small>based on an 8% improvement</small></div><CTA>Get a tailored assessment</CTA></div></section></main>; }

function Contact({ demo = false }: { demo?: boolean }) { const [sent, setSent] = useState(false); const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); }; return <main><section className="form-page"><div><p className="eyebrow">{demo ? "BOOK A PERSONALIZED DEMO" : "CONTACT MY CAR CARE"}</p><h1>{demo ? "See what’s possible for your shop." : "Let’s get you to the right place."}</h1><p>{demo ? "Tell us a little about your business. A My Car Care specialist will show you how the platform fits your team and goals." : "Have a question about the product, partnership, or your account? Our team is ready to help."}</p><div className="contact-note"><b>Already a customer?</b><span>Visit the Help Center for the fastest support.</span></div></div>{sent ? <div className="success"><span>THANK YOU</span><h2>We’ll be in touch.</h2><p>Your message is on its way to the My Car Care team.</p><button className="button" onClick={() => setSent(false)}>Send another</button></div> : <form onSubmit={submit}><div className="field-row"><label>First name<input required /></label><label>Last name<input required /></label></div><label>Work email<input required type="email" /></label><label>Phone number<input required type="tel" /></label><label>Shop name<input required /></label><label>Number of locations<select><option>1 location</option><option>2–5 locations</option><option>6–20 locations</option><option>21+ locations</option></select></label><label>How can we help?<textarea rows={4} /></label><button className="button" type="submit">{demo ? "Book my demo" : "Send message"} <Arrow /></button></form>}</section></main>; }

function CTASection() { return <section className="closing-cta"><p className="eyebrow">YOUR SHOP. MOVING FORWARD.</p><h2>Ready to bring it<br />all together?</h2><p>See why more than 15,000 shops trust My Car Care.</p><CTA light>Book a free demo</CTA></section>; }
function Footer() { return <footer><div className="footer-top"><Link to="/" className="footer-brand"><img src="/MY_CAR_CARE_LOGO_Png-FIle-Without-background.png" alt="My Car Care Auto Service Center" /></Link><div><p className="eyebrow">Product</p>{productGroups[0].links.slice(0, 5).map(([n,p]) => <Link to={p} key={p}>{n}</Link>)}</div><div><p className="eyebrow">Resources</p>{resourceLinks.slice(0, 6).map(([n,p]) => <Link to={p} key={p}>{n}</Link>)}</div><div><p className="eyebrow">Company</p>{companyLinks.map(([n,p]) => <Link to={p} key={p}>{n}</Link>)}</div><div><p className="eyebrow">Talk to us</p><Link to="/contact">Contact</Link><Link to="/support">Help Center</Link><Link to="/app/dashboard">Open shop app</Link></div></div><div className="footer-bottom"><span>© 2026 My Car Care. UI recreation.</span><span>Privacy &nbsp; Terms &nbsp; Accessibility</span></div></footer>; }

function App() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => { const update = () => { setPath(location.pathname); window.scrollTo({ top: 0, behavior: "instant" }); }; addEventListener("popstate", update); return () => removeEventListener("popstate", update); }, []);
  const page = useMemo(() => {
    if (path === "/app" || path.startsWith("/app/")) return <ShopApp />;
    if (path === "/") return <Home />;
    if (path.startsWith("/feature/")) return <FeaturePage data={featureMap[path.split("/").pop() || ""] || featureMap["shop-management"]} />;
    if (path === "/pricing") return <Pricing />;
    if (path === "/integrations") return <Integrations />;
    if (path === "/roi-calculator") return <ROI />;
    if (path === "/contact") return <Contact />;
    if (path === "/book-a-demo-my-car-care") return <Contact demo />;
    const resourceNames: Record<string,string> = { "/blog": "Blog", "/webinars": "Webinars", "/events": "Events", "/success-stories": "Customer Stories", "/downloads": "Downloads" };
    if (resourceNames[path]) return <ResourcePage kind={resourceNames[path]} />;
    if (pageInfo[path]) return <GeneralPage info={pageInfo[path]} path={path} />;
    if (path.startsWith("/post/")) return <GeneralPage info={["MY CAR CARE RESOURCE", "Practical ideas for a stronger shop.", "Explore actionable insights designed for today’s auto repair operators."]} path={path} />;
    return <GeneralPage info={["EXPLORE MY CAR CARE", "Move your shop forward.", "A connected platform and a lifelong partner for your auto repair business."]} path={path} />;
  }, [path]);
  if (path === "/app" || path.startsWith("/app/")) return page;
  return <PublicSite path={path} />;
}
export default App;
