System Specification
🧾 Summary
PRITECH VIOR is a Tanzanian-based IT innovation and solution provider offering:

🛠️ Project design & implementation (students & enterprises)

🛍️ A digital shop (physical + digital products) with POS

🎓 E-learning platform with global course access

💬 Internal real-time collaboration tools

💾 Application Software Archive

💳 USSD-based AzamPay payment integration

🧾 Financial & treasury management

⚙️ Microservices-based modular system

🧑‍💼 Role-based access aligned with company structure

☁️ Fully deployable on cPanel with MySQL

📱 Mobile-first PWA with full responsiveness

🧱 Architecture & Tech Stack
Layer	Technology
Frontend	React (SPA via Vite), TailwindCSS, Framer Motion, Three.js, Neumorphic UI
Backend	Django + Django REST Framework, Django Channels (WebSocket)
Database	MySQL (cPanel hosted), Django ORM (migration-based)
Auth	Custom user model with Role-Based Access Control
Real-Time	Django Channels + Redis for chat/notifications
Payments	AzamPay API (USSD & webhook-based)
PWA	Full support: manifest.json, service workers, offline caching
Deployment	cPanel (Python 3.11.13 via WSGI), React frontend via public_html

🧑‍💼 User Roles
Role	Description
Admin	Full access to all modules
Project Manager	Manages student & enterprise projects
Developer	Manages internal tools and uploads software
Designer	Manages design assets and visuals
Treasury	Handles financials, transactions, reports
Sales/Marketing	Product listings, SEO, and promotions
Customer Support	Responds to user issues, manages support tickets
Instructor	Creates and manages courses, quizzes
Student	Access to e-learning and student projects
Client	Enterprise project requester
Learner	Limited e-learning access
Guest	Browses public pages only

📦 System Modules
1. 🎓 E-Learning
Instructor dashboard

Upload lessons (YouTube, Vimeo, or direct)

Quizzes with auto/manual grading

Certificate generation (PDF)

Learner progress tracking

AzamPay-based payment lock/unlock

2. 💡 Project Management
Student & Enterprise projects

Upload briefs, ZIPs, source code, screenshots

Version control and status updates

Approval flow

Download access (free or paid)

3. 🛍️ Shop & POS
A. POS
React-based in-office terminal

Barcode scanning, receipt printing

Offline-first sync (localStorage + server)

B. Product Types
Tanzanian local goods

Amazon/AliExpress affiliate items

Office tools (hardware/software)

C. Shop Features
Cart, checkout, AzamPay USSD

Order management (Sales → Treasury → Delivery)

Invoice PDF, reviews & ratings

4. 💾 Application Software Archive
Public + internal ZIP/PDF downloads

Usage stats, license info

Tagged by category (POS, HR, etc.)

5. 💬 Real-Time Communication
Direct & group chat

Project teams & role-based rooms

Live push notifications (projects, shop, courses)

6. 🧾 Treasury
Full transaction logging

Income/expense dashboards

Manual entries + exports (PDF/CSV)

AzamPay sync

7. 📚 Static Content & Blog
Pages: Home, About, Services, Contact

Blog/news system

FAQ & help center

💳 AzamPay Integration
Endpoint	Description
/api/initiate-payment/	Starts USSD prompt
/api/azam-callback/	Verifies payment via webhook
/api/transaction-log/	Logs payment info

Mapped to: Order, CourseAccess, ProjectDownload.

🗃️ Database & Seeding
Django ORM (MySQL, migration-based)

Initial command:

bash
Copy
Edit
python manage.py seed_data
Seeds:

User roles

Sample projects, courses, products

Default admin user

🔗 Microservices (Django Apps)
Service	Description
Auth	JWT, sessions, permissions
Project	All project-related logic
Shop	Products, orders, POS
E-Learning	Courses, quizzes, certificates
Chat	Real-time comms (WebSockets)
Payment	AzamPay API handlers
Archive	Software download archive

🛠 Deployment (cPanel)
Backend
Upload zipped Django app or pull via Git

Use Python 3.11.13 App in cPanel

Install packages with requirements.txt

Configure WSGI, static, and media paths

Connect MySQL in settings.py

Frontend
Build:

bash
Copy
Edit
npm run build
Upload dist/ to public_html/

.htaccess for SPA fallback

Include:

manifest.json

service-worker.js

Offline support & add-to-home functionality (PWA)

🧠 Main Landing Page — Horizontal 3D Storytelling
Concept
A horizontal scroll-based PWA experience like walking through a virtual IT agency. Each "room" reveals a module.

Section	Experience
🏠 Lobby	Animated welcome room with 3D logo
🧪 Lab	Floating project displays
📚 Studio	Interactive e-learning course wall
🛒 Shop	3D showroom with POS and products
💾 Archive	Vault-style software drawers
💬 Collab Hall	Chat pods and team panels
💳 Treasury	Financial dashboards in VR panels
🌐 Exit Hub	Contact forms, social links

UX Stack
Three.js / React Three Fiber — immersive 3D

Framer Motion + GSAP — scroll animations

TailwindCSS — responsive, neumorphic UI

Locomotive Scroll / Lenis — horizontal flow

React PWA Plugin — for service worker & manifest

✅ Developer Deliverables
A developer can use this spec to:

Build all backend Django services

Connect frontend React app with neumorphic & 3D UI

Integrate AzamPay USSD flows

Deploy to cPanel (Python 3.11.13 + MySQL)

Enable full PWA support with mobile-first UX

Implement the horizontal 3D path-scroll storytelling landing page