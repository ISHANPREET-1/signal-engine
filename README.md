# ⚡ Signal Engine

> AI-powered GTM intelligence platform that detects buying signals, identifies decision-makers, and generates personalized outbound outreach automatically.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb" />
  <img src="https://img.shields.io/badge/Groq-LLM-orange" />
  <img src="https://img.shields.io/badge/HubSpot-CRM-orange?logo=hubspot" />
  <img src="https://img.shields.io/badge/Slack-Integration-purple?logo=slack" />
</p>

---

# 🚀 Live Demo

🌐 **Website:** https://signal-engine-pied.vercel.app

---

# The Problem

Outbound sales is often generic.

Sales teams spend hours researching prospects, identifying decision-makers, reading company news, and manually writing personalized outreach.

Most emails are sent without knowing whether the company is actually in a buying cycle.

Signal Engine automates this entire workflow.

---

# What Signal Engine Does

Given a target company and your product description, Signal Engine automatically:

- Detects buying signals
- Finds decision-makers
- Generates personalized outreach
- Pushes contacts into HubSpot
- Sends Slack notifications
- Stores pipeline history in MongoDB

---

# Workflow

```text
Target Company
       │
       ▼
Research Company
(News • Hiring • Funding)
       │
       ▼
Detect Buying Signals
       │
       ▼
Find Decision Maker
(Hunter.io)
       │
       ▼
Generate AI Outreach
(Groq LLM)
       │
       ▼
HubSpot CRM
       │
       ▼
Slack Notification
       │
       ▼
MongoDB
```

---

# Features

### Company Research

- Company news aggregation
- Hiring activity detection
- Funding signal detection
- Competitor insight extraction

### AI Reasoning

Signal Engine analyzes business signals and generates:

- Personalized email subject
- Personalized email body
- LinkedIn outreach
- Signal explanation

### Contact Enrichment

Automatically identifies:

- Decision maker
- Job title
- Email address
- Company domain

### CRM Integration

- Automatically creates contacts in HubSpot

### Slack Integration

- Sends pipeline summaries directly to Slack

### Interactive Dashboard

- Buying intent score
- Signal timeline
- Company overview
- AI-generated outreach
- Contact information

---

# Tech Stack

## Frontend

- React
- React Router
- CSS Modules
- React Icons

## Backend

- Node.js
- Express
- MongoDB
- Mongoose

## AI

- Groq LLM

## APIs

- Hunter.io
- HubSpot
- News API
- Slack Webhooks

---

# Project Structure

```text
signal-engine/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── server.js
│
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/ISHANPREET-1/signal-engine.git
```

Install frontend

```bash
cd frontend
npm install
```

Install backend

```bash
cd ../backend
npm install
```

---

# Environment Variables

```env
MONGODB_URI=
GROQ_API_KEY=
HUNTER_API_KEY=
HUBSPOT_API_KEY=
SLACK_WEBHOOK_URL=
NEWS_API_KEY=
```

---

# Running Locally

Backend

```bash
cd backend
npm start
```

Frontend

```bash
cd frontend
npm start
```

---

# Architecture

```text
React
      │
      ▼
Express API
      │
      ├── News API
      ├── Hunter.io
      ├── Groq
      ├── HubSpot
      ├── Slack
      └── MongoDB Atlas
```

---

# Future Improvements

- Intelligent signal classification
- Explainable buying intent scoring
- ICP-based prospect discovery
- Search history
- Authentication
- Multi-company analysis
- Additional CRM integrations

---

# What I Learned

Building Signal Engine helped me gain hands-on experience with:

- Designing AI-powered workflows
- Integrating multiple third-party APIs
- Prompt engineering for business use cases
- CRM automation
- Full-stack application architecture
- Production deployment using Vercel and Render
- Building resilient systems with graceful error handling

---

# Author

**Ishanpreet Singh**

Computer Engineering @ Thapar Institute of Engineering and Technology

GitHub: https://github.com/ISHANPREET-1

---

⭐ If you found this project interesting, consider starring the repository.
