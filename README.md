# Marvelous 🟣  
### Real-time bullying pattern detection + private, role-aware guidance in group chats

Marvelous is a real-time group chat system that detects **bullying/targeting dynamics** as they emerge and supports safer conversations through **private interventions** — without public shaming or censorship.

The core idea: bullying escalates in group spaces because signals are subtle, roles are unclear, and bystanders often don’t know what to do **in the moment**. Marvelous is built to surface risk early and guide action privately.

---

## 🎯 Why this matters (research)

Bullying is common and has measurable consequences:

- **Global:** UNESCO reports **~1 in 3** young teens have experienced bullying worldwide.   
- **U.S. high school:** CDC YRBS highlights show bullying at school in the **~15–19%** range.   
- **U.S. ages 12–18:** NCES reports **~19%** of students ages 12–18 were bullied at school (2021–22).   

Interventions can move outcomes:
- A major meta-analysis found school-based antibullying programs reduce **victimization ~15–16%** and **perpetration ~19–20%** on average.   

> **Important:** Marvelous is not claiming those exact percentages for the app yet. Those numbers show what structured interventions can achieve at scale. Marvelous aims to measure impact once deployed.

---

## 🧠 How Marvelous helps (feature → research rationale)

### 1) 🟢 Live bullying meter (safe → tension → targeted → bullying)
**What it does:** Tracks conversation risk in real time and updates a simple meter state.  
**Why it helps:** Effective prevention often starts with **early awareness** and timely response. A live meter provides an “early warning” signal without exposing raw AI scores or publicly labeling anyone.   

---

### 2) 🔒 Private, role-aware guidance (targeted / aggressor / bystanders)
**What it does:** When a pattern is detected, each role receives private guidance:
- **Targeted person:** validation + options + support steps  
- **Aggressor:** reflection + de-escalation prompts (“empathy mirror”)  
- **Bystanders:** one low-risk action they can take now  

**Why it helps:** Many successful interventions are **multi-component** — shaping the environment and peer responses, not just punishing. Role-aware guidance operationalizes that idea inside a chat context.   

---

### 3) ⏸️ Pause button (pre-send friction)
**What it does:** Adds a short delay before hostile messages send.  
**Why it helps:** Escalation is often impulsive. Small friction can reduce heat-of-the-moment sending and create a chance to self-correct. (Effect size depends on implementation; Marvelous will measure it.)   

---

### 4) 📈 Communication score dashboard (feedback loop over time)
**What it does:** A personal dashboard showing communication trends across groups.  
**Why it helps:** Behavior change typically needs **repeated reinforcement**, not a one-off intervention. Longitudinal feedback loops help people recognize patterns and improve over time.   

---

## 📊 Measurement (how impact would be validated)
Marvelous is built to **measure** outcomes instead of guessing. Example metrics:
- reduction in `bullying` meter events per group over time  
- increase in supportive language after bystander prompts  
- reduced repeated targeting of the same person  
- user-reported safety + willingness to participate in group chats  

---

## 📚 Sources
- UNESCO: bullying prevalence globally (~1 in 3).   
- CDC YRBS: bullying at school (~15–19% range).   
- NCES: ~19% bullied at school (ages 12–18).   
- Gaffney et al. meta-analysis: ~15–16% victimization reduction, ~19–20% perpetration reduction.   
- (Optional) evidence on feedback/behavior change loops.   

---

## 🚧 Roadmap (high level)
- ✅ Real-time chat + AI batch analysis  
- ✅ Live meter updates via snapshots  
- ✅ Guidance cards (private banners per role)  
- ⏳ Pause button  
- ⏳ Communication score dashboard  
