import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE ───────────────────────────────────────────────────────────────
const SB_URL = 'https://qontbkslqibddxhblcru.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbnRia3NscWliZGR4aGJsY3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTU3NjMsImV4cCI6MjA5Mjk3MTc2M30.jK7CgjaJyg_wn9LQT0AAUY4eYlF8CdTK6bB-Lss5NU0'
const supabase = createClient(SB_URL, SB_KEY)

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const AC = {
  Aryan:  { bg:'#6b5fff22', br:'#6b5fff', tx:'#b0a8ff' },
  Vivaan: { bg:'#f0a50022', br:'#f0a500', tx:'#ffd080' },
  Rishi:  { bg:'#00d98822', br:'#00d988', tx:'#80ffd4' },
  Priya:  { bg:'#ff5fa022', br:'#ff5fa0', tx:'#ffb8d4' },
  Ananya: { bg:'#a855f722', br:'#a855f7', tx:'#d8b4fe' },
  Kavya:  { bg:'#ff6b1a22', br:'#ff6b1a', tx:'#ffb888' },
}
const STASK = {
  Aryan:  'Analyzing Jaipur market · Planning Week 2 expansion strategy',
  Vivaan: 'ACTIVE: Negotiating Spice Garden Restaurant — ₹8,000 deal',
  Rishi:  'Building custom demo for Spice Garden · Deploying to Vercel',
  Priya:  'Monitoring API credits · Preparing ₹8,000 invoice template',
  Ananya: 'Standby — 3 human telecallers ready on OLX at ₹50/call',
  Kavya:  'Instagram + Facebook campaign live · 340 views · 89 reactions',
}
const FALLBACK_AGENTS = [
  { id:'1', name:'Aryan',  gender:'male',   role:'Co-Founder · Strategy & Architecture', department:'Leadership',  status:'active'  },
  { id:'2', name:'Vivaan', gender:'male',   role:'Co-Founder · Sales & Client Outreach',  department:'Sales',       status:'busy'    },
  { id:'3', name:'Rishi',  gender:'male',   role:'Co-Founder · Tech & Product',           department:'Technology',  status:'active'  },
  { id:'4', name:'Priya',  gender:'female', role:'CFO · Finance & Revenue',                department:'Finance',     status:'active'  },
  { id:'5', name:'Ananya', gender:'female', role:'HR · Human Hiring & People',             department:'HR',          status:'offline' },
  { id:'6', name:'Kavya',  gender:'female', role:'CMO · Marketing & Brand',                department:'Marketing',   status:'busy'    },
]
const FALLBACK_CLIENTS = [
  { id:'1', business_name:'Spice Garden Restaurant', owner_name:'Rakesh Sharma',  city:'Jaipur', phone:'98290XXXXX', status:'negotiating', source:'whatsapp' },
  { id:'2', business_name:'Sharma Textiles',         owner_name:'Mukesh Sharma',  city:'Jaipur', phone:'94140XXXXX', status:'contacted',   source:'whatsapp' },
  { id:'3', business_name:'Pink City Sweets',        owner_name:'Suresh Gupta',   city:'Jaipur', phone:'99290XXXXX', status:'prospect',    source:'email'    },
  { id:'4', business_name:'Jaipur Furniture House',  owner_name:'Ramesh Agarwal', city:'Jaipur', phone:'97290XXXXX', status:'prospect',    source:'email'    },
]
const FALLBACK_ACTIVITIES = [
  { id:'a1', agent_name:'Vivaan', activity_type:'client_contacted', title:'🔥 Lead in Negotiation!',  description:'Spice Garden Restaurant replied — discussing ₹8,000 website deal', importance:'high',   created_at: new Date(Date.now()-300000).toISOString()   },
  { id:'a2', agent_name:'Kavya',  activity_type:'marketing',        title:'📢 Campaign Live',          description:'Instagram: 340 views · Facebook: 89 reactions in 1 hour',          importance:'normal', created_at: new Date(Date.now()-900000).toISOString()   },
  { id:'a3', agent_name:'Aryan',  activity_type:'decision_made',    title:'🧠 Market Analysis Done',   description:'400+ Jaipur businesses, no website. Priority: restaurants (200+)',  importance:'high',   created_at: new Date(Date.now()-3600000).toISOString()  },
  { id:'a4', agent_name:'Rishi',  activity_type:'website_built',    title:'🌐 Demo Website Built',     description:'Jaipur restaurant template — menu, maps, WhatsApp. Client-ready.',  importance:'normal', created_at: new Date(Date.now()-7200000).toISOString()  },
  { id:'a5', agent_name:'Priya',  activity_type:'payment_received', title:'💰 Budget Secured',         description:'Free API credits confirmed — 2 weeks at ₹0 cost',                   importance:'normal', created_at: new Date(Date.now()-10800000).toISOString() },
]
const FALLBACK_MEETINGS = [
  { id:'m1', title:'Spice Garden Demo Call', meeting_type:'client',    scheduled_at: new Date(Date.now()+3600000).toISOString(),  duration_minutes:30, agenda:'Show demo · Discuss ₹8,000 pricing · Close deal',    founder_invited:true },
  { id:'m2', title:'DEVRAYOG Weekly Sync',   meeting_type:'internal',  scheduled_at: new Date(Date.now()+86400000).toISOString(), duration_minutes:45, agenda:'Week 1 review · Pipeline update · Week 2 targets',   founder_invited:true },
]
const SEED_CHATS = {
  general:   [
    { id:'gc1', agent_name:'Aryan',  message:'Team — Jaipur market analysis done. 400+ businesses, no website. Starting with restaurants — highest willingness to pay.',             created_at: new Date(Date.now()-3900000).toISOString() },
    { id:'gc2', agent_name:'Vivaan', message:'On it Aryan bhai! Outreach to 50 Jaipur restaurants today. Kavya — send me pitch content I can use.',                                 created_at: new Date(Date.now()-3600000).toISOString() },
    { id:'gc3', agent_name:'Kavya',  message:'Pitch deck ready and Instagram campaign is live. Driving leads to Vivaan.',                                                             created_at: new Date(Date.now()-3300000).toISOString() },
    { id:'gc4', agent_name:'Aryan',  message:'Devanshu bhai — first potential client in negotiation! Vivaan is handling. Priya, prepare invoice for ₹8,000. Great start team 💪', created_at: new Date(Date.now()-300000).toISOString()  },
  ],
  sales:     [
    { id:'sc1', agent_name:'Vivaan', message:'UPDATE 🔥 Sent WhatsApp to 12 restaurants. 3 opened. 1 replied asking for price! Rishi — customize the demo for Spice Garden.',       created_at: new Date(Date.now()-900000).toISOString() },
    { id:'sc2', agent_name:'Rishi',  message:'On it! Spice Garden demo will be ready in 20 min. Vivaan, keep them warm 🤝',                                                         created_at: new Date(Date.now()-600000).toISOString() },
    { id:'sc3', agent_name:'Vivaan', message:'Replied to client: "We will show you a live demo of your restaurant website in 30 min." They said OK! Rishi — GO!',                   created_at: new Date(Date.now()-480000).toISOString() },
  ],
  tech:      [
    { id:'tc1', agent_name:'Rishi',  message:'Demo site LIVE 🚀 Jaipur restaurant template — menu section, Google Maps embed, WhatsApp button, mobile responsive. Client-ready.', created_at: new Date(Date.now()-2700000).toISOString() },
    { id:'tc2', agent_name:'Rishi',  message:'Customizing for Spice Garden now — adding their name, Jaipur location, Indian color scheme. Will push to Vercel in 15 min.',         created_at: new Date(Date.now()-500000).toISOString() },
  ],
  finance:   [
    { id:'fc1', agent_name:'Priya',  message:'Budget check: Gemini free (60 req/min), Anthropic $5 credit, Groq unlimited. We can run 2 full weeks at ₹0 cost.',                   created_at: new Date(Date.now()-2400000).toISOString() },
    { id:'fc2', agent_name:'Priya',  message:'Invoice template ready. When Vivaan closes Spice Garden: ₹8,000 total. Payment via Razorpay link. I will send it instantly.',         created_at: new Date(Date.now()-1200000).toISOString() },
  ],
  hr:        [
    { id:'hc1', agent_name:'Ananya', message:'Standby mode. Have 3 contacts from OLX ready for telecalling at ₹50/call if Vivaan needs volume outreach to more businesses.',       created_at: new Date(Date.now()-1800000).toISOString() },
  ],
  marketing: [
    { id:'mc1', agent_name:'Kavya',  message:'Instagram post live: "Does your Jaipur restaurant have a website? Get one in 24 hours!" — 340 views, 89 reactions in 1 hour.',       created_at: new Date(Date.now()-3300000).toISOString() },
    { id:'mc2', agent_name:'Kavya',  message:'Joined 5 Jaipur business WhatsApp groups. Will post our offer tomorrow morning (peak engagement time: 9-10 AM IST).',                created_at: new Date(Date.now()-2100000).toISOString() },
  ],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ago(s) {
  const d = (Date.now() - new Date(s).getTime()) / 1000
  if (d < 60)    return 'just now'
  if (d < 3600)  return Math.floor(d/60) + 'm ago'
  if (d < 86400) return Math.floor(d/3600) + 'h ago'
  return Math.floor(d/86400) + 'd ago'
}

// ─── UI ATOMS ────────────────────────────────────────────────────────────────
function Dot({ s }) {
  const c = { active:'#00d988', busy:'#f0a500', offline:'#33334a' }[s] || '#33334a'
  return <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:c, flexShrink:0, animation:s==='active'?'pulse 2s infinite':'none' }}/>
}

