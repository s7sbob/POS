# تحليل المشروع وخطة التنفيذ

## البنية المكتشفة

### 1. بنية الصفحات
- الصفحات موجودة في: `src/Pages/`
- كل صفحة لها مجلد خاص بها
- المكونات الخاصة بكل صفحة في مجلد `components/`

### 2. بنية API
- ملفات API في: `src/utils/api/pagesApi/`
- كل صفحة لها ملف API خاص
- النمط المستخدم:
  - `getAll()` - جلب جميع السجلات
  - `getById(id)` - جلب سجل واحد
  - `add(data)` - إضافة سجل جديد
  - `update(data)` - تحديث سجل موجود

### 3. بنية الترجمة
- ملفات الترجمة في: `src/utils/languages/`
- `ar.json` - الترجمة العربية
- `en.json` - الترجمة الإنجليزية
- استخدام `react-i18next` للترجمة
- المفاتيح منظمة بشكل هرمي

### 4. بنية Sidebar
- ملف القائمة الجانبية: `src/layouts/full/vertical/sidebar/MenuItems.ts`
- يستخدم مفاتيح الترجمة من `sidebar.*`
- البنية الهرمية: Category → Children → Sub-children

## الطلبات المطلوبة

### 1. إضافة قسم HR في Sidebar
- إضافة category جديدة باسم "HR"
- إضافة صفحة "HR" داخل القسم

### 2. Endpoints المطلوبة
- `GET /getEmployees` - جلب جميع الموظفين
- `POST /addEmployee` - إضافة موظف جديد
- `POST /updateEmployee` - تحديث موظف
- `GET /getEmployee?EmployeeID=xxx` - جلب موظف واحد

### 3. حقول Employee
```typescript
{
  id: string;
  employeeCode: number;
  employeeName: string;
  workingHours: string;
  hourSalary: string;
  createDate: string;
  lastModifyDate: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
  lastSyncDate: string;
  isActive: boolean;
}
```

## خطة التنفيذ

### Phase 3: إضافة المميزات والطلبات الجديدة

1. **إنشاء ملف API للموظفين**
   - `src/utils/api/pagesApi/employeesApi.ts`
   - تعريف Type للـ Employee
   - إنشاء دوال API (getAll, getById, add, update)

2. **إنشاء صفحة الموظفين**
   - `src/Pages/hr/EmployeesPage.tsx`
   - نسخ البنية من SuppliersPage
   - تعديل الحقول حسب Employee

3. **إنشاء مكونات الصفحة**
   - `src/Pages/hr/components/PageHeader.tsx`
   - `src/Pages/hr/components/ActionsBar.tsx`
   - `src/Pages/hr/components/EmployeeTable.tsx`
   - `src/Pages/hr/components/EmployeeRow.tsx`
   - `src/Pages/hr/components/EmployeeForm.tsx`
   - `src/Pages/hr/components/mobile/MobileEmployeesFilter.tsx`

4. **تحديث MenuItems**
   - إضافة قسم HR في `MenuItems.ts`

5. **تحديث Router**
   - إضافة route للصفحة الجديدة

### Phase 4: إضافة الترجمات

1. **إضافة مفاتيح Sidebar**
   - `sidebar.hr` - "HR" / "الموارد البشرية"
   - `sidebar.employees` - "Employees" / "الموظفين"

2. **إضافة مفاتيح الصفحة**
   - `hr.employees.title` - "Employees" / "الموظفين"
   - `hr.employees.add` - "Add Employee" / "إضافة موظف"
   - `hr.employees.edit` - "Edit Employee" / "تعديل موظف"
   - `hr.employees.employeeCode` - "Employee Code" / "كود الموظف"
   - `hr.employees.employeeName` - "Employee Name" / "اسم الموظف"
   - `hr.employees.workingHours` - "Working Hours" / "ساعات العمل"
   - `hr.employees.hourSalary` - "Hour Salary" / "أجر الساعة"
   - وغيرها...

## الملفات التي سيتم إنشاؤها

1. `src/utils/api/pagesApi/employeesApi.ts`
2. `src/Pages/hr/EmployeesPage.tsx`
3. `src/Pages/hr/components/PageHeader.tsx`
4. `src/Pages/hr/components/ActionsBar.tsx`
5. `src/Pages/hr/components/EmployeeTable.tsx`
6. `src/Pages/hr/components/EmployeeRow.tsx`
7. `src/Pages/hr/components/EmployeeForm.tsx`
8. `src/Pages/hr/components/mobile/MobileEmployeesFilter.tsx`

## الملفات التي سيتم تعديلها

1. `src/layouts/full/vertical/sidebar/MenuItems.ts`
2. `src/routes/Router.tsx`
3. `src/utils/languages/ar.json`
4. `src/utils/languages/en.json`
5. `src/config/pagePermissions.ts` (إذا كان موجود)

