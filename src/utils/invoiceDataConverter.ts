// src/utils/invoiceDataConverter.ts
import * as customersApi from '../utils/api/pagesApi/customersApi';
import * as productsApi from '../utils/api/pagesApi/productsApi';
import { Invoice, InvoiceItem, SalesInvoiceItemType } from '../utils/api/pagesApi/invoicesApi';
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

    // تصفية المنتجات الرئيسية فقط (salesInvoiceItemType = 1 أو 0)
    const mainItems = invoiceItems.filter(item => 
      item.salesInvoiceItemType === SalesInvoiceItemType.Product || 
      item.salesInvoiceItemType === 0 || // fallback للقيم القديمة
      !item.parentLineId // fallback للمنطق القديم
    );

    for (const item of mainItems) {
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

  // ✅ تحويل عنصر واحد من الفاتورة باستخدام salesInvoiceItemType
  private static async convertSingleInvoiceItem(item: InvoiceItem): Promise<OrderItem | null> {
    try {
      // جلب بيانات المنتج
      let product = await this.getProductData(item.productId);
      if (!product) {
        product = this.createDummyProduct(item);
      }

      // جلب بيانات السعر
      const selectedPrice = this.getPriceData(item, product);

      console.log('🔄 تحويل العنصر:', product.nameArabic);
      console.log('📊 عدد childrens:', item.childrens?.length || 0);

      // ✅ فصل childrens حسب salesInvoiceItemType
      const { subItems, selectedOptions } = this.separateChildrensByType(item.childrens || [], product);

      // معالجة components إذا كانت موجودة (للتوافق مع النظام القديم)
      const componentOptions = this.extractOptionsFromComponents(item.components || [], product);
      const componentSubItems = this.extractSubItemsFromComponents(item.components || [], product);

      // دمج النتائج
      const allSelectedOptions = [...selectedOptions, ...componentOptions];
      const allSubItems = [...subItems, ...componentSubItems];

      // ✅ حساب السعر الإجمالي الصحيح
      const basePrice = selectedPrice.price * item.qty;
      const optionsPrice = allSelectedOptions.reduce((sum, option) => sum + (option.extraPrice * option.quantity), 0);
      const subItemsPrice = allSubItems.reduce((sum, subItem) => {
        return sum + (subItem.type === 'without' ? 0 : subItem.price);
      }, 0);
      
      const calculatedTotalPrice = basePrice + optionsPrice + subItemsPrice;

      // تحويل إلى OrderItem
      const orderItem: OrderItem = {
        id: item.id,
        product: product,
        selectedPrice: selectedPrice,
        quantity: item.qty,
        totalPrice: calculatedTotalPrice,
        notes: this.extractNotesFromItem(item),
        discountPercentage: item.itemDiscountPercentage,
        discountAmount: item.itemDiscountValue,
        subItems: allSubItems.length > 0 ? allSubItems : undefined,
        selectedOptions: allSelectedOptions.length > 0 ? allSelectedOptions : undefined
      };

      console.log('📊 نتيجة التحويل:', {
        productName: product.nameArabic,
        selectedOptionsCount: allSelectedOptions.length,
        subItemsCount: allSubItems.length,
        basePrice,
        optionsPrice,
        subItemsPrice,
        totalPrice: calculatedTotalPrice
      });

      return orderItem;
    } catch (error) {
      console.error('❌ خطأ في تحويل العنصر:', item.id, error);
      return null;
    }
  }

// ✅ فصل childrens حسب salesInvoiceItemType - مصحح
private static separateChildrensByType(childrens: InvoiceItem[], product: PosProduct): {
  subItems: SubItem[];
  selectedOptions: SelectedOption[];
} {
  const subItems: SubItem[] = [];
  const selectedOptions: SelectedOption[] = [];

  if (!childrens || !Array.isArray(childrens)) {
    return { subItems, selectedOptions };
  }

  childrens.forEach((child, index) => {
    console.log('🔍 معالجة child:', {
      name: child.posPriceName,
      salesInvoiceItemType: child.salesInvoiceItemType,
      unitPrice: child.unitPrice,
      qty: child.qty
    });

    switch (child.salesInvoiceItemType) {
      case SalesInvoiceItemType.Addition: // 2
        // ✅ إضافة (Extra) - قابلة للتعديل والحذف
        subItems.push({
          id: child.id || `addition_${index}_${Date.now()}`,
          type: 'extra',
          name: child.posPriceName || 'إضافة',
          quantity: child.qty || 1,
          price: child.unitPrice * (child.qty || 1),
          isRequired: false,
          productId: child.productId,
          groupId: undefined
        });
        console.log('✅ تم إضافة Addition (Extra):', child.posPriceName);
        break;

      case SalesInvoiceItemType.Without: // 3
        // ✅ بدون - قابلة للتعديل والحذف
        subItems.push({
          id: child.id || `without_${index}_${Date.now()}`,
          type: 'without',
          name: child.posPriceName || 'بدون',
          quantity: child.qty || 1,
          price: 0, // بدون دايماً سعره صفر
          isRequired: false,
          productId: child.productId,
          groupId: undefined
        });
        console.log('✅ تم إضافة Without:', child.posPriceName);
        break;

      case SalesInvoiceItemType.Optional: // 4
        // ✅ خيارات أصلية - غير قابلة للتعديل أو الحذف
        selectedOptions.push({
          groupId: 'options_group', // يمكن تطويره لاحقاً
          itemId: child.id || `option_${index}_${Date.now()}`,
          itemName: child.posPriceName || 'خيار',
          quantity: child.qty || 1,
          extraPrice: child.unitPrice || 0,
          isCommentOnly: false
        });
        console.log('✅ تم إضافة Optional (خيار أصلي):', child.posPriceName);
        break;

      default:
        // للتوافق مع القيم القديمة - نحاول نخمن النوع
        console.warn('⚠️ salesInvoiceItemType غير معروف:', child.salesInvoiceItemType);
        
        const nameIndicatesWithout = (child.posPriceName || '')
          .toLowerCase()
          .includes('بدون') || 
          (child.posPriceName || '')
          .toLowerCase()
          .includes('without');
          
        if (nameIndicatesWithout || child.unitPrice <= 0) {
          subItems.push({
            id: child.id || `legacy_without_${index}_${Date.now()}`,
            type: 'without',
            name: child.posPriceName || 'بدون',
            quantity: child.qty || 1,
            price: 0,
            isRequired: false,
            productId: child.productId,
            groupId: undefined
          });
        } else {
          subItems.push({
            id: child.id || `legacy_extra_${index}_${Date.now()}`,
            type: 'extra',
            name: child.posPriceName || 'إضافة',
            quantity: child.qty || 1,
            price: child.unitPrice * (child.qty || 1),
            isRequired: false,
            productId: child.productId,
            groupId: undefined
          });
        }
        break;
    }
  });

  console.log('📊 نتيجة فصل childrens:', {
    subItemsCount: subItems.length, // الإضافات والبدون (قابلة للحذف)
    selectedOptionsCount: selectedOptions.length // الخيارات الأصلية (غير قابلة للحذف)
  });

  return { subItems, selectedOptions };
}


  // ✅ للتوافق مع النظام القديم - استخراج options من components
  private static extractOptionsFromComponents(components: any[], product: PosProduct): SelectedOption[] {
    if (!components || !Array.isArray(components)) {
      return [];
    }

    const selectedOptions: SelectedOption[] = [];

    // إذا كان المنتج له option groups، حاول تطبيقها
    if (product.productOptionGroups && product.productOptionGroups.length > 0) {
      components.forEach(component => {
        product.productOptionGroups?.forEach(group => {
          const optionItem = group.optionItems.find(opt => 
            opt.name === (component.name || component.ComponentName) ||
            opt.id === component.id
          );

          if (optionItem) {
            selectedOptions.push({
              groupId: group.id,
              itemId: optionItem.id,
              itemName: optionItem.name,
              quantity: component.quantity || 1,
              extraPrice: component.extraPrice || optionItem.extraPrice || 0,
              isCommentOnly: optionItem.isCommentOnly || false
            });
          }
        });
      });
    }

    return selectedOptions;
  }

  // ✅ للتوافق مع النظام القديم - استخراج sub items من components
  private static extractSubItemsFromComponents(components: any[], product: PosProduct): SubItem[] {
    if (!components || !Array.isArray(components)) {
      return [];
    }

    // فقط الـ components اللي مش options (للتوافق العكسي)
    return components
      .filter(component => component.type === 'extra' || component.type === 'without')
      .map((component, index) => ({
        id: component.id || `component_${index}_${Date.now()}`,
        type: component.type === 'without' ? 'without' : 'extra',
        name: component.name || component.ComponentName || 'إضافة',
        quantity: component.quantity || 1,
        price: component.type === 'without' ? 0 : (component.extraPrice || component.price || 0),
        isRequired: false,
        productId: component.ProductComponentId || component.productComponentId,
        groupId: component.groupId
      }));
  }

  // باقي الدوال تبقى كما هي...
  private static extractNotesFromItem(item: InvoiceItem): string | undefined {
    if (item.notes) return item.notes;
    
    const commentComponents = item.components?.filter(c => 
      c.isCommentOnly || c.type === 'comment' || c.name?.includes('ملاحظة')
    );
    
    if (commentComponents && commentComponents.length > 0) {
      return commentComponents.map(c => c.name || c.ComponentName || c.value).join(', ');
    }
    
    return undefined;
  }

  private static async getProductData(productId: string): Promise<PosProduct | null> {
    try {
      if (this.productsCache.has(productId)) {
        return this.productsCache.get(productId)!;
      }

      console.log('🔍 جلب بيانات المنتج من الـ API:', productId);
      const apiProduct = await productsApi.getById(productId);
      
      const posProduct = this.convertApiProductToPosProduct(apiProduct);
      
      this.productsCache.set(productId, posProduct);
      
      return posProduct;
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات المنتج:', productId, error);
      return null;
    }
  }

  private static getPriceData(item: InvoiceItem, product: PosProduct): PosPrice {
    const priceFromProduct = product.productPrices.find(p => p.id === item.productPriceId);
    if (priceFromProduct) {
      return priceFromProduct;
    }

    if (this.pricesCache.has(item.productPriceId)) {
      return this.pricesCache.get(item.productPriceId)!;
    }

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
      productOptionGroups: []
    };
  }

  private static convertApiProductToPosProduct(apiProduct: any): PosProduct {
    const prices: PosPrice[] = apiProduct.productPrices?.map((price: any) => ({
      id: price.productPriceId || price.id,
      name: price.posPriceName || 'السعر الافتراضي',
      nameArabic: price.posPriceName || 'السعر الافتراضي',
      price: price.price || 0,
      barcode: price.barcode || '0000000000000'
    })) || [];

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

  private static calculateOrderSummary(orderItems: OrderItem[], invoice: Invoice): OrderSummaryType {
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    console.log('📊 حساب ملخص الطلب:', {
      itemsCount: orderItems.length,
      calculatedSubtotal: subtotal,
      originalInvoiceSubtotal: invoice.totalBeforeDiscount,
      difference: Math.abs(subtotal - invoice.totalBeforeDiscount)
    });
    
    return {
      items: orderItems,
      subtotal: subtotal,
      discount: invoice.headerDiscountValue || 0,
      tax: invoice.taxAmount || 0,
      service: invoice.serviceAmount || 0,
      total: invoice.totalAfterTaxAndService || subtotal,
      totalAfterTaxAndService: 0,
      totalAfterDiscount: 0,
    };
  }

  private static calculateDeliveryCharge(invoice: Invoice): number {
    if (invoice.invoiceType === 3) {
      return 0;
    }
    return 0;
  }

  static clearCache(): void {
    this.productsCache.clear();
    this.customersCache.clear();
    this.pricesCache.clear();
    console.log('🧹 تم تنظيف كاش بيانات الفاتورة');
  }

  static cacheProduct(product: PosProduct): void {
    this.productsCache.set(product.id, product);
  }

  static cacheCustomer(customer: Customer): void {
    this.customersCache.set(customer.id, customer);
  }
}

export default InvoiceDataConverter;
export { type ConvertedInvoiceData };
