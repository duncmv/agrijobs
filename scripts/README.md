# Demo Users and Login Information

This document provides information about all demo users created in the database for testing purposes.

## Admin Users

### Admin User
- **Email:** `admin@agrijobs.ug`
- **Password:** `admin123`
- **Role:** `admin`
- **Name:** Admin User
- **Phone:** +256 700 000 000
- **Description:** System administrator with full access to review jobs, manage users, and view analytics

## Employer Users

### Duncan Asiimwe
- **Email:** `duncan@agrijobs.ug`
- **Password:** `demo123` (demo password hash)
- **Role:** `employer`
- **Name:** Duncan Asiimwe
- **Phone:** +256 700 123 456
- **Description:** Main employer who owns multiple agricultural organizations
- **Organizations Owned:**
  - Nakasero Organic Farms (Mixed enterprise)
  - Mukono Dairy Cooperative (Livestock)
  - Jinja Horticulture Center (Horticulture)
  - Masaka Crop Research Station (Crop farm)

## Job Seeker Users

### Mary Nakato
- **Email:** `mary.nakato@email.com`
- **Password:** `demo123` (demo password hash)
- **Role:** `job_seeker`
- **Name:** Mary Nakato
- **Phone:** +256 700 111 111
- **Location:** Wakiso, Entebbe
- **Experience:** 5 years
- **Education:** Certificate
- **Specialization:** Crop farming and livestock management
- **Skills:** Tractor operation, irrigation systems, pest management
- **Salary Expectation:** 800,000 - 1,200,000 UGX
- **Languages:** English, Luganda

### Peter Mukasa
- **Email:** `peter.mukasa@email.com`
- **Password:** `demo123` (demo password hash)
- **Role:** `job_seeker`
- **Name:** Peter Mukasa
- **Phone:** +256 700 222 222
- **Location:** Mukono, Ntinda
- **Experience:** 8 years
- **Education:** Diploma
- **Specialization:** Horticulture and greenhouse management
- **Skills:** Greenhouse management, crop production, soil fertility
- **Salary Expectation:** 1,000,000 - 1,500,000 UGX
- **Languages:** English, Luganda, Swahili

### Grace Namukasa
- **Email:** `grace.namukasa@email.com`
- **Password:** `demo123` (demo password hash)
- **Role:** `job_seeker`
- **Name:** Grace Namukasa
- **Phone:** +256 700 333 333
- **Location:** Masaka, Central
- **Experience:** 6 years
- **Education:** Certificate
- **Specialization:** Livestock farming and dairy management
- **Skills:** Livestock husbandry, dairy management, veterinary care
- **Salary Expectation:** 900,000 - 1,300,000 UGX
- **Languages:** English, Luganda

### Joseph Kato
- **Email:** `joseph.kato@email.com`
- **Password:** `demo123` (demo password hash)
- **Role:** `job_seeker`
- **Name:** Joseph Kato
- **Phone:** +256 700 444 444
- **Location:** Jinja, Central
- **Experience:** 7 years
- **Education:** Certificate
- **Specialization:** Agricultural equipment maintenance
- **Skills:** Equipment maintenance, tractor repair, machinery operation
- **Salary Expectation:** 1,200,000 - 1,800,000 UGX
- **Languages:** English, Luganda

### Sarah Nabukeera
- **Email:** `sarah.nabukeera@email.com`
- **Password:** `demo123` (demo password hash)
- **Role:** `job_seeker`
- **Name:** Sarah Nabukeera
- **Phone:** +256 700 555 555
- **Location:** Kampala, Nakawa
- **Experience:** 1 year
- **Education:** Degree
- **Specialization:** Modern agricultural techniques
- **Skills:** Modern farming, sustainable agriculture, crop monitoring
- **Salary Expectation:** 600,000 - 900,000 UGX
- **Languages:** English, Luganda

## Demo Organizations

### Nakasero Organic Farms
- **Type:** Individual Farm
- **Enterprise:** Mixed (crops and livestock)
- **Location:** Wakiso, Nakasero
- **Size:** 25.5 acres
- **Stage:** Established
- **Contact:** Duncan Asiimwe (Farm Manager)
- **Website:** https://nakasero-farms.com

