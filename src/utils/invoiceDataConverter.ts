// src/utils/invoiceDataConverter.ts
import * as customersApi from '../utils/api/pagesApi/customersApi';
import * as productsApi from '../utils/api/pagesApi/productsApi';
import { Invoice, InvoiceItem } from '../utils/api/pagesApi/invoicesApi';
import { OrderItem, OrderSummary as OrderSummaryType, PosProduct, PosPrice, SubItem, SelectedOption } from '../Pages/pos/newSales/types/PosSystem';
import { Customer } from '../utils/api/pagesApi/customersApi';

interface ConvertedInvoiceData {
  orderItems: OrderItem[];
  orderSummary: OrderSummaryType;
  selectedCustomer: Customer | null;
  deliveryCharge: number;
  invoiceData: Invoice;
}

class InvoiceDataConverter {
  private static productsCache = new Map<string, PosProduct>();
  private static customersCache = new Map<string, Customer>();
  private static pricesCache = new Map<string, PosPrice>();

  // تحويل الفاتورة إلى بيانات قابلة للعرض والتعديل
  static async convertInvoiceForEdit(invoice: Invoice): Promise<ConvertedInvoiceData> {
    try {
      console.log('🔄 بدء تحويل بيانات الفاتورة:', invoice.id);

      // جلب بيانات العميل إذا كان موجود
      const selectedCustomer = await this.getCustomerData(invoice.customerId);

      // تحويل العناصر
      const orderItems = await this.convertInvoiceItems(invoice.items);

      // حساب الملخص
      const orderSummary = this.calculateOrderSummary(orderItems, invoice);

      // حساب رسوم التوصيل
      const deliveryCharge = this.calculateDeliveryCharge(invoice);

      return {
        orderItems,
        orderSummary,
        selectedCustomer,
        deliveryCharge,
        invoiceData: invoice
      };

    } catch (error) {
      console.error('❌ خطأ في تحويل بيانات الفاتورة:', error);
      throw new Error('فشل في تحويل بيانات الفاتورة للتعديل');
    }
  }

  // جلب بيانات العميل
  private static async getCustomerData(customerId?: string | null): Promise<Customer | null> {
    if (!customerId) return null;

    try {
      // التحقق من الكاش أولاً
      if (this.customersCache.has(customerId)) {
        return this.customersCache.get(customerId)!;
      }

      // جلب من الـ API
      console.log('🔍 جلب بيانات العميل من الـ API:', customerId);
      const customer = await customersApi.getById(customerId);
      
      // حفظ في الكاش
      this.customersCache.set(customerId, customer);
      
      return customer;
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات العميل:', customerId, error);
      return null;
    }
  }

  // تحويل عناصر الفاتورة
  private static async convertInvoiceItems(invoiceItems: InvoiceItem[]): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];

    for (const item of invoiceItems) {
      try {
        const orderItem = await this.convertSingleInvoiceItem(item);
        if (orderItem) {
          orderItems.push(orderItem);
        }
      } catch (error) {
        console.error('❌ خطأ في تحويل العنصر:', item.id, error);
      }
    }

    return orderItems;
  }


// تحديد ما إذا كان الـ component خيار أم إضافة - مبسط أكتر
private static isComponentAnOption(component: any, product: PosProduct): boolean {
  // إذا كان النوع محدد صراحة كـ option
  if (component.type === 'option') {
    return true;
  }
  
  // إذا كان النوع محدد صراحة كـ extra أو without
  if (component.type === 'extra' || component.type === 'without') {
    return false;
  }

  // إذا كان له groupId وموجود في option groups الخاصة بالمنتج
  if (component.groupId && product.productOptionGroups) {
    const optionGroup = product.productOptionGroups.find(group => group.id === component.groupId);
    if (optionGroup) {
      return true; // موجود في option group يعني option
    }
  }

  // ✅ افتراضياً: إذا كان له groupId يُعتبر option، وإلا subItem
  // هذا منطق أكثر أماناً
  return !!component.groupId;
}



