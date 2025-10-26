# HR Module Implementation

## Overview
تم إضافة قسم كامل لإدارة الموارد البشرية (HR) إلى المشروع بنفس الاحترافية والبنية الموجودة.

## الملفات المضافة

### 1. API Layer
- **`src/utils/api/pagesApi/employeesApi.ts`**
  - تعريف Type للموظف (Employee)
  - دوال API: `getAll()`, `getById()`, `add()`, `update()`
  - تحويل البيانات من API format إلى Frontend format

### 2. صفحة الموظفين الرئيسية
- **`src/Pages/hr/EmployeesPage.tsx`**
  - الصفحة الرئيسية لإدارة الموظفين
  - دعم Desktop و Mobile views
  - نظام فلترة وبحث متقدم
  - إضافة وتعديل الموظفين

### 3. المكونات (Components)

#### Desktop Components
- **`src/Pages/hr/components/PageHeader.tsx`**
  - عنوان الصفحة
  - أزرار Export/Import

- **`src/Pages/hr/components/ActionsBar.tsx`**
  - شريط البحث
  - زر إضافة موظف جديد

- **`src/Pages/hr/components/EmployeeTable.tsx`**
  - جدول عرض الموظفين (DataGrid)
  - أعمدة: الكود، الاسم، ساعات العمل، أجر الساعة، التاريخ، الحالة

- **`src/Pages/hr/components/EmployeeRow.tsx`**
  - عرض بطاقة موظف واحد (Mobile View)

- **`src/Pages/hr/components/EmployeeForm.tsx`**
  - نموذج إضافة/تعديل موظف
  - Validation كامل
  - دعم "Save & Exit" و "Save & Add New"

#### Mobile Components
- **`src/Pages/hr/components/mobile/MobileEmployeesFilter.tsx`**
  - نظام فلترة متقدم للموبايل
  - البحث، الفلترة، الترتيب
  - عرض عدد النتائج

### 4. التكامل مع النظام

#### Sidebar Menu
- **`src/layouts/full/vertical/sidebar/MenuItems.ts`**
  - إضافة قسم "HR" في القائمة الجانبية
  - إضافة صفحة "Employees" تحت قسم HR

#### Router
- **`src/routes/Router.tsx`**
  - إضافة route: `/hr/employees`
  - Protected page مع permissions

#### Import/Export Configuration
- **`src/Pages/components/configs/importExportConfigs.ts`**
  - إضافة `employeesImportExportConfig`
  - دعم استيراد وتصدير بيانات الموظفين

### 5. الترجمات

#### الملف العربي (`src/utils/languages/ar.json`)
```json
"sidebar": {
  "hr": "الموارد البشرية",
  "employees": "الموظفين"
},
"hr": {
  "employees": {
    "title": "الموظفين",
    "add": "إضافة موظف",
    "edit": "تعديل موظف",
    "code": "كود الموظف",
    "name": "اسم الموظف",
    "workingHours": "ساعات العمل",
    "hourSalary": "أجر الساعة",
    // ... المزيد
  }
}
```

#### الملف الإنجليزي (`src/utils/languages/en.json`)
```json
"sidebar": {
  "hr": "HR",
  "employees": "Employees"
},
"hr": {
  "employees": {
    "title": "Employees",
    "add": "Add Employee",
    "edit": "Edit Employee",
    "code": "Employee Code",
    "name": "Employee Name",
    "workingHours": "Working Hours",
    "hourSalary": "Hour Salary",
    // ... more
  }
}
```

## API Endpoints المستخدمة

### 1. Get All Employees
```
GET /getEmployees
```
**Response:**
```json
{
  "isvalid": true,
  "errors": [],
  "data": [
    {
      "id": "uuid",
      "employeeCode": 1,
      "employeeName": "Hadeer Mohamed",
      "workingHours": "8",
      "hourSalary": "250",
      "createDate": "2025-10-16T22:49:53.618513",
      "lastModifyDate": "2025-10-16T22:54:01.1809815",
      "isActive": true
    }
  ]
}
```

