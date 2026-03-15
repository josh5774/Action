# 🎬 FilmLink *(working title)*

> **A community platform connecting emerging film industry creatives with opportunities, education, and networking — and a curated entertainment hub for film fans.**

---

## 📌 Overview

FilmLink is a full-stack web and mobile platform with two distinct audiences:

- **Creative Members** — Pre-union actors, writers, directors, editors, cinematographers, composers, and producers who need a centralized place to find collaborators, auditions, industry education, and real connections.
- **Entertainment Fans** — Consumers who follow indie film culture, read industry news, attend screenings and events, and discover emerging talent.

No platform currently combines casting, networking, education, events, and media into one ecosystem for pre-union creatives. FilmLink is built to fill that gap.

---

## 🎯 Core Value Propositions

**For Creatives:**
> *"A private network where emerging film professionals can find collaborators, auditions, and real industry connections."*

**For Fans:**
> *"A curated hub for entertainment news, events, and access to the rising generation of filmmakers."*

---

## 👥 User Types

### 1. Creative Members *(Application Required)*
Actors, writers, directors, producers, cinematographers, editors, and composers who are not yet union / industry-established.

**Capabilities:**
- Build a professional profile (headshot, reel, resume, credits, bio, skills)
- Post and apply for projects
- Upload audition tapes
- Browse and join acting classes
- RSVP and attend industry mixers and events
- Follow other creatives and view activity feeds

### 2. Fans / Industry Followers *(No Application Required)*
Anyone interested in indie and emerging film culture.

**Capabilities:**
- Read articles and industry news
- Follow creators
- Attend public events and screenings
- Discover upcoming filmmakers

---

## ✨ Core Features

### 🧑‍🎤 Creator Profiles
Full professional profiles including: name, headshot, location, profession, bio, reel, resume, skills, credits, portfolio, filmography, and social links. Supports followers and portfolio hosting.

### 🎬 Project Marketplace
Members can post and browse projects — short films, indie films, music videos, student films, and web series. Each listing includes roles available, compensation type, location, shoot dates, and audition instructions. Actors can apply directly, submit their profile, and upload audition tapes.

### 🎭 Acting Classes & Education
A directory of acting coaches and schools with class schedules, in-person/online options, member ratings, and reviews. Revenue-sharing partnerships with coaches.

### 📡 Social Networking Feed
An activity feed showing what the community is working on — bookings, new projects, workshops attended, and more. Supports following, liking, and commenting (Phase 2).

### 📅 Events & Mixers
A full event system covering networking mixers, industry panels, screenings, and workshops. Features include an event calendar, RSVP, ticket purchase, and check-in.

### 📰 Entertainment News *(Fan Side)*
An editorial content hub featuring industry news, indie film coverage, interviews, festival coverage, and behind-the-scenes stories. Supports sponsored content partnerships.

---

## 🖥️ Front-End Requirements

**Platforms:** Web + iOS/Android mobile apps

**Recommended Stack:**
- `React` — Web platform
- `React Native` or `Flutter` — Mobile apps

### Key Screens
| Screen | Description |
|---|---|
| Landing Page | Login, sign up, user type selection |
| Creator Application Flow | Account creation → headshot → profession → resume/reel → bio → admin review |
| Home Feed | Projects, creator updates, articles, events |
| Projects Page | Filterable by role type, location, paid/unpaid, genre |
| Project Detail Page | Description, roles, audition instructions, apply button |
| Profile Page | Photos, reel, credits, work history, followers |
| Classes Page | Acting schools, ratings, reviews, upcoming classes |
| Events Page | Calendar, RSVP, ticket purchase |
| Articles Section | News feed, trending stories, categories |

---

## ⚙️ Back-End Requirements

**Recommended Stack:**
- `Node.js` — Backend API
- `PostgreSQL` — Primary database
- `AWS` or `Google Cloud` — Hosting and storage

### Core Systems

| System | Purpose |
|---|---|
| Authentication | Sign up, login, password reset, optional social login |
| Application Approval System | Admin reviews, approves/rejects creator applications |
| User Database | Stores profiles, followers, activity |
| Project Database | Stores listings, roles, applicants, audition tapes |
| Audition Submission System | Actors submit profiles, headshots, and video auditions; producers review |
| CMS | Editors publish articles, news, and events |
| Event System | RSVPs, ticketing, guest lists |
| Reviews & Ratings | Verified member reviews of acting classes |
| Notifications | Push notifications for new projects, application updates, events, followers |
| Messaging *(Phase 2)* | Direct messaging between members |

---

## 🛠️ Admin Dashboard

A full control panel for platform administrators including:
- Member application approval and account management
- Project moderation
- Article and event management
- Review moderation

---

## 🏗️ Infrastructure

- **Hosting:** AWS / Google Cloud / Vercel
- **Media Storage:** Video auditions, reels, images (CDN required for fast delivery)
- **Security:** Secure authentication, content moderation, anti-spam, application review gating

---

## 💰 Monetization

| Stream | Model |
|---|---|
| Premium Membership | Monthly subscription for creators — unlimited applications, featured profiles, analytics |
| Featured Project Listings | Producers pay to boost visibility |
| Class Partnerships | Listing fees + revenue share with acting coaches |
| Events | Ticket sales + sponsorships |
| Sponsored Articles | Film brands sponsor editorial content |

---

## 🗺️ Development Roadmap

### Phase 1 — MVP *(~6 months)*
- Creator profiles and application/approval system
- Project marketplace
- Articles section
- Events system
- Admin dashboard

### Phase 2
- Direct messaging between members
- Activity feed
- Class reviews and ratings
- Push notifications

### Phase 3
- Video audition uploads
- Advanced search and filtering
- Premium membership tiers

---

## 💸 Estimated Build Cost

| Scope | Estimate |
|---|---|
| MVP | $60,000 – $150,000 |
| Full Platform | $200,000+ |

*Varies depending on team composition and geographic location.*

---

## 👷 Team Required

**Technical:**
- Mobile developer (React Native or Flutter)
- Backend developer (Node.js / PostgreSQL)
- UI/UX designer
- Product manager

**Business:**
- Partnerships manager (coaches, sponsors)
- Content editor (articles, news)
- Community manager

---

## 🏆 Competitive Advantage

Platforms like **Backstage** and **IMDb Pro** address pieces of this space, but none combine casting, networking, education, events, and media into a single ecosystem purpose-built for **pre-union creatives**. FilmLink is that missing network.

---

## 📄 License

TBD

---

*This README reflects the current product vision and technical requirements. The platform name is a working title and subject to change.*