// ✅ فصل Components إلى خيارات وإضافات - مصحح
private static separateComponentsIntoTypes(components: any[], product: PosProduct): {
  subItems: SubItem[];
  selectedOptions: SelectedOption[];
} {
  const subItems: SubItem[] = [];
  const selectedOptions: SelectedOption[] = [];

  if (!components || !Array.isArray(components)) {
    return { subItems, selectedOptions };
  }

  components.forEach((component, index) => {
    console.log('🔍 معالجة component:', {
      name: component.name || component.ComponentName,
      type: component.type,
      extraPrice: component.extraPrice,
      price: component.price,
      groupId: component.groupId
    });

    // تحديد النوع بناءً على البيانات
    const isOption = this.isComponentAnOption(component, product);

    if (isOption) {
      // ✅ هذا خيار (Option) - يروح في selectedOptions
      selectedOptions.push({
        groupId: component.groupId || 'default_group',
        itemId: component.id || `option_${index}_${Date.now()}`,
        itemName: component.name || component.ComponentName || 'خيار',
        quantity: component.quantity || 1,
        extraPrice: component.extraPrice || component.price || 0,
        isCommentOnly: component.isCommentOnly || false
      });
    } else {
      // ✅ هذه إضافة أو حذف (SubItem)
      let type: 'extra' | 'without' = 'extra'; // ✅ الافتراضي extra مش without
      let price = component.extraPrice || component.price || 0;

      // ✅ تحديد النوع بشكل صحيح
      if (component.type) {
        // إذا كان النوع محدد صراحة
        type = component.type === 'without' ? 'without' : 'extra';
      } else {
        // إذا كان السعر 0 أو سالب، قد يكون without
        // لكن نتأكد إنه مش مجرد خيار مجاني
        if (price <= 0) {
          // تحقق إضافي: هل ده حقاً "without" أم خيار مجاني؟
          const nameIndicatesWithout = (component.name || component.ComponentName || '')
            .toLowerCase()
            .includes('بدون') || 
            (component.name || component.ComponentName || '')
            .toLowerCase()
            .includes('without') ||
            (component.name || component.ComponentName || '')
            .toLowerCase()
            .includes('no ');
            
          if (nameIndicatesWithout) {
            type = 'without';
            price = 0;
          } else {
            // خيار مجاني، يُعامل كـ extra بسعر 0
            type = 'extra';
            price = 0;
          }
        } else {
          // السعر أكبر من 0، يعني extra
          type = 'extra';
        }
      }

      subItems.push({
        id: component.id || `subitem_${index}_${Date.now()}`,
        type: type,
        name: component.name || component.ComponentName || 'إضافة',
        quantity: component.quantity || 1,
        price: price, // ✅ نحافظ على السعر الأصلي
        isRequired: component.isRequired || false,
        productId: component.ProductComponentId || component.productComponentId,
        groupId: component.groupId
      });

      console.log('✅ تم إضافة SubItem:', {
        name: component.name || component.ComponentName,
        type: type,
        price: price,
        originalPrice: component.extraPrice || component.price
      });
    }
  });

  console.log('📊 نتيجة الفصل:', {
    subItemsCount: subItems.length,
    selectedOptionsCount: selectedOptions.length,
    subItems: subItems.map(s => ({ name: s.name, type: s.type, price: s.price })),
    selectedOptions: selectedOptions.map(o => ({ name: o.itemName, price: o.extraPrice }))
  });

  return { subItems, selectedOptions };
}




  // تحويل عنصر واحد من الفاتورة