function Av({ name, size=36 }) {
  const c = AC[name] || { bg:'#1e1e32', br:'#33334a', tx:'#555577' }
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:c.bg, border:`1.5px solid ${c.br}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.38, fontWeight:800, color:c.tx, flexShrink:0 }}>
      {name?.[0] || '?'}
    </div>
  )
}

function NavBtn({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:9, width:'100%', textAlign:'left', background:active?'#1a1a2e':'transparent', color:active?'#f0a500':'#7777aa', fontSize:13, fontWeight:active?600:400, border:active?'1px solid #2a2a45':'1px solid transparent', transition:'all .15s' }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ flex:1 }}>{label}</span>
      {badge && <span style={{ background:'#ff4455', color:'#fff', fontSize:10, fontWeight:700, borderRadius:8, padding:'1px 6px' }}>{badge}</span>}
    </button>
  )
}

function Card({ children, style = {} }) {
  return <div style={{ background:'#0e0e18', border:'1px solid #1e1e32', borderRadius:14, ...style }}>{children}</div>
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function Overview({ agents, activities, meetings, clients }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Hero Banner */}
      <div style={{ background:'linear-gradient(135deg,#0e0e18,#12102a)', border:'1px solid #2a2a45', borderRadius:18, padding:'24px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, background:'radial-gradient(circle,#f0a50015,transparent 65%)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ fontSize:10, color:'#f0a500', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>DEVRAYOG — FOUNDER COMMAND CENTER</div>
        <div style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Namaste, Devanshu 👑</div>
        <div style={{ fontSize:13, color:'#7777aa', maxWidth:500, lineHeight:1.6 }}>
          Your AI company is <span style={{ color:'#00d988', fontWeight:700 }}>OPERATIONAL</span>. 6 agents working autonomously. First ₹8,000 deal in negotiation. Mission: ₹0 → $1,000,000,000
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
          {agents.map(a => (
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:6, background:'#080810', border:'1px solid #1e1e32', borderRadius:20, padding:'4px 11px' }}>
              <Dot s={a.status}/><span style={{ fontSize:11, color:'#7777aa' }}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {[
          { label:'Revenue',        val:'₹0',              sub:'₹8K deal incoming',    color:'#f0a500' },
          { label:'Active Agents',  val:`${agents.filter(a=>a.status!=='offline').length}/6`, sub:'Running autonomously', color:'#6b5fff' },
          { label:'Prospects',      val:String(clients.length), sub:'1 in negotiation', color:'#00d988' },
          { label:'Outreach Sent',  val:'12',              sub:'3 opened · 1 reply',   color:'#ff5fa0' },
          { label:'Demos Built',    val:'1',               sub:'Ready to show',        color:'#ff6b1a' },
          { label:'Day',            val:'1',               sub:'Mission started today', color:'#a855f7' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#0e0e18', border:`1px solid ${s.color}30`, borderRadius:12, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${s.color}99,transparent)` }}/>
            <div style={{ fontSize:10, color:'#55556a', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, letterSpacing:'-.02em' }}>{s.val}</div>
            <div style={{ fontSize:11, color:'#33334a', marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Activity */}
        <Card style={{ padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>⚡ Live Activity</div>
          {activities.slice(0,4).map((a,i) => (
            <div key={a.id||i} className="fin" style={{ animationDelay:i*50+'ms', display:'flex', gap:9, padding:'9px 0', borderBottom:'1px solid #1e1e32' }}>
              <Av name={a.agent_name||'Aryan'} size={28}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, lineHeight:1.4 }}>{a.title}</div>
                <div style={{ fontSize:11, color:'#33334a', marginTop:2 }}>{ago(a.created_at)}</div>
              </div>
              {a.importance==='high' && <span style={{ fontSize:9, color:'#f0a500', background:'#f0a50018', border:'1px solid #f0a50030', borderRadius:4, padding:'2px 5px', alignSelf:'flex-start', flexShrink:0 }}>HIGH</span>}
            </div>
          ))}
        </Card>

        {/* Meetings */}
        <Card style={{ padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>📅 Meetings — You're Invited</div>
          {meetings.slice(0,3).map((m,i) => (
            <div key={m.id||i} className="fin" style={{ animationDelay:i*60+'ms', background:'#12121f', border:'1px solid #1e1e32', borderRadius:10, padding:12, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{m.title}</div>
                  <div style={{ fontSize:11, color:'#7777aa', marginTop:3 }}>{new Date(m.scheduled_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</div>
                  <div style={{ fontSize:11, color:'#444460', marginTop:2 }}>{m.agenda}</div>
                </div>
                {m.founder_invited && <span style={{ fontSize:9, fontWeight:700, color:'#00d988', background:'#00d98818', border:'1px solid #00d98830', borderRadius:4, padding:'2px 6px', flexShrink:0 }}>👑 INVITED</span>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ─── AGENTS VIEW ─────────────────────────────────────────────────────────────
function AgentsView({ agents }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>AI Agents <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— Your autonomous team of 6</span></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:12 }}>
        {agents.map((a,i) => {
          const c = AC[a.name] || AC.Aryan
          const sc = { active:{dot:'#00d988',label:'Active',bg:'#00d98818',br:'#00d98833'}, busy:{dot:'#f0a500',label:'Busy',bg:'#f0a50018',br:'#f0a50033'}, offline:{dot:'#33334a',label:'Offline',bg:'#33334a18',br:'#33334a33'} }[a.status] || {dot:'#33334a',label:'Offline',bg:'#33334a18',br:'#33334a33'}
          return (
            <div key={a.id} className="fin" style={{ animationDelay:i*70+'ms', background:'#0e0e18', border:`1px solid ${c.br}40`, borderRadius:16, padding:20, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-20, right:-20, width:70, height:70, background:`radial-gradient(circle,${c.br}15,transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <Av name={a.name} size={48}/>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16, fontWeight:700 }}>{a.name}</span>
                    <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:sc.dot, background:sc.bg, border:`1px solid ${sc.br}`, borderRadius:4, padding:'2px 7px' }}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:c.tx, marginTop:3 }}>{a.role}</div>
                  <div style={{ fontSize:10, color:'#33334a', marginTop:2 }}>{a.department} · {a.gender==='female'?'👩':'👨'}</div>
                </div>
              </div>
              <div style={{ background:'#080810', border:'1px solid #1e1e32', borderRadius:8, padding:'9px 12px', fontSize:12, color:'#666688', lineHeight:1.6 }}>
                {STASK[a.name] || 'Working autonomously...'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── CHAT VIEW ───────────────────────────────────────────────────────────────
function ChatView({ agents }) {
  const [ch, setCh] = useState('general')
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)
  const channels = ['general','sales','tech','finance','hr','marketing']
  const cColor = { general:'#6b5fff', sales:'#f0a500', tech:'#00d988', finance:'#ff5fa0', hr:'#a855f7', marketing:'#ff6b1a' }

  useEffect(() => {
    setMsgs(SEED_CHATS[ch] || [])
    supabase.from('internal_chats').select('*').eq('channel', ch).order('created_at').then(({ data }) => {
      if (data && data.length > 0) {
        const named = data.map(m => {
          const ag = agents.find(a => a.id === m.from_agent) || { name: m.from_agent ? 'Agent' : 'Devanshu (Founder)' }
          return { ...m, agent_name: ag.name, isFounder: !m.from_agent }
        })
        setMsgs(named)
      }
    })
  }, [ch, agents])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  async function send() {
    if (!input.trim() || sending) return
    setSending(true)
    const newMsg = { id: Date.now().toString(), agent_name:'Devanshu (Founder)', message: input.trim(), created_at: new Date().toISOString(), isFounder: true, channel: ch }
    setMsgs(m => [...m, newMsg])
    await supabase.from('internal_chats').insert({ channel: ch, message: input.trim(), message_type:'text', is_read_by_founder: true })
    setInput('')
    setSending(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, height:'calc(100vh - 160px)', minHeight:500 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Internal Chat <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— All agent conversations</span></div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {channels.map(c => (
          <button key={c} onClick={() => setCh(c)} style={{ padding:'5px 13px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', background:ch===c?cColor[c]+'22':'#0e0e18', border:`1px solid ${ch===c?cColor[c]:'#1e1e32'}`, color:ch===c?cColor[c]:'#55556a' }}>#{c}</button>
        ))}
      </div>
      <Card style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'9px 14px', borderBottom:'1px solid #1e1e32', background:'#0a0a12', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:cColor[ch], display:'inline-block' }}/>
          <span style={{ fontSize:13, fontWeight:600 }}>#{ch}</span>
          <span style={{ fontSize:11, color:'#33334a', marginLeft:'auto' }}>{msgs.length} messages</span>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:10 }}>
          {msgs.map((m, i) => {
            const c = AC[m.agent_name] || { br:'#6b5fff', tx:'#a0a0cc' }
            return (
              <div key={m.id||i} style={{ display:'flex', gap:9, flexDirection:m.isFounder?'row-reverse':'row' }}>
                {m.isFounder
                  ? <div style={{ width:30, height:30, borderRadius:'50%', background:'#f0a50022', border:'1.5px solid #f0a500', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#f0a500', flexShrink:0 }}>D</div>
                  : <Av name={m.agent_name} size={30}/>
                }
                <div style={{ flex:1, maxWidth:'80%' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexDirection:m.isFounder?'row-reverse':'row' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:m.isFounder?'#f0a500':c.tx }}>{m.agent_name}</span>
                    <span style={{ fontSize:10, color:'#33334a' }}>{ago(m.created_at)}</span>
                  </div>
                  <div style={{ background:m.isFounder?'#f0a50015':'#0a0a12', border:`1px solid ${m.isFounder?'#f0a50030':'#1e1e32'}`, borderRadius:m.isFounder?'12px 4px 12px 12px':'4px 12px 12px 12px', padding:'9px 13px', fontSize:12, lineHeight:1.6, color:'#d0d0ee' }}>
                    {m.message}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={endRef}/>
        </div>
        <div style={{ padding:'10px 12px', borderTop:'1px solid #1e1e32', background:'#0a0a12', display:'flex', gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message your agents as Founder (Devanshu)..." style={{ flex:1, background:'#080810', border:'1px solid #1e1e32', borderRadius:9, padding:'8px 13px', fontSize:12, color:'#eeeeff', outline:'none' }}/>
          <button onClick={send} disabled={sending||!input.trim()} style={{ background:'#f0a500', color:'#000', borderRadius:9, padding:'8px 16px', fontSize:12, fontWeight:700, opacity:(!input.trim()||sending)?.4:1 }}>
            {sending?'...':'Send'}
          </button>
        </div>
      </Card>
    </div>
  )
}

// ─── CLIENTS VIEW ─────────────────────────────────────────────────────────────
function ClientsView({ clients }) {
  const [filter, setFilter] = useState('all')
  const stc = {
    negotiating:{ c:'#00d988', bg:'#00d98818', br:'#00d98833' },
    contacted:  { c:'#f0a500', bg:'#f0a50018', br:'#f0a50033' },
    prospect:   { c:'#6b5fff', bg:'#6b5fff18', br:'#6b5fff33' },
    closed:     { c:'#ff5fa0', bg:'#ff5fa018', br:'#ff5fa033' },
    lost:       { c:'#33334a', bg:'#33334a18', br:'#33334a33' },
  }
  const filtered = filter==='all' ? clients : clients.filter(c=>c.status===filter)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Client Pipeline <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— Jaipur · Week 1</span></div>
      <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
        <button onClick={()=>setFilter('all')} style={{ padding:'4px 12px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', background:filter==='all'?'#2a2a45':'#0e0e18', border:'1px solid #2a2a45', color:filter==='all'?'#eeeeff':'#55556a' }}>All ({clients.length})</button>
        {Object.entries(stc).map(([s,v]) => {
          const n = clients.filter(c=>c.status===s).length
          return n>0 && <button key={s} onClick={()=>setFilter(s)} style={{ background:filter===s?v.bg:'#0e0e18', border:`1px solid ${filter===s?v.c:'#1e1e32'}`, borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:600, color:filter===s?v.c:'#55556a', cursor:'pointer', textTransform:'capitalize' }}>{s} ({n})</button>
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:11 }}>
        {filtered.map((c,i) => {
          const s = stc[c.status] || stc.prospect
          return (
            <div key={c.id} className="fin" style={{ animationDelay:i*60+'ms', background:'#0e0e18', border:`1px solid ${s.c}33`, borderRadius:12, padding:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{c.business_name}</div>
                  <div style={{ fontSize:12, color:'#55556a', marginTop:3 }}>{c.owner_name} · {c.city}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:s.c, background:s.bg, border:`1px solid ${s.br}`, borderRadius:4, padding:'3px 7px' }}>{c.status}</span>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {c.phone && <span style={{ fontSize:11, color:'#444460', background:'#080810', borderRadius:6, padding:'2px 8px' }}>📞 {c.phone}</span>}
                <span style={{ fontSize:11, color:'#444460', background:'#080810', borderRadius:6, padding:'2px 8px', textTransform:'capitalize' }}>via {c.source}</span>
                {c.status==='negotiating' && <span style={{ fontSize:11, color:'#f0a500', background:'#f0a50018', borderRadius:6, padding:'2px 8px' }}>₹8,000 deal</span>}
              </div>
            </div>
          )
        })}
        <div style={{ background:'#0e0e18', border:'1px dashed #2a2a45', borderRadius:12, padding:18, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6, minHeight:100, color:'#33334a' }}>
          <span style={{ fontSize:20 }}>+</span>
          <span style={{ fontSize:12 }}>Vivaan adding more...</span>
        </div>
      </div>
    </div>
  )
}

// ─── ACTIVITY VIEW ────────────────────────────────────────────────────────────
function ActivityView({ activities }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Live Activity <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— Everything your agents are doing</span></div>
      {activities.map((a,i) => (
        <Card key={a.id||i} style={{ padding:16, display:'flex', gap:12, alignItems:'flex-start', borderLeft:`3px solid ${a.importance==='high'?'#f0a500':'#1e1e32'}` }}>
          <Av name={a.agent_name||'Aryan'} size={38}/>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>{a.title}</span>
              {a.importance==='high' && <span style={{ fontSize:9, color:'#f0a500', background:'#f0a50018', border:'1px solid #f0a50030', borderRadius:4, padding:'2px 6px' }}>HIGH</span>}
            </div>
            <div style={{ fontSize:12, color:'#7777aa', lineHeight:1.5 }}>{a.description}</div>
            <div style={{ fontSize:11, color:'#33334a', marginTop:5 }}>{a.agent_name} · {ago(a.created_at)}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── MEETINGS VIEW ────────────────────────────────────────────────────────────
function MeetingsView({ meetings }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Meetings <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— You are always auto-invited</span></div>
      {meetings.map((m,i) => {
        const mc = m.meeting_type==='client' ? '#f0a500' : '#6b5fff'
        return (
          <Card key={m.id||i} style={{ padding:20, borderLeft:`4px solid ${mc}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:14 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:15, fontWeight:700 }}>{m.title}</span>
                  <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', color:mc, background:`${mc}18`, border:`1px solid ${mc}33`, borderRadius:4, padding:'2px 7px' }}>{m.meeting_type}</span>
                  {m.founder_invited && <span style={{ fontSize:9, fontWeight:700, color:'#00d988', background:'#00d98818', border:'1px solid #00d98830', borderRadius:4, padding:'2px 7px' }}>👑 YOU ARE INVITED</span>}
                </div>
                <div style={{ fontSize:12, color:'#7777aa', marginBottom:5 }}>📅 {new Date(m.scheduled_at).toLocaleString('en-IN',{dateStyle:'full',timeStyle:'short'})} · {m.duration_minutes} min</div>
                <div style={{ fontSize:12, color:'#555568' }}>📋 {m.agenda}</div>
              </div>
              <button style={{ background:mc, color:'#000', borderRadius:9, padding:'9px 18px', fontSize:12, fontWeight:700, flexShrink:0, cursor:'pointer' }}>Join</button>
            </div>
          </Card>
        )
      })}
      <Card style={{ padding:20, textAlign:'center', color:'#33334a', fontSize:12 }}>
        <div style={{ fontSize:24, marginBottom:8 }}>📅</div>
        <div>AI agents schedule all meetings automatically.</div>
        <div style={{ marginTop:4 }}>You will always be invited to client meetings and weekly syncs.</div>
      </Card>
    </div>
  )
}

// ─── HUMANS HIRED VIEW ────────────────────────────────────────────────────────
function HumansView({ humans }) {
  const display = humans.length ? humans : []
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Humans Hired <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— When AI needs a real person</span></div>
      {display.length === 0 ? (
        <Card style={{ padding:30, textAlign:'center', color:'#33334a' }}>
          <div style={{ fontSize:24, marginBottom:10 }}>👥</div>
          <div style={{ fontSize:13 }}>No humans hired yet.</div>
          <div style={{ fontSize:12, marginTop:6 }}>When AI cannot handle a task (telecalling, legal signing, etc.), Ananya will hire a human here and you will see their name, phone, and task.</div>
        </Card>
      ) : display.map((h,i) => (
        <Card key={h.id||i} style={{ padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>{h.name}</div>
              <div style={{ fontSize:12, color:'#7777aa', marginTop:3 }}>{h.role}</div>
              <div style={{ fontSize:12, color:'#444460', marginTop:4 }}>📞 {h.phone} · 📧 {h.email}</div>
              <div style={{ fontSize:12, color:'#55556a', marginTop:4 }}>Hired by: {h.hired_by_name || 'Ananya'} · Reason: {h.reason}</div>
            </div>
            <span style={{ fontSize:9, fontWeight:700, color:'#00d988', background:'#00d98818', border:'1px solid #00d98830', borderRadius:4, padding:'3px 8px' }}>{h.status}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── NOTIFICATIONS VIEW ────────────────────────────────────────────────────────
function NotifsView({ notifications }) {
  const display = notifications.length ? notifications : [
    { id:'n1', type:'success', title:'🔥 First Lead in Negotiation!',  message:'Vivaan is talking to Spice Garden Restaurant. Potential ₹8,000 deal — your first revenue!', created_at: new Date(Date.now()-300000).toISOString()   },
    { id:'n2', type:'success', title:'✅ DEVRAYOG is LIVE',             message:'All 6 agents operational: Aryan, Vivaan, Rishi, Priya, Ananya, Kavya. Company is running.', created_at: new Date(Date.now()-21600000).toISOString() },
    { id:'n3', type:'info',    title:'🌐 Demo Website Built',           message:'Rishi built first restaurant demo in 2 hours. Ready to show clients.',                        created_at: new Date(Date.now()-7200000).toISOString()  },
    { id:'n4', type:'info',    title:'📢 Marketing Campaign Live',      message:'Kavya: Instagram + Facebook live. 340 views, 89 reactions in first hour.',                   created_at: new Date(Date.now()-10800000).toISOString() },
    { id:'n5', type:'info',    title:'💰 Free API Budget Confirmed',    message:'Priya: 2 weeks of free API credits secured. Zero ₹ investment needed to start.',              created_at: new Date(Date.now()-18000000).toISOString() },
  ]
  const nc = { success:'#00d988', info:'#6b5fff', warning:'#f0a500', critical:'#ff4455' }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Notifications <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— All important updates</span></div>
      {display.map((n,i) => {
        const c = nc[n.type] || nc.info
        return (
          <Card key={n.id||i} style={{ padding:16, display:'flex', gap:12, border:`1px solid ${c}33` }}>
            <div style={{ width:40, height:40, borderRadius:10, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
              {n.type==='success'?'✅':n.type==='warning'?'⚠️':n.type==='critical'?'🚨':'ℹ️'}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:4, color:c }}>{n.title}</div>
              <div style={{ fontSize:12, color:'#7777aa', lineHeight:1.5 }}>{n.message}</div>
              <div style={{ fontSize:11, color:'#33334a', marginTop:5 }}>{ago(n.created_at)}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── REVENUE VIEW ─────────────────────────────────────────────────────────────
function RevenueView() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ fontSize:17, fontWeight:700 }}>Revenue <span style={{ color:'#55556a', fontWeight:400, fontSize:12 }}>— ₹0 → ₹1,00,000 target</span></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {[
          { label:'Total Revenue',   val:'₹0',      color:'#f0a500' },
          { label:'Pending Deals',   val:'₹8,000',  color:'#00d988' },
          { label:'API Cost',        val:'₹0',      color:'#6b5fff' },
          { label:'Net Profit',      val:'₹0',      color:'#ff5fa0' },
          { label:'Deals Closed',    val:'0',       color:'#ff6b1a' },
          { label:'Websites Built',  val:'1 demo',  color:'#a855f7' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#0e0e18', border:`1px solid ${s.color}30`, borderRadius:12, padding:'16px 18px' }}>
            <div style={{ fontSize:10, color:'#55556a', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <Card style={{ padding:20 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:16 }}>₹1 Lakh Roadmap</div>
        {[
          { week:'Week 1', target:'₹8,000–₹16,000',  how:'Close 1-2 restaurant websites at ₹8,000 each. Vivaan handles outreach.' },
          { week:'Week 2', target:'₹24,000–₹40,000', how:'Scale to 3-5 deals. Kavya runs ads. Rishi builds faster with templates.' },
          { week:'Week 3', target:'₹60,000–₹80,000', how:'Referrals kick in. Add maintenance packages ₹2,000/month recurring.' },
          { week:'Week 4', target:'₹1,00,000+',      how:'10+ clients. 3 on maintenance. First sub-brand launch under DEVRAYOG.' },
        ].map((r,i) => (
          <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom: i<3?'1px solid #1e1e32':'none' }}>
            <div style={{ width:70, fontSize:12, fontWeight:700, color:'#f0a500', flexShrink:0 }}>{r.week}</div>
            <div style={{ width:130, fontSize:12, fontWeight:600, color:'#00d988', flexShrink:0 }}>{r.target}</div>
            <div style={{ fontSize:12, color:'#7777aa', lineHeight:1.5 }}>{r.how}</div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('overview')
  const [agents, setAgents] = useState(FALLBACK_AGENTS)
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES)
  const [clients, setClients] = useState(FALLBACK_CLIENTS)
  const [meetings, setMeetings] = useState(FALLBACK_MEETINGS)
  const [notifications, setNotifications] = useState([])
  const [humans, setHumans] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function loadAll() {
    const [{ data: ags }, { data: acts }, { data: cls }, { data: mts }, { data: nts }, { data: hms }] = await Promise.all([
      supabase.from('agents').select('*').order('name'),
      supabase.from('activities').select('*, agents(name)').order('created_at', { ascending:false }).limit(20),
      supabase.from('clients').select('*').order('created_at', { ascending:false }),
      supabase.from('meetings').select('*').order('scheduled_at'),
      supabase.from('notifications').select('*').order('created_at', { ascending:false }),
      supabase.from('humans_hired').select('*').order('created_at', { ascending:false }),
    ])
    if (ags?.length)  setAgents(ags)
    if (acts?.length) setActivities(acts.map(a => ({ ...a, agent_name: a.agents?.name || 'Aryan' })))
    if (cls?.length)  setClients(cls)
    if (mts?.length)  setMeetings(mts)
    if (nts?.length)  setNotifications(nts)
    if (hms?.length)  setHumans(hms)
  }

  useEffect(() => {
    loadAll()
    const t = setInterval(loadAll, 30000)
    return () => clearInterval(t)
  }, [])

  const nav = [
    { id:'overview',  icon:'⌂',  label:'Overview'                  },
    { id:'agents',    icon:'🤖', label:'AI Agents'                  },
    { id:'chat',      icon:'💬', label:'Internal Chat',  badge:2    },
    { id:'clients',   icon:'🏢', label:'Clients'                    },
    { id:'activity',  icon:'⚡', label:'Live Activity'              },
    { id:'meetings',  icon:'📅', label:'Meetings',       badge:2    },
    { id:'humans',    icon:'👥', label:'Humans Hired'               },
    { id:'revenue',   icon:'💰', label:'Revenue'                    },
    { id:'notifs',    icon:'🔔', label:'Notifications',  badge:5    },
  ]

  return (
    <div style={{ display:'flex', background:'#05050a', minHeight:'100vh', color:'#eeeeff', fontFamily:'var(--font)' }}>
      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside style={{ width:215, background:'#0e0e18', borderRight:'1px solid #1e1e32', display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'18px 13px 12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#f0a500,#ff6b1a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚙️</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#f0a500', letterSpacing:'.06em' }}>DEVRAYOG</div>
                <div style={{ fontSize:9, color:'#33334a', letterSpacing:'.1em', textTransform:'uppercase' }}>AI Company</div>
              </div>
            </div>
            <div style={{ background:'linear-gradient(135deg,#f0a50015,#ff6b1a10)', border:'1px solid #f0a50025', borderRadius:9, padding:'8px 11px', marginBottom:16 }}>
              <div style={{ fontSize:9, color:'#f0a500', fontWeight:700, letterSpacing:'.08em' }}>👑 FOUNDER</div>
              <div style={{ fontSize:13, fontWeight:700, marginTop:2 }}>Devanshu</div>
              <div style={{ fontSize:10, color:'#33334a', marginTop:1 }}>devrayog@gmail.com</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
              {nav.map(item => <NavBtn key={item.id} {...item} active={view===item.id} onClick={()=>setView(item.id)}/>)}
            </div>
          </div>
          <div style={{ marginTop:'auto', padding:'12px 13px', borderTop:'1px solid #1e1e32', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'#f0a500', fontWeight:700 }}>₹0 → $1,000,000,000</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:4 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#00d988', display:'inline-block', animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:10, color:'#00d988' }}>MISSION ACTIVE</span>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'12px 22px', borderBottom:'1px solid #1e1e32', background:'#0e0e18', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ color:'#7777aa', fontSize:18, padding:'0 4px' }}>☰</button>
          <div style={{ flex:1, fontSize:14, fontWeight:700 }}>{nav.find(n=>n.id===view)?.label}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'#00d98815', border:'1px solid #00d98830', borderRadius:20, padding:'4px 12px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00d988', display:'inline-block', animation:'pulse 2s infinite' }}/>
            <span style={{ fontSize:11, color:'#00d988', fontWeight:600 }}>ALL SYSTEMS LIVE</span>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:22 }}>
          {view==='overview'  && <Overview   agents={agents}  activities={activities} meetings={meetings} clients={clients}/>}
          {view==='agents'    && <AgentsView agents={agents}/>}
          {view==='chat'      && <ChatView   agents={agents}/>}
          {view==='clients'   && <ClientsView clients={clients}/>}
          {view==='activity'  && <ActivityView activities={activities}/>}
          {view==='meetings'  && <MeetingsView meetings={meetings}/>}
          {view==='humans'    && <HumansView humans={humans}/>}
          {view==='revenue'   && <RevenueView/>}
          {view==='notifs'    && <NotifsView notifications={notifications}/>}
        </div>
      </main>
    </div>
  )
}
