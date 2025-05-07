import { useState } from "react";
import "./VendingMachinePage.scss";
import { PaymentCash, PaymentCard, Dispenser, CashList } from "@/components";
import {
  initCashReserve,
  initProducts,
  initInsertedCash,
  initPurchasedProducts,
  payment,
} from "@/constants";
import { productsType } from "@/types/VendingMachineType";
import { useStep } from "@/stores/useStep";

const VendingMachinePage = () => {
  const { step, stepMsg, setStatus } = useStep();
  const [selectedPayment, setSelectedPayment] = useState<string>(""); // 선택된 결제수단

  const [insertedCash, setInsertedCash] = useState(initInsertedCash); // 투입된 현금 정보
  const [cashReserve, setCashReserve] = useState(initCashReserve); // 자판기 현금 정보

  const [productsInfo, setProductsInfo] = useState(initProducts); // 제품 목록 (가격, 수량 등)
  const [purchasedProducts, setPurchasedProducts] = useState(
    initPurchasedProducts
  );

  // 결제수단 선택 단계로 리셋
  const onCancel = () => {
    setSelectedPayment("");
    setInsertedCash(initInsertedCash);
    setStatus(0);
  };

  // 결제 완료 후 재고 수량 및 결제된 상품 목록 변경
  const handleCompletePayment = (
    product: productsType,
    callback?: () => void
  ) => {
    setStatus(2);
    // 실제 자판기와 같이 딜레이를 주기 위한 코드
    setTimeout(() => {
      setStatus(3);
      callback?.();

      // 재고 수량 변경
      setProductsInfo((pre) =>
        pre.map((v) =>
          v.id === product.id ? { ...v, ...{ quantity: v.quantity - 1 } } : v
        )
      );
      // 결제된 상품 목록 변경
      setPurchasedProducts((pre) => ({
        ...pre,
        ...{
          [product.name]: pre[product.name] + 1,
        },
      }));
    }, 1000);
  };

  // 카드로 결제 시 동작
  const handlePaymentCard = (product: productsType) => {
    const isSuccess = Math.random() < 0.9; // 10% 확률로 오류발생
    if (!isSuccess) {
      alert("카드 결제 오류 입니다. 다시 시도해주세요.");
      return;
    }

    handleCompletePayment(product);
  };

  // 현금으로 결제 시 동작
  const handlePaymentCash = (product: productsType) => {
    const { total, count } = insertedCash;

    // 선택한 제품의 가격보다 잔액이 부족한 경우
    if (total < product.price) {
      alert("잔액이 부족합니다.");
      return;
    }

    // 총 금액 차감
    const callback = () =>
      setInsertedCash({ total: total - product.price, count });

    handleCompletePayment(product, callback);
  };

  // 선택한 결제 수단별 함수 호출
  const handleTypeOfPayment = (product: productsType) => {
    switch (selectedPayment) {
      case "card":
        handlePaymentCard(product);
        break;
      case "cash":
        handlePaymentCash(product);
        break;
    }
  };

  return (
    <div className="container">
      <div className="machine">
        <div className="machine-products">
          {/* 제품 샘플 */}
          <ul className="products-sample">
            {productsInfo.map((v) => (
              <li
                key={`products_${v.name}_${v.id}`}
                style={{
                  background: v.color,
                }}
              >
                <p>{v.name}</p>
                <p>{v.quantity}개</p>
                <p style={{ background: "#fff", color: v.color }}>
                  {v.price}원
                </p>
              </li>
            ))}
          </ul>
          {/* 제품 선택 버튼 */}
          <ul className="products-button-list">
            {productsInfo.map((v) =>
              v.quantity > 0 && (step === 1 || step === 3) ? (
                <li
                  key={`machine_btn_${v.name}_${v.id}`}
                  className="active"
                  onClick={() => {
                    handleTypeOfPayment(v);
                  }}
                >
                  SELECT
                </li>
              ) : (
                <li key={`machine_btn_${v.name}_${v.id}`} className={`item`}>
                  {v.quantity > 0 ? "" : "X"}
                </li>
              )
            )}
          </ul>
        </div>
        {/* 안내 메시지 */}
        <div className="notice">{stepMsg}</div>
        {/* 결제수단 선택 버튼 */}
        {selectedPayment === "" && (
          <div className="payment-type">
            {payment.map((v) => (
              <div
                key={`payment_${v.id}`}
                className="item"
                onClick={() => setSelectedPayment(v.id)}
              >
                {v.name}
              </div>
            ))}
          </div>
        )}
        {/* 결제수단 - 카드 */}
        {selectedPayment === "card" && <PaymentCard onCancel={onCancel} />}
        {/* 결제수단 - 현금 */}
        {selectedPayment === "cash" && (
          <PaymentCash
            insertedCash={insertedCash}
            cashReserve={cashReserve}
            setCashReserve={setCashReserve}
            setInsertedCash={setInsertedCash}
            onCancel={onCancel}
          />
        )}
        {/* 결제한 제품 출력 부분 */}
        <Dispenser
          products={productsInfo}
          purchasedProducts={purchasedProducts}
          setPurchasedProducts={setPurchasedProducts}
        />
      </div>
      {/* 현금 보유 현황 */}
      <div className="flex-col">
        <CashList title="자판기 현금 현황" list={cashReserve} />
        <CashList title="투입된 현금 현황" list={insertedCash.count} />
      </div>
    </div>
  );
};

export default VendingMachinePage;
