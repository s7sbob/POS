// src/Pages/pos/newSales/hooks/usePosPaymentMethods.ts
import { useState, useEffect } from "react";
import * as posPaymentMethodsApi from 'src/utils/api/pagesApi/posPaymentMethodsApi';

export interface PaymentMethod {
  id: string;
  name: string;
  safeOrAccountID?: string | null;
  safeOrAccount?: any;
}

function isUUID(id: string) {
  // detect uuid-like
  return !!id && id.length > 20 && id.includes("-");
}

function isManualMethod(method: PaymentMethod) {
  // methods added by restaurant (id is uuid)
  return isUUID(method.id);
}
function isDefaultCash(method: PaymentMethod) {
  return method.id.toLowerCase() === 'cash' || method.name.toLowerCase() === 'كاش';
}
function isDefaultVisa(method: PaymentMethod) {
  return method.id.toLowerCase() === 'visa' || method.name.toLowerCase() === 'فيزا';
}
function isDefaultBuiltIn(method: PaymentMethod) {
  // ids like visa/cash/instapay/wallet/isntapay/etc (not pure uuid)
  return !isManualMethod(method) && !isDefaultCash(method) && !isDefaultVisa(method);
}

function sortPaymentMethods(methods: PaymentMethod[]): PaymentMethod[] {
  const cash = methods.find(isDefaultCash);
  const visa = methods.find(isDefaultVisa);

  // Exclude cash/visa for building the rest
  const rest = methods.filter(
    m => !isDefaultCash(m) && !isDefaultVisa(m)
  );
  const builtIn = rest.filter(isDefaultBuiltIn);
  const manual = rest.filter(isManualMethod);

  const result: PaymentMethod[] = [];
  if (cash) result.push(cash);
  if (visa) result.push(visa);
  result.push(...builtIn);
  result.push(...manual);
  return result;
}

export function usePosPaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        setLoading(true);
        const res = await posPaymentMethodsApi.getAll();
        const usable = Array.isArray(res)
          ? res.filter((m) =>
              !['CL', 'ضيافة', 'نقاط'].includes(m.id)
            )
          : [];
        const sorted = sortPaymentMethods(usable);
        if (mounted) {
          setMethods(sorted);
          setLoading(false);
        }
      } catch (err: any) {
        setError('حدث خطأ أثناء تحميل طرق الدفع');
        setLoading(false);
        setMethods([]);
      }
    }
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  return { paymentMethods: methods, loading, error };
}
