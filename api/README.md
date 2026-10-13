# Bharatiya Yuva Kranti (Indian Youth Foundation)
## Complete REST API Documentation & REST Client Suite

This folder contains the complete, modular REST API collection for **Bharatiya Yuva Kranti (Indian Youth Foundation)**. Each file is formatted for instant execution with the **REST Client** extension in VS Code / Antigravity IDE.

---

### 📂 Directory Structure

| File | Module Description | Access Level |
| :--- | :--- | :--- |
| `01_auth.http` | Registration, Login, Token retrieval, Profile update, Forgot Password, Reset Password | Public / User / Admin |
| `02_membership_plans.http` | Dynamic custom membership plans (View, Create, Update, Delete) | Public / Admin |
| `03_applications.http` | Membership & Volunteer applications with payment screenshots, UTR, and Admin verification | User / Admin |
| `04_donations.http` | Donation order creation, payment submission, Admin verification, Section 80G tax receipt dispatch, and Excel export | Public / User / Admin |
| `05_members.http` | Members directory, status updates, direct verification, Excel export, today's birthdays, and coordinator stats | Admin / Manager / Coord |
| `06_certificates.http` | Digital appreciation and recognition certificates issuance with QR codes and email delivery | Public / Admin |
| `07_campaigns.http` | Crowdfunding campaigns and social welfare initiatives CRUD | Public / Admin |
| `08_events.http` | Youth events, conclaves, and programs management | Public / Admin / Manager |
| `09_news.http` | Press releases and portal news publications | Public / Admin / Manager |
| `10_gallery.http` | Event photos and YouTube video gallery links | Public / Admin / Manager |
| `11_grievances.http` | Public and member complaints ticketing & resolution | Public / User / Admin |
| `12_audit_reports.http` | Statutory CA Balance Sheet & Income-Expenditure statements | Public / Admin |
| `13_settings.http` | Trust metadata, Head office address, dynamic SMTP Gmail credentials, and PWA analytics | Public / Admin |
| `14_email_logs.http` | Audit logs of all dispatched emails and delivery status | Admin |
| `15_public_verifications.http` | Public scan endpoints for Member IDs, Certificates, and Section 80G Donation Receipts | Public |
| `16_uploads.http` | File and document upload endpoints to `backend/uploads/` | Public / User / Admin |

---

### 🚀 How to Execute with REST Client

1. Open any `.http` file in your editor.
2. Click the **"Send Request"** link that appears above any `GET`, `POST`, `PUT`, or `DELETE` line.
3. Authenticate first using `01_auth.http` (either `POST {{baseUrl}}/auth/login` or `register`).
4. The Bearer token is automatically captured or can be manually pasted into `@userToken` or `@adminToken`.
5. For privileged Admin endpoints, the header `x-admin-secret-key: {{adminSecretKey}}` is included and pre-configured to match your `backend/.env`.

---

### 🛡️ Architecture & Compliance (Zero-Fraud Assurance)

1. **Section 12A & 80G Statutory Integrity**:
   - Official 80G Tax Exemption receipts are **never** auto-generated on arbitrary button clicks.
   - Every donation remains in `pending` state until the Trustee verifies the bank settlement. Upon Admin approval, a unique statutory receipt number is conferred and dispatched via email.
2. **Verified Identity Credentials**:
   - Members and Volunteers select dynamic plans, review Trust banking details (`HDFC Bank Ltd.` / UPI: `bharatiyauva@okhdfcbank`), and upload payment screenshots.
   - Dual-sided ID cards and Appointment Letters are permanently locked with anti-fraud banners until Trustee approval.
3. **Clean Architecture Separation**:
   - **Routes**: Modular route handlers under `backend/routes/`
   - **Controllers**: Thin HTTP request parsers under `backend/controllers/`
   - **Services**: Pure business logic and email dispatches under `backend/services/`
   - **Repositories**: Database queries under `backend/repositories/`
   - **Datastore**: Real MongoDB Mongoose database; no mock in-memory stores.

---

### 📞 Official Head Office & Support
- **Organization**: Indian Youth Foundation (भारतीय युवा क्रांति)
- **Head Office**: Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001
- **Official Email**: samasyasamadhanparishad@gmail.com
- **Phone**: +91 93196 98759