private static async convertSingleInvoiceItem(item: InvoiceItem): Promise<OrderItem | null> {
  try {
    // جلب بيانات المنتج
    let product = await this.getProductData(item.productId);
    if (!product) {
      // إنشاء منتج وهمي إذا لم نجده
      product = this.createDummyProduct(item);
    }

    // جلب بيانات السعر
    const selectedPrice = this.getPriceData(item, product);

    // ✅ فصل Components إلى نوعين: خيارات وإضافات
    // SubItems تأتي الآن من childrens
    const subItems: SubItem[] = this.convertChildrensToSubItems(item.childrens || []);
    // SelectedOptions لا تزال تأتي من components
    const selectedOptions: SelectedOption[] = this.extractSelectedOptions(item, product);

    // ✅ حساب السعر الإجمالي الصحيح (سعر المنتج + الخيارات + الإضافات)
    const basePrice = selectedPrice.price * item.qty;
    const optionsPrice = selectedOptions.reduce((sum, option) => sum + (option.extraPrice * option.quantity), 0);
    const subItemsPrice = subItems.reduce((sum, subItem) => {
      return sum + (subItem.type === 'without' ? 0 : subItem.price);
    }, 0);
    
    const calculatedTotalPrice = basePrice + optionsPrice + subItemsPrice;

    // تحويل إلى OrderItem
    const orderItem: OrderItem = {
      id: item.id,
      product: product,
      selectedPrice: selectedPrice,
      quantity: item.qty,
      totalPrice: calculatedTotalPrice, // ✅ السعر الصحيح مع الإضافات والخيارات
      notes: this.extractNotesFromItem(item),
      discountPercentage: item.itemDiscountPercentage,
      discountAmount: item.itemDiscountValue,
      subItems: subItems.length > 0 ? subItems : undefined, // الإضافات والحذوفات فقط
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined // الخيارات فقط
    };    console.log('🔍 تحويل العنصر:', {
      productName: product.nameArabic,
      basePrice,
      optionsPrice,
      subItemsPrice,
      totalPrice: calculatedTotalPrice,
      originalSubTotal: item.subTotal,
      subItems: subItems.length,
      selectedOptions: selectedOptions.length
    });

    return orderItem;
  } catch (error) {
    console.error('❌ خطأ في تحويل العنصر:', item.id, error);
    return null;
  }
}

  // ✅ إضافة دالة تحويل الـ childrens إلى subItems
  private static convertChildrensToSubItems(childrens: InvoiceItem[]): SubItem[] {
    if (!childrens || !Array.isArray(childrens)) {
      return [];
    }

    return childrens.map((child, index) => {
      let type: 'extra' | 'without' = 'extra';
      let price = child.unitPrice || 0;

      // Determine if it's 'without' based on name or price
      const nameIndicatesWithout = (child.posPriceName || '')
        .toLowerCase()
        .includes('بدون') || 
        (child.posPriceName || '')
        .toLowerCase()
        .includes('without') ||
        (child.posPriceName || '')
        .toLowerCase()
        .includes('no ');
            
      if (price <= 0 && nameIndicatesWithout) {
        type = 'without';
        price = 0;
      } else {
        type = 'extra';
      }

      return {
        id: child.id || `child_${index}_${Date.now()}`,
        type: type,
        name: child.posPriceName || `مكون ${index + 1}`,
        quantity: child.qty || 1,
        price: price,
        productId: child.productId,
        groupId: undefined // Childrens from API don't have groupId in this context
      };
    });
  }

  // ✅ إضافة دالة استخراج الـ options المختارة
  private static extractSelectedOptions(item: InvoiceItem, product: PosProduct): SelectedOption[] {
    const selectedOptions: SelectedOption[] = [];

    // إذا كان المنتج له option groups
    if (product.productOptionGroups && product.productOptionGroups.length > 0) {
      // البحث في الـ components عن الخيارات
      item.components?.forEach(component => {
        // البحث عن الـ option في مجموعات المنتج
        product.productOptionGroups?.forEach(group => {
          const optionItem = group.optionItems.find(opt => 
            opt.id === component.id || 
            opt.name === component.name ||
            opt.name === component.ComponentName ||
            opt.productPriceId === component.ProductComponentId
          );

          if (optionItem) {
            selectedOptions.push({
              groupId: group.id,
              itemId: optionItem.id,
              itemName: optionItem.name,
              quantity: component.quantity || 1,
              extraPrice: component.extraPrice || optionItem.extraPrice,
              isCommentOnly: optionItem.isCommentOnly || false
            });
          }
        });
      });
    }

    // إذا لم نجد options في المنتج، حول الـ components من نوع option إلى selectedOptions
    if (selectedOptions.length === 0) {
      item.components?.forEach(component => {
        if (component.type === 'option' || (!component.type && component.groupId)) {
          selectedOptions.push({
            groupId: component.groupId || 'default_group',
            itemId: component.id || `option_${Date.now()}`,
            itemName: component.name || component.ComponentName || 'خيار',
            quantity: component.quantity || 1,
            extraPrice: component.extraPrice || component.price || 0,
            isCommentOnly: component.isCommentOnly || false
          });
        }
      });
    }

    return selectedOptions;
  }

  // ✅ إضافة دالة استخراج الملاحظات
  private static extractNotesFromItem(item: InvoiceItem): string | undefined {
    // يمكن استخراج الملاحظات من أماكن مختلفة
    if (item.notes) return item.notes;
    
    // البحث في الـ components عن ملاحظات
    const commentComponents = item.components?.filter(c => 
      c.isCommentOnly || c.type === 'comment' || c.name?.includes('ملاحظة')
    );
    
    if (commentComponents && commentComponents.length > 0) {
      return commentComponents.map(c => c.name || c.ComponentName || c.value).join(', ');
    }
    
    return undefined;
  }

  // جلب بيانات المنتج
  private static async getProductData(productId: string): Promise<PosProduct | null> {
    try {
      // التحقق من الكاش أولاً
      if (this.productsCache.has(productId)) {
        return this.productsCache.get(productId)!;
      }

      // جلب من الـ API
      console.log('🔍 جلب بيانات المنتج من الـ API:', productId);
      const apiProduct = await productsApi.getById(productId);
      
      // تحويل إلى PosProduct
      const posProduct = this.convertApiProductToPosProduct(apiProduct);
      
      // حفظ في الكاش
      this.productsCache.set(productId, posProduct);
      
      return posProduct;
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات المنتج:', productId, error);
      return null;
    }
  }

  // جلب بيانات السعر
  private static getPriceData(item: InvoiceItem, product: PosProduct): PosPrice {
    // البحث في أسعار المنتج أولاً
    const priceFromProduct = product.productPrices.find(p => p.id === item.productPriceId);
    if (priceFromProduct) {
      return priceFromProduct;
    }

    // التحقق من الكاش
    if (this.pricesCache.has(item.productPriceId)) {
      return this.pricesCache.get(item.productPriceId)!;
    }

    // إنشاء سعر من بيانات العنصر
    const newPrice: PosPrice = {
      id: item.productPriceId,
      name: item.posPriceName,
      nameArabic: item.posPriceName,
      price: item.unitPrice,
      barcode: item.barcode
    };

    this.pricesCache.set(item.productPriceId, newPrice);
    return newPrice;
  }

  // إنشاء منتج وهمي
  private static createDummyProduct(item: InvoiceItem): PosProduct {
    return {
      id: item.productId,
      name: item.posPriceName || 'منتج غير معروف',
      nameArabic: item.posPriceName || 'منتج غير معروف',
      image: '/images/img_rectangle_34624462.png',
      categoryId: 'default',
      productType: 1,
      productPrices: [{
        id: item.productPriceId,
        name: item.posPriceName,
        nameArabic: item.posPriceName,
        price: item.unitPrice,
        barcode: item.barcode
      }],
      hasMultiplePrices: false,
      displayPrice: item.unitPrice,
      productOptionGroups: [] // يمكن تطويرها لاحقاً
    };
  }

  // تحويل منتج الـ API إلى PosProduct
  private static convertApiProductToPosProduct(apiProduct: any): PosProduct {
    const prices: PosPrice[] = apiProduct.productPrices?.map((price: any) => ({
      id: price.productPriceId || price.id,
      name: price.posPriceName || 'السعر الافتراضي',
      nameArabic: price.posPriceName || 'السعر الافتراضي',
      price: price.price || 0,
      barcode: price.barcode || '0000000000000'
    })) || [];

    // تحويل option groups إذا كانت موجودة
    const productOptionGroups = apiProduct.productOptionGroups?.map((group: any) => ({
      id: group.id || '',
      name: group.name,
      isRequired: group.isRequired,
      allowMultiple: group.allowMultiple,
      minSelection: group.minSelection,
      maxSelection: group.maxSelection,
      sortOrder: group.sortOrder,
      optionItems: group.optionItems?.map((item: any) => ({
        id: item.id || '',
        name: item.name,
        productPriceId: item.productPriceId,
        useOriginalPrice: item.useOriginalPrice,
        extraPrice: item.extraPrice,
        isCommentOnly: item.isCommentOnly,
        sortOrder: item.sortOrder
      })).sort((a: any, b: any) => a.sortOrder - b.sortOrder) || []
    })).sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

    return {
      id: apiProduct.productID || apiProduct.id,
      name: apiProduct.productName || apiProduct.name || 'منتج غير معروف',
      nameArabic: apiProduct.productName || apiProduct.name || 'منتج غير معروف',
      image: apiProduct.imageUrl || '/images/img_rectangle_34624462.png',
      categoryId: apiProduct.posScreenId || 'default',
      productType: apiProduct.productType || 1,
      productPrices: prices,
      hasMultiplePrices: prices.length > 1,
      displayPrice: prices.length === 1 ? prices[0].price : undefined,
      productOptionGroups: productOptionGroups.length > 0 ? productOptionGroups : undefined
    };
  }