### 2. Get Single Employee
```
GET /getEmployee?EmployeeID={id}
```

### 3. Add Employee
```
POST /addEmployee
Body: {
  "EmployeeName": "Mohamed",
  "HourSalary": "150",
  "WorkingHours": "8",
  "IsActive": true
}
```

### 4. Update Employee
```
POST /updateEmployee
Body: {
  "EmployeeID": "uuid",
  "EmployeeName": "Mohamed",
  "HourSalary": "150",
  "WorkingHours": "8",
  "IsActive": true
}
```

## المميزات المضافة

### 1. Responsive Design
- دعم كامل للـ Desktop و Mobile
- تصميم متجاوب لجميع الشاشات
- UI/UX مطابق للصفحات الأخرى

### 2. Search & Filter
- بحث سريع في الاسم والكود
- فلترة حسب الحالة (نشط/غير نشط)
- ترتيب حسب أي عمود

### 3. Form Validation
- التحقق من صحة البيانات
- رسائل خطأ واضحة
- دعم اللغتين العربية والإنجليزية

### 4. Import/Export
- تصدير البيانات إلى Excel/CSV
- استيراد بيانات من Excel/CSV
- Validation للبيانات المستوردة

### 5. Permissions
- صفحة محمية بنظام الصلاحيات
- Permission key: `EMPLOYEES`

## الاستخدام

### إضافة موظف جديد
1. اذهب إلى `/hr/employees`
2. اضغط على "إضافة موظف"
3. املأ البيانات المطلوبة:
   - اسم الموظف (مطلوب)
   - ساعات العمل (مطلوب)
   - أجر الساعة (مطلوب)
   - الحالة (نشط/غير نشط)
4. اختر "حفظ وإغلاق" أو "حفظ وإضافة جديد"

### تعديل موظف
1. اضغط على أيقونة التعديل بجانب الموظف
2. عدل البيانات المطلوبة
3. احفظ التغييرات

### البحث والفلترة
- **Desktop:** استخدم شريط البحث في الأعلى
- **Mobile:** اضغط على أيقونة الفلتر في الأسفل

## الملاحظات التقنية

### Type Safety
- جميع الأنواع معرفة بشكل صحيح
- استخدام TypeScript بشكل كامل

### Code Quality
- نفس الأنماط المستخدمة في المشروع
- Clean Code principles
- Proper error handling

### Performance
- Lazy loading للصفحة
- Memoization للبيانات المفلترة
- Optimized re-renders

## التوافق

✅ متوافق مع البنية الحالية للمشروع
✅ يستخدم نفس المكتبات والأدوات
✅ يتبع نفس أنماط الكود
✅ دعم كامل للترجمة
✅ Responsive design
✅ Protected routes
✅ Import/Export support

## الملفات المعدلة

1. `src/layouts/full/vertical/sidebar/MenuItems.ts` - إضافة قسم HR
2. `src/routes/Router.tsx` - إضافة route جديد
3. `src/utils/languages/ar.json` - إضافة الترجمات العربية
4. `src/utils/languages/en.json` - إضافة الترجمات الإنجليزية
5. `src/Pages/components/configs/importExportConfigs.ts` - إضافة config للـ import/export

## الخطوات التالية (اختياري)

إذا أردت إضافة المزيد من المميزات:

1. **تقارير الموظفين**
   - تقرير الحضور والانصراف
   - تقرير الرواتب
   - تقرير الأداء

2. **إدارة الإجازات**
   - طلبات الإجازات
   - رصيد الإجازات
   - موافقات الإجازات

3. **إدارة الحضور**
   - تسجيل الحضور والانصراف
   - حساب ساعات العمل
   - التأخيرات والغياب

4. **الرواتب**
   - حساب الرواتب الشهرية
   - الخصومات والبونص
   - كشوف المرتبات

