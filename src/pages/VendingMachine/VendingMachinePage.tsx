import { useState } from "react";
import "./VendingMachinePage.scss";
import { PaymentCash, PaymentCard, Dispenser, CashList } from "@/components";
import { productsType } from "@/types/VendingMachineType";
import { useStep } from "@/stores/useStep";
import { useProducts } from "@/stores/useProducts";
import { useCash } from "@/stores/useCash";

const VendingMachinePage = () => {
  const { step, stepMsg, setStatus } = useStep();
  const { products, completePurchase } = useProducts();
  const {
    reserveCash,
    insertedCash,
    totalInsertedCash,
    setTotalInsertCash,
    resetInsertedCash,
  } = useCash();

  const [selectedPayment, setSelectedPayment] = useState<string>(""); // 선택된 결제수단

  // 결제수단 선택 단계로 리셋
  const onReset = () => {
    setSelectedPayment("");
    resetInsertedCash();
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
      completePurchase(product);
    }, 1000);
  };

  // 카드로 결제 시 동작
  const handlePaymentCard = (product: productsType) => {
    // 10% 확률로 카드 인식 오류 발생
    const isSuccess = Math.random() < 0.9;
    if (!isSuccess) {
      alert("카드 오류 입니다. 다시 시도해주세요.");
      return;
    }

    handleCompletePayment(product);
  };

  // 현금으로 결제 시 동작
  const handlePaymentCash = (product: productsType) => {
    // 선택한 제품의 가격보다 잔액이 부족한 경우
    if (totalInsertedCash < product.price) {
      alert("잔액이 부족합니다.");
      return;
    }

    // 총 금액 차감
    const callback = () => setTotalInsertCash(product.price);

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
            {products.map((v) => (
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
            {products.map((v) =>
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
            <div
              key="payment_card"
              className="item"
              onClick={() => setSelectedPayment("card")}
            >
              카드
            </div>
            <div
              key="payment_cash"
              className="item"
              onClick={() => setSelectedPayment("cash")}
            >
              현금
            </div>
          </div>
        )}
        {/* 결제수단 - 카드 */}
        {selectedPayment === "card" && <PaymentCard onReset={onReset} />}
        {/* 결제수단 - 현금 */}
        {selectedPayment === "cash" && <PaymentCash onReset={onReset} />}
        {/* 결제한 제품 출력 부분 */}
        <Dispenser />
      </div>
      {/* 현금 보유 현황 */}
      <div className="flex-col">
        <CashList title="자판기 현금 현황" list={reserveCash} />
        <CashList title="투입된 현금 현황" list={insertedCash} />
      </div>
    </div>
  );
};

export default VendingMachinePage;
