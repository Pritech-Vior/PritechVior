🔖 agent.md — PRITECH VIOR Enterprise System Specification
🧾 Summary
PRITECH VIOR is an IT innovation and project solution provider based in Tanzania, offering:

Project design and implementation (students & enterprise clients)

A full-featured digital system shop (software + physical products)

E-learning platform with local/international course offerings

Internal real-time collaboration (chat, project teams)

A full Application Software Archive

USSD-based AzamPay payment integration

Point of Sale (POS) for in-office & field sales

Multi-role access control based on a real company structure

Fully deployable on cPanel with MySQL, using microservices

🧱 Architecture & Tech Stack
Layer	Technology
Frontend	React (SPA via Vite), TailwindCSS, Neumorphic UI, Framer Motion
Backend	Django (REST Framework), Django Channels, Microservice-based
Database	MySQL (cPanel hosted), using Django ORM migrations
Auth	Custom User Model, Role-Based Access
Real-Time	Django Channels + Redis (WebSockets for chat, notifications)
Payments	AzamPay API (USSD + Webhooks)
Deployment	cPanel (WSGI for Python app, public_html for frontend)

🧑‍💼 User Roles
Role	Permissions
Admin	Full system control
Project Manager	Manages both student & enterprise projects
Developer	Manages systems and internal software tools
Designer	Uploads designs and visuals
Treasury	Handles financial reporting and payment integration
Sales/Marketing	Shop listings, promotions, SEO
Customer Support	Ticket & chat support for all users
Instructor	Manages e-learning content, courses, and learners
Student	Access to projects, e-learning, and shop
Client	Company/enterprise clients for project requests
Learner	Participates in e-learning only
Guest	Browse public content only

📦 Modules Overview
1. 🎓 E-Learning
Instructor dashboard for course creation

Lesson upload (YouTube, Vimeo, or direct upload)

Quizzes: Auto/manual grading

Learner profile with progress tracking

Course search by topic, category

Certificate generation (PDF)

Payment lock/unlock (via AzamPay)

2. 💡 Project Management
Projects categorized as:

Student Projects (final year, mini projects)

Enterprise Projects (internal or client-commissioned)

Student uploads via form (brief, code, ZIP, images)

Admin/PM approval flow

Download access post-payment or free

Versioning & status tracking

3. 🛍️ System Shop & POS
A. 🔄 POS Integration
For in-office & kiosk sales (React-based POS frontend)

Staff login, barcode scanning, receipt printing

Inventory sync with product module

Offline-first (localStorage + sync queue)

B. 🛒 Multi-Type Products
Tanzanian local goods (e.g., electronics, crafts)

Imported items from Amazon, AliExpress (with affiliate/reseller tracking)

Office inventory (in-house equipment or software tools)

Digital and physical product support

C. Shop Features
Product details (price, brand, condition, shipping)

Cart + checkout flow

AzamPay payment support (USSD prompt + confirmation)

Order management (Sales → Treasury → Delivery)

Invoice generation (PDF)

Reviews & ratings

4. 🧑‍💻 Application Software Archive
Internal & public downloadable tools (ZIP, PDF)

Categorized (POS, HR, Inventory, etc.)

Uploaded by Developers

Usage stats & download count

Licensing information

5. 💬 Real-Time Communication
User ↔ User chat (e.g., Dev ↔ Designer)

Team group chat (e.g., Project group)

Push notifications for:

New orders

Project updates

Course announcements

Powered by Django Channels + WebSocket

Notification model tied to all key entities

6. 🧾 Treasury Management
View all transactions (AzamPay + manual)

Dashboard for income/expense stats

Exportable financial reports

Transaction-to-user mapping

Manual record entry (offline payments)

7. 📚 Static Content & Blog
Home, About, Contact, Services

Blog/news section (optional)

Support FAQs (student/client/project)

💳 AzamPay USSD Integration
Endpoint	Purpose
/api/initiate-payment/	Starts USSD flow for checkout
/api/azam-callback/	Webhook to confirm payment
/api/transaction-log/	Logs for treasury & reporting

Mapped to Order, CourseAccess, or ProjectDownload.

🗃️ Database & Seeding
MySQL (hosted via cPanel)

Managed via Django ORM

makemigrations + migrate

Initial seed command:

bash
Copy
Edit
python manage.py seed_data
Includes:

Roles

Default admin user

Sample projects, products, and courses

🔗 Microservices Architecture (By Function)
Service	Tech/Notes
Auth Service	Django App + JWT session/token auth
Project Service	Separate Django app handling projects
Shop Service	Product, POS, and order logic
E-learning Service	Manages courses and content
Chat Service	Channels + Redis
Payment Service	AzamPay interaction logic
Archive Service	Manages downloadable software tools

Each Django app has its own models, views, serializers, URLs — bound together via a central router.

🛠 Deployment (cPanel)
Backend (Django)
Upload ZIP or clone via Git

Use Python App (3.11.13) in cPanel

Install required packages (requirements.txt)

Configure WSGI & static/media files

Link MySQL via settings.py

Frontend (React SPA)
Build: npm run build

Upload dist/ to public_html/

Use .htaccess to redirect to index.html (SPA fallback)

✅ Deliverables to Developer
You can now give this entire spec to any developer to:

Build backend microservices (Django apps)

Connect MySQL via XAMPP for dev or cPanel live

Integrate AzamPay payment flow

Build React SPA frontend with neumorphic style

Deploy on cPanel using Python 3.11.13