### Mukono Dairy Cooperative
- **Type:** Cooperative
- **Enterprise:** Livestock (dairy)
- **Location:** Mukono, Central
- **Size:** 50.0 acres
- **Stage:** Established
- **Contact:** Duncan Asiimwe (Cooperative Manager)
- **Website:** https://mukono-dairy.coop

### Jinja Horticulture Center
- **Type:** Agribusiness
- **Enterprise:** Horticulture
- **Location:** Jinja, Central
- **Size:** 15.0 acres
- **Stage:** Established
- **Contact:** Duncan Asiimwe (Operations Manager)
- **Website:** https://jinja-horticulture.com

### Masaka Crop Research Station
- **Type:** NGO
- **Enterprise:** Crop Farm
- **Location:** Masaka, Central
- **Size:** 100.0 acres
- **Stage:** Established
- **Contact:** Duncan Asiimwe (Research Director)
- **Website:** https://masaka-research.org

## Demo Jobs

### Organic Farm Worker
- **Organization:** Nakasero Organic Farms
- **Workers Needed:** 3
- **Type:** Full-time
- **Duration:** 12 months
- **Salary:** 800,000 - 1,200,000 UGX
- **Requirements:** Secondary education, 2 years experience
- **Skills:** Organic farming, crop rotation, composting

### Tractor Operator
- **Organization:** Nakasero Organic Farms
- **Workers Needed:** 1
- **Type:** Full-time
- **Duration:** 12 months
- **Salary:** 1,000,000 - 1,500,000 UGX
- **Requirements:** Certificate education, 3 years experience
- **Skills:** Tractor operation, equipment maintenance

### Dairy Farm Worker
- **Organization:** Mukono Dairy Cooperative
- **Workers Needed:** 4
- **Type:** Full-time
- **Duration:** 12 months
- **Salary:** 700,000 - 1,000,000 UGX
- **Requirements:** Primary education, 1 year experience
- **Skills:** Livestock husbandry, milking, cattle care

### Greenhouse Technician
- **Organization:** Jinja Horticulture Center
- **Workers Needed:** 2
- **Type:** Full-time
- **Duration:** 12 months
- **Salary:** 900,000 - 1,300,000 UGX
- **Requirements:** Certificate education, 2 years experience
- **Skills:** Greenhouse management, crop production

### Agricultural Research Assistant
- **Organization:** Masaka Crop Research Station
- **Workers Needed:** 1
- **Type:** Full-time
- **Duration:** 12 months
- **Salary:** 1,200,000 - 1,800,000 UGX
- **Requirements:** Degree education, 1 year experience
- **Skills:** Research methods, data collection, crop monitoring

## Usage Instructions

1. **To run the seeding script:**
   ```bash
   node scripts/comprehensive-seed.js
   ```

2. **To test different user roles:**
   - Use the admin credentials to access the admin panel
   - Use Duncan's credentials to post jobs and manage organizations
   - Use any job seeker credentials to browse jobs and create profiles

3. **Note:** All demo users (except admin) use the password `demo123`. The admin uses `admin123`.

4. **Candidate Display:** The candidates page now shows first names (Mary, Peter, Grace, Joseph, Sarah) instead of generic "Job Seeker" labels for better user experience while maintaining privacy.

## Troubleshooting

### Login Issues
If you're having trouble logging in with demo users:

1. **Run the password fix script:**
   ```bash
   node scripts/fix-passwords.js
   ```

2. **Verify credentials:**
   - Admin: `admin@agrijobs.ug` / `admin123`
   - All other users: `[email]` / `demo123`

3. **Check database:**
   ```bash
   sqlite3 dev.db "SELECT email, role FROM users;"
   ```

## Database Statistics

- **Total Users:** 7 (1 admin, 1 employer, 5 job seekers)
- **Employee Profiles:** 5 (complete profiles for all job seekers)
- **Organizations:** 4 (all owned by Duncan Asiimwe)
- **Jobs:** 5 (all approved and active)
- **User Organizations:** 4 (linking Duncan to his organizations)

---

*This demo data is designed to showcase the platform's capabilities across different user roles and agricultural sectors in Uganda.*
