# Car Showroom — PostgreSQL & Supabase Migration Guide

Ye file `Car-Showroom/server` folder mein rakhi ja sakti hai.

---

## 1. Local Database Check

### Local PostgreSQL ke databases dekhna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -l
```

**Kaam:**
Local PostgreSQL mein available databases ki list show karta hai.

**Hamare project ka database:**

```text
showroom_db
```

---

## 2. Local Database → SQL File Export

### Existing local data ko SQL file mein export karna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d showroom_db --data-only --no-owner --no-privileges -f showroom_data.sql
```

**Kaam:**
Local `showroom_db` ke existing **data** ko `showroom_data.sql` file mein save karta hai.

**Kab use karna hai?**

Jab local database ka data Supabase ya kisi doosre PostgreSQL database mein transfer karna ho.

**Output:**

```text
showroom_data.sql
```

---

## 3. SQL File Exist Check

### Check karna ke SQL file bani hai ya nahi

```powershell
Get-Item .\showroom_data.sql
```

**Kaam:**
Check karta hai ke `showroom_data.sql` current folder mein موجود hai.

Alternative:

```powershell
Test-Path .\showroom_data.sql
```

Agar:

```text
True
```

aaye → file موجود hai.

---

## 4. Supabase mein Data Import

### Local SQL dump ko Supabase database mein import karna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -f .\showroom_data.sql
```

**Kaam:**
`showroom_data.sql` ke andar jo data hai usko Supabase PostgreSQL mein insert karta hai.

### Important

`SUPABASE_CONNECTION_STRING` ko actual Supabase connection string se replace karna hai.

Example:

```text
postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

**Password kisi ke saath share na karein.**

---

## 5. Supabase Tables Check

### Supabase database ke tables dekhna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -c "\dt"
```

**Kaam:**
Supabase database mein available tables show karta hai.

Example:

```text
cars
users
...
```

---

## 6. Supabase Data Count Check

### Cars table mein kitna data hai check karna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -c "SELECT COUNT(*) FROM cars;"
```

**Kaam:**
`cars` table mein total records/count show karta hai.

Example:

```text
 count
-------
    25
```

Matlab `cars` table mein 25 records hain.

---

## 7. Supabase Table ka Data Dekhna

### Cars ka complete data dekhna

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -c "SELECT * FROM cars;"
```

**Kaam:**
`cars` table ke records terminal mein show karta hai.

---

# Prisma Commands

## 8. Prisma Schema → Database

```powershell
npx prisma db push
```

**Kaam:**
`schema.prisma` ke according database mein tables/columns create/update karta hai.

### Important

`db push` **existing local data ko automatically transfer nahi karta.**

Ye mainly database **structure** ke liye hai.

---

## 9. Database → Prisma Schema

```powershell
npx prisma db pull
```

**Kaam:**
Existing PostgreSQL database ki structure ko read karke `schema.prisma` update karta hai.

### Important

`db pull` bhi data transfer nahi karta.

---

## 10. Prisma Client Generate

```powershell
npx prisma generate
```

**Kaam:**
Prisma Client generate/update karta hai taake backend Prisma ke through database se communicate kar sake.

---

# Our Car Showroom Setup

Current setup:

```text
LOCAL PostgreSQL
      │
      │ pg_dump
      ↓
showroom_data.sql
      │
      │ psql
      ↓
SUPABASE PostgreSQL
      │
      ├── Tables ✅
      └── Existing Data ✅
```

Production:

```text
React Frontend
      ↓
Express Backend
      ↓
Prisma
      ↓
Supabase PostgreSQL
```

---

# Most Important Commands

Agar future mein commands bhool jao, sirf ye section dekho.

### Local → SQL backup

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d showroom_db --data-only --no-owner --no-privileges -f showroom_data.sql
```

### SQL → Supabase

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -f .\showroom_data.sql
```

### Supabase tables check

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -c "\dt"
```

### Supabase data check

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "SUPABASE_CONNECTION_STRING" -c "SELECT COUNT(*) FROM cars;"
```

### Prisma Client

```powershell
npx prisma generate
```

---

# ⚠️ Important Notes

* `showroom_db` = **local database**
* `postgres` = **Supabase database**
* `pg_dump` = database ka data **export/backup**
* `psql -f` = SQL file ko database mein **import**
* `db push` = database **structure**
* `db pull` = database structure ko Prisma mein **pull**
* `prisma generate` = Prisma Client generate
* `showroom_data.sql` = local database ka exported data
* Supabase ka password/API keys **GitHub par commit nahi karna**

---

## Deployment ke waqt

Production deployment mein normally local `pg_dump`/`psql` commands ki zaroorat nahi hogi.

Backend ke environment variables mein Supabase database connection string set karni hogi:

```env
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
```

Aur deployment/build ke dauran:

```bash
npx prisma generate
```

run karna hoga.