// حساب ملخص الطلب مع الأسعار الصحيحة
private static calculateOrderSummary(orderItems: OrderItem[], invoice: Invoice): OrderSummaryType {
  // حساب المجموع من الـ OrderItems المحولة (تتضمن الخيارات والإضافات)
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  console.log('📊 حساب ملخص الطلب:', {
    itemsCount: orderItems.length,
    calculatedSubtotal: subtotal,
    originalInvoiceSubtotal: invoice.totalBeforeDiscount,
    difference: Math.abs(subtotal - invoice.totalBeforeDiscount)
  });
  
  return {
    items: orderItems,
    subtotal: subtotal, // ✅ المجموع الصحيح مع الخيارات والإضافات
    discount: invoice.headerDiscountValue || 0,
    tax: invoice.taxAmount || 0,
    service: invoice.serviceAmount || 0,
    total: invoice.totalAfterTaxAndService || subtotal
  };
}


  // حساب رسوم التوصيل
  private static calculateDeliveryCharge(invoice: Invoice): number {
    if (invoice.invoiceType === 3) { // Delivery
      return 0; // يمكن تطويرها لاحقاً
    }
    return 0;
  }

  // تنظيف الكاش
  static clearCache(): void {
    this.productsCache.clear();
    this.customersCache.clear();
    this.pricesCache.clear();
    console.log('🧹 تم تنظيف كاش بيانات الفاتورة');
  }

  // إضافة منتج للكاش
  static cacheProduct(product: PosProduct): void {
    this.productsCache.set(product.id, product);
  }

  // إضافة عميل للكاش
  static cacheCustomer(customer: Customer): void {
    this.customersCache.set(customer.id, customer);
  }
}

export default InvoiceDataConverter;
export { type ConvertedInvoiceData